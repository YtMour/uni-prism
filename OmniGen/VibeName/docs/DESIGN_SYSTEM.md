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

### Candidate Card

每张候选卡包含：

- 名称
- 风格标签
- 总分
- 1 句理由
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
- 相似变体。
- 锁定词根按钮。

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

## 可访问性

- 主按钮和图标按钮必须有可读 label。
- 评分不能只用颜色表达。
- 对比度满足移动端阅读。
- 复制失败时有明确反馈。
- 动效可短，不依赖动效表达关键状态。
