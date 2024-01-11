"use client";

import {
  AllFeatures,
  QuizTakerStateDispatch,
  QuizTakerStateDispatchType,
  QuizTakerState,
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

export default function QuizTakerStateProvider({
  children,
}: {
  children: ReactNode;
}) {
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

export function useQuizTakerState(): {
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
  switch (action.type) {
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
      const { featureId } = action;

      const newQuizTaker = { ...quizTakerState };

      newQuizTaker.remainingFeatureIds.delete(featureId);
      newQuizTaker.correctFeatureIds.add(featureId);

      return newQuizTaker;
    }
    case QuizTakerStateDispatchType.MARK_INCORRECT: {
      const { featureId } = action;

      const newQuizTaker = { ...quizTakerState };

      newQuizTaker.remainingFeatureIds.delete(featureId);
      newQuizTaker.incorrectFeatureIds.add(featureId);

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
    const feature = allFeatures.get(featureId);

    if (feature && "subfeatureIds" in feature) {
      const shuffledSubfeatureIds = [...feature.subfeatureIds];

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

function resetRemainingFeatureIdsOld(
  rootId: string,
  allFeatures: AllFeatures,
): Set<string> {
  const remainingFeatureIds = new Set<string>();
  const rootFeature = allFeatures.get(rootId);
  const queue: string[] =
    rootFeature && "subfeatureIds" in rootFeature
      ? Array.from(rootFeature.subfeatureIds)
      : [];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const feature = allFeatures.get(currentId);

    remainingFeatureIds.add(feature.id);

    if ("subfeatureIds" in feature && feature.subfeatureIds.size > 0) {
      queue.push(...feature.subfeatureIds);
    }
  }

  return remainingFeatureIds;
}

const initialQuizTakerState: QuizTakerState = {
  correctFeatureIds: new Set<string>(),
  incorrectFeatureIds: new Set<string>(),
  remainingFeatureIds: new Set<string>(),
};
