import { Combobox } from "@headlessui/react";
import { AreaOptionsState, LocationType, PointState } from "./types";
import { useEffect } from "react";

interface LocationAdderOptionsProps {
  locationAdderLocationType: LocationType;
  input: string;
  areaOptions: AreaOptionsState;
  pointOptions: PointState[];
}

export default function LocationAdderOptions({
  locationAdderLocationType,
  input,
  areaOptions,
  pointOptions,
}: LocationAdderOptionsProps) {
  const content = (() => {
    if (locationAdderLocationType === LocationType.Area) {
      const outdated = input !== areaOptions.searchTerm;
      const searching =
        input === areaOptions.searchTerm && areaOptions.options === null;

      if (outdated) {
        return <Placeholder text="Press Enter to search" />;
      } else if (searching) {
        return <Placeholder text="Searching..." />;
      } else {
        return areaOptions.options?.map((areaOption) => (
          <Combobox.Option key={areaOption.placeId} value={areaOption}>
            {({ active }) => (
              <div
                className={`p-1 pl-7 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {areaOption.displayName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    }

    if (locationAdderLocationType === LocationType.Point) {
    }
  })();

  return <>{input === "" ? null : content}</>;
}

interface PlaceholderProps {
  text: string;
}

function Placeholder({ text }: PlaceholderProps) {
  return <div className="pl-7">{text}</div>;
}
