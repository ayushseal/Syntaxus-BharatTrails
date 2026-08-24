import { NextResponse } from "next/server";
import { getAllOralStories, createOralStory } from "@/lib/repository/heritageRepository";
import { verifyUserToken } from "@/lib/repository/authRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId") || undefined;
    const stories = await getAllOralStories(siteId);
    return NextResponse.json({ success: true, count: stories.length, data: stories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.substring(7);
    else {
      const match = cookieHeader.match(/syntaxus_curator_token=([^;]+)/);
      if (match) token = match[1];
    }

    const user = token ? verifyUserToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Curator login required." }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.fullText) {
      return NextResponse.json({ error: "Title and Narrative Text are required." }, { status: 400 });
    }

    const story = await createOralStory(body, user);
    if (!story) {
      return NextResponse.json({ error: "Failed to persist oral story" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Oral story saved to PostgreSQL", data: story });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
