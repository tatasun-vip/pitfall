import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { createDatabase } from '../src/db.js';

async function request(app, method, url, body, token) {
  const res = await app.inject({
    method,
    url,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    payload: body ? JSON.stringify(body) : undefined
  });
  let json = null;
  try { json = JSON.parse(res.payload); } catch {}
  return { status: res.statusCode, body: json };
}

test('registration creates a real database user and returns a usable token', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '清醒用户',
    email: 'awake@example.com',
    password: 'pitfall-pass-123'
  });

  assert.equal(reg.status, 201);
  assert.equal(reg.body.user.username, '清醒用户');
  assert.equal(reg.body.user.trustScore, 50);
  assert.ok(reg.body.token.length > 20);

  const me = await request(app, 'GET', '/api/me', null, reg.body.token);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'awake@example.com');

  await app.close();
});

test('login rejects wrong password and accepts the correct password', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  await request(app, 'POST', '/api/auth/register', {
    username: '旅行判断者',
    email: 'trip@example.com',
    password: 'right-password'
  });

  const bad = await request(app, 'POST', '/api/auth/login', {
    email: 'trip@example.com',
    password: 'wrong-password'
  });
  assert.equal(bad.status, 401);

  const good = await request(app, 'POST', '/api/auth/login', {
    email: 'trip@example.com',
    password: 'right-password'
  });
  assert.equal(good.status, 200);
  assert.ok(good.body.token);

  await app.close();
});

test('authenticated users can publish stories with material chain items', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '材料优先',
    email: 'material@example.com',
    password: 'material-pass'
  });

  const created = await request(app, 'POST', '/api/stories', {
    world: '旅行',
    targetName: '罗马车站旁某换汇点',
    title: '账单原文和口头报价不一致',
    summary: '现场英文价目表与最终收据金额不一致，适合提醒旅行用户先看原文再付款。',
    riskLevel: 'watch',
    originalText: 'Service fee applies after 8pm.',
    translatedText: '晚上 8 点后收取服务费。',
    materials: [
      { type: 'receipt', label: '收据打码照片', url: 'local://receipt-001', strength: 'strong' },
      { type: 'translation', label: '价目表原文译文', url: 'local://translation-001', strength: 'medium' }
    ]
  }, reg.body.token);

  assert.equal(created.status, 201);
  assert.equal(created.body.story.world, '旅行');
  assert.equal(created.body.story.materials.length, 2);
  assert.equal(created.body.story.author.username, '材料优先');

  const feed = await request(app, 'GET', '/api/stories?world=旅行');
  assert.equal(feed.status, 200);
  assert.equal(feed.body.stories.length, 1);
  assert.equal(feed.body.stories[0].materials.length, 2);

  await app.close();
});

test('search filters stories by query, world and risk level', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '搜索验证者',
    email: 'search@example.com',
    password: 'search-pass-123'
  });

  await request(app, 'POST', '/api/stories', {
    world: '旅行',
    targetName: '罗马菜单样本',
    title: '菜单原文和最终账单不一致',
    summary: '适合用关键词搜索菜单、账单、旅行世界。',
    riskLevel: 'caution',
    materials: [{ type: 'receipt', label: '账单截图', strength: 'strong' }]
  }, reg.body.token);

  await request(app, 'POST', '/api/stories', {
    world: '租住',
    targetName: '押金清单样本',
    title: '退租清单临时扣款',
    summary: '租住世界的押金争议。',
    riskLevel: 'watch',
    materials: [{ type: 'contract', label: '合同截图', strength: 'medium' }]
  }, reg.body.token);

  const search = await request(app, 'GET', '/api/search?q=菜单&world=旅行&risk=caution');
  assert.equal(search.status, 200);
  assert.equal(search.body.stories.length, 1);
  assert.equal(search.body.stories[0].targetName, '罗马菜单样本');
  assert.equal(search.body.total, 1);

  await app.close();
});

test('profile summarizes user contribution and trust activity', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '信用贡献者',
    email: 'profile@example.com',
    password: 'profile-pass-123'
  });
  const token = reg.body.token;

  const created = await request(app, 'POST', '/api/stories', {
    world: '职场',
    targetName: '培训贷样本',
    title: '入职前先签贷款协议',
    summary: '需要材料优先判断招聘、培训和贷款边界。',
    riskLevel: 'high',
    materials: [{ type: 'contract', label: '贷款协议截图', strength: 'strong' }]
  }, token);
  await request(app, 'POST', `/api/stories/${created.body.story.id}/comments`, { body: '补充一条材料审查建议。' }, token);
  await request(app, 'POST', `/api/stories/${created.body.story.id}/alternatives`, { name: '不绑定贷款的岗位', reason: '薪酬和培训边界更清楚。' }, token);
  await request(app, 'POST', `/api/stories/${created.body.story.id}/reactions`, { type: 'useful' }, token);

  const profile = await request(app, 'GET', '/api/profile', null, token);
  assert.equal(profile.status, 200);
  assert.equal(profile.body.profile.user.username, '信用贡献者');
  assert.equal(profile.body.profile.stats.stories, 1);
  assert.equal(profile.body.profile.stats.comments, 1);
  assert.equal(profile.body.profile.stats.alternatives, 1);
  assert.equal(profile.body.profile.stats.reactions, 1);
  assert.ok(profile.body.profile.user.trustScore >= 52);

  await app.close();
});

