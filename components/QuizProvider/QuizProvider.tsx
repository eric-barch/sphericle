import { Quiz } from "@/types";
import { ReactNode, createContext } from "react";

const QuizContext = createContext<Quiz | null>(null);

export default function QuizProvider({ children }: { children: ReactNode }) {}
