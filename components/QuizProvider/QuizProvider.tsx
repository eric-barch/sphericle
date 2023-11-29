import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatch,
} from "@/types";
import { ReactNode, createContext, useContext, useReducer } from "react";

const QuizContext = createContext<Quiz>(null);
const QuizDispatchContext = createContext<React.Dispatch<QuizDispatch>>(null);

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

function quizReducer(quiz: Quiz, action: QuizDispatch): Quiz {
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
  selectedSublocation: null,
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
  const newQuiz: Quiz = { ...quiz, selectedSublocation: location };
  return newQuiz;
}

function toggleLocationOpen(quiz: Quiz, location: AreaState): Quiz {
  const newLocation = { ...location, open: !location.open };
  const newQuiz = replaceLocation(quiz, location.id, newLocation);
  newQuiz.selectedSublocation = newLocation;
  return newQuiz;
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
