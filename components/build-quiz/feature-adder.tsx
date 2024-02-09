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

type FeatureAdderProps = {
  inputRef: RefObject<HTMLInputElement>;
  feature: ParentFeature;
};

const FeatureAdder = (props: FeatureAdderProps) => {
  const { inputRef, feature } = props;

  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();
  const { areaSearch, pointSearch } = useFeatureSearches(feature.id);

  const isSelected = feature.id === quizBuilder.selectedId;

  const [selectParentOnInput, setSelectParentOnInput] = useState(true);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const featureAdderRef = useRef<HTMLDivElement>(null);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    /**User is done adding features at this level. Select its parent on next
     * input change. */
    setSelectParentOnInput(true);
  };

  const handleSelectResult = (selectedResult: ChildFeature) => {
    inputRef.current.value = "";
    setInput("");

    /**User is adding multiple features at this level. Cancel parent selection
     * on next input change. */
    setSelectParentOnInput(false);

    allFeaturesDispatch({
      type: AllFeaturesDispatchType.ADD_CHILD,
      featureId: feature.id,
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
        featureId: feature.id,
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
            <AdderInput
              ref={inputRef}
              featureAdderRef={featureAdderRef}
              feature={feature}
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

export { FeatureAdder };
