import { query } from "@/lib/db";
import {
  HeritageSite,
  HeritageSiteType,
  SiteCategory,
  SiteRelation,
  SiteUpdate,
  SourceItem,
  OralStory,
  SiteMediaItem,
  CuratorUser,
} from "./types";
import fallbackMonasteries from "@/data/monasteries.json";

function mapDbRowToHeritageSite(row: any): HeritageSite {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: {
      en: row.name_en,
      hi: row.name_hi || undefined,
    },
    tagline: row.tagline || "",
    siteType: (row.site_type as HeritageSiteType) || "MONASTERY",
    contentStatus: row.content_status || "PUBLISHED",
    state: row.state,
    district: row.district,
    region: row.region,
    location: {
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
    },
    altitude: row.altitude || "500m",
    address: row.address || "",
    sect: row.sect_or_tradition || "Ancient Heritage",
    founded: row.founded_year || "Historical Antiquity",
    period: row.period || "",
    steward: row.steward || "Archaeological Survey of India & Local Trust",
    asiCode: row.asi_code || "",
    virtualTourEnabled: row.virtual_tour_enabled !== false,
    heroImage: row.hero_image,
    description: {
      en: row.description_en,
      hi: row.description_hi || undefined,
    },
    history: row.history_en || undefined,
    culture: row.culture_en || undefined,
    architecture: row.architecture_en || undefined,
    visitingHours: typeof row.visiting_hours === "string" ? JSON.parse(row.visiting_hours) : row.visiting_hours || { open: "06:00", close: "18:00" },
    contact: typeof row.contact === "string" ? JSON.parse(row.contact) : row.contact || {},
    sacredAccessProtocol: typeof row.sacred_access_protocol === "string" ? JSON.parse(row.sacred_access_protocol) : row.sacred_access_protocol || { photographyAllowed: "permitted", interiorAccess: "open", currentStatus: "open" },
    nearbyServices: typeof row.nearby_services === "string" ? JSON.parse(row.nearby_services) : row.nearby_services || [],
  };
}

export async function getAllHeritageSites(filters?: {
  type?: string;
  state?: string;
  region?: string;
  search?: string;
  category?: string;
}): Promise<HeritageSite[]> {
  try {
    let sql = `
      SELECT hs.*, 
             COALESCE(json_agg(DISTINCT sc.*) FILTER (WHERE sc.id IS NOT NULL), '[]') as categories
      FROM heritage_sites hs
      LEFT JOIN heritage_site_categories hsc ON hs.id = hsc.site_id
      LEFT JOIN site_categories sc ON hsc.category_id = sc.id
      WHERE hs.content_status = 'PUBLISHED'
    `;
    const params: any[] = [];

    if (filters?.type && filters.type !== "all") {
      params.push(filters.type.toUpperCase());
      sql += ` AND hs.site_type = $${params.length}`;
    }

    if (filters?.state && filters.state !== "all") {
      params.push(filters.state);
      sql += ` AND hs.state ILIKE $${params.length}`;
    }

    if (filters?.region && filters.region !== "all") {
      params.push(filters.region);
      sql += ` AND hs.region ILIKE $${params.length}`;
    }

    if (filters?.search && filters.search.trim()) {
      params.push(`%${filters.search.trim()}%`);
      sql += ` AND (hs.name_en ILIKE $${params.length} OR hs.name_hi ILIKE $${params.length} OR hs.district ILIKE $${params.length} OR hs.description_en ILIKE $${params.length})`;
    }

    if (filters?.category && filters.category !== "all") {
      params.push(filters.category);
      sql += ` AND sc.slug = $${params.length}`;
    }

    sql += ` GROUP BY hs.id ORDER BY hs.name_en ASC`;

    const res = await query(sql, params);
    if (res && res.rows && res.rows.length > 0) {
      return res.rows.map((row) => {
        const site = mapDbRowToHeritageSite(row);
        site.categories = typeof row.categories === "string" ? JSON.parse(row.categories) : row.categories || [];
        return site;
      });
    }
  } catch (err) {
    console.warn("[heritageRepository] Database query failed or unavailable, using fallback data:", err);
  }

  // Graceful fallback to static JSON dataset
  return (fallbackMonasteries as any[]).map((m) => ({
    id: m.id,
    slug: m.id,
    name: m.name,
    tagline: m.tagline || `${m.name.en} Heritage Site`,
    siteType: m.id.includes("fort") ? "FORT" : m.id.includes("temple") ? "TEMPLE" : m.id.includes("stupa") ? "STUPA" : m.id.includes("cave") ? "CAVE" : "MONASTERY",
    contentStatus: "PUBLISHED",
    state: m.state || "India",
    district: m.district || "District",
    region: m.region || "Northern Frontiers",
    location: m.location || { lat: 28.6139, lng: 77.209 },
    altitude: m.altitude || "500m",
    address: m.contact?.address || `${m.name.en}, ${m.district || ""}, ${m.state || ""}`,
    sect: m.sect || "Ancient Tradition",
    founded: m.founded || "Historical Antiquity",
    steward: m.contact?.steward || "Archaeological Survey of India & Local Trust",
    asiCode: m.asiCode || `ASI-${m.id}`,
    virtualTourEnabled: m.virtualTourEnabled !== false,
    heroImage: m.heroImage || "/images/monasteries/rumtek.png",
    description: m.description,
    visitingHours: m.visitingHours || { open: "06:00", close: "18:00" },
    contact: m.contact || {},
    sacredAccessProtocol: m.sacredAccessProtocol || { photographyAllowed: "permitted", interiorAccess: "open", currentStatus: "open" },
    nearbyServices: m.nearbyServices || [],
    oralHistories: m.oralHistories || [],
  })) as HeritageSite[];
}

