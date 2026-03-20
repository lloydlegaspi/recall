import { createAzure } from '@ai-sdk/azure';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  convertToModelMessages,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';
import * as AI from 'ai';
import { supabase } from '@/lib/supabase';

type ChatRequestBody = {
  messages?: Array<ModelMessage | UIMessage>;
  subject?: string;
};

type EmbeddingApiResponse = {
  data?: Array<{
    embedding?: number[];
  }>;
};

type StudyNoteMatch = {
  id: number;
  content: string;
  subject: string;
  topic: string;
  source_file: string | null;
  page_number: number | null;
  similarity: number;
};

type StreamDataLike = {
  append: (value: unknown) => void;
  close: () => void;
};

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function extractMessageText(message: ModelMessage | UIMessage | undefined): string {
  if (!message) {
    return '';
  }

  if ('parts' in message && Array.isArray(message.parts)) {
    const textParts = message.parts
      .filter(
        (part): part is { type: 'text'; text: string } =>
          part.type === 'text' && typeof part.text === 'string'
      )
      .map((part) => part.text);

    return textParts.join('\n').trim();
  }

  if (!('content' in message)) {
    return '';
  }

  const { content } = message;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const textParts: string[] = [];

    for (const part of content) {
      if (typeof part === 'string') {
        textParts.push(part);
        continue;
      }

      if (!part || typeof part !== 'object') {
        continue;
      }

      if ('text' in part && typeof part.text === 'string') {
        textParts.push(part.text);
      }
    }

    return textParts.join('\n').trim();
  }

  return '';
}

const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;

const resourceName = azureEndpoint 
  ? new URL(azureEndpoint).hostname.split('.')[0] 
  : '';

// 2. Initialize Azure using ONLY the resource name
const azure = createAzure({
  resourceName: resourceName,
  apiKey: azureApiKey,
});

const StreamData = (AI as { StreamData?: new () => StreamDataLike }).StreamData;

function createStreamData(): StreamDataLike {
  if (StreamData) {
    return new StreamData();
  }

  return {
    append: () => undefined,
    close: () => undefined,
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!azureEndpoint || !azureApiKey) {
      return Response.json(
        {
          error:
            'Missing AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY environment variables.',
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const messages = body.messages;
    const subject = body.subject?.trim();

    if (!subject) {
      return Response.json(
        { error: 'Request body must include a subject.' },
        { status: 400 }
      );
    }

    if (!messages || messages.length === 0) {
      return Response.json(
        { error: 'Request body must include a non-empty messages array.' },
        { status: 400 }
      );
    }

    const userQuestion = extractMessageText(messages[messages.length - 1]);

    if (!userQuestion) {
      return Response.json(
        { error: 'Could not extract user question from the latest message.' },
        { status: 400 }
      );
    }

    const embeddingsResponse = await fetch(
      `${withTrailingSlash(azureEndpoint)}openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey,
        },
        body: JSON.stringify({ input: userQuestion }),
      }
    );

    if (!embeddingsResponse.ok) {
      const errorText = await embeddingsResponse.text();
      throw new Error(
        `Azure embeddings request failed (${embeddingsResponse.status}): ${errorText}`
      );
    }

    const embeddingsJson =
      (await embeddingsResponse.json()) as EmbeddingApiResponse;
    const embedding = embeddingsJson.data?.[0]?.embedding;

    if (!embedding || embedding.length === 0) {
      throw new Error('Azure embeddings response did not include an embedding vector.');
    }

    const { data: matches, error: matchError } = await supabase.rpc(
      'match_study_notes',
      {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 5,
        filter_subject: subject,
      }
    );

    if (matchError) {
      throw new Error(`Supabase RPC error: ${matchError.message}`);
    }

    const documents = (matches ?? []) as StudyNoteMatch[];
    const streamData = createStreamData();
    const contextPayload = { source: 'context', documents };
    streamData.append(contextPayload);

    const contextString = documents
      .map(
        (doc, index) =>
          `Document ${index + 1}:\nContent: ${doc.content}\nSource File: ${doc.source_file ?? 'Unknown'}\nPage Number: ${doc.page_number ?? 'Unknown'}`
      )
      .join('\n\n');

    const systemPrompt = `You are an expert tutor for the subject "${subject}".

Use the provided study context to answer the student's question.
Rules:
1) Base your answer on the context whenever possible.
2) Cite sources using this format: (source_file p.page_number).
3) If the context is insufficient, explicitly say what is missing.
4) Stay concise, accurate, and instructional.

Study Context:
${contextString || 'No relevant study notes were retrieved.'}`;

    let modelMessages: ModelMessage[];

    if ('parts' in messages[0]) {
      const uiMessages = (messages as UIMessage[]).map(({ id: _id, ...rest }) => rest);
      modelMessages = await convertToModelMessages(uiMessages);
    } else {
      modelMessages = messages as ModelMessage[];
    }

    const result = streamText({
      model: azure.chat('gpt-4o-mini'), 
      system: systemPrompt,
      messages: modelMessages,
      onFinish: () => {
        streamData.close();
      },
    });

    if ('toDataStreamResponse' in result && typeof result.toDataStreamResponse === 'function') {
      return result.toDataStreamResponse({ data: streamData });
    }

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({
          type: 'data-context',
          data: contextPayload,
        });

        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';

    return Response.json({ error: message }, { status: 500 });
  }
}
