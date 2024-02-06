"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import { QuizBuilder } from "@/components/quiz-builder";
import { QuizBuilderStateProvider } from "@/components/quiz-builder/quiz-builder-state-provider";
import { useGoogleLibraries } from "@/hooks/use-google-libraries";
import { useState } from "react";

function BuildQuiz() {
  const { rootId } = useAllFeatures();

  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = () => {
    setGoogleLibsLoaded(true);
  };

  useGoogleLibraries(handleLibsLoad);

  return (
    <QuizBuilderStateProvider rootId={rootId}>
      <QuizBuilder googleLibsLoaded={googleLibsLoaded} />
    </QuizBuilderStateProvider>
  );
}

export default BuildQuiz;
