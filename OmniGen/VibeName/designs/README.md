# VibeName 设计图索引

本目录保存 VibeName 后续真实 App 界面实现的页面状态设计图。它们不是宣传图、广告图或 App Store 展示图，而是用于实现 `VibeName-Uniapp` 时参考的移动端 UI 基准。

## 设计图清单

| 文件 | 页面状态 | 实现用途 |
| --- | --- | --- |
| [01-home-generator.png](./01-home-generator.png) | Home / Generator 空状态 | 首页布局、风格分段控件、行业筛选、长度控制、生成按钮、Whiteboard 入口 |
| [02-generated-results.png](./02-generated-results.png) | 生成结果列表 | 候选卡片、评分、标签、保存、复制、详情入口 |
| [03-candidate-detail.png](./03-candidate-detail.png) | 候选详情底部面板 | 名称结构拆解、评分条、相似变体、保存/复制/锁定词根/预览动作 |
| [04-founder-whiteboard.png](./04-founder-whiteboard.png) | Founder Whiteboard | 收藏候选对比、备注、排序、复制全部、预览选中项 |
| [05-concept-preview.png](./05-concept-preview.png) | Concept Preview | App 内品牌概念卡片预览、tagline 控制、免责声明 |
| [06-settings.png](./06-settings.png) | Settings | 默认偏好、生成开关、本地数据和关于信息 |

## 使用原则

- 这些图用于还原真实产品界面，不用于宣传首屏或营销落地页。
- 实现时以布局、信息层级、组件密度和页面状态为准，不逐字照抄图片中偶发生成的文字。
- 所有页面应保持移动端优先，最小宽度覆盖 360px。
- 不引入图中没有产品意义的装饰元素。
- 若实现与设计图不一致，应同步更新 [../docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md) 和 [../docs/IMPLEMENTATION_STATUS.md](../docs/IMPLEMENTATION_STATUS.md)。

## 生成方式

这些设计图使用 imagegen built-in 模式生成，提示词明确约束为 `production mobile app interface design screen`，并禁止营销海报、设备外壳、人物、3D 场景和宣传型 hero 图。
