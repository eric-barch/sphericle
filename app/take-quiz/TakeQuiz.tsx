"use client";

import QuizTaker from "@/components/QuizTaker";
import QuizTakerStateProvider from "@/components/QuizTaker/QuizTakerStateProvider";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useState } from "react";

export default function TakeQuiz() {
  const [googleLibrariesLoaded, setGoogleLibrariesLoaded] =
    useState<boolean>(false);

  useGoogleLibraries(() => setGoogleLibrariesLoaded(true));

  return googleLibrariesLoaded ? (
    <QuizTakerStateProvider>
      <QuizTaker />
    </QuizTakerStateProvider>
  ) : (
    "Loading..."
  );
}
