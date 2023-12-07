import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationDispatchType,
  LocationType,
  QuizDispatchType,
} from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { FocusEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { useLocation, useLocationDispatch } from "./LocationProvider";
import { Sublocations } from "./Sublocations";

export default function Area() {
  const quizState = useQuiz();
  const quizDispatch = useQuizDispatch();
  const location = useLocation() as AreaState;
  const locationDispatch = useLocationDispatch();

  if (location.locationType !== LocationType.Area) {
    throw new Error("areaState must be of type AreaState.");
  }

  const [disclosureKey, setDisclosureKey] = useState<string>(
    crypto.randomUUID(),
  );
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [isAdding, setIsAddingRaw] = useState<boolean>(true);
  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);

  const locationNameInputRef = useRef<HTMLInputElement>();
  const locationAdderInputRef = useRef<HTMLInputElement>();

  function setIsAdding(isAdding: boolean) {
    setIsAddingRaw(isAdding);

    if (isAdding) {
      locationDispatch({
        type: LocationDispatchType.UpdatedIsOpen,
        isOpen: true,
      });

      // force Disclosure to render new open state
      setDisclosureKey(crypto.randomUUID());

      setTimeout(() => {
        locationAdderInputRef.current.focus();
      }, 0);
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleContainerBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsAdding(false);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      // console.log(`blur ${parentLocation.shortName}`);
      setWillToggle(false);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      // console.log(`focus ${parentLocation.shortName}`);

      if (mouseDown) {
        setWillToggle(false);
      } else {
        setWillToggle(true);
      }

      quizDispatch({
        type: QuizDispatchType.SelectedBuilderLocation,
        location: location,
      });
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (location.id === quizState.builderSelected.id && willToggle) {
      locationDispatch({
        type: LocationDispatchType.UpdatedIsOpen,
        isOpen: !location.isOpen,
      });

      // TODO: Need to get new location into selected quiz property.
    } else {
      event.preventDefault();
    }

    setWillToggle(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(true);
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(false);
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    setMouseDown(false);
  }

  return (
    <div onBlur={handleContainerBlur}>
      <Disclosure key={disclosureKey} defaultOpen={location.isOpen}>
        <div
          className="relative"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <EditLocationButton
            className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
            setIsAdding={setIsAdding}
            setIsRenaming={setIsRenaming}
          />
          <Disclosure.Button
            className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
              quizState.builderSelected?.id === location.id
                ? "outline outline-2 outline-red-600"
                : ""
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            <LocationName
              inputRef={locationNameInputRef}
              isRenaming={isRenaming}
              setIsRenaming={setIsRenaming}
            />
            <OpenChevron className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1" />
          </Disclosure.Button>
        </div>
        <Transition>
          <Disclosure.Panel>
            <Sublocations
              className="ml-10"
              locationAdderInputRef={locationAdderInputRef}
              isAdding={isAdding}
            />
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  );
}

interface OpenChevronProps {
  className?: string;
}

function OpenChevron({ className }: OpenChevronProps) {
  const parentLocation = useLocation();

  if (parentLocation.locationType !== LocationType.Area) {
    throw new Error("parentLocation must be of type AreaState.");
  }

  return (
    <div className={className}>
      <FaChevronRight
        className={`${parentLocation.isOpen ? "rotate-90" : ""} w-4 h-4`}
      />
    </div>
  );
}
