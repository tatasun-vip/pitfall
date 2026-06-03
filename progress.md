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
