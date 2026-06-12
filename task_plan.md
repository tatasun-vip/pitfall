# Pitfall / 小众点评项目规划

项目路径：/Users/suntata/Desktop/pitfall

英文名：Pitfall
中文名：小众点评网

## 目标

用 planning-with-files 管理 Pitfall（小众点评网）产品方向：从“大众点评/差评墙”收敛为一个全球年轻人的生活判断社区。核心不是低级“避坑”表达，而是用真实经验、原文材料、多语翻译、对象回应和替代路线，帮助用户提前看见生活里的暗门，做更清醒的选择。

## 当前产物

- index.html：单文件高保真产品概念页，含 CSS、SVG 图标系统与 JS 交互；已新增推广变现区。
- worlds-mobile.html：mobile-first Pitfall Worlds App 原型，含世界切换、滑卡 Feed、对象详情、材料链、翻译层和 Story 投递；已新增移动端免费查风险入口。
- marketing-launch-kit.md：推广变现启动包，含小红书、公众号、微信群、SEO、定价与 7 天节奏。
- README.md：项目说明、打开方式、下一步建议。
- task_plan.md / findings.md / progress.md：planning-with-files 工作记忆文件。

## 产品优化原则

1. 先删：不是大众点评复制品，不是情绪差评墙，删除不服务判断的泛社交。
2. 语言升级：少用“避坑”这种低级负面词，转为“暗门、路径、原文、材料、替代路线、清醒选择、生活地图”。
3. 世界入口：用校园、旅行、职场、租住、跨境、美业等生活世界承接用户，而不是抽象频道。
4. 自有符号：建立 Pitfall 专属线性图标系统，减少散装 emoji，形成品牌识别。
5. 垂直整合信任链：对象页内同时放风险、材料、原文/译文、回应、替代，避免用户在多个平台拼信息。
6. 法律与治理是硬约束：必须有材料分级、隐私打码、回应通道、翻译纠错和反勒索机制。
7. 变现必须围绕用户判断价值：免费摘要负责传播，深度报告/专题包/回应认证负责收入，禁止付费删帖。

## 阶段计划

### Phase 1：首版概念页
状态：complete
Status: complete

- 建立 Pitfall 品牌首页。
- 表达“真实经验，少走弯路”。
- 加入手机端 feed 预览、风险信号、材料优先、更好替代、讨论房间、社区底线。

### Phase 2：本地验证
状态：complete
Status: complete

- 验证 index.html 与 README.md 存在。
- 验证 HTML 可由 Python HTMLParser 解析。
- 验证关键 DOM、标题、按钮、发布面板、toast 存在。
- 用浏览器打开 file:// 页面并测试发布面板交互。

### Phase 3：内容与细节升级
状态：complete
Status: complete

- 明确英文名 Pitfall，中文名 小众点评网。
- 加入匿名化热门案例，覆盖留学、旅行、就业、跨境购物、租房、医美。
- 加入“争议可讨论”模块：每个案例都有可讨论问题，避免单向审判。
- 加入多国语言实时翻译作为核心功能：评论、合同、菜单、账单、对象回应原文 + 译文并列展示。
- 删除泛社交和情绪差评墙，保留决策价值。

### Phase 4：互动与年轻化表达深度打磨
状态：complete
Status: complete

- 将发布流程改为 Story 投递：语音、照片、文字、链接四种入口。
- 加入滑卡、轻反应、底部快速投递、toast 微反馈。
- 新增 Pitfall Worlds 世界切换：校园、旅行、职场、租住、跨境、美业。
- 新增 Pitfall 自有 SVG symbol 图标系统：品牌护盾、路径雷达、材料页、世界切换、语音投递、隐私打码、替代路线、讨论房间。
- 文案去低级化：删除页面中“避坑”字样，改用暗门、路径、原文、材料、替代路线、清醒选择、生活地图等品牌语言。

### Phase 5：真实产品结构
状态：complete
Status: complete

已新增 `worlds-mobile.html`，把 Pitfall Worlds 从官网模块升级为移动端 App 主入口。当前原型覆盖：

1. World Feed：按校园、旅行、职场、租住、跨境、美业切换的世界流。
2. Object Detail：对象页，展示风险、材料、翻译、回应、替代路线。
3. Publish：语音/照片/文字/链接投递、材料类型选择、隐私打码与多语翻译语境。
4. Rooms：在对象详情中体现讨论房间/争议沉淀入口；后续可扩成独立页面。
5. Profile/Credit：底部导航已预留“我的”；后续做用户信用、贡献记录、材料可信度。

## 错误与注意事项

| 问题 | 处理 |
|---|---|
| tidy 默认按旧 HTML 规则识别 nav/main/section/article 为错误 | 用浏览器和 Python HTMLParser 交叉验证；这是 tidy 版本/HTML5 识别问题，不代表浏览器不可用。 |
| 小众点评容易滑向网暴/勒索删帖 | 产品必须默认证据/材料分级、隐私保护、对象回应、禁止付费删真实材料。 |
| 多国语言翻译可能造成误解 | 必须保留原文，译文标注机器翻译，并允许社区纠错。 |
| 热门案例可能被误认为真实指控 | 当前页面明确为匿名化示例案例，不指向具体真实商家或个人。 |
| 过度使用“避坑”会显得低级和负面 | 页面文案应使用 Pitfall 自有语言体系：暗门、路径、原文、材料、替代路线、清醒选择。 |

