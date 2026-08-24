import { NextResponse } from "next/server";
import { deleteSiteMedia } from "@/lib/repository/heritageRepository";
import { verifyUserToken } from "@/lib/repository/authRepository";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const success = await deleteSiteMedia(params.id, user);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete media from PostgreSQL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Media deleted from PostgreSQL" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
