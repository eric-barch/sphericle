import { AreaSearchResults, LocationType, PointSearchResults } from "@/types";
import { Combobox } from "@headlessui/react";

interface LocationAdderOptionsProps {
  locationAdderLocationType: LocationType;
  input: string;
  areaSearchResults: AreaSearchResults;
  pointSearchResults: PointSearchResults;
}

export default function LocationAdderOptions({
  locationAdderLocationType,
  input,
  areaSearchResults,
  pointSearchResults,
}: LocationAdderOptionsProps) {
  const content = (() => {
    if (locationAdderLocationType === LocationType.Area) {
      const outdated = input !== areaSearchResults.searchTerm;
      const searching =
        input === areaSearchResults.searchTerm &&
        areaSearchResults.searchResults === null;
      const noResultsFound =
        input === areaSearchResults.searchTerm &&
        areaSearchResults.searchResults?.length === 0;

      if (outdated) {
        return <Placeholder text="Press Enter to search" />;
      } else if (searching) {
        return <Placeholder text="Searching..." />;
      } else if (noResultsFound) {
        return <Placeholder text="No results found" />;
      } else {
        return areaSearchResults.searchResults?.map((searchResult) => (
          <Combobox.Option key={searchResult.placeId} value={searchResult}>
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {searchResult.displayName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    }

    if (locationAdderLocationType === LocationType.Point) {
      const noResultsFound =
        input === pointSearchResults.searchTerm &&
        pointSearchResults.searchResults?.length === 0;

      if (noResultsFound) {
        return <Placeholder text="No results found" />;
      } else {
        return pointSearchResults.searchResults?.map((pointSearchResult) => (
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
