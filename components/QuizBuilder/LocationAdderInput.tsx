import { AreaState, LocationType, QuizState } from "@/types";
import debounce from "@/utils/debounce";
import { Combobox } from "@headlessui/react";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useCallback,
} from "react";
import { FaDrawPolygon, FaLocationDot } from "react-icons/fa6";

interface LocationAdderInputProps {
  parentLocation: QuizState | AreaState;
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: Dispatch<SetStateAction<LocationType>>;
  input: string;
  setInput: (input: string) => void;
  areaSearchTerm: string;
  setAreaSearchTerm: (searchTerm: string) => void;
  pointSearchTerm: string;
  setPointSearchTerm: (searchTerm: string) => void;
}

export default function LocationAdderInput({
  parentLocation,
  locationAdderLocationType,
  setLocationAdderLocationType,
  input,
  setInput,
  areaSearchTerm,
  setAreaSearchTerm,
  pointSearchTerm,
  setPointSearchTerm,
}: LocationAdderInputProps) {
  const placeholder =
    parentLocation.locationType === LocationType.Quiz
      ? `Add ${locationAdderLocationType.toLowerCase()}`
      : `Add ${locationAdderLocationType.toLowerCase()} in ${
          parentLocation.shortName
        }`;

  const debouncedSetPointSearchTerm = useCallback(
    debounce((searchTerm: string) => {
      setPointSearchTerm(searchTerm);
    }, 400),
    [],
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setInput(input);
    if (locationAdderLocationType === LocationType.Point) {
      debouncedSetPointSearchTerm(input);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    const isArea = locationAdderLocationType === LocationType.Area;
    const isOutdated = input !== areaSearchTerm;

    if (isArea && isOutdated) {
      event.preventDefault();
      setAreaSearchTerm(input);
    }
  }

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
    <div className="relative">
      <Combobox.Input
        className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-400 pl-8 pr-3 text-ellipsis focus:outline-none"
        displayValue={() => input}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.preventDefault()}
        onBlur={(e) => e.preventDefault()}
      />
      <ToggleLocationTypeButton
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        input={input}
        pointSearchTerm={pointSearchTerm}
        setPointSearchTerm={setPointSearchTerm}
      />
    </div>
  );
}

interface ToggleLocationTypeButtonProps {
  locationAdderLocationType: LocationType;
  setLocationAdderLocationType: Dispatch<SetStateAction<LocationType>>;
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

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
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
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5 bg-gray-600 text-gray-400 "
      onClick={handleClick}
    >
      {icon}
    </button>
  );
}
