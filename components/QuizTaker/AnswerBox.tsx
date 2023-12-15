import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, PointState, QuizDispatchType } from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject, useState } from "react";
import toast from "react-hot-toast";

interface AnswerBoxProps {
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
}

export default function AnswerBox({ inputRef, disabled }: AnswerBoxProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();
  const takerSelected = quiz.locations[quiz.takerSelectedId] as
    | AreaState
    | PointState;

  const [input, setInput] = useState<string>("");

  function checkAnswer() {
    const normalizedAnswer = (
      takerSelected.userDefinedName || takerSelected.shortName
    )
      .trim()
      .toLowerCase();
    const normalizedInput = input.trim().toLowerCase();

    if (normalizedAnswer === normalizedInput) {
      toast.success(takerSelected.userDefinedName || takerSelected.shortName);

      quizDispatch({
        type: QuizDispatchType.MARK_TAKER_SELECTED,
        answeredCorrectly: true,
      });
    } else {
      toast.error(
        `You said: ${input}\nCorrect answer: ${
          takerSelected.userDefinedName || takerSelected.shortName
        }`,
      );

      quizDispatch({
        type: QuizDispatchType.MARK_TAKER_SELECTED,
        answeredCorrectly: false,
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
