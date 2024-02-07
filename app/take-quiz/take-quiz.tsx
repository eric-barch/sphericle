"use client";

import { QuizTaker } from "@/components/quiz-taker";
import { useGoogleLibraries } from "@/hooks/use-google-libraries";
import { QuizTakerProvider, useAllFeatures } from "@/providers";
import { useState } from "react";

function TakeQuiz() {
  const { rootId, allFeatures } = useAllFeatures();
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = () => {
    setGoogleLibsLoaded(true);
  };

  useGoogleLibraries(handleLibsLoad);

  return (
    <QuizTakerProvider>
      <QuizTaker googleLibsLoaded={googleLibsLoaded} />
    </QuizTakerProvider>
  );
}

export default TakeQuiz;
