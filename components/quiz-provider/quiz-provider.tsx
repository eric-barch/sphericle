import { createContext } from "react";
import { AllFeaturesProvider } from "./all-features-provider";
import { QuizBuilderStateProvider } from "../quiz-builder";

const QuizProvider = ({ children }) => {
  return (
    <AllFeaturesProvider>
      <QuizBuilderStateProvider>{children}</QuizBuilderStateProvider>
    </AllFeaturesProvider>
  );
};

export { QuizProvider };
