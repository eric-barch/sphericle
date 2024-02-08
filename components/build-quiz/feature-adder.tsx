"use client";

import { useAllFeatures, useQuizBuilder } from "@/providers";
import {
  AllFeaturesDispatchType,
  FeatureType,
  ParentFeature,
  QuizBuilderDispatchType,
  ChildFeature,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useRef, useState } from "react";
import { FeatureAdderInput } from "./feature-adder-input";
import { FeatureAdderOptions } from "./feature-adder-options";
import { useFeatureSearches } from "../../hooks/use-feature-searches.hook";

type FeatureAdderProps = {
  inputRef: RefObject<HTMLInputElement>;
  featureState: ParentFeature;
};

const FeatureAdder = ({ inputRef, featureState }: FeatureAdderProps) => {
  const { id: featureId } = featureState;

  const { allFeaturesDispatch } = useAllFeatures();
  const {
    quizBuilder: { selectedId: selectedFeatureId },
    quizBuilderDispatch,
  } = useQuizBuilder();

  const { areaSearch, pointSearch } = useFeatureSearches(featureId);

  const isSelected = featureId === selectedFeatureId;

  const featureAdderRef = useRef<HTMLDivElement>(null);

  const [selectParentOnInput, setSelectParentOnInput] = useState(true);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    /**If we blur the FeatureAdder, it means we are no longer adding multiple
     * subfeatures to the same parent feature. The next time the user types
     * in this field, we want to automatically select its parent. */
    setSelectParentOnInput(true);
  };

  const handleSelectResult = (selectedResult: ChildFeature) => {
    inputRef.current.value = "";
    setInput("");

    /**When adding several subfeatures to the same parent feature, we want the
     * last added location to stay selected as the user searches for the next
     * one. */
    setSelectParentOnInput(false);

    allFeaturesDispatch({
      type: AllFeaturesDispatchType.ADD_CHILD,
      featureId,
      childFeature: selectedResult,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_SELECTED,
      featureId: selectedResult.id,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_FEATURE_ADDER,
      feature: null,
    });

    areaSearch.reset();
    pointSearch.reset();
  };

  const setFeatureType = (featureType: FeatureType) => {
    setFeatureTypeRaw(featureType);

    if (isSelected && selectParentOnInput) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId,
      });
    }

    if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(input);
    }
  };

  return (
    <div ref={featureAdderRef} className="relative" onBlur={handleBlur}>
      <Combobox onChange={handleSelectResult}>
        {({ activeOption }) => (
          <>
            <FeatureAdderInput
              featureAdderRef={featureAdderRef}
              inputRef={inputRef}
              featureState={featureState}
              selectParentOnInput={selectParentOnInput}
              input={input}
              featureType={featureType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              setInput={setInput}
              setFeatureType={setFeatureType}
            />
            <FeatureAdderOptions
              activeOption={activeOption}
              input={input}
              featureType={featureType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
            />
          </>
        )}
      </Combobox>
    </div>
  );
};

export { FeatureAdder };
