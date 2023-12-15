"use client";

import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatch,
  QuizDispatchType,
  RootState,
} from "@/types";
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

      if (!newParent.sublocationIds.includes(sublocationId)) {
        newParent.sublocationIds = [...newParent.sublocationIds, sublocationId];
        newQuiz.locations[parentId] = newParent;
      }

      newQuiz.locations[sublocationId] = action.sublocation;
      newQuiz.builderSelectedId = action.sublocation.id;
      newQuiz.totalLocations++;
      newQuiz.activeOption = null;

      return getResetQuiz(newQuiz);
    }
    case QuizDispatchType.SET_SUBLOCATION_IDS: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (
        newLocation.locationType !== LocationType.ROOT &&
        newLocation.locationType !== LocationType.AREA
      ) {
        throw new Error("newLocation must be of type ROOT or AREA.");
      }

      newLocation.sublocationIds = action.sublocationIds;

      return getResetQuiz(newQuiz);
    }
    case QuizDispatchType.RENAME_LOCATION: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType === LocationType.ROOT) {
        throw new Error("newLocation must not be of type ROOT.");
      }

      newLocation.userDefinedName = action.name;

      return getResetQuiz(newQuiz);
    }
    case QuizDispatchType.SET_AREA_IS_OPEN: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType !== LocationType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isOpen = action.isOpen;

      if (!action.isOpen) {
        newLocation.isAdding = false;
      }

      return newQuiz;
    }
    case QuizDispatchType.SET_AREA_IS_ADDING: {
      const newQuiz = { ...quiz };
      const newLocation = newQuiz.locations[action.locationId];

      if (newLocation.locationType !== LocationType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isAdding = action.isAdding;

      if (action.isAdding) {
        newLocation.isOpen = true;
      }

      return newQuiz;
    }
    case QuizDispatchType.SET_BUILDER_SELECTED: {
      const newQuiz = { ...quiz };
      newQuiz.builderSelectedId = action.locationId;
      return newQuiz;
    }
    case QuizDispatchType.RESET_TAKER: {
      return getResetQuiz(quiz);
    }
    case QuizDispatchType.MARK_TAKER_SELECTED: {
      const newQuiz = { ...quiz };

      const newLocation = newQuiz.locations[quiz.takerSelectedId] as
        | AreaState
        | PointState;

      newLocation.answeredCorrectly = action.answeredCorrectly;

      newQuiz.takerSelectedId = getNewTakerSelectedId(newQuiz);

      if (action.answeredCorrectly) {
        newQuiz.correctLocations++;
      } else if (!action.answeredCorrectly) {
        newQuiz.incorrectLocations++;
      }

      if (
        newQuiz.correctLocations + newQuiz.incorrectLocations ===
        newQuiz.totalLocations
      ) {
        newQuiz.isComplete = true;
      }

      return newQuiz;
    }
    case QuizDispatchType.SELECT_OPTION: {
      const newQuiz = { ...quiz };
      newQuiz.activeOption = action.location;
      return newQuiz;
    }
    case QuizDispatchType.DELETE_LOCATION: {
      const newQuiz = { ...quiz };

      newQuiz.builderSelectedId = null;
      newQuiz.totalLocations--;

      if (!newQuiz.locations[action.locationId]) {
        return newQuiz;
      }

      const newLocation = newQuiz.locations[action.locationId];

      if (
        newLocation.locationType !== LocationType.AREA &&
        newLocation.locationType !== LocationType.POINT
      ) {
        throw new Error("newLocation must be of type AREA or POINT.");
      }

      const newParent = newQuiz.locations[newLocation.parentId];

      if (
        newParent.locationType !== LocationType.ROOT &&
        newParent.locationType !== LocationType.AREA
      ) {
        throw new Error("newParent must be of type ROOT or AREA.");
      }

      newParent.sublocationIds = newParent.sublocationIds.filter(
        (sublocationId) => sublocationId !== action.locationId,
      );

      delete newQuiz.locations[action.locationId];

      return getResetQuiz(newQuiz);
    }
    default: {
      return quiz;
    }
  }
}

const initialQuiz: Quiz = {
  rootId,
  locations: {
    [rootId]: {
      id: rootId,
      sublocationIds: [],
      shortName: "Root",
      locationType: LocationType.ROOT,
      isAdding: true,
    },
  },
  activeOption: null,
  builderSelectedId: null,
  takerSelectedId: null,
  incorrectLocations: 0,
  correctLocations: 0,
  totalLocations: 0,
  isComplete: false,
};

function getResetQuiz(quiz: Quiz): Quiz {
  const newQuiz = { ...quiz };

  newQuiz.correctLocations = 0;
  newQuiz.incorrectLocations = 0;

  for (const location of Object.values(newQuiz.locations)) {
    if (
      location.locationType === LocationType.AREA ||
      location.locationType === LocationType.POINT
    ) {
      location.answeredCorrectly = null;
    }
  }

  const rootLocation = newQuiz.locations[newQuiz.rootId];

  if (rootLocation.locationType !== LocationType.ROOT) {
    throw new Error("rootLocation must be of type ROOT.");
  }

  newQuiz.takerSelectedId = rootLocation.sublocationIds[0];
  newQuiz.isComplete = false;

  return newQuiz;
}

function getNewTakerSelectedId(quiz: Quiz): string {
  const takerSelected = quiz.locations[quiz.takerSelectedId] as
    | AreaState
    | PointState;

  const parent = quiz.locations[takerSelected.parentId] as AreaState;

  const siblingIds = parent.sublocationIds;
  const takerSelectedIndex = siblingIds.indexOf(takerSelected.id);

  if (takerSelectedIndex < siblingIds.length - 1) {
    return siblingIds[takerSelectedIndex + 1];
  }

  for (const siblingId of siblingIds) {
    const sibling = quiz.locations[siblingId];

    if (
      sibling.locationType === LocationType.AREA &&
      sibling.sublocationIds.length > 0
    ) {
      return sibling.sublocationIds[0];
    }
  }

  return searchUpward(quiz, parent);
}

function searchUpward(
  quiz: Quiz,
  location: RootState | AreaState,
): string | null {
  if (location.locationType === LocationType.ROOT) {
    return null;
  }

  const parent = quiz.locations[location.parentId] as RootState | AreaState;
  const siblingIds = parent.sublocationIds;
  const index = siblingIds.indexOf(location.id);

  for (let i = index + 1; i < siblingIds.length; i++) {
    const location = quiz.locations[siblingIds[i]];

    if (
      location.locationType === LocationType.AREA &&
      location.sublocationIds.length > 0
    ) {
      return location.sublocationIds[0];
    }
  }

  return searchUpward(quiz, parent);
}
