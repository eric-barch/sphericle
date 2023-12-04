"use client";

import { useQuizDispatch } from "@/components/QuizProvider";
import useAreaSearch, {
  AreaSearch,
} from "@/components/QuizBuilder/use-area-search.hook";
import usePointSearch, {
  PointSearch,
} from "@/components/QuizBuilder/use-point-search.hook";
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
}

export default function LocationAdder({
  parent,
  inputRef,
}: LocationAdderProps) {
  const quizDispatch = useQuizDispatch();

  const [isFocused, setIsFocused] = useState<boolean>(null);
  const [lastAddedLocation, setLastAddedLocation] = useState<
    AreaState | PointState | null
  >(null);
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.Area,
  );
  const [input, setInput] = useState<string>("");
  const areaSearch = useAreaSearch(parent);
  const pointSearch = usePointSearch(parent);

  function handleChange(location: AreaState | PointState) {
    const newLocation = {
      ...location,
      parent,
    };

    quizDispatch({
      type: QuizDispatchType.AddedLocation,
      parent,
      location: newLocation,
    });

    setLastAddedLocation(newLocation);

    if (inputRef) {
      inputRef.current.value = "";
    }

    setInput("");
    areaSearch.reset();
    pointSearch.reset();
  }

  function handleFocusCapture(event: FocusEvent) {
    setIsFocused(true);

    let locationToSelect = null;

    /**TODO: this check for null here is not a robust solution, but is the best way i can figure
     * without being able to modify Headless UI Combobox. Long term fix is to refactor to Radix
     * components which give more control over focus. */
    if (
      event.currentTarget.contains(event.relatedTarget) ||
      /**Headless UI sets focus to null after selection is made, so this is the only way to direct
       * the code into this block. It is not robust because it only works if the LocationAdder
       * unmounts when its parent loses focus. That is currently the behavior of the component, but
       * could change and would break this solution. */
      event.relatedTarget === null
    ) {
      if (lastAddedLocation) {
        locationToSelect = lastAddedLocation;
      } else {
        locationToSelect = parent;
      }
    } else {
      if (parent.locationType === LocationType.Area) {
        locationToSelect = parent;
      } else {
        locationToSelect = null;
      }
    }

    quizDispatch({
      type: QuizDispatchType.SelectedBuilderLocation,
      location: locationToSelect,
    });
  }

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
      setLastAddedLocation(null);
    }
  }

  return parent.isAdding || parent.sublocations.length === 0 ? (
    <div
      id="location-adder"
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
  const quizDispatch = useQuizDispatch();

  const active = activeOption?.id === location.id;

  function handleFocusCapture(event: FocusEvent) {
    // quizDispatch({
    //   type: QuizDispatchType.SelectedBuilderLocation,
    //   location,
    // });
  }

  useEffect(() => {
    if (active) {
      // quizDispatch({
      //   type: QuizDispatchType.SelectedBuilderLocation,
      //   location,
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
