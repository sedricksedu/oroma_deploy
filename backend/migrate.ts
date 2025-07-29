import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = new Database('./database.sqlite');

// Read and execute the migration SQL
const migrationSql = fs.readFileSync(path.join(__dirname, '../migrations/0000_initial.sql'), 'utf8');

// Split by statement breakpoints and execute each statement
const statements = migrationSql.split('--> statement-breakpoint').filter(s => s.trim());

for (const statement of statements) {
  const cleanStatement = statement.trim();
  if (cleanStatement) {
    try {
      sqlite.exec(cleanStatement);
    } catch (error) {
      console.error('Error executing statement:', cleanStatement);
      console.error(error);
    }
  }
}

console.log('Migrations applied successfully');