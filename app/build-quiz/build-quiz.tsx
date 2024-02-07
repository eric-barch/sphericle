"use client";

import { QuizBuilder } from "@/components/quiz-builder";
import { useGoogleLibraries } from "@/hooks/use-google-libraries";
import { useState } from "react";

function BuildQuiz() {
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = () => {
    setGoogleLibsLoaded(true);
  };

  useGoogleLibraries(handleLibsLoad);

  return <QuizBuilder googleLibsLoaded={googleLibsLoaded} />;
}

export default BuildQuiz;
