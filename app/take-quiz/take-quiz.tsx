"use client";

import { QuizTaker } from "@/components/quiz-taker";
import { QuizTakerStateProvider } from "@/components/quiz-taker/quiz-taker-state-provider";
import { useGoogleLibraries } from "@/hooks/use-google-libraries";
import { useState } from "react";

function TakeQuiz() {
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = () => {
    setGoogleLibsLoaded(true);
  };

  useGoogleLibraries(handleLibsLoad);

  return (
    <QuizTakerStateProvider>
      <QuizTaker googleLibsLoaded={googleLibsLoaded} />
    </QuizTakerStateProvider>
  );
}

export default TakeQuiz;
