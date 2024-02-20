"use client";

import {
  QuizBuilderState,
  QuizBuilderDispatch,
  QuizBuilderDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { useQuiz } from "./quiz-provider";

const QuizBuilderContext = createContext<QuizBuilderState>(null);
const QuizBuilderDispatchContext =
  createContext<Dispatch<QuizBuilderDispatch>>(null);

type QuizBuilderProviderProps = {
  children: ReactNode;
};

const QuizBuilderProvider = ({ children }: QuizBuilderProviderProps) => {
  const { earthId } = useQuiz();

  const quizBuilderReducer = (
    quizBuilder: QuizBuilderState,
    dispatch: QuizBuilderDispatch,
  ) => {
    switch (dispatch.type) {
      case QuizBuilderDispatchType.SET_SEARCH_OPTION: {
        const newQuizBuilder = { ...quizBuilder };
        const { feature: featureState } = dispatch;

        newQuizBuilder.searchOption = featureState;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_SELECTED: {
        const newQuizBuilder = { ...quizBuilder };

        const featureId = dispatch.featureId || dispatch.feature?.id;

        newQuizBuilder.selectedId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_ADDING: {
        const newQuizBuilder = { ...quizBuilder };

        const nextAddingId = dispatch.nextAddingId || dispatch.nextAdding.id;
        const { lastAdding } = dispatch;

        if (lastAdding?.childIds.size <= 0 && lastAdding?.id !== nextAddingId) {
          newQuizBuilder.openIds.delete(lastAdding.id);
        }

        newQuizBuilder.addingId = nextAddingId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_RENAMING: {
        const newQuizBuilder = { ...quizBuilder };

        const featureId = dispatch.featureId || dispatch.feature?.id;

        newQuizBuilder.renamingId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_IS_OPEN: {
        const newQuizBuilder = { ...quizBuilder };

        const featureId = dispatch.featureId || dispatch.feature?.id;
        const { isOpen } = dispatch;

        if (isOpen) {
          newQuizBuilder.openIds.add(featureId);
        } else {
          newQuizBuilder.openIds.delete(featureId);
        }

        return newQuizBuilder;
      }
    }
  };

  const initialQuizBuilder: QuizBuilderState = {
    searchOption: null,
    selectedId: earthId,
    addingId: earthId,
    renamingId: null,
    openIds: new Set<string>(),
  };

  const [quizBuilder, quizBuilderDispatch] = useReducer(
    quizBuilderReducer,
    initialQuizBuilder,
  );

  return (
    <QuizBuilderContext.Provider value={quizBuilder}>
      <QuizBuilderDispatchContext.Provider value={quizBuilderDispatch}>
        {children}
      </QuizBuilderDispatchContext.Provider>
    </QuizBuilderContext.Provider>
  );
};

const useQuizBuilder = (): {
  quizBuilder: QuizBuilderState;
  quizBuilderDispatch: Dispatch<QuizBuilderDispatch>;
} => {
  const quizBuilder = useContext(QuizBuilderContext);
  const quizBuilderDispatch = useContext(QuizBuilderDispatchContext);
  return {
    quizBuilder,
    quizBuilderDispatch,
  };
};

export { QuizBuilderProvider, useQuizBuilder };
