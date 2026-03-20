"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type WorkspaceQuizProps = {
  subject: string;
};

export default function WorkspaceQuiz({ subject }: WorkspaceQuizProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizState, setQuizState] = useState<'setup' | 'generating' | 'active' | 'finished'>('setup');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  async function handleGenerateQuiz() {
    if (!subject) {
      setErrorMessage("No subject selected.");
      return;
    }

    setQuizState("generating");
    setErrorMessage(null);
    setQuiz([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, questionCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Failed to generate quiz.");
        setQuizState("setup");
        return;
      }

      const parsedQuiz = Array.isArray(data?.quiz) ? (data.quiz as QuizQuestion[]) : [];

      if (!parsedQuiz.length) {
        setErrorMessage("No quiz could be generated for this subject.");
        setQuizState("setup");
        return;
      }

      setQuiz(parsedQuiz);
      setQuizState("active");
    } catch {
      setErrorMessage("We could not generate your quiz. Please try again.");
      setQuizState("setup");
    }
  }

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
      setQuizState("finished");
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  }

  function handleResetQuiz() {
    setQuizState("setup");
    setQuiz([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setErrorMessage(null);
  }

  if (quizState === "setup") {
    const counts = [5, 10, 20];

    return (
      <section className="mx-auto flex min-h-[65vh] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Quiz Mode</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Active Recall</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Test your knowledge on this subject.</p>

          <div className="mx-auto mt-8 inline-flex rounded-2xl border border-slate-200 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
            {counts.map((count) => {
              const isSelected = questionCount === count;

              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={[
                    "rounded-xl px-5 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {count} questions
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <Button onClick={handleGenerateQuiz} size="lg" className="rounded-full px-10 text-base font-semibold">
              Generate Quiz
            </Button>
          </div>

          {errorMessage ? (
            <p className="mt-5 text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p>
          ) : null}
        </div>
      </section>
    );
  }

  if (quizState === "generating") {
    return (
      <section className="mx-auto flex min-h-[65vh] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <Loader2 className="mx-auto size-10 animate-spin text-indigo-500" />
          <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-200">Generating your custom quiz...</p>
        </div>
      </section>
    );
  }

  if (quizState === "active" && (!currentQuestion || !quiz.length)) {
    return (
      <section className="mx-auto flex min-h-[65vh] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">No quiz available</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">We could not generate a quiz for {subject}.</p>
          <Button onClick={handleResetQuiz} className="mt-8 rounded-full px-7">
            Back to Setup
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-4xl items-center justify-center">
      <div className="w-full rounded-3xl border border-white bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
        {quizState === "finished" ? (
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Quiz Complete</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">You scored {score} out of {quiz.length}!</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Great effort. Keep training recall to lock in long-term memory.</p>
            <Button onClick={handleResetQuiz} className="mt-10 rounded-full px-7">
              Generate Another Quiz
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
