import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";
import { LocationType } from "./LocationType";

interface LocationAdderInputProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: React.Dispatch<
    React.SetStateAction<LocationType>
  >;
  searchOpenStreetMap: (input: string) => void;
  searchGooglePlaces: (input: string) => void;
}

export default function LocationAdderInput({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  setLocationAdderLocationType,
  searchOpenStreetMap,
  searchGooglePlaces,
}: LocationAdderInputProps) {
  return (
    <div className="relative">
      <ToggleLocationTypeButton
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
      />
      <TextBox
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        searchOpenStreetMap={searchOpenStreetMap}
        searchGooglePlaces={searchGooglePlaces}
      />
    </div>
  );
}

interface ToggleLocationTypeButtonProps {
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: React.Dispatch<
    React.SetStateAction<LocationType>
  >;
}

function ToggleLocationTypeButton({
  locationAdderLocationType,
  setLocationAdderLocationType,
}: ToggleLocationTypeButtonProps) {
  const icon =
    locationAdderLocationType === LocationType.Area ? (
      <FaDrawPolygon />
    ) : (
      <FaLocationDot />
    );

  function handleClick() {
    setLocationAdderLocationType((prevState) =>
      prevState === LocationType.Area ? LocationType.Point : LocationType.Area,
    );
  }

  return (
    <button
      className="quiz-builder-item-button-left-1 bg-gray-600 text-gray-400"
      onClick={handleClick}
    >
      {icon}
    </button>
  );
}

interface TextBoxProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
  locationAdderLocationType: LocationType;
  searchOpenStreetMap: (input: string) => void;
  searchGooglePlaces: (searchValue: string) => void;
}

function TextBox({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  searchOpenStreetMap,
  searchGooglePlaces,
}: TextBoxProps) {
  const [input, setInput] = useState<string>("");
  const [lastSearchedInput, setLastSearchedInput] = useState<string>("");

  const placeholder =
    parentLocationType === LocationType.Tree
      ? `Add ${locationAdderLocationType}`
      : `Add ${locationAdderLocationType} in ${parentLocationName}`;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);

    if (locationAdderLocationType === LocationType.Point) {
      searchGooglePlaces(event.target.value);
    }
  }

  function handleEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    const isArea = locationAdderLocationType === LocationType.Area;
    const isOutdated = input !== lastSearchedInput;

    if (isArea && isOutdated) {
      event.preventDefault();
      setLastSearchedInput(input);
      searchOpenStreetMap(input);
    }
  }

  function handleTab(event: React.KeyboardEvent<HTMLInputElement>) {
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleEnter(event);
    }

    // seems like the only way to work around hardcoded HeadlessUI Combobox behavior 😡
    if (event.key === "Tab") {
      handleTab(event);
    }
  }

  return (
    <Combobox.Input
      displayValue={() => input}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
