import { useAllFeatures } from "@/components/all-features-provider";
import {
  AllFeaturesDispatchType,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface FeatureNameProps {
  featureId: string;
  featureName: string;
  isRenaming: boolean;
  nameInputRef: React.RefObject<HTMLInputElement>;
}

export default function FeatureName({
  featureId,
  featureName,
  isRenaming,
  nameInputRef,
}: FeatureNameProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const [input, setInput] = useState<string>(featureName);

  const handleChange = useCallback(
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
      dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
      featureId,
      isRenaming: false,
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
    // Prevent Radix Accordion toggle when typing spaces
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  function handleBlur() {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
      featureId,
      isRenaming: false,
    });

    setInput(featureName);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={nameInputRef}
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
