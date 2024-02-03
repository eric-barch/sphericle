import { useAllFeatures } from "@/components/all-features-provider";
import { isParentFeatureState } from "@/helpers/feature-type-guards";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { RefObject, useCallback } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

type EditFeatureButtonProps =
  | {
      featureId: string;
      canAddSubfeature: true;
      featureNameInputRef: RefObject<HTMLInputElement>;
      featureAdderInputRef: RefObject<HTMLInputElement>;
    }
  | {
      featureId: string;
      canAddSubfeature?: never;
      featureNameInputRef: RefObject<HTMLInputElement>;
      featureAdderInputRef?: never;
    };

export default function EditFeatureButton({
  featureId,
  canAddSubfeature,
  featureNameInputRef,
  featureAdderInputRef,
}: EditFeatureButtonProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const isSelected = quizBuilderState.selectedFeatureId === featureId;

  const handleOpenChange = useCallback(() => {
    // If DropdownMenu open state changes, it means the feature was clicked and should be selected.
    if (!isSelected) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId,
      });
    }
  }, [featureId, isSelected, quizBuilderStateDispatch]);

  const handleCloseAutoFocus = useCallback((event: Event) => {
    // Prevent DropdownMenu.Trigger from stealing focus on close.
    event.preventDefault();
  }, []);

  const handleAddSubfeature = useCallback(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
      featureId,
      isOpen: true,
    });

    const lastFeatureState = allFeatures.get(quizBuilderState.addingFeatureId);

    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_ADDING,
      lastFeatureState: isParentFeatureState(lastFeatureState)
        ? lastFeatureState
        : null,
      featureId,
    });

    setTimeout(() => {
      featureAdderInputRef?.current?.focus();
      featureAdderInputRef?.current?.select();
    }, 0);
  }, [
    featureId,
    quizBuilderState,
    quizBuilderStateDispatch,
    allFeatures,
    featureAdderInputRef,
  ]);

  const handleRename = useCallback(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
      featureId,
    });

    setTimeout(() => {
      featureNameInputRef.current?.focus();
      featureNameInputRef.current?.select();
    }, 0);
  }, [featureId, quizBuilderStateDispatch, featureNameInputRef]);

  const handleDelete = useCallback(() => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.DELETE,
      featureId,
    });
  }, [featureId, allFeaturesDispatch]);

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5">
        <MoreVertical className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="absolute z-10 top-1 ml-[-1.2rem] bg-gray-500 rounded-1.25 p-1 space-y-1 focus:outline-none"
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        {canAddSubfeature && (
          <DropdownMenu.Item
            onClick={handleAddSubfeature}
            className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
          >
            Add Subfeature
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Item
          onClick={handleRename}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
        >
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={handleDelete}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
