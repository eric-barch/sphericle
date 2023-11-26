import { PointState } from "@/types";
import { useState } from "react";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";

interface PointProps {
  pointState: PointState;
  rename: (name: string) => void;
  onDelete: () => void;
  setDisplayedLocation: (pointState: PointState) => void;
}

export default function Point({
  pointState,
  rename,
  onDelete,
  setDisplayedLocation,
}: PointProps) {
  const [renaming, setRenaming] = useState<boolean>(false);

  function handleFocus() {
    handleDisplay();
  }

  function handleDisplay() {
    setDisplayedLocation(pointState);
  }

  return (
    <div
      className="relative w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer focus:outline focus:outline-2 focus:outline-red-600"
      tabIndex={0}
      onFocus={handleFocus}
    >
      <EditLocationButton
        className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
        location={pointState}
        setRenaming={setRenaming}
        onDisplay={handleDisplay}
        onDelete={onDelete}
      />
      <LocationName
        location={pointState}
        renaming={renaming}
        setRenaming={setRenaming}
        rename={rename}
      />
    </div>
  );
}
