import { AreaState, PointState, TreeState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaChevronRight, FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ) => void;
  setLocationOpen: (targetLocation: AreaState, open: boolean) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export default function Area({
  location,
  addLocation,
  setLocationOpen,
  deleteLocation,
  setDisplayedLocation,
}: AreaProps) {
  function handleFocus() {
    setDisplayedLocation(location);
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
                location={location}
                setLocationOpen={setLocationOpen}
              />
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocation={location}
                addLocation={addLocation}
                setLocationOpen={setLocationOpen}
                deleteLocation={deleteLocation}
                setDisplayedLocation={setDisplayedLocation}
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
  location: AreaState;
  setLocationOpen: (targetLocation: AreaState, open: boolean) => void;
}

function ToggleOpenButton({
  open,
  location,
  setLocationOpen,
}: ToggleOpenButtonProps) {
  const styles = open ? "rotate-90" : "rotate-0";

  function handleClick() {
    const nextOpen = !open;
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
