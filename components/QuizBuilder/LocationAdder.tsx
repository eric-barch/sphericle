"use client";

import useAreaSearch, {
  AreaSearch,
} from "@/components/QuizBuilder/use-area-search.hook";
import usePointSearch, {
  PointSearch,
} from "@/components/QuizBuilder/use-point-search.hook";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  LocationDispatchType,
  PointState,
  QuizDispatchType,
  QuizState,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";
import { useLocation, useLocationDispatch } from "./ParentLocationProvider";

interface LocationAdderProps {
  inputRef: RefObject<HTMLInputElement>;
  isAdding: boolean;
}

export default function LocationAdder({
  inputRef,
  isAdding,
}: LocationAdderProps) {
  const quizDispatch = useQuizDispatch();
  const parentLocation = useLocation() as QuizState | AreaState;
  const parentLocationDispatch = useLocationDispatch();

  if (
    parentLocation.locationType !== LocationType.Quiz &&
    parentLocation.locationType !== LocationType.Area
  ) {
    throw new Error("parentLocation must be of type QuizState or AreaState.");
  }

  const [isFocused, setIsFocused] = useState<boolean>(null);
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.Area,
  );
  const [input, setInput] = useState<string>("");
  const areaSearch = useAreaSearch(parentLocation);
  const pointSearch = usePointSearch(parentLocation);

  function handleChange(sublocation: AreaState | PointState) {
    const newSublocation = {
      ...sublocation,
      parent: parentLocation,
    };

    parentLocationDispatch({
      type: LocationDispatchType.AddedSublocation,
      sublocation: newSublocation,
    });

    quizDispatch({
      type: QuizDispatchType.SelectedBuilderLocation,
      location: newSublocation,
    });

    if (inputRef) {
      inputRef.current.value = "";
    }

    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      // console.log("blur LocationAdder");
      setIsFocused(false);
    }
  }

  function handleFocus(event: FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      // console.log("focus LocationAdder");
      setIsFocused(true);
      if (parentLocation.locationType === LocationType.Quiz) {
        quizDispatch({
          type: QuizDispatchType.SelectedBuilderLocation,
          location: null,
        });
      } else if (parentLocation.locationType === LocationType.Area) {
        quizDispatch({
          type: QuizDispatchType.SelectedBuilderLocation,
          location: parentLocation,
        });
      }
    }
  }

  return isAdding || parentLocation.sublocations.length === 0 ? (
    <div
      id="location-adder"
      className="relative"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Combobox onChange={handleChange}>
        {({ activeOption }) => (
          <>
            <Input
              input={input}
              locationType={locationType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              inputRef={inputRef}
              setInput={setInput}
              setLocationType={setLocationType}
            />
            <Options
              activeOption={activeOption}
              input={input}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              locationType={locationType}
              locationAdderFocused={isFocused}
            />
          </>
        )}
      </Combobox>
    </div>
  ) : null;
}

interface InputProps {
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  inputRef: RefObject<HTMLInputElement>;
  setInput: (input: string) => void;
  setLocationType: Dispatch<SetStateAction<LocationType>>;
}

