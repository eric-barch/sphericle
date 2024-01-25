import { useAllFeatures } from "@/components/AllFeaturesProvider";
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
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface FeatureNameProps {
  featureState: SubfeatureState;
}

export default function FeatureName({ featureState }: FeatureNameProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const [input, setInput] = useState<string>(
    featureState.userDefinedName || featureState.shortName,
  );

  const isRenaming = useMemo(() => {
    if (quizBuilderState.renamingFeatureIds.has(featureState.id)) {
      return true;
    }

    return false;
  }, [quizBuilderState, featureState]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (isRenaming) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, 0);
  }, [isRenaming]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();

        quizBuilderStateDispatch({
          type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING,
          feature: featureState,
          isRenaming: false,
        });

        allFeaturesDispatch({
          type: AllFeaturesDispatchType.RENAME_FEATURE,
          feature: featureState,
          name: input,
        });
      }

      if (event.key === "Escape") {
        event.currentTarget.blur();
      }
    },
    [allFeaturesDispatch, featureState, input, quizBuilderStateDispatch],
  );

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
      feature: featureState,
      isRenaming: false,
    });
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {quizBuilderState.renamingFeatureIds.has(featureState.id) ? (
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
