import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, QuizDispatchType } from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { FocusEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";
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

  const [disclosureKey, setDisclosureKey] = useState<string>(
    crypto.randomUUID(),
  );
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [toggleOnClick, setToggleOnClick] = useState<boolean>(false);

  const areaRef = useRef<HTMLDivElement>();
  const locationNameInputRef = useRef<HTMLInputElement>();
  const locationAdderInputRef = useRef<HTMLInputElement>();

  function setIsAdding(isAdding: boolean) {
    quizDispatch({
      type: QuizDispatchType.SetIsAdding,
      location: areaState,
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
    quizDispatch({
      type: QuizDispatchType.SetIsRenaming,
      location: areaState,
      isRenaming,
    });

    if (isRenaming) {
      setTimeout(() => {
        locationNameInputRef.current.focus();
        locationNameInputRef.current.select();
      }, 0);
    }
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    quizDispatch({
      type: QuizDispatchType.BuildSelected,
      location: areaState,
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
    if (toggleOnClick && quiz.builderSelected?.id === areaState.id) {
      quizDispatch({
        type: QuizDispatchType.SetIsOpen,
        location: areaState,
        isOpen: !areaState.isOpen,
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
      <Disclosure key={disclosureKey} defaultOpen={areaState.isOpen}>
        <div className="relative">
          <EditLocationButton
            className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
            location={areaState}
            setIsAdding={setIsAdding}
            setIsRenaming={setIsRenaming}
          />
          <Disclosure.Button
            className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
              quiz.builderSelected?.id === areaState.id
                ? "outline outline-2 outline-red-600"
                : ""
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            <LocationName
              location={areaState}
              inputRef={locationNameInputRef}
              setIsRenaming={setIsRenaming}
            />
            <OpenChevron
              className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1"
              open={areaState.isOpen}
            />
          </Disclosure.Button>
        </div>
        <Transition>
          <Disclosure.Panel>
            <Sublocations
              className="ml-10"
              parent={areaState}
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
  open: boolean;
}

function OpenChevron({ className, open }: OpenChevronProps) {
  return (
    <div className={className}>
      <FaChevronRight className={`${open ? "rotate-90" : ""} w-4 h-4`} />
    </div>
  );
}
