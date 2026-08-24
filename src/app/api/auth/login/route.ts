import { NextResponse } from "next/server";
import { validateCredentials, generateUserToken } from "@/lib/repository/authRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password or Passkey required" }, { status: 400 });
    }

    const user = await validateCredentials(username || "asi_curator", password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials or unauthorized role" }, { status: 401 });
    }

    const token = generateUserToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      token,
    });

    response.cookies.set("syntaxus_curator_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
