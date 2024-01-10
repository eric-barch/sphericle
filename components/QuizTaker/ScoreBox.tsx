import { useQuizTakerState } from "./QuizTakerProvider";

export default function ScoreBox() {
  const quizTaker = useQuizTakerState();

  return (
    <div className="absolute top-5 right-5 rounded-3xl z-10 bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">{quizTaker.correctIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">{quizTaker.incorrectIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">{quizTaker.remainingIds.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
