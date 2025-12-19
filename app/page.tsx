import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // check profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black sm:px-6 lg:px-8">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 sm:py-24 lg:py-32 bg-white dark:bg-black sm:items-start">
    
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-2xl sm:text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Persona
          </h1>
          <p className="max-w-md text-base sm:text-lg leading-8 text-zinc-600 dark:text-zinc-400">
           Head over to the chat to create your first plan, tweak it, then save it to your plans. Log workouts based on the selected plan in logs.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 text-base font-medium sm:flex-row sm:w-auto">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-[158px]"
            href={'/coach'}
            
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Chat
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-[158px]"
            href={'/plans'}
            
          >
            View Plans
          </Link>
        </div>
      </main>
    </div>
  );
}
