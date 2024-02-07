"use client";

import { isParentFeatureState } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { AreaState, QuizBuilderDispatchType } from "@/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { MouseEvent, useRef } from "react";
import { EditFeatureButton } from "./edit-feature-button";
import { FeatureName } from "./feature-name";
import { Subfeatures } from "./subfeatures";

type AreaProps = {
  areaState: AreaState;
};

const Area = ({ areaState }: AreaProps) => {
  const { featureId, userDefinedName, shortName, parentFeatureId } = areaState;

  const { allFeatures } = useAllFeatures();
  const {
    quizBuilder: {
      selectedFeatureId,
      openFeatureIds,
      addingFeatureId,
      renamingFeatureId,
    },
    quizBuilderDispatch,
  } = useQuizBuilder();

  const featureName = userDefinedName || shortName;
  const isSelected = featureId === selectedFeatureId;
  const isRenaming = featureId === renamingFeatureId;
  const isOpen = openFeatureIds.has(featureId);
  const isAdding = featureId === addingFeatureId;

  const featureNameInputRef = useRef<HTMLInputElement>();
  const featureAdderInputRef = useRef<HTMLInputElement>();

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isSelected) {
      quizBuilderDispatch({
        dispatchType: QuizBuilderDispatchType.SET_IS_OPEN,
        featureId,
        isOpen: !isOpen,
      });
    } else {
      quizBuilderDispatch({
        dispatchType: QuizBuilderDispatchType.SET_SELECTED,
        featureId,
      });
    }

    const lastFeatureState = (() => {
      const lastFeatureState = allFeatures.get(addingFeatureId);

      if (isParentFeatureState(lastFeatureState)) {
        return lastFeatureState;
      }
    })();

    if (isOpen !== isSelected) {
      quizBuilderDispatch({
        dispatchType: QuizBuilderDispatchType.SET_ADDING,
        lastFeatureState,
        featureId,
      });
    } else {
      quizBuilderDispatch({
        dispatchType: QuizBuilderDispatchType.SET_ADDING,
        lastFeatureState,
        featureId: parentFeatureId,
      });
    }
  };

  return (
    <Collapsible.Root className="relative" open={isOpen}>
      <div className="relative">
        {/*EditFeatureButton must be BEFORE Collapsible.Trigger (rather than
         * inside it, which would more closely align with actual UI appearance)
         * to receive accessible focus in correct order. */}
        <EditFeatureButton
          featureNameInputRef={featureNameInputRef}
          featureAdderInputRef={featureAdderInputRef}
          featureId={featureId}
          canAddSubfeature
          isSelected={isSelected}
          isRenaming={isRenaming}
          isOpen={isOpen}
          isAdding={isAdding}
        />
        <Collapsible.Trigger
          className={`w-full p-1 bg-gray-600 rounded-2xl text-left ${
            isSelected ? "outline outline-2 outline-red-700" : ""
          }`}
          onClick={handleTriggerClick}
        >
          <FeatureName
            featureNameInputRef={featureNameInputRef}
            featureId={featureId}
            featureName={featureName}
            isRenaming={isRenaming}
          />
          <OpenChevron isOpen={isOpen} />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <Subfeatures
          className="ml-10"
          featureState={areaState}
          isAdding={isAdding}
          featureAdderInputRef={featureAdderInputRef}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

type OpenChevronProps = {
  isOpen: boolean;
};

const OpenChevron = ({ isOpen }: OpenChevronProps) => {
  return (
    <div className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl right-1">
      <ChevronRight className={`${isOpen ? "rotate-90" : ""} w-6 h-6`} />
    </div>
  );
};

export { Area };
