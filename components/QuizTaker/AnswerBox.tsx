import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { QuizTakerStateDispatchType, SubfeatureState } from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject, useState } from "react";
import toast from "react-hot-toast";
import { useQuizTakerState } from "./QuizTakerStateProvider";

interface AnswerBoxProps {
  displayedFeature: SubfeatureState;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
}

export default function AnswerBox({
  displayedFeature,
  inputRef,
  disabled,
}: AnswerBoxProps) {
  const allFeatures = useAllFeatures();
  const { quizTakerState, quizTakerStateDispatch } = useQuizTakerState();

  const [input, setInput] = useState<string>("");

  function checkAnswer() {
    const normalizedAnswer = (
      displayedFeature.userDefinedName || displayedFeature.shortName
    )
      .trim()
      .toLowerCase();
    const normalizedInput = input.trim().toLowerCase();

    if (normalizedAnswer === normalizedInput) {
      toast.success(
        displayedFeature.userDefinedName || displayedFeature.shortName,
      );

      quizTakerStateDispatch({
        type: QuizTakerStateDispatchType.MARK_CORRECT,
        featureId: quizTakerState.remainingFeatureIds.values().next().value,
      });
    } else {
      toast.error(
        `You said: ${input}\nCorrect answer: ${
          displayedFeature.userDefinedName || displayedFeature.shortName
        }`,
      );

      quizTakerStateDispatch({
        type: QuizTakerStateDispatchType.MARK_INCORRECT,
        featureId: quizTakerState.remainingFeatureIds.values().next().value,
      });
    }

    inputRef.current.value = "";
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      checkAnswer();
    }
  }

  return (
    <input
      ref={inputRef}
      disabled={disabled}
      className="w-1/2 p-1 rounded-3xl text-left bg-white text-black border-2 border-gray-600 px-5 focus:outline-none absolute bottom-9"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
