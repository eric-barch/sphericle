import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  ParentLocationDispatchType,
  QuizDispatchType,
} from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { FocusEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import {
  useParentLocation,
  useParentLocationDispatch,
} from "./ParentLocationProvider";
import { Sublocations } from "./Sublocations";

export default function Area() {
  const quizState = useQuiz();
  const quizDispatch = useQuizDispatch();
  const parentLocation = useParentLocation() as AreaState;
  const parentLocationDispatch = useParentLocationDispatch();

  if (parentLocation.locationType !== LocationType.Area) {
    throw new Error("areaState must be of type AreaState.");
  }

  const [disclosureKey, setDisclosureKey] = useState<string>(
    crypto.randomUUID(),
  );
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [toggleOnClick, setToggleOnClick] = useState<boolean>(false);

  const areaRef = useRef<HTMLDivElement>();
  const locationNameInputRef = useRef<HTMLInputElement>();
  const locationAdderInputRef = useRef<HTMLInputElement>();

  function setIsAdding(isAdding: boolean) {
    parentLocationDispatch({
      type: ParentLocationDispatchType.UpdatedIsAdding,
      isAdding,
    });

    // force Disclosure to render new open state
    setDisclosureKey(crypto.randomUUID());

    if (isAdding) {
      setTimeout(() => {
        locationAdderInputRef.current.focus();
      }, 0);
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    // quizDispatch({
    //   type: QuizDispatchType.UpdatedLocationIsRenaming,
    //   location: areaState,
    //   isRenaming,
    // });

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    quizDispatch({
      type: QuizDispatchType.SelectedBuilderLocation,
      location: parentLocation,
    });

    if (mouseDown) {
      setToggleOnClick(false);
    } else {
      setToggleOnClick(true);
    }
  }

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    setToggleOnClick(false);

    const relatedTarget = event.relatedTarget;

    if (areaRef.current && !areaRef.current.contains(relatedTarget)) {
      setIsAdding(false);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (toggleOnClick && quizState.builderSelected?.id === parentLocation.id) {
      parentLocationDispatch({
        type: ParentLocationDispatchType.UpdatedIsOpen,
        isOpen: !parentLocation.isOpen,
      });
    } else {
      event.preventDefault();
    }

    setToggleOnClick(true);
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
    <div
      id="area"
      ref={areaRef}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Disclosure key={disclosureKey} defaultOpen={parentLocation.isOpen}>
        <div className="relative">
          <EditLocationButton
            className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
            setIsAdding={setIsAdding}
          />
          <Disclosure.Button
            className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
              quizState.builderSelected?.id === parentLocation.id
                ? "outline outline-2 outline-red-600"
                : ""
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            <LocationName inputRef={locationNameInputRef} />
            <OpenChevron className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1" />
          </Disclosure.Button>
        </div>
        <Transition>
          <Disclosure.Panel>
            <Sublocations
              className="ml-10"
              locationAdderInputRef={locationAdderInputRef}
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
  const parentLocation = useParentLocation();

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
