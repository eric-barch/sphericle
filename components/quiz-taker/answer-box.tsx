import { useQuizTaker } from "@/providers";
import { QuizTakerDispatchType, Child } from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject, useState } from "react";
import toast from "react-hot-toast";

type AnswerBoxProps = {
  displayedFeature: Child;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
};

const AnswerBox = ({
  displayedFeature,
  inputRef,
  disabled,
}: AnswerBoxProps) => {
  const { quizTakerDispatch } = useQuizTaker();

  const featureId = displayedFeature?.id;
  const featureName =
    displayedFeature?.userDefinedName || displayedFeature?.shortName;

  const [input, setInput] = useState<string>("");

  const checkAnswer = () => {
    const normalizedAnswer = featureName.trim().toLowerCase();
    const normalizedInput = input.trim().toLowerCase();

    if (normalizedAnswer === normalizedInput) {
      toast.success(
        displayedFeature.userDefinedName || displayedFeature.shortName,
      );

      quizTakerDispatch({
        type: QuizTakerDispatchType.MARK_CORRECT,
        featureId,
      });
    } else {
      toast.error(
        `You said: ${input}\nCorrect answer: ${
          displayedFeature.userDefinedName || displayedFeature.shortName
        }`,
      );

      quizTakerDispatch({
        type: QuizTakerDispatchType.MARK_INCORRECT,
        featureId,
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
