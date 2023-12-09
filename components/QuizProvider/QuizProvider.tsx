import { Quiz, QuizDispatch } from "@/types";
import { Dispatch, ReactNode, createContext } from "react";

const QuizContext = createContext<Quiz | null>(null);
const QuizDispatchContext = createContext<Dispatch<QuizDispatch> | null>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {}
