import { AreaState, PointState, QuizState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import { Locations } from "./Locations";
import LocationText from "./LocationText";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: QuizState | AreaState,
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
        className={`relative w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600  focus:outline outline-2 outline-red-600`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <EditLocationButton className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5" />
        <LocationText text={location.displayName} />
        <OpenChevron
          className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1"
          open={location.open}
        />
      </Disclosure.Button>
      <Disclosure.Panel>
        <Locations
          className="ml-10"
          parent={location}
          addLocation={addLocation}
          toggleLocationOpen={toggleLocationOpen}
          deleteLocation={deleteLocation}
          setFocusedLocation={setFocusedLocation}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}

interface OpenChevronProps {
  className?: string;
  open: boolean;
}

function OpenChevron({ className, open }: OpenChevronProps) {
  return (
    <div className={className}>
      <FaChevronRight className={`${open ? "rotate-90" : ""} w-4 h-4`} />
    </div>
  );
}
