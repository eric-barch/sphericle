import { FocusEvent, useRef, useState } from "react";
import { useQuiz, useQuizDispatch } from "../QuizProvider";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { useParentLocation } from "./ParentLocationProvider";
import { LocationType, QuizDispatchType } from "@/types";

export default function Point() {
  const quizState = useQuiz();
  const quizDispatch = useQuizDispatch();
  const parentLocation = useParentLocation();

  if (parentLocation.locationType !== LocationType.Point) {
    throw new Error("pointState must be of type PointState.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();

  function setIsRenaming(isRenaming: boolean) {
    setIsRenaming(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    if (parentLocation.locationType !== LocationType.Point) {
      throw new Error("parentLocation must be of type PointState.");
    }

    quizDispatch({
      type: QuizDispatchType.SelectedBuilderLocation,
      location: parentLocation,
    });
  }

  return (
    <div id="point" className="relative" onFocusCapture={handleFocusCapture}>
      <EditLocationButton
        className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
        setIsRenaming={setIsRenaming}
      />
      <div
        className={`w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer ${
          quizState.builderSelected?.id === parentLocation.id
            ? "outline outline-2 outline-red-600"
            : ""
        }`}
        tabIndex={0}
      >
        <LocationName
          inputRef={locationNameInputRef}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </div>
    </div>
  );
}
