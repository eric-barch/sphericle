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

type FeatureAdderOptionsProps = {
  activeOption: ChildFeature;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  input: string;
  featureType: FeatureType;
};

const FeatureAdderOptions = ({
  activeOption,
  areaSearch,
  pointSearch,
  input,
  featureType,
}: FeatureAdderOptionsProps) => {
  const { quizBuilderDispatch } = useQuizBuilder();

  const placeholder = (() => {
    if (featureType === FeatureType.AREA) {
      if (input !== areaSearch.term) {
        return "Press Enter to Search";
      }

      if (areaSearch.status === SearchStatus.SEARCHING) {
        return "Searching...";
      }

      if (!areaSearch.results || areaSearch.results.length === 0) {
        return "No results found.";
      }
    }

    if (featureType === FeatureType.POINT) {
      if (pointSearch.status === SearchStatus.SEARCHING) {
        return "Searching...";
      }

      if (!pointSearch.results || pointSearch.results.length === 0) {
        return "No results found.";
      }
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
        <OptionsPlaceholder placeholder={placeholder} />
      ) : (
        (() => {
          switch (featureType) {
            case FeatureType.AREA:
              return areaSearch.results.map((featureState: AreaState) => (
                <Option key={featureState.id} featureState={featureState} />
              ));
            case FeatureType.POINT:
              return pointSearch.results.map((featureState: PointState) => (
                <Option key={featureState.id} featureState={featureState} />
              ));
          }
        })()
      )}
    </Combobox.Options>
  );
};

type OptionsPlaceholderProps = {
  placeholder: string;
};

const OptionsPlaceholder = ({ placeholder }: OptionsPlaceholderProps) => {
  return <div className="pl-7 p-1">{placeholder}</div>;
};

type OptionProps = {
  featureState: AreaState | PointState;
};

const Option = ({ featureState }: OptionProps) => {
  const { longName } = featureState;

  return (
    <Combobox.Option
      value={featureState}
      as="div"
      className={({ active }) =>
        `p-1 pl-7 rounded-2xl cursor-pointer ${active ? "bg-gray-600" : ""}`
      }
    >
      {longName}
    </Combobox.Option>
  );
};

export { FeatureAdderOptions };
