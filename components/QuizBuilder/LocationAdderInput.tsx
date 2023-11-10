import { LocationType } from "@/types";
import debounce from "@/utils/debounce";
import { Combobox } from "@headlessui/react";
import { useCallback } from "react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";

interface LocationAdderInputProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: React.Dispatch<
    React.SetStateAction<LocationType>
  >;
  input: string;
  setInput: (input: string) => void;
  areaSearchTerm: string;
  setAreaSearchTerm: (searchTerm: string) => void;
  pointSearchTerm: string;
  setPointSearchTerm: (searchTerm: string) => void;
}

export default function LocationAdderInput({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  setLocationAdderLocationType,
  input,
  setInput,
  areaSearchTerm,
  setAreaSearchTerm,
  pointSearchTerm,
  setPointSearchTerm,
}: LocationAdderInputProps) {
  return (
    <div className="relative">
      <ToggleLocationTypeButton
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        input={input}
        pointSearchTerm={pointSearchTerm}
        setPointSearchTerm={setPointSearchTerm}
      />
      <InputBox
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        input={input}
        setInput={setInput}
        areaSearchTerm={areaSearchTerm}
        setAreaSearchTerm={setAreaSearchTerm}
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
  input: string;
  pointSearchTerm: string;
  setPointSearchTerm: (searchTerm: string) => void;
}

function ToggleLocationTypeButton({
  locationAdderLocationType,
  setLocationAdderLocationType,
  input,
  pointSearchTerm,
  setPointSearchTerm,
}: ToggleLocationTypeButtonProps) {
  const icon =
    locationAdderLocationType === LocationType.Area ? (
      <FaDrawPolygon />
    ) : (
      <FaLocationDot />
    );

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const currentLocationType = locationAdderLocationType;
    const nextLocationType =
      currentLocationType === LocationType.Area
        ? LocationType.Point
        : LocationType.Area;

    setLocationAdderLocationType(nextLocationType);

    if (nextLocationType === LocationType.Point && input !== pointSearchTerm) {
      setPointSearchTerm(input);
    }
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

interface InputBoxProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
  locationAdderLocationType: LocationType;
  input: string;
  setInput: (input: string) => void;
  areaSearchTerm: string;
  setAreaSearchTerm: (searchTerm: string) => void;
  setPointSearchTerm: (searchTerm: string) => void;
}

function InputBox({
  parentLocationType,
  parentLocationName,
  locationAdderLocationType,
  input,
  setInput,
  areaSearchTerm,
  setAreaSearchTerm,
  setPointSearchTerm,
}: InputBoxProps) {
  const placeholder =
    parentLocationType === LocationType.Root
      ? `Add ${locationAdderLocationType}`
      : `Add ${locationAdderLocationType} in ${parentLocationName}`;

  const debouncedSetPointSearchTerm = useCallback(
    debounce((searchTerm: string) => {
      setPointSearchTerm(searchTerm);
    }, 400),
    [],
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setInput(input);
    if (locationAdderLocationType === LocationType.Point) {
      debouncedSetPointSearchTerm(input);
    }
  }

  function handleEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    const isArea = locationAdderLocationType === LocationType.Area;
    const isOutdated = input !== areaSearchTerm;

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
      onFocus={(e) => e.preventDefault()}
      onBlur={(e) => e.preventDefault()}
    />
  );
}
