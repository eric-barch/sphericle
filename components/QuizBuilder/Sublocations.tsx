import { useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatchType,
} from "@/types";
import { Reorder } from "framer-motion";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  className?: string;
  parent: Quiz | AreaState;
}

export function Sublocations({ className, parent }: SublocationsProps) {
  const quizDispatch = useQuizDispatch();

  const sublocations = parent.sublocations;
  function setSublocations(sublocations: (AreaState | PointState)[]) {
    quizDispatch({
      type: QuizDispatchType.ReorderedSublocations,
      parent,
      sublocations,
    });
  }

  return (
    <div className={`${className ? className : ""} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={sublocations}
        onReorder={setSublocations}
      >
        {sublocations.map((sublocation) => (
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
      <LocationAdder parent={parent} />
    </div>
  );
}

interface SublocationProps {
  sublocation: AreaState | PointState;
}

function Sublocation({ sublocation }: SublocationProps) {
  if (sublocation.locationType === LocationType.Area) {
    return <Area key={sublocation.id} areaState={sublocation} />;
  }

  if (sublocation.locationType === LocationType.Point) {
    return <Point key={sublocation.id} pointState={sublocation} />;
  }

  return null;
}
