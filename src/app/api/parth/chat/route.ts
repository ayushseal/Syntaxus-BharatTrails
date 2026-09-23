import { NextResponse } from "next/server";
import { processParthQuery } from "@/lib/parth/parthEngine";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, location, country, selectedSiteId, selectedEventId, sessionId, mode } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    // Execute PARTH country-aware tool pipeline
    const parthResponse = await processParthQuery({
      message,
      location,
      country,
      selectedSiteId,
      selectedEventId,
      mode,
    });

    // Non-blocking asynchronous message logging so user gets instant response
    const activeSessionId = sessionId || `session_${Date.now()}`;
    (async () => {
      try {
        if (!sessionId) {
          await query(
            `INSERT INTO parth_sessions (id, country, user_context, created_at) VALUES ($1, $2, $3, NOW())`,
            [activeSessionId, country || "India", JSON.stringify({ location, siteId: selectedSiteId })]
          );
        }

        await query(
          `INSERT INTO parth_messages (id, session_id, role, message, tool_calls, source_references, created_at)
           VALUES ($1, $2, 'user', $3, '[]', '[]', NOW())`,
          [`msg_u_${Date.now()}`, activeSessionId, message]
        );

        await query(
          `INSERT INTO parth_messages (id, session_id, role, message, tool_calls, source_references, created_at)
           VALUES ($1, $2, 'assistant', $3, $4, $5, NOW())`,
          [
            `msg_a_${Date.now()}`,
            activeSessionId,
            parthResponse.raw_markdown,
            JSON.stringify(parthResponse.route_guidance || {}),
            JSON.stringify(parthResponse.sources),
          ]
        );
      } catch (dbErr) {
        console.warn("[API Parth Chat] Session logging skipped:", dbErr);
      }
    })();

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      response: parthResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API Parth Chat] Error processing chat:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
