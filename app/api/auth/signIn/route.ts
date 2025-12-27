import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Signed in" }, { status: 200 });
}
