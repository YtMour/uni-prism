# VibeName 设计系统

## 设计目标

VibeName 应像一个克制、高效的现代 SaaS 工具，而不是装饰性命名小游戏。界面服务于快速筛选、对比和复制，生成结果是视觉中心。

关键词：

- 极简
- 清爽
- 快速
- 科技编辑感
- 移动端优先
- 结果优先

## 视觉基础

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.background` | `#F7F8FA` | App 背景 |
| `color.surface` | `#FFFFFF` | 卡片和输入区域 |
| `color.text` | `#111827` | 主文本 |
| `color.muted` | `#6B7280` | 次级文本 |
| `color.line` | `#E5E7EB` | 分割线 |
| `color.accent` | `#004BFF` | 主操作和选中态 |
| `color.success` | `#12A150` | 复制、保存成功 |
| `color.warning` | `#B7791F` | 风险提醒 |

字体：

- Display：Inter、Montserrat、系统无衬线。
- UI：Inter、system-ui、PingFang SC、Microsoft YaHei。
- 不使用复杂花体，避免削弱 SaaS 科技感。

圆角：

- 工具按钮：8px。
- 候选卡片：8px。
- 底部 sheet：12px。
- 不使用过度圆润的泡泡式风格。

## 页面结构

当前移动端页面状态设计图见 [../designs/README.md](../designs/README.md)。这些图是后续实现基准，不是宣传图。

### Home / Generator

首屏必须直接是可用工具，不做营销落地页。

布局：

```text
顶部品牌区
风格分段控件
行业筛选 chips
长度/调性控制
Generate 按钮
候选名称列表
底部 Whiteboard 入口
```

重点：

- 生成按钮始终明确。
- 候选名称要比说明文字更醒目。
- 控件密度适中，移动端不堆叠过多说明文案。
- Style、Industry、Length 下方的说明文案必须解释当前选择的真实作用。

### Candidate Card

每张候选卡包含：

- 名称
- 风格标签
- 总分
- 1 句理由
- 结构公式和词源片段在详情中展示
- 收藏按钮
- 复制按钮
- 详情入口

交互：

- 轻触卡片打开详情。
- 点击收藏加入 Whiteboard。
- 点击复制只复制名称。
- 不把长说明塞进卡片。

### Detail Sheet

内容：

- 名称结构拆解。
- 评分条。
- 生成理由。
- 生成公式，例如 `industry + suffix`。
- 操作：保存、复制、预览。

### Founder Whiteboard

用途是对比，不是复杂项目管理。

字段：

- 名称
- 总分
- 行业标签
- 用户备注
- 复制/移除

支持：

- 复制全部。
- 清空白板。
- 按评分排序。

### Settings

MVP 设置页只保留会真实影响产品行为的偏好：

- Result count：控制每次生成 4 到 12 个候选。
- Use seed：开启时使用可复现生成序列，关闭时进入探索模式。
- Filter hard-to-read names：控制可读性过滤是否启用。
- Show score details：控制候选卡评分 pill 和详情评分条是否展示。
- Language：18 个主流应用语种，通过紧凑下拉控件选择；切换后核心界面、关键设置、预览字段和法律页即时更新，Arabic 使用 RTL 方向。
- Privacy policy：分段解释本地存储范围、未收集内容、用途、不出售/不远程传输、保留期限、用户控制、安全限制和变更条件。
- Disclaimer：分段解释创意建议边界、不做可用性检查、商标/品牌风险、非专业建议、按现状提供和发布前自行尽调。

设置项不得只是静态 On/Off 文案；如果没有真实状态和展示影响，不进入 Settings。

### Concept Preview

极简品牌卡片，用于预览名称落地感。

内容：

- 名称大字展示。
- 自动生成 tagline。
- 行业标签。
- 一个模拟 CTA。
- 色彩和字体保持克制。

MVP 只做 App 内预览，不承诺保存 PNG。

## 组件规范

| 组件 | 说明 |
| --- | --- |
| SegmentedControl | 用于风格选择 |
| FilterChip | 用于行业和调性标签 |
| IconButton | 收藏、复制、重生成、关闭等 |
| ScoreBar | 展示评分维度 |
| CandidateCard | 候选名称卡 |
| BottomSheet | 详情和白板 |
| PreviewCanvas | 概念卡片预览 |

按钮中有清晰图标可用时优先使用图标，必要时配合短文本。

## 响应式要求

必须覆盖：

- 360px 宽移动端。
- 390px iPhone 常见宽度。
- 768px 平板。
- 桌面浏览器居中容器。

约束：

- 360px 宽度下无横向滚动。
- 名称过长时允许换行或缩小结果字号。
- 按钮文字不得被截断。
- 白板列表不得遮挡主操作。

当前视觉归档保存在 `VibeName-Uniapp/reports/visual/`：

- `desktop-1280x720.png`
- `mobile-390x844.png`
- `mobile-360x800.png`
- `layout-report.json`

`npm run audit:visual` 会检查截图和布局指标是否存在，并确认无横向溢出。

## 文案风格

UI 文案应短、直接、偏产品工具语气。

推荐：

- Generate names
- Copy
- Save
- Lock root
- Add to board
- Preview
- Clear board

避免：

- 大段解释。
- 夸张营销语。
- 暗示商标、域名或法律可用。

## 国际化与法律页

MVP 已接入 18 个主流应用语种：English、简体中文、繁體中文、Español、Français、Deutsch、日本語、한국어、Português (Brasil)、Русский、Italiano、Nederlands、العربية、हिन्दी、Bahasa Indonesia、Tiếng Việt、ไทย、Türkçe。语言切换位于 Settings，使用下拉控件承载完整列表，且必须真实影响页面文案，不允许只改变按钮状态。Arabic 必须设置 RTL 方向并通过移动视口无横向溢出检查。

当前必须覆盖：

- 顶部副标题、生成页、空状态、白板、预览页、设置页和详情面板核心操作。
- Style、Industry、Length 的选项说明。
- 结构标签、tagline、评分标签。
- Privacy policy 和 Disclaimer。

说明：当前 MVP 的关键路径文案和可见选项说明必须本地化，不能缺 key 或回落到英文；后续继续做专业语言质量审校。

法律页保持工具页风格，不做营销页，不使用弹窗堆叠。Privacy policy 和 Disclaimer 必须使用可扫描分段结构，不允许退回单段短提示。Privacy policy 强调本地设备存储、不出售/不远程传输、用户清除数据控制和安全限制；Disclaimer 强调名称生成不构成商标、域名、财务或法律建议，且当前 MVP 按现状提供。公开发布前仍需正式法律审校。

## 可访问性

- 主按钮和图标按钮必须有可读 label。
- 评分不能只用颜色表达。
- 对比度满足移动端阅读。
- 复制失败时有明确反馈。
- 动效可短，不依赖动效表达关键状态。
