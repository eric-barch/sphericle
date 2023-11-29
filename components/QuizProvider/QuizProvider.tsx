import { AreaState, LocationType, PointState, Quiz } from "@/types";
import { ReactNode, createContext, useContext, useReducer } from "react";

const QuizContext = createContext(null);
const QuizDispatchContext = createContext(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, dispatchQuiz] = useReducer(quizReducer, initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={dispatchQuiz}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

export function useQuiz(): Quiz {
  return useContext(QuizContext);
}

export function useQuizDispatch() {
  return useContext(QuizDispatchContext);
}

export function useGetLocation(): (
  targetId: string,
) => AreaState | PointState | null {
  const quiz = useQuiz();

  return function (targetId: string): AreaState | PointState | null {
    function findLocation(
      searchLocation: Quiz | AreaState | PointState,
      targetId: string,
    ): AreaState | PointState | null {
      if (searchLocation.id === targetId) {
        if (searchLocation.locationType === LocationType.Quiz) {
          return null;
        } else {
          return searchLocation as AreaState | PointState;
        }
      }

      if (searchLocation.locationType === LocationType.Point) {
        return null;
      }

      if (
        searchLocation.locationType === LocationType.Quiz ||
        searchLocation.locationType === LocationType.Area
      ) {
        for (const currentSublocation of searchLocation.sublocations) {
          const foundLocation = findLocation(currentSublocation, targetId);
          if (foundLocation) {
            return foundLocation;
          }
        }
      }

      return null;
    }

    return findLocation(quiz, targetId);
  };
}

function quizReducer(quiz: Quiz, action): Quiz {
  switch (action.type) {
    case "added": {
      return addLocation(quiz, action.parent, action.location);
    }
    case "selected": {
      return selectLocation(quiz, action.location);
    }
    case "toggledOpen": {
      return toggleLocationOpen(quiz, action.location);
    }
    case "reorderedSublocations": {
      return reorderSublocations(quiz, action.parent, action.sublocations);
    }
    case "renamed": {
      return renameLocation(quiz, action.location, action.name);
    }
    case "deleted": {
      return deleteLocation(quiz, action.location);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialQuiz = {
  id: "quiz",
  locationType: LocationType.Quiz as LocationType.Quiz,
  sublocations: [],
  selectedSublocationId: null,
};

function addLocation(
  quiz: Quiz,
  parent: Quiz | AreaState,
  location: AreaState | PointState,
): Quiz {
  const newParent: Quiz | AreaState = {
    ...parent,
    sublocations: [...parent.sublocations, location],
  };

  return replaceLocation(quiz, parent.id, newParent);
}

function selectLocation(
  quiz: Quiz,
  location: AreaState | PointState | null,
): Quiz {
  const newQuiz: Quiz = { ...quiz, selectedSublocationId: location.id };
  return newQuiz;
}

function toggleLocationOpen(quiz: Quiz, location: AreaState): Quiz {
  const newLocation = { ...location, open: !location.open };
  return replaceLocation(quiz, location.id, newLocation);
}

function reorderSublocations(
  quiz: Quiz,
  parent: Quiz | AreaState,
  sublocations: (AreaState | PointState)[],
): Quiz {
  const newParent = {
    ...parent,
    sublocations,
  };

  return replaceLocation(quiz, parent.id, newParent);
}

function renameLocation(
  quiz: Quiz,
  location: AreaState | PointState,
  name: string,
): Quiz {
  const newLocation = {
    ...location,
    userDefinedName: name,
  };

  return replaceLocation(quiz, location.id, newLocation);
}

function deleteLocation(quiz: Quiz, location: AreaState | PointState): Quiz {
  return replaceLocation(quiz, location.id, null);
}

function findAndReplaceLocation(
  searchLocation: Quiz | AreaState | PointState,
  targetId: string,
  newLocation: Quiz | AreaState | PointState | null,
): Quiz | AreaState | PointState | null {
  if (searchLocation.id === targetId) {
    return newLocation;
  }

  if (searchLocation.locationType === LocationType.Point) {
    return searchLocation;
  }

  if (
    searchLocation.locationType === LocationType.Quiz ||
    searchLocation.locationType === LocationType.Area
  ) {
    let newSublocations: (AreaState | PointState)[] = [];

    for (const currentSublocation of searchLocation.sublocations) {
      const newSublocation = findAndReplaceLocation(
        currentSublocation,
        targetId,
        newLocation,
      );

      if (newSublocation && newSublocation.locationType !== LocationType.Quiz) {
        newSublocations.push(newSublocation);
      }
    }

    return {
      ...searchLocation,
      sublocations: newSublocations,
    };
  }
}

function replaceLocation(
  quiz: Quiz,
  targetId: string,
  newLocation: Quiz | AreaState | PointState | null,
): Quiz {
  const newQuiz = findAndReplaceLocation(quiz, targetId, newLocation);

  if (newQuiz?.locationType !== LocationType.Quiz) {
    throw new Error("newQuiz is not a Quiz.");
  }

  return newQuiz;
}
