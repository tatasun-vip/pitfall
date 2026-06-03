# Pitfall / 小众点评网

项目路径：`/Users/suntata/Desktop/pitfall`

英文名：Pitfall
中文名：小众点评网

## 当前文件

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

## 本地打开

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
