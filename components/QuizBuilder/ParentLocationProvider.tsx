import {
  AreaState,
  LocationDispatch,
  LocationDispatchType,
  LocationType,
  PointState,
  QuizState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

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
  const locationReducer = useCallback(
    function <T extends QuizState | AreaState | PointState>(
      location: T,
      action: LocationDispatch,
    ): T {
      console.log("locationReducer", action.type);

      switch (action.type) {
        case LocationDispatchType.AddedSublocation: {
          if (!isQuizOrArea(location)) {
            throw new Error("location must be of type QuizState or AreaState.");
          }

          const newLocation = { ...location };

          // TODO: hack to prevent adding location twice when reducer fires twice. would prefer to fix
          // by preventing reducer from firing twice. tackle later.
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

          // TODO: this seems hacky and like it mutates state, but seems to work?
          if (isAreaOrPoint(initialLocation) && isAreaOrPoint(newLocation)) {
            const parent = initialLocation.parent;
            const index = parent.sublocations.indexOf(initialLocation);
            parent.sublocations[index] = newLocation;
          }

          return newLocation;
        }
        case LocationDispatchType.Renamed: {
          if (!isAreaOrPoint(location)) {
            throw new Error(
              "location must be of type AreaState or PointState.",
            );
          }

          const newLocation = { ...location, userDefinedName: action.name };

          // TODO: see above
          if (isAreaOrPoint(initialLocation) && isAreaOrPoint(newLocation)) {
            const parent = initialLocation.parent;
            const index = parent.sublocations.indexOf(initialLocation);
            parent.sublocations[index] = newLocation;
          }

          return newLocation;
        }
      }
    },
    [initialLocation],
  );

  const [location, dispatchlocation] = useReducer(
    locationReducer,
    initialLocation,
  );

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

function isQuizOrArea(
  location: QuizState | AreaState | PointState,
): location is QuizState | AreaState {
  return (
    location.locationType === LocationType.Quiz ||
    location.locationType === LocationType.Area
  );
}

function isArea(
  location: QuizState | AreaState | PointState,
): location is AreaState {
  return location.locationType === LocationType.Area;
}

function isAreaOrPoint(
  location: QuizState | AreaState | PointState,
): location is AreaState | PointState {
  return (
    location.locationType === LocationType.Area ||
    location.locationType === LocationType.Point
  );
}
