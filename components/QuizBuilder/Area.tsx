import { useQuiz, useSetQuiz } from "@/components/QuizProvider";
import { AreaState } from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { KeyboardEvent, MouseEvent, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { Sublocations } from "./Sublocations";

interface AreaProps {
  areaState: AreaState;
  setAreaState: (areaState: AreaState) => void;
  onToggleOpen: () => void;
  rename: (name: string) => void;
  onDelete: () => void;
}

export default function Area({
  areaState,
  setAreaState,
  onToggleOpen,
  rename,
  onDelete,
}: AreaProps) {
  const quiz = useQuiz();
  const setQuiz = useSetQuiz();

  const areaRef = useRef<HTMLDivElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);

  function handleFocus() {
    if (!mouseDown) {
      setWillToggle(true);
    }

    setQuiz({ ...quiz, selectedSublocation: areaState });
  }

  function handleBlur() {
    // setQuiz({ ...quiz, selectedSublocation: null });
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
      onToggleOpen();
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
    <Disclosure defaultOpen={areaState.open}>
      <div ref={areaRef} className="relative">
        <EditLocationButton
          className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
          location={areaState}
          setRenaming={setRenaming}
          onDelete={onDelete}
        />
        <Disclosure.Button
          className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
            quiz.selectedSublocation?.placeId === areaState.placeId
              ? "outline outline-2 outline-red-600"
              : ""
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <LocationName
            location={areaState}
            renaming={renaming}
            rename={rename}
            setRenaming={setRenaming}
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
            parentState={areaState}
            setParentState={setAreaState}
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
