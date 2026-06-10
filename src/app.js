import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import {
  addAlternative,
  addComment,
  addResponse,
  authenticateUser,
  constants,
  createReport,
  createSession,
  createStory,
  createUser,
  getProfile,
  getStoryById,
  getUserByToken,
  listReports,
  searchStories,
  listStories,
  toggleReaction,
  updateReportStatus
} from './db.js';

const registerSchema = z.object({
  username: z.string().trim().min(2).max(24),
  email: z.string().email().max(120),
  password: z.string().min(8).max(120)
});

const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1).max(120)
});

const materialSchema = z.object({
  type: z.string().trim().min(1).max(40).default('note'),
  label: z.string().trim().min(1).max(120),
  url: z.string().trim().max(500).optional().default(''),
  strength: z.enum(['weak', 'medium', 'strong']).default('medium')
});

const storySchema = z.object({
  world: z.enum(constants.WORLDS),
  targetName: z.string().trim().min(2).max(80),
  title: z.string().trim().min(4).max(120),
  summary: z.string().trim().min(8).max(800),
  riskLevel: z.enum(constants.RISK_LEVELS),
  originalText: z.string().max(1200).optional().default(''),
  translatedText: z.string().max(1200).optional().default(''),
  materials: z.array(materialSchema).max(8).optional().default([])
});

const commentSchema = z.object({ body: z.string().trim().min(2).max(800) });
const responseSchema = z.object({ responderName: z.string().trim().min(2).max(60), body: z.string().trim().min(2).max(1000) });
const alternativeSchema = z.object({ name: z.string().trim().min(2).max(100), reason: z.string().trim().min(4).max(800) });
const reactionSchema = z.object({ type: z.enum(constants.REACTION_TYPES) });

export function buildApp({ db }) {
  const app = Fastify({ logger: false });
  app.register(cors, { origin: true });

  app.decorate('authenticate', async (request, reply) => {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const user = token ? await getUserByToken(db, token) : null;
    if (!user) return reply.code(401).send({ error: 'UNAUTHORIZED', message: '请先登录后再继续。' });
    request.user = user;
  });

  app.setErrorHandler((error, request, reply) => {
    if (error?.issues) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: error.issues });
    if (String(error?.message || '').includes('users_email_key') || String(error?.code) === '23505') return reply.code(409).send({ error: 'EMAIL_EXISTS', message: '这个邮箱已经注册。' });
    request.log?.error?.(error);
    return reply.code(500).send({ error: 'INTERNAL_ERROR', message: '服务暂时不可用。' });
  });

  app.get('/api/health', async () => ({ ok: true, app: 'Pitfall', cn: '小众点评网', database: true }));

  app.get('/api/config', async () => ({
    product: 'Pitfall',
    cn: '小众点评网',
    worlds: constants.WORLDS,
    riskLevels: constants.RISK_LEVELS,
    reactionTypes: constants.REACTION_TYPES,
    principles: ['材料优先', '保留原文', '允许对象回应', '翻译可纠错', '禁止付费删真实材料']
  }));

  app.post('/api/auth/register', async (request, reply) => {
    const data = registerSchema.parse(request.body || {});
    const user = await createUser(db, data);
    const token = await createSession(db, user.id);
    return reply.code(201).send({ user, token });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const data = loginSchema.parse(request.body || {});
    const user = await authenticateUser(db, data);
    if (!user) return reply.code(401).send({ error: 'INVALID_CREDENTIALS', message: '邮箱或密码不正确。' });
    const token = await createSession(db, user.id);
    return { user, token };
  });

  app.get('/api/me', { preHandler: app.authenticate }, async (request) => ({ user: request.user }));

  app.get('/api/stories', async (request) => {
    const world = typeof request.query.world === 'string' ? request.query.world : undefined;
    const q = typeof request.query.q === 'string' ? request.query.q : '';
    const risk = typeof request.query.risk === 'string' ? request.query.risk : undefined;
    const stories = q || risk ? await searchStories(db, { q, world, risk }) : await listStories(db, { world });
    return { stories, total: stories.length };
  });

  app.get('/api/search', async (request) => {
    const q = typeof request.query.q === 'string' ? request.query.q : '';
    const world = typeof request.query.world === 'string' ? request.query.world : undefined;
    const risk = typeof request.query.risk === 'string' ? request.query.risk : undefined;
    const stories = await searchStories(db, { q, world, risk });
    return { stories, total: stories.length, q, world, risk };
  });

  app.get('/api/profile', { preHandler: app.authenticate }, async (request) => {
    const profile = await getProfile(db, request.user.id);
    return { profile };
  });

  app.get('/api/stories/:id', async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    return { story };
  });

  app.post('/api/stories/:id/reports', { preHandler: app.authenticate }, async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    const body = request.body || {};
    const reason = typeof body.reason === 'string' ? body.reason : '';
    const note = typeof body.body === 'string' ? body.body : '';
    if (!reason || !note) return reply.code(400).send({ error: 'VALIDATION_ERROR' });
    const report = await createReport(db, story.id, request.user.id, { reason, body: note });
    return reply.code(201).send({ report });
  });

  app.get('/api/moderation/reports', { preHandler: app.authenticate }, async () => ({
    reports: await listReports(db)
  }));

  app.patch('/api/moderation/reports/:id', { preHandler: app.authenticate }, async (request, reply) => {
    const body = request.body || {};
    const status = typeof body.status === 'string' ? body.status : '';
    const note = typeof body.note === 'string' ? body.note : '';
    if (!['open', 'reviewing', 'resolved', 'rejected'].includes(status)) return reply.code(400).send({ error: 'VALIDATION_ERROR' });
    const report = await updateReportStatus(db, Number(request.params.id), { status, note });
    if (!report) return reply.code(404).send({ error: 'NOT_FOUND' });
    return { report };
  });

  app.post('/api/stories', { preHandler: app.authenticate }, async (request, reply) => {
    const data = storySchema.parse(request.body || {});
    const story = await createStory(db, request.user.id, data);
    return reply.code(201).send({ story });
  });

  app.post('/api/stories/:id/comments', { preHandler: app.authenticate }, async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    const data = commentSchema.parse(request.body || {});
    const comment = await addComment(db, story.id, request.user.id, data.body);
    return reply.code(201).send({ comment });
  });

  app.post('/api/stories/:id/responses', { preHandler: app.authenticate }, async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    const data = responseSchema.parse(request.body || {});
    const response = await addResponse(db, story.id, request.user.id, data);
    return reply.code(201).send({ response });
  });

  app.post('/api/stories/:id/alternatives', { preHandler: app.authenticate }, async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    const data = alternativeSchema.parse(request.body || {});
    const alternative = await addAlternative(db, story.id, request.user.id, data);
    return reply.code(201).send({ alternative });
  });

  app.post('/api/stories/:id/reactions', { preHandler: app.authenticate }, async (request, reply) => {
    const story = await getStoryById(db, Number(request.params.id));
    if (!story) return reply.code(404).send({ error: 'NOT_FOUND' });
    const data = reactionSchema.parse(request.body || {});
    const reactions = await toggleReaction(db, story.id, request.user.id, data.type);
    return { reactions };
  });

  return app;
}
