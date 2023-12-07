import {
  AreaState,
  LocationType,
  LocationDispatchType,
  PointState,
  QuizDispatchType,
} from "@/types";
import { KeyboardEvent, RefObject, useEffect, useState } from "react";
import { useQuizDispatch } from "../QuizProvider";
import { useLocation, useLocationDispatch } from "./LocationProvider";

interface LocationTextProps {
  inputRef: RefObject<HTMLInputElement>;
  isRenaming: boolean;
  setIsRenaming: (isRenaming: boolean) => void;
}

export default function LocationName({
  inputRef,
  isRenaming,
  setIsRenaming,
}: LocationTextProps) {
  const location = useLocation();
  const locationDispatch = useLocationDispatch();

  if (
    location.locationType !== LocationType.Area &&
    location.locationType !== LocationType.Point
  ) {
    throw new Error("parentLocation must by of type AreaState or PointState.");
  }

  const currentName = location.userDefinedName
    ? location.userDefinedName
    : location.shortName;

  const [newName, setNewName] = useState(currentName);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      locationDispatch({
        type: LocationDispatchType.Renamed,
        name: newName,
      });

      setIsRenaming(false);
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }

    if (event.key === " ") {
      event.stopPropagation();
    }
  }

  function handleBlur() {
    setNewName(currentName);
    setIsRenaming(false);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={inputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>{currentName}</>
      )}
    </div>
  );
}
