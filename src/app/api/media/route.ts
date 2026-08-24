import { NextResponse } from "next/server";
import { getAllMediaItems, createSiteMedia } from "@/lib/repository/heritageRepository";
import { verifyUserToken } from "@/lib/repository/authRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId") || undefined;
    const media = await getAllMediaItems(siteId);
    return NextResponse.json({ success: true, count: media.length, data: media });
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
    if (!body.title || !body.url) {
      return NextResponse.json({ error: "Media title and URL are required." }, { status: 400 });
    }

    const media = await createSiteMedia(body, user);
    if (!media) {
      return NextResponse.json({ error: "Failed to persist media upload" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Media saved to PostgreSQL", data: media });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
