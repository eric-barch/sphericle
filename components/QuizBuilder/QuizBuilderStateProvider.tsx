"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { isParentFeatureState } from "@/helpers/feature-type-guards";
import {
  QuizBuilderState,
  QuizBuilderStateDispatch,
  QuizBuilderStateDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
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
      featureAdderFeatureState: null,
      selectedFeatureId: null,
      openFeatureIds: new Set<string>(),
      addingFeatureIds: new Set<string>([rootId]),
      renamingFeatureIds: new Set<string>(),
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
      const { featureState: activeSearchOption } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!activeSearchOption) {
        return newQuizBuilderState;
      }

      newQuizBuilderState.featureAdderFeatureState = activeSearchOption;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_SELECTED: {
      const { featureState: feature } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      newQuizBuilderState.selectedFeatureId =
        (feature && feature.featureId) || null;
      newQuizBuilderState.featureAdderFeatureState = null;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_IS_ADDING: {
      const { featureState: feature, isAdding } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature || !isParentFeatureState(feature)) {
        return newQuizBuilderState;
      }

      if (isAdding) {
        newQuizBuilderState.addingFeatureIds.add(feature.featureId);
      } else {
        newQuizBuilderState.addingFeatureIds.delete(feature.featureId);
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_IS_OPEN: {
      const { featureState: feature, isOpen } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature || !isParentFeatureState(feature)) {
        return newQuizBuilderState;
      }

      if (isOpen) {
        newQuizBuilderState.openFeatureIds.add(feature.featureId);
      } else {
        newQuizBuilderState.openFeatureIds.delete(feature.featureId);

        if (feature.subfeatureIds.size > 0) {
          newQuizBuilderState.addingFeatureIds.delete(feature.featureId);
        }
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_IS_RENAMING: {
      const { featureState: feature, isRenaming } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature) {
        return newQuizBuilderState;
      }

      if (isRenaming) {
        newQuizBuilderState.renamingFeatureIds.add(feature.featureId);
      } else {
        newQuizBuilderState.renamingFeatureIds.delete(feature.featureId);
      }

      return newQuizBuilderState;
    }
    default: {
      return { ...quizBuilderState };
    }
  }
}
