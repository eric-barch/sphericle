"use client";

import {
  AllFeatures,
  AreaState,
  PointState,
  QuizTakerDispatch,
  QuizTakerDispatchType,
  QuizTakerState,
  RootState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizTakerContext = createContext<QuizTakerState>(null);
const QuizTakerDispatchContext =
  createContext<Dispatch<QuizTakerDispatch> | null>(null);

export default function QuizTakerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quizTaker, quizTakerDispatch] = useReducer(
    quizTakerReducer,
    initialQuizTaker,
  );

  return (
    <QuizTakerContext.Provider value={quizTaker}>
      <QuizTakerDispatchContext.Provider value={quizTakerDispatch}>
        {children}
      </QuizTakerDispatchContext.Provider>
    </QuizTakerContext.Provider>
  );
}

export function useQuizTakerState(): QuizTakerState {
  return useContext(QuizTakerContext);
}

export function useQuizTakerDispatch(): Dispatch<QuizTakerDispatch> {
  return useContext(QuizTakerDispatchContext);
}

function quizTakerReducer(
  quizTaker: QuizTakerState,
  action: QuizTakerDispatch,
): QuizTakerState {
  switch (action.type) {
    case QuizTakerDispatchType.RESET: {
      const newQuizTaker = { ...quizTaker };
      newQuizTaker.orderedIds = orderFeatureIds(action.allFeatures);
      console.log("newQuizTaker", newQuizTaker);
      return newQuizTaker;
    }
    case QuizTakerDispatchType.MARK_CORRECT: {
      const newQuizTaker = { ...quizTaker };
      newQuizTaker.currentIndex++;
      return newQuizTaker;
    }
    case QuizTakerDispatchType.MARK_INCORRECT: {
      const newQuizTaker = { ...quizTaker };
      newQuizTaker.currentIndex++;
      return newQuizTaker;
    }
    default: {
      return { ...quizTaker };
    }
  }
}

function orderFeatureIds(allFeatures: AllFeatures): string[] {
  const result: string[] = [];
  const queue: string[] = [allFeatures.rootId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const feature = allFeatures.features[currentId];

    if (!feature) continue;

    if (feature.id !== allFeatures.rootId) {
      result.push(feature.id);
    }

    if ("subfeatureIds" in feature && feature.subfeatureIds.length > 0) {
      queue.push(...feature.subfeatureIds);
    }
  }

  return result;
}

const initialQuizTaker: QuizTakerState = {
  orderedIds: [],
  currentIndex: 0,
  correctIds: new Set<string>(),
  incorrectIds: new Set<string>(),
};
