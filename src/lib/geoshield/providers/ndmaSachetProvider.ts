import { query } from "@/lib/db";
import { OfficialAlert } from "../types";

export class NdmaSachetProvider {
  id = "ndma_sachet";
  name = "NDMA SACHET";
  country = "India";
  isOfficial = true;

  async getActiveAlerts(district?: string, state?: string): Promise<OfficialAlert[]> {
    try {
      let sql = `SELECT * FROM official_alerts WHERE country = 'India' AND (expires_at > NOW() OR expires_at IS NULL)`;
      const params: any[] = [];

      if (district) {
        params.push(`%${district}%`);
        sql += ` AND (area_description ILIKE $${params.length} OR headline ILIKE $${params.length})`;
      }

      if (state) {
        params.push(`%${state}%`);
        sql += ` AND (area_description ILIKE $${params.length} OR headline ILIKE $${params.length})`;
      }

      sql += ` ORDER BY effective_at DESC LIMIT 20`;

      const res = await query<OfficialAlert>(sql, params);
      return res?.rows || [];
    } catch (err) {
      console.error("[NdmaSachetProvider] Error querying active alerts:", err);
      return [];
    }
  }

  async getAlertById(alertId: string): Promise<OfficialAlert | null> {
    try {
      const res = await query<OfficialAlert>(
        `SELECT * FROM official_alerts WHERE id = $1 OR alert_identifier = $1 LIMIT 1`,
        [alertId]
      );
      return res?.rows[0] || null;
    } catch (err) {
      console.error("[NdmaSachetProvider] Error fetching alert:", err);
      return null;
    }
  }
}

export const ndmaProvider = new NdmaSachetProvider();
