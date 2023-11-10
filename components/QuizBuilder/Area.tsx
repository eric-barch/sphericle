import { AreaState, LocationType, PointState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { FaDrawPolygon } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  displayName: string;
  fullName: string;
  open: boolean;
  sublocations: (AreaState | PointState)[];
}

export default function Area({
  displayName,
  fullName,
  open,
  sublocations,
}: AreaProps) {
  return (
    <Disclosure defaultOpen={open}>
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
              <span>{fullName}</span>
            </div>
            <Disclosure.Panel>
              <Locations
                className="ml-10"
                parentLocationType={LocationType.Area}
                parentLocationDisplayName={displayName}
                locations={sublocations}
              />
            </Disclosure.Panel>
          </>
        );
      }}
    </Disclosure>
  );
}
