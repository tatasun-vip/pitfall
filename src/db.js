import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

const WORLDS = ['校园', '旅行', '职场', '租住', '跨境', '美业'];
const RISK_LEVELS = ['watch', 'caution', 'high'];
const REACTION_TYPES = ['useful', 'same', 'saved'];

export function databaseConfigFromEnv(env = process.env) {
  const base = env.DATABASE_URL
    ? {
        connectionString: env.DATABASE_URL,
        ssl: parseSsl(env.DB_SSL)
      }
    : {
        host: env.DB_HOST,
        port: Number(env.DB_PORT || 5432),
        database: env.DB_NAME || env.PGDATABASE || 'postgres',
        user: env.DB_USER || env.PGUSER,
        password: env.DB_PASSWORD || env.PGPASSWORD,
        ssl: parseSsl(env.DB_SSL)
      };
  if (env.DB_SCHEMA) base.options = `-c search_path=${quoteIdentifier(env.DB_SCHEMA)},public`;
  return base;
}

function quoteIdentifier(value) {
  return String(value).replaceAll('"', '""');
}

function parseSsl(value) {
  if (String(value).toLowerCase() === 'true') return { rejectUnauthorized: false };
  if (String(value).toLowerCase() === 'false') return false;
  return false;
}

export async function createDatabase(config = databaseConfigFromEnv(), options = {}) {
  const pool = new Pool(config);
  await migrate(pool);
  if (options.seed !== false) await seed(pool);
  return pool;
}

export async function closeDatabase(db) {
  await db?.end?.();
}

