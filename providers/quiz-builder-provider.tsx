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
import { useQuiz } from "./all-features-provider";

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
    action: QuizBuilderDispatch,
  ) => {
    switch (action.type) {
      case QuizBuilderDispatchType.SET_SELECTED: {
        const newQuizBuilder = { ...quizBuilder };
        const featureId = action.featureId || action.feature?.id;

        newQuizBuilder.selectedId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_ADDING: {
        const newQuizBuilder = { ...quizBuilder };
        const { lastAdding: lastFeature } = action;
        const featureId = action.featureId || action.feature.id;

        if (lastFeature?.childIds.size <= 0 && lastFeature?.id !== featureId) {
          newQuizBuilder.openIds.delete(lastFeature.id);
        }

        newQuizBuilder.addingId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_RENAMING: {
        const newQuizBuilder = { ...quizBuilder };
        const featureId = action.featureId || action.feature?.id;

        newQuizBuilder.renamingId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_SEARCH_OPTION: {
        const newQuizBuilder = { ...quizBuilder };
        const { feature: featureState } = action;

        newQuizBuilder.searchResult = featureState;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_IS_OPEN: {
        const newQuizBuilder = { ...quizBuilder };
        const { isOpen } = action;
        const featureId = action.featureId || action.feature?.id;

        if (isOpen) {
          newQuizBuilder.openIds.add(featureId);
        } else {
          newQuizBuilder.openIds.delete(featureId);
        }

        return newQuizBuilder;
      }
    }
  };

  const initialQuizBuilder = {
    selectedId: earthId,
    addingId: earthId,
    renamingId: null,
    searchResult: null,
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
