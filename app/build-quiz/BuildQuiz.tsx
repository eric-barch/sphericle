"use client";

import QuizBuilder from "@/components/QuizBuilder";
import QuizBuilderStateProvider from "@/components/QuizBuilder/QuizBuilderStateProvider";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useCallback, useState } from "react";

export default function BuildQuiz() {
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = useCallback(() => {
    setGoogleLibsLoaded(true);
  }, []);

  useGoogleLibraries(handleLibsLoad);

  return (
    <QuizBuilderStateProvider>
      <QuizBuilder googleLibsLoaded={googleLibsLoaded} />
    </QuizBuilderStateProvider>
  );
}
