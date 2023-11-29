import { LocationType, Quiz } from "@/types";
import { ReactNode, createContext, useContext, useState } from "react";

const QuizContext = createContext(null);
const SetQuizContext = createContext(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <SetQuizContext.Provider value={setQuiz}>
        {children}
      </SetQuizContext.Provider>
    </QuizContext.Provider>
  );
}

export function useQuiz(): Quiz {
  return useContext(QuizContext);
}

export function useSetQuiz(): (quiz: Quiz) => void {
  return useContext(SetQuizContext);
}

const initialQuiz = {
  locationType: LocationType.Quiz as LocationType.Quiz,
  sublocations: [],
  selectedSublocation: null,
};
