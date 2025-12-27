import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function proxy(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (req.nextUrl.pathname == "/") {
      return NextResponse.redirect(new URL("/tome/home", req.url));
    }

    if (!user?.id) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", user.id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error getting user from session:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while getting user from session" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/", "/api/:path*", "/tome/:path*"],
};
