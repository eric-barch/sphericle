"use client";

import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  QuizDispatchType,
  RootState,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { Grid2X2, Map, MapPin } from "lucide-react";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useState,
} from "react";
import useAreaSearch, { AreaSearch } from "./use-area-search.hook";
import usePointSearch, { PointSearch } from "./use-point-search.hook";

interface LocationAdderProps {
  inputRef?: RefObject<HTMLInputElement>;
  parentId: string;
}

export default function LocationAdder({
  inputRef,
  parentId,
}: LocationAdderProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const parentLocation = quiz.locations[parentId] as RootState | AreaState;
  const areaSearch = useAreaSearch(parentId);
  const pointSearch = usePointSearch(parentId);

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.AREA,
  );
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
        if (parentLocation.locationType === LocationType.ROOT) {
          quizDispatch({
            type: QuizDispatchType.SET_BUILDER_SELECTED,
            locationId: null,
          });
        } else if (parentLocation.locationType === LocationType.AREA) {
          quizDispatch({
            type: QuizDispatchType.SET_BUILDER_SELECTED,
            locationId: parentId,
          });
        }
      }
    } else {
      setOptionSelected(false);
    }
  }

  function handleChange(sublocation: AreaState | PointState) {
    quizDispatch({
      type: QuizDispatchType.ADD_SUBLOCATION,
      parentId,
      sublocation,
    });

    if (inputRef) {
      inputRef.current.value = "";
    }

    setOptionSelected(true);
    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  if (!parentLocation.isAdding && parentLocation.sublocationIds.length > 0) {
    return null;
  }

  return (
    <div className="relative" onBlur={handleBlur} onFocus={handleFocus}>
      <Combobox onChange={handleChange}>
        <Input
          inputRef={inputRef}
          parentId={parentId}
          input={input}
          locationType={locationType}
          areaSearch={areaSearch}
          pointSearch={pointSearch}
          setInput={setInput}
          setLocationType={setLocationType}
        />
        <Options
          parentId={parentId}
          input={input}
          locationType={locationType}
          areaSearch={areaSearch}
          pointSearch={pointSearch}
          locationAdderFocused={isFocused}
        />
      </Combobox>
    </div>
  );
}

interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  parentId: string;
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setInput: (input: string) => void;
  setLocationType: (locationType: LocationType) => void;
}

function Input({
  inputRef,
  parentId,
  input,
  locationType,
  areaSearch,
  pointSearch,
  setInput,
  setLocationType,
}: InputProps) {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId] as RootState | AreaState;

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  const placeholder =
    parentLocation.locationType === LocationType.ROOT
      ? `Add ${locationType.toLowerCase()} anywhere`
      : `Add ${locationType.toLowerCase()} in ${
          parentLocation.userDefinedName || parentLocation.shortName
        }`;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);

    if (event.target.value === "") {
      pointSearch.reset();
    } else if (locationType === LocationType.POINT) {
      pointSearch.setTerm(event.target.value);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (locationType === LocationType.AREA && input !== areaSearch.term) {
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
        locationType={locationType}
        pointSearch={pointSearch}
        setLocationType={setLocationType}
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
  locationType: LocationType;
  pointSearch: PointSearch;
  setLocationType: (locationType: LocationType) => void;
}

function ToggleAreaPointButton({
  input,
  locationType,
  pointSearch,
  setLocationType,
}: ToggleAreaPointButtonProps) {
  function handleClick() {
    const nextLocationType =
      locationType === LocationType.AREA
        ? LocationType.POINT
        : LocationType.AREA;

    setLocationType(nextLocationType);

    if (nextLocationType === LocationType.POINT && input !== pointSearch.term) {
      pointSearch.setTerm(input);
    }
  }

  return (
    <button
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5 bg-gray-600 text-gray-300 "
      onClick={handleClick}
    >
      {locationType === LocationType.AREA ? (
        <Grid2X2 className="w-4 h-4" />
      ) : (
        <MapPin className="w-4 h-4" />
      )}
    </button>
  );
}

interface OptionsProps {
  parentId: string;
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  locationAdderFocused: boolean;
}

function Options({
  parentId,
  input,
  locationType,
  areaSearch,
  pointSearch,
  locationAdderFocused,
}: OptionsProps) {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId];

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
  }

  function renderOptionsContent() {
    if (locationType === LocationType.AREA) {
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
        <Option key={result.id} location={result} />
      ));
    } else if (locationType === LocationType.POINT) {
      if (pointSearch.results.length === 0) {
        return <OptionsSubstitute>No results found.</OptionsSubstitute>;
      }
      return pointSearch.results.map((result: PointState) => (
        <Option key={result.id} location={result} />
      ));
    }
  }

  function renderOptions() {
    if (input === "") {
      return null;
    }

    if (!locationAdderFocused) {
      return null;
    }

    if (locationType === LocationType.POINT && pointSearch.term === "") {
      return null;
    }

    if (
      locationType === LocationType.POINT &&
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
  location: AreaState | PointState;
}

function Option({ location }: OptionProps) {
  return (
    <Combobox.Option value={location}>
      <div className="p-1 pl-7 rounded-3xl cursor-pointer bg-gray-600">
        {location.longName}
      </div>
    </Combobox.Option>
  );
}
