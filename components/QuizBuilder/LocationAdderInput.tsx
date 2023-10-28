import { Combobox } from "@headlessui/react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";
import { AreaSearchResults, LocationType } from "@/types";

interface LocationAdderInputProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: React.Dispatch<
    React.SetStateAction<LocationType>
  >;
  input: string;
  setInput: (input: string) => void;
  setAreaSearchTerm: (searchTerm: string) => void;
  areaSearchResults: AreaSearchResults;
  setPointSearchTerm: (searchTerm: string) => void;
}

export default function LocationAdderInput({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  setLocationAdderLocationType,
  input,
  setInput,
  setAreaSearchTerm,
  areaSearchResults,
  setPointSearchTerm,
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
        input={input}
        setInput={setInput}
        setAreaSearchTerm={setAreaSearchTerm}
        areaSearchResults={areaSearchResults}
        setPointSearchTerm={setPointSearchTerm}
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
      className="quiz-builder-item-decorator-left-1 bg-gray-600 text-gray-400"
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
  input: string;
  setInput: (input: string) => void;
  setAreaSearchTerm: (searchTerm: string) => void;
  areaSearchResults: AreaSearchResults;
  setPointSearchTerm: (searchTerm: string) => void;
}

function TextBox({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  input,
  setInput,
  setAreaSearchTerm,
  areaSearchResults,
  setPointSearchTerm,
}: TextBoxProps) {
  const placeholder =
    parentLocationType === LocationType.Tree
      ? `Add ${locationAdderLocationType}`
      : `Add ${locationAdderLocationType} in ${parentLocationName}`;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;

    setInput(input);

    if (locationAdderLocationType === LocationType.Point) {
      setPointSearchTerm(input);
    }
  }

  function handleEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    const isArea = locationAdderLocationType === LocationType.Area;
    const isOutdated = input !== areaSearchResults.searchTerm;

    if (isArea && isOutdated) {
      event.preventDefault();
      setAreaSearchTerm(input);
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

    // required to work around hardcoded HeadlessUI Combobox behavior 😡
    if (event.key === "Tab") {
      handleTab(event);
    }
  }

  return (
    <Combobox.Input
      className="quiz-builder-item bg-transparent border-white border-2"
      displayValue={() => input}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
