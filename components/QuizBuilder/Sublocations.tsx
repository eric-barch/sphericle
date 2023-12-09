"use client";

import { useQuiz } from "@/components/QuizProvider";

interface SublocationsProps {
  className?: string;
  parentId: string;
}

export default function Sublocations({
  className,
  parentId,
}: SublocationsProps) {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId];

  return <></>;
}
