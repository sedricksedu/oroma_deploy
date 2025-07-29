import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const sqlite = new Database('./database.sqlite');

// Create all required tables
sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  profile_image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  schedule TEXT NOT NULL,
  image_url TEXT,
  is_live INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  featured INTEGER DEFAULT 0,
  published_at TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  comments_enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  category TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  news_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS live_reactions (
  id TEXT PRIMARY KEY,
  stream_type TEXT NOT NULL,
  user_session TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS live_comments (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  username TEXT NOT NULL,
  stream_type TEXT NOT NULL,
  user_session TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS song_requests (
  id TEXT PRIMARY KEY,
  song_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  stream_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS active_users (
  id TEXT PRIMARY KEY,
  user_session TEXT NOT NULL,
  stream_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  is_watching INTEGER DEFAULT 1,
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create a simple admin user (password: admin123)
const adminId = nanoid();
// Use plain text for simplicity in demo
const hashedPassword = 'admin123';

sqlite.prepare(`
  INSERT OR IGNORE INTO users (id, username, password) 
  VALUES (?, ?, ?)
`).run(adminId, 'admin', hashedPassword);

console.log('Database setup complete');
console.log('Admin username: admin');
console.log('Admin password: admin123');

sqlite.close();