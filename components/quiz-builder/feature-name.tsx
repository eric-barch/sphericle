import { useAllFeatures } from "@/components/all-features-provider";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import { KeyboardEvent, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

type FeatureNameProps = {
  featureNameInputRef: React.RefObject<HTMLInputElement>;
  featureId: string;
  featureName: string;
  isRenaming: boolean;
};

const FeatureName = ({
  featureNameInputRef,
  featureId,
  featureName,
  isRenaming,
}: FeatureNameProps) => {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const [input, setInput] = useState<string>(featureName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleEnter = () => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.RENAME,
      featureId,
      name: input,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
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
      // Prevent Accordion toggle when feature name contains spaces.
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
      featureId: null,
    });

    setInput(featureName);
  };

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={featureNameInputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <>{featureName}</>
      )}
    </div>
  );
};

export { FeatureName };
