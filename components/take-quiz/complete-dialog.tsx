import { useQuizTaker } from "@/providers";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

type CompleteDialogProps = {
  handleReset: () => void;
};

const CompleteDialog = ({ handleReset }: CompleteDialogProps) => {
  const { quizTaker } = useQuizTaker();

  const { correctIds, incorrectIds, remainingIds } = quizTaker;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isComplete = remainingIds.size === 0;
    setIsOpen(isComplete);
  }, [remainingIds.size]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Content className="fixed flex flex-col items-center p-4 bg-gray-6 dark:bg-gray-4 text-black border-black border-2 rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <Dialog.Title>Quiz Complete!</Dialog.Title>
        <Dialog.Description className="m-4">{`Your score: ${
          correctIds.size
        } / ${correctIds.size + incorrectIds.size}`}</Dialog.Description>
        <Dialog.Close
          className="p-2 mb-1 w-3/4 rounded-3xl bg-gray-700 text-white"
          onClick={handleReset}
        >
          Take Again
        </Dialog.Close>
        <Dialog.Close
          className="p-2 w-3/4 rounded-3xl bg-gray-700 text-white"
          onClick={handleClose}
        >
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { CompleteDialog };
