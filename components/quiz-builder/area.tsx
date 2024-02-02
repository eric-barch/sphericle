"use client";

import { AreaState, QuizBuilderStateDispatchType } from "@/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { MouseEvent, useCallback, useRef } from "react";
import EditFeatureButton from "./edit-feature-button";
import FeatureName from "./feature-name";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import Subfeatures from "./subfeatures";

interface AreaProps {
  areaState: AreaState;
}

export default function Area({ areaState }: AreaProps) {
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const isSelected = areaState.featureId === quizBuilderState.selectedFeatureId;
  const isAdding = quizBuilderState.addingFeatureIds.has(areaState.featureId);
  const isOpen = quizBuilderState.openFeatureIds.has(areaState.featureId);
  const isRenaming = quizBuilderState.renamingFeatureIds.has(
    areaState.featureId,
  );

  const featureNameInputRef = useRef<HTMLInputElement>();
  const featureAdderInputRef = useRef<HTMLInputElement>();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureState: areaState,
        isOpen: open,
      });
    },
    [areaState, quizBuilderStateDispatch],
  );

  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isSelected) {
        // If Area is not already selected, prevent toggling Collapsible on first click.
        event.preventDefault();
      }

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId: areaState.featureId,
      });
    },
    [areaState, isSelected, quizBuilderStateDispatch],
  );

  return (
    <Collapsible.Root
      className="relative"
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <div className="relative">
        {/* EditFeatureButton must be BEFORE Collapsible.Trigger (rather than inside it, which would
            more closely align with actual UI appearance) to receive accessible focus in correct
            order. */}
        <EditFeatureButton
          featureId={areaState.featureId}
          canHaveSubfeatures={true}
          featureNameInputRef={featureNameInputRef}
          featureAdderInputRef={featureAdderInputRef}
        />
        <Collapsible.Trigger
          className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
            isSelected ? "outline outline-2 outline-red-700" : ""
          }`}
          onClick={handleTriggerClick}
        >
          <FeatureName
            featureId={areaState.featureId}
            featureName={areaState.userDefinedName || areaState.shortName}
            isRenaming={isRenaming}
            featureNameInputRef={featureNameInputRef}
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
