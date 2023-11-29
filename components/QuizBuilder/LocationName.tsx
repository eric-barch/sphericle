import { AreaState, PointState, QuizDispatchType } from "@/types";
import { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useQuizDispatch } from "../QuizProvider";

interface LocationTextProps {
  location: AreaState | PointState;
  renaming: boolean;
  setRenaming: (renaming: boolean) => void;
}

export default function LocationName({
  location,
  renaming,
  setRenaming,
}: LocationTextProps) {
  const quizDispatch = useQuizDispatch();

  const currentName = location.userDefinedName
    ? location.userDefinedName
    : location.shortName;

  const [newName, setNewName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      quizDispatch({
        type: QuizDispatchType.Renamed,
        location,
        name: newName,
      });

      setRenaming(false);
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }

    if (event.key === " ") {
      event.stopPropagation();
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setNewName(currentName);
    setRenaming(false);
  }

  // TODO: consider whether it makes sense to refactor out this useEffect
  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming, inputRef]);

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {renaming ? (
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
