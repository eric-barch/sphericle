"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  AllFeaturesDispatchType,
  AreaState,
  FeatureType,
  PointState,
  QuizBuilderStateDispatchType,
  RootState,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { Grid2X2, MapPin } from "lucide-react";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
  useState,
} from "react";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import { AreaSearch } from "./use-area-search.hook";
import useFeatureSearches from "./use-feature-searches.hook";
import { PointSearch } from "./use-point-search.hook";

interface FeatureAdderProps {
  inputRef?: RefObject<HTMLInputElement>;
  parentFeatureId: string;
}

export default function FeatureAdder({
  inputRef,
  parentFeatureId,
}: FeatureAdderProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();
  const { areaSearch, pointSearch } = useFeatureSearches(parentFeatureId);

  const [parentFeature, setParentFeature] = useState<RootState | AreaState>(
    null,
  );

  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [featureType, setFeatureType] = useState<FeatureType>(FeatureType.AREA);
  const [input, setInput] = useState<string>("");
  const [optionSelected, setOptionSelected] = useState<boolean>(false);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }

  function handleFocus(event: FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(true);

      if (!optionSelected) {
        if (parentFeature.featureType === FeatureType.ROOT) {
          quizBuilderStateDispatch({
            type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
            selectedFeatureId: null,
          });
        } else if (parentFeature.featureType === FeatureType.AREA) {
          quizBuilderStateDispatch({
            type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
            selectedFeatureId: parentFeatureId,
          });
        }
      }
    } else {
      setOptionSelected(false);
    }
  }

  function handleChange(subfeature: AreaState | PointState) {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.ADD_SUBFEATURE,
      parentFeatureId,
      subfeature,
    });

    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
      selectedFeatureId: subfeature.id,
    });

    if (inputRef) {
      inputRef.current.value = "";
    }

    setOptionSelected(true);
    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  useEffect(() => {
    if (!allFeatures || !parentFeatureId) {
      return;
    }

    const parentFeature = allFeatures.get(parentFeatureId);

    if (
      parentFeature?.featureType === FeatureType.ROOT ||
      parentFeature?.featureType === FeatureType.AREA
    ) {
      setParentFeature(parentFeature);
      return;
    }

    setParentFeature(null);
  }, [allFeatures, parentFeatureId]);

  if (
    !parentFeature ||
    parentFeature.featureType === FeatureType.ROOT ||
    (parentFeature.featureType === FeatureType.AREA &&
      parentFeature.isAdding) ||
    parentFeature.subfeatureIds.size <= 0
  ) {
    return (
      <div className="relative" onBlur={handleBlur} onFocus={handleFocus}>
        <Combobox onChange={handleChange}>
          {({ activeOption }) => (
            <>
              <Input
                inputRef={inputRef}
                parentFeatureId={parentFeatureId}
                input={input}
                featureType={featureType}
                areaSearch={areaSearch}
                pointSearch={pointSearch}
                setInput={setInput}
                setFeatureType={setFeatureType}
              />
              <Options
                parentFeatureId={parentFeatureId}
                activeOption={activeOption}
                input={input}
                featureType={featureType}
                areaSearch={areaSearch}
                pointSearch={pointSearch}
                featureAdderFocused={isFocused}
              />
            </>
          )}
        </Combobox>
      </div>
    );
  }

  return null;
}

interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  parentFeatureId: string;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setInput: (input: string) => void;
  setFeatureType: (featureType: FeatureType) => void;
}

