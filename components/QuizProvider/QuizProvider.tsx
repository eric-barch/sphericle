import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatch,
  QuizDispatchType,
} from "@/types";
import _ from "lodash";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { findLocation } from "./QuizProvider.helpers";

const QuizContext = createContext<Quiz>(null);
const QuizDispatchContext = createContext<React.Dispatch<QuizDispatch>>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, dispatchQuiz] = useReducer(quizReducer, initialQuiz);

  // useEffect(() => {
  //   console.log("quiz", quiz);
  // }, [quiz]);

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
    case QuizDispatchType.AddedLocation: {
      return addLocation(quiz, action.parent, action.location);
    }
    case QuizDispatchType.SelectedBuilderLocation: {
      return selectBuilderLocation(quiz, action.location);
    }
    case QuizDispatchType.UpdatedLocationIsRenaming: {
      return updateLocationIsRenaming(quiz, action.location, action.isRenaming);
    }
    case QuizDispatchType.UpdatedLocationIsOpen: {
      return updateLocationIsOpen(quiz, action.location, action.isOpen);
    }
    case QuizDispatchType.UpdatedLocationIsAdding: {
      return updatedLocationIsAdding(quiz, action.location, action.isAdding);
    }
    case QuizDispatchType.ReorderedSublocations: {
      return reorderSublocations(quiz, action.parent, action.sublocations);
    }
    case QuizDispatchType.RenamedLocation: {
      return renameLocation(quiz, action.location, action.name);
    }
    case QuizDispatchType.DeletedLocation: {
      return deleteLocation(quiz, action.location);
    }
    case QuizDispatchType.SelectedTakerLocation: {
      return selectTakerLocation(quiz, action.location);
    }
    case QuizDispatchType.IncrementedTakerLocation: {
      return incrementTakerLocation(quiz);
    }
  }
}

const initialQuiz = {
  id: crypto.randomUUID(),
  locationType: LocationType.Quiz as LocationType.Quiz,
  isAdding: true,
  sublocations: [],
  builderSelected: null,
  takerSelected: null,
};

function addLocation(
  quiz: Quiz,
  parent: Quiz | AreaState,
  location: AreaState | PointState,
): Quiz {
  const newParent = _.cloneDeep(parent);
  newParent.sublocations.push(location);

  const newQuiz = replaceLocation(quiz, parent.id, newParent);
  newQuiz.builderSelected = location;

  return newQuiz;
}

function selectBuilderLocation(
  quiz: Quiz,
  location: AreaState | PointState | null,
): Quiz {
  const newQuiz = _.cloneDeep(quiz);

  if (location) {
    const newBuilderSelected = findLocation(newQuiz, location.id);
    newQuiz.builderSelected = newBuilderSelected;
  } else {
    newQuiz.builderSelected = null;
  }

  return newQuiz;
}

function selectTakerLocation(
  quiz: Quiz,
  location: AreaState | PointState | null,
): Quiz {
  const newQuiz = _.cloneDeep(quiz);

  if (location) {
    const newTakerSelected = findLocation(newQuiz, location.id);
    newQuiz.takerSelected = newTakerSelected;
  } else {
    newQuiz.takerSelected = null;
  }

  return newQuiz;
}

function updateLocationIsRenaming(
  quiz: Quiz,
  location: AreaState | PointState,
  isRenaming: boolean,
) {
  let newQuiz = _.cloneDeep(quiz);

  if (location.isRenaming === isRenaming) {
    return newQuiz;
  }

  const newLocation = _.cloneDeep(location);
  newLocation.isRenaming = isRenaming;

  newQuiz = replaceLocation(quiz, location.id, newLocation);
  newQuiz.builderSelected = newLocation;

  return newQuiz;
}

function updateLocationIsOpen(
  quiz: Quiz,
  location: AreaState,
  isOpen: boolean,
): Quiz {
  let newQuiz = _.cloneDeep(quiz);

  if (location.isOpen === isOpen) {
    return newQuiz;
  }

  let newLocation = _.cloneDeep(location);

  if (isOpen && location.sublocations.length === 0) {
    newLocation.isAdding = true;
    newLocation.isOpen = true;
  } else if (!isOpen && location.sublocations.length === 0) {
    newLocation.isAdding = false;
    newLocation.isOpen = false;
  } else {
    newLocation.isOpen = isOpen;
  }

  newQuiz = replaceLocation(quiz, location.id, newLocation);
  newQuiz.builderSelected = newLocation;

  return newQuiz;
}

function updatedLocationIsAdding(
  quiz: Quiz,
  location: AreaState,
  isAdding: boolean,
) {
  let newQuiz = _.cloneDeep(quiz);

  if (location.isAdding === isAdding) {
    return newQuiz;
  }

  let newLocation = _.cloneDeep(location);

  if (isAdding) {
    newLocation.isOpen = true;
    newLocation.isAdding = isAdding;
  } else {
    newLocation.isAdding = isAdding;
  }

  newQuiz = replaceLocation(quiz, location.id, newLocation);

  return newQuiz;
}

function reorderSublocations(
  quiz: Quiz,
  parent: Quiz | AreaState,
  sublocations: (AreaState | PointState)[],
): Quiz {
  const newParent = _.cloneDeep(parent);
  newParent.sublocations = sublocations;

  const newQuiz = replaceLocation(quiz, parent.id, newParent);
  return newQuiz;
}

function renameLocation(
  quiz: Quiz,
  location: AreaState | PointState,
  name: string,
): Quiz {
  const newLocation = _.cloneDeep(location);
  newLocation.isRenaming = false;
  newLocation.userDefinedName = name;

  const newQuiz = replaceLocation(quiz, location.id, newLocation);
  return newQuiz;
}

function deleteLocation(quiz: Quiz, location: AreaState | PointState): Quiz {
  const newQuiz = replaceLocation(quiz, location.id, null);
  return newQuiz;
}

function incrementTakerLocation(quiz: Quiz): Quiz {
  const newQuiz = _.cloneDeep(quiz);
  const takerSelected = newQuiz.takerSelected;
  return newQuiz;
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
