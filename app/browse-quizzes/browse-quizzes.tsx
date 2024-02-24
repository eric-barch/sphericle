import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const BrowseQuizzes = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const { data: quizzes } = await supabase.from("quizzes").select();

  return (
    <div className="space-y-1 h-full p-3">
      {Array.from(
        quizzes.map((quiz, index) => (
          <Button
            key={index}
            className="text-left w-full mt-1 space-y-1 px-7 bg-gray-600 p-1 rounded-2xl"
          >
            {quiz.title}
          </Button>
        )),
      )}
    </div>
  );
};

export default BrowseQuizzes;
