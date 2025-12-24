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
    revalidatePath("/tomb/home");
    redirect("/tomb/home");
  }

  return { error: null, user: data.user };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, user: null };
  }

  if (data.user) {
    revalidatePath("/tomb/home");
    redirect("/tomb/home");
  }

  return { error: null, user: data.user };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getSession() {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session, error: null };
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  if (user && !user.email) {
    return { user: null, error: null };
  }

  return { user, error: null };
}
