"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import { isRootState } from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  FeatureType,
  ParentFeatureState,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { useFeatureSearches } from "./use-feature-searches.hook";
import { FeatureAdderInput } from "./feature-adder-input";

interface FeatureAdderProps {
  featureAdderInputRef: RefObject<HTMLInputElement>;
  parentFeatureState: ParentFeatureState;
}

function FeatureAdder({
  featureAdderInputRef,
  parentFeatureState,
}: FeatureAdderProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();
  const { areaSearch, pointSearch } = useFeatureSearches(
    parentFeatureState.featureId,
  );

  const [selectParentOnInput, setSelectParentOnInput] = useState(true);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setSelectParentOnInput(true);
  };

  const handleSelectOption = (subfeatureState: SubfeatureState) => {
    if (featureAdderInputRef?.current) {
      featureAdderInputRef.current.value = "";
    }

    setInput("");

    areaSearch.reset();
    pointSearch.reset();

    setSelectParentOnInput(false);

    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE,
      featureId: parentFeatureState.featureId,
      subfeatureState: subfeatureState,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
      featureState: subfeatureState,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: null,
    });
  };

  const setFeatureType = (featureType: FeatureType) => {
    setFeatureTypeRaw(featureType);

    if (
      quizBuilderState.selectedFeatureId !== parentFeatureState.featureId &&
      selectParentOnInput
    ) {
      if (isRootState(parentFeatureState)) {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
          featureId: null,
        });
      } else {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
          featureId: parentFeatureState.featureId,
        });
      }
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
              inputRef={featureAdderInputRef}
              parentFeatureState={parentFeatureState}
              selectParentOnInput={selectParentOnInput}
              input={input}
              featureType={featureType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              setInput={setInput}
              setFeatureType={setFeatureType}
            />
            <Options
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
