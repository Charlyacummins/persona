"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export async function getPlans() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return data ?? [];
}

export async function getPlanById(planId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching plan:", error);
    return null;
  }

  return data;
}

export async function deletePlan(planId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from("plans")
    .update({ is_active: false })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting plan:", error);
    throw new Error(`Failed to delete plan: ${error.message}`);
  }
}
