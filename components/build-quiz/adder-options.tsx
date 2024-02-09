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

type AdderOptionsProps = {
  activeOption: ChildFeature;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
};

const AdderOptions = (props: AdderOptionsProps) => {
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

  /**This is hacky, but the best way I've found to work around hardcoded
   * HeadlessUI Combobox behavior. Long term, probably need to switch to
   * a different accesssible component library. */
  useEffect(() => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_FEATURE_ADDER,
      feature: activeOption,
    });
  }, [activeOption, quizBuilderDispatch]);

  return (
    <Combobox.Options className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1">
      {placeholder ? (
        <div className="pl-7 p-1">{placeholder}</div>
      ) : (
        (() => {
          switch (featureType) {
            case FeatureType.AREA:
              return areaSearch.results.map((area: AreaState) => (
                <Option key={area.id} feature={area} />
              ));
            case FeatureType.POINT:
              return pointSearch.results.map((point: PointState) => (
                <Option key={point.id} feature={point} />
              ));
          }
        })()
      )}
    </Combobox.Options>
  );
};

type OptionProps = {
  feature: AreaState | PointState;
};

const Option = (props: OptionProps) => {
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

export { AdderOptions };
