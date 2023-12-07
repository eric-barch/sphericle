import {
  LocationType,
  QuizDispatch,
  QuizDispatchType,
  QuizState,
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

  // useEffect(() => {
  //   console.log("quiz", quiz);
  // }, [quiz]);

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
    case QuizDispatchType.AddedSublocation: {
      const newQuiz = { ...quiz };

      // TODO: would prefer to fix by preventing reducer from firing twice
      if (!quiz.sublocations.includes(action.sublocation)) {
        newQuiz.sublocations.push(action.sublocation);
        action.sublocation.parent = newQuiz;
      }

      return newQuiz;
    }
    case QuizDispatchType.SelectedBuilderLocation: {
      const newQuiz = { ...quiz };
      newQuiz.builderSelected = action.location;
      return newQuiz;
    }
    case QuizDispatchType.UpdatedSublocations: {
      const newQuiz = { ...quiz };
      newQuiz.sublocations = action.sublocations;
      return newQuiz;
    }
  }
}

const initialQuiz: QuizState = {
  id: crypto.randomUUID(),
  locationType: LocationType.Quiz,
  shortName: "quiz",
  sublocations: [],
  builderSelected: null,
  takerSelected: null,
};
