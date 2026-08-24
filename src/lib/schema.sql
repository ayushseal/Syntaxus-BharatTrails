-- ==============================================================================
-- SYNTAXUS HERITAGE PLATFORM - POSTGRESQL RELATIONAL & SPATIAL SCHEMA
-- ==============================================================================

-- 1. Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE heritage_site_type AS ENUM (
        'MONASTERY', 'STUPA', 'TEMPLE', 'FORT', 'CAVE', 
        'ARCHAEOLOGICAL_SITE', 'MUSEUM', 'HERITAGE_CITY', 
        'NATURAL_SITE', 'CULTURAL_SITE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM (
        'DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE site_relation_type AS ENUM (
        'NEARBY', 'HISTORICALLY_RELATED', 'SAME_CIRCUIT', 'SAME_REGION', 'SAME_TRADITION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE site_update_type AS ENUM (
        'OPERATIONAL_STATUS', 'SPECIAL_NOTICE', 'RITUAL_ALERT', 'CONSERVATION_NOTICE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE site_operational_status AS ENUM (
        'OPEN', 'RESTRICTED', 'TEMPORARILY_CLOSED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM (
        'OFFICIAL_GOVERNMENT', 'UNESCO', 'ASI', 'ACADEMIC_GAZETTEER', 'COMMUNITY_STEWARD'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE curator_role AS ENUM (
        'ADMIN', 'CURATOR', 'EDITOR', 'VIEWER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Heritage Sites (Core Table)
CREATE TABLE IF NOT EXISTS heritage_sites (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    tagline TEXT,
    site_type heritage_site_type NOT NULL DEFAULT 'MONASTERY',
    content_status content_status NOT NULL DEFAULT 'PUBLISHED',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    altitude VARCHAR(50),
    address TEXT,
    sect_or_tradition VARCHAR(150),
    founded_year VARCHAR(100),
    period VARCHAR(100),
    steward VARCHAR(200),
    asi_code VARCHAR(100),
    virtual_tour_enabled BOOLEAN DEFAULT TRUE,
    hero_image TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT,
    history_en TEXT,
    culture_en TEXT,
    architecture_en TEXT,
    visiting_hours JSONB,
    contact JSONB,
    sacred_access_protocol JSONB,
    nearby_services JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_heritage_sites_slug ON heritage_sites(slug);
CREATE INDEX IF NOT EXISTS idx_heritage_sites_type ON heritage_sites(site_type);
CREATE INDEX IF NOT EXISTS idx_heritage_sites_status ON heritage_sites(content_status);
CREATE INDEX IF NOT EXISTS idx_heritage_sites_state ON heritage_sites(state);
CREATE INDEX IF NOT EXISTS idx_heritage_sites_region ON heritage_sites(region);
CREATE INDEX IF NOT EXISTS idx_heritage_sites_geo ON heritage_sites(latitude, longitude);

-- 3. Categories & Many-to-Many Categorization
CREATE TABLE IF NOT EXISTS site_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS heritage_site_categories (
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    category_id VARCHAR(64) NOT NULL REFERENCES site_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, category_id)
);

-- 4. Site Relations (Graph Relationships)
CREATE TABLE IF NOT EXISTS site_relations (
    id SERIAL PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    related_site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    relation_type site_relation_type NOT NULL,
    description TEXT,
    distance_km DECIMAL(6, 2),
    CONSTRAINT unique_site_relation UNIQUE (site_id, related_site_id, relation_type)
);

-- 5. Temporal Site Updates & Live Operational Alerts
CREATE TABLE IF NOT EXISTS site_updates (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    update_type site_update_type NOT NULL DEFAULT 'OPERATIONAL_STATUS',
    operational_status site_operational_status DEFAULT 'OPEN',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    content_status content_status NOT NULL DEFAULT 'PUBLISHED',
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_updates_site ON site_updates(site_id, is_active);

-- 6. Provenance & Citations (Sources)
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    source_type source_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    url TEXT,
    citation TEXT,
    verified BOOLEAN DEFAULT TRUE,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_site ON sources(site_id);

-- 7. Oral Histories
CREATE TABLE IF NOT EXISTS oral_stories (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    narrator VARCHAR(200) NOT NULL,
    source VARCHAR(150),
    language VARCHAR(50) DEFAULT 'English',
    era VARCHAR(100),
    excerpt TEXT,
    full_text TEXT NOT NULL,
    audio_url TEXT,
    content_status content_status NOT NULL DEFAULT 'PUBLISHED',
    approved_by VARCHAR(100),
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oral_stories_site ON oral_stories(site_id);

-- 8. Media Uploads & 360 Panoramas (file_size_bytes as BIGINT)
CREATE TABLE IF NOT EXISTS site_media (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    author VARCHAR(200),
    consent VARCHAR(100),
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    content_status content_status NOT NULL DEFAULT 'PUBLISHED',
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_media_site ON site_media(site_id);

-- 9. Digital Archives & Rare Manuscripts
CREATE TABLE IF NOT EXISTS archives (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) REFERENCES heritage_sites(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    era VARCHAR(100),
    medium VARCHAR(100),
    provenance TEXT,
    thumbnail TEXT,
    full_image TEXT,
    content JSONB,
    licensing JSONB,
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Circuits & Ordered Circuit Stops
CREATE TABLE IF NOT EXISTS circuits (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    region VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    distance VARCHAR(50),
    best_season VARCHAR(100),
    difficulty VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS circuit_sites (
    id SERIAL PRIMARY KEY,
    circuit_id VARCHAR(64) NOT NULL REFERENCES circuits(id) ON DELETE CASCADE,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    stop_order INT NOT NULL,
    distance_from_prev VARCHAR(50),
    travel_time_from_prev VARCHAR(50),
    recommended_duration VARCHAR(50),
    highlight TEXT
);

CREATE INDEX IF NOT EXISTS idx_circuit_sites ON circuit_sites(circuit_id, stop_order);

-- 11. Curator Users, RBAC & Audit Trail
CREATE TABLE IF NOT EXISTS curator_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role curator_role NOT NULL DEFAULT 'CURATOR',
    agency VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES curator_users(id),
    actor VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'approved',
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archives_site_id ON archives(site_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- 12. Verified Local Services & Hospitality Engine (AICTE PS ID 26202)
CREATE TABLE IF NOT EXISTS nearby_services (
    id VARCHAR(64) PRIMARY KEY,
    site_id VARCHAR(64) NOT NULL REFERENCES heritage_sites(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'hotel', 'homestay', 'guide', 'craft', 'transport'
    name VARCHAR(255) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(50),
    contact_address TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nearby_services_site ON nearby_services(site_id);

-- 13. Supabase Row Level Security (RLS) Hardening
ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_site_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE oral_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE curator_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_services ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow select for authenticated and anonymous readers)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Sites' AND tablename = 'heritage_sites') THEN
        CREATE POLICY "Public Read Sites" ON heritage_sites FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Categories' AND tablename = 'site_categories') THEN
        CREATE POLICY "Public Read Categories" ON site_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Site Categories' AND tablename = 'heritage_site_categories') THEN
        CREATE POLICY "Public Read Site Categories" ON heritage_site_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Relations' AND tablename = 'site_relations') THEN
        CREATE POLICY "Public Read Relations" ON site_relations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Updates' AND tablename = 'site_updates') THEN
        CREATE POLICY "Public Read Updates" ON site_updates FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Sources' AND tablename = 'sources') THEN
        CREATE POLICY "Public Read Sources" ON sources FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Stories' AND tablename = 'oral_stories') THEN
        CREATE POLICY "Public Read Stories" ON oral_stories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Media' AND tablename = 'site_media') THEN
        CREATE POLICY "Public Read Media" ON site_media FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Archives' AND tablename = 'archives') THEN
        CREATE POLICY "Public Read Archives" ON archives FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Circuits' AND tablename = 'circuits') THEN
        CREATE POLICY "Public Read Circuits" ON circuits FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Circuit Sites' AND tablename = 'circuit_sites') THEN
        CREATE POLICY "Public Read Circuit Sites" ON circuit_sites FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Audits' AND tablename = 'audit_logs') THEN
        CREATE POLICY "Public Read Audits" ON audit_logs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Nearby Services' AND tablename = 'nearby_services') THEN
        CREATE POLICY "Public Read Nearby Services" ON nearby_services FOR SELECT USING (true);
    END IF;
END $$;

