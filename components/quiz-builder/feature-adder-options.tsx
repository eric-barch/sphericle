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
import { useEffect } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { AreaSearch } from "./use-area-search.hook";
import { PointSearch } from "./use-point-search.hook";

interface FeatureAdderOptionsProps {
  activeOption: SubfeatureState;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
}

function FeatureAdderOptions({
  activeOption,
  input,
  featureType,
  areaSearch,
  pointSearch,
}: FeatureAdderOptionsProps) {
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  // TODO: This is hacky, but only way I have been able to work arond HeadlessUI Combobox bug.
  useEffect(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: activeOption,
    });
  }, [quizBuilderStateDispatch, activeOption]);

  const optionsPlaceholderText = (() => {
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
      if (!pointSearch.results || pointSearch.results.length === 0) {
        return "No results found.";
      }
    }

    return null;
  })();

  if (input === "") {
    return null;
  }

  if (featureType === FeatureType.POINT && pointSearch.term === "") {
    return null;
  }

  if (
    featureType === FeatureType.POINT &&
    pointSearch.status === SearchStatus.SEARCHING &&
    pointSearch.results.length < 1
  ) {
    return null;
  }

  return (
    <Combobox.Options className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1">
      {optionsPlaceholderText ? (
        <OptionsPlaceholder text={optionsPlaceholderText} />
      ) : featureType === FeatureType.AREA ? (
        areaSearch.results.map((result: AreaState) => (
          <Option key={result.featureId} feature={result} />
        ))
      ) : (
        pointSearch.results.map((result: PointState) => (
          <Option key={result.featureId} feature={result} />
        ))
      )}
    </Combobox.Options>
  );
}

interface OptionsPlaceholderProps {
  text: string;
}

function OptionsPlaceholder({ text }: OptionsPlaceholderProps) {
  return <div className="pl-7 p-1">{text}</div>;
}

interface OptionProps {
  feature: AreaState | PointState;
}

function Option({ feature }: OptionProps) {
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
}

export { FeatureAdderOptions };
