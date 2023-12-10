"use client";

import { LocationType, Quiz, QuizDispatch, QuizDispatchType } from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

const QuizContext = createContext<Quiz | null>(null);
const QuizDispatchContext = createContext<Dispatch<QuizDispatch> | null>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, quizDispatch] = useReducer(quizReducer, initialQuiz);

  useEffect(() => {
    console.log("quiz", quiz);
  }, [quiz]);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={quizDispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

export const rootId = crypto.randomUUID();
const dummyAreaId = crypto.randomUUID();

export function useQuiz(): Quiz {
  const quiz = useContext(QuizContext);

  if (!quiz) {
    throw new Error("quiz is falsy.");
  }

  return quiz;
}

export function useQuizDispatch(): Dispatch<QuizDispatch> {
  const quizDispatch = useContext(QuizDispatchContext);

  if (!quizDispatch) {
    throw new Error("quizDispatch is falsy.");
  }

  return quizDispatch;
}

function quizReducer(quiz: Quiz, action: QuizDispatch): Quiz {
  switch (action.type) {
    case QuizDispatchType.ADD_SUBLOCATION: {
      const parentId = action.sublocation.parentId;
      const sublocationId = action.sublocation.id;

      const newQuiz = { ...quiz };
      const newParent = { ...quiz.locations[parentId] };

      if (newParent.locationType === LocationType.POINT) {
        throw new Error("newParent must not be of type POINT.");
      }

      // avoid duplicate entries
      if (!newParent.sublocationIds.includes(sublocationId)) {
        newParent.sublocationIds = [...newParent.sublocationIds, sublocationId];
        newQuiz.locations[parentId] = newParent;
      }

      newQuiz.locations[sublocationId] = action.sublocation;

      return newQuiz;
    }
    case QuizDispatchType.RENAME_LOCATION: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType === LocationType.ROOT) {
        throw new Error("newLocation must not be of type ROOT.");
      }

      newLocation.userDefinedName = action.name;
      return newQuiz;
    }
    case QuizDispatchType.SET_AREA_IS_OPEN: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType !== LocationType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isOpen = action.isOpen;
      return newQuiz;
    }
    case QuizDispatchType.SET_AREA_IS_ADDING: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType !== LocationType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isAdding = action.isAdding;
      return newQuiz;
    }
    case QuizDispatchType.SET_BUILDER_SELECTED: {
      const newQuiz = { ...quiz };
      newQuiz.selectedBuilderLocationId = action.locationId;
      return newQuiz;
    }
    default: {
      return quiz;
    }
  }
}

const initialQuiz: Quiz = {
  locations: {
    [rootId]: {
      id: rootId,
      sublocationIds: [],
      shortName: "Root",
      locationType: LocationType.ROOT,
      isAdding: true,
    },
  },
  selectedBuilderLocationId: null,
  selectedTakerLocationId: null,
};
