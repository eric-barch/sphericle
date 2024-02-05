import { useAllFeatures } from "@/components/all-features-provider";
import { isParentFeatureState } from "@/helpers/feature-type-guards";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { RefObject } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

type EditFeatureButtonProps =
  | {
      featureNameInputRef: RefObject<HTMLInputElement>;
      featureAdderInputRef: RefObject<HTMLInputElement>;
      featureId: string;
      canAddSubfeature: true;
      isSelected: boolean;
      isRenaming: boolean;
      isOpen: boolean;
      isAdding: boolean;
    }
  | {
      featureNameInputRef: RefObject<HTMLInputElement>;
      featureAdderInputRef?: never;
      featureId: string;
      canAddSubfeature?: never;
      isSelected: boolean;
      isRenaming: boolean;
      isOpen?: never;
      isAdding?: never;
    };

function EditFeatureButton({
  featureNameInputRef,
  featureAdderInputRef,
  featureId,
  isSelected,
  isRenaming,
  isOpen,
  isAdding,
  canAddSubfeature,
}: EditFeatureButtonProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  const handleOpenChange = () => {
    // If DropdownMenu open state changes, it means the feature was clicked and should be selected.
    if (!isSelected) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
        featureId,
      });
    }
  };

  const handleCloseAutoFocus = (event: Event) => {
    // Prevent DropdownMenu.Trigger from stealing focus on close.
    event.preventDefault();
  };

  const handleAddSubfeature = () => {
    if (!isOpen) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureId,
        isOpen: true,
      });
    }

    if (!isAdding) {
      const lastFeatureState = allFeatures.get(
        quizBuilderState.addingFeatureId,
      );

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_ADDING,
        lastFeatureState: isParentFeatureState(lastFeatureState)
          ? lastFeatureState
          : null,
        featureId,
      });
    }

    setTimeout(() => {
      console.log("fire");
      featureAdderInputRef?.current?.focus();
      featureAdderInputRef?.current?.select();
    }, 0);
  };

  const handleRename = () => {
    if (!isRenaming) {
      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_RENAMING,
        featureId,
      });
    }

    setTimeout(() => {
      featureNameInputRef.current?.focus();
      featureNameInputRef.current?.select();
    }, 0);
  };

  const handleDelete = () => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.DELETE,
      featureId,
    });
  };

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

export { EditFeatureButton };
