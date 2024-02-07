"use client";

import {
  QuizTakerState,
  QuizTakerDispatch,
  QuizTakerDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { useAllFeatures } from ".";
import { resetRemainingFeatureIds } from "../components/quiz-taker/quiz-taker.helpers";

const QuizTakerContext = createContext<QuizTakerState>(null);
const QuizTakerDispatchContext =
  createContext<Dispatch<QuizTakerDispatch> | null>(null);

type QuizTakerProviderProps = {
  children: ReactNode;
};

const QuizTakerProvider = ({ children }: QuizTakerProviderProps) => {
  const { rootId, allFeatures } = useAllFeatures();

  const quizTakerReducer = (
    quizTaker: QuizTakerState,
    action: QuizTakerDispatch,
  ): QuizTakerState => {
    switch (action.dispatchType) {
      case QuizTakerDispatchType.RESET: {
        const newQuizTaker = { ...quizTaker };

        newQuizTaker.correctFeatureIds.clear();
        newQuizTaker.incorrectFeatureIds.clear();
        newQuizTaker.remainingFeatureIds = resetRemainingFeatureIds(
          rootId,
          allFeatures,
        );

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_CORRECT: {
        console.log("received dispatch");
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.featureState.featureId;

        newQuizTaker.remainingFeatureIds.delete(featureId);
        newQuizTaker.correctFeatureIds.add(featureId);

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_INCORRECT: {
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.featureState.featureId;

        newQuizTaker.remainingFeatureIds.delete(featureId);
        newQuizTaker.incorrectFeatureIds.add(featureId);

        return newQuizTaker;
      }
    }
  };

  const initialQuizTaker: QuizTakerState = {
    correctFeatureIds: new Set<string>(),
    incorrectFeatureIds: new Set<string>(),
    remainingFeatureIds: new Set<string>(),
  };

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
};

const useQuizTaker = (): {
  quizTaker: QuizTakerState;
  quizTakerDispatch: Dispatch<QuizTakerDispatch>;
} => {
  const quizTaker = useContext(QuizTakerContext);
  const quizTakerDispatch = useContext(QuizTakerDispatchContext);
  return {
    quizTaker,
    quizTakerDispatch,
  };
};

export { QuizTakerProvider, useQuizTaker };
