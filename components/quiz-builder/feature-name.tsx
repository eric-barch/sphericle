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
  renameInputRef: React.RefObject<HTMLInputElement>;
}

export default function FeatureName({
  featureId,
  featureName,
  isRenaming,
  renameInputRef,
}: FeatureNameProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const [input, setInput] = useState<string>(featureName);

  useEffect(() => {}, [isRenaming, renameInputRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();

        quizBuilderStateDispatch({
          dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
          featureId,
          isRenaming: false,
        });

        allFeaturesDispatch({
          dispatchType: AllFeaturesDispatchType.RENAME,
          featureId,
          name: input,
        });
      }

      if (event.key === "Escape") {
        event.currentTarget.blur();
      }
    },
    [allFeaturesDispatch, featureId, input, quizBuilderStateDispatch],
  );

  /**TODO: Would rather do this with keydown if possible. Also, think it would be better to do by
   * stopping propagation. */
  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    // Prevent default Radix Accordion toggle when typing spaces
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  function handleBlur() {
    setInput(featureName);

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
      featureId,
      isRenaming: false,
    });
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={renameInputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
