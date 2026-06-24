# RateLens 项目状态

更新时间：2026-06-24

## 当前结论

RateLens 已从纯产品规划推进到可浏览的 uni-app 首版交互原型阶段。当前仓库包含 `RateLens-Uniapp/` 项目、v2 App 图标资产、单页 UI 原型、静态 H5 预览页和本地预览服务。

当前实现仍是原型，但核心换算、金额格式化和旅行账单计算已从页面内联逻辑抽离到 `core/`，并补充了可运行的 Node 单元测试。设置页已新增隐私政策和免责声明详情入口。界面文案已建立 `en-US` / `zh-CN` 双语资源，并支持原型内切换。汇率数据仍使用本地 mock 数据；尚未接入真实汇率 API、持久化缓存、语言设置持久化或真机 App 构建链。

## 已确认事实

- 产品方向：跨平台汇率换算、旅行消费计算、多币种盯盘、离线缓存。
- 技术方向：README 明确倾向 uni-app、Vue 3、Vite，并强调 `Intl.NumberFormat` 与本地缓存。
- 设计方向：Gallerist Minimalism，低饱和背景、克制品牌色、轻量卡片与定制数字输入体验。
- 隐私方向：金额计算、本地缓存、账单拆分应尽量在本机完成，不索取无关权限。
- App 图标决策：当前采用 `output/imagegen/ratelens-v2/ratelens-app-icon-v2.png`，已复制为 `RateLens-Uniapp/static/ratelens-app-icon.png` 和 `RateLens-Uniapp/static/logo.png`。
- UI 原型入口：`RateLens-Uniapp/pages/index/index.vue` 是 uni-app 页面源码；`RateLens-Uniapp/preview/index.html` 是当前右侧浏览器使用的静态可点击预览。
- 本地预览服务：`node preview-server.cjs` 可启动 `http://127.0.0.1:5173/`；当前冷门高端口实例使用 `http://127.0.0.1:48789/preview/index.html`。
- 核心模块入口：`RateLens-Uniapp/core/currency.js`、`RateLens-Uniapp/core/format.js`、`RateLens-Uniapp/core/travel.js`。

## 已实现到原型级

- uni-app Vue 3 模板项目已创建在 `RateLens-Uniapp/`。
- 首页、旅行计算器、设置三个主视图已在单页内通过底部导航切换。
- 金额输入、快捷金额、源货币切换、目标货币切换、交换源/目标、刷新时间、在线/离线状态切换已有前端交互。
- 首页已从多币种长列表收敛为单笔 `源货币 -> 目标货币` 换算，避免新增币种后首屏混乱。
- 当前 mock 汇率表支持 16 个币种：`USD/EUR/JPY/CNY/GBP/HKD/AUD/CAD/SGD/CHF/KRW/THB/MYR/TWD/INR/AED`；More 中的关注币种用于常用候选管理，不再驱动首页铺满列表。
- More 设置页的本币、关注币种和语言已从点击循环切换改为明确选择界面；本币为单选，关注币种为多选，语言为单选。
- 旅行计算器支持税率步进、小费比例选择、分摊人数步进，并联动计算外币总额、人均金额和 CNY 估算。
- 静态预览页已去除外层手机壳留白和虚假系统状态栏，直接按 App 页面铺满视口。
- 已实现以 `USD` 为基准的汇率矩阵转换、`Intl.NumberFormat` 金额格式化和税后小费分摊计算。
- 已建立 `RateLens-Uniapp/i18n/index.js`，覆盖 Convert、Travel、More、隐私政策和免责声明的英文与简体中文文案。
- More 设置页已支持语言选择；切换后底部导航、设置项、币种名称、旅行计算标签和合规详情会同步更新。
- More 设置页已新增 Privacy Policy 与 Disclaimer 入口，点击后在原型内展示本地优先、缓存、权限、汇率估算和非金融建议说明。
- 顶部左侧按钮已具备上下文返回逻辑，避免非首页和合规详情页缺少返回路径。
- 新增 `npm.cmd run test:core`，覆盖汇率换算、缺失汇率、输入解析、金额格式化和旅行账单计算。

## 尚未实现

- 真实汇率 API 获取、缓存、过期与离线回退。
- 设置项持久化、关注币种排序和默认币种恢复。
- 拆分后的正式页面路由、组件目录、服务模块和 store。
- 语言设置持久化、跟随系统语言、更多语言扩展和缺键审计脚本。
- Android/iOS 真机验证。
- 端到端自动化测试、缓存测试和真实服务测试。

## 当前验证结果

- `npm.cmd install --cache .\.npm-cache` 已完成，并生成 `package-lock.json` 与 `node_modules/`。
- `node preview-server.cjs` 已可启动静态预览服务。
- `Invoke-WebRequest http://127.0.0.1:5173/` 返回 `200`。
- `PORT=48789 node preview-server.cjs` 已启动当前线程高端口实例，右侧浏览器可打开 `http://127.0.0.1:48789/preview/index.html`。
- `npm.cmd run test:core` 已覆盖核心算法、旅行计算和静态预览 smoke。
- `npm.cmd run build:h5` 在当前环境已构建通过。

## 主要风险

- 功能范围过大：AI 拍照识别、AR 覆盖、桌面小组件、订阅体系不适合作为首个切片。
- 汇率数据源不确定：需要明确 API 成本、刷新频率、离线可用承诺和失败策略。
- 跨平台能力差异：小组件、相机 OCR、触感反馈在 H5、Android、iOS 上能力不同。
- 长文本和数字格式风险：多语言界面必须尽早引入布局审计，而不是上线前补救。
- 当前原型仍是单页 UI，后续需要继续拆分 service/store/component，否则继续叠加功能会难以维护。
- 当前 App 端权限模板仍带有默认权限项，真机打包前需要按实际功能清理。

## 建议优先决策

1. 首发验证平台：先在 H5 完成核心链路，再做 Android 真机包。
2. 默认首页关注币种是否维持 `USD/EUR/JPY/CNY/GBP/HKD`，还是按地区/系统语言动态推荐。
3. 汇率数据源：免费 API、付费 API、还是后端代理。
4. 是否首版只做本地隐私计算，不接账号系统。
5. 商业化首版是否仅预留入口，不接真实支付。

## 下一次开发入口

从 `docs/ROADMAP.md` 的 Phase 2 开始，先建立 `services/rates/mockAdapter`、缓存接口和离线回退测试，再推进设置持久化与真机验证链。
