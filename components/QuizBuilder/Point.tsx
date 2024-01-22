"use client";

import { QuizBuilderStateDispatchType } from "@/types";
import { FocusEvent, useRef, useState } from "react";
import EditFeatureButton from "./EditFeatureButton";
import FeatureName from "./FeatureName";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface PointProps {
  featureId: string;
}

export default function Point({ featureId }: PointProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const featureNameInputRef = useRef<HTMLInputElement>();

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
        selectedFeatureId: featureId,
      });
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        featureNameInputRef?.current.focus();
        featureNameInputRef?.current.select();
      }, 0);
    }
  }

  return (
    <div className="relative" onFocus={handleFocus}>
      <EditFeatureButton featureId={featureId} setIsRenaming={setIsRenaming} />
      <button
        className={`w-full p-1 rounded-2xl text-left bg-gray-600 ${
          featureId === quizBuilderState.selectedFeatureId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
      >
        <FeatureName
          featureId={featureId}
          inputRef={featureNameInputRef}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </button>
    </div>
  );
}
