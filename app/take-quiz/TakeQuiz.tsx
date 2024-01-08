"use client";

import QuizTaker from "@/components/QuizTaker";
import QuizTakerProvider from "@/components/QuizTaker/QuizTakerProvider";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useState } from "react";

export default function TakeQuiz() {
  const [googleLibrariesLoaded, setGoogleLibrariesLoaded] =
    useState<boolean>(false);

  useGoogleLibraries(() => setGoogleLibrariesLoaded(true));

  return googleLibrariesLoaded ? (
    <QuizTakerProvider>
      <QuizTaker />
    </QuizTakerProvider>
  ) : (
    "Loading..."
  );
}
