"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const signIn = async () => {
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setStatus(error.message);
    else setStatus("Check your email for the login link.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Persona</h1>
        <input
          className="w-full border rounded p-2"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full border rounded p-2" onClick={signIn}>
          Send magic link
        </button>
        {status && <p className="text-sm opacity-80">{status}</p>}
      </div>
    </div>
  );
}
