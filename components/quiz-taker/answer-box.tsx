import { useAllFeatures } from "@/components/quiz-provider";
import { QuizTakerStateDispatchType, SubfeatureState } from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject, useState } from "react";
import toast from "react-hot-toast";
import { useQuizTakerState } from "./quiz-taker-state-provider";

interface AnswerBoxProps {
  displayedFeature: SubfeatureState;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
}

const AnswerBox = ({
  displayedFeature,
  inputRef,
  disabled,
}: AnswerBoxProps) => {
  const { userDefinedName, shortName } = displayedFeature;
  const { quizTakerStateDispatch } = useQuizTakerState();

  const featureName = userDefinedName || shortName;

  const [input, setInput] = useState<string>("");

  const checkAnswer = () => {
    const normalizedAnswer = featureName.trim().toLowerCase();
    const normalizedInput = input.trim().toLowerCase();

    if (normalizedAnswer === normalizedInput) {
      toast.success(
        displayedFeature.userDefinedName || displayedFeature.shortName,
      );

      quizTakerStateDispatch({
        dispatchType: QuizTakerStateDispatchType.MARK_CORRECT,
        featureState: displayedFeature,
      });
    } else {
      toast.error(
        `You said: ${input}\nCorrect answer: ${
          displayedFeature.userDefinedName || displayedFeature.shortName
        }`,
      );

      quizTakerStateDispatch({
        dispatchType: QuizTakerStateDispatchType.MARK_INCORRECT,
        featureState: displayedFeature,
      });
    }

    inputRef.current.value = "";
    setInput("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      checkAnswer();
    }
  };

  return (
    <input
      ref={inputRef}
      disabled={disabled}
      className="w-1/2 p-1 rounded-3xl text-left bg-white text-black border-2 border-gray-600 px-5 focus:outline-none absolute bottom-9"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export { AnswerBox };