export async function getHeritageSiteBySlug(slugOrId: string): Promise<HeritageSite | null> {
  try {
    const siteRes = await query(
      `SELECT * FROM heritage_sites WHERE slug = $1 OR id = $1 LIMIT 1`,
      [slugOrId]
    );

    if (siteRes && siteRes.rows.length > 0) {
      const siteRow = siteRes.rows[0];
      const site = mapDbRowToHeritageSite(siteRow);

      // 1. Fetch categories
      const catRes = await query(
        `SELECT sc.* FROM site_categories sc
         JOIN heritage_site_categories hsc ON sc.id = hsc.category_id
         WHERE hsc.site_id = $1`,
        [site.id]
      );
      site.categories = catRes?.rows || [];

      // 2. Fetch active temporal site updates
      const updRes = await query(
        `SELECT * FROM site_updates WHERE site_id = $1 AND is_active = true ORDER BY created_at DESC`,
        [site.id]
      );
      site.updates = updRes?.rows.map((u) => ({
        id: u.id,
        siteId: u.site_id,
        updateType: u.update_type,
        operationalStatus: u.operational_status,
        title: u.title,
        message: u.message,
        startsAt: u.starts_at,
        endsAt: u.ends_at,
        isActive: u.is_active,
        contentStatus: u.content_status,
        createdBy: u.created_by,
        createdAt: u.created_at,
      })) || [];

      // Apply the latest active operational status update to the site profile if available
      if (site.updates.length > 0) {
        const latestUpdate = site.updates[0];
        site.sacredAccessProtocol.currentStatus =
          latestUpdate.operationalStatus === "TEMPORARILY_CLOSED"
            ? "closed"
            : latestUpdate.operationalStatus === "RESTRICTED"
            ? "restricted"
            : "open";
        if (latestUpdate.message) {
          site.sacredAccessProtocol.specialNotice = latestUpdate.message;
        }
      }

      // 3. Fetch sources / provenance
      const srcRes = await query(
        `SELECT * FROM sources WHERE site_id = $1 ORDER BY verified DESC, title ASC`,
        [site.id]
      );
      site.sources = srcRes?.rows.map((s) => ({
        id: s.id,
        siteId: s.site_id,
        sourceType: s.source_type,
        title: s.title,
        publisher: s.publisher,
        url: s.url,
        citation: s.citation,
        verified: s.verified,
        accessedAt: s.accessed_at,
      })) || [];

      // 4. Fetch oral stories
      const storyRes = await query(
        `SELECT * FROM oral_stories WHERE site_id = $1 AND content_status = 'PUBLISHED' ORDER BY created_at DESC`,
        [site.id]
      );
      site.oralHistories = storyRes?.rows.map((st) => ({
        id: st.id,
        siteId: st.site_id,
        title: st.title,
        narrator: st.narrator,
        source: st.source,
        language: st.language,
        era: st.era,
        excerpt: st.excerpt,
        fullText: st.full_text,
        audioUrl: st.audio_url,
        contentStatus: st.content_status,
        approvedBy: st.approved_by,
        approvedDate: st.approved_date,
      })) || [];

      // 5. Fetch site media
      const mediaRes = await query(
        `SELECT * FROM site_media WHERE site_id = $1 AND content_status = 'PUBLISHED' ORDER BY created_at DESC`,
        [site.id]
      );
      site.media = mediaRes?.rows.map((m) => ({
        id: m.id,
        siteId: m.site_id,
        title: m.title,
        mediaType: m.media_type,
        url: m.url,
        author: m.author,
        consent: m.consent,
        fileSizeBytes: parseInt(m.file_size_bytes, 10) || 0,
        contentStatus: m.content_status,
        approvedDate: m.approved_date,
      })) || [];

      // 6. Fetch site relations
      const relRes = await query(
        `SELECT sr.*, hs.name_en as related_name, hs.slug as related_slug, hs.hero_image as related_image
         FROM site_relations sr
         JOIN heritage_sites hs ON sr.related_site_id = hs.id
         WHERE sr.site_id = $1`,
        [site.id]
      );
      site.relations = relRes?.rows.map((r) => ({
        id: r.id,
        siteId: r.site_id,
        relatedSiteId: r.related_site_id,
        relatedSiteName: r.related_name,
        relatedSiteSlug: r.related_slug,
        relatedSiteImage: r.related_image,
        relationType: r.relation_type,
        description: r.description,
        distanceKm: parseFloat(r.distance_km),
      })) || [];

      return site;
    }
  } catch (err) {
    console.warn("[heritageRepository] Error fetching site from database:", err);
  }

  // Fallback
  const fallback = (fallbackMonasteries as any[]).find(
    (m) => m.id === slugOrId || m.slug === slugOrId
  );
  if (!fallback) return null;

  return {
    id: fallback.id,
    slug: fallback.id,
    name: fallback.name,
    tagline: fallback.tagline || `${fallback.name.en} Heritage Site`,
    siteType: fallback.id.includes("fort") ? "FORT" : fallback.id.includes("temple") ? "TEMPLE" : fallback.id.includes("stupa") ? "STUPA" : fallback.id.includes("cave") ? "CAVE" : "MONASTERY",
    contentStatus: "PUBLISHED",
    state: fallback.state || "India",
    district: fallback.district || "District",
    region: fallback.region || "Northern Frontiers",
    location: fallback.location || { lat: 28.6139, lng: 77.209 },
    altitude: fallback.altitude || "500m",
    address: fallback.contact?.address || `${fallback.name.en}, ${fallback.district || ""}, ${fallback.state || ""}`,
    sect: fallback.sect || "Ancient Tradition",
    founded: fallback.founded || "Historical Antiquity",
    steward: fallback.contact?.steward || "Archaeological Survey of India & Local Trust",
    asiCode: fallback.asiCode || `ASI-${fallback.id}`,
    virtualTourEnabled: fallback.virtualTourEnabled !== false,
    heroImage: fallback.heroImage || "/images/monasteries/rumtek.png",
    description: fallback.description,
    visitingHours: fallback.visitingHours || { open: "06:00", close: "18:00" },
    contact: fallback.contact || {},
    sacredAccessProtocol: fallback.sacredAccessProtocol || { photographyAllowed: "permitted", interiorAccess: "open", currentStatus: "open" },
    nearbyServices: fallback.nearbyServices || [],
    oralHistories: fallback.oralHistories || [],
  } as HeritageSite;
}

