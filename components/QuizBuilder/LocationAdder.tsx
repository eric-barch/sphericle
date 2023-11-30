"use client";

import { useQuizDispatch } from "@/components/QuizProvider";
import useAreaSearch, { AreaSearch } from "@/hooks/use-area-search.hook";
import usePointSearch, { PointSearch } from "@/hooks/use-point-search.hook";
import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  QuizDispatchType,
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

interface LocationAdderProps {
  parent: Quiz | AreaState;
  inputRef: RefObject<HTMLInputElement>;
  setIsAdding: (isAdding: boolean) => void;
}

export default function LocationAdder({
  parent,
  inputRef,
  setIsAdding,
}: LocationAdderProps) {
  const quizDispatch = useQuizDispatch();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.Area,
  );
  const [input, setInput] = useState<string>("");
  const areaSearch = useAreaSearch(parent);
  const pointSearch = usePointSearch(parent);

  function handleChange(location: AreaState | PointState) {
    const newLocation = {
      ...location,
      parentLocation: parent,
    };

    quizDispatch({
      type: QuizDispatchType.Added,
      parent,
      location: newLocation,
    });

    if (inputRef) {
      inputRef.current.value = "";
    }

    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  function handleFocusCapture(event: FocusEvent) {
    // Check if the focus is coming from outside of the component
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsFocused(true);

      if (parent.locationType === LocationType.Area) {
        quizDispatch({
          type: QuizDispatchType.Selected,
          location: parent,
        });
      } else {
        quizDispatch({
          type: QuizDispatchType.Selected,
          location: null,
        });
      }
    }

    event.stopPropagation();
  }

  function handleBlurCapture(event: FocusEvent) {
    // Check if the focus is going outside of the component
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsFocused(false);

      quizDispatch({
        type: QuizDispatchType.Selected,
        location: null,
      });

      if (input === "" && setIsAdding) {
        setIsAdding(false);
      }
    }

    event.stopPropagation();
  }

  return parent.isAdding || parent.sublocations.length === 0 ? (
    <div
      className="relative"
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <Combobox onChange={handleChange}>
        {({ activeOption }) => (
          <>
            <Input
              parent={parent}
              input={input}
              locationType={locationType}
              areaSearch={areaSearch}
              pointSearch={pointSearch}
              inputRef={inputRef}
              setInput={setInput}
              setLocationType={setLocationType}
            />
            <Options
              parent={parent}
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
  parent: Quiz | AreaState;
  input: string;
  locationType: LocationType;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  inputRef: RefObject<HTMLInputElement>;
  setInput: (input: string) => void;
  setLocationType: Dispatch<SetStateAction<LocationType>>;
}

function Input({
  parent,
  input,
  locationType,
  areaSearch,
  pointSearch,
  inputRef,
  setInput,
  setLocationType,
}: InputProps) {
  const placeholder =
    parent.locationType === LocationType.Quiz
      ? `Add ${locationType.toLowerCase()} anywhere`
      : `Add ${locationType.toLowerCase()} in ${
          parent.userDefinedName || parent.shortName
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
  parent: Quiz | AreaState;
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
    if (input === "" || !locationAdderFocused) {
      return null;
    }

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
  })();

  return <>{options}</>;
}

interface OptionProps {
  activeOption: AreaState | PointState;
  location: AreaState | PointState;
}

function Option({ activeOption, location }: OptionProps) {
  const quizDispatch = useQuizDispatch();

  const active = activeOption?.id === location.id;

  useEffect(() => {
    if (active) {
      quizDispatch({
        type: QuizDispatchType.Selected,
        location,
      });
    }
  }, [active]);

  return (
    <Combobox.Option value={location}>
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
