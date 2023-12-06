import {
  AreaState,
  ParentLocationDispatch,
  ParentLocationDispatchType,
  LocationType,
  PointState,
  QuizState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

export const ParentLocationContext = createContext<
  QuizState | AreaState | PointState
>(null);
export const ParentLocationDispatchContext =
  createContext<Dispatch<ParentLocationDispatch>>(null);

export default function ParentLocationProvider({
  initialParentLocation,
  children,
}: {
  initialParentLocation: QuizState | AreaState | PointState;
  children: ReactNode;
}) {
  const [parentLocation, dispatchParentLocation] = useReducer(
    parentLocationReducer,
    initialParentLocation,
  );

  return (
    <ParentLocationContext.Provider value={parentLocation}>
      <ParentLocationDispatchContext.Provider value={dispatchParentLocation}>
        {children}
      </ParentLocationDispatchContext.Provider>
    </ParentLocationContext.Provider>
  );
}

export function useParentLocation(): QuizState | AreaState | PointState {
  return useContext(ParentLocationContext);
}

export function useParentLocationDispatch() {
  return useContext(ParentLocationDispatchContext);
}

function parentLocationReducer<T extends QuizState | AreaState | PointState>(
  parentLocation: T,
  action: ParentLocationDispatch,
): T {
  switch (action.type) {
    case ParentLocationDispatchType.AddedSublocation: {
      if (!isQuizOrArea(parentLocation)) {
        throw new Error(
          "parentLocation must be of type QuizState or AreaState.",
        );
      }

      const newParentLocation = { ...parentLocation };

      // TODO: hack to prevent adding location twice when reducer fires twice. would prefer to fix
      // by preventing reducer from firing twice.
      if (!parentLocation.sublocations.includes(action.sublocation)) {
        newParentLocation.sublocations.push(action.sublocation);
        action.sublocation.parent = newParentLocation;
      }

      return newParentLocation;
    }
    case ParentLocationDispatchType.UpdatedIsOpen: {
      if (!isArea(parentLocation)) {
        throw new Error("parentLocation must be of type AreaState.");
      }

      return { ...parentLocation, isOpen: action.isOpen };
    }
    case ParentLocationDispatchType.UpdatedIsAdding: {
      if (!isArea(parentLocation)) {
        throw new Error("parentLocation must be of type AreaState.");
      }

      return {
        ...parentLocation,
        isAdding: action.isAdding,
      };
    }
  }
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
