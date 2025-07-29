import { db } from './db';
import { users } from './shared/schema';
import { nanoid } from 'nanoid';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('admin123');
    
    await db.insert(users).values({
      id: nanoid(),
      username: 'admin', 
      password: hashedPassword,
      email: 'admin@oromatv.com',
      fullName: 'Administrator',
      role: 'admin',
    });

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    if (error instanceof Error && error.message?.includes('UNIQUE constraint failed')) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

createAdmin();