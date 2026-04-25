import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'skillpath-ai-secret-key-2026';
const db = new Database('skillpath.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS student_profiles (
    user_id INTEGER PRIMARY KEY,
    college_name TEXT,
    phone TEXT,
    gender TEXT,
    degree TEXT,
    specialization TEXT,
    graduation_year TEXT,
    target_role TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    role TEXT,
    score INTEGER,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);
    const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, email, name } });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Middleware for auth
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/profile', authenticate, (req: any, res) => {
  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.userId);
  res.json(profile || {});
});

app.post('/api/profile', authenticate, (req: any, res) => {
  const { college_name, phone, gender, degree, specialization, graduation_year, target_role } = req.body;
  db.prepare(`
    INSERT OR REPLACE INTO student_profiles (user_id, college_name, phone, gender, degree, specialization, graduation_year, target_role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, college_name, phone, gender, degree, specialization, graduation_year, target_role);
  res.json({ success: true });
});

// News Proxy (Mocking or using a public API if available, but for now just returning curated news)
app.get('/api/news', (req, res) => {
  res.json([
    { id: 1, title: 'AI in 2026: The Rise of Agentic Workflows', category: 'Tech', date: '2026-04-20' },
    { id: 2, title: 'New Skills for the Post-SaaS Era', category: 'Career', date: '2026-04-22' },
    { id: 3, title: 'Global Tech Hiring Index: Q2 2026 Update', category: 'Market', date: '2026-04-24' }
  ]);
});

// Vite Setup
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SkillPath AI Server running on http://localhost:${PORT}`);
});
