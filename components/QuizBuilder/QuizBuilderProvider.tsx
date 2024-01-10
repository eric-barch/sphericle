"use client";

import {
  QuizBuilderDispatch,
  QuizBuilderDispatchType,
  QuizBuilderState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizBuilderContext = createContext<QuizBuilderState | null>(null);
const QuizBuilderDispatchContext =
  createContext<Dispatch<QuizBuilderDispatch> | null>(null);

export default function QuizBuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quizBuilder, quizBuilderDispatch] = useReducer(
    quizBuilderReducer,
    initialQuizBuilder,
  );

  return (
    <QuizBuilderContext.Provider value={quizBuilder}>
      <QuizBuilderDispatchContext.Provider value={quizBuilderDispatch}>
        {children}
      </QuizBuilderDispatchContext.Provider>
    </QuizBuilderContext.Provider>
  );
}

export function useQuizBuilder(): QuizBuilderState {
  return useContext(QuizBuilderContext);
}

export function useQuizBuilderDispatch(): Dispatch<QuizBuilderDispatch> {
  return useContext(QuizBuilderDispatchContext);
}

function quizBuilderReducer(
  quizBuilder: QuizBuilderState,
  action: QuizBuilderDispatch,
): QuizBuilderState {
  switch (action.type) {
    case QuizBuilderDispatchType.SET_ACTIVE_OPTION: {
      return { ...quizBuilder, activeOption: action.activeOption };
    }
    case QuizBuilderDispatchType.SET_SELECTED: {
      return { ...quizBuilder, selectedId: action.featureId };
    }
    default: {
      return { ...quizBuilder };
    }
  }
}

const initialQuizBuilder: QuizBuilderState = {
  activeOption: null,
  selectedId: null,
};
