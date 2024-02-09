"use client";

import { isParent } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { AreaState, QuizBuilderDispatchType } from "@/types";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { MouseEvent, useRef } from "react";
import { ChildFeatures } from "./child-features";
import { EditFeatureButton } from "./edit-feature-button";
import { FeatureName } from "./feature-name";

type AreaProps = {
  area: AreaState;
};

const Area = (props: AreaProps) => {
  const { area } = props;

  const { allFeatures } = useAllFeatures();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

  const name = area.userDefinedName || area.shortName;
  const isSelected = area.id === quizBuilder.selectedId;
  const isRenaming = area.id === quizBuilder.renamingId;
  const isAdding = area.id === quizBuilder.addingId;
  const isOpen = quizBuilder.openIds.has(area.id);

  const nameInputRef = useRef<HTMLInputElement>();
  const adderInputRef = useRef<HTMLInputElement>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isSelected) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_IS_OPEN,
        featureId: area.id,
        isOpen: !isOpen,
      });
    } else {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: area.id,
      });
    }

    const lastAdding = (() => {
      const lastAdding = allFeatures.get(quizBuilder.addingId);
      if (isParent(lastAdding)) return lastAdding;
    })();

    if (isOpen !== isSelected) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_ADDING,
        lastAdding: lastAdding,
        featureId: area.id,
      });
    } else {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_ADDING,
        lastAdding: lastAdding,
        featureId: area.parentId,
      });
    }
  };

  return (
    <Collapsible.Root className="relative" open={isOpen}>
      <div className="relative">
        <EditFeatureButton
          nameInputRef={nameInputRef}
          adderInputRef={adderInputRef}
          featureId={area.id}
          canAddSubfeature
          isSelected={isSelected}
          isRenaming={isRenaming}
          isOpen={isOpen}
          isAdding={isAdding}
        />
        <Collapsible.Trigger
          className={`w-full p-1 bg-gray-600 rounded-2xl text-left${
            isSelected && " outline outline-2 outline-red-700"
          }`}
          onClick={handleClick}
        >
          <FeatureName
            nameInputRef={nameInputRef}
            featureId={area.id}
            name={name}
            isRenaming={isRenaming}
          />
          <OpenChevron isOpen={isOpen} />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <ChildFeatures
          className="ml-10"
          parent={area}
          isAdding={isAdding}
          adderInputRef={adderInputRef}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

type OpenChevronProps = {
  isOpen: boolean;
};

const OpenChevron = (props: OpenChevronProps) => {
  const { isOpen } = props;

  return (
    <div className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl right-1">
      <ChevronRight className={`w-6 h-6${isOpen && " rotate-90"}`} />
    </div>
  );
};

export { Area };
