import { AreaState, PointState } from "@/types";
import { useState } from "react";
import EditLocationButton from "./EditLocationButton";

interface PointProps {
  location: PointState;
  deleteLocation: (targetLocation: PointState) => void;
  setRenaming: (renaming: boolean) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function Point({
  location,
  deleteLocation,
  setFocusedLocation,
}: PointProps) {
  const [renaming, setRenaming] = useState<boolean>(false);

  function handleFocus() {
    setFocusedLocation(location);
  }

  return (
    <div
      className="relative w-full py-1 px-1 rounded-3xl text-left bg-gray-600 cursor-pointer"
      tabIndex={0}
      onFocus={handleFocus}
    >
      <EditLocationButton
        className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
        location={location}
        setRenaming={setRenaming}
        deleteLocation={deleteLocation}
        setFocusedLocation={setFocusedLocation}
      />
      <span className="pl-7">{location.fullName}</span>
    </div>
  );
}
