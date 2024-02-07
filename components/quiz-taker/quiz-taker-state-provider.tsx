"use client";

import {
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
import { useAllFeatures } from "../quiz-provider";
import { resetRemainingFeatureIds } from "./quiz-taker.helpers";

const QuizTakerStateContext = createContext<QuizTakerState>(null);
const QuizTakerStateDispatchContext =
  createContext<Dispatch<QuizTakerStateDispatch> | null>(null);

type QuizTakerStateProviderProps = {
  children: ReactNode;
};

const QuizTakerStateProvider = ({ children }: QuizTakerStateProviderProps) => {
  const { rootId, allFeatures } = useAllFeatures();

  const quizTakerStateReducer = (
    quizTakerState: QuizTakerState,
    action: QuizTakerStateDispatch,
  ): QuizTakerState => {
    switch (action.dispatchType) {
      case QuizTakerStateDispatchType.RESET: {
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
        const newQuizTaker = { ...quizTakerState };
        const featureId = action.featureId || action.featureState.featureId;

        newQuizTaker.remainingFeatureIds.delete(featureId);
        newQuizTaker.correctFeatureIds.add(featureId);

        return newQuizTaker;
      }
      case QuizTakerStateDispatchType.MARK_INCORRECT: {
        const newQuizTaker = { ...quizTakerState };
        const featureId = action.featureId || action.featureState.featureId;

        newQuizTaker.remainingFeatureIds.delete(featureId);
        newQuizTaker.incorrectFeatureIds.add(featureId);

        return newQuizTaker;
      }
    }
  };

  const initialQuizTakerState: QuizTakerState = {
    correctFeatureIds: new Set<string>(),
    incorrectFeatureIds: new Set<string>(),
    remainingFeatureIds: new Set<string>(),
  };

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
};

const useQuizTakerState = (): {
  quizTakerState: QuizTakerState;
  quizTakerStateDispatch: Dispatch<QuizTakerStateDispatch>;
} => {
  const quizTakerState = useContext(QuizTakerStateContext);
  const quizTakerStateDispatch = useContext(QuizTakerStateDispatchContext);
  return { quizTakerState, quizTakerStateDispatch };
};

export { QuizTakerStateProvider, useQuizTakerState };
