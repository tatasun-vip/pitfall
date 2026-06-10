# Pitfall / 小众点评进度记录

## 2026-06-02

### 已完成

- 创建 /Users/suntata/Desktop/pitfall/index.html。
- 创建 /Users/suntata/Desktop/pitfall/README.md。
- 补齐 planning-with-files 所需文件：task_plan.md、findings.md、progress.md。
- 使用马斯克视角完成首版产品收敛：核心定位为“证据优先的全球避坑与更好替代社区”。
- 完成本地验证：
  - 文件存在。
  - Python HTMLParser 可解析。
  - 关键文案、DOM、按钮、发布面板、toast 存在。
  - 浏览器 file:// 打开成功。
  - 发布经历按钮点击后 publishPanel aria-hidden 从 true 变为 false，open class 生效。

### 本轮升级

- 明确英文名：Pitfall。
- 明确中文名：小众点评网。
- 按 elon-musk-skill 视角继续打磨：先删掉泛社交和情绪差评墙，只保留风险、证据、翻译、回应、替代这些决策核心。
- 增加平台自发布的匿名化热门避坑案例：
  - 留学“保录取”与退款周期
  - 旅行网红店账单与隐藏收费
  - 第一份工作培训贷
  - 跨境网购低价预售
  - 租房押金与退租清单
  - 医美体验与术前告知
- 增加“可讨论问题”，让案例从单向差评变成争议沉淀。
- 增加多国语言实时翻译模块：原文 + 译文并列、评论/证据/菜单/合同/对象回应翻译、机器译文社区纠错。
- 更新 README.md、task_plan.md、findings.md。

### 本轮验证证据

- index.html 存在，大小 33934 bytes。
- README.md 存在，大小 1885 bytes。
- task_plan.md 存在，大小 3741 bytes。
- findings.md 存在，大小 2109 bytes。
- progress.md 存在，大小 1758 bytes。
- Python HTMLParser 解析通过。
- 关键检查均为 true：title_pitfall_cn、brand_pitfall、brand_cn、cases_section、translate_section、realtime_translation、multilang、publish_panel、toast、six_cases、switch_translate、js_scroll_translate。
- case_count = 6。
- button_count_literal = 13。
- 浏览器 file:// 打开成功，页面标题：Pitfall｜小众点评网。
- 浏览器 DOM 检查：
  - H1：全球年轻人的避坑雷达。
  - caseCount：6。
  - hasTranslate：true。
  - langOptions：English、中文、日本語、Italiano、Español、Français。
  - publishHidden 初始为 true。
- 点击“发布经历”后：
  - publishPanel open = true。
  - aria-hidden = false。
  - selectExists = true。
  - activeSwitch = 避坑。
- 关闭面板后手动滚动到 translate section：translateTop = 0，visible = true。

### 注意

- tidy 旧版本可能误报 HTML5 语义标签和中文编码问题；本轮以 Python HTMLParser + 现代浏览器 DOM/交互验证为准。

### 本轮品牌与交互深度打磨

- 按用户反馈新增 Pitfall Worlds 世界切换按钮：校园、旅行、职场、租住、跨境、美业。
- 新增 Pitfall 自有 SVG symbol 图标体系：品牌护盾、路径雷达、材料页、世界切换、语音投递、隐私打码、替代路线、讨论房间等。
- 文案去低级化：页面正文中已删除“避坑”字样，改为暗门、路径、原文、材料、替代路线、清醒选择、生活地图等品牌语言。
- 将发布改为“投递 Story”，减少投诉箱/差评墙气质。
- 更新 README.md、task_plan.md、findings.md 记录本轮设计方向。

### 本轮验证证据

