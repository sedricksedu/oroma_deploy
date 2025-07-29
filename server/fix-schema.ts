import { db } from './db';

// Fix database schema by adding missing columns
async function fixSchema() {
  try {
    // Add priority column to song_requests if it doesn't exist
    await db.run("ALTER TABLE song_requests ADD COLUMN priority INTEGER DEFAULT 0").catch(() => {
      console.log("Priority column already exists or table doesn't exist");
    });

    // Add user profile columns if they don't exist
    await db.run("ALTER TABLE users ADD COLUMN email TEXT").catch(() => {
      console.log("Email column already exists");
    });
    
    await db.run("ALTER TABLE users ADD COLUMN full_name TEXT").catch(() => {
      console.log("Full name column already exists");
    });
    
    await db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'").catch(() => {
      console.log("Role column already exists");
    });
    
    await db.run("ALTER TABLE users ADD COLUMN profile_image TEXT").catch(() => {
      console.log("Profile image column already exists");
    });
    
    await db.run("ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP").catch(() => {
      console.log("Created at column already exists");
    });
    
    await db.run("ALTER TABLE users ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP").catch(() => {
      console.log("Updated at column already exists");
    });

    // Create site_settings table
    await db.run(`CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      description TEXT,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create analytics table
    await db.run(`CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      event_data TEXT,
      user_id TEXT,
      session_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log("Schema fix completed successfully");
  } catch (error) {
    console.error("Error fixing schema:", error);
  }
}

fixSchema();