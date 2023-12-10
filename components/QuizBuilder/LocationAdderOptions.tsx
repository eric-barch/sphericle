"use client";

import { AreaState, LocationType, PointState, SearchStatus } from "@/types";
import { AreaSearch } from "./use-area-search.hook";
import { PointSearch } from "./use-point-search.hook";
import { useQuiz } from "@/components/QuizProvider";
import { Combobox } from "@headlessui/react";

interface LocationAdderOptionsProps {
  parentId: string;
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  locationAdderFocused: boolean;
}

export function LocationAdderOptions({
  parentId,
  input,
  locationType,
  areaSearch,
  pointSearch,
  locationAdderFocused,
}: LocationAdderOptionsProps) {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId];

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  function renderOptionsContent() {
    if (locationType === LocationType.AREA) {
      if (input !== areaSearch.term) {
        return <OptionsSubstitute text="Press Enter to Search" />;
      }
      if (areaSearch.status === SearchStatus.SEARCHING) {
        return <OptionsSubstitute text="Searching..." />;
      }
      if (areaSearch.results.length === 0) {
        return <OptionsSubstitute text="No results found." />;
      }
      return areaSearch.results.map((result: AreaState) => (
        <Option key={result.id} location={result} />
      ));
    } else if (locationType === LocationType.POINT) {
      if (pointSearch.results.length === 0) {
        return <OptionsSubstitute text="No results found." />;
      }
      return pointSearch.results.map((result: PointState) => (
        <Option key={result.id} location={result} />
      ));
    }
  }

  function renderOptions() {
    if (input === "") {
      return null;
    }

    if (!locationAdderFocused) {
      return null;
    }

    if (locationType === LocationType.POINT && pointSearch.term === "") {
      return null;
    }

    if (
      locationType === LocationType.POINT &&
      pointSearch.status === SearchStatus.SEARCHING &&
      pointSearch.results.length < 1
    ) {
      return null;
    }

    return (
      <Combobox.Options
        className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1"
        static
      >
        {renderOptionsContent()}
      </Combobox.Options>
    );
  }

  return <>{renderOptions()}</>;
}

function OptionsSubstitute({ text }: { text: string }) {
  return <div className="pl-7 p-1">{text}</div>;
}

interface OptionProps {
  location: AreaState | PointState;
}

function Option({ location }: OptionProps) {
  return (
    <Combobox.Option value={location}>
      <div className="p-1 pl-7 rounded-3xl cursor-pointer bg-gray-600">
        {location.longName}
      </div>
    </Combobox.Option>
  );
}