- index.html 存在，大小 38337 bytes。
- Python HTMLParser 解析通过。
- 关键检查均为 true：world_switch、world_note、brand_system、svg_symbols、publish_panel、toast、no_avoid_word、no_mode_emoji、new_copy、world_js。
- avoid_count = 0。
- world_btn_count = 6（浏览器 DOM）。
- symbol_count = 14（浏览器 DOM）。
- 浏览器 file:// 打开成功，页面标题：Pitfall｜小众点评网。
- 浏览器 H1：在六个世界里，提前看见暗门。
- 点击旅行世界后：activeWorld = 旅行，worldNote = 旅行世界：菜单、账单、交通、住宿，先看原文再付款。
- 点击“30 秒投递一段经历”后：publishPanel open = true，aria-hidden = false。
- 浏览器 DOM 检查：bodyTextHasAvoid = false。

### 本轮移动端 Worlds 主入口升级

- 新增 /Users/suntata/Desktop/pitfall/worlds-mobile.html。
- 将 Pitfall Worlds 从官网里的一个模块升级成 App 首屏主入口。
- 六个世界：校园、旅行、职场、租住、跨境、美业。
- 每个世界切换后同步更新：世界说明、Feed 标题、两张现场卡、对象详情材料链语境。
- 对象详情包含风险摘要、材料链、原文/译文、回应与替代路线。
- Story 投递包含语音、照片、文字、链接四个入口，以及所属世界、材料类型选择。
- 底部导航预留世界、路径、投递、房间、我的五个真实 App 模块。
- README.md、task_plan.md、findings.md 已更新记录该方向。


### 2026-06-05 全栈注册、数据库与交互制作

- 新增 `package.json` 并安装 Fastify、SQLite、Zod、CORS、static 服务依赖。
- 按 TDD 写入 `tests/api.test.js`，先验证缺少 `src/app.js` 时测试失败。
- 新增 `src/db.js`：SQLite 迁移、用户、会话、Story、材料链、评论、回应、替代路线、轻反应。
- 新增 `src/app.js`：注册、登录、`/api/me`、`/api/stories`、详情、评论、回应、替代、反应 API。
- 新增 `src/server.js`：本地服务入口，端口 8791。
- 新增 `app.html`：全栈交互页，真实调用 API 并写入数据库。
- 恢复 `worlds-mobile.html` / `mobile.html` 静态移动端原型别名，避免现有路由断开。
- `npm test` 结果：4 项通过。
- 本地服务健康检查：`/api/health` 返回 200，`database: true`。
- 手动 API 全链路验证：注册用户、发布 Story、添加评论、对象回应、替代路线、有用反应，均写入 `data/pitfall.sqlite`。


### 2026-06-05 Phase 7 启动：搜索、个人档案与治理闭环

- 已按 planning-with-files 要求恢复上下文，读取 `task_plan.md`、`findings.md`、`progress.md`。
- Phase 6 全栈注册、数据库与真实交互已记录为 complete。
- 新增 Phase 7，目标是补齐搜索筛选、个人信用档案、举报/治理闭环。
- 下一步按 TDD 写失败测试，再实现数据库和 API。


### 2026-06-05 Phase 7 完成
- 后端新增 search/profile/reports。
- 前端新增搜索、个人档案、举报治理。
- 全量测试 7/7 通过。
- 本地服务已启动在 8791。


### 2026-06-05 Phase 8 完成
- Pitfall 新增治理审核队列和举报状态更新闭环。
- 后端新增 `listReports`、`updateReportStatus`。
- API 新增 `GET /api/moderation/reports`、`PATCH /api/moderation/reports/:id`。
- 全量测试 8/8 通过。
- 同步写入两本小说新章节到各自上传分享文件夹。


### 2026-06-05 小说续写同步完成
- 用户要求继续写小说，本轮未继续改 Pitfall 功能，仅按上下文提示读取 `findings.md` 并记录进度。
- 《重回涨停时》新增第42章，已写入上传分享文件夹。
- 《我在罗马当天团宠》新增第44章，已写入上传分享文件夹。
- 两本 `上传章节索引.md` 已刷新。
- 验证结果：重回涨停时 1-42 无缺章；我在罗马当天团宠 1-44 无缺章。


