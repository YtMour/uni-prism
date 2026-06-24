# RateLens: Elegant Currency Converter

> 像看风景一样看汇率。RateLens 是一款追求极致高效、视觉通透、支持离线消费计算与多币种联动的跨平台全球汇率盯盘工具。项目基于 uni-app 框架构建，全方位直击海外跨境差旅人士、自媒体创作者、网购爱好者与跨境资产配置群体。

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-black?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/Framework-uni--app%20%7C%20Vue3%20%7C%20Vite-blue?style=for-the-badge)]()
[![Market](https://img.shields.io/badge/Market-Global%20%28App%20Store%20%26%20Google%20Play%29-brightgreen?style=for-the-badge)]()

---

## 当前项目状态

RateLens 当前已进入 uni-app 首版交互原型阶段。仓库内包含 `RateLens-Uniapp/` 项目、v2 App 图标资产、单页 UI 原型和本地静态预览服务。本 README 保留产品愿景与设计方向；当前实现状态应以 `docs/` 下的状态、路线和 UI 架构文档作为事实源。

| 文档 | 用途 |
| --- | --- |
| [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md) | 文档入口与阅读顺序 |
| [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | 当前实现状态、已确认事实、待决策问题 |
| [docs/FEATURE_DESIGN.md](docs/FEATURE_DESIGN.md) | 核心功能、页面结构、交互状态与验收口径 |
| [docs/UI_ARCHITECTURE.md](docs/UI_ARCHITECTURE.md) | 当前 UI 原型、视觉资产、交互范围和本地预览方式 |
| [docs/TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) | 模块边界、数据模型、缓存和验证策略 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | MVP 到后续版本的阶段路线 |
| [docs/PRODUCT_PLAN.md](docs/PRODUCT_PLAN.md) | 目标用户、功能边界、商业化与合规计划 |

## 本地预览

当前可先用静态预览服务查看首版 UI：

```powershell
cd RateLens-Uniapp
node .\preview-server.cjs
```

打开：

```text
http://127.0.0.1:5173/
```

核心算法验证：

```powershell
npm.cmd run test:core
```

H5 构建：

```powershell
npm.cmd run build:h5
```

说明：H5 构建已在 2026-06-24 当前环境通过；后续进入 Android/iOS 前仍需要 HBuilderX 或真机链路复验。

## 建议的 MVP 范围

第一阶段先交付一个可信、离线可用的汇率换算核心，而不是直接推进桌面小组件或 AI 拍照识别。

1. 多币种联动换算：当前原型支持 `USD`、`EUR`、`JPY`、`GBP`、`CNY`、`HKD`、`AUD`、`CAD`、`SGD`、`CHF`、`KRW`、`THB`、`MYR`、`TWD`、`INR`、`AED`。
2. 汇率缓存与离线回退：联网刷新后缓存本地，断网继续用最近一次有效数据。
3. 旅行计算器：税率、小费、AA 分摊与本币总价。
4. 基础设置：本币、关注币种、语言、缓存更新时间。
5. 隐私优先：不上传用户输入金额，不索取无关权限。

---

## 一、视觉理念与 UI/UX 风格规范 (Gallerist Minimalism)

RateLens 摒弃了传统金融理财应用沉重死板的“大盘格子”或充满红绿涨跌的焦虑感，转而追求**当代艺术画廊（Gallerist Minimalism）**的通透感与呼吸感。我们认为，汇率工具不应只有冰冷的数字，而应该像一本高级的独立旅行杂志，让跨境消费与看盘成为一种享受。

### 1. 色调方案 (Color Palette)
* **主背景色（App Canvas Background）：** 温暖的**羊皮纸白 (#FBF9F5)** 或 **清透浅灰 (#F2F2F2)**。这种低饱和度的底色能有效缓解数字金融带来的视觉疲劳，给用户带来柔和、干净的开屏体验。
* **主要交互与文字色（Brand Accent）：** 优雅的**松石绿 (#2E5A44)** 或 深邃的**靛蓝 (#1C2D42)**。绿色与蓝色在海外文化中代表财富与稳健，通过降低饱和度，呈现出克制而高级的资产质感。
* **暗影质感：** 全量采用柔和的、弥散性的**柔和阴影 (Soft Shadows)**，让各个货币换算卡片呈现“悬浮于纸张之上”的立体悬浮感，层级分明。

### 2. 字体规范 (Typography)
* **货币符号与核心数字：** 采用定制的大字号无衬线体（Sans-Serif），如 *Inter* 或 *Montserrat*。确保在进行高密度、长数字的多币种联动换算时，数字依然具备极佳的视认性与现代美感。
* **功能文字与国家标签：** 引入优雅的**西方经典衬线体 (Serif)**，如 *Playfair Display* 或 *Lora*，在界面核心分类与货币简称区域（如 `USD`, `EUR`, `GBP`）微弱点缀，彰显高级的研究感。

### 3. 手势驱动交互 (Gesture-Driven UI)
* **滑动切换法币：** 用户在特定货币卡片上**向右滑动**直接触发法币切换抽屉；**上下拖拽**可以直接调整常用关注货币的排序（基于 uni-app 的 `touch` 事件优化）。
* **内置定制键盘：** 拒绝调用系统死板笨重的默认键盘，全量采用与 App 整体纸张质感、动效融为一体的**定制化极简数字键盘**，操作反馈自带微弱的触感反馈（Haptic Feedback）。

---

## 二、核心功能规划与模块设计 (Feature Architecture)

RateLens 旨在打破“只是个数字输入框”的传统做法，深度解决海外用户在跨境旅游、海外网购以及跨境资产盯盘中的核心痛点：

### 1. 离线小费与税率计算器 (Traveler's Smart Calculator) —— **出境旅游刚需**
* **一键加税/小费：** 输入一个外币金额，App 不仅实时换算成本国货币，还能一键加上当地标准的消费税（Tax）或 15%/18%/20% 的常用小费（Tip），直接在底部输出“含税总价”与“AA制人均支付额”。
* **100% 离线可用 (Offline Mode)：** 针对跨境旅游时经常遇到机场、免税店地下室无网络或信号差的痛点，App 自动缓存最后一次联网更新的汇率。即使完全断网，依然能顺畅完成全功能换算。

### 2. 多币种盯盘与高颜值小组件 (Multi-Currency Dashboard & Widgets) —— **留存核心**
* **多卡片视图联动：** 用户可以自定义添加 4-6 种常用货币，只需在任意一张卡片上输入基准金额，列表内所有关注币种同步刷新响应，汇率走势一目了然。
* **桌面原生小组件：** 制作符合 iOS/Android 现代化审美的高质感桌面小组件（Widgets）。用户无需打开 App，在手机桌面就能直观追踪所关注汇率的微弱波动及 24 小时涨跌幅折线。

### 3. AI 拍照标价换算 (Lens Scanner) —— **核心变现点**
* **AR 价格覆盖：** 充分调用手机摄像头能力，用户在海外实体店购物时，只需对准商品价签扫一下，App 自动通过 OCR 识别外币标价（如 `¥12,800` 或 `€45`），并在屏幕上直接将价格原位上浮覆盖显示为本国货币。

---

## 三、uni-app 技术落地方案 (Technical Implementation)

### 1. 高频缓存与按需过期机制
为了最大化降低海外实时汇率 API 的调用成本，同时保障极速开屏体验，项目实行**动态阈值缓存架构**。核心逻辑为按需过期策略，保障离线 100% 可用。在本地代码中通过获取 `uni.getStorageSync` 实现离线容错模式，当无服务或断网时，直接调用最后一次缓存。

### 2. 国际化数字与货币符号本地化 (Intl.NumberFormat)
海外不同国家和地区对数字的千分位逗号和小数点书写习惯完全相反：
* **欧美/中国习惯：** `$1,234.56`（逗号分隔千位，点分隔小数）
* **德国/法国习惯：** `1.234,56 €`（点分隔千位，逗号分隔小数，货币符号在尾部）
* **技术落地：** 在 uni-app 渲染计算结果时，严禁使用硬编码字符串拼接。必须全面调用 JavaScript 原生的 `Intl.NumberFormat` 底层 API，根据当前的国际化语种（Locale）动态格式化输出。

### 3. 多维自适应联动算法
多卡片联动时，需要保证用户在任意一个卡片输入数字，其他卡片都能以当前输入的卡片作为基准（Base）进行实时等比换算。

#### 核心汇率矩阵转换公式：
不需要为每个货币对单独请求 API。只需存储一份以 `USD` 为绝对基准的汇率表 $R$，任意两种货币 $A$ 和 $B$ 之间的转换公式为：

$$\text{Rate}_{A \rightarrow B} = \frac{R_B}{R_A}$$

$$\text{Amount}_B = \text{Amount}_A \times \frac{R_B}{R_A}$$

---

## 四、海外市场落地、出海合规与商业化变现

### 1. 国际化与长文本 UI 防御 (i18n)
* **多语言内置：** 基于 `uni-i18n` 深度适配多语言。首发核心聚焦：`English (US/UK)`、`Spanish`、`French`、`German`、`Japanese`。
* **UI 容错布局：** 德文、法文的数字单位及功能描述文本长度常为中文的 2-3 倍。在编写 `.vue` UI 组件时，滑块与标签**严禁写死任何固定宽度 (width/height)**。一律使用 Flex 弹性盒模型，配合 `min-width` 和 `padding` 自动撑开内容，并加上 `word-break: break-word`，确保切换语言时 UI 绝不发生折行错位。

### 2. 隐私合规第一 (Privacy-First)
* 整个汇率计算、小费分摊、账单拆分及本地缓存逻辑 **100% 在用户手机本地离线完成**。RateLens 不索取任何与功能无关的隐私权限（如通讯录、精确定位）。
* **应用商店 ASO 推广隐私文案：**
  > *"RateLens runs 100% locally for your peace of mind. We never track, upload, or store your financial queries. Your data belongs to you alone."*

### 3. 变现策略

* **免费核心换算：** 多币种换算、离线缓存、基础税费与小费计算免费提供，降低获客门槛。
* **高级旅行工具包：** 可将自定义税率模板、更多关注币种、历史汇率趋势、桌面小组件作为订阅或一次性解锁内容。
* **Lens Scanner 付费能力：** AI 拍照标价换算涉及 OCR、相机权限、模型或云端成本，应延后到核心换算闭环稳定后再设计。

---

## 下一步

先根据 [docs/ROADMAP.md](docs/ROADMAP.md) 完成 uni-app 项目骨架、核心换算模型和本地缓存验证，再进入视觉细化与跨平台打包。
