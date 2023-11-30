import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, QuizDispatchType } from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { Sublocations } from "./Sublocations";

interface AreaProps {
  areaState: AreaState;
}

export default function Area({ areaState }: AreaProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  // TODO: lot of messy hacks here, try to refactor
  const [isAdding, setIsAddingRaw] = useState<boolean>(false);
  const [isRenaming, setIsRenamingRaw] = useState<boolean>(false);
  const [disclosureKey, setDisclosureKey] = useState<number>(Math.random());
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);

  const locationAdderInputRef = useRef<HTMLInputElement>();

  function setIsAdding(isAdding: boolean) {
    setIsAddingRaw(isAdding);

    if (isAdding && !areaState.open) {
      quizDispatch({
        type: QuizDispatchType.ToggledOpen,
        location: areaState,
      });

      // force Disclosure to render new open state
      setDisclosureKey(Math.random());

      setTimeout(() => {
        locationAdderInputRef.current.focus();
      }, 0);
    }
  }

  function setIsRenaming(isRenaming: boolean) {
    setIsRenamingRaw(isRenaming);
  }

  function handleFocus() {
    if (!mouseDown) {
      setWillToggle(true);
    }

    quizDispatch({
      type: QuizDispatchType.Selected,
      location: areaState,
    });
  }

  function handleBlur() {
    setWillToggle(false);
  }

  function handleMouseLeave() {
    setWillToggle(false);
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (willToggle) {
      quizDispatch({
        type: QuizDispatchType.ToggledOpen,
        location: areaState,
      });
    } else {
      event.preventDefault();
      setWillToggle(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <Disclosure key={disclosureKey} defaultOpen={areaState.open}>
      <div
        className="relative"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <EditLocationButton
          className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
          location={areaState}
          setIsAdding={setIsAdding}
          setIsRenaming={setIsRenaming}
        />
        <Disclosure.Button
          className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
            quiz.selectedSublocation?.id === areaState.id
              ? "outline outline-2 outline-red-600"
              : ""
          }`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <LocationName
            location={areaState}
            renaming={isRenaming}
            setRenaming={setIsRenaming}
          />
          <OpenChevron
            className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1"
            open={areaState.open}
          />
        </Disclosure.Button>
      </div>
      <Transition>
        <Disclosure.Panel>
          <Sublocations
            className="ml-10"
            parent={areaState}
            isAdding={isAdding}
            locationAdderInputRef={locationAdderInputRef}
            setIsAdding={setIsAdding}
          />
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}

interface OpenChevronProps {
  className?: string;
  open: boolean;
}

function OpenChevron({ className, open }: OpenChevronProps) {
  return (
    <div className={className}>
      <FaChevronRight className={`${open ? "rotate-90" : ""} w-4 h-4`} />
    </div>
  );
}
