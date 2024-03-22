"use-client";

import Link from "next/link";

type QuizProps = {
  quiz: any;
};

const Quiz = (props: QuizProps) => {
  const { quiz } = props;

  const handleClick = () => {
    console.log("quiz", quiz);
  };

  return (
    <Link
      className={`text-left w-1/2 px-7 bg-gray-6 dark:bg-gray-4 text-black border-black border-[calc(1px)] p-1 rounded-2xl`}
      href="/"
    >
      {quiz.title}
    </Link>
  );
};

export { Quiz };
