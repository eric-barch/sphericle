import { AreaState, LocationType, PointState, RootState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: RootState | AreaState,
    childLocation: AreaState | PointState,
  ) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
}

export default function Area({
  location,
  addLocation,
  deleteLocation,
}: AreaProps) {
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
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocation={location}
                addLocation={addLocation}
                deleteLocation={deleteLocation}
              />
            </Disclosure.Panel>
          </>
        );
      }}
    </Disclosure>
  );
}
