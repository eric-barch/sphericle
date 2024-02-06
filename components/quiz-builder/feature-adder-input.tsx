"use client";

import { isAreaState, isRootState } from "@/helpers/feature-type-guards";
import {
  FeatureType,
  ParentFeatureState,
  QuizBuilderStateDispatchType,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { Grid2X2, MapPin } from "lucide-react";
import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { AreaSearch } from "./use-area-search.hook";
import { PointSearch } from "./use-point-search.hook";

interface FeatureAdderInputProps {
  featureState: ParentFeatureState;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  selectParentOnInput: boolean;
  input: string;
  featureType: FeatureType;
  inputRef: RefObject<HTMLInputElement>;
  setFeatureType: (featureType: FeatureType) => void;
  setInput: (input: string) => void;
}

function FeatureAdderInput({
  featureState,
  areaSearch,
  pointSearch,
  selectParentOnInput,
  input,
  featureType,
  inputRef,
  setFeatureType,
  setInput,
}: FeatureAdderInputProps) {
  const { featureId } = featureState;

  const {
    quizBuilderState: { selectedFeatureId },
    quizBuilderStateDispatch,
  } = useQuizBuilderState();

  const isSelected = featureId === selectedFeatureId;
  const placeholder = (() => {
    if (isRootState(featureState)) {
      return `Add ${featureType.toLowerCase()} anywhere`;
    } else if (isAreaState(featureState)) {
      const featureName =
        featureState.userDefinedName || featureState.shortName;

      return `Add ${featureType.toLowerCase()} in ${featureName}`;
    }
  })();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    if (!isSelected && selectParentOnInput) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId: featureState.featureId,
      });
    }

    if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(event.target.value);
    }
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      // TODO: think this condition is prone to race conditions
      featureType === FeatureType.AREA &&
      areaSearch.status === SearchStatus.SEARCHING
    ) {
      event.preventDefault();
      return;
    }

    if (
      // TODO: think this condition is prone to race conditions
      featureType === FeatureType.POINT &&
      pointSearch.status === SearchStatus.SEARCHING
    ) {
      event.preventDefault();
      return;
    }

    if (featureType === FeatureType.AREA && input !== areaSearch.term) {
      event.preventDefault();
      areaSearch.setTerm(input);
    }
  };

  // override HeadlessUI Combobox Tab advance behavior
  const handleTab = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const focusableElements = Array.from(
      document.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
    const currentIndex = focusableElements.indexOf(event.currentTarget);

    if (event.shiftKey) {
      const previousElement =
        focusableElements[currentIndex - 1] ||
        focusableElements[focusableElements.length - 1];
      (previousElement as HTMLElement).focus();
    } else {
      const nextElement =
        focusableElements[currentIndex + 1] || focusableElements[0];
      (nextElement as HTMLElement).focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEnter(event);
    }

    // override HeadlessUI Combobox Tab behavior
    if (event.key === "Tab") {
      handleTab(event);
    }
  };

  return (
    <div className="relative">
      <NextFeatureTypeButton
        featureType={featureType}
        setFeatureType={setFeatureType}
      />
      <Combobox.Input
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-300 pl-8 pr-3 text-ellipsis focus:outline-none"
        placeholder={placeholder}
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

interface NextFeatureTypeButtonProps {
  featureType: FeatureType;
  setFeatureType: (featureType: FeatureType) => void;
}

function NextFeatureTypeButton({
  featureType,
  setFeatureType,
}: NextFeatureTypeButtonProps) {
  const handleClick = () => {
    const nextFeatureType = (() => {
      switch (featureType) {
        case FeatureType.AREA:
          return FeatureType.POINT;
        case FeatureType.POINT:
          return FeatureType.AREA;
      }
    })();

    setFeatureType(nextFeatureType);
  };

  return (
    <button
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5 bg-gray-600 text-gray-300 "
      onClick={handleClick}
    >
      {(() => {
        switch (featureType) {
          case FeatureType.AREA:
            return <Grid2X2 className="w-4 h-4" />;
          case FeatureType.POINT:
            return <MapPin className="w-4 h-4" />;
        }
      })()}
    </button>
  );
}

export { FeatureAdderInput };
