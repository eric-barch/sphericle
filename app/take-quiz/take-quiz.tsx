"use client";

import { QuizTaker } from "@/components/quiz-taker";
import { QuizTakerProvider } from "@/providers";
import { useState } from "react";

const TakeQuiz = () => {
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = () => {
    setGoogleLibsLoaded(true);
  };

  return (
    <QuizTakerProvider>
      <QuizTaker googleLibsLoaded={googleLibsLoaded} />
    </QuizTakerProvider>
  );
};

export default TakeQuiz;
