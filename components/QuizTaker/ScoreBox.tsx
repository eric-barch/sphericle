import { useQuiz } from "@/components/QuizProvider";

export default function ScoreBox() {
  const quiz = useQuiz();

  const correctLocations = quiz.correct;
  const totalLocations = quiz.size;

  return (
    <div className="absolute top-5 right-5 rounded-3xl z-10 bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">{quiz.correct}</td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">{quiz.incorrect}</td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">
              {quiz.size - (quiz.correct + quiz.incorrect)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
