import { AreaState, PointState } from "@/types";
import { useState } from "react";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";

interface PointProps {
  location: PointState;
  deleteLocation: (targetLocation: PointState) => void;
  renameLocation: (location: PointState, name: string) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export default function Point({
  location,
  deleteLocation,
  renameLocation,
  setDisplayedLocation,
}: PointProps) {
  const [renaming, setRenaming] = useState<boolean>(false);

  function handleFocus() {
    setDisplayedLocation(location);
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
        setDisplayedLocation={setDisplayedLocation}
      />
      <LocationName
        location={location}
        renaming={renaming}
        renameLocation={renameLocation}
        setRenaming={setRenaming}
      />
    </div>
  );
}
