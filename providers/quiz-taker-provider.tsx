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
import { useQuiz } from "./all-features-provider";
import { resetRemainingFeatureIds } from "../components/take-quiz/quiz-taker.helpers";

const QuizTakerContext = createContext<QuizTakerState>(null);
const QuizTakerDispatchContext =
  createContext<Dispatch<QuizTakerDispatch> | null>(null);

type QuizTakerProviderProps = {
  children: ReactNode;
};

const QuizTakerProvider = ({ children }: QuizTakerProviderProps) => {
  const { earthId, quiz } = useQuiz();

  const quizTakerReducer = (
    quizTaker: QuizTakerState,
    action: QuizTakerDispatch,
  ): QuizTakerState => {
    switch (action.type) {
      case QuizTakerDispatchType.RESET: {
        const newQuizTaker = { ...quizTaker };

        newQuizTaker.correctIds.clear();
        newQuizTaker.incorrectIds.clear();
        newQuizTaker.remainingIds = resetRemainingFeatureIds(earthId, quiz);
        newQuizTaker.currentId = newQuizTaker.remainingIds
          .values()
          .next().value;

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_CORRECT: {
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.feature.id;

        newQuizTaker.remainingIds.delete(featureId);
        newQuizTaker.correctIds.add(featureId);
        newQuizTaker.currentId = newQuizTaker.remainingIds
          .values()
          .next().value;

        return newQuizTaker;
      }
      case QuizTakerDispatchType.MARK_INCORRECT: {
        const newQuizTaker = { ...quizTaker };
        const featureId = action.featureId || action.feature.id;

        newQuizTaker.remainingIds.delete(featureId);
        newQuizTaker.incorrectIds.add(featureId);
        newQuizTaker.currentId = newQuizTaker.remainingIds
          .values()
          .next().value;

        return newQuizTaker;
      }
    }
  };

  const initialQuizTaker: QuizTakerState = {
    currentId: null,
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