export async function migrate(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      trust_score INTEGER NOT NULL DEFAULT 50,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stories (
      id BIGSERIAL PRIMARY KEY,
      author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      world TEXT NOT NULL,
      target_name TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      original_text TEXT NOT NULL DEFAULT '',
      translated_text TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS materials (
      id BIGSERIAL PRIMARY KEY,
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      strength TEXT NOT NULL DEFAULT 'medium',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id BIGSERIAL PRIMARY KEY,
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS responses (
      id BIGSERIAL PRIMARY KEY,
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      responder_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS alternatives (
      id BIGSERIAL PRIMARY KEY,
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reactions (
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (story_id, user_id, type)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id BIGSERIAL PRIMARY KEY,
      story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      moderator_note TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE reports ADD COLUMN IF NOT EXISTS moderator_note TEXT NOT NULL DEFAULT '';
  `);
}

async function seed(db) {
  const { rows } = await db.query("SELECT COUNT(*)::int AS c FROM users WHERE email = 'seed@pitfall.local'");
  if (rows[0].c > 0) return;
  const user = await createUser(db, { username: 'Pitfall 编辑部', email: 'seed@pitfall.local', password: randomBytes(12).toString('hex') });
  const samples = [
    ['校园', '海外课程中介样本', '保录承诺和退款路径不清楚', '匿名样本：先看合同原文、退款触发条件和服务边界。', 'watch'],
    ['旅行', '海边菜单样本', '口头报价与账单条目不一致', '匿名样本：菜单原文、账单和现场照片应一起看。', 'caution'],
    ['职场', '培训贷招聘样本', '入职前先签贷款协议', '匿名样本：招聘、培训、贷款三份材料必须分开判断。', 'high'],
    ['租住', '押金退还样本', '退租清单临时出现扣款项', '匿名样本：入住前保存交割清单和房屋视频。', 'watch'],
    ['跨境', '低价预售样本', '跨境预售周期和退款入口不透明', '匿名样本：先确认付款主体、物流节点和争议路径。', 'caution'],
    ['美业', '术前告知样本', '体验价和后续项目边界模糊', '匿名样本：术前告知、药品批号和医生资质优先。', 'watch']
  ];
  for (const [world, target, title, summary, risk] of samples) {
    const story = await createStory(db, user.id, {
      world,
      targetName: target,
      title,
      summary,
      riskLevel: risk,
      originalText: 'Original material preserved for context.',
      translatedText: '已保留原文，译文仅供快速判断。',
      materials: [{ type: 'sample', label: '匿名化材料样本', url: '', strength: 'medium' }]
    });
    await db.query('UPDATE users SET trust_score = 50 WHERE id = $1', [user.id]);
    await hydrateStory(db, story, false);
  }
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
    id: Number(row.id),
    username: row.username,
    email: row.email,
    trustScore: row.trust_score,
    createdAt: row.created_at
  };
}

export async function createUser(db, { username, email, password }) {
  const { rows } = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, trust_score, created_at',
    [username.trim(), email.toLowerCase().trim(), hashPassword(password)]
  );
  return publicUser(rows[0]);
}

export async function authenticateUser(db, { email, password }) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  const row = rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) return null;
  return publicUser(row);
}

export async function getUserById(db, id) {
  const { rows } = await db.query('SELECT id, username, email, trust_score, created_at FROM users WHERE id = $1', [id]);
  return rows[0] ? publicUser(rows[0]) : null;
}

export async function createSession(db, userId) {
  const token = randomBytes(32).toString('hex');
  await db.query('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, userId]);
  return token;
}

export async function getUserByToken(db, token) {
  const { rows } = await db.query(`SELECT u.id, u.username, u.email, u.trust_score, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1`, [token]);
  return rows[0] ? publicUser(rows[0]) : null;
}

function validateWorld(world) {
  if (!WORLDS.includes(world)) throw new Error('INVALID_WORLD');
}

function validateRisk(level) {
  if (!RISK_LEVELS.includes(level)) throw new Error('INVALID_RISK');
}

export async function createStory(db, userId, input) {
  validateWorld(input.world);
  validateRisk(input.riskLevel);
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO stories (author_id, world, target_name, title, summary, risk_level, original_text, translated_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, input.world, input.targetName.trim(), input.title.trim(), input.summary.trim(), input.riskLevel, input.originalText || '', input.translatedText || '']
    );
    const storyId = Number(rows[0].id);
    const materials = Array.isArray(input.materials) ? input.materials.slice(0, 8) : [];
    for (const material of materials) {
      await client.query('INSERT INTO materials (story_id, type, label, url, strength) VALUES ($1, $2, $3, $4, $5)', [
        storyId,
        material.type || 'note',
        material.label || '材料',
        material.url || '',
        material.strength || 'medium'
      ]);
    }
    await client.query('UPDATE users SET trust_score = LEAST(100, trust_score + 2) WHERE id = $1', [userId]);
    await client.query('COMMIT');
    return getStoryById(db, storyId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function storyBase(row) {
  return {
    id: Number(row.id),
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
      id: Number(row.author_id),
      username: row.username,
      trustScore: row.trust_score
    }
  };
}

export async function listStories(db, { world } = {}) {
  const { rows } = world
    ? await db.query(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id WHERE s.world = $1 ORDER BY s.id DESC`, [world])
    : await db.query(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id ORDER BY s.id DESC`);
  return Promise.all(rows.map((row) => hydrateStory(db, storyBase(row), false)));
}

export async function searchStories(db, { q = '', world, risk } = {}) {
  const clauses = [];
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    clauses.push(`(s.title ILIKE $${params.length} OR s.summary ILIKE $${params.length} OR s.target_name ILIKE $${params.length})`);
  }
  if (world) {
    params.push(world);
    clauses.push(`s.world = $${params.length}`);
  }
  if (risk) {
    params.push(risk);
    clauses.push(`s.risk_level = $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await db.query(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id ${where} ORDER BY s.id DESC`, params);
  return Promise.all(rows.map((row) => hydrateStory(db, storyBase(row), false)));
}

export async function getProfile(db, userId) {
  const user = await getUserById(db, userId);
  if (!user) return null;
  const [{ rows: stories }, { rows: comments }, { rows: responses }, { rows: alternatives }, { rows: reactions }, { rows: reports }] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS c FROM stories WHERE author_id = $1', [userId]),
    db.query('SELECT COUNT(*)::int AS c FROM comments WHERE user_id = $1', [userId]),
    db.query('SELECT COUNT(*)::int AS c FROM responses WHERE user_id = $1', [userId]),
    db.query('SELECT COUNT(*)::int AS c FROM alternatives WHERE user_id = $1', [userId]),
    db.query('SELECT COUNT(*)::int AS c FROM reactions WHERE user_id = $1', [userId]),
    db.query('SELECT COUNT(*)::int AS c FROM reports WHERE user_id = $1', [userId])
  ]);
  return {
    user,
    stats: {
      stories: stories[0].c,
      comments: comments[0].c,
      responses: responses[0].c,
      alternatives: alternatives[0].c,
      reactions: reactions[0].c,
      reports: reports[0].c
    }
  };
}

export async function createReport(db, storyId, userId, { reason, body }) {
  const { rows } = await db.query(
    'INSERT INTO reports (story_id, user_id, reason, body) VALUES ($1, $2, $3, $4) RETURNING id, story_id AS "storyId", user_id AS "userId", reason, body, status, moderator_note AS "moderatorNote", created_at AS "createdAt"',
    [storyId, userId, reason.trim(), body.trim()]
  );
  return normalizeIdRow(rows[0], ['id', 'storyId', 'userId']);
}

export async function listReports(db) {
  const { rows } = await db.query(`SELECT r.id, r.story_id AS "storyId", r.user_id AS "userId", r.reason, r.body, r.status, r.moderator_note AS "moderatorNote", r.created_at AS "createdAt", s.title AS "storyTitle", s.target_name AS "targetName", u.username AS "reporterName" FROM reports r JOIN stories s ON s.id = r.story_id JOIN users u ON u.id = r.user_id ORDER BY r.id DESC`);
  return rows.map((row) => normalizeIdRow(row, ['id', 'storyId', 'userId']));
}

export async function updateReportStatus(db, reportId, { status, note = '' }) {
  const { rows } = await db.query(
    'UPDATE reports SET status = $1, moderator_note = $2 WHERE id = $3 RETURNING id, story_id AS "storyId", user_id AS "userId", reason, body, status, moderator_note AS "moderatorNote", created_at AS "createdAt"',
    [status, note.trim(), reportId]
  );
  return rows[0] ? normalizeIdRow(rows[0], ['id', 'storyId', 'userId']) : null;
}

export async function getStoryById(db, id) {
  const { rows } = await db.query(`SELECT s.*, u.username, u.trust_score FROM stories s JOIN users u ON u.id = s.author_id WHERE s.id = $1`, [id]);
  if (!rows[0]) return null;
  return hydrateStory(db, storyBase(rows[0]), true);
}

async function hydrateStory(db, story, includeRooms = true) {
  const [{ rows: materials }, reactions] = await Promise.all([
    db.query('SELECT id, type, label, url, strength, created_at AS "createdAt" FROM materials WHERE story_id = $1 ORDER BY id ASC', [story.id]),
    reactionCounts(db, story.id)
  ]);
  story.materials = materials.map((row) => normalizeIdRow(row, ['id']));
  story.reactions = reactions;
  if (includeRooms) {
    const [{ rows: comments }, { rows: responses }, { rows: alternatives }, { rows: reports }] = await Promise.all([
      db.query(`SELECT c.id, c.body, c.created_at AS "createdAt", u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.story_id = $1 ORDER BY c.id ASC`, [story.id]),
      db.query(`SELECT id, responder_name AS "responderName", body, created_at AS "createdAt" FROM responses WHERE story_id = $1 ORDER BY id ASC`, [story.id]),
      db.query(`SELECT id, name, reason, created_at AS "createdAt" FROM alternatives WHERE story_id = $1 ORDER BY id ASC`, [story.id]),
      db.query(`SELECT id, reason, body, status, created_at AS "createdAt" FROM reports WHERE story_id = $1 ORDER BY id ASC`, [story.id])
    ]);
    story.comments = comments.map((row) => normalizeIdRow(row, ['id']));
    story.responses = responses.map((row) => normalizeIdRow(row, ['id']));
    story.alternatives = alternatives.map((row) => normalizeIdRow(row, ['id']));
    story.reports = reports.map((row) => normalizeIdRow(row, ['id']));
  }
  return story;
}

async function reactionCounts(db, storyId) {
  const counts = { useful: 0, same: 0, saved: 0 };
  const { rows } = await db.query('SELECT type, COUNT(*)::int AS c FROM reactions WHERE story_id = $1 GROUP BY type', [storyId]);
  for (const row of rows) counts[row.type] = row.c;
  return counts;
}

export async function addComment(db, storyId, userId, body) {
  const { rows } = await db.query(
    `INSERT INTO comments (story_id, user_id, body) VALUES ($1, $2, $3) RETURNING id, body, created_at AS "createdAt"`,
    [storyId, userId, body.trim()]
  );
  return normalizeIdRow({ ...rows[0], username: (await getUserById(db, userId)).username }, ['id']);
}

export async function addResponse(db, storyId, userId, { responderName, body }) {
  const { rows } = await db.query(
    `INSERT INTO responses (story_id, user_id, responder_name, body) VALUES ($1, $2, $3, $4) RETURNING id, responder_name AS "responderName", body, created_at AS "createdAt"`,
    [storyId, userId, responderName.trim(), body.trim()]
  );
  return normalizeIdRow(rows[0], ['id']);
}

export async function addAlternative(db, storyId, userId, { name, reason }) {
  const { rows } = await db.query(
    `INSERT INTO alternatives (story_id, user_id, name, reason) VALUES ($1, $2, $3, $4) RETURNING id, name, reason, created_at AS "createdAt"`,
    [storyId, userId, name.trim(), reason.trim()]
  );
  return normalizeIdRow(rows[0], ['id']);
}

export async function toggleReaction(db, storyId, userId, type) {
  if (!REACTION_TYPES.includes(type)) throw new Error('INVALID_REACTION');
  await db.query('INSERT INTO reactions (story_id, user_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [storyId, userId, type]);
  return reactionCounts(db, storyId);
}

function normalizeIdRow(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined) row[key] = Number(row[key]);
  }
  return row;
}

export const constants = { WORLDS, RISK_LEVELS, REACTION_TYPES };
