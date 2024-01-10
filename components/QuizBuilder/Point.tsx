"use client";

import {
  useAllFeatures,
  useAllFeaturesDispatch,
} from "@/components/AllFeaturesProvider";
import {
  FeatureType,
  PointState,
  QuizBuilderDispatchType,
  AllFeaturesDispatchType,
} from "@/types";
import { FocusEvent, useRef, useState } from "react";
import LocationName from "./LocationName";
import EditLocationButton from "./EditLocationButton";
import { useQuizBuilder, useQuizBuilderDispatch } from "./QuizBuilderProvider";

interface PointProps {
  locationId: string;
}

export default function Point({ locationId }: PointProps) {
  const allFeatures = useAllFeatures();
  const allFeaturesDispatch = useAllFeaturesDispatch();

  const quizBuilder = useQuizBuilder();
  const quizBuilderDispatch = useQuizBuilderDispatch();

  const location = allFeatures.features[locationId] as PointState;

  if (location.featureType !== FeatureType.POINT) {
    throw new Error("pointState must be of type POINT.");
  }

  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: locationId,
      });
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef?.current.focus();
        locationNameInputRef?.current.select();
      }, 0);
    }
  }

  return (
    <div className="relative" onFocus={handleFocus}>
      <EditLocationButton
        locationId={locationId}
        setIsRenaming={setIsRenaming}
      />
      <button
        className={`w-full p-1 rounded-2xl text-left bg-gray-600 ${
          locationId === quizBuilder.selectedId
            ? "outline outline-2 outline-red-700"
            : ""
        }`}
      >
        <LocationName
          locationId={locationId}
          inputRef={locationNameInputRef}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </button>
    </div>
  );
}