## 打开方式

```bash
open /Users/suntata/Desktop/pitfall/index.html
```

或直接双击：

/Users/suntata/Desktop/pitfall/index.html


### Phase 6：全栈注册、数据库与真实交互
状态：complete
Status: complete

- 新增 Node/Fastify 全栈服务。
- 新增 SQLite 数据库 `data/pitfall.sqlite`。
- 新增注册、登录、Token 鉴权。
- 新增 Story 投递、材料链、评论、对象回应、替代路线、轻反应 API。
- 新增 `app.html` 全栈交互页，真实调用 API 并写入数据库。
- 新增 `tests/api.test.js`，按 TDD 完成 RED -> GREEN。
- 验证 `npm test` 4 项通过。
- 验证本地服务 `http://127.0.0.1:8791` 健康检查通过，数据库真实写入用户、Story 与互动数据。


### Phase 7：搜索、个人档案与治理闭环
状态：complete
Status: complete

目标：把全栈原型从“能注册/能发布”推进到更接近真实社区：可搜索筛选、可查看个人贡献信用、可提交治理举报/材料问题。

待完成：
- Search：按关键词、世界、风险等级搜索 Story。
- Profile：查看当前用户贡献数、评论数、回应数、替代路线数、反应数、信任分。
- Reports：对 Story 提交治理举报/材料问题，进入数据库留痕。
- 前端：在 app.html 增加搜索栏、我的档案、举报入口。
- 测试：新增 API 行为测试并通过。


### Phase 7 完成记录
- 新增 /api/search、/api/profile、/api/stories/:id/reports。
- stories 详情包含 reports 列表。
- app.html 增加搜索栏、个人档案、举报治理入口。
- `npm test` 全通过。
- `npm run dev` 本地服务可启动。


### Phase 8：治理审核队列
状态：complete
Status: complete

- 新增审核队列 API：`GET /api/moderation/reports`。
- 新增举报状态更新 API：`PATCH /api/moderation/reports/:id`。
- reports 表新增 `moderator_note` 字段，支持审核备注。
- 新增测试：审核队列可列出举报并更新状态。
- `npm test` 8/8 通过。


### Phase 9：Supabase Postgres 数据库迁移
状态：complete
Status: complete

- 将数据层从本地 SQLite 迁移到 Supabase Postgres。
- 使用 `pg` 连接池和 `DATABASE_URL`/Postgres 环境变量。
- 保持现有 API 行为：注册、登录、Story、材料链、评论、回应、替代路线、反应、举报、审核队列。
- 保留测试可隔离运行能力，避免测试污染线上 Supabase。
- 凭据只写本地 `.env`，不提交到 Git。


### Phase 9 执行记录
- 代码迁移已完成：数据层改为 `pg` 异步连接池，Server 入口读取 `.env`。
- 测试已改为每次创建独立 Postgres schema，并默认不 seed，避免污染 Supabase 公共数据。
- 本地 `.env` 已写入用户提供的 Supabase 连接信息，并通过 `.gitignore` 排除。
- direct host `db.xgrmcwcgkbektyxrhbhu.supabase.co` 无法解析，已改用 Supabase pooler host。
- pooler 配置已验证通过：`aws-1-ap-southeast-1.pooler.supabase.com:6543`，user=`postgres.xgrmcwcgkbektyxrhbhu`。
- `npm test` 8/8 通过，测试使用临时 Postgres schema，运行后清理。


### Phase 10：本地服务入口与 Profile 验证
状态：complete
Status: complete

- 修复 `app.html` 在 `file://` 打开时 API base 错误的问题：本地文件方式会自动请求 `http://127.0.0.1:8791`。
- 重启 8791 端口旧服务进程，确保当前后端代码中的 `/api/profile` 路由生效。
- 验证本地入口 `http://127.0.0.1:8791/` 可返回 `app.html`。
- 验证 `GET /api/health`、`GET /api/config`、`GET /api/stories?world=旅行` 正常返回。
- 验证 `GET /api/profile` 行为：未登录返回 401，注册/登录后携带 Bearer token 返回 200 和个人档案统计。


### Phase 11：推广变现与 Claw/Hermes 微信修复
状态：complete
Status: complete

- Claw/Hermes：Hermes Agent 从 `0.13.0` 升级到 `0.16.0`。
- Claw/Hermes：清理 stale Git lock 后完成 `hermes update`，并重启 gateway。
- Claw/Hermes：launchd 服务定义已刷新，gateway 状态为 `running`，`weixin` 平台为 `connected`。
- Claw/Hermes：日志显示手机微信 DM 已有入站记录；`api_server` 因缺 `API_SERVER_KEY` 处于 retrying，不影响微信 DM。
- Pitfall：首页 `index.html` 新增 `#monetization` 推广变现区，包含免费查风险、深度报告、投稿悬赏、回应与整改认证。
- Pitfall：移动端 `worlds-mobile.html` 新增首屏增长入口，强化“查一个对象 / 投稿拿奖励”。
- Pitfall：新增 `marketing-launch-kit.md`，包含小红书模板、公众号选题、微信群冷启动话术、SEO 长尾词、定价和 7 天执行节奏。
- 验证：使用 Python HTMLParser 解析 `index.html` 与 `worlds-mobile.html`；检查关键 CTA/文案/hook；三个文件存在且非空。
