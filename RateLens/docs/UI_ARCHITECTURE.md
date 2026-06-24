# RateLens UI 架构与预览说明

更新时间：2026-06-24

## 当前目标

本文档记录 RateLens 当前首版 UI 原型的真实状态。它用于衔接 imageGen 设计素材、uni-app 页面实现、本地预览和后续真机测试。

## 视觉资产决策

当前采用 v2 图标作为主 App 图标。

| 资产 | 路径 | 用途 |
| --- | --- | --- |
| v2 图标源文件 | `output/imagegen/ratelens-v2/ratelens-app-icon-v2.png` | 当前选定图标 |
| App 静态图标 | `RateLens-Uniapp/static/ratelens-app-icon.png` | 页面品牌图标 |
| 默认 logo | `RateLens-Uniapp/static/logo.png` | uni-app 默认 logo 替换 |

v3 图标与页面素材仍保留在 `output/imagegen/ratelens-v3/`，但当前不作为主图标。

## 页面结构

当前 UI 采用单页原型承载三个主视图：

| 视图 | 入口 | 当前能力 |
| --- | --- | --- |
| Convert | 底部 `Convert` | 金额输入、快捷金额、源货币选择、目标货币选择、单笔换算结果 |
| Travel | 底部 `Travel` | 账单金额、税率、小费、分摊人数和本币估算 |
| More | 底部 `More` | 本币、关注币种、语言、离线状态、隐私政策和免责声明 |

实现文件：

- uni-app 页面：`RateLens-Uniapp/pages/index/index.vue`
- 核心计算模块：`RateLens-Uniapp/core/`
- 静态预览页：`RateLens-Uniapp/preview/index.html`

## 交互范围

当前交互已覆盖：

- 输入金额后实时刷新单个目标货币换算结果。
- 点击快捷金额更新输入值。
- 点击源货币胶囊打开货币下拉栏，可直接选择输入币种。
- 点击目标货币行打开目标货币下拉栏，可直接选择转换后的币种。
- 点击中间交换按钮可互换源货币和目标货币。
- Travel 账单币种也支持下拉栏直接选择，并联动外币总额、本币估算和币种格式。
- More 设置页点击本币会进入单选货币列表，选择后首页源货币立即联动。
- More 设置页点击关注币种会进入多选列表，作为常用候选管理保留。
- 货币选择列表当前覆盖 16 个 mock 币种，首页只展示当前源/目标两种货币，避免首屏列表过长。
- More 设置页点击语言会进入语言单选列表，避免用户只能循环切换。
- 点击刷新按钮更新汇率时间并切回在线状态。
- 点击 Live/Offline 切换离线显示状态。
- 旅行计算器支持税率、小费比例和分摊人数调整。
- 设置页的 Offline Rates 行可切换在线/离线状态。
- 设置页的 Language 行可在 English 与简体中文之间切换，Convert、Travel、More、币种名称和合规详情同步刷新。
- 设置页的 Privacy Policy 与 Disclaimer 行可进入详情界面，并支持返回设置列表。
- 顶部左侧按钮已改为上下文返回：首页为设置入口，Travel/More 返回 Convert，Legal 详情返回 More 设置列表。
- uni-app 页面和静态预览页的旅行计算已按“税后小计再计算小费”的顺序更新。
- 右侧浏览器已验证首页、Travel、More、离线切换和 390px 移动视口，无横向溢出。
- JPY 金额展示已改用币种格式化，不再显示无意义小数。

当前交互未覆盖：

- 关注币种排序、默认恢复，以及让候选列表按用户关注优先排序。
- 设置项持久化。
- 真实汇率刷新、失败回退和首次无缓存空状态。
- 语言设置持久化、跟随系统语言和更多语种扩展。

## 布局原则

- App 页面不绘制虚假系统状态栏，不显示模拟时间、电池、信号。
- 页面直接铺满 App/webview 视口，不使用外层手机壳或固定窄屏容器。
- 桌面浏览器预览也按全宽页面渲染，用于发现真实 H5 自适应问题。
- 底部导航保留 `safe-area-inset-bottom` 适配。
- uni-app 页面使用 `var(--status-bar-height, 0px)` 只作为真实设备安全区补偿，不绘制状态栏内容。

## 本地预览

在 `RateLens-Uniapp/` 下运行：

```powershell
node .\preview-server.cjs
```

打开：

```text
http://127.0.0.1:5173/
```

若 5173 已被旧实例占用，可用冷门高端口启动本线程实例：

```powershell
$env:PORT='48789'; node .\preview-server.cjs
```

打开：

```text
http://127.0.0.1:48789/preview/index.html
```

当前已验证：

- `http://127.0.0.1:5173/` 和当前本线程 `http://127.0.0.1:48789/preview/index.html` 返回 HTTP 200。
- 静态预览页不包含 `.phone` 外壳容器。
- 静态预览页不包含虚假 `.status` 或 `.status-bar` 状态栏。

## 构建状态

已安装依赖：

```powershell
npm.cmd install --cache .\.npm-cache
```

当前环境中执行 H5 构建：

```powershell
npm.cmd run build:h5
```

结果：构建通过。

## 下一步

1. 建立 `services/rates/mockAdapter` 与缓存接口。
2. 将三个视图拆成组件或独立页面，减少单文件继续膨胀。
3. 继续补真实页面拆分后的交互 smoke；当前已有右侧浏览器点击检查、移动视口检查和静态预览 smoke。
4. 清理 `manifest.json` 默认权限后再进入 Android 真机包测试。
