import Database from 'better-sqlite3';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

const WORLDS = ['校园', '旅行', '职场', '租住', '跨境', '美业'];
const RISK_LEVELS = ['watch', 'caution', 'high'];
const REACTION_TYPES = ['useful', 'same', 'saved'];

export function createDatabase(filename = 'data/pitfall.sqlite') {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  if (filename !== ':memory:') seed(db);
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      trust_score INTEGER NOT NULL DEFAULT 50,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      world TEXT NOT NULL,
      target_name TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      original_text TEXT NOT NULL DEFAULT '',
      translated_text TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      strength TEXT NOT NULL DEFAULT 'medium',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      responder_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alternatives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reactions (
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (story_id, user_id, type)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      moderator_note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  addColumnIfMissing(db, 'reports', 'moderator_note', "TEXT NOT NULL DEFAULT ''");
}

function addColumnIfMissing(db, table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name);
  if (!cols.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function seed(db) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;
  const user = createUser(db, { username: 'Pitfall 编辑部', email: 'seed@pitfall.local', password: randomBytes(12).toString('hex') });
  const samples = [
    ['校园', '海外课程中介样本', '保录承诺和退款路径不清楚', '匿名样本：先看合同原文、退款触发条件和服务边界。', 'watch'],
    ['旅行', '海边菜单样本', '口头报价与账单条目不一致', '匿名样本：菜单原文、账单和现场照片应一起看。', 'caution'],
    ['职场', '培训贷招聘样本', '入职前先签贷款协议', '匿名样本：招聘、培训、贷款三份材料必须分开判断。', 'high'],
    ['租住', '押金退还样本', '退租清单临时出现扣款项', '匿名样本：入住前保存交割清单和房屋视频。', 'watch'],
    ['跨境', '低价预售样本', '跨境预售周期和退款入口不透明', '匿名样本：先确认付款主体、物流节点和争议路径。', 'caution'],
    ['美业', '术前告知样本', '体验价和后续项目边界模糊', '匿名样本：术前告知、药品批号和医生资质优先。', 'watch']
  ];
  const insertStory = db.prepare(`INSERT INTO stories (author_id, world, target_name, title, summary, risk_level, original_text, translated_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertMaterial = db.prepare(`INSERT INTO materials (story_id, type, label, url, strength) VALUES (?, ?, ?, ?, ?)`);
  const tx = db.transaction(() => {
    for (const [world, target, title, summary, risk] of samples) {
      const info = insertStory.run(user.id, world, target, title, summary, risk, 'Original material preserved for context.', '已保留原文，译文仅供快速判断。');
      insertMaterial.run(info.lastInsertRowid, 'sample', '匿名化材料样本', '', 'medium');
    }
  });
  tx();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${key}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const known = Buffer.from(key, 'hex');
  return known.length === derived.length && timingSafeEqual(known, derived);
}

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    trustScore: row.trust_score,
    createdAt: row.created_at
  };
}

export function createUser(db, { username, email, password }) {
  const info = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username.trim(), email.toLowerCase().trim(), hashPassword(password));
  return getUserById(db, info.lastInsertRowid);
}

export function authenticateUser(db, { email, password }) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!row || !verifyPassword(password, row.password_hash)) return null;
  return publicUser(row);
}

export function getUserById(db, id) {
  const row = db.prepare('SELECT id, username, email, trust_score, created_at FROM users WHERE id = ?').get(id);
  return row ? publicUser(row) : null;
}

export function createSession(db, userId) {
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, userId);
  return token;
}

export function getUserByToken(db, token) {
  const row = db.prepare(`SELECT u.id, u.username, u.email, u.trust_score, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`).get(token);
  return row ? publicUser(row) : null;
}

function validateWorld(world) {
  if (!WORLDS.includes(world)) throw new Error('INVALID_WORLD');
}

function validateRisk(level) {
  if (!RISK_LEVELS.includes(level)) throw new Error('INVALID_RISK');
}

export function createStory(db, userId, input) {
  validateWorld(input.world);
  validateRisk(input.riskLevel);
  const materials = Array.isArray(input.materials) ? input.materials.slice(0, 8) : [];
  const tx = db.transaction(() => {
    const info = db.prepare(`INSERT INTO stories (author_id, world, target_name, title, summary, risk_level, original_text, translated_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      userId,
      input.world,
      input.targetName.trim(),
      input.title.trim(),
      input.summary.trim(),
      input.riskLevel,
      input.originalText || '',
      input.translatedText || ''
    );
    const insertMaterial = db.prepare('INSERT INTO materials (story_id, type, label, url, strength) VALUES (?, ?, ?, ?, ?)');
    for (const m of materials) {
      insertMaterial.run(info.lastInsertRowid, m.type || 'note', m.label || '材料', m.url || '', m.strength || 'medium');
    }
    db.prepare('UPDATE users SET trust_score = MIN(100, trust_score + 2) WHERE id = ?').run(userId);
    return getStoryById(db, info.lastInsertRowid);
  });
  return tx();
}

function storyBase(row) {
  return {
    id: row.id,
    world: row.world,
    targetName: row.target_name,
    title: row.title,
    summary: row.summary,
    riskLevel: row.risk_level,
    originalText: row.original_text,
    translatedText: row.translated_text,
    status: row.status,
    createdAt: row.created_at,
    author: {
      id: row.author_id,
      username: row.username,
      trustScore: row.trust_score
    }
  };
}

export function listStories(db, { world } = {}) {
  const rows = world
    ? db.prepare(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id WHERE s.world = ? ORDER BY s.id DESC`).all(world)
    : db.prepare(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id ORDER BY s.id DESC`).all();
  return rows.map((row) => hydrateStory(db, storyBase(row), false));
}

