"use client";

import { useFeatureSearches } from "@/hooks/use-feature-searches.hook";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import {
  AllFeaturesDispatchType,
  ChildFeature,
  FeatureType,
  ParentFeature,
  QuizBuilderDispatchType,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useRef, useState } from "react";
import { AdderInput } from "./adder-input";
import { AdderOptions } from "./adder-options";

type FeatureSearch = {
  inputRef: RefObject<HTMLInputElement>;
  parent: ParentFeature;
};

const FeatureSearch = (props: FeatureSearch) => {
  const { inputRef, parent } = props;

  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();
  const { areaSearch, pointSearch } = useFeatureSearches(parent.id);

  const parentIsSelected = parent.id === quizBuilder.selectedId;

  const [selectParentOnInput, setSelectParentOnInput] = useState(true);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const featureSearchRef = useRef<HTMLDivElement>(null);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;

    /**User is done adding features at this level. Select its parent on next
     * input change. */
    setSelectParentOnInput(true);
  };

  const handleSelectOption = (selectedOption: ChildFeature) => {
    if (inputRef) {
      inputRef.current.value = "";
    }

    setInput("");

    /**User is adding multiple features at this level. Cancel parent selection
     * on next input change. */
    setSelectParentOnInput(false);

    allFeaturesDispatch({
      type: AllFeaturesDispatchType.ADD_CHILD,
      featureId: parent.id,
      childFeature: selectedOption,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_SELECTED,
      featureId: selectedOption.id,
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

    if (parentIsSelected && selectParentOnInput) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: parent.id,
      });
    }

    if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(input);
    }
  };

  return (
    <div ref={featureSearchRef} className="relative" onBlur={handleBlur}>
      <Combobox onChange={handleSelectOption}>
        {({ activeOption }) => (
          <>
            <AdderInput
              ref={inputRef}
              featureAdderRef={featureSearchRef}
              feature={parent}
              selectParentOnInput={selectParentOnInput}
              input={input}
              featureType={featureType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              setInput={setInput}
              setFeatureType={setFeatureType}
            />
            <AdderOptions
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

export { FeatureSearch };
