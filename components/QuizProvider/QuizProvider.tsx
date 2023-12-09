"use client";

import { LocationType, Quiz, QuizDispatch } from "@/types";
import { Dispatch, ReactNode, createContext, useReducer } from "react";

const QuizContext = createContext<Quiz | null>(null);
const QuizDispatchContext = createContext<Dispatch<QuizDispatch> | null>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, quizDispatch] = useReducer(quizReducer, initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={quizDispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

function quizReducer(quiz: Quiz, action: QuizDispatch): Quiz {
  return { ...quiz };
}

const rootId = crypto.randomUUID();

const initialQuiz: Quiz = {
  locations: {
    [rootId]: {
      id: rootId,
      sublocationIds: [],
      shortName: "Root",
      locationType: LocationType.ROOT,
    },
  },
  selectedBuilderLocationId: null,
  selectedTakerLocationId: null,
};
