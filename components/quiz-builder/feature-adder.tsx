"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import {
  AllFeaturesDispatchType,
  FeatureType,
  ParentFeatureState,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useState } from "react";
import { FeatureAdderInput } from "./feature-adder-input";
import { FeatureAdderOptions } from "./feature-adder-options";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { useFeatureSearches } from "./use-feature-searches.hook";

interface FeatureAdderProps {
  inputRef: RefObject<HTMLInputElement>;
  featureState: ParentFeatureState;
}

function FeatureAdder({ inputRef, featureState }: FeatureAdderProps) {
  const { featureId } = featureState;

  const { allFeaturesDispatch } = useAllFeatures();
  const {
    quizBuilderState: { selectedFeatureId },
    quizBuilderStateDispatch,
  } = useQuizBuilderState();

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

  const handleSelectOption = (selectedFeatureState: SubfeatureState) => {
    if (inputRef?.current) {
      inputRef.current.value = "";
    }

    setInput("");

    /**When adding several subfeatures to the same parent feature, we want the
     * last added location to stay selected as the user searches for the next
     * one. */
    setSelectParentOnInput(false);

    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE,
      featureId,
      subfeatureState: selectedFeatureState,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
      featureId: selectedFeatureState.featureId,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: null,
    });

    areaSearch.reset();
    pointSearch.reset();
  };

  const setFeatureType = (featureType: FeatureType) => {
    setFeatureTypeRaw(featureType);

    if (isSelected && selectParentOnInput) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId,
      });
    }

    if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(input);
    }
  };

  return (
    <div className="relative" onBlur={handleBlur}>
      <Combobox onChange={handleSelectOption}>
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
}

export { FeatureAdder };
