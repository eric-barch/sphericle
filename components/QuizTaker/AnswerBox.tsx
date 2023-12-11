import { useQuizDispatch } from "@/components/QuizProvider";
import { QuizDispatchType } from "@/types";
import { KeyboardEvent } from "react";

export default function AnswerBox() {
  const quizDispatch = useQuizDispatch();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      quizDispatch({
        type: QuizDispatchType.INCREMENT_TAKER_SELECTED,
      });
    }
  }

  return (
    <input
      className="w-1/2 p-1 rounded-3xl text-left bg-gray-300 text-black border-2 border-gray-600 px-5 focus:outline-none absolute bottom-9"
      onKeyDown={handleKeyDown}
    />
  );
}
