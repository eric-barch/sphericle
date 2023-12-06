import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import { KeyboardEvent, RefObject, useEffect, useState } from "react";
import { useQuizDispatch } from "../QuizProvider";
import {
  useParentLocation,
  useParentLocationDispatch,
} from "./ParentLocationProvider";

interface LocationTextProps {
  inputRef: RefObject<HTMLInputElement>;
}

export default function LocationName({ inputRef }: LocationTextProps) {
  const parentLocation = useParentLocation();

  if (
    parentLocation.locationType !== LocationType.Area &&
    parentLocation.locationType !== LocationType.Point
  ) {
    throw new Error("parentLocation must by of type AreaState or PointState.");
  }

  const currentName = parentLocation.userDefinedName
    ? parentLocation.userDefinedName
    : parentLocation.shortName;

  const [newName, setNewName] = useState(currentName);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      // quizDispatch({
      //   type: QuizDispatchType.RenamedLocation,
      //   location,
      //   name: newName,
      // });
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
    // setIsRenaming(false);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {parentLocation.isRenaming ? (
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
