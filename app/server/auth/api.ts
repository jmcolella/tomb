"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signUp(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message, user: null };
  }

  if (data.user) {
    revalidatePath("/tome/home");
    redirect("/tome/home");
  }

  return { error: null, user: data.user };
}
