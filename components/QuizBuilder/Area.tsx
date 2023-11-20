import { AreaState, PointState, TreeState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaChevronRight, FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";
import { useState, useEffect } from "react";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function Area({
  location,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setFocusedLocation,
}: AreaProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);

  function handleFocus() {
    if (!mouseDown) {
      setWillToggle(true);
    }

    setFocusedLocation(location);
  }

  function handleBlur() {
    setWillToggle(false);
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (willToggle) {
      toggleLocationOpen(location);
    } else {
      event.preventDefault();
      setWillToggle(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <Disclosure defaultOpen={location.open}>
      <Disclosure.Button
        className={`"relative quiz-builder-item quiz-builder-location cursor-pointer focus:outline outline-2 outline-red-600`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className="quiz-builder-item-decorator-left-1">
          <FaDrawPolygon className="text-gray-400" />
        </div>
        <span>{location.fullName}</span>
        <div className="quiz-builder-item-decorator-right-1">
          <FaChevronRight
            className={`${location.open ? "rotate-90" : ""} w-4 h-auto`}
          />
        </div>
      </Disclosure.Button>
      <Disclosure.Panel>
        <Locations
          className="ml-10"
          parentLocation={location}
          addLocation={addLocation}
          toggleLocationOpen={toggleLocationOpen}
          deleteLocation={deleteLocation}
          setFocusedLocation={setFocusedLocation}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}
