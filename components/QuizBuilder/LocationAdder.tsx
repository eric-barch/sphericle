"use client";

import useAreaSearch from "@/hooks/use-area-search.hook";
import usePointSearch from "@/hooks/use-point-search.hook";
import {
  AreaState,
  LocationType,
  PointState,
  Quiz,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";

interface LocationAdderProps {
  parentState: Quiz | AreaState;
  addLocation: (
    parentLocation: Quiz | AreaState,
    location: AreaState | PointState,
  ) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
  setParentOutlined: (parentOutlined: boolean) => void;
}

export default function LocationAdder({
  parentState,
  addLocation,
  setDisplayedLocation,
  setParentOutlined,
}: LocationAdderProps) {
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.Area,
  );
  const [input, setInput] = useState<string>("");
  const [optionClicked, setOptionClicked] = useState<boolean>(false);
  const {
    searchTerm: areaSearchTerm,
    searchStatus: areaSearchStatus,
    searchResults: areaSearchResults,
    setSearchTerm: setAreaSearchTerm,
    reset: resetAreaSearch,
  } = useAreaSearch(parentState);
  const {
    searchTerm: pointSearchTerm,
    searchStatus: pointSearchStatus,
    searchResults: pointSearchResults,
    setSearchTerm: setPointSearchTerm,
    reset: resetPointSearch,
  } = usePointSearch(parentState);

  function handleInputFocus(event: FocusEvent<HTMLDivElement>) {
    if (optionClicked) {
      setOptionClicked(false);
      return;
    }

    if (parentState.locationType === LocationType.Area) {
      setDisplayedLocation(parentState);
      setParentOutlined(true);
    } else {
      setDisplayedLocation(null);
    }
  }

  function handleInputBlur(event: FocusEvent<HTMLDivElement>) {
    setParentOutlined(false);
  }

  function handleChange(location: AreaState | PointState) {
    const newLocation = {
      ...location,
      parentLocation: parentState,
    };

    addLocation(parentState, newLocation);

    setInput("");
    resetAreaSearch();
    resetPointSearch();
  }

  return (
    <Combobox onChange={handleChange}>
      {({ activeOption }) => (
        <>
          <Input
            parentLocation={parentState}
            input={input}
            locationType={locationType}
            areaSearchTerm={areaSearchTerm}
            pointSearchTerm={pointSearchTerm}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            setInput={setInput}
            setLocationType={setLocationType}
            setAreaSearchTerm={setAreaSearchTerm}
            setPointSearchTerm={setPointSearchTerm}
            resetPointSearch={resetPointSearch}
          />
          <Options
            input={input}
            locationType={locationType}
            areaSearchTerm={areaSearchTerm}
            areaSearchStatus={areaSearchStatus}
            areaSearchResults={areaSearchResults}
            pointSearchTerm={pointSearchTerm}
            pointSearchStatus={pointSearchStatus}
            pointSearchResults={pointSearchResults}
            activeOption={activeOption}
            setDisplayedLocation={setDisplayedLocation}
            setOptionsClicked={setOptionClicked}
          />
        </>
      )}
    </Combobox>
  );
}

interface InputProps {
  parentLocation: Quiz | AreaState;
  input: string;
  locationType: LocationType;
  areaSearchTerm: string;
  pointSearchTerm: string;
  onFocus: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
  setInput: (input: string) => void;
  setLocationType: Dispatch<SetStateAction<LocationType>>;
  setAreaSearchTerm: (searchTerm: string) => void;
  setPointSearchTerm: (searchTerm: string) => void;
  resetPointSearch: () => void;
}

