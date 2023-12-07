import { AreaState, LocationType, PointState } from "@/types";
import { Reorder } from "framer-motion";
import { FocusEvent, RefObject } from "react";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import LocationProvider, { useLocation } from "./LocationProvider";
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
  const location = useLocation();

  if (
    location.locationType !== LocationType.Quiz &&
    location.locationType !== LocationType.Area
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
        values={location.sublocations}
        onReorder={handleReorder}
      >
        {location.sublocations.map((sublocation) => (
          <Reorder.Item
            key={sublocation.id}
            layout="position"
            layoutScroll
            value={sublocation}
            transition={{ duration: 0 }}
          >
            <LocationProvider initialLocation={sublocation}>
              <Sublocation />
            </LocationProvider>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <LocationAdder inputRef={locationAdderInputRef} isAdding={isAdding} />
    </div>
  );
}

function Sublocation() {
  const location = useLocation();

  if (location.locationType === LocationType.Area) {
    return <Area />;
  }

  if (location.locationType === LocationType.Point) {
    return <Point />;
  }

  return null;
}
