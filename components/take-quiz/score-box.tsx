import { useQuizTaker } from "@/providers";

const ScoreBox = () => {
  const { quizTaker } = useQuizTaker();

  const { correctIds, incorrectIds, remainingIds } = quizTaker;

  return (
    <div className="absolute top-5 right-5 rounded-3xl z-10 bg-gray-500 bg-opacity-80 p-3">
      <table>
        <tbody>
          <tr>
            <td className="pr-4">Correct:</td>
            <td className="text-right">{correctIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Incorrect:</td>
            <td className="text-right">{incorrectIds.size}</td>
          </tr>
          <tr>
            <td className="pr-4">Remaining:</td>
            <td className="text-right">{remainingIds.size}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { ScoreBox };
