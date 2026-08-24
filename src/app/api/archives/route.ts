import { NextResponse } from "next/server";
import { getAllArchives } from "@/lib/repository/archiveRepository";

export async function GET() {
  try {
    const archives = await getAllArchives();
    return NextResponse.json({ success: true, count: archives.length, data: archives });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
