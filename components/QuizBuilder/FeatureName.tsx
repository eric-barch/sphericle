import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { isSubfeatureState } from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface FeatureNameProps {
  featureId: string;
}

export default function FeatureName({ featureId }: FeatureNameProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const [featureState, setFeatureState] = useState<SubfeatureState>(() => {
    const initialFeatureState = allFeatures.get(featureId);

    if (!isSubfeatureState(initialFeatureState)) {
      throw new Error("initialFeatureState must be a SubfeatureState.");
    }

    return initialFeatureState;
  });
  const [input, setInput] = useState<string>(
    featureState.userDefinedName || featureState.shortName,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const featureState = allFeatures.get(featureId);

    if (!featureState || !isSubfeatureState(featureState)) {
      return;
    }

    setFeatureState(featureState);
  }, [allFeatures, featureId]);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (quizBuilderState.renamingFeatures.has(featureId)) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [featureId, quizBuilderState.renamingFeatures]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING,
        featureId,
        isRenaming: false,
      });

      allFeaturesDispatch({
        type: AllFeaturesDispatchType.RENAME_FEATURE,
        featureId,
        name: input,
      });
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    // Prevent default Radix Accordion toggle when typing spaces
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  function handleBlur() {
    setInput(featureState.userDefinedName || featureState.shortName);

    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING,
      featureId,
      isRenaming: false,
    });
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {quizBuilderState.renamingFeatures.has(featureId) ? (
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
        <>{featureState.userDefinedName || featureState.shortName}</>
      )}
    </div>
  );
}
