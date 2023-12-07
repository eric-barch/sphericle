import { AreaState, LocationType, PointState } from "@/types";
import { Reorder } from "framer-motion";
import { FocusEvent, RefObject } from "react";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import ParentLocationProvider, {
  useParentLocation,
} from "./ParentLocationProvider";
import Point from "./Point";

interface SublocationsProps {
  sublocationsRef?: RefObject<HTMLDivElement>;
  locationAdderInputRef?: RefObject<HTMLInputElement>;
  className?: string;
  isAdding: boolean;
  onBlurCapture?: (event: FocusEvent<HTMLDivElement>) => void;
}

export function Sublocations({
  sublocationsRef,
  className,
  locationAdderInputRef,
  isAdding,
  onBlurCapture,
}: SublocationsProps) {
  const parentLocation = useParentLocation();

  if (
    parentLocation.locationType !== LocationType.Quiz &&
    parentLocation.locationType !== LocationType.Area
  ) {
    throw new Error("parent must be of type QuizState or AreaState.");
  }

  function handleReorder(sublocations: (AreaState | PointState)[]) {
    //   locationDispatch({
    //     type: LocationDispatchType.ReorderedSublocations,
    //     sublocations,
    //   });
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
        values={parentLocation.sublocations}
        onReorder={handleReorder}
      >
        {parentLocation.sublocations.map((sublocation) => (
          <Reorder.Item
            key={sublocation.id}
            layout="position"
            layoutScroll
            value={sublocation}
            transition={{ duration: 0 }}
          >
            <ParentLocationProvider initialParentLocation={sublocation}>
              <Sublocation />
            </ParentLocationProvider>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <LocationAdder inputRef={locationAdderInputRef} isAdding={isAdding} />
    </div>
  );
}

function Sublocation() {
  const parentLocation = useParentLocation();

  if (parentLocation.locationType === LocationType.Area) {
    return <Area />;
  }

  if (parentLocation.locationType === LocationType.Point) {
    return <Point />;
  }

  return null;
}