### 2026-06-10 Phase 9 开始
- 用户提供 Supabase Postgres 主机、端口、库名、用户名和密码，要求把 Pitfall 数据库改为 Supabase。
- 安全决策：数据库密码仅写入本地 `.env`，`.gitignore` 必须忽略 `.env`，不把明文凭据提交到仓库。
- 技术方向：从 `better-sqlite3` 同步 API 迁移到 `pg` 异步连接池，保留现有 HTTP API 行为。


### 2026-06-10 Phase 9 迁移结果
- `src/db.js` 从 `better-sqlite3` 迁移到 `pg`，schema 使用 Postgres `BIGSERIAL`、`TIMESTAMPTZ`、`ON CONFLICT DO NOTHING`、`ILIKE`。
- `src/app.js` 全部数据库调用改为 async/await，并把唯一键冲突处理改为 Postgres `23505`。
- `src/server.js` 加载 `dotenv/config`，使用 Supabase/Postgres 环境变量创建连接池，并在关闭时释放连接。
- `tests/api.test.js` 改为临时 Postgres schema 隔离测试数据；测试不自动 seed，避免影响断言和远端数据。
- `.env` 已写入本机真实 Supabase 参数，`.env.example` 提供占位模板，`.gitignore` 已忽略 `.env`。
- 验证：`node --check src/db.js src/app.js src/server.js tests/api.test.js` 通过。
- 阻塞：`npm test` 连接阶段失败，错误为 `getaddrinfo ENOTFOUND db.xgrmcwcgkbektyxrhbhu.supabase.co`；`dig @8.8.8.8` 与 `dig @1.1.1.1` 均无解析结果。


### 2026-06-10 Phase 9 DATABASE_URL 重试
- 用户提供完整连接串 `postgresql://postgres:***@db.xgrmcwcgkbektyxrhbhu.supabase.co:5432/postgres`。
- 已将本地 `.env` 更新为 `DATABASE_URL` 优先，同时保留拆分形式的 `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD`。
- 连接串解析验证通过：protocol=`postgresql:`，host=`db.xgrmcwcgkbektyxrhbhu.supabase.co`，port=`5432`，database=`postgres`，user=`postgres`。
- DNS 验证仍失败：`nslookup db.xgrmcwcgkbektyxrhbhu.supabase.co` 返回 `No answer`；`pg.Client` 直连仍报 `getaddrinfo ENOTFOUND db.xgrmcwcgkbektyxrhbhu.supabase.co`。
- 结论：本轮不是代码或连接串格式问题，而是该 Supabase host 当前无法解析；需要从 Supabase 后台复制可解析的 Direct connection / Session pooler / Transaction pooler host 后再继续验证。


### 2026-06-10 Phase 9 Supabase Pooler 验证完成
- 用户提供 Supabase pooler 连接信息：host=`aws-1-ap-southeast-1.pooler.supabase.com`，port=`6543`，database=`postgres`，user=`postgres.xgrmcwcgkbektyxrhbhu`，密码沿用。
- 已将本地 `.env` 更新为 pooler `DATABASE_URL` 优先，并同步 `.env.example` 为 pooler 模板；真实密码仍只在 `.env`，且 `.env` 被 `.gitignore` 忽略。
- DNS 验证通过：pooler host 解析到 AWS ELB CNAME，并返回 `54.179.210.0` / `13.213.241.248`。
- `pg.Client` 直连验证通过：返回 current_database=`postgres`，current_user=`postgres`。
- 全量测试通过：`npm test` 8/8 pass，覆盖注册、登录、Story、搜索、Profile、Reports、审核队列、互动持久化。
- Phase 9 状态更新为 complete。


