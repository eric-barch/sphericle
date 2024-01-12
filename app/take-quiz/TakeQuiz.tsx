"use client";

import QuizTaker from "@/components/QuizTaker";
import QuizTakerStateProvider from "@/components/QuizTaker/QuizTakerStateProvider";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useCallback, useState } from "react";

export default function TakeQuiz() {
  const [googleLibsLoaded, setGoogleLibsLoaded] = useState<boolean>(false);

  const handleLibsLoad = useCallback(() => {
    setGoogleLibsLoaded(true);
  }, []);

  useGoogleLibraries(handleLibsLoad);

  return (
    <QuizTakerStateProvider>
      <QuizTaker googleLibsLoaded={googleLibsLoaded} />
    </QuizTakerStateProvider>
  );
}
