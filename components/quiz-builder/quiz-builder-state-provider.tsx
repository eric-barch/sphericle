"use client";

import {
  QuizBuilderState,
  QuizBuilderStateDispatch,
  QuizBuilderStateDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { useAllFeatures } from "../quiz-provider/all-features-provider";

const QuizBuilderStateContext = createContext<QuizBuilderState>(null);
const QuizBuilderStateDispatchContext =
  createContext<Dispatch<QuizBuilderStateDispatch>>(null);

type QuizBuilderStateProviderProps = {
  children: ReactNode;
};

const QuizBuilderStateProvider = ({
  children,
}: QuizBuilderStateProviderProps) => {
  const { rootId } = useAllFeatures();

  const quizBuilderStateReducer = (
    quizBuilderState: QuizBuilderState,
    action: QuizBuilderStateDispatch,
  ) => {
    switch (action.dispatchType) {
      case QuizBuilderStateDispatchType.SET_SELECTED: {
        const newQuizBuilderState = { ...quizBuilderState };
        const featureId = action.featureId || action.featureState?.featureId;

        newQuizBuilderState.selectedFeatureId = featureId;

        return newQuizBuilderState;
      }
      case QuizBuilderStateDispatchType.SET_ADDING: {
        const newQuizBuilderState = { ...quizBuilderState };
        const { lastFeatureState } = action;
        const featureId = action.featureId || action.featureState.featureId;

        if (
          lastFeatureState?.subfeatureIds.size <= 0 &&
          lastFeatureState?.featureId !== featureId
        ) {
          newQuizBuilderState.openFeatureIds.delete(lastFeatureState.featureId);
        }

        newQuizBuilderState.addingFeatureId = featureId;

        return newQuizBuilderState;
      }
      case QuizBuilderStateDispatchType.SET_RENAMING: {
        const newQuizBuilderState = { ...quizBuilderState };
        const featureId = action.featureId || action.featureState?.featureId;

        newQuizBuilderState.renamingFeatureId = featureId;

        return newQuizBuilderState;
      }
      case QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED: {
        const newQuizBuilderState = { ...quizBuilderState };
        const { featureState } = action;

        newQuizBuilderState.featureAdderFeatureState = featureState;

        return newQuizBuilderState;
      }
      case QuizBuilderStateDispatchType.SET_IS_OPEN: {
        const newQuizBuilderState = { ...quizBuilderState };
        const { isOpen } = action;
        const featureId = action.featureId || action.featureState?.featureId;

        if (isOpen) {
          newQuizBuilderState.openFeatureIds.add(featureId);
        } else {
          newQuizBuilderState.openFeatureIds.delete(featureId);
        }

        return newQuizBuilderState;
      }
    }
  };

  const initialQuizBuilderState = {
    selectedFeatureId: rootId,
    addingFeatureId: rootId,
    renamingFeatureId: null,
    featureAdderFeatureState: null,
    openFeatureIds: new Set<string>(),
  };

  const [quizBuilderState, quizBuilderStateDispatch] = useReducer(
    quizBuilderStateReducer,
    initialQuizBuilderState,
  );

  return (
    <QuizBuilderStateContext.Provider value={quizBuilderState}>
      <QuizBuilderStateDispatchContext.Provider
        value={quizBuilderStateDispatch}
      >
        {children}
      </QuizBuilderStateDispatchContext.Provider>
    </QuizBuilderStateContext.Provider>
  );
};

const useQuizBuilderState = (): {
  quizBuilderState: QuizBuilderState;
  quizBuilderStateDispatch: Dispatch<QuizBuilderStateDispatch>;
} => {
  const quizBuilderState = useContext(QuizBuilderStateContext);
  const quizBuilderStateDispatch = useContext(QuizBuilderStateDispatchContext);
  return { quizBuilderState, quizBuilderStateDispatch };
};

export { QuizBuilderStateProvider, useQuizBuilderState };
