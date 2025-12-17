-- Drop tables if exist
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS clan_members CASCADE;
DROP TABLE IF EXISTS clans CASCADE;
DROP TABLE IF EXISTS daily_stats CASCADE;
DROP TABLE IF EXISTS saved_decks CASCADE;
DROP TABLE IF EXISTS ai_analyses CASCADE;
DROP TABLE IF EXISTS battles CASCADE;
DROP TABLE IF EXISTS player_cards_history CASCADE;
DROP TABLE IF EXISTS player_snapshots CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    player_tag VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP
);

-- Player snapshots (historial de stats)
CREATE TABLE player_snapshots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,  -- AHORA PUEDE SER NULL
    player_tag VARCHAR(20) NOT NULL,
    player_name VARCHAR(100),
    trophies INTEGER DEFAULT 0,
    best_trophies INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    three_crown_wins INTEGER DEFAULT 0,
    exp_level INTEGER DEFAULT 1,
    total_donations INTEGER DEFAULT 0,
    arena_id INTEGER,
    arena_name VARCHAR(100),
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resto de tablas...
CREATE TABLE player_cards_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    card_name VARCHAR(100) NOT NULL,
    card_level INTEGER NOT NULL,
    card_count INTEGER DEFAULT 0,
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE battles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    battle_time TIMESTAMP NOT NULL,
    battle_type VARCHAR(50),
    game_mode VARCHAR(50),
    deck_used TEXT,
    result VARCHAR(20),
    trophies_change INTEGER DEFAULT 0,
    opponent_tag VARCHAR(20),
    opponent_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ai_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    analysis_type VARCHAR(50),
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE saved_decks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    deck_name VARCHAR(100),
    cards TEXT NOT NULL,
    notes TEXT,
    win_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE daily_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    stat_date DATE NOT NULL,
    trophies_start INTEGER,
    trophies_end INTEGER,
    battles_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    donations INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE clans (
    id SERIAL PRIMARY KEY,
    clan_tag VARCHAR(20) UNIQUE NOT NULL,
    clan_name VARCHAR(100),
    members_count INTEGER,
    required_trophies INTEGER,
    clan_score INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clan_members (
    id SERIAL PRIMARY KEY,
    clan_id INTEGER NOT NULL,
    player_tag VARCHAR(20) NOT NULL,
    player_name VARCHAR(100),
    role VARCHAR(50),
    donations INTEGER DEFAULT 0,
    FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE CASCADE
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    notification_type VARCHAR(50),
    title VARCHAR(200),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'es',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_player_snapshots_user_id ON player_snapshots(user_id);
CREATE INDEX idx_player_snapshots_player_tag ON player_snapshots(player_tag);
CREATE INDEX idx_player_snapshots_date ON player_snapshots(snapshot_date DESC);
CREATE INDEX idx_battles_user_id ON battles(user_id);
CREATE INDEX idx_battles_time ON battles(battle_time DESC);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
