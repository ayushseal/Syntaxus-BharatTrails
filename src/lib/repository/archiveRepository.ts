import { query } from "@/lib/db";
import { ArchiveItem } from "./types";
import fallbackArchives from "@/data/archives.json";

export async function getAllArchives(): Promise<ArchiveItem[]> {
  try {
    const res = await query(
      `SELECT a.*, hs.name_en as site_name
       FROM archives a
       LEFT JOIN heritage_sites hs ON a.site_id = hs.id
       ORDER BY a.title ASC`
    );

    if (res && res.rows && res.rows.length > 0) {
      return res.rows.map((row) => ({
        id: row.id,
        siteId: row.site_id || undefined,
        siteName: row.site_name || undefined,
        title: row.title,
        era: row.era || "Historical Era",
        medium: row.medium || "Palm-leaf / Manuscript",
        provenance: row.provenance || "National Repository",
        thumbnail: row.thumbnail || "/images/archives/default.jpg",
        fullImage: row.full_image || row.thumbnail || "/images/archives/default.jpg",
        content: typeof row.content === "string" ? JSON.parse(row.content) : row.content || {},
        licensing: typeof row.licensing === "string" ? JSON.parse(row.licensing) : row.licensing || {},
        fileSizeBytes: parseInt(row.file_size_bytes, 10) || 2097152,
      }));
    }
  } catch (err) {
    console.warn("[archiveRepository] DB query failed for archives, using fallback:", err);
  }

  // Fallback
  return (fallbackArchives as any[]).map((a) => ({
    id: a.id,
    siteId: a.monasteryId || a.siteId,
    title: a.title,
    era: a.era || "Historical Era",
    medium: a.medium || "Palm-leaf / Manuscript",
    provenance: a.provenance || "National Repository",
    thumbnail: a.thumbnail || a.fullImage || "/images/archives/default.jpg",
    fullImage: a.fullImage || a.thumbnail || "/images/archives/default.jpg",
    content: a.content || {},
    licensing: a.licensing || { status: "Public Domain" },
    fileSizeBytes: 2097152,
  }));
}
