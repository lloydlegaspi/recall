import { createAzure } from '@ai-sdk/azure';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const azureApiKey = process.env.AZURE_OPENAI_API_KEY || '';
const resourceName = azureEndpoint ? new URL(azureEndpoint).hostname.split('.')[0] : '';

const azure = createAzure({
  resourceName: resourceName,
  apiKey: azureApiKey,
});

type QuizRequestBody = {
  subject?: string;
  questionCount?: number;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as QuizRequestBody;
    const subject = body.subject?.trim();
    const count = body.questionCount || 5;

    if (!subject) {
      return Response.json(
        { error: 'Request body must include a subject.' },
        { status: 400 }
      );
    }

    // Fetch notes for context
    const { data: notes, error } = await supabase
      .from('study_notes')
      .select('content')
      .eq('subject', subject)
      .limit(15);

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    const contextString = (notes ?? [])
      .map((note) => note.content)
      .filter((content): content is string => typeof content === 'string' && content.trim().length > 0)
      .join('\n\n');

    // Structured AI Generation using v6 Syntax
    const result = await generateText({
      model: azure.chat('gpt-4o-mini'),
      output: Output.object({
        schema: z.object({
          quiz: z.array(
            z.object({
              question: z.string(),
              options: z.array(z.string()).length(4),
              correctAnswer: z.string(),
              explanation: z.string(),
            })
          ),
        }),
      }),
      prompt: `You are a strict professor creating a challenging multiple-choice quiz for the subject "${subject}".

Use ONLY the context below.
    Generate exactly ${count} challenging multiple-choice questions.
For each question:
- Provide exactly 4 options.
- Set correctAnswer to exactly match one of the 4 options text.
- Provide a short explanation grounded in the context.

Context:
${contextString || 'No notes found for this subject.'}`,
    });

    // Return the structured object correctly
    return Response.json(result.output);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return Response.json({ error: message }, { status: 500 });
  }
}