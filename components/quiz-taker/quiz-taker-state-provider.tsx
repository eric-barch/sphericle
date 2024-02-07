"use client";

import { isParentFeatureState } from "@/helpers/state";
import {
  AllFeatures,
  QuizTakerState,
  QuizTakerStateDispatch,
  QuizTakerStateDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizTakerStateContext = createContext<QuizTakerState>(null);
const QuizTakerStateDispatchContext =
  createContext<Dispatch<QuizTakerStateDispatch> | null>(null);

function QuizTakerStateProvider({ children }: { children: ReactNode }) {
  const [quizTakerState, quizTakerStateDispatch] = useReducer(
    quizTakerStateReducer,
    initialQuizTakerState,
  );

  return (
    <QuizTakerStateContext.Provider value={quizTakerState}>
      <QuizTakerStateDispatchContext.Provider value={quizTakerStateDispatch}>
        {children}
      </QuizTakerStateDispatchContext.Provider>
    </QuizTakerStateContext.Provider>
  );
}

function useQuizTakerState(): {
  quizTakerState: QuizTakerState;
  quizTakerStateDispatch: Dispatch<QuizTakerStateDispatch>;
} {
  const quizTakerState = useContext(QuizTakerStateContext);
  const quizTakerStateDispatch = useContext(QuizTakerStateDispatchContext);
  return { quizTakerState, quizTakerStateDispatch };
}

function quizTakerStateReducer(
  quizTakerState: QuizTakerState,
  action: QuizTakerStateDispatch,
): QuizTakerState {
  switch (action.dispatchType) {
    case QuizTakerStateDispatchType.RESET: {
      const { rootId, allFeatures } = action;

      const newQuizTaker = { ...quizTakerState };

      newQuizTaker.correctFeatureIds.clear();
      newQuizTaker.incorrectFeatureIds.clear();
      newQuizTaker.remainingFeatureIds = resetRemainingFeatureIds(
        rootId,
        allFeatures,
      );

      return newQuizTaker;
    }
    case QuizTakerStateDispatchType.MARK_CORRECT: {
      const { featureState } = action;

      const newQuizTaker = { ...quizTakerState };

      newQuizTaker.remainingFeatureIds.delete(featureState.featureId);
      newQuizTaker.correctFeatureIds.add(featureState.featureId);

      return newQuizTaker;
    }
    case QuizTakerStateDispatchType.MARK_INCORRECT: {
      const { featureState } = action;

      const newQuizTaker = { ...quizTakerState };

      newQuizTaker.remainingFeatureIds.delete(featureState.featureId);
      newQuizTaker.incorrectFeatureIds.add(featureState.featureId);

      return newQuizTaker;
    }
    default: {
      return { ...quizTakerState };
    }
  }
}

function resetRemainingFeatureIds(
  rootId: string,
  allFeatures: AllFeatures,
): Set<string> {
  const remainingFeatureIds = new Set<string>();

  function addDirectChildren(featureId: string) {
    const featureState = allFeatures.get(featureId);

    if (featureState && isParentFeatureState(featureState)) {
      const shuffledSubfeatureIds = [...featureState.subfeatureIds];

      // Fisher-Yates shuffle
      for (let i = shuffledSubfeatureIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSubfeatureIds[i], shuffledSubfeatureIds[j]] = [
          shuffledSubfeatureIds[j],
          shuffledSubfeatureIds[i],
        ];
      }

      shuffledSubfeatureIds.forEach((subfeatureId) => {
        remainingFeatureIds.add(subfeatureId);
      });

      shuffledSubfeatureIds.forEach((subfeatureId) => {
        addDirectChildren(subfeatureId);
      });
    }
  }

  addDirectChildren(rootId);

  return remainingFeatureIds;
}

const initialQuizTakerState: QuizTakerState = {
  correctFeatureIds: new Set<string>(),
  incorrectFeatureIds: new Set<string>(),
  remainingFeatureIds: new Set<string>(),
};

export { QuizTakerStateProvider, useQuizTakerState };
