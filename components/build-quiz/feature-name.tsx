import { useAllFeatures, useQuizBuilder } from "@/providers";
import { AllFeaturesDispatchType, QuizBuilderDispatchType } from "@/types";
import { KeyboardEvent, useState } from "react";

type FeatureNameProps = {
  nameInputRef: React.RefObject<HTMLInputElement>;
  featureId: string;
  name: string;
  isRenaming: boolean;
};

const FeatureName = ({
  nameInputRef: featureNameInputRef,
  featureId,
  name: featureName,
  isRenaming,
}: FeatureNameProps) => {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderDispatch } = useQuizBuilder();

  const [input, setInput] = useState<string>(featureName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleEnter = () => {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.RENAME,
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
      // Prevent Accordion toggle when feature name contains spaces.
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_RENAMING,
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
