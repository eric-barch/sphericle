"use client";

import {
  FeatureType,
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizContext = createContext<AllFeatures | null>(null);
const QuizDispatchContext = createContext<Dispatch<AllFeaturesDispatch> | null>(
  null,
);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, quizDispatch] = useReducer(quizReducer, initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={quizDispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

export const rootId = crypto.randomUUID();

export function useQuiz(): AllFeatures {
  return useContext(QuizContext);
}

export function useQuizDispatch(): Dispatch<AllFeaturesDispatch> {
  return useContext(QuizDispatchContext);
}

function quizReducer(
  quiz: AllFeatures,
  action: AllFeaturesDispatch,
): AllFeatures {
  switch (action.type) {
    case AllFeaturesDispatchType.ADD_SUBFEATURE: {
      const parentId = action.subfeature.parentId;
      const sublocationId = action.subfeature.id;

      const newQuiz = { ...quiz };
      const newParent = { ...quiz[parentId] };

      if (newParent.featureType === FeatureType.POINT) {
        throw new Error("newParent must not be of type POINT.");
      }

      if (!newParent.subfeatureIds.includes(sublocationId)) {
        newParent.subfeatureIds = [...newParent.subfeatureIds, sublocationId];
        newQuiz[parentId] = newParent;
      }

      newQuiz[sublocationId] = action.subfeature;

      return getResetQuiz(newQuiz);
    }
    case AllFeaturesDispatchType.SET_SUBFEATURES: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz[action.featureId];

      if (
        newLocation.featureType !== FeatureType.ROOT &&
        newLocation.featureType !== FeatureType.AREA
      ) {
        throw new Error("newLocation must be of type ROOT or AREA.");
      }

      newLocation.subfeatureIds = action.subfeatureIds;

      return getResetQuiz(newQuiz);
    }
    case AllFeaturesDispatchType.RENAME_FEATURE: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz[action.featureId];

      if (newLocation.featureType === FeatureType.ROOT) {
        throw new Error("newLocation must not be of type ROOT.");
      }

      newLocation.userDefinedName = action.name;

      return getResetQuiz(newQuiz);
    }
    case AllFeaturesDispatchType.SET_AREA_IS_OPEN: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz[action.featureId];

      if (newLocation.featureType !== FeatureType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isOpen = action.isOpen;

      if (!action.isOpen) {
        newLocation.isAdding = false;
      }

      return newQuiz;
    }
    case AllFeaturesDispatchType.SET_AREA_IS_ADDING: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz[action.featureId];

      if (newLocation.featureType !== FeatureType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isAdding = action.isAdding;

      if (action.isAdding) {
        newLocation.isOpen = true;
      }

      return newQuiz;
    }
    case AllFeaturesDispatchType.DELETE_FEATURE: {
      const newQuiz = { ...quiz };

      if (!newQuiz[action.featureId]) {
        return newQuiz;
      }

      const newLocation = newQuiz[action.featureId];

      if (
        newLocation.featureType !== FeatureType.AREA &&
        newLocation.featureType !== FeatureType.POINT
      ) {
        throw new Error("newLocation must be of type AREA or POINT.");
      }

      const newParent = newQuiz[newLocation.parentId];

      if (
        newParent.featureType !== FeatureType.ROOT &&
        newParent.featureType !== FeatureType.AREA
      ) {
        throw new Error("newParent must be of type ROOT or AREA.");
      }

      newParent.subfeatureIds = newParent.subfeatureIds.filter(
        (sublocationId) => sublocationId !== action.featureId,
      );

      delete newQuiz[action.featureId];

      return getResetQuiz(newQuiz);
    }
    default: {
      return { ...quiz };
    }
  }
}

const initialQuiz: AllFeatures = {
  [rootId]: {
    id: rootId,
    subfeatureIds: [],
    featureType: FeatureType.ROOT,
  },
};

function getResetQuiz(quiz: AllFeatures): AllFeatures {
  const newQuiz = { ...quiz };

  // newQuiz.correct = 0;
  // newQuiz.incorrect = 0;

  // for (const location of Object.values(newQuiz)) {
  //   if (
  //     location.featureType === FeatureType.AREA ||
  //     location.featureType === FeatureType.POINT {
  //     location.answeredCorrectly = null;
  //   }
  // }

  // const rootLocation = newQuiz[newQuiz.root];

  // if (rootLocation.featureType !== LocationType.ROOT) {
  //   throw new Error("rootLocation must be of type ROOT.");
  // }

  // newQuiz.takerSelected = rootLocation.subfeatureIds[0];
  // newQuiz.isComplete = false;

  return newQuiz;
}