export async function updateSiteProtocolAndNotice(
  siteId: string,
  data: {
    photographyAllowed: "permitted" | "courtyard-only" | "prohibited";
    interiorAccess: "open" | "guided-only" | "restricted";
    currentStatus: "open" | "restricted" | "closed";
    specialNotice: string;
  },
  curatorUser: CuratorUser
): Promise<boolean> {
  const protocolJson = JSON.stringify({
    photographyAllowed: data.photographyAllowed,
    interiorAccess: data.interiorAccess,
    currentStatus: data.currentStatus,
    specialNotice: data.specialNotice,
  });

  try {
    // 1. Update heritage_sites protocol
    await query(
      `UPDATE heritage_sites 
       SET sacred_access_protocol = $1, updated_at = NOW() 
       WHERE id = $2 OR slug = $2`,
      [protocolJson, siteId]
    );

    // 2. Insert into site_updates temporal alerts
    const opStatus = data.currentStatus === "closed" ? "TEMPORARILY_CLOSED" : data.currentStatus === "restricted" ? "RESTRICTED" : "OPEN";
    const updateId = `upd-${siteId}-${Date.now()}`;
    await query(
      `INSERT INTO site_updates (id, site_id, update_type, operational_status, title, message, starts_at, is_active, created_by)
       VALUES ($1, $2, 'OPERATIONAL_STATUS', $3, $4, $5, NOW(), TRUE, $6)`,
      [
        updateId,
        siteId,
        opStatus,
        `Operational Update: ${data.currentStatus.toUpperCase()}`,
        data.specialNotice || `Operational status updated to ${data.currentStatus}. Photography: ${data.photographyAllowed}.`,
        curatorUser.fullName || curatorUser.username,
      ]
    );

    // 3. Record Audit Log
    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes, status, payload)
       VALUES ($1, $2, $3, 'UPDATE_ACCESS_PROTOCOL', 'HERITAGE_SITE', $4, $5, 'approved', $6)`,
      [
        `audit-${Date.now()}`,
        curatorUser.id,
        curatorUser.fullName || curatorUser.username,
        siteId,
        `Updated access protocol and operational status to ${data.currentStatus}`,
        protocolJson,
      ]
    );

    return true;
  } catch (err) {
    console.error("[heritageRepository] Error updating site protocol:", err);
    return false;
  }
}

export async function createOralStory(
  story: Omit<OralStory, "id"> & { id?: string },
  curatorUser: CuratorUser
): Promise<OralStory | null> {
  const storyId = story.id || `oh-${story.siteId}-${Date.now()}`;
  try {
    await query(
      `INSERT INTO oral_stories (
        id, site_id, title, narrator, source, language, era, excerpt, full_text, audio_url, content_status, approved_by, approved_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        narrator = EXCLUDED.narrator,
        excerpt = EXCLUDED.excerpt,
        full_text = EXCLUDED.full_text,
        content_status = EXCLUDED.content_status`,
      [
        storyId,
        story.siteId,
        story.title,
        story.narrator,
        story.source || "Curator Submission",
        story.language || "English",
        story.era || "Living Tradition",
        story.excerpt || story.fullText.substring(0, 100) + "...",
        story.fullText,
        story.audioUrl || null,
        story.contentStatus || "PUBLISHED",
        curatorUser.fullName,
        new Date().toISOString().split("T")[0],
      ]
    );

    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, 'CREATE_ORAL_STORY', 'ORAL_STORY', $4, $5)`,
      [
        `audit-${Date.now()}`,
        curatorUser.id,
        curatorUser.fullName,
        storyId,
        `Created oral story: ${story.title}`,
      ]
    );

    return { ...story, id: storyId };
  } catch (err) {
    console.error("[heritageRepository] Error creating oral story:", err);
    return null;
  }
}

