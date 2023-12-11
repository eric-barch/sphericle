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

  // useEffect(() => {
  //   console.log("quiz", quiz);
  // }, [quiz]);

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

      return newQuiz;
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
    case QuizDispatchType.RESET_TAKER_SELECTED: {
      const newQuiz = { ...quiz };
      const rootLocation = newQuiz.locations[newQuiz.rootId];

      if (rootLocation.locationType !== LocationType.ROOT) {
        throw new Error("rootLocation must be of type ROOT.");
      }

      newQuiz.takerSelectedId = rootLocation.sublocationIds[0];
      return newQuiz;
    }
    case QuizDispatchType.INCREMENT_TAKER_SELECTED: {
      const newQuiz = { ...quiz };

      const takerSelected = newQuiz.locations[newQuiz.takerSelectedId] as
        | AreaState
        | PointState;

      const parent = newQuiz.locations[takerSelected.parentId] as AreaState; // | RootState

      const siblingIds = parent.sublocationIds;
      const takerSelectedIndex = siblingIds.indexOf(takerSelected.id);

      if (takerSelectedIndex < siblingIds.length - 1) {
        const newTakerSelectedId = siblingIds[takerSelectedIndex + 1];
        const newTakerSelected = newQuiz.locations[newTakerSelectedId];
        console.log(
          `${takerSelected.shortName} has subsequent sibling: ${newTakerSelected.shortName}`,
        );
        newQuiz.takerSelectedId = newTakerSelectedId;
        return newQuiz;
      }

      console.log(
        `${takerSelected.shortName} does not have subsequent sibling.`,
      );

      for (const siblingId of siblingIds) {
        const sibling = newQuiz.locations[siblingId];

        if (
          sibling.locationType === LocationType.AREA &&
          sibling.sublocationIds.length > 0
        ) {
          const newTakerSelectedId = sibling.sublocationIds[0];
          const newTakerSelected = newQuiz.locations[newTakerSelectedId];
          console.log(
            `${takerSelected.shortName} has sibling (${sibling.shortName}) with child: ${newTakerSelected.shortName}`,
          );
          newQuiz.takerSelectedId = newTakerSelectedId;
          return newQuiz;
        }
      }

      console.log(
        `${takerSelected.shortName} does not have siblings with children.`,
      );

      newQuiz.takerSelectedId = searchUpForId(newQuiz, parent);

      if (!newQuiz.takerSelectedId) {
        const root = newQuiz.locations[newQuiz.rootId] as RootState;
        const firstChildId = root.sublocationIds[0];
        newQuiz.takerSelectedId = firstChildId;
      }

      return newQuiz;
    }
    case QuizDispatchType.DELETE_LOCATION: {
      const newQuiz = { ...quiz };

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
      newQuiz.builderSelectedId = null;

      return newQuiz;
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
  builderSelectedId: null,
  takerSelectedId: null,
};

// this gets the parent of the one below it
function searchUpForId(
  quiz: Quiz,
  location: RootState | AreaState,
): string | null {
  console.log("searchUpForId", location.shortName);

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

  return searchUpForId(quiz, parent);
}
