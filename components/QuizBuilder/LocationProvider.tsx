import {
  AreaState,
  LocationDispatch,
  LocationDispatchType,
  LocationType,
  PointState,
  QuizDispatchType,
  QuizState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useQuiz, useQuizDispatch } from "../QuizProvider";

export const LocationContext = createContext<
  QuizState | AreaState | PointState
>(null);
export const LocationDispatchContext =
  createContext<Dispatch<LocationDispatch>>(null);

export default function LocationProvider({
  initialLocation,
  children,
}: {
  initialLocation: QuizState | AreaState | PointState;
  children: ReactNode;
}) {
  const parentLocation = useLocation() || useQuiz();
  const parentLocationDispatch = useLocationDispatch();
  const quizDispatch = useQuizDispatch();

  const locationReducer = useCallback(
    <T extends QuizState | AreaState | PointState>(
      location: T,
      action: LocationDispatch,
    ): T => {
      switch (action.type) {
        case LocationDispatchType.AddedSublocation: {
          if (!isQuizOrArea(location)) {
            throw new Error("location must be of type QuizState or AreaState.");
          }

          const newLocation = { ...location };

          // TODO: would prefer to fix by preventing reducer from firing twice
          if (!location.sublocations.includes(action.sublocation)) {
            newLocation.sublocations.push(action.sublocation);
            action.sublocation.parent = newLocation;
          }

          return newLocation;
        }
        case LocationDispatchType.UpdatedIsOpen: {
          if (!isArea(location)) {
            throw new Error("location must be of type AreaState.");
          }

          const newLocation = { ...location, isOpen: action.isOpen };

          quizDispatch({
            type: QuizDispatchType.SelectedBuilderLocation,
            location: newLocation,
          });

          return newLocation;
        }
        case LocationDispatchType.Renamed: {
          if (!isAreaOrPoint(location)) {
            throw new Error(
              "location must be of type AreaState or PointState.",
            );
          }

          const newLocation = { ...location, userDefinedName: action.name };
          return newLocation;
        }
        case LocationDispatchType.UpdatedSublocations: {
          if (!isQuizOrArea(location)) {
            throw new Error("location must be of type QuizState or AreaState.");
          }

          return { ...location, sublocations: action.sublocations };
        }
        case LocationDispatchType.Deleted: {
          if (!isAreaOrPoint(location)) {
            throw new Error(
              "location must be of type AreaState or PointState.",
            );
          }

          return { ...location, markedForDeletion: true };
        }
      }
    },
    [],
  );

  const [location, dispatchlocation] = useReducer(
    locationReducer,
    initialLocation,
  );

  useEffect(() => {
    if (
      parentLocation &&
      initialLocation &&
      location &&
      isQuizOrArea(parentLocation) &&
      isAreaOrPoint(initialLocation) &&
      isAreaOrPoint(location)
    ) {
      let newParentSublocations = [...parentLocation.sublocations];
      const index = parentLocation.sublocations.indexOf(initialLocation);

      if (location.markedForDeletion) {
        newParentSublocations = newParentSublocations.filter(
          (sublocation) => sublocation.id !== location.id,
        );
      } else {
        newParentSublocations[index] = location;
      }

      if (isQuiz(parentLocation)) {
        quizDispatch({
          type: QuizDispatchType.UpdatedSublocations,
          sublocations: newParentSublocations,
        });
      } else if (isArea(parentLocation)) {
        parentLocationDispatch({
          type: LocationDispatchType.UpdatedSublocations,
          sublocations: newParentSublocations,
        });
      }
    }
  }, [location]);

  return (
    <LocationContext.Provider value={location}>
      <LocationDispatchContext.Provider value={dispatchlocation}>
        {children}
      </LocationDispatchContext.Provider>
    </LocationContext.Provider>
  );
}

export function useLocation(): QuizState | AreaState | PointState {
  return useContext(LocationContext);
}

export function useLocationDispatch() {
  return useContext(LocationDispatchContext);
}

function isQuiz(
  location: QuizState | AreaState | PointState,
): location is QuizState {
  return location.locationType === LocationType.Quiz;
}

function isArea(
  location: QuizState | AreaState | PointState,
): location is AreaState {
  return location.locationType === LocationType.Area;
}

function isQuizOrArea(
  location: QuizState | AreaState | PointState,
): location is QuizState | AreaState {
  return isQuiz(location) || isArea(location);
}

function isAreaOrPoint(
  location: QuizState | AreaState | PointState,
): location is AreaState | PointState {
  return (
    location.locationType === LocationType.Area ||
    location.locationType === LocationType.Point
  );
}
