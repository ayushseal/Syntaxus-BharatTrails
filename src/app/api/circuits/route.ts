import { NextResponse } from "next/server";
import { getAllCircuits } from "@/lib/repository/circuitRepository";

export async function GET() {
  try {
    const circuits = await getAllCircuits();
    return NextResponse.json({ success: true, count: circuits.length, data: circuits });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
