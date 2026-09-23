import { NextResponse } from "next/server";
import { generateCap12Xml, validateCap12Xml } from "@/lib/geoshield/capEngine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, alert, xmlContent } = body;

    if (action === "validate") {
      const validation = validateCap12Xml(xmlContent || "");
      return NextResponse.json({ success: true, validation });
    }

    // Default: generate XML
    const xml = generateCap12Xml(alert || {});
    const validation = validateCap12Xml(xml);

    return NextResponse.json({
      success: true,
      xml,
      valid: validation.valid,
      errors: validation.errors,
    });
  } catch (error: any) {
    console.error("[API CAP] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
