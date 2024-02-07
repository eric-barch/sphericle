"use client";

import { useAllFeatures } from "@/providers";
import {
  AllFeaturesDispatchType,
  FeatureType,
  ParentFeatureState,
  QuizBuilderDispatchType,
  SubfeatureState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useState } from "react";
import { FeatureAdderInput } from "./feature-adder-input";
import { FeatureAdderOptions } from "./feature-adder-options";
import { useQuizBuilder } from "../../providers/quiz-builder-provider";
import { useFeatureSearches } from "./use-feature-searches.hook";

type FeatureAdderProps = {
  inputRef: RefObject<HTMLInputElement>;
  featureState: ParentFeatureState;
};

const FeatureAdder = ({ inputRef, featureState }: FeatureAdderProps) => {
  const { featureId } = featureState;

  const { allFeaturesDispatch } = useAllFeatures();
  const {
    quizBuilder: { selectedFeatureId },
    quizBuilderDispatch: quizBuilderStateDispatch,
  } = useQuizBuilder();

  const { areaSearch, pointSearch } = useFeatureSearches(featureId);

  const isSelected = featureId === selectedFeatureId;

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

  const handleSelectResult = (selectedResult: SubfeatureState) => {
    inputRef.current.value = "";
    setInput("");

    /**When adding several subfeatures to the same parent feature, we want the
     * last added location to stay selected as the user searches for the next
     * one. */
    setSelectParentOnInput(false);

    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE,
      featureId,
      subfeatureState: selectedResult,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderDispatchType.SET_SELECTED,
      featureId: selectedResult.featureId,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: null,
    });

    areaSearch.reset();
    pointSearch.reset();
  };

  const setFeatureType = (featureType: FeatureType) => {
    setFeatureTypeRaw(featureType);

    if (isSelected && selectParentOnInput) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderDispatchType.SET_SELECTED,
        featureId,
      });
    }

    if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(input);
    }
  };

  return (
    <div className="relative" onBlur={handleBlur}>
      <Combobox onChange={handleSelectResult}>
        {({ activeOption }) => (
          <>
            <FeatureAdderInput
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
