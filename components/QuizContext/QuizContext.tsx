import { LocationType, Quiz } from "@/types";
import { ReactNode, createContext, useContext, useState } from "react";

const QuizContext = createContext<Quiz>(null);

const SetQuizContext = createContext(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <SetQuizContext.Provider value={setQuiz}>
        {children}
      </SetQuizContext.Provider>
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}

export function useSetQuiz() {
  return useContext(SetQuizContext);
}

const initialQuiz = {
  locationType: LocationType.Quiz as LocationType.Quiz,
  sublocations: [],
};
