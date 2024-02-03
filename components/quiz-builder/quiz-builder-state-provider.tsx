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
  const initialQuizBuilderState = {
    featureAdderSelectedFeatureState: null,
    selectedFeatureId: null,
    renamingFeatureId: null,
    addingFeatureId: null,
    openFeatureIds: new Set<string>(),
  };

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
) {
  switch (action.dispatchType) {
    case QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED: {
      const newQuizBuilderState = { ...quizBuilderState };

      const { featureState } = action;

      newQuizBuilderState.featureAdderSelectedFeatureState = featureState;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_SELECTED: {
      const newQuizBuilderState = { ...quizBuilderState };

      const featureId = action.featureId || action.featureState?.featureId;

      newQuizBuilderState.selectedFeatureId = featureId;
      // newQuizBuilderState.featureAdderSelectedFeatureState = null;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_RENAMING: {
      const newQuizBuilderState = { ...quizBuilderState };

      const featureId = action.featureId || action.featureState?.featureId;

      newQuizBuilderState.renamingFeatureId = featureId;

      return newQuizBuilderState;
    }
    default: {
      return { ...quizBuilderState };
    }
    case QuizBuilderStateDispatchType.SET_IS_OPEN: {
      const newQuizBuilderState = { ...quizBuilderState };

      const { isOpen } = action;
      const featureId = action.featureId || action.featureState?.featureId;

      if (isOpen) {
        newQuizBuilderState.openFeatureIds.add(featureId);
      } else {
        newQuizBuilderState.openFeatureIds.delete(featureId);
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_ADDING: {
      const newQuizBuilderState = { ...quizBuilderState };

      const { lastFeatureState } = action;
      const featureId = action.featureId || action.featureState.featureId;

      newQuizBuilderState.selectedFeatureId = featureId;
      newQuizBuilderState.addingFeatureId = featureId;
      newQuizBuilderState.openFeatureIds.add(featureId);

      if (lastFeatureState?.subfeatureIds.size <= 0) {
        newQuizBuilderState.openFeatureIds.delete(lastFeatureState.featureId);
      }

      return newQuizBuilderState;
    }
  }
}
