import { useAllFeatures } from "@/components/all-features-provider";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import { KeyboardEvent, useCallback, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface FeatureNameProps {
  featureId: string;
  featureName: string;
  isRenaming: boolean;
  featureNameInputRef: React.RefObject<HTMLInputElement>;
}

export default function FeatureName({
  featureId,
  featureName,
  isRenaming,
  featureNameInputRef,
}: FeatureNameProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const [input, setInput] = useState<string>(featureName);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    [],
  );

  const handleSubmitName = useCallback(() => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.RENAME,
      featureId,
      name: input,
    });

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
      featureId: null,
    });
  }, [allFeaturesDispatch, featureId, input, quizBuilderStateDispatch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSubmitName();
      }

      if (event.key === "Escape") {
        event.currentTarget.blur();
      }
    },
    [handleSubmitName],
  );

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === " ") {
      // Prevent Accordion toggle when feature name contains spaces.
      event.preventDefault();
    }
  }

  function handleBlur() {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
      featureId: null,
    });

    setInput(featureName);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={featureNameInputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={handleInputChange}
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
