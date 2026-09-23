import { query } from "@/lib/db";
import { DisasterEvent, HazardZone, OfficialAlert, SafePoint } from "../types";

export class NepalReplayProvider {
  id = "nepal_replay";
  name = "Nepal 2026 Historical Replay (BIPAD / NDRRMA)";
  country = "Nepal";
  isOfficial = true;

  async getHistoricalScenario(): Promise<{
    event: DisasterEvent | null;
    alerts: OfficialAlert[];
    zones: HazardZone[];
    safePoints: SafePoint[];
    precipitationMetadata: any;
  }> {
    try {
      // 1. Fetch event
      const evRes = await query<DisasterEvent>(
        `SELECT * FROM disaster_events WHERE id = 'evt_nepal_bhotekoshi_2026_demo' LIMIT 1`
      );
      const event = evRes?.rows[0] || null;

      // 2. Fetch alerts
      const altRes = await query<OfficialAlert>(
        `SELECT * FROM official_alerts WHERE event_id = 'evt_nepal_bhotekoshi_2026_demo'`
      );
      const alerts = altRes?.rows || [];

      // 3. Fetch zones
      const zoneRes = await query<HazardZone>(
        `SELECT * FROM hazard_zones WHERE event_id = 'evt_nepal_bhotekoshi_2026_demo'`
      );
      const zones = zoneRes?.rows || [];

      // 4. Fetch safe points
      const spRes = await query<SafePoint>(
        `SELECT * FROM safe_points WHERE country = 'Nepal'`
      );
      const safePoints = spRes?.rows || [];

      return {
        event,
        alerts,
        zones,
        safePoints,
        precipitationMetadata: {
          product: "NASA GPM IMERG 20260826 Calibrated Replay",
          source: "ICIMOD / NASA Earthdata HDX Archive",
          peak_rate_mm_hr: 48.2,
          timestamp: "2026-08-26T04:15:00Z",
          status: "HISTORICAL_REPLAY",
        },
      };
    } catch (err) {
      console.error("[NepalReplayProvider] Error loading historical scenario:", err);
      return {
        event: null,
        alerts: [],
        zones: [],
        safePoints: [],
        precipitationMetadata: null,
      };
    }
  }
}

export const nepalReplay = new NepalReplayProvider();
