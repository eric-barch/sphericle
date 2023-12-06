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
import { findLocation, cloneQuizWithNewLocation } from "./QuizProvider.helpers";

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
  shortName: "quiz",
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
  location.parent = newParent;

  const newQuiz = cloneQuizWithNewLocation(quiz, parent.id, newParent);

  if (newQuiz.locationType !== LocationType.Quiz) {
    throw new Error("newQuiz is not a Quiz.");
  }

  const newBuilderSelected = findLocation(newQuiz, location.id);
  newQuiz.builderSelected = newBuilderSelected;
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

  newQuiz = cloneQuizWithNewLocation(quiz, location.id, newLocation) as Quiz;
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

  newQuiz = cloneQuizWithNewLocation(quiz, location.id, newLocation) as Quiz;
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

  newQuiz = cloneQuizWithNewLocation(quiz, location.id, newLocation) as Quiz;

  return newQuiz;
}

function reorderSublocations(
  quiz: Quiz,
  parent: Quiz | AreaState,
  sublocations: (AreaState | PointState)[],
): Quiz {
  const newParent = _.cloneDeep(parent);

  newParent.sublocations = sublocations.map((sublocation) => ({
    ...sublocation,
    parent: newParent,
  }));

  return cloneQuizWithNewLocation(quiz, parent.id, newParent) as Quiz;
}

function renameLocation(
  quiz: Quiz,
  location: AreaState | PointState,
  name: string,
): Quiz {
  const newLocation = _.cloneDeep(location);
  newLocation.isRenaming = false;
  newLocation.userDefinedName = name;

  const newQuiz = cloneQuizWithNewLocation(
    quiz,
    location.id,
    newLocation,
  ) as Quiz;
  return newQuiz;
}

function deleteLocation(quiz: Quiz, location: AreaState | PointState): Quiz {
  const newQuiz = cloneQuizWithNewLocation(quiz, location.id, null) as Quiz;
  return newQuiz;
}

function incrementTakerLocation(quiz: Quiz): Quiz {
  const newQuiz = _.cloneDeep(quiz);
  const takerSelected = newQuiz.takerSelected;

  const parent = takerSelected.parent;
  const siblings = parent.sublocations;
  const index = siblings.indexOf(takerSelected);

  if (index < siblings.length - 1) {
    newQuiz.takerSelected = siblings[index + 1];
    return newQuiz;
  }

  for (const takerSelectedSibling of siblings) {
    if (
      takerSelectedSibling.locationType === LocationType.Area &&
      takerSelectedSibling.sublocations.length > 0
    ) {
      newQuiz.takerSelected = takerSelectedSibling.sublocations[0];
      return newQuiz;
    }
  }

  newQuiz.takerSelected = searchUpwardForNextSelected(parent);

  console.log("new takerSelected", newQuiz.takerSelected?.shortName);
  if (!newQuiz.takerSelected) {
    newQuiz.takerSelected = newQuiz.sublocations[0];
  }

  return newQuiz;
}

function searchUpwardForNextSelected(
  location: Quiz | AreaState | PointState,
): AreaState | PointState | null {
  if (location.locationType === LocationType.Quiz) {
    return null;
  }

  const parent = location.parent;

  if (parent.locationType === LocationType.Quiz) {
    return null;
  }

  const siblings = parent.sublocations;
  const index = siblings.indexOf(location);

  for (let i = index + 1; i < siblings.length; i++) {
    const sibling = siblings[i];

    if (
      sibling.locationType === LocationType.Area &&
      sibling.sublocations.length > 0
    ) {
      return sibling.sublocations[0];
    }
  }

  return searchUpwardForNextSelected(parent);
}
