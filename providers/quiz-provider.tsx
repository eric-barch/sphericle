import { createContext } from "react";
import { AllFeaturesProvider } from "./all-features-provider";
import { QuizBuilderProvider } from "../components/quiz-builder";

const QuizProvider = ({ children }) => {
  return (
    <AllFeaturesProvider>
      <QuizBuilderProvider>{children}</QuizBuilderProvider>
    </AllFeaturesProvider>
  );
};

export { QuizProvider };
