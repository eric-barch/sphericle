"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  AreaState,
  FeatureType,
  ParentFeatureState,
  PointState,
  QuizBuilderStateDispatchType,
  SearchStatus,
  SubfeatureState,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { Grid2X2, MapPin } from "lucide-react";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import { AreaSearch } from "./use-area-search.hook";
import useFeatureSearches from "./use-feature-searches.hook";
import { PointSearch } from "./use-point-search.hook";
import { set } from "lodash";

interface FeatureAdderProps {
  parentFeatureState: ParentFeatureState;
}

export default function FeatureAdder({
  parentFeatureState,
}: FeatureAdderProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();
  const { areaSearch, pointSearch } = useFeatureSearches(
    parentFeatureState.featureId,
  );

  const [isFocused, setIsFocused] = useState(false);
  const [featureType, setFeatureTypeRaw] = useState<FeatureType>(
    FeatureType.AREA,
  );
  const [input, setInput] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setIsFocused(false);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      if (isFocused) {
        return;
      }

      setIsFocused(true);

      if (isRootState(parentFeatureState)) {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
          featureState: null,
        });
      }

      if (isSubfeatureState(parentFeatureState)) {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
          featureState: parentFeatureState,
        });
      }
    },
    [isFocused, parentFeatureState, quizBuilderStateDispatch],
  );

  const handleSelectOption = useCallback(
    (subfeatureState: SubfeatureState) => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setInput("");

      areaSearch.reset();
      pointSearch.reset();

      allFeaturesDispatch({
        dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE,
        featureState: parentFeatureState,
        subfeatureState,
      });

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureState: subfeatureState,
      });

      if (isParentFeatureState(subfeatureState)) {
        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_IS_ADDING,
          featureState: subfeatureState,
          isAdding: true,
        });
      }
    },
    [
      allFeaturesDispatch,
      areaSearch,
      parentFeatureState,
      pointSearch,
      quizBuilderStateDispatch,
    ],
  );

  const setFeatureType = useCallback(
    (featureType: FeatureType) => {
      setFeatureTypeRaw(featureType);

      if (featureType === FeatureType.POINT) {
        pointSearch.setTerm(input);
      }
    },
    [input, pointSearch],
  );

  if (
    !isRootState(parentFeatureState) &&
    !quizBuilderState.addingFeatureIds.has(parentFeatureState.featureId)
  ) {
    return null;
  }

  return (
    <div className="relative">
      <Combobox onChange={handleSelectOption}>
        {({ activeOption }) => (
          <div onBlur={handleBlur} onFocus={handleFocus}>
            <Input
              inputRef={inputRef}
              parentFeatureState={parentFeatureState}
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
          </div>
        )}
      </Combobox>
    </div>
  );
}

interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  parentFeatureState: ParentFeatureState;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setInput: (input: string) => void;
  setFeatureType: (featureType: FeatureType) => void;
}

function Input({
  inputRef,
  parentFeatureState,
  input,
  featureType,
  areaSearch,
  pointSearch,
  setInput,
  setFeatureType,
}: InputProps) {
  const placeholder = (() => {
    if (isRootState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} anywhere`;
    } else if (isAreaState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} in ${
        parentFeatureState.userDefinedName || parentFeatureState.shortName
      }`;
    }
  })();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);

      if (featureType === FeatureType.POINT) {
        pointSearch.setTerm(event.target.value);
      }
    },
    [featureType, pointSearch, setInput],
  );

  // TODO: this is broken.
  const handleEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        featureType === FeatureType.AREA &&
        areaSearch.status === SearchStatus.SEARCHING
      ) {
        event.preventDefault();
        return;
      }

      if (
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
    },
    [areaSearch, pointSearch, featureType, input],
  );

  // override HeadlessUI Combobox Tab behavior
  const handleTab = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
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
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleEnter(event);
      }

      // override HeadlessUI Combobox Tab behavior
      if (event.key === "Tab") {
        handleTab(event);
      }
    },
    [handleEnter, handleTab],
  );

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
  const handleClick = useCallback(() => {
    const nextFeatureType =
      featureType === FeatureType.AREA ? FeatureType.POINT : FeatureType.AREA;

    setFeatureType(nextFeatureType);
  }, [featureType, setFeatureType]);

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
  activeOption: SubfeatureState;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
}

function Options({
  activeOption,
  input,
  featureType,
  areaSearch,
  pointSearch,
}: OptionsProps) {
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  /**TODO: This is hacky, but only way I have been able to work arond HeadlessUI Combobox bug.
   * Probably need to replace with Radix UI.*/
  useEffect(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED,
      featureState: activeOption,
    });
  }, [quizBuilderStateDispatch, activeOption]);

  const optionsPlaceholderText = useMemo(() => {
    if (featureType === FeatureType.AREA) {
      if (input !== areaSearch.term) {
        return "Press Enter to Search";
      }

      if (areaSearch.status === SearchStatus.SEARCHING) {
        return "Searching...";
      }

      if (!areaSearch.results || areaSearch.results.length === 0) {
        return "No results found.";
      }
    }

    if (featureType === FeatureType.POINT) {
      if (!pointSearch.results || pointSearch.results.length === 0) {
        return "No results found.";
      }
    }

    return null;
  }, [areaSearch, featureType, input, pointSearch]);

  if (input === "") {
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
    <Combobox.Options className="absolute w-full z-10 left-0 rounded-1.25 bg-gray-500 p-1 space-y-1">
      {optionsPlaceholderText ? (
        <OptionsPlaceholder text={optionsPlaceholderText} />
      ) : featureType === FeatureType.AREA ? (
        areaSearch.results.map((result: AreaState) => (
          <Option key={result.featureId} feature={result} />
        ))
      ) : (
        pointSearch.results.map((result: PointState) => (
          <Option key={result.featureId} feature={result} />
        ))
      )}
    </Combobox.Options>
  );
}

interface OptionsPlaceholderProps {
  text: string;
}

function OptionsPlaceholder({ text }: OptionsPlaceholderProps) {
  return <div className="pl-7 p-1">{text}</div>;
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
