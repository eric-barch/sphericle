import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import { ChangeEvent, KeyboardEvent, RefObject, useState } from "react";

interface AnswerBoxProps {
  inputRef: RefObject<HTMLInputElement>;
}

export default function AnswerBox({ inputRef }: AnswerBoxProps) {
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
      console.log("Correct!");
    } else {
      console.log("WRONG!!!!");
    }

    inputRef.current.value = "";

    quizDispatch({
      type: QuizDispatchType.INCREMENT_TAKER_SELECTED,
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInput(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  }

  return (
    <input
      ref={inputRef}
      className="w-1/2 p-1 rounded-3xl text-left bg-gray-300 text-black border-2 border-gray-600 px-5 focus:outline-none absolute bottom-9"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