export async function deleteOralStory(storyId: string, curatorUser: CuratorUser): Promise<boolean> {
  try {
    await query(`DELETE FROM oral_stories WHERE id = $1`, [storyId]);
    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, 'DELETE_ORAL_STORY', 'ORAL_STORY', $4, 'Deleted oral history narrative')`,
      [`audit-${Date.now()}`, curatorUser.id, curatorUser.fullName, storyId]
    );
    return true;
  } catch (err) {
    console.error("[heritageRepository] Error deleting oral story:", err);
    return false;
  }
}

export async function createSiteMedia(
  media: Omit<SiteMediaItem, "id"> & { id?: string },
  curatorUser: CuratorUser
): Promise<SiteMediaItem | null> {
  const mediaId = media.id || `med-${media.siteId}-${Date.now()}`;
  try {
    await query(
      `INSERT INTO site_media (
        id, site_id, title, media_type, url, author, consent, file_size_bytes, content_status, approved_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        url = EXCLUDED.url,
        file_size_bytes = EXCLUDED.file_size_bytes`,
      [
        mediaId,
        media.siteId,
        media.title,
        media.mediaType,
        media.url,
        media.author || curatorUser.fullName,
        media.consent || "monastery-approved",
        media.fileSizeBytes || 1048576,
        media.contentStatus || "PUBLISHED",
        new Date().toISOString().split("T")[0],
      ]
    );

    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, 'UPLOAD_SITE_MEDIA', 'SITE_MEDIA', $4, $5)`,
      [
        `audit-${Date.now()}`,
        curatorUser.id,
        curatorUser.fullName,
        mediaId,
        `Uploaded ${media.mediaType}: ${media.title}`,
      ]
    );

    return { ...media, id: mediaId };
  } catch (err) {
    console.error("[heritageRepository] Error uploading site media:", err);
    return null;
  }
}

