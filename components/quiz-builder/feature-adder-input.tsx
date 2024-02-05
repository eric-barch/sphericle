import {
  FeatureType,
  ParentFeatureState,
  QuizBuilderStateDispatchType,
  SearchStatus,
} from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { AreaSearch } from "./use-area-search.hook";
import { PointSearch } from "./use-point-search.hook";
import { isAreaState, isRootState } from "@/helpers/feature-type-guards";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { Combobox } from "@headlessui/react";
import { Grid2X2, MapPin } from "lucide-react";

interface FeatureAdderInputProps {
  inputRef: RefObject<HTMLInputElement>;
  parentFeatureState: ParentFeatureState;
  selectParentOnInput: boolean;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setInput: (input: string) => void;
  setFeatureType: (featureType: FeatureType) => void;
}

function FeatureAdderInput({
  inputRef,
  parentFeatureState,
  selectParentOnInput,
  input,
  featureType,
  areaSearch,
  pointSearch,
  setInput,
  setFeatureType,
}: FeatureAdderInputProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const isSelected =
    quizBuilderState.selectedFeatureId === parentFeatureState.featureId;

  const placeholder = (() => {
    if (isRootState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} anywhere`;
    } else if (isAreaState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} in ${
        parentFeatureState.userDefinedName || parentFeatureState.shortName
      }`;
    }
  })();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    if (!isSelected && selectParentOnInput) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId: parentFeatureState.featureId,
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
      <AdvanceFeatureTypeButton
        featureType={featureType}
        setFeatureType={setFeatureType}
      />
      <Combobox.Input
        ref={inputRef}
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-300 pl-8 pr-3 text-ellipsis focus:outline-none"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

interface AdvanceFeatureTypeButtonProps {
  featureType: FeatureType;
  setFeatureType: (featureType: FeatureType) => void;
}

function AdvanceFeatureTypeButton({
  featureType,
  setFeatureType,
}: AdvanceFeatureTypeButtonProps) {
  const handleClick = () => {
    const nextFeatureType =
      featureType === FeatureType.AREA ? FeatureType.POINT : FeatureType.AREA;

    setFeatureType(nextFeatureType);
  };

  return (
    <button
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5 bg-gray-600 text-gray-300 "
      onClick={handleClick}
    >
      {featureType === FeatureType.AREA ? (
        <Grid2X2 className="w-4 h-4" />
      ) : (
        <MapPin className="w-4 h-4" />
      )}
    </button>
  );
}

export { FeatureAdderInput };
