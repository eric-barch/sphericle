import { AreaState, PointState, QuizDispatchType } from "@/types";
import { KeyboardEvent, RefObject, useEffect, useState } from "react";
import { useQuizDispatch } from "../QuizProvider";

interface LocationTextProps {
  location: AreaState | PointState;
  inputRef: RefObject<HTMLInputElement>;
  setIsRenaming: (isRenaming: boolean) => void;
}

export default function LocationName({
  location,
  inputRef,
  setIsRenaming,
}: LocationTextProps) {
  const quizDispatch = useQuizDispatch();

  const currentName = location.userDefinedName
    ? location.userDefinedName
    : location.shortName;

  const [newName, setNewName] = useState(currentName);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      quizDispatch({
        type: QuizDispatchType.Renamed,
        location,
        name: newName,
      });
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
      {location.isRenaming ? (
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
