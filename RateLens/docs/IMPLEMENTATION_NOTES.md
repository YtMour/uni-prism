# RateLens 实施记录

更新时间：2026-06-24

## 本轮完成内容

- 创建并完善 `RateLens-Uniapp/` uni-app Vue 3 项目配置。
- 采用 v2 imageGen 图标作为当前主 App 图标。
- 将默认 uni-app 首页替换为 RateLens 首版单页交互原型。
- 新增 `preview/index.html`，用于右侧浏览器快速查看 UI 效果。
- 新增 `preview-server.cjs`，用于不依赖 Vite 的本地静态预览。
- 删除预览页里的外层手机壳容器、左右大留白和虚假系统状态栏。
- 补充金额输入、快捷金额、基准币切换、底部导航、旅行计算器和离线状态切换等点击交互。
- 新增 `core/currency.js`、`core/format.js`、`core/travel.js`，将汇率矩阵、输入解析、金额格式化和旅行账单计算从页面中抽离。
- 新增 `tests/core.test.mjs`、`tests/preview-smoke.test.mjs` 与 `npm.cmd run test:core`，覆盖核心换算、缺失汇率、输入解析、格式化、旅行账单和静态预览结构。
- 修正旅行计算器顺序：先计算税后小计，再以税后小计为基数计算小费，和 `FEATURE_DESIGN.md` 保持一致。

## 当前关键文件

| 文件 | 说明 |
| --- | --- |
| `RateLens-Uniapp/pages/index/index.vue` | uni-app 首版页面源码 |
| `RateLens-Uniapp/core/` | 核心换算、格式化和旅行计算纯函数 |
| `RateLens-Uniapp/tests/core.test.mjs` | 核心算法单元测试 |
| `RateLens-Uniapp/preview/index.html` | 当前本地浏览器预览页 |
| `RateLens-Uniapp/preview-server.cjs` | 静态预览服务 |
| `RateLens-Uniapp/static/ratelens-app-icon.png` | 当前选定 v2 App 图标 |
| `docs/UI_ARCHITECTURE.md` | UI 原型和预览说明 |
| `docs/PROJECT_STATUS.md` | 当前项目事实源 |

## 已验证

```powershell
npm.cmd install --cache .\.npm-cache
npm.cmd run test:core
npm.cmd run build:h5
node .\preview-server.cjs
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5173/
```

结果：

- 依赖安装完成。
- 核心单元测试与静态预览 smoke 通过。
- H5 构建通过。
- 静态预览服务可启动。
- `http://127.0.0.1:5173/` 返回 HTTP 200。
- 预览页返回内容包含 `.screen`，不包含 `.phone` 容器和虚假 `.status` / `.status-bar` 状态栏。

## 未验证或阻塞

- 尚未进行 Android/iOS 真机测试。
- 尚未接入真实汇率 API。
- 尚未实现持久化缓存、设置保存和多语言资源。
- 尚未实现 services/rates mock adapter、缓存读写和离线回退测试。

## 下一步建议

1. 建立 `services/rates/mockAdapter` 与缓存接口。
2. 补缓存读取、过期、刷新失败回退和首次无缓存测试。
3. 将三个视图拆成组件或正式页面，减少 `index.vue` 继续膨胀。
4. 清理 `manifest.json` 默认权限后进入 Android 真机包测试。
