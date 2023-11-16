import {
  AreaState,
  Bounds,
  Coordinate,
  LocationType,
  PointState,
  Polygon,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { useEffect } from "react";

interface LocationAdderOptionsProps {
  locationAdderLocationType: LocationType;
  input: string;
  visible: boolean;
  areaSearchTerm: string;
  areaSearchStatus: SearchStatus;
  areaSearchResults: AreaState[] | null;
  pointSearchTerm: string;
  pointSearchStatus: SearchStatus;
  pointSearchResults: PointState[] | null;
  activeOption: AreaState | PointState | null;
  setMarkers: (markers: Coordinate[]) => void;
  setParentPolygons: (polygons: Polygon[]) => void;
  setChildPolygons: (polygons: Polygon[]) => void;
  setBounds: (bounds: Bounds) => void;
}

export default function LocationAdderOptions({
  locationAdderLocationType,
  input,
  visible,
  areaSearchTerm,
  areaSearchStatus,
  areaSearchResults,
  pointSearchTerm,
  pointSearchStatus,
  pointSearchResults,
  activeOption,
  setMarkers,
  setParentPolygons,
  setChildPolygons,
  setBounds,
}: LocationAdderOptionsProps) {
  function renderOptions(
    locationType: LocationType,
    searchTerm: string,
    searchStatus: SearchStatus,
    searchResults: AreaState[] | PointState[] | null,
  ) {
    const outdated = input !== searchTerm;
    const searching = searchStatus === SearchStatus.Searching;
    const noResultsFound = !searching && searchResults?.length === 0;

    if (locationType === LocationType.Area && outdated) {
      return <Placeholder text="Press Enter to search" />;
    } else if (searching) {
      return <Placeholder text="Searching..." />;
    } else if (noResultsFound) {
      return <Placeholder text="No results found" />;
    } else {
      return searchResults?.map((searchResult: AreaState | PointState) => (
        <Combobox.Option key={searchResult.placeId} value={searchResult}>
          {({ active }) => (
            <div
              className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                active ? "bg-gray-600" : ""
              }`}
            >
              {searchResult.fullName}
            </div>
          )}
        </Combobox.Option>
      ));
    }
  }

  const content = (() => {
    if (locationAdderLocationType === LocationType.Area) {
      return renderOptions(
        locationAdderLocationType,
        areaSearchTerm,
        areaSearchStatus,
        areaSearchResults,
      );
    }

    if (locationAdderLocationType === LocationType.Point) {
      return renderOptions(
        locationAdderLocationType,
        pointSearchTerm,
        pointSearchStatus,
        pointSearchResults,
      );
    }
  })();

  useEffect(() => {
    if (activeOption?.locationType === LocationType.Area) {
      setChildPolygons(activeOption.polygons);
    }
  }, [activeOption]);

  return (
    visible &&
    input != "" && (
      <Combobox.Options
        className="bg-gray-500 rounded-3xl p-2 mt-1 mb-1"
        static
      >
        {content}
      </Combobox.Options>
    )
  );
}

interface PlaceholderProps {
  text: string;
}

function Placeholder({ text }: PlaceholderProps) {
  return <div className="pl-6">{text}</div>;
}
