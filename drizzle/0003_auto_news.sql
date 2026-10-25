CREATE TABLE IF NOT EXISTS news_jobs (
 id TEXT PRIMARY KEY, seed TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'queued',
 reason TEXT NOT NULL DEFAULT '', article_id TEXT, event_key TEXT UNIQUE,
 sources TEXT NOT NULL DEFAULT '[]', paragraphs TEXT NOT NULL DEFAULT '[]',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS news_jobs_status ON news_jobs(status,created_at);
CREATE TABLE IF NOT EXISTS news_daily_usage (day TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0);
