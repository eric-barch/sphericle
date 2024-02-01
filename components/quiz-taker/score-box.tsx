import { useQuizTakerState } from "./quiz-taker-state-provider";

export default function ScoreBox() {
  const { quizTakerState } = useQuizTakerState();

  return (
    <div className="absolute top-5 right-5 rounded-3xl z-10 bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">
              {quizTakerState.correctFeatureIds.size}
            </td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">
              {quizTakerState.incorrectFeatureIds.size}
            </td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">
              {quizTakerState.remainingFeatureIds.size}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
