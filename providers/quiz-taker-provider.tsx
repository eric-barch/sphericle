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
    switch (action.type) {
      case QuizTakerDispatchType.RESET: {
        const newQuizTaker = { ...quizTaker };

        newQuizTaker.correctIds.clear();
        newQuizTaker.incorrectIds.clear();
        newQuizTaker.remainingIds = resetRemainingFeatureIds(
          rootId,
          allFeatures,
        );

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_CORRECT: {
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.feature.id;

        newQuizTaker.remainingIds.delete(featureId);
        newQuizTaker.correctIds.add(featureId);

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_INCORRECT: {
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.feature.id;

        newQuizTaker.remainingIds.delete(featureId);
        newQuizTaker.incorrectIds.add(featureId);

        return newQuizTaker;
      }
    }
  };

  const initialQuizTaker: QuizTakerState = {
    correctIds: new Set<string>(),
    incorrectIds: new Set<string>(),
    remainingIds: new Set<string>(),
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
