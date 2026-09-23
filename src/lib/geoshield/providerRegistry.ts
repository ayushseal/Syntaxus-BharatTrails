import { query } from "@/lib/db";
import { DataSourceHealth } from "./types";
import { ndmaProvider } from "./providers/ndmaSachetProvider";
import { isroProvider } from "./providers/isroBhuvanProvider";
import { imdProvider } from "./providers/imdWeatherProvider";
import { openMeteoProvider } from "./providers/openMeteoProvider";
import { gpmProvider } from "./providers/nasaGpmProvider";
import { nepalReplay } from "./providers/nepalReplayProvider";

export class GeoShieldProviderRegistry {
  isIndiaLocation(lat: number, lng: number): boolean {
    // Approximate India bounding box
    return lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
  }

  isNepalLocation(lat: number, lng: number): boolean {
    return lat >= 26.3 && lat <= 30.5 && lng >= 80.0 && lng <= 88.2;
  }

  getAlertProvider(country: string = "India") {
    if (country.toLowerCase() === "nepal") {
      return nepalReplay;
    }
    return ndmaProvider;
  }

  getWeatherProvider(country: string = "India") {
    if (country.toLowerCase() === "india") {
      return imdProvider;
    }
    return openMeteoProvider;
  }

  getGisProvider() {
    return isroProvider;
  }

  getPrecipitationProvider() {
    return gpmProvider;
  }

  async getAllDataSources(): Promise<DataSourceHealth[]> {
    try {
      const res = await query<DataSourceHealth>(
        `SELECT id, name, provider, country, source_type, coverage, is_official, last_success_at, status, refresh_interval_seconds
         FROM disaster_sources
         ORDER BY is_official DESC, country ASC`
      );
      return res?.rows || [];
    } catch (err) {
      console.error("[ProviderRegistry] Error fetching sources:", err);
      return [
        {
          id: "src_ndma_sachet",
          name: "NDMA SACHET",
          provider: "National Disaster Management Authority (C-DOT / GoI)",
          country: "India",
          source_type: "official_govt",
          coverage: "Pan-India",
          is_official: true,
          status: "ACTIVE",
          refresh_interval_seconds: 300,
        },
        {
          id: "src_isro_nrsc",
          name: "ISRO / NRSC / Bhuvan",
          provider: "National Remote Sensing Centre (ISRO)",
          country: "India",
          source_type: "satellite",
          coverage: "India & Pilgrimage Corridors",
          is_official: true,
          status: "ACTIVE",
          refresh_interval_seconds: 1800,
        },
        {
          id: "src_imd",
          name: "India Meteorological Department (IMD)",
          provider: "Ministry of Earth Sciences, GoI",
          country: "India",
          source_type: "official_govt",
          coverage: "Pan-India",
          is_official: true,
          status: "ACTIVE",
          refresh_interval_seconds: 900,
        },
      ];
    }
  }
}

export const providerRegistry = new GeoShieldProviderRegistry();
