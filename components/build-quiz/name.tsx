import { useQuiz, useQuizBuilder } from "@/providers";
import { QuizDispatchType, QuizBuilderDispatchType } from "@/types";
import { KeyboardEvent, useState } from "react";

/**TODO: Would really like to refactor this to use forwardRef so I don't have to use stupid prop
 * names like 'inputRef'. It should just be the reserved 'ref'. First attempt to do this was
 * unsuccessful and reverted just to keep the app working. */
type NameProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  featureId: string;
  name: string;
  isRenaming: boolean;
};

const Name = (props: NameProps) => {
  const { inputRef, featureId, name, isRenaming } = props;

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
          ref={inputRef}
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

export { Name };
