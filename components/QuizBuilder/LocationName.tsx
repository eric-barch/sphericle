import { LocationType, QuizDispatchType } from "@/types";
import { useQuiz, useQuizDispatch } from "../QuizProvider";
import { KeyboardEvent, RefObject, useState } from "react";

interface LocationNameProps {
  inputRef: RefObject<HTMLInputElement>;
  locationId: string;
  isRenaming: boolean;
  setIsRenaming: (isRenaming: boolean) => void;
}

export default function LocationName({
  inputRef,
  locationId,
  isRenaming,
  setIsRenaming,
}: LocationNameProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const location = quiz.locations[locationId];

  if (
    location.locationType !== LocationType.AREA &&
    location.locationType !== LocationType.POINT
  ) {
    throw new Error("location must be of type AREA or POINT.");
  }

  const displayName = location.userDefinedName || location.shortName;

  const [input, setInput] = useState<string>(displayName);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      setIsRenaming(false);

      quizDispatch({
        type: QuizDispatchType.RENAME_LOCATION,
        locationId,
        name: input,
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
    setInput(displayName);
    setIsRenaming(false);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={inputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>{displayName}</>
      )}
    </div>
  );
}
