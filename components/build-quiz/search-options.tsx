"use client";

import { useQuizBuilder } from "@/providers";
import {
  AreaSearch,
  AreaState,
  FeatureType,
  PointSearch,
  PointState,
  QuizBuilderDispatchType,
  SearchStatus,
  ChildFeature,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { useEffect } from "react";

type SearchOptionsProps = {
  activeOption: ChildFeature;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
};

const SearchOptions = (props: SearchOptionsProps) => {
  const { activeOption, input, featureType, areaSearch, pointSearch } = props;

  const { quizBuilderDispatch } = useQuizBuilder();

  const placeholder = (() => {
    if (featureType === FeatureType.AREA) {
      if (input !== areaSearch.term) return "Press Enter to Search";
      if (areaSearch.status === SearchStatus.SEARCHING) return "Searching...";
      if (areaSearch.results?.length === 0) return "No results found.";
    }

    if (featureType === FeatureType.POINT) {
      if (pointSearch.status === SearchStatus.SEARCHING) return "Searching...";
      if (pointSearch.results?.length === 0) return "No results found.";
    }
  })();

  /**TODO: This is hacky, but the best way I've found to work around hardcoded
   * HeadlessUI Combobox behavior. Long term, probably need to switch to
   * a different accesssible component library. */
  useEffect(() => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_SEARCH_OPTION,
      feature: activeOption,
    });
  }, [activeOption, quizBuilderDispatch]);

  return (
    <Combobox.Options className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1">
      {placeholder ? (
        <div className="pl-7 p-1">{placeholder}</div>
      ) : (
        (() => {
          if (featureType === FeatureType.AREA)
            return areaSearch.results.map((area: AreaState) => (
              <SearchOption key={area.id} feature={area} />
            ));
          if (featureType === FeatureType.POINT)
            return pointSearch.results.map((point: PointState) => (
              <SearchOption key={point.id} feature={point} />
            ));
        })()
      )}
    </Combobox.Options>
  );
};

type SearchOptionProps = {
  feature: AreaState | PointState;
};

const SearchOption = (props: SearchOptionProps) => {
  const { feature } = props;

  return (
    <Combobox.Option
      value={feature}
      as="div"
      className={({ active }) =>
        `p-1 pl-7 rounded-2xl cursor-pointer ${active ? "bg-gray-600" : ""}`
      }
    >
      {feature.longName}
    </Combobox.Option>
  );
};

export { SearchOptions };
