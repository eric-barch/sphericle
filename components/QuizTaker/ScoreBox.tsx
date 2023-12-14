import { useQuiz } from "@/components/QuizProvider";

export default function ScoreBox() {
  const quiz = useQuiz();

  const correctLocations = quiz.correctLocations;
  const totalLocations = quiz.totalLocations;

  return (
    <div className="absolute top-5 right-5 z-40 rounded-3xl bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">{quiz.correctLocations}</td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">{quiz.incorrectLocations}</td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">
              {quiz.totalLocations -
                (quiz.correctLocations + quiz.incorrectLocations)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
