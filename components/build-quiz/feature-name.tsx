import { useQuiz, useQuizBuilder } from "@/providers";
import { QuizDispatchType, QuizBuilderDispatchType } from "@/types";
import { KeyboardEvent, useState } from "react";

type FeatureNameProps = {
  nameInputRef: React.RefObject<HTMLInputElement>;
  featureId: string;
  name: string;
  isRenaming: boolean;
};

const FeatureName = (props: FeatureNameProps) => {
  const { nameInputRef, featureId, name, isRenaming } = props;

  const { quizDispatch } = useQuiz();
  const { quizBuilderDispatch } = useQuizBuilder();

  const [input, setInput] = useState<string>(name);

  const handleEnter = () => {
    quizDispatch({
      type: QuizDispatchType.RENAME,
      featureId,
      name: input,
    });

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_RENAMING,
      featureId: null,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEnter();
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      /**Prevent Collapsible toggle when feature name contains spaces. */
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_RENAMING,
      featureId: null,
    });

    setInput(name);
  };

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={nameInputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <>{name}</>
      )}
    </div>
  );
};

export { FeatureName };
