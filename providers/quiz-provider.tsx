"use client";

import { isParent, isChild } from "@/helpers";
import {
  QuizState,
  QuizDispatch,
  QuizDispatchType,
  Feature,
  FeatureType,
  EarthState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const earthId = crypto.randomUUID();

const QuizContext = createContext<QuizState>(null);
const QuizDispatchContext = createContext<Dispatch<QuizDispatch>>(null);

type QuizProviderProps = {
  children: ReactNode;
};

const QuizProvider = ({ children }: QuizProviderProps) => {
  const quizReducer = (quiz: QuizState, dispatch: QuizDispatch): QuizState => {
    switch (dispatch.type) {
      case QuizDispatchType.ADD_CHILD: {
        const newQuiz = new Map(quiz);

        const parentId = dispatch.parentId || dispatch.parent.id;
        const { child } = dispatch;

        const childId = child.id;
        const newParent = newQuiz.get(parentId);

        if (!isParent(newParent)) {
          console.error("newParent must be a ParentFeature.");
          return quiz;
        }

        newParent.childIds.add(childId);
        newQuiz.set(parentId, newParent);
        newQuiz.set(childId, child);

        return newQuiz;
      }
      case QuizDispatchType.SET_CHILDREN: {
        const newQuiz = new Map(quiz);

        const parentId = dispatch.parentId || dispatch.parent.id;
        const { childIds } = dispatch;

        const newParent = newQuiz.get(parentId);

        if (!isParent(newParent)) {
          console.error("newParent must be a ParentFeature.");
          return quiz;
        }

        newParent.childIds = new Set(childIds);

        return newQuiz;
      }
      case QuizDispatchType.RENAME: {
        const newQuiz = new Map(quiz);

        const featureId = dispatch.featureId || dispatch.feature.id;
        const { name } = dispatch;

        const newFeature = newQuiz.get(featureId);

        if (!isChild(newFeature)) {
          console.error("newFeature must be a ChildFeature.");
          return quiz;
        }

        newFeature.userDefinedName = name;

        return newQuiz;
      }
      case QuizDispatchType.DELETE: {
        const newQuiz = new Map(quiz);

        const featureId = dispatch.featureId || dispatch.feature.id;

        const newFeature = newQuiz.get(featureId);

        if (!isChild(newFeature)) {
          console.error("newFeature must be a ChildFeature.");
          return quiz;
        }

        const newParent = newQuiz.get(newFeature.parentId);

        if (!isParent(newParent)) {
          console.error("newParent must be a ParentFeature.");
          return quiz;
        }

        newParent.childIds.delete(featureId);
        newQuiz.delete(featureId);

        return newQuiz;
      }
    }
  };

  const initialEarth: EarthState = {
    id: earthId,
    childIds: new Set<string>(),
    type: FeatureType.EARTH,
  };

  const initialQuiz: QuizState = new Map<string, Feature>([
    [earthId, initialEarth],
  ]);

  const [quiz, quizDispatch] = useReducer(quizReducer, initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={quizDispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
};

const useQuiz = (): {
  earthId: string;
  quiz: QuizState;
  quizDispatch: Dispatch<QuizDispatch>;
} => {
  const quiz = useContext(QuizContext);
  const quizDispatch = useContext(QuizDispatchContext);
  return { earthId, quiz, quizDispatch };
};

export { QuizProvider, useQuiz };
