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
  setLocationOpen: (targetLocation: AreaState, open: boolean) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setMarkers: (markers: Coordinate[]) => void;
  setParentPolygons: (polygons: Polygon[]) => void;
  setChildPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

export default function Area({
  parentLocation,
  location,
  addLocation,
  setLocationOpen,
  deleteLocation,
  setMarkers,
  setParentPolygons,
  setChildPolygons,
  setBounds,
}: AreaProps) {
  function handleFocus() {
    setMarkers([]);

    if (location.open) {
      setBounds(location.bounds);
      setParentPolygons(location.polygons);
      setChildPolygons([]);
    } else {
      if (parentLocation.locationType === LocationType.Tree) {
        setBounds(location.bounds);
        setParentPolygons([]);
      } else {
        setBounds(parentLocation.bounds);
        setParentPolygons(parentLocation.polygons);
      }
      setChildPolygons(location.polygons);
    }
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
              <ToggleOpenButton
                open={open}
                parentLocation={parentLocation}
                location={location}
                setLocationOpen={setLocationOpen}
                setMarkers={setMarkers}
                setParentPolygons={setParentPolygons}
                setChildPolygons={setChildPolygons}
                setBounds={setBounds}
              />
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocation={location}
                addLocation={addLocation}
                setLocationOpen={setLocationOpen}
                deleteLocation={deleteLocation}
                setMarkers={setMarkers}
                setParentPolygons={setParentPolygons}
                setChildPolygons={setChildPolygons}
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
  parentLocation: TreeState | AreaState;
  location: AreaState;
  setLocationOpen: (targetLocation: AreaState, open: boolean) => void;
  setMarkers: (markers: Coordinate[]) => void;
  setParentPolygons: (polygons: Polygon[]) => void;
  setChildPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

function ToggleOpenButton({
  open,
  parentLocation,
  location,
  setLocationOpen,
  setMarkers,
  setParentPolygons,
  setChildPolygons,
  setBounds,
}: ToggleOpenButtonProps) {
  const styles = open ? "rotate-90" : "rotate-0";

  function handleClick() {
    const nextOpen = !open;

    setMarkers([]);

    if (nextOpen) {
      setBounds(location.bounds);
      setParentPolygons(location.polygons);
      setChildPolygons([]);
    } else {
      if (parentLocation.locationType === LocationType.Tree) {
        setBounds(location.bounds);
        setParentPolygons([]);
      } else {
        setBounds(parentLocation.bounds);
        setParentPolygons(parentLocation.polygons);
      }
      setChildPolygons(location.polygons);
    }

    setLocationOpen(location, nextOpen);
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  return (
    <Disclosure.Button
      className="quiz-builder-item-decorator-right-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <FaChevronRight className={`${styles} w-4 h-auto`} />
    </Disclosure.Button>
  );
}
