"use client";

import { useAllFeatures } from "@/components/all-features-provider";
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
  useEffect,
  useMemo,
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
  const { rootId } = useAllFeatures();

  const initialQuizBuilderState = useMemo<QuizBuilderState>(() => {
    return {
      featureAdderSelectedFeatureState: null,
      selectedFeatureId: null,
      renamingFeatureId: null,
      addingFeatureId: rootId,
      openFeatureIds: new Set<string>(),
    };
  }, [rootId]);

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
      const { featureState } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      newQuizBuilderState.featureAdderSelectedFeatureState = featureState;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_SELECTED: {
      const featureId = action.featureId || action.featureState?.featureId;

      const newQuizBuilderState = { ...quizBuilderState };

      newQuizBuilderState.selectedFeatureId = featureId;
      newQuizBuilderState.featureAdderSelectedFeatureState = null;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_ADDING: {
      const { lastFeatureState } = action;

      const featureId = action.featureId || action.featureState.featureId;

      const newQuizBuilderState = { ...quizBuilderState };

      if (lastFeatureState.subfeatureIds.size <= 0) {
        newQuizBuilderState.openFeatureIds.delete(lastFeatureState.featureId);
      }

      newQuizBuilderState.selectedFeatureId = featureId;
      newQuizBuilderState.addingFeatureId = featureId;
      newQuizBuilderState.openFeatureIds.add(featureId);

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_IS_OPEN: {
      const { isOpen } = action;

      const featureId = action.featureId || action.featureState?.featureId;

      const newQuizBuilderState = { ...quizBuilderState };

      if (isOpen) {
        newQuizBuilderState.openFeatureIds.add(featureId);
      } else {
        newQuizBuilderState.openFeatureIds.delete(featureId);
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_RENAMING: {
      const featureId = action.featureId || action.featureState?.featureId;

      const newQuizBuilderState = { ...quizBuilderState };

      newQuizBuilderState.renamingFeatureId = featureId;

      return newQuizBuilderState;
    }
    default: {
      return { ...quizBuilderState };
    }
  }
}
