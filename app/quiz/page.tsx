"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject")?.trim() || "";

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      if (!subject) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject }),
        });

        const data = await response.json();
        const parsedQuiz = Array.isArray(data?.quiz) ? (data.quiz as QuizQuestion[]) : [];

        setQuiz(parsedQuiz);
      } catch {
        setQuiz([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [subject]);

  const currentQuestion = quiz[currentQuestionIndex];

  const actionLabel = useMemo(() => {
    if (!isAnswerSubmitted) {
      return "Check Answer";
    }

    if (currentQuestionIndex === quiz.length - 1) {
      return "Finish Quiz";
    }

    return "Next Question";
  }, [isAnswerSubmitted, currentQuestionIndex, quiz.length]);

  function handleOptionClick(option: string) {
    if (isAnswerSubmitted) {
      return;
    }

    setSelectedOption(option);
  }

  function handleActionClick() {
    if (!currentQuestion) {
      return;
    }

    if (!isAnswerSubmitted) {
      if (!selectedOption) {
        return;
      }

      if (selectedOption === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }

      setIsAnswerSubmitted(true);
      return;
    }

    const isLastQuestion = currentQuestionIndex === quiz.length - 1;

    if (isLastQuestion) {
      setIsFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  }

  if (!subject) {
    return (
      <section className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Subject not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Please return and choose a subject first.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <Loader2 className="mx-auto size-10 animate-spin text-indigo-500" />
          <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-200">Generating your custom quiz...</p>
        </div>
      </section>
    );
  }

  if (!quiz.length) {
    return (
      <section className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">No quiz available</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">We could not generate a quiz for {subject}.</p>
          <Button asChild className="mt-8 rounded-full px-6">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-3xl border border-white bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
        {isFinished ? (
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Quiz Complete</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">You scored {score} out of {quiz.length}!</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Great effort. Keep training recall to lock in long-term memory.</p>
            <Button asChild className="mt-10 rounded-full px-7">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        ) : (
          <>
            <header className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-300">
              <span>Question {currentQuestionIndex + 1} of {quiz.length}</span>
              <span>Subject: {subject}</span>
            </header>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentQuestion.question}
            </h2>

            <div className="mt-7 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = currentQuestion.correctAnswer === option;
                const selectedButWrong = isAnswerSubmitted && isSelected && !isCorrect;
                const showCorrect = isAnswerSubmitted && isCorrect;

                const optionClassName = [
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3",
                  "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5",
                  isSelected && !isAnswerSubmitted ? "ring-2 ring-indigo-500 border-indigo-300 dark:border-indigo-400" : "",
                  showCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/10 dark:text-emerald-200" : "",
                  selectedButWrong ? "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-400/50 dark:bg-rose-500/10 dark:text-rose-200" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={optionClassName}
                  >
                    <span>{option}</span>
                    {showCorrect ? <CheckCircle className="size-5" /> : null}
                    {selectedButWrong ? <XCircle className="size-5" /> : null}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted ? (
              <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-sm leading-relaxed text-indigo-950 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-100">
                <p className="font-semibold">Explanation</p>
                <p className="mt-1">{currentQuestion.explanation}</p>
              </div>
            ) : null}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleActionClick}
                disabled={!isAnswerSubmitted && !selectedOption}
                className="rounded-full px-7"
              >
                {actionLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
