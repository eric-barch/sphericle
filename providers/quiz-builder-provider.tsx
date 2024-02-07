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
import { useAllFeatures } from "./all-features-provider";

const QuizBuilderContext = createContext<QuizBuilderState>(null);
const QuizBuilderDispatchContext =
  createContext<Dispatch<QuizBuilderDispatch>>(null);

type QuizBuilderProviderProps = {
  children: ReactNode;
};

const QuizBuilderProvider = ({ children }: QuizBuilderProviderProps) => {
  const { rootId } = useAllFeatures();

  const quizBuilderReducer = (
    quizBuilder: QuizBuilderState,
    action: QuizBuilderDispatch,
  ) => {
    switch (action.dispatchType) {
      case QuizBuilderDispatchType.SET_SELECTED: {
        const newQuizBuilder = { ...quizBuilder };
        const featureId = action.featureId || action.featureState?.featureId;

        newQuizBuilder.selectedFeatureId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_ADDING: {
        const newQuizBuilder = { ...quizBuilder };
        const { lastFeatureState } = action;
        const featureId = action.featureId || action.featureState.featureId;

        if (
          lastFeatureState?.subfeatureIds.size <= 0 &&
          lastFeatureState?.featureId !== featureId
        ) {
          newQuizBuilder.openFeatureIds.delete(lastFeatureState.featureId);
        }

        newQuizBuilder.addingFeatureId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_RENAMING: {
        const newQuizBuilder = { ...quizBuilder };
        const featureId = action.featureId || action.featureState?.featureId;

        newQuizBuilder.renamingFeatureId = featureId;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_FEATURE_ADDER_SELECTED: {
        const newQuizBuilder = { ...quizBuilder };
        const { featureState } = action;

        newQuizBuilder.featureAdderFeatureState = featureState;

        return newQuizBuilder;
      }
      case QuizBuilderDispatchType.SET_IS_OPEN: {
        const newQuizBuilder = { ...quizBuilder };
        const { isOpen } = action;
        const featureId = action.featureId || action.featureState?.featureId;

        if (isOpen) {
          newQuizBuilder.openFeatureIds.add(featureId);
        } else {
          newQuizBuilder.openFeatureIds.delete(featureId);
        }

        return newQuizBuilder;
      }
    }
  };

  const initialQuizBuilder = {
    selectedFeatureId: rootId,
    addingFeatureId: rootId,
    renamingFeatureId: null,
    featureAdderFeatureState: null,
    openFeatureIds: new Set<string>(),
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
