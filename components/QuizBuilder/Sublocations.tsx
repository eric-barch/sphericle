"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  QuizDispatchType,
  RootState,
} from "@/types";
import { Reorder } from "framer-motion";
import Area from "./Area";
import Point from "./Point";
import LocationAdder from "./LocationAdder";
import { RefObject, useState } from "react";

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
  const parentLocation = quiz.locations[parentId] as RootState | AreaState;

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  const [sublocationIds, setSublocationIds] = useState<string[]>(
    parentLocation.sublocationIds,
  );

  function handleReorder(sublocationIds: string[]) {
    quizDispatch({
      type: QuizDispatchType.SET_SUBLOCATION_IDS,
      locationId: parentId,
      sublocationIds,
    });
  }

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={parentLocation.sublocationIds}
        onReorder={handleReorder}
      >
        {parentLocation.sublocationIds.map((sublocationId) => (
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
  const sublocation = quiz.locations[sublocationId] as AreaState | PointState;

  if (
    sublocation.locationType !== LocationType.AREA &&
    sublocation.locationType !== LocationType.POINT
  ) {
    throw new Error("sublocation must be of type AREA or POINT.");
  }

  if (sublocation.locationType === LocationType.AREA) {
    return <Area locationId={sublocationId} />;
  }

  if (sublocation.locationType === LocationType.POINT) {
    return <Point locationId={sublocationId} />;
  }
}
