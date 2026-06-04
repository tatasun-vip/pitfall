# Pitfall Vercel 发布说明

当前静态页面：

- PC 端首页：`index.html`
- 手机端页面：`worlds-mobile.html`

已新增 `vercel.json`，让同一个 Vercel 项目同时发布两个入口：

- `/`：PC 端首页，默认打开 `index.html`
- `/pc`：PC 端首页别名
- `/m`：手机端页面
- `/mobile`：手机端页面
- `/worlds-mobile`：由于 `cleanUrls: true`，也可不带 `.html` 访问

## 发布方式

如果你之前已经把这个目录绑定到了 Vercel，只需要在 `/Users/suntata/Desktop/pitfall` 里提交并推送即可：

```bash
cd /Users/suntata/Desktop/pitfall
git add vercel.json VERCEL_PUBLISH.md
git commit -m "Add Vercel routes for mobile Pitfall page"
git push
```

Vercel 会自动重新部署。

部署完成后，假设你的域名是：

```text
https://你的项目.vercel.app
```

那么访问：

```text
https://你的项目.vercel.app/
https://你的项目.vercel.app/mobile
https://你的项目.vercel.app/m
```

即可同时看到 PC 端和手机端。

## 如果想让手机访问根域名时自动跳到手机端

当前配置没有强制自动跳转，因为很多用户也可能在手机上想看 PC 版。若需要自动识别手机设备跳转，可以再增加一个 `middleware.js` 或在 `index.html` 里加一段设备检测脚本。
