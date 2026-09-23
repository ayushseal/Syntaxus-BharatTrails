import { query } from "@/lib/db";
import { HazardZone } from "../types";

export class IsroBhuvanProvider {
  id = "isro_bhuvan";
  name = "ISRO / NRSC / Bhuvan";
  country = "India";
  isOfficial = true;

  async getHazardLayers(zoneType?: string): Promise<HazardZone[]> {
    try {
      let sql = `SELECT * FROM hazard_zones WHERE source ILIKE '%ISRO%' OR source ILIKE '%NRSC%'`;
      const params: any[] = [];

      if (zoneType) {
        params.push(zoneType);
        sql += ` AND zone_type = $${params.length}`;
      }

      const res = await query<HazardZone>(sql, params);
      return res?.rows || [];
    } catch (err) {
      console.error("[IsroBhuvanProvider] Error fetching ISRO layers:", err);
      return [];
    }
  }

  getWmsCapabilities(): {
    endpoint: string;
    layers: { id: string; title: string; category: string }[];
  } {
    return {
      endpoint: "https://bhuvan-app1.nrsc.gov.in/bhuvan/wms",
      layers: [
        { id: "landslide_susceptibility_himalaya", title: "Himalayan Pilgrimage Landslide Corridor", category: "Geo" },
        { id: "flood_hazard_zoning_assam_bihar", title: "Brahmaputra & Ganga Basin Flood Zoning", category: "Met" },
        { id: "cyclone_inundation_east_coast", title: "Bay of Bengal Coastal Surge Inundation", category: "Oceanic" },
      ],
    };
  }
}

export const isroProvider = new IsroBhuvanProvider();