function Input({
  input,
  locationType,
  areaSearch,
  pointSearch,
  inputRef,
  setInput,
  setLocationType,
}: InputProps) {
  const parentLocation = useLocation();

  const placeholder =
    parentLocation.locationType === LocationType.Quiz
      ? `Add ${locationType.toLowerCase()} anywhere`
      : `Add ${locationType.toLowerCase()} in ${
          parentLocation.userDefinedName || parentLocation.shortName
        }`;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);

    if (event.target.value === "") {
      pointSearch.reset();
    } else if (locationType === LocationType.Point) {
      pointSearch.setTerm(event.target.value);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (locationType === LocationType.Area && input !== areaSearch.term) {
      event.preventDefault();
      areaSearch.setTerm(input);
    }
  }

  // override HeadlessUI Combobox behavior in favor of accessibility tab element navigation
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

    // override HeadlessUI Combobox behavior in favor of accessibility tab element navigation
    if (event.key === "Tab") {
      handleTab(event);
    }
  }

  return (
    <div className="relative">
      <ToggleLocationTypeButton
        locationType={locationType}
        input={input}
        pointSearch={pointSearch}
        setLocationType={setLocationType}
      />
      <Combobox.Input
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-400 pl-8 pr-3 text-ellipsis focus:outline-none"
        ref={inputRef}
        displayValue={() => input}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

interface ToggleLocationTypeButtonProps {
  input: string;
  locationType: LocationType;
  pointSearch: PointSearch;
  setLocationType: Dispatch<SetStateAction<LocationType>>;
}

function ToggleLocationTypeButton({
  input,
  locationType,
  pointSearch,
  setLocationType,
}: ToggleLocationTypeButtonProps) {
  function handleClick() {
    const nextLocationType =
      locationType === LocationType.Area
        ? LocationType.Point
        : LocationType.Area;

    setLocationType(nextLocationType);

    if (nextLocationType === LocationType.Point && input !== pointSearch.term) {
      pointSearch.setTerm(input);
    }
  }

  return (
    <button
      id="toggle-location-type-button"
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5 bg-gray-600 text-gray-400 "
      onClick={handleClick}
    >
      {locationType === LocationType.Area ? (
        <FaDrawPolygon />
      ) : (
        <FaLocationDot />
      )}
    </button>
  );
}

interface OptionsProps {
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  activeOption: AreaState | PointState;
  locationAdderFocused: boolean;
}

function Options({
  input,
  locationType,
  areaSearch,
  pointSearch,
  activeOption,
  locationAdderFocused,
}: OptionsProps) {
  const optionsContent = (() => {
    if (locationType === LocationType.Area) {
      if (input !== areaSearch.term) {
        return <OptionsSubstitute text="Press Enter to Search" />;
      }

      if (areaSearch.status === SearchStatus.Searching) {
        return <OptionsSubstitute text="Searching..." />;
      }

      if (areaSearch.results.length < 1) {
        return <OptionsSubstitute text="No results found." />;
      }

      return areaSearch.results.map((result: AreaState) => (
        <Option key={result.id} activeOption={activeOption} location={result} />
      ));
    }

    if (locationType === LocationType.Point) {
      if (pointSearch.results.length < 1) {
        return <OptionsSubstitute text="No results found." />;
      }

      return pointSearch.results.map((result: PointState) => (
        <Option key={result.id} activeOption={activeOption} location={result} />
      ));
    }
  })();

  const options = (() => {
    if (input !== "" && locationAdderFocused) {
      if (locationType === LocationType.Point) {
        if (pointSearch.term === "") {
          return null;
        }

        if (
          pointSearch.status === SearchStatus.Searching &&
          pointSearch.results.length < 1
        ) {
          return null;
        }
      }

      return (
        <Combobox.Options
          className="absolute w-full z-10 left-0 bg-gray-500 rounded-custom p-1 space-y-1"
          static
        >
          {optionsContent}
        </Combobox.Options>
      );
    }

    return null;
  })();

  return <>{options}</>;
}

interface OptionProps {
  activeOption: AreaState | PointState;
  location: AreaState | PointState;
}

function Option({ activeOption, location }: OptionProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const parentLocation = useLocation();

  const active = activeOption?.id === location.id;

  function handleFocusCapture(event: FocusEvent) {
    if (
      parentLocation.locationType !== LocationType.Quiz &&
      parentLocation.locationType !== LocationType.Area
    ) {
      throw new Error("parentLocaiton must by of type QuizState or AreaState.");
    }

    const displayedLocation = { ...activeOption, parent: parentLocation };

    // quizDispatch({
    //   type: QuizDispatchType.SelectedBuilderLocation,
    //   location: displayedLocation,
    // });
  }

  useEffect(() => {
    if (active) {
      if (
        parentLocation.locationType !== LocationType.Quiz &&
        parentLocation.locationType !== LocationType.Area
      ) {
        throw new Error(
          "parentLocaiton must by of type QuizState or AreaState.",
        );
      }

      const displayedLocation = { ...activeOption, parent: parentLocation };

      // quizDispatch({
      //   type: QuizDispatchType.SelectedBuilderLocation,
      //   location: displayedLocation,
      // });
    }
  }, [active]);

  return (
    <Combobox.Option value={location} onFocusCapture={handleFocusCapture}>
      <div
        className={`p-1 pl-7 rounded-3xl cursor-pointer ${
          active ? "bg-gray-600" : ""
        }`}
      >
        {location.longName}
      </div>
    </Combobox.Option>
  );
}

interface OptionsSubstituteProps {
  text: string;
}

function OptionsSubstitute({ text }: OptionsSubstituteProps) {
  return <div className="pl-7 p-1">{text}</div>;
}
