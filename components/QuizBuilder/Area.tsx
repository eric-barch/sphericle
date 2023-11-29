import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, QuizDispatchType } from "@/types";
import { Disclosure, Transition } from "@headlessui/react";
import { KeyboardEvent, MouseEvent, useState } from "react";
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

  const [renaming, setRenaming] = useState<boolean>(false);

  function handleFocus() {
    quizDispatch({
      type: QuizDispatchType.Selected,
      location: areaState,
    });
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    quizDispatch({
      type: QuizDispatchType.ToggledOpen,
      location: areaState,
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <Disclosure defaultOpen={areaState.open}>
      <div className="relative">
        <EditLocationButton
          className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
          location={areaState}
          setRenaming={setRenaming}
        />
        <Disclosure.Button
          className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
            quiz.selectedSublocation?.id === areaState.id
              ? "outline outline-2 outline-red-600"
              : ""
          }`}
          onFocus={handleFocus}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <LocationName
            location={areaState}
            renaming={renaming}
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
          <Sublocations className="ml-10" parent={areaState} />
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
