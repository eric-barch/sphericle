import { AreaState, PointState, TreeState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaChevronRight, FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";
import { useState } from "react";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export default function Area({
  location,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setDisplayedLocation,
}: AreaProps) {
  const [focused, setFocused] = useState<boolean>(false);

  function handleFocus(event: React.FocusEvent<HTMLButtonElement>) {
    setTimeout(() => {
      setDisplayedLocation(location);
      setFocused(true);
    }, 0);
  }

  function handleBlur(event: React.FocusEvent<HTMLButtonElement>) {
    setFocused(false);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!focused) {
      event.preventDefault();
    } else {
      toggleLocationOpen(location);
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
        className="relative quiz-builder-item quiz-builder-location cursor-pointer"
        onFocus={handleFocus}
        onBlur={handleBlur}
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
          setDisplayedLocation={setDisplayedLocation}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}
