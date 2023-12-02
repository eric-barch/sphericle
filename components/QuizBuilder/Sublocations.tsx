import { useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatchType,
} from "@/types";
import { Reorder } from "framer-motion";
import { FocusEvent, RefObject } from "react";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  sublocationsRef?: RefObject<HTMLDivElement>;
  locationAdderInputRef?: RefObject<HTMLInputElement>;
  className?: string;
  parent: Quiz | AreaState;
  onBlurCapture?: (event: FocusEvent<HTMLDivElement>) => void;
}

export function Sublocations({
  sublocationsRef,
  className,
  parent,
  locationAdderInputRef,
  onBlurCapture,
}: SublocationsProps) {
  const quizDispatch = useQuizDispatch();

  function handleReorder(sublocations: (AreaState | PointState)[]) {
    quizDispatch({
      type: QuizDispatchType.ReorderedSublocations,
      parent,
      sublocations,
    });
  }

  return (
    <div
      ref={sublocationsRef}
      className={`${className ? className : ""} space-y-1 h-full`}
      onBlurCapture={onBlurCapture}
    >
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={parent.sublocations}
        onReorder={handleReorder}
      >
        {parent.sublocations.map((sublocation) => (
          <Reorder.Item
            key={sublocation.id}
            layout="position"
            layoutScroll
            value={sublocation}
          >
            <Sublocation sublocation={sublocation} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <LocationAdder parent={parent} inputRef={locationAdderInputRef} />
    </div>
  );
}

interface SublocationProps {
  sublocation: AreaState | PointState;
}

function Sublocation({ sublocation }: SublocationProps) {
  if (sublocation.locationType === LocationType.Area) {
    return <Area areaState={sublocation} />;
  }

  if (sublocation.locationType === LocationType.Point) {
    return <Point pointState={sublocation} />;
  }

  return null;
}