export function searchStories(db, { q = '', world, risk } = {}) {
  const clauses = [];
  const params = [];
  if (q) {
    clauses.push('(s.title LIKE ? OR s.summary LIKE ? OR s.target_name LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (world) {
    clauses.push('s.world = ?');
    params.push(world);
  }
  if (risk) {
    clauses.push('s.risk_level = ?');
    params.push(risk);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id ${where} ORDER BY s.id DESC`).all(...params);
  return rows.map((row) => hydrateStory(db, storyBase(row), false));
}

export function getProfile(db, userId) {
  const user = getUserById(db, userId);
  if (!user) return null;
  const stats = {
    stories: db.prepare('SELECT COUNT(*) AS c FROM stories WHERE author_id = ?').get(userId).c,
    comments: db.prepare('SELECT COUNT(*) AS c FROM comments WHERE user_id = ?').get(userId).c,
    responses: db.prepare('SELECT COUNT(*) AS c FROM responses WHERE user_id = ?').get(userId).c,
    alternatives: db.prepare('SELECT COUNT(*) AS c FROM alternatives WHERE user_id = ?').get(userId).c,
    reactions: db.prepare('SELECT COUNT(*) AS c FROM reactions WHERE user_id = ?').get(userId).c,
    reports: db.prepare('SELECT COUNT(*) AS c FROM reports WHERE user_id = ?').get(userId).c
  };
  return { user, stats };
}

export function createReport(db, storyId, userId, { reason, body }) {
  const info = db.prepare('INSERT INTO reports (story_id, user_id, reason, body) VALUES (?, ?, ?, ?)').run(storyId, userId, reason.trim(), body.trim());
  return db.prepare('SELECT id, story_id AS storyId, user_id AS userId, reason, body, status, moderator_note AS moderatorNote, created_at AS createdAt FROM reports WHERE id = ?').get(info.lastInsertRowid);
}

export function listReports(db) {
  return db.prepare(`SELECT r.id, r.story_id AS storyId, r.user_id AS userId, r.reason, r.body, r.status, r.moderator_note AS moderatorNote, r.created_at AS createdAt, s.title AS storyTitle, s.target_name AS targetName, u.username AS reporterName FROM reports r JOIN stories s ON s.id = r.story_id JOIN users u ON u.id = r.user_id ORDER BY r.id DESC`).all();
}

export function updateReportStatus(db, reportId, { status, note = '' }) {
  db.prepare('UPDATE reports SET status = ?, moderator_note = ? WHERE id = ?').run(status, note.trim(), reportId);
  return db.prepare('SELECT id, story_id AS storyId, user_id AS userId, reason, body, status, moderator_note AS moderatorNote, created_at AS createdAt FROM reports WHERE id = ?').get(reportId);
}

export function getStoryById(db, id) {
  const row = db.prepare(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id WHERE s.id = ?`).get(id);
  if (!row) return null;
  return hydrateStory(db, storyBase(row), true);
}

function hydrateStory(db, story, includeRooms = true) {
  story.materials = db.prepare('SELECT id, type, label, url, strength, created_at AS createdAt FROM materials WHERE story_id = ? ORDER BY id ASC').all(story.id);
  story.reactions = reactionCounts(db, story.id);
  if (includeRooms) {
    story.comments = db.prepare(`SELECT c.id, c.body, c.created_at AS createdAt, u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.story_id = ? ORDER BY c.id ASC`).all(story.id);
    story.responses = db.prepare(`SELECT id, responder_name AS responderName, body, created_at AS createdAt FROM responses WHERE story_id = ? ORDER BY id ASC`).all(story.id);
    story.alternatives = db.prepare(`SELECT id, name, reason, created_at AS createdAt FROM alternatives WHERE story_id = ? ORDER BY id ASC`).all(story.id);
    story.reports = db.prepare(`SELECT id, reason, body, status, created_at AS createdAt FROM reports WHERE story_id = ? ORDER BY id ASC`).all(story.id);
  }
  return story;
}

function reactionCounts(db, storyId) {
  const counts = { useful: 0, same: 0, saved: 0 };
  const rows = db.prepare('SELECT type, COUNT(*) AS c FROM reactions WHERE story_id = ? GROUP BY type').all(storyId);
  for (const row of rows) counts[row.type] = row.c;
  return counts;
}

export function addComment(db, storyId, userId, body) {
  db.prepare('INSERT INTO comments (story_id, user_id, body) VALUES (?, ?, ?)').run(storyId, userId, body.trim());
  return getStoryById(db, storyId).comments.at(-1);
}

export function addResponse(db, storyId, userId, { responderName, body }) {
  db.prepare('INSERT INTO responses (story_id, user_id, responder_name, body) VALUES (?, ?, ?, ?)').run(storyId, userId, responderName.trim(), body.trim());
  return getStoryById(db, storyId).responses.at(-1);
}

export function addAlternative(db, storyId, userId, { name, reason }) {
  db.prepare('INSERT INTO alternatives (story_id, user_id, name, reason) VALUES (?, ?, ?, ?)').run(storyId, userId, name.trim(), reason.trim());
  return getStoryById(db, storyId).alternatives.at(-1);
}

export function toggleReaction(db, storyId, userId, type) {
  if (!REACTION_TYPES.includes(type)) throw new Error('INVALID_REACTION');
  db.prepare('INSERT OR IGNORE INTO reactions (story_id, user_id, type) VALUES (?, ?, ?)').run(storyId, userId, type);
  return reactionCounts(db, storyId);
}

export const constants = { WORLDS, RISK_LEVELS, REACTION_TYPES };
