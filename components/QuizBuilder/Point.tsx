"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { FeatureType, QuizBuilderDispatchType } from "@/types";
import { FocusEvent, useRef, useState } from "react";
import EditLocationButton from "./EditFeatureButton";
import LocationName from "./FeatureName";
import { useQuizBuilder, useQuizBuilderDispatch } from "./QuizBuilderProvider";

interface PointProps {
  featureId: string;
}

export default function Point({ featureId }: PointProps) {
  const { allFeatures } = useAllFeatures();
  const quizBuilder = useQuizBuilder();
  const quizBuilderDispatch = useQuizBuilderDispatch();

  const pointState = allFeatures.get(featureId);

  if (pointState.featureType !== FeatureType.POINT) {
    throw new Error("pointState must be of type POINT.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const featureNameInputRef = useRef<HTMLInputElement>();

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId,
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
      <EditLocationButton featureId={featureId} setIsRenaming={setIsRenaming} />
      <button
        className={`w-full p-1 rounded-2xl text-left bg-gray-600 ${
          featureId === quizBuilder.selectedId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
      >
        <LocationName
          featureId={featureId}
          inputRef={featureNameInputRef}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </button>
    </div>
  );
}
