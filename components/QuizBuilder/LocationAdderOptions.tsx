import { Area, LocationType, Point, SearchStatus } from "@/types";
import { Combobox } from "@headlessui/react";

interface LocationAdderOptionsProps {
  locationAdderLocationType: LocationType;
  input: string;
  areaSearchTerm: string;
  areaSearchStatus: SearchStatus;
  areaSearchResults: Area[] | null;
  pointSearchTerm: string;
  pointSearchStatus: SearchStatus;
  pointSearchResults: Point[] | null;
}

export default function LocationAdderOptions({
  locationAdderLocationType,
  input,
  areaSearchTerm,
  areaSearchStatus,
  areaSearchResults,
  pointSearchTerm,
  pointSearchStatus,
  pointSearchResults,
}: LocationAdderOptionsProps) {
  const content = (() => {
    if (locationAdderLocationType === LocationType.Area) {
      const outdated = input !== areaSearchTerm;
      const searching = areaSearchStatus === SearchStatus.Searching;
      const noResultsFound = !searching && areaSearchResults?.length === 0;

      if (outdated) {
        return <Placeholder text="Press Enter to search" />;
      } else if (searching) {
        return <Placeholder text="Searching..." />;
      } else if (noResultsFound) {
        return <Placeholder text="No results found" />;
      } else {
        return areaSearchResults?.map((areaSearchResult) => (
          <Combobox.Option
            key={areaSearchResult.placeId}
            value={areaSearchResult}
          >
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {areaSearchResult.displayName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    }

    if (locationAdderLocationType === LocationType.Point) {
      const outdated = input !== pointSearchTerm;
      const searching = pointSearchStatus === SearchStatus.Searching;
      const noResultsFound = !searching && pointSearchResults?.length === 0;

      if (searching) {
        return <Placeholder text="Searching..." />;
      } else if (noResultsFound) {
        return <Placeholder text="No results found" />;
      } else {
        return pointSearchResults?.map((pointSearchResult) => (
          <Combobox.Option
            key={pointSearchResult.placeId}
            value={pointSearchResult}
          >
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {pointSearchResult.displayName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    }
  })();

  return (
    <>
      {input === "" ? null : (
        <Combobox.Options
          className="bg-gray-500 rounded-3xl p-2 mt-1 mb-1"
          static
        >
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
