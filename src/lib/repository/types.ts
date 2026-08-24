export type HeritageSiteType =
  | "MONASTERY"
  | "STUPA"
  | "TEMPLE"
  | "FORT"
  | "CAVE"
  | "ARCHAEOLOGICAL_SITE"
  | "MUSEUM"
  | "HERITAGE_CITY"
  | "NATURAL_SITE"
  | "CULTURAL_SITE";

export type ContentStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";

export type SiteRelationType =
  | "NEARBY"
  | "HISTORICALLY_RELATED"
  | "SAME_CIRCUIT"
  | "SAME_REGION"
  | "SAME_TRADITION";

export type SiteUpdateType =
  | "OPERATIONAL_STATUS"
  | "SPECIAL_NOTICE"
  | "RITUAL_ALERT"
  | "CONSERVATION_NOTICE";

export type SiteOperationalStatus = "OPEN" | "RESTRICTED" | "TEMPORARILY_CLOSED";

export type SourceType =
  | "OFFICIAL_GOVERNMENT"
  | "UNESCO"
  | "ASI"
  | "ACADEMIC_GAZETTEER"
  | "COMMUNITY_STEWARD";

export type CuratorRole = "ADMIN" | "CURATOR" | "EDITOR" | "VIEWER";

export interface HeritageSite {
  id: string;
  slug: string;
  name: { en: string; hi?: string };
  tagline: string;
  siteType: HeritageSiteType;
  contentStatus: ContentStatus;
  state: string;
  district: string;
  region: string;
  location: { lat: number; lng: number };
  altitude: string;
  address?: string;
  sect: string;
  founded: string;
  period?: string;
  steward: string;
  asiCode?: string;
  virtualTourEnabled: boolean;
  heroImage: string;
  description: { en: string; hi?: string };
  history?: string;
  culture?: string;
  architecture?: string;
  visitingHours: {
    open: string;
    close: string;
    bestTime?: string;
    entryFee?: { indian: string; foreign: string };
    days?: Record<string, string>;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    steward: string;
    emergency: { localHealthPost: string; policeStation: string; tourismHelpline: string };
  };
  sacredAccessProtocol: {
    photographyAllowed: "permitted" | "courtyard-only" | "prohibited";
    interiorAccess: "open" | "guided-only" | "restricted";
    specialNotice?: string;
    currentStatus: "open" | "restricted" | "closed";
    dressCode?: string;
    etiquetteRules?: string[];
  };
  nearbyServices: Array<{
    type: "hotel" | "homestay" | "guide" | "restaurant" | "transport" | "craft";
    name: string;
    distance: string;
    approved: boolean;
    contact?: string;
  }>;
  categories?: SiteCategory[];
  sources?: SourceItem[];
  updates?: SiteUpdate[];
  relations?: SiteRelation[];
  oralHistories?: OralStory[];
  media?: SiteMediaItem[];
}

export interface SiteCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SiteRelation {
  id: number;
  siteId: string;
  relatedSiteId: string;
  relatedSiteName?: string;
  relatedSiteSlug?: string;
  relatedSiteImage?: string;
  relationType: SiteRelationType;
  description?: string;
  distanceKm?: number;
}

export interface SiteUpdate {
  id: string;
  siteId: string;
  siteName?: string;
  updateType: SiteUpdateType;
  operationalStatus: SiteOperationalStatus;
  title: string;
  message: string;
  startsAt: string;
  endsAt?: string;
  isActive: boolean;
  contentStatus: ContentStatus;
  createdBy: string;
  createdAt: string;
}

export interface SourceItem {
  id: string;
  siteId: string;
  sourceType: SourceType;
  title: string;
  publisher: string;
  url?: string;
  citation?: string;
  verified: boolean;
  accessedAt?: string;
}

export interface OralStory {
  id: string;
  siteId: string;
  siteName?: string;
  title: string;
  narrator: string;
  source?: string;
  language: string;
  era?: string;
  excerpt: string;
  fullText: string;
  audioUrl?: string;
  contentStatus?: ContentStatus;
  approvedBy?: string;
  approvedDate?: string;
}

export interface SiteMediaItem {
  id: string;
  siteId: string;
  siteName?: string;
  title: string;
  mediaType: "photo" | "video" | "panorama";
  url: string;
  author?: string;
  consent?: string;
  fileSizeBytes: number;
  contentStatus?: ContentStatus;
  approvedDate?: string;
}

export interface CircuitStop {
  siteId: string;
  siteName?: string;
  stopOrder: number;
  distanceFromPrev?: string;
  travelTimeFromPrev?: string;
  recommendedDuration?: string;
  highlight?: string;
  location?: { lat: number; lng: number };
  heroImage?: string;
}

export interface CircuitItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  region: string;
  duration: string;
  distance: string;
  bestSeason: string;
  difficulty: string;
  description: string;
  stops: CircuitStop[];
}

export interface ArchiveItem {
  id: string;
  siteId?: string;
  siteName?: string;
  title: string;
  era: string;
  medium: string;
  provenance: string;
  thumbnail: string;
  fullImage: string;
  content: {
    description?: string;
    transcription?: string;
    translation?: string;
    dimensions?: string;
    language?: string;
  };
  licensing: {
    status?: string;
    rights?: string;
    custodian?: string;
  };
  fileSizeBytes: number;
}

export interface CuratorUser {
  id: string;
  username: string;
  fullName: string;
  role: CuratorRole;
  agency?: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  notes?: string;
  status: string;
  payload?: any;
  timestamp: string;
}
