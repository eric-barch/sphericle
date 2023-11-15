import {
  AreaState,
  PointState,
  TreeState,
  Coordinate,
  Polygon,
  Bounds,
  LocationType,
} from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaChevronRight, FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  parentLocation: TreeState | AreaState;
  location: AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    childLocation: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setMarkers: (markers: Coordinate[]) => void;
  setPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

export default function Area({
  parentLocation,
  location,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setMarkers,
  setPolygons,
  setBounds,
}: AreaProps) {
  function handleFocus() {
    if (parentLocation.locationType === LocationType.Tree) {
      setBounds(location.bounds);
    } else {
      setBounds(parentLocation.bounds);
    }

    setMarkers([]);
    setPolygons(location.polygons);
  }

  function handleClick() {
    toggleLocationOpen(location);
  }

  return (
    <Disclosure defaultOpen={location.open}>
      {({ open }) => {
        return (
          <>
            <div
              className="relative quiz-builder-item quiz-builder-location cursor-pointer"
              tabIndex={0}
              onFocus={handleFocus}
            >
              <div className="quiz-builder-item-decorator-left-1">
                <FaDrawPolygon className="text-gray-400" />
              </div>
              <span>{location.fullName}</span>
              <ToggleOpenButton open={open} onClick={handleClick} />
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocation={location}
                addLocation={addLocation}
                toggleLocationOpen={toggleLocationOpen}
                deleteLocation={deleteLocation}
                setMarkers={setMarkers}
                setPolygons={setPolygons}
                setBounds={setBounds}
              />
            </Disclosure.Panel>
          </>
        );
      }}
    </Disclosure>
  );
}

interface ToggleOpenButtonProps {
  open: boolean;
  onClick: () => void;
}

function ToggleOpenButton({ open, onClick }: ToggleOpenButtonProps) {
  const styles = open ? "rotate-90" : "rotate-0";

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onClick();
    }
  };

  return (
    <Disclosure.Button
      className="quiz-builder-item-decorator-right-1"
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <FaChevronRight className={`${styles} w-4 h-auto`} />
    </Disclosure.Button>
  );
}
