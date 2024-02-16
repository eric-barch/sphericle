"use client";

import { useFeatureSearches } from "@/hooks/use-feature-searches.hook";
import { useQuiz, useQuizBuilder } from "@/providers";
import {
  QuizDispatchType,
  ChildFeature,
  FeatureType,
  ParentFeature,
  QuizBuilderDispatchType,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { FocusEvent, RefObject, useRef, useState } from "react";
import { SearchInput } from "./search-input";
import { SearchOptions } from "./search-options";

type SearchProps = {
  inputRef: RefObject<HTMLInputElement>;
  parent: ParentFeature;
};

const Search = (props: SearchProps) => {
  const { inputRef, parent } = props;

  const { quizDispatch } = useQuiz();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();
  const { areaSearch, pointSearch } = useFeatureSearches(parent.id);

  const parentIsSelected = parent.id === quizBuilder.selectedId;

  const [selectParentOnInput, setSelectParentOnInput] = useState(true);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const searchRef = useRef<HTMLDivElement>(null);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;

    /**User is done adding features at this level. Select its parent on next
     * input change. */
    setSelectParentOnInput(true);
  };

  const handleSelectOption = (selectedOption: ChildFeature) => {
    console.log("handleSelectOption", selectedOption);

    if (inputRef) {
      console.log('inputRef = ""');
      inputRef.current.value = "";
    }

    setInput("");

    /**User is adding multiple features at this level. Cancel parent selection
     * on next input change. */
    setSelectParentOnInput(false);

    quizDispatch({
      type: QuizDispatchType.ADD_CHILD,
      parentId: parent.id,
      child: selectedOption,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_SELECTED,
      featureId: selectedOption.id,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_SEARCH_OPTION,
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
    <div ref={searchRef} className="relative" onBlur={handleBlur}>
      <Combobox onChange={handleSelectOption}>
        {({ activeOption }) => (
          <>
            <SearchInput
              inputRef={inputRef}
              featureAdderRef={searchRef}
              feature={parent}
              selectParentOnInput={selectParentOnInput}
              input={input}
              featureType={featureType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              setInput={setInput}
              setFeatureType={setFeatureType}
            />
            <SearchOptions
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

export { Search };
