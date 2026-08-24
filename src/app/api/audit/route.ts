import { NextResponse } from "next/server";
import { getAuditLogs, createAuditLog } from "@/lib/repository/heritageRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLog = await createAuditLog(body);
    return NextResponse.json({ success: true, data: newLog });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
