"use client";

import {
  QuizTakerDispatch,
  QuizTakerDispatchType,
  QuizTakerState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizTakerContext = createContext<QuizTakerState | null>(null);
const QuizTakerDispatchContext =
  createContext<Dispatch<QuizTakerDispatch> | null>(null);

export default function QuizTakerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quizTaker, quizTakerDispatch] = useReducer(
    quizTakerReducer,
    initialQuizTaker,
  );

  return (
    <QuizTakerContext.Provider value={quizTaker}>
      <QuizTakerDispatchContext.Provider value={quizTakerDispatch}>
        {children}
      </QuizTakerDispatchContext.Provider>
    </QuizTakerContext.Provider>
  );
}

export function useQuizTaker(): QuizTakerState {
  return useContext(QuizTakerContext);
}

export function useQuizTakerDispatch(): Dispatch<QuizTakerDispatch> {
  return useContext(QuizTakerDispatchContext);
}

function quizTakerReducer(
  quizTaker: QuizTakerState,
  action: QuizTakerDispatch,
): QuizTakerState {
  switch (action.type) {
    case QuizTakerDispatchType.RESET: {
    }
    case QuizTakerDispatchType.MARK_CORRECT: {
    }
    case QuizTakerDispatchType.MARK_INCORRECT: {
    }
    default: {
      return { ...quizTaker };
    }
  }
}

const initialQuizTaker: QuizTakerState = {
  correctIds: [],
  incorrectIds: [],
  remainingIds: [],
};