export function Input({
  parentLocation,
  input,
  locationType,
  areaSearchTerm,
  pointSearchTerm,
  onFocus,
  onBlur,
  setInput,
  setLocationType,
  setAreaSearchTerm,
  setPointSearchTerm,
  resetPointSearch,
}: InputProps) {
  const placeholder =
    parentLocation.locationType === LocationType.Quiz
      ? `Add ${locationType.toLowerCase()}`
      : `Add ${locationType.toLowerCase()} in ${
          parentLocation.userDefinedName || parentLocation.shortName
        }`;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);

    if (event.target.value === "") {
      resetPointSearch();
    } else if (locationType === LocationType.Point) {
      setPointSearchTerm(event.target.value);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (locationType === LocationType.Area && input !== areaSearchTerm) {
      event.preventDefault();
      setAreaSearchTerm(input);
    }
  }

  // required to work around hardcoded HeadlessUI Combobox behavior 😡
  function handleTab(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const focusableElements = Array.from(
      document.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
    const currentIndex = focusableElements.indexOf(event.currentTarget);

    if (event.shiftKey) {
      // focus previous or cycle to last
      const previousElement =
        focusableElements[currentIndex - 1] ||
        focusableElements[focusableElements.length - 1];
      (previousElement as HTMLElement).focus();
    } else {
      // focus next or cycle to first
      const nextElement =
        focusableElements[currentIndex + 1] || focusableElements[0];
      (nextElement as HTMLElement).focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleEnter(event);
    }

    // required to work around hardcoded HeadlessUI Combobox behavior 😡
    if (event.key === "Tab") {
      handleTab(event);
    }
  }

  return (
    <div className="relative" onFocus={onFocus} onBlur={onBlur}>
      <ToggleLocationTypeButton
        locationType={locationType}
        setLocationType={setLocationType}
        input={input}
        pointSearchTerm={pointSearchTerm}
        setPointSearchTerm={setPointSearchTerm}
      />
      <Combobox.Input
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-400 pl-8 pr-3 text-ellipsis focus:outline-none"
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
  pointSearchTerm: string;
  setLocationType: Dispatch<SetStateAction<LocationType>>;
  setPointSearchTerm: (searchTerm: string) => void;
}

function ToggleLocationTypeButton({
  input,
  locationType,
  pointSearchTerm,
  setLocationType,
  setPointSearchTerm,
}: ToggleLocationTypeButtonProps) {
  function handleClick() {
    const nextLocationType =
      locationType === LocationType.Area
        ? LocationType.Point
        : LocationType.Area;

    setLocationType(nextLocationType);

    if (nextLocationType === LocationType.Point && input !== pointSearchTerm) {
      setPointSearchTerm(input);
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
  input: string;
  locationType: LocationType;
  areaSearchTerm: string;
  areaSearchStatus: SearchStatus;
  areaSearchResults: AreaState[] | null;
  pointSearchTerm: string;
  pointSearchStatus: SearchStatus;
  pointSearchResults: PointState[] | null;
  activeOption: AreaState | PointState | null;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
  setOptionsClicked: (optionsClicked: boolean) => void;
}

export function Options({
  input,
  locationType,
  areaSearchTerm,
  areaSearchStatus,
  areaSearchResults,
  pointSearchTerm,
  pointSearchStatus,
  pointSearchResults,
  activeOption,
  setDisplayedLocation,
  setOptionsClicked,
}: OptionsProps) {
  function handleClick(event: MouseEvent<HTMLUListElement>) {
    setOptionsClicked(true);
  }

  const comboboxContent = (() => {
    if (locationType === LocationType.Area) {
      if (input !== areaSearchTerm) {
        return <div className="pl-6">Press Enter to Search</div>;
      } else if (areaSearchStatus === SearchStatus.Searching) {
        return <div className="pl-6">Searching...</div>;
      } else if (areaSearchResults.length < 1) {
        return <div className="pl-6">No results found.</div>;
      } else {
        return areaSearchResults.map((searchResult: AreaState) => (
          <Combobox.Option key={searchResult.placeId} value={searchResult}>
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {searchResult.longName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    } else if (locationType === LocationType.Point) {
      if (pointSearchResults.length < 1) {
        return <div className="pl-6">No results found.</div>;
      } else {
        return pointSearchResults.map((searchResult: PointState) => (
          <Combobox.Option key={searchResult.placeId} value={searchResult}>
            {({ active }) => (
              <div
                className={`p-1 pl-6 rounded-3xl cursor-pointer ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                {searchResult.longName}
              </div>
            )}
          </Combobox.Option>
        ));
      }
    }
  })();

  const combobox = (() => {
    if (input === "") {
      return null;
    }

    if (locationType === LocationType.Point) {
      if (pointSearchTerm === "") {
        return null;
      }

      if (
        pointSearchStatus === SearchStatus.Searching &&
        pointSearchResults.length < 1
      ) {
        return null;
      }
    }

    return (
      <Combobox.Options
        className="bg-gray-500 rounded-3xl p-2 mt-1 mb-1"
        static
        onClick={handleClick}
      >
        {comboboxContent}
      </Combobox.Options>
    );
  })();

  // TODO: consider refactoring out this useEffect
  useEffect(() => {
    if (activeOption) {
      setDisplayedLocation(activeOption);
    }
  }, [activeOption]);

  return <>{combobox}</>;
}
