"use client";

import {
  QuizBuilderState,
  QuizBuilderStateDispatch,
  QuizBuilderStateDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizBuilderStateContext = createContext<QuizBuilderState | null>(null);
const QuizBuilderStateDispatchContext =
  createContext<Dispatch<QuizBuilderStateDispatch> | null>(null);

export default function QuizBuilderStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quizBuilderState, quizBuilderStateDispatch] = useReducer(
    quizBuilderStateReducer,
    initialQuizBuilderState,
  );

  return (
    <QuizBuilderStateContext.Provider value={quizBuilderState}>
      <QuizBuilderStateDispatchContext.Provider
        value={quizBuilderStateDispatch}
      >
        {children}
      </QuizBuilderStateDispatchContext.Provider>
    </QuizBuilderStateContext.Provider>
  );
}

export function useQuizBuilderState(): {
  quizBuilderState: QuizBuilderState;
  quizBuilderStateDispatch: Dispatch<QuizBuilderStateDispatch>;
} {
  const quizBuilderState = useContext(QuizBuilderStateContext);
  const quizBuilderStateDispatch = useContext(QuizBuilderStateDispatchContext);
  return { quizBuilderState, quizBuilderStateDispatch };
}

function quizBuilderStateReducer(
  quizBuilderState: QuizBuilderState,
  action: QuizBuilderStateDispatch,
): QuizBuilderState {
  switch (action.type) {
    case QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION: {
      const { activeSearchOption } = action;

      return {
        ...quizBuilderState,
        activeSearchOption,
      };
    }
    case QuizBuilderStateDispatchType.SET_SELECTED_FEATURE: {
      const { selectedFeatureId } = action;

      return {
        ...quizBuilderState,
        selectedFeatureId,
      };
    }
    default: {
      return { ...quizBuilderState };
    }
  }
}

const initialQuizBuilderState: QuizBuilderState = {
  activeSearchOption: null,
  selectedFeatureId: null,
};
