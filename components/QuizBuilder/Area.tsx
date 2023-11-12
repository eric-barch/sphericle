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
  toggleOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
}

export default function Area({
  location,
  addLocation,
  toggleOpen,
  deleteLocation,
}: AreaProps) {
  function handleToggleOpen() {
    toggleOpen(location);
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
              <ToggleOpenButton open={open} toggleOpen={handleToggleOpen} />
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocation={location}
                addLocation={addLocation}
                toggleOpen={toggleOpen}
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
  toggleOpen: () => void;
}

function ToggleOpenButton({ open, toggleOpen }: ToggleOpenButtonProps) {
  const styles = open ? "rotate-90" : "rotate-0";

  return (
    <Disclosure.Button
      className="quiz-builder-item-decorator-right-1"
      onClick={toggleOpen}
    >
      <FaChevronRight className={`${styles} w-4 h-auto`} />
    </Disclosure.Button>
  );
}
