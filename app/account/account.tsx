import { Nav } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col p-8 h-full w-full items-center justify-center border-black border-r-[calc(1px)]">
        <p className="text-4xl font-extrabold w-full mb-8">
          Hey, {user.email}!
        </p>
        <form action={signOut}>
          <button className="rounded-full p-4 py-3 bg-black text-white">
            Logout
          </button>
        </form>
      </div>
    </>
  );
}
