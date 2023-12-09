import Link from "next/link";
import SplitPane from "../SplitPane";

export default function QuizBuilder() {
  return (
    <SplitPane>
      <div className="relative h-full">
        <div className="h-full bg-red-900" />
        <Link
          className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
          href="/take-quiz"
        >
          Take Quiz
        </Link>
      </div>
      <div className="bg-green-900 h-full" />
    </SplitPane>
  );
}
