"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import { isParentFeatureState } from "@/helpers/feature-type-guards";
import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { MouseEvent, useRef } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import Subfeatures from "./subfeatures";

interface AreaProps {
  areaState: AreaState;
}

export default function Area({ areaState }: AreaProps) {
  const { allFeatures } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const featureNameInputRef = useRef<HTMLInputElement>();
  const featureAdderInputRef = useRef<HTMLInputElement>();

  const featureId = areaState.featureId;
  const isSelected = quizBuilderState.selectedFeatureId === featureId;
  const featureName = areaState?.userDefinedName || areaState.shortName;
  const isOpen = quizBuilderState.openFeatureIds.has(featureId);
  const isAdding = quizBuilderState.addingFeatureId === featureId;

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId,
      });
    } else {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureId,
        isOpen: !isOpen,
      });
    }

    if (isOpen !== isSelected && !isAdding) {
      const lastFeatureState = allFeatures.get(
        quizBuilderState.addingFeatureId,
      );

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_ADDING,
        lastFeatureState: isParentFeatureState(lastFeatureState)
          ? lastFeatureState
          : undefined,
        featureId,
      });
    }
  };

  return (
    <Collapsible.Root className="relative" open={isOpen}>
      <div className="relative">
        {/* EditFeatureButton must be BEFORE Collapsible.Trigger (rather than inside it, which would
            more closely align with actual UI appearance) to receive accessible focus in correct
            order. */}
        <EditFeatureButton
          featureNameInputRef={featureNameInputRef}
          featureAdderInputRef={featureAdderInputRef}
          featureId={featureId}
          canAddSubfeature
        />
        <Collapsible.Trigger
          className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
            isSelected ? "outline outline-2 outline-red-700" : ""
          }`}
          onClickCapture={handleTriggerClick}
        >
          <FeatureName
            featureNameInputRef={featureNameInputRef}
            featureId={featureId}
            featureName={featureName}
          />
          <OpenChevron isOpen={isOpen} />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <Subfeatures
          className="ml-10"
          parentFeatureState={areaState}
          isAdding={isAdding}
          featureAdderInputRef={featureAdderInputRef}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

interface OpenChevronProps {
  isOpen: boolean;
}

function OpenChevron({ isOpen }: OpenChevronProps) {
  return (
    <div className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl right-1">
      <ChevronRight className={`${isOpen ? "rotate-90" : ""} w-6 h-6`} />
    </div>
  );
}
