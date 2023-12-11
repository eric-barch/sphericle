"use client";

import QuizTaker from "@/components/QuizTaker";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useState } from "react";

export default function TakeQuiz() {
  const [googleLibrariesLoaded, setGoogleLibrariesLoaded] =
    useState<boolean>(false);

  useGoogleLibraries(() => setGoogleLibrariesLoaded(true));

  return googleLibrariesLoaded ? <QuizTaker /> : "Loading...";
}