test('reports create governance records without deleting the original story', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '治理提交者',
    email: 'report@example.com',
    password: 'report-pass-123'
  });
  const token = reg.body.token;
  const created = await request(app, 'POST', '/api/stories', {
    world: '美业',
    targetName: '术前告知样本',
    title: '术前告知材料不完整',
    summary: '需要补充资质和药品批号。',
    riskLevel: 'watch',
    materials: [{ type: 'note', label: '用户说明', strength: 'weak' }]
  }, token);

  const report = await request(app, 'POST', `/api/stories/${created.body.story.id}/reports`, {
    reason: 'privacy',
    body: '图片里可能有未打码手机号，请审核。'
  }, token);

  assert.equal(report.status, 201);
  assert.equal(report.body.report.status, 'open');
  assert.equal(report.body.report.reason, 'privacy');

  const detail = await request(app, 'GET', `/api/stories/${created.body.story.id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.story.reports.length, 1);
  assert.equal(detail.body.story.status, 'published');

  await app.close();
});

test('moderation queue lists reports and can update report status', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '审核员',
    email: 'mod@example.com',
    password: 'moderator-pass-123'
  });
  const token = reg.body.token;
  const created = await request(app, 'POST', '/api/stories', {
    world: '跨境',
    targetName: '预售商家样本',
    title: '退款路径不透明',
    summary: '跨境预售需要明确付款主体和退款入口。',
    riskLevel: 'caution',
    materials: [{ type: 'note', label: '用户说明', strength: 'medium' }]
  }, token);
  const report = await request(app, 'POST', `/api/stories/${created.body.story.id}/reports`, {
    reason: 'incomplete',
    body: '需要补充原始订单号打码截图。'
  }, token);

  const queue = await request(app, 'GET', '/api/moderation/reports', null, token);
  assert.equal(queue.status, 200);
  assert.equal(queue.body.reports.length, 1);
  assert.equal(queue.body.reports[0].status, 'open');

  const updated = await request(app, 'PATCH', `/api/moderation/reports/${report.body.report.id}`, {
    status: 'reviewing',
    note: '已进入材料补充审核。'
  }, token);
  assert.equal(updated.status, 200);
  assert.equal(updated.body.report.status, 'reviewing');
  assert.equal(updated.body.report.moderatorNote, '已进入材料补充审核。');

  await app.close();
});

test('story interactions persist comments, target responses, alternatives and reactions', async () => {
  const db = createDatabase(':memory:');
  const app = buildApp({ db });
  await app.ready();

  const reg = await request(app, 'POST', '/api/auth/register', {
    username: '房间讨论者',
    email: 'room@example.com',
    password: 'room-pass-123'
  });
  const token = reg.body.token;

  const created = await request(app, 'POST', '/api/stories', {
    world: '租住',
    targetName: '城西合租 A 座',
    title: '退租清单没有提前给到',
    summary: '建议入住前确认押金扣除规则。',
    riskLevel: 'caution',
    materials: [{ type: 'contract', label: '合同条款截图', strength: 'medium' }]
  }, token);
  const id = created.body.story.id;

  const comment = await request(app, 'POST', `/api/stories/${id}/comments`, {
    body: '这个案例需要补充原始合同页，单独收据不够。'
  }, token);
  assert.equal(comment.status, 201);

  const response = await request(app, 'POST', `/api/stories/${id}/responses`, {
    responderName: '对象方客服',
    body: '我们愿意补充完整收费规则和申诉入口。'
  }, token);
  assert.equal(response.status, 201);

  const alt = await request(app, 'POST', `/api/stories/${id}/alternatives`, {
    name: '提前给退租清单的合租平台',
    reason: '签约前展示扣费规则，有争议工单记录。'
  }, token);
  assert.equal(alt.status, 201);

  const reaction = await request(app, 'POST', `/api/stories/${id}/reactions`, {
    type: 'useful'
  }, token);
  assert.equal(reaction.status, 200);
  assert.equal(reaction.body.reactions.useful, 1);

  const detail = await request(app, 'GET', `/api/stories/${id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.story.comments.length, 1);
  assert.equal(detail.body.story.responses.length, 1);
  assert.equal(detail.body.story.alternatives.length, 1);
  assert.equal(detail.body.story.reactions.useful, 1);

  await app.close();
});
