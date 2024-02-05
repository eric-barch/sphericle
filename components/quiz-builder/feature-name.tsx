import { useAllFeatures } from "@/components/all-features-provider";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import { KeyboardEvent, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface FeatureNameProps {
  featureNameInputRef: React.RefObject<HTMLInputElement>;
  featureId: string;
  featureName: string;
}

function FeatureName({
  featureNameInputRef,
  featureId,
  featureName,
}: FeatureNameProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const isRenaming = featureId === quizBuilderState.renamingFeatureId;

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
}

export { FeatureName };
