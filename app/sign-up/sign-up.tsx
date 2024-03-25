import { Nav } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/ui/submit-button";

const SignUp = () => {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/sign-in");
    }

    return redirect("/sign-in");
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="flex flex-col space-y-2 items-center bg-gray-6 dark:bg-gray-4 p-8 rounded-3xl border border-black text-black w-1/2">
          <h2 className="text-3xl font-extrabold">Sign Up</h2>
          <form className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-col items-start space-y-2 w-full">
              <label htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-1 rounded-3xl text-left bg-white dark:bg-gray-6 border border-black text-ellipsis focus:outline-none"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col items-start space-y-2 w-full">
              <label htmlFor="password">Password</label>
              <input
                className="w-full px-4 py-1 rounded-3xl text-left bg-white dark:bg-gray-6 border border-black text-ellipsis focus:outline-none"
                type="password"
                name="password"
                placeholder="••••••••••"
                required
              />
            </div>
            <div className="flex flex-col items-center space-y-2 w-full">
              <SubmitButton formAction={signUp}>Sign Up</SubmitButton>
              <p>
                or{" "}
                <Link className="text-blue-800" href="/sign-in">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
