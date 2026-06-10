# Pitfall / 小众点评网

项目路径：`/Users/suntata/Desktop/pitfall`

英文名：Pitfall
中文名：小众点评网

## 当前文件

- `app.html`：全栈交互页，连接真实 API、注册登录、Supabase Postgres 数据库、Story 投递、材料链、评论、对象回应、替代路线和轻反应。
- `src/app.js`：Fastify API 路由与鉴权。
- `src/db.js`：Supabase Postgres 数据模型、迁移、种子数据、用户/Story/互动持久化。
- `src/server.js`：本地全栈服务入口。
- `tests/api.test.js`：注册、登录、数据库写入、Story 与互动 API 测试。
- `index.html`：单文件高保真产品概念页，内含 CSS、SVG 图标系统与 JS 交互。
- `worlds-mobile.html`：mobile-first Pitfall Worlds App 原型，把六个生活世界作为真实主入口，包含世界切换、滑卡 Feed、对象详情、材料链和 Story 投递。
- `task_plan.md`：planning-with-files 项目规划。
- `findings.md`：产品发现与设计决策记录。
- `progress.md`：进度与验证记录。

## 这版升级重点

### 1. 世界切换入口

首页新增 Pitfall Worlds；同时新增 `worlds-mobile.html`，把 Worlds 从官网模块升级为真实移动端主入口：

- 校园
- 旅行
- 职场
- 租住
- 跨境
- 美业

用户不再从抽象分类进入，而是从真实生活场景进入。移动端原型中，点击世界会切换当前世界说明、Feed 卡片、对象详情语境和投递上下文。

### 2. Pitfall 自有 UI 符号系统

页面内置一套 SVG symbol 图标，不再依赖散装 emoji：

- 品牌护盾：Pitfall 主标识
- 路径雷达：识别风险和路径
- 材料页：原始材料 / 证据
- 世界切换：多语言、多地区、多场景
- 语音投递：低门槛发布
- 隐私打码：安全边界
- 替代路线：更好选择
- 讨论房间：争议沉淀

### 3. 文案去低级化

降低“避坑”这类过于直白、低级和负面的话术，改为更有品牌感的表达：

- 暗门
- 路径
- 原文
- 材料
- 替代路线
- 清醒选择
- 生活地图
- 真实经验，刷出路

Pitfall 的气质从“吐槽平台”调整为“年轻人的生活导航”。

### 4. 年轻人的交互习惯

保留并强化移动端互动：

- 拇指翻页
- Story 投递
- 轻反应
- 照片 / OCR
- 语音转文字
- 原文对照
- 滑卡 Feed
- 底部快速投递

### 5. 信任与治理

产品仍然保留核心底线：

- 强指控必须有材料
- 投递前提示隐私打码
- 对象有回应与整改入口
- 机器翻译必须保留原文
- 轻反应不等于事实，风险分数必须回到材料链


## 全栈版本地运行

安装依赖并配置 `.env` 后运行：

```bash
cd /Users/suntata/Desktop/pitfall
npm install
cp .env.example .env
# 修改 .env 为 Supabase Postgres 连接信息
npm run dev
```

打开：

```bash
open http://127.0.0.1:8791/
```

API 健康检查：

```bash
curl http://127.0.0.1:8791/api/health
```

测试：

```bash
npm test
```

当前已实现：

- 注册 / 登录 / Token 鉴权
- `users` / `sessions` / `stories` / `materials` / `comments` / `responses` / `alternatives` / `reactions` Postgres 表
- 六个世界 Feed：校园、旅行、职场、租住、跨境、美业
- Story 投递并写入数据库
- 材料链：收据、合同、翻译、截图等
- 对象详情：原文、译文、材料、讨论房间、对象回应、替代路线
- 轻反应：有用 / 同感 / 收藏

## Supabase Postgres 配置

后端读取 `.env` 或部署环境变量：

```bash
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:replace-me@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.xxxxxxxxxxxxxxxxxxxx
DB_PASSWORD=replace-me
```

推荐使用 Supabase pooler host（端口 `6543`），避免 direct host 在本地网络无法解析。

`.env` 已加入 `.gitignore`，不要把真实数据库密码提交到仓库。

## Vercel 部署

Vercel 不读取本机 `.env`，需要在项目后台 `Project Settings` → `Environment Variables` 配置：

```bash
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:replace-me@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
DB_SSL=true
```

线上 `/api/*` 由 `api/[...path].js` 接入 Fastify 后端，并复用 `src/app.js` / `src/db.js` 连接 Supabase。静态入口继续由 `vercel.json` 发布：`/`、`/pc`、`/m`、`/mobile`。

## 静态原型本地打开

终端运行：

```bash
open /Users/suntata/Desktop/pitfall/index.html
open /Users/suntata/Desktop/pitfall/worlds-mobile.html
```

或直接双击：

`/Users/suntata/Desktop/pitfall/index.html`

移动端 Worlds App 原型：

`/Users/suntata/Desktop/pitfall/worlds-mobile.html`

## 下一步建议

1. 把 `index.html` 拆成真实移动端前端项目：Expo / React Native 或 Next.js。
2. 将 Pitfall 图标系统抽成独立 `icons.tsx` / SVG asset set。
3. 做真实 World 路由：Campus、Travel、Work、Home、Cross-border、Beauty。
4. 做真实发布流：语音、图片 OCR、链接留档、隐私打码、多语翻译草稿。
5. 做对象详情页：风险、材料、原文/译文、回应、替代路线、讨论房间。
