import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { emptyAnswers, QuizAnswers } from "../types/domain";

interface QuizContextValue {
  answers: QuizAnswers;
  updateAnswers: (patch: Partial<QuizAnswers>) => void;
  reset: () => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);

  const updateAnswers = useCallback((patch: Partial<QuizAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setAnswers(emptyAnswers), []);

  const value = useMemo(() => ({ answers, updateAnswers, reset }), [answers, updateAnswers, reset]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
