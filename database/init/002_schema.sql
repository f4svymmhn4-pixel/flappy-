-- =========================================================
-- Schema: users, bikes, preferences, routes, favorites, stats
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    display_name    VARCHAR(120),
    default_address VARCHAR(255) DEFAULT '29 Avenue François Mitterrand, 33700 Mérignac, France',
    default_lat     DOUBLE PRECISION DEFAULT 44.8378,
    default_lon     DOUBLE PRECISION DEFAULT -0.6506,
    theme           VARCHAR(10) DEFAULT 'system', -- 'light' | 'dark' | 'system'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bikes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(120) NOT NULL,
    type        VARCHAR(20) NOT NULL CHECK (type IN ('road', 'gravel', 'mtb', 'electric', 'city')),
    is_default  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Onboarding / ride generation preferences (one active profile per user, versionable)
CREATE TABLE IF NOT EXISTS preferences (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bike_id             UUID REFERENCES bikes(id) ON DELETE SET NULL,
    distance_km         NUMERIC(6,2) NOT NULL DEFAULT 40,
    duration_minutes    INTEGER,
    difficulty          VARCHAR(20) NOT NULL DEFAULT 'medium'
                            CHECK (difficulty IN ('very_easy','easy','medium','sporty','very_sporty')),
    elevation_profile   VARCHAR(20) NOT NULL DEFAULT 'rolling'
                            CHECK (elevation_profile IN ('very_flat','flat','some_hills','rolling','mountain','custom')),
    elevation_custom_m  INTEGER,
    priority            VARCHAR(30) NOT NULL DEFAULT 'scenery'
                            CHECK (priority IN ('tourism','performance','scenery','quiet_roads','max_bike_lanes','climbing','descent','training','leisure')),
    avoid_gravel        BOOLEAN NOT NULL DEFAULT false,
    avoid_dirt          BOOLEAN NOT NULL DEFAULT false,
    avoid_forest        BOOLEAN NOT NULL DEFAULT false,
    avoid_city_center   BOOLEAN NOT NULL DEFAULT true,
    avoid_traffic       BOOLEAN NOT NULL DEFAULT true,
    avoid_trunk_roads   BOOLEAN NOT NULL DEFAULT true,
    avoid_no_bike_lane  BOOLEAN NOT NULL DEFAULT false,
    avoid_industrial    BOOLEAN NOT NULL DEFAULT true,
    avoid_roadworks     BOOLEAN NOT NULL DEFAULT true,
    follow_bike_lanes   BOOLEAN NOT NULL DEFAULT true,
    prefer_small_roads  BOOLEAN NOT NULL DEFAULT true,
    avoid_traffic_lights BOOLEAN NOT NULL DEFAULT false,
    avoid_stop_signs    BOOLEAN NOT NULL DEFAULT false,
    prefer_riverside    BOOLEAN NOT NULL DEFAULT false,
    prefer_vineyards    BOOLEAN NOT NULL DEFAULT false,
    prefer_viewpoints   BOOLEAN NOT NULL DEFAULT true,
    prefer_lakes        BOOLEAN NOT NULL DEFAULT false,
    prefer_ocean        BOOLEAN NOT NULL DEFAULT false,
    is_loop             BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated / saved routes. `geom` stores the actual LineString in WGS84.
CREATE TABLE IF NOT EXISTS routes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bike_id             UUID REFERENCES bikes(id) ON DELETE SET NULL,
    preferences_id      UUID REFERENCES preferences(id) ON DELETE SET NULL,
    name                VARCHAR(160) NOT NULL,
    geom                geometry(LineString, 4326) NOT NULL,
    geojson             JSONB NOT NULL, -- full route feature (with per-segment extras) as returned to the client
    distance_m          INTEGER NOT NULL,
    duration_s           INTEGER NOT NULL,
    ascent_m            INTEGER NOT NULL DEFAULT 0,
    descent_m           INTEGER NOT NULL DEFAULT 0,
    avg_speed_kmh       NUMERIC(5,2),
    pct_flat            NUMERIC(5,2),
    pct_climb           NUMERIC(5,2),
    pct_descent         NUMERIC(5,2),
    pct_bike_lane       NUMERIC(5,2),
    pct_secondary       NUMERIC(5,2),
    pct_departmental    NUMERIC(5,2),
    score_total         NUMERIC(5,2),
    score_breakdown     JSONB, -- { beauty, safety, flow, tourism, surface, funFactor, variety } + explanations
    star_rating         NUMERIC(2,1),
    star_explanation    TEXT,
    pois                JSONB, -- list of highlighted points of interest along the route
    provider            VARCHAR(20) NOT NULL DEFAULT 'openrouteservice',
    is_favorite         BOOLEAN NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routes_geom ON routes USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_routes_user ON routes (user_id);
CREATE INDEX IF NOT EXISTS idx_routes_favorite ON routes (user_id, is_favorite);

-- Aggregated rider statistics (updated whenever a route is completed/saved)
CREATE TABLE IF NOT EXISTS route_stats (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_routes    INTEGER NOT NULL DEFAULT 0,
    total_distance_m BIGINT NOT NULL DEFAULT 0,
    total_ascent_m  BIGINT NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);
