import { NextResponse } from "next/server";

const DEFAULT_PASS = "leafnest2026";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASS;

    if (!password || password.trim() !== correctPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password. Please try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });

    response.cookies.set("leafnest_admin_session", "authenticated_admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
