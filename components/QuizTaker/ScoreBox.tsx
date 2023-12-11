import { useQuiz } from "@/components/QuizProvider";

export default function ScoreBox() {
  const quiz = useQuiz();

  const correctLocations = quiz.correctLocations;
  const totalLocations = quiz.totalLocations;

  return (
    <div className="absolute flex justify-center items-center w-36 p-3 top-5 right-5 text-2xl z-50 rounded-full bg-gray-500 bg-opacity-80">
      {`${correctLocations} / ${totalLocations}`}
    </div>
  );
}
