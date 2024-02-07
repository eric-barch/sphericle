import { useQuizTakerState } from "./quiz-taker-state-provider";

const ScoreBox = () => {
  const {
    quizTakerState: {
      correctFeatureIds,
      incorrectFeatureIds,
      remainingFeatureIds,
    },
  } = useQuizTakerState();

  return (
    <div className="absolute top-5 right-5 rounded-3xl z-10 bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">{correctFeatureIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">{incorrectFeatureIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">{remainingFeatureIds.size}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { ScoreBox };