function Input({
  inputRef,
  parentFeatureId,
  input,
  featureType,
  areaSearch,
  pointSearch,
  setInput,
  setFeatureType,
}: InputProps) {
  const { allFeatures } = useAllFeatures();

  const parentFeature = allFeatures.get(parentFeatureId);

  if (
    parentFeature.featureType !== FeatureType.ROOT &&
    parentFeature.featureType !== FeatureType.AREA
  ) {
    throw new Error("parentFeature must be of type ROOT or AREA.");
  }

  const placeholder =
    parentFeature.featureType === FeatureType.ROOT
      ? `Add ${featureType.toLowerCase()} anywhere`
      : `Add ${featureType.toLowerCase()} in ${
          parentFeature.userDefinedName || parentFeature.shortName
        }`;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);

    if (event.target.value === "") {
      pointSearch.reset();
    } else if (featureType === FeatureType.POINT) {
      pointSearch.setTerm(event.target.value);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (featureType === FeatureType.AREA && input !== areaSearch.term) {
      event.preventDefault();
      areaSearch.setTerm(input);
    }
  }

  // override HeadlessUI Combobox Tab behavior
  function handleTab(event: KeyboardEvent<HTMLInputElement>) {
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
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleEnter(event);
    }

    // override HeadlessUI Combobox Tab behavior
    if (event.key === "Tab") {
      handleTab(event);
    }
  }

  return (
    <div className="relative">
      <ToggleAreaPointButton
        input={input}
        featureType={featureType}
        pointSearch={pointSearch}
        setFeatureType={setFeatureType}
      />
      <Combobox.Input
        ref={inputRef}
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-300 pl-8 pr-3 text-ellipsis focus:outline-none"
        displayValue={() => input}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

interface ToggleAreaPointButtonProps {
  input: string;
  featureType: FeatureType;
  pointSearch: PointSearch;
  setFeatureType: (featureType: FeatureType) => void;
}

function ToggleAreaPointButton({
  input,
  featureType,
  pointSearch,
  setFeatureType,
}: ToggleAreaPointButtonProps) {
  function handleClick() {
    const nextFeatureType =
      featureType === FeatureType.AREA ? FeatureType.POINT : FeatureType.AREA;

    setFeatureType(nextFeatureType);

    if (nextFeatureType === FeatureType.POINT && input !== pointSearch.term) {
      pointSearch.setTerm(input);
    }
  }

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

interface OptionsProps {
  parentFeatureId: string;
  activeOption: AreaState | PointState;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  featureAdderFocused: boolean;
}

function Options({
  parentFeatureId,
  activeOption,
  input,
  featureType,
  areaSearch,
  pointSearch,
  featureAdderFocused,
}: OptionsProps) {
  const { allFeatures } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const parentFeature = allFeatures.get(parentFeatureId);

  if (
    parentFeature.featureType !== FeatureType.ROOT &&
    parentFeature.featureType !== FeatureType.AREA
  ) {
    throw new Error("parentFeature must be of type ROOT or AREA.");
  }

  useEffect(() => {
    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION,
      activeSearchOption: activeOption,
    });
  }, [quizBuilderStateDispatch, activeOption]);

  function renderOptionsContent() {
    if (featureType === FeatureType.AREA) {
      if (input !== areaSearch.term) {
        return <OptionsSubstitute>Press Enter to Search</OptionsSubstitute>;
      }
      if (areaSearch.status === SearchStatus.SEARCHING) {
        return <OptionsSubstitute>Searching...</OptionsSubstitute>;
      }
      if (areaSearch.results.length === 0) {
        return <OptionsSubstitute>No results found.</OptionsSubstitute>;
      }
      return areaSearch.results.map((result: AreaState) => (
        <Option key={result.id} feature={result} />
      ));
    } else if (featureType === FeatureType.POINT) {
      if (pointSearch.results.length === 0) {
        return <OptionsSubstitute>No results found.</OptionsSubstitute>;
      }
      return pointSearch.results.map((result: PointState) => (
        <Option key={result.id} feature={result} />
      ));
    }
  }

  function renderOptions() {
    if (input === "") {
      return null;
    }

    if (!featureAdderFocused) {
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
      <Combobox.Options
        className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1"
        static
      >
        {renderOptionsContent()}
      </Combobox.Options>
    );
  }

  return <>{renderOptions()}</>;
}

function OptionsSubstitute({ children }: { children: ReactNode }) {
  return <div className="pl-7 p-1">{children}</div>;
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
