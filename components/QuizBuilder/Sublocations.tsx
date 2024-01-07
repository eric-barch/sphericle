"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  FeatureType,
  PointState,
  AllFeaturesDispatchType,
} from "@/types";
import { Reorder } from "framer-motion";
import { RefObject } from "react";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  locationAdderInputRef?: RefObject<HTMLInputElement>;
  className?: string;
  parentId: string;
}

export default function Sublocations({
  locationAdderInputRef,
  className,
  parentId,
}: SublocationsProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const parentLocation = quiz[parentId];

  if (
    parentLocation.featureType !== FeatureType.ROOT &&
    parentLocation.featureType !== FeatureType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  function handleReorder(sublocationIds: string[]) {
    quizDispatch({
      type: AllFeaturesDispatchType.SET_SUBFEATURES,
      featureId: parentId,
      subfeatureIds: sublocationIds,
    });
  }

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={parentLocation.subfeatureIds}
        onReorder={handleReorder}
      >
        {parentLocation.subfeatureIds.map((sublocationId) => (
          <Reorder.Item
            key={sublocationId}
            layout="position"
            layoutScroll
            value={sublocationId}
            transition={{ duration: 0 }}
          >
            <Sublocation sublocationId={sublocationId} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <LocationAdder inputRef={locationAdderInputRef} parentId={parentId} />
    </div>
  );
}

interface SublocationProps {
  sublocationId: string;
}

function Sublocation({ sublocationId }: SublocationProps) {
  const quiz = useQuiz();
  const sublocation = quiz[sublocationId] as AreaState | PointState;

  if (
    sublocation.featureType !== FeatureType.AREA &&
    sublocation.featureType !== FeatureType.POINT
  ) {
    throw new Error("sublocation must be of type AREA or POINT.");
  }

  if (sublocation.featureType === FeatureType.AREA) {
    return <Area locationId={sublocationId} />;
  }

  if (sublocation.featureType === FeatureType.POINT) {
    return <Point locationId={sublocationId} />;
  }
}
