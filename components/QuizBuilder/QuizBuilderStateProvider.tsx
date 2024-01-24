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
      activeSearchOption: null,
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
  switch (action.type) {
    case QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION: {
      const { activeSearchOption } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!activeSearchOption) {
        return newQuizBuilderState;
      }

      newQuizBuilderState.activeSearchOption = activeSearchOption;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_SELECTED_FEATURE: {
      const { feature } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      newQuizBuilderState.selectedFeatureId = (feature && feature.id) || null;
      newQuizBuilderState.activeSearchOption = null;

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING: {
      const { feature, isAdding } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature || !isParentFeatureState(feature)) {
        return newQuizBuilderState;
      }

      if (isAdding) {
        newQuizBuilderState.addingFeatureIds.add(feature.id);
      } else {
        newQuizBuilderState.addingFeatureIds.delete(feature.id);
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_FEATURE_IS_OPEN: {
      const { feature, isOpen } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature || !isParentFeatureState(feature)) {
        return newQuizBuilderState;
      }

      if (isOpen) {
        newQuizBuilderState.openFeatureIds.add(feature.id);
      } else {
        newQuizBuilderState.openFeatureIds.delete(feature.id);

        if (feature.subfeatureIds.size > 0) {
          newQuizBuilderState.addingFeatureIds.delete(feature.id);
        }
      }

      return newQuizBuilderState;
    }
    case QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING: {
      const { feature, isRenaming } = action;

      const newQuizBuilderState = { ...quizBuilderState };

      if (!feature) {
        return newQuizBuilderState;
      }

      if (isRenaming) {
        newQuizBuilderState.renamingFeatureIds.add(feature.id);
      } else {
        newQuizBuilderState.renamingFeatureIds.delete(feature.id);
      }

      return newQuizBuilderState;
    }
    default: {
      return { ...quizBuilderState };
    }
  }
}
