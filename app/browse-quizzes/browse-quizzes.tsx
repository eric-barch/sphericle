"use client";

import { Quiz } from "@/components/browse-quizzes/quiz";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const BrowseQuizzes = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  console.log("render");

  const [quizzes, setQuizzes] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase.from("quizzes").select("*");
      if (error) console.error("error", error);
      if (data) setQuizzes(data);
    };

    fetchQuizzes();
  }, [supabase]);

  return (
    quizzes && (
      <div className="space-y-1 h-full p-3">
        {Array.from(
          quizzes.map((quiz, index) => <Quiz key={index} quiz={quiz} />),
        )}
      </div>
    )
  );
};

export default BrowseQuizzes;
