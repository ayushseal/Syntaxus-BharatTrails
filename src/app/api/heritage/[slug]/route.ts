import { NextResponse } from "next/server";
import { getHeritageSiteBySlug, updateSiteProtocolAndNotice } from "@/lib/repository/heritageRepository";
import { verifyUserToken } from "@/lib/repository/authRepository";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const site = await getHeritageSiteBySlug(params.slug);
    if (!site) {
      return NextResponse.json({ error: "Heritage site not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: site });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
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

    const body = await request.json();
    const success = await updateSiteProtocolAndNotice(
      params.slug,
      {
        photographyAllowed: body.photographyAllowed || "permitted",
        interiorAccess: body.interiorAccess || "open",
        currentStatus: body.currentStatus || "open",
        specialNotice: body.specialNotice || "",
      },
      user
    );

    if (!success) {
      return NextResponse.json({ error: "Failed to update site access protocol in PostgreSQL" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Protocol and live operational status successfully committed to PostgreSQL for ${params.slug}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
