"use server";

import OpenAI from "openai";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function sendCoachMessage(message: string) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 1) Save user message
  await supabase.from("coach_messages").insert({
    user_id: user.id,
    role: "user",
    content: message.trim(),
  });

  // 2) Fetch recent chat history
  const { data: history } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(30);

  // 3) Fetch profile (context)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 4) Call OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // fast + cheap for chat
    messages: [
      {
        role: "system",
        content: `You are Persona, an experienced personal training coach.
Be concise, practical, and evidence-based.
Ask clarifying questions when needed.

User profile:
${JSON.stringify(profile, null, 2)}`,
      },
      ...(history ?? []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
  });

  const reply =
    response.choices[0]?.message?.content ??
    "I couldn't generate a response — please try again.";

  // 5) Save assistant reply
  await supabase.from("coach_messages").insert({
    user_id: user.id,
    role: "assistant",
    content: reply,
  });

  // 6) Return updated history
  const { data: updated } = await supabase
    .from("coach_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  return updated ?? [];
}
