"use client";

import {
  AreaState,
  FeatureType,
  PointState,
  QuizBuilderStateDispatchType,
  SearchStatus,
  SubfeatureState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { AreaSearch } from "./use-area-search.hook";
import { PointSearch } from "./use-point-search.hook";
import { useEffect } from "react";

interface FeatureAdderOptionsProps {
  activeOption: SubfeatureState;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  input: string;
  featureType: FeatureType;
}

function FeatureAdderOptions({
  activeOption,
  areaSearch,
  pointSearch,
  input,
  featureType,
}: FeatureAdderOptionsProps) {
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  /**This is hacky, but the best way I've found to work around hardcoded
   * HeadlessUI Combobox behavior. Long term, need to switch to a different
   * accesssible component library. */
  useEffect(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: activeOption,
    });
  }, [activeOption, quizBuilderStateDispatch]);

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

  return (
    <Combobox.Options className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1">
      {placeholder ? (
        <OptionsPlaceholder placeholder={placeholder} />
      ) : (
        (() => {
          switch (featureType) {
            case FeatureType.AREA:
              return areaSearch.results.map((featureState: AreaState) => (
                <Option
                  key={featureState.featureId}
                  featureState={featureState}
                />
              ));
            case FeatureType.POINT:
              return pointSearch.results.map((featureState: PointState) => (
                <Option
                  key={featureState.featureId}
                  featureState={featureState}
                />
              ));
          }
        })()
      )}
    </Combobox.Options>
  );
}

interface OptionsPlaceholderProps {
  placeholder: string;
}

function OptionsPlaceholder({ placeholder }: OptionsPlaceholderProps) {
  return <div className="pl-7 p-1">{placeholder}</div>;
}

interface OptionProps {
  featureState: AreaState | PointState;
}

function Option({ featureState }: OptionProps) {
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
}

export { FeatureAdderOptions };