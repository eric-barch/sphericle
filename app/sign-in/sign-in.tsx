import { Nav } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SignInButton } from "./submit-button";
import Link from "next/link";

const SignIn = () => {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/");
    }

    return redirect("/account");
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="flex flex-col space-y-2 items-center bg-gray-6 dark:bg-gray-4 p-8 rounded-3xl border border-black text-black w-1/2">
          <h2 className="text-3xl font-extrabold">Sign In</h2>
          <form className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-1 rounded-3xl text-left bg-white dark:bg-gray-6 border border-black text-ellipsis focus:outline-none"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="password">Password</label>
              <input
                className="w-full px-4 py-1 rounded-3xl text-left bg-white dark:bg-gray-6 border border-black text-ellipsis focus:outline-none"
                type="password"
                name="password"
                placeholder="••••••••••"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <SignInButton formAction={signIn}>Sign In</SignInButton>
              <p>
                or{" "}
                <Link className="text-blue-800" href="/sign-up">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
