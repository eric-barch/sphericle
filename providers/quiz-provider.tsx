import { QuizBuilderProvider } from "@/providers";
import { AllFeaturesProvider } from "./all-features-provider";

const QuizProvider = ({ children }) => {
  return (
    <AllFeaturesProvider>
      <QuizBuilderProvider>{children}</QuizBuilderProvider>
    </AllFeaturesProvider>
  );
};

export { QuizProvider };
