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
    case QuizBuilderStateDispatchType.SET_AREA_IS_ADDING: {
      const { featureId, isAdding } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (isAdding) {
        newQuizBuilderState.addingAreas.add(featureId);
        newQuizBuilderState.openAreas.add(featureId);
      } else {
        newQuizBuilderState.addingAreas.delete(featureId);
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_AREA_IS_OPEN: {
      const { featureId, isOpen } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (isOpen) {
        newQuizBuilderState.openAreas.add(featureId);
      } else {
        newQuizBuilderState.openAreas.delete(featureId);
        newQuizBuilderState.addingAreas.delete(featureId);
      }

      return newQuizBuilderState;
    }
    default: {
      return { ...quizBuilderState };
    }
  }
}

const initialQuizBuilderState: QuizBuilderState = {
  activeSearchOption: null,
  selectedFeatureId: null,
  openAreas: new Set<string>(),
  addingAreas: new Set<string>(),
};
