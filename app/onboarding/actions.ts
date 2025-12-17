"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Prepare the profile data
  const profileData = {
    display_name: formData.get("display_name") as string,
    age_range: formData.get("age_range") as string,
    sex: formData.get("sex") as string,
    experience_level: formData.get("experience_level") as string,
    primary_goal: formData.get("primary_goal") as string,
    training_days_per_week: parseInt(formData.get("training_days_per_week") as string),
    preferred_style: formData.get("preferred_style") as string,
    available_equipment: formData.get("available_equipment") as string,
    injuries: formData.get("injuries") as string || null,
  };

  // Update the profile
  const { error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  // Redirect to the coach page after successful update
  redirect("/coach");
}
