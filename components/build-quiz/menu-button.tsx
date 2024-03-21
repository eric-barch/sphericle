import { isParent } from "@/helpers";
import { useQuiz, useQuizBuilder } from "@/providers";
import {
  QuizDispatchType,
  QuizBuilderDispatchType,
  AreaState,
  PointState,
} from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { RefObject } from "react";

type MenuButtonProps =
  | {
      nameRef: RefObject<HTMLInputElement>;
      searchRef: RefObject<HTMLInputElement>;
      feature: AreaState;
      canAddSubfeature: true;
      isSelected: boolean;
      isOpen: boolean;
      isAdding: boolean;
    }
  | {
      nameRef: RefObject<HTMLInputElement>;
      searchRef?: never;
      feature: PointState;
      canAddSubfeature?: never;
      isSelected: boolean;
      isRenaming: boolean;
      isOpen?: never;
      isAdding?: never;
    };

const MenuButton = (props: MenuButtonProps) => {
  const {
    nameRef,
    searchRef,
    feature,
    isSelected,
    isOpen,
    isAdding,
    canAddSubfeature,
  } = props;

  const { quiz, quizDispatch } = useQuiz();
  const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

  /**TODO: This feels wrong to handle here. I would rather handle the
   * logic at the level of the container that holds all of the
   * Feature's subcomponents. This has proven difficult to accomplish
   * because of how Radix components fully manage focus. */
  const handleOpenChange = () => {
    /**If DropdownMenu open state changes, the feature was clicked and
     * should be selected. If it was already open, it should be set to
     * adding. */
    if (!isSelected) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_SELECTED,
        featureId: feature.id,
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
        nextAddingId: feature.id,
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
      featureId: feature.id,
      isOpen: true,
    });

    const lastAdding = (() => {
      const lastAdding = quiz.get(quizBuilder.addingId);
      if (isParent(lastAdding)) return lastAdding;
    })();

    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_ADDING,
      lastAdding,
      nextAddingId: feature.id,
    });

    setTimeout(() => {
      searchRef?.current?.focus();
      searchRef?.current?.select();
    }, 0);
  };

  const handleRename = () => {
    quizBuilderDispatch({
      type: QuizBuilderDispatchType.SET_RENAMING,
      featureId: feature.id,
    });

    setTimeout(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    }, 0);
  };

  const handleDelete = () => {
    if (isAdding) {
      quizBuilderDispatch({
        type: QuizBuilderDispatchType.SET_ADDING,
        lastAdding: feature,
        nextAddingId: feature.parentId,
      });
    }

    quizDispatch({
      type: QuizDispatchType.DELETE,
      featureId: feature.id,
    });
  };

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5">
        <MoreVertical className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="absolute z-10 top-1 ml-[-1.2rem] bg-gray-5 dark:bg-gray-3 border-black border-[calc(1px)] rounded-1.25 p-1 space-y-1 focus:outline-none"
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        {canAddSubfeature && (
          <DropdownMenu.Item
            onClick={handleAddSubfeature}
            className="rounded-2xl cursor-pointer px-7 py-1 min-w-max border-[calc(1px)] border-gray-5 dark:border-gray-3 data-[highlighted]:border-black data-[highlighted]:bg-gray-6 dark:data-[highlighted]:bg-gray-4 focus:outline-none"
          >
            Add Subfeature
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Item
          onClick={handleRename}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max border-[calc(1px)] border-gray-5 dark:border-gray-3 data-[highlighted]:border-black data-[highlighted]:bg-gray-6 dark:data-[highlighted]:bg-gray-4 focus:outline-none"
        >
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={handleDelete}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max border-[calc(1px)] border-gray-5 dark:border-gray-3 data-[highlighted]:border-black data-[highlighted]:bg-gray-6 dark:data-[highlighted]:bg-gray-4 focus:outline-none"
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export { MenuButton };
