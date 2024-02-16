import { isParent } from "@/helpers";
import { useQuiz, useQuizBuilder } from "@/providers";
import { QuizDispatchType, QuizBuilderDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { RefObject } from "react";

type EditFeatureButtonProps =
  | {
      nameInputRef: RefObject<HTMLInputElement>;
      adderInputRef: RefObject<HTMLInputElement>;
      featureId: string;
      canAddSubfeature: true;
      isSelected: boolean;
      isOpen: boolean;
    }
  | {
      nameInputRef: RefObject<HTMLInputElement>;
      adderInputRef?: never;
      featureId: string;
      canAddSubfeature?: never;
      isSelected: boolean;
      isRenaming: boolean;
      isOpen?: never;
      isAdding?: never;
    };

const EditFeatureButton = (props: EditFeatureButtonProps) => {
  const {
    nameInputRef,
    adderInputRef,
    featureId,
    isSelected,
    isOpen,
    canAddSubfeature,
  } = props;

  const { quiz, quizDispatch } = useQuiz();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

  const handleOpenChange = () => {
    /**If DropdownMenu open state changes, the feature was clicked and
     * should be selected. If it was already open, it should be set to
     * adding. */
    if (!isSelected) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId,
      });
    }

    if (isOpen) {
      const lastAdding = (() => {
        const lastAdding = quiz.get(quizBuilder.addingId);
        if (isParent(lastAdding)) return lastAdding;
      })();

      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_ADDING,
        lastAdding,
        nextAddingId: featureId,
      });
    }
  };

  const handleCloseAutoFocus = (event: Event) => {
    /**Prevent DropdownMenu.Trigger from stealing focus on close. */
    event.preventDefault();
  };

  const handleAddSubfeature = () => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_IS_OPEN,
      featureId,
      isOpen: true,
    });

    const lastAdding = (() => {
      const lastAdding = quiz.get(quizBuilder.addingId);
      if (isParent(lastAdding)) return lastAdding;
    })();

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_ADDING,
      lastAdding,
      nextAddingId: featureId,
    });

    setTimeout(() => {
      adderInputRef?.current?.focus();
      adderInputRef?.current?.select();
    }, 0);
  };

  const handleRename = () => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_RENAMING,
      featureId,
    });

    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 0);
  };

  const handleDelete = () => {
    quizDispatch({
      type: QuizDispatchType.DELETE,
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
};

export { EditFeatureButton };
