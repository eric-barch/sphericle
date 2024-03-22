"use server";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const SignInButton = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <Link href="/account">Account</Link>
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </>
  );
};

export { SignInButton };
