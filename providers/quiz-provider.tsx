import { QuizBuilderProvider, QuizTakerProvider } from "@/providers";
import { AllFeaturesProvider } from "./all-features-provider";

const QuizProvider = ({ children }) => {
  return (
    <AllFeaturesProvider>
      <QuizTakerProvider>
        <QuizBuilderProvider>{children}</QuizBuilderProvider>
      </QuizTakerProvider>
    </AllFeaturesProvider>
  );
};

export { QuizProvider };
