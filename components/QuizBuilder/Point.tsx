import { FocusEvent, useRef } from "react";
import { useQuiz } from "../QuizProvider";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { useParentLocation } from "./ParentLocationProvider";
import { LocationType } from "@/types";

export default function Point() {
  const quizState = useQuiz();
  const pointState = useParentLocation();

  if (pointState.locationType !== LocationType.Point) {
    throw new Error("pointState must be of type PointState.");
  }

  const locationNameInputRef = useRef<HTMLInputElement>();

  function setIsRenaming(isRenaming: boolean) {
    // quizDispatch({
    //   type: QuizDispatchType.UpdatedLocationIsRenaming,
    //   location: pointState,
    //   isRenaming,
    // });

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    // quizDispatch({
    //   type: QuizDispatchType.SelectedBuilderLocation,
    //   location: pointState,
    // });
  }

  return (
    <div id="point" className="relative" onFocusCapture={handleFocusCapture}>
      <EditLocationButton className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5" />
      <div
        className={`w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer ${
          quizState.builderSelected?.id === pointState.id
            ? "outline outline-2 outline-red-600"
            : ""
        }`}
        tabIndex={0}
      >
        <LocationName inputRef={locationNameInputRef} />
      </div>
    </div>
  );
}
