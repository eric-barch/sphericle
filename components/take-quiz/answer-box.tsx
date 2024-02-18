import { useQuizTaker } from "@/providers";
import { QuizTakerDispatchType, ChildFeature } from "@/types";
import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type AnswerBoxProps = {
  displayedFeature: ChildFeature;
  disabled: boolean;
};

const AnswerBox = forwardRef(
  (props: AnswerBoxProps, ref: RefObject<HTMLInputElement>) => {
    const { displayedFeature, disabled } = props;

    const { quizTakerDispatch } = useQuizTaker();

    const featureId = displayedFeature?.id;
    const featureName =
      displayedFeature?.userDefinedName || displayedFeature?.shortName;

    const [input, setInput] = useState<string>("");

    const checkAnswer = () => {
      const normalizedAnswer = featureName.trim().toLowerCase();
      const normalizedInput = input.trim().toLowerCase();

      if (normalizedAnswer === normalizedInput) {
        toast.success(
          displayedFeature.userDefinedName || displayedFeature.shortName,
        );

        quizTakerDispatch({
          type: QuizTakerDispatchType.MARK_CORRECT,
          featureId,
        });
      } else {
        toast.error(
          `You said: ${input}\nCorrect answer: ${
            displayedFeature.userDefinedName || displayedFeature.shortName
          }`,
        );

        quizTakerDispatch({
          type: QuizTakerDispatchType.MARK_INCORRECT,
          featureId,
        });
      }

      ref.current.value = "";
      setInput("");
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setInput(event.currentTarget.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        checkAnswer();
      }
    };

    useEffect(() => {
      ref.current?.focus();
    }, [ref]);

    return (
      <input
        ref={ref}
        disabled={disabled}
        className="z-10 w-1/2 p-1 rounded-3xl text-left bg-white text-black border-2 border-gray-600 px-5 focus:outline-none absolute bottom-9"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

AnswerBox.displayName = "AnswerBox";

export { AnswerBox };