export async function deleteSiteMedia(mediaId: string, curatorUser: CuratorUser): Promise<boolean> {
  try {
    await query(`DELETE FROM site_media WHERE id = $1`, [mediaId]);
    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, 'DELETE_SITE_MEDIA', 'SITE_MEDIA', $4, 'Deleted site media item')`,
      [`audit-${Date.now()}`, curatorUser.id, curatorUser.fullName, mediaId]
    );
    return true;
  } catch (err) {
    console.error("[heritageRepository] Error deleting site media:", err);
    return false;
  }
}

export async function getAllOralStories(siteId?: string): Promise<OralStory[]> {
  try {
    let sql = `
      SELECT os.*, hs.name_en as site_name 
      FROM oral_stories os
      JOIN heritage_sites hs ON os.site_id = hs.id
    `;
    const params: any[] = [];
    if (siteId && siteId !== "all") {
      params.push(siteId);
      sql += ` WHERE os.site_id = $1`;
    }
    sql += ` ORDER BY os.created_at DESC`;

    const res = await query(sql, params);
    if (res && res.rows) {
      return res.rows.map((row) => ({
        id: row.id,
        siteId: row.site_id,
        siteName: row.site_name,
        title: row.title,
        narrator: row.narrator,
        source: row.source,
        language: row.language,
        era: row.era,
        excerpt: row.excerpt,
        fullText: row.full_text,
        audioUrl: row.audio_url,
        contentStatus: row.content_status,
        approvedBy: row.approved_by,
        approvedDate: row.approved_date,
      }));
    }
  } catch (err) {
    console.warn("[heritageRepository] DB query failed for oral stories, using fallback:", err);
  }

  // Fallback from monasteries.json
  const stories: OralStory[] = [];
  (fallbackMonasteries as any[]).forEach((m) => {
    if (m.oralHistories) {
      m.oralHistories.forEach((s: any) => {
        if (!siteId || siteId === "all" || siteId === m.id) {
          stories.push({
            id: s.id || `oh-${m.id}-${stories.length}`,
            siteId: m.id,
            siteName: m.name.en,
            title: s.title || "Oral History",
            narrator: s.narrator || "Elder Custodian",
            source: s.source || "Living Tradition",
            language: s.language || "English",
            era: s.era || "Historical Epoch",
            excerpt: s.excerpt || s.fullText?.substring(0, 100) + "..." || "",
            fullText: s.fullText || s.excerpt || "",
            approvedBy: s.approvedBy || "Curator Board",
            approvedDate: s.approvedDate || "2024-05-15",
          });
        }
      });
    }
  });
  return stories;
}

export async function getAllMediaItems(siteId?: string): Promise<SiteMediaItem[]> {
  try {
    let sql = `
      SELECT sm.*, hs.name_en as site_name 
      FROM site_media sm
      JOIN heritage_sites hs ON sm.site_id = hs.id
    `;
    const params: any[] = [];
    if (siteId && siteId !== "all") {
      params.push(siteId);
      sql += ` WHERE sm.site_id = $1`;
    }
    sql += ` ORDER BY sm.created_at DESC`;

    const res = await query(sql, params);
    if (res && res.rows) {
      return res.rows.map((row) => ({
        id: row.id,
        siteId: row.site_id,
        siteName: row.site_name,
        title: row.title,
        mediaType: row.media_type,
        url: row.url,
        author: row.author,
        consent: row.consent,
        fileSizeBytes: parseInt(row.file_size_bytes, 10) || 0,
        contentStatus: row.content_status,
        approvedDate: row.approved_date,
      }));
    }
  } catch (err) {
    console.warn("[heritageRepository] DB query failed for media items, using fallback:", err);
  }

  // Fallback from monasteries.json
  const mediaList: SiteMediaItem[] = [];
  (fallbackMonasteries as any[]).forEach((m) => {
    if (!siteId || siteId === "all" || siteId === m.id) {
      mediaList.push({
        id: `med-${m.id}`,
        siteId: m.id,
        siteName: m.name.en,
        title: `${m.name.en} Official 360° Spherical Panorama`,
        mediaType: "panorama",
        url: `/images/monasteries/${m.id}.png`,
        author: "SYNTAXUS & ASI National Heritage Survey",
        consent: "monastery-approved",
        fileSizeBytes: 1887436,
        approvedDate: "2024-05-15",
      });
    }
  });
  return mediaList;
}

export async function createAuditLog(log: {
  actor: string;
  action: string;
  targetType?: string;
  targetId?: string;
  notes: string;
  status?: string;
}) {
  try {
    const id = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const res = await query(
      `INSERT INTO audit_logs (id, actor, action, target_type, target_id, notes, status, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        id,
        log.actor || "Authorized Curator",
        log.action || "GOVERNANCE_ACTION",
        log.targetType || "HERITAGE_SITE",
        log.targetId || "Site Resource",
        log.notes || "Action recorded",
        log.status || "approved",
      ]
    );
    return res?.rows?.[0] || null;
  } catch (err) {
    console.warn("[heritageRepository] Failed to insert audit log:", err);
    return null;
  }
}

