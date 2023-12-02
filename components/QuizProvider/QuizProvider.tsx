import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatch,
  QuizDispatchType,
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
    case QuizDispatchType.Added: {
      return addLocation(quiz, action.parent, action.location);
    }
    case QuizDispatchType.Selected: {
      return selectLocation(quiz, action.location);
    }
    case QuizDispatchType.SetIsRenaming: {
      return setLocationIsRenaming(quiz, action.location, action.isRenaming);
    }
    case QuizDispatchType.SetIsOpen: {
      return setLocationIsOpen(quiz, action.location, action.isOpen);
    }
    case QuizDispatchType.SetIsAdding: {
      return setLocationIsAdding(quiz, action.location, action.isAdding);
    }
    case QuizDispatchType.ReorderedSublocations: {
      return reorderSublocations(quiz, action.parent, action.sublocations);
    }
    case QuizDispatchType.Renamed: {
      return renameLocation(quiz, action.location, action.name);
    }
    case QuizDispatchType.Deleted: {
      return deleteLocation(quiz, action.location);
    }
  }
}

const initialQuiz = {
  id: "quiz",
  locationType: LocationType.Quiz as LocationType.Quiz,
  isAdding: true,
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
  return { ...quiz, selectedSublocation: location };
}

function setLocationIsRenaming(
  quiz: Quiz,
  location: AreaState | PointState,
  isRenaming: boolean,
) {
  if (location.isRenaming === isRenaming) {
    return quiz;
  }

  const newLocation = { ...location, isRenaming };
  const newQuiz = replaceLocation(quiz, location.id, newLocation);

  return newQuiz;
}

function setLocationIsOpen(
  quiz: Quiz,
  location: AreaState,
  isOpen: boolean,
): Quiz {
  if (location.isOpen === isOpen) {
    return quiz;
  }

  let newLocation: AreaState;

  if (isOpen && location.sublocations.length === 0) {
    newLocation = { ...location, isAdding: true, isOpen: true };
  } else if (!isOpen && location.sublocations.length === 0) {
    newLocation = { ...location, isAdding: false, isOpen: false };
  } else {
    newLocation = { ...location, isOpen };
  }

  const newQuiz = replaceLocation(quiz, location.id, newLocation);

  newQuiz.selectedSublocation = newLocation;

  return newQuiz;
}

function setLocationIsAdding(
  quiz: Quiz,
  location: AreaState,
  isAdding: boolean,
) {
  if (location.isAdding === isAdding) {
    return quiz;
  }

  let newLocation: AreaState;

  if (isAdding) {
    newLocation = {
      ...location,
      isOpen: true,
      isAdding,
    };
  } else {
    newLocation = { ...location, isAdding };
  }

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
    isRenaming: false,
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
