"use client";

import QuizBuilder from "@/components/QuizBuilder";
import useGoogleLibraries from "@/hooks/use-google-libraries";
import { useState } from "react";

export default function BuildQuiz() {
  const [googleLibrariesLoaded, setGoogleLibrariesLoaded] =
    useState<boolean>(false);

  useGoogleLibraries(() => setGoogleLibrariesLoaded(true));

  return googleLibrariesLoaded ? <QuizBuilder /> : "Loading...";
}