export async function getAuditLogs(): Promise<any[]> {
  try {
    const res = await query(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50`);
    if (res && res.rows && res.rows.length > 0) {
      return res.rows;
    }
  } catch (err) {
    console.warn("[heritageRepository] DB query failed for audit logs, using fallback:", err);
  }

  return [
    {
      id: "a1",
      action: "MEDIA_UPLOAD_APPROVED",
      actor: "ASI Heritage Documentation Wing",
      target_id: "Taj Mahal & Rumtek",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: "approved",
      notes: "Approved 360° Spherical Photogrammetric Panorama & High-Resolution Orthophoto.",
    },
    {
      id: "a2",
      action: "ACCESS_PROTOCOL_UPDATED",
      actor: "Shri Ramtek Devasthan & ASI Nagpur",
      target_id: "Ramtek Gad Mandir",
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      status: "approved",
      notes: "Updated operational visiting hours (06:00–20:00) and permitted photography in outer parikrama.",
    },
    {
      id: "a3",
      action: "ORAL_HISTORY_RECORDED",
      actor: "Dr. B. Satyanarayana (Kakatiya Epigraphist)",
      target_id: "Ramappa Temple (UNESCO)",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      status: "approved",
      notes: "Archived authenticated oral narrative on Kakatiya sandbox & floating-brick architecture.",
    },
    {
      id: "a4",
      action: "SACRED_STATUS_ADVISORY",
      actor: "Archaeological Survey of India (Dharwad Circle)",
      target_id: "Gol Gumbaz & Ibrahim Rauza",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      status: "approved",
      notes: "Published daily advisory for Gol Gumbaz Whispering Gallery acoustic conservation compliance.",
    },
    {
      id: "a5",
      action: "MEDIA_UPLOAD_APPROVED",
      actor: "SYNTAXUS Deccan Field Unit",
      target_id: "Bidar Fort",
      timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      status: "approved",
      notes: "Uploaded 4K high-definition photogrammetry survey of Rangin Mahal mother-of-pearl woodwork.",
    },
    {
      id: "a6",
      action: "LOCAL_SERVICE_VERIFIED",
      actor: "Telangana State Tourism Board",
      target_id: "Warangal Brass & Metalcraft Guild",
      timestamp: new Date(Date.now() - 1000 * 60 * 850).toISOString(),
      status: "approved",
      notes: "Verified and accredited local artisan cooperative for sustainable heritage economy (AICTE PS ID 26202).",
    },
    {
      id: "a7",
      action: "OPEN_DATA_SYNC_COMPLETED",
      actor: "National Virtual Library of India (NVLI) Bot",
      target_id: "58 Protected Monuments",
      timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
      status: "approved",
      notes: "Synchronized 58 ASI protected monument identifiers with Ministry of Culture official gazetteer.",
    },
  ];
}
