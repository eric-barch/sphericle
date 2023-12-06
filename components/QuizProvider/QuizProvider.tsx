import {
  LocationType,
  QuizState,
  QuizDispatch,
  QuizDispatchType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const QuizContext = createContext<QuizState>(null);
const QuizDispatchContext = createContext<Dispatch<QuizDispatch>>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, dispatchQuiz] = useReducer(quizReducer, initialQuiz);

  return (
    <QuizContext.Provider value={quiz}>
      <QuizDispatchContext.Provider value={dispatchQuiz}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizState {
  return useContext(QuizContext);
}

export function useQuizDispatch(): Dispatch<QuizDispatch> {
  return useContext(QuizDispatchContext);
}

function quizReducer(quiz: QuizState, action: QuizDispatch): QuizState {
  switch (action.type) {
    case QuizDispatchType.SelectedLocation: {
      const newQuiz = { ...quiz };
      return newQuiz;
    }
  }
}

const initialQuiz: QuizState = {
  id: crypto.randomUUID(),
  locationType: LocationType.Quiz,
  isAdding: true,
  shortName: "quiz",
  sublocations: [],
  builderSelected: null,
  takerSelected: null,
};