### 2026-06-10 Navicat 表定位与 public 迁移
- 用户反馈 Navicat 已连接 Supabase Postgres，但找不到项目表。
- 诊断结果：当前连接 database=`postgres`，默认 schema=`public`；迁移前 `public` 下没有 Pitfall 项目表，只有 Supabase 自带的 `auth` / `storage` / `realtime` / `vault` 等 schema 表。
- 原因：此前 `npm test` 使用临时 `test_*` schema 做隔离测试，测试结束后会清理，所以 Navicat 不会看到这些测试表。
- 已运行正式 `createDatabase()` 迁移/seed，在 `postgres.public` 下创建项目表：`users`、`sessions`、`stories`、`materials`、`comments`、`responses`、`alternatives`、`reactions`、`reports`。
- 验证结果：`public.users=1`、`public.stories=6`、`public.materials=6`，其余互动表当前为 0 行。
- Navicat 查看路径：连接 Supabase 后展开 database `postgres` → schema `public` → `Tables`。


### 2026-06-10 本地服务与 Profile 接口修复
- 用户反馈 `http://127.0.0.1:8791/api/profile` 找不到。
- 复现结果：旧运行进程返回 `404 Route GET:/api/profile not found`，但当前 `src/app.js` 已定义 `GET /api/profile`，根因是 8791 上仍运行旧 Node 进程。
- 已终止旧进程并用 `npm run dev` 重启本地服务，服务监听 `http://127.0.0.1:8791`。
- 验证结果：`GET /api/health` 返回 200；未登录访问 `GET /api/profile` 正常返回 401；注册后携带 Bearer token 访问 `GET /api/profile` 返回 200 和用户档案统计。
- 已修复 `app.html` 在 `file://` 方式打开时的 API base：当 `location.protocol === 'file:'` 时自动请求 `http://127.0.0.1:8791/api/...`，避免浏览器把 `/api/...` 解析到本地文件根路径。
- 额外验证：`GET /api/config` 返回 Pitfall / 小众点评网与 6 个 worlds；`GET /api/stories?world=旅行` 返回 200；`GET /` 返回 `app.html`。
- 正确入口：浏览器打开 `http://127.0.0.1:8791/`；`/api/profile` 是鉴权接口，不应裸开查看。


### 2026-06-10 Vercel 环境变量说明
- 用户询问：提交代码后 Vercel 自动部署，但本地 `.env` 不提交，线上如何访问 Supabase 数据库。
- 结论：`.env` 不应该提交到 Git；Vercel 线上数据库凭据应配置在 Vercel Project Settings → Environment Variables。
- 当前代码读取方式：`src/db.js` 优先读取 `DATABASE_URL`，并通过 `DB_SSL=true` 开启 SSL；也支持 `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` 拆分配置。
- 建议 Vercel 至少配置：`DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`，`DB_SSL=true`。
- 重要发现：当前 `vercel.json` 仍是静态站路由配置，只发布 `index.html` / `worlds-mobile.html` 等静态页面；若要线上 `/api/...` 访问 Supabase，还需要把 Fastify 后端适配为 Vercel Serverless Function 或改用单独后端服务。
- 安全要求：真实 Supabase 密码只放本机 `.env` 和 Vercel 加密环境变量，不写入 README、`vercel.json`、提交记录或前端 JS。


### 2026-06-10 Vercel API 部署入口补齐
- 用户已在 Vercel 后台添加 Supabase 环境变量，并要求提交代码触发自动部署。
- 提交前检查：`.env` 被 `.gitignore` 忽略，`git status --ignored .env .env.example` 显示 `.env` 为 ignored、`.env.example` 为可提交占位模板。
- 新增 `api/[...path].js`：作为 Vercel Serverless Function 入口，复用 `buildApp()` 和 `createDatabase()`，由运行时环境变量连接 Supabase。
- 更新 `vercel.json`：将 `/api/(.*)` rewrite 到 `/api/[...path].js`，保留 `/pc`、`/m`、`/mobile` 静态页面入口。
- 更新 `README.md`：记录 Vercel Environment Variables 配置方式与线上 `/api/*` 入口。
- 提交前验证计划：运行 `node --check`、`npm test`，并再次扫描待提交 diff，确认没有真实数据库密码。
