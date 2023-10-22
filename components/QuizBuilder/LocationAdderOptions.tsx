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
      const noResultsFound =
        input === areaOptions.searchTerm && areaOptions.options?.length === 0;

      if (outdated) {
        return <Placeholder text="Press Enter to search" />;
      } else if (searching) {
        return <Placeholder text="Searching..." />;
      } else if (noResultsFound) {
        return <Placeholder text="No results found" />;
      } else {
        return areaOptions.options?.map((areaOption) => (
          <Combobox.Option key={areaOption.placeId} value={areaOption}>
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
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

  return (
    <>
      {input === "" ? null : (
        <Combobox.Options className="bg-gray-500 rounded-3xl p-2 mt-1 mb-1">
          {content}
        </Combobox.Options>
      )}
    </>
  );
}

interface PlaceholderProps {
  text: string;
}

function Placeholder({ text }: PlaceholderProps) {
  return <div className="pl-6">{text}</div>;
}
