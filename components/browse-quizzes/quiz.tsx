"use-client";

import { Button } from "@/components/ui/button";

type QuizProps = {
  quiz: any;
};

const Quiz = (props: QuizProps) => {
  const { quiz } = props;

  const handleClick = () => {
    // console.log("quiz", quiz);
  };

  return (
    <Button
      className={`text-left w-full mt-1 space-y-1 px-7 bg-gray-600 p-1 rounded-2xl`}
      onClick={handleClick}
    >
      {quiz.title}
    </Button>
  );
};

export { Quiz };
