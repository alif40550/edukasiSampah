import mysql from 'mysql2/promise';

let pool = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'edukasi_sampah',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000
    });
  }
  return pool;
}

// In-memory fallback if MySQL is offline or not configured yet
let memoryVisits = [
  {
    id: 1,
    name: 'Pengunjung Kampoeng Radja',
    email: 'wisatawan@kampoengradja.com',
    institution: 'Wisatawan Umum Jambi',
    avatar_url: '',
    auth_provider: 'google',
    visit_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString()
  }
];

export async function initDb() {
  try {
    const p = getDbPool();
    // Create database if not exists
    const tempConn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    const dbName = process.env.MYSQL_DATABASE || 'edukasi_sampah';
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    // Create table
    await p.query(`
      CREATE TABLE IF NOT EXISTS \`visits\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`institution\` VARCHAR(255) NULL,
        \`avatar_url\` TEXT NULL,
        \`auth_provider\` VARCHAR(50) DEFAULT 'manual',
        \`visit_date\` DATE NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY \`uq_email_date\` (\`email\`, \`visit_date\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    return { success: true, mode: 'mysql' };
  } catch (err) {
    console.warn('[DB] MySQL init fallback to in-memory mode:', err.message);
    return { success: false, mode: 'memory', error: err.message };
  }
}

export async function recordVisit({ name, email, institution, avatar_url, auth_provider }) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const p = getDbPool();
    // Try insert or ignore if already recorded today
    const [result] = await p.query(
      `INSERT INTO \`visits\` (\`name\`, \`email\`, \`institution\`, \`avatar_url\`, \`auth_provider\`, \`visit_date\`)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`institution\` = VALUES(\`institution\`)`,
      [name, email, institution || '', avatar_url || '', auth_provider || 'manual', today]
    );
    return { success: true, id: result.insertId, mode: 'mysql' };
  } catch (err) {
    console.warn('[DB] MySQL record error, falling back to memory store:', err.message);
    const existingIndex = memoryVisits.findIndex(v => v.email === email && v.visit_date === today);
    if (existingIndex >= 0) {
      memoryVisits[existingIndex] = { ...memoryVisits[existingIndex], name, institution, avatar_url };
    } else {
      memoryVisits.unshift({
        id: memoryVisits.length + 1,
        name,
        email,
        institution: institution || 'Umum',
        avatar_url: avatar_url || '',
        auth_provider: auth_provider || 'manual',
        visit_date: today,
        created_at: new Date().toISOString()
      });
    }
    return { success: true, mode: 'memory' };
  }
}

export async function getVisits() {
  try {
    const p = getDbPool();
    const [rows] = await p.query(`
      SELECT 
        id, 
        name, 
        email, 
        institution, 
        avatar_url, 
        auth_provider, 
        DATE_FORMAT(visit_date, '%Y-%m-%d') AS visit_date, 
        created_at 
      FROM \`visits\` 
      ORDER BY \`created_at\` DESC 
      LIMIT 500
    `);
    return { visits: rows, mode: 'mysql' };
  } catch (err) {
    console.warn('[DB] MySQL query fallback to memory:', err.message);
    return { visits: memoryVisits, mode: 'memory' };
  }
}

