# Pitfall Native App

这是 Pitfall / 小众点评网的 Expo React Native 原生 App 工程。

路径：

`/Users/suntata/Desktop/pitfall/native-app`

它不是 `worlds-mobile.html` 那种网页原型，而是一个可用 Expo Go 运行、后续可用 EAS 打包的移动端工程。

## 已实现

- Expo React Native + TypeScript 工程结构
- Pitfall Worlds 首屏主入口
- 六个生活世界：校园、旅行、职场、租住、跨境、美业
- 世界切换后更新：世界说明、Feed、详情语境
- 原生 Feed 卡片
- 原生 Modal 对象详情
- 原生 Modal Story 投递
- 底部 App 导航：世界、路径、投递、房间、我的
- 自有 SVG 图标组件：`src/icons.tsx`
- 内容数据结构：`src/data.ts`
- 工程验证脚本：`npm run validate`

## 本地运行

安装依赖：

```bash
npm install
```

启动 Expo：

```bash
npm run start
```

或者直接在手机上预览：

```bash
npx expo start --host lan
```

然后用 Expo Go 扫码打开。

## 验证

```bash
npm run validate
npm run typecheck
```

## 打包

预览包：

```bash
npx eas build --profile preview --platform ios
npx eas build --profile preview --platform android
```

生产包：

```bash
npx eas build --profile production --platform ios
npx eas build --profile production --platform android
```

## 还不是生产上线版的原因

当前是前端 App scaffold + 高保真交互原型。要真正上线，还需要：

- 用户登录 / 账号系统
- 后端数据库
- 媒体上传和 OCR 服务
- 翻译 API
- 审核 / 举报 / 材料分级后台
- 对象回应与整改后台
- App Store / Google Play 账号与签名配置
