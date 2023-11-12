import { AreaState, PointState, RootState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaChevronRight, FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: RootState | AreaState,
    childLocation: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
}

export default function Area({
  location,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
}: AreaProps) {
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
