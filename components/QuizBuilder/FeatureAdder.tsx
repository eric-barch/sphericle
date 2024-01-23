"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  isAreaState,
  isParentFeatureState,
  isPointState,
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
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import { AreaSearch } from "./use-area-search.hook";
import useFeatureSearches from "./use-feature-searches.hook";
import { PointSearch } from "./use-point-search.hook";

interface FeatureAdderProps {
  parentFeatureId: string;
}

export default function FeatureAdder({ parentFeatureId }: FeatureAdderProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();
  const { areaSearch, pointSearch } = useFeatureSearches(parentFeatureId);

  const [parentFeatureState, setParentFeatureState] =
    useState<ParentFeatureState>(() => {
      const parentFeatureState = allFeatures.get(parentFeatureId);

      if (!isParentFeatureState(parentFeatureState)) {
        return null;
      }

      return parentFeatureState;
    });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [featureType, setFeatureType] = useState<FeatureType>(FeatureType.AREA);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const parentFeatureState = allFeatures.get(parentFeatureId);

    if (!isParentFeatureState(parentFeatureState)) {
      return;
    }

    setParentFeatureState(parentFeatureState);
  }, [allFeatures, parentFeatureId]);

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setIsFocused(false);
    console.log(`blur FeatureAdder`);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      setIsFocused(true);
      console.log("focus FeatureAdder");

      if (isRootState(parentFeatureState)) {
        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
          feature: null,
        });
      }

      if (isSubfeatureState(parentFeatureState)) {
        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
          feature: parentFeatureState,
        });
      }
    },
    [parentFeatureState, quizBuilderStateDispatch],
  );

  const handleChange = useCallback(
    (subfeature: AreaState | PointState) => {
      allFeaturesDispatch({
        type: AllFeaturesDispatchType.ADD_SUBFEATURE,
        parentFeature: parentFeatureState,
        subfeature,
      });

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE,
        feature: subfeature,
      });

      if (isParentFeatureState(subfeature)) {
        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING,
          feature: subfeature,
          isAdding: true,
        });
      }

      setInput("");

      areaSearch.reset();
      pointSearch.reset();
    },
    [
      allFeaturesDispatch,
      areaSearch,
      parentFeatureState,
      pointSearch,
      quizBuilderStateDispatch,
    ],
  );

  if (
    !isRootState(parentFeatureState) &&
    !quizBuilderState.addingFeatureIds.has(parentFeatureId)
  ) {
    return null;
  }

  return (
    <div className="relative" onBlur={handleBlur} onFocus={handleFocus}>
      <Combobox onChange={handleChange}>
        {({ activeOption }) => (
          <>
            <Input
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
              isFocused={isFocused}
            />
          </>
        )}
      </Combobox>
    </div>
  );
}

interface InputProps {
  parentFeatureState: ParentFeatureState;
  input: string;
  featureType: FeatureType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setInput: (input: string) => void;
  setFeatureType: (featureType: FeatureType) => void;
}

function Input({
  parentFeatureState,
  input,
  featureType,
  areaSearch,
  pointSearch,
  setInput,
  setFeatureType,
}: InputProps) {
  const [placeholder, setPlaceholder] = useState<string>(() => {
    if (isRootState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} anywhere`;
    } else if (isAreaState(parentFeatureState)) {
      return `Add ${featureType.toLowerCase()} in ${
        parentFeatureState.userDefinedName || parentFeatureState.shortName
      }`;
    }
  });

  useEffect(() => {
    if (isRootState(parentFeatureState)) {
      setPlaceholder(`Add ${featureType.toLowerCase()} anywhere`);
    } else if (isAreaState(parentFeatureState)) {
      setPlaceholder(
        `Add ${featureType.toLowerCase()} in ${
          parentFeatureState.userDefinedName || parentFeatureState.shortName
        }`,
      );
    }
  }, [parentFeatureState, featureType]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);

      if (event.target.value === "") {
        pointSearch.reset();
      } else if (isPointState(parentFeatureState)) {
        pointSearch.setTerm(event.target.value);
      }
    },
    [parentFeatureState, pointSearch, setInput],
  );

  const handleEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!isAreaState(parentFeatureState) || input === areaSearch.term) {
        return;
      }

      event.preventDefault();
      areaSearch.setTerm(input);
    },
    [areaSearch, parentFeatureState, input],
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
      <ToggleAreaPointButton
        input={input}
        featureType={featureType}
        pointSearch={pointSearch}
        setFeatureType={setFeatureType}
      />
      <Combobox.Input
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
  const handleClick = useCallback(() => {
    const nextFeatureType =
      featureType === FeatureType.AREA ? FeatureType.POINT : FeatureType.AREA;

    setFeatureType(nextFeatureType);

    if (nextFeatureType === FeatureType.POINT && input !== pointSearch.term) {
      pointSearch.setTerm(input);
    }
  }, [featureType, input, pointSearch, setFeatureType]);

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
  isFocused: boolean;
}

function Options({
  activeOption,
  input,
  featureType,
  areaSearch,
  pointSearch,
  isFocused,
}: OptionsProps) {
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  useEffect(() => {
    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION,
      activeSearchOption: activeOption,
    });
  }, [quizBuilderStateDispatch, activeOption]);

  const renderOptionsContent = useCallback(() => {
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
  }, [areaSearch, pointSearch, featureType, input]);

  const render = useCallback(() => {
    if (input === "") {
      return null;
    }

    if (!isFocused) {
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
  }, [featureType, input, isFocused, pointSearch, renderOptionsContent]);

  return <>{render()}</>;
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
