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

interface QuizBuilderStateProviderProps {
  rootId: string;
  children: ReactNode;
}

function QuizBuilderStateProvider({
  rootId,
  children,
}: QuizBuilderStateProviderProps) {
  const initialQuizBuilderState = {
    featureAdderFeatureState: null,
    selectedFeatureId: rootId,
    renamingFeatureId: null,
    addingFeatureId: rootId,
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

function useQuizBuilderState(): {
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

      newQuizBuilderState.featureAdderFeatureState = featureState;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_SELECTED: {
      const newQuizBuilderState = { ...quizBuilderState };
      const featureId = action.featureId || action.featureState?.featureId;

      newQuizBuilderState.selectedFeatureId = featureId;

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

      if (
        lastFeatureState?.subfeatureIds.size <= 0 &&
        lastFeatureState?.featureId !== featureId
      ) {
        newQuizBuilderState.openFeatureIds.delete(lastFeatureState.featureId);
      }

      newQuizBuilderState.addingFeatureId = featureId;

      return newQuizBuilderState;
    }
  }
}

export { QuizBuilderStateProvider, useQuizBuilderState };
