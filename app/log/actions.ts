"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getWorkoutLogs() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false });

  if (error) {
    console.error("Error fetching workout logs:", error);
    return [];
  }

  return data ?? [];
}

export async function getWorkoutLogById(logId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("id", logId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching workout log:", error);
    return null;
  }

  return data;
}

export async function createWorkoutLog(
  planId: string | null,
  workoutDate: string,
  workoutData: any,
  notes?: string
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .insert({
      user_id: user.id,
      plan_id: planId,
      workout_date: workoutDate,
      workout_data: workoutData,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating workout log:", error);
    throw new Error(`Failed to create workout log: ${error.message}`);
  }

  revalidatePath("/log");
  return data;
}

export async function updateWorkoutLog(
  logId: string,
  workoutData: any,
  notes?: string
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .update({
      workout_data: workoutData,
      notes: notes || null,
    })
    .eq("id", logId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating workout log:", error);
    throw new Error(`Failed to update workout log: ${error.message}`);
  }

  revalidatePath("/log");
  return data;
}

export async function deleteWorkoutLog(logId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting workout log:", error);
    throw new Error(`Failed to delete workout log: ${error.message}`);
  }

  revalidatePath("/log");
}
