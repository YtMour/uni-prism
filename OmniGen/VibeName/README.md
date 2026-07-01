# VibeName

VibeName 是 OmniGen 系列中的 Startup Name Generator 子项目，面向独立开发者、SaaS 创业者和科技产品团队，提供创业项目命名生成、筛选、评分、收藏和品牌概念卡片预览。

当前阶段：产品规划与文档建设。项目尚未创建 App 工程或实现代码。

## 项目目标

- 用本地可解释的词根、音节和后缀规则生成科技产品名。
- 支持行业、风格、长度和调性过滤。
- 为每个候选名称提供可读性、品牌感和领域匹配评分。
- 提供 Founder Whiteboard，用于收藏、锁定、对比和导出候选名称。
- 提供极简概念卡片预览，帮助用户判断名称落地后的视觉感。

## 当前文档

| 文档 | 用途 |
| --- | --- |
| [VibeName.md](./VibeName.md) | 原始概念、产品定位和功能概览 |
| [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md) | 当前文档入口 |
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | 产品规格、用户与功能范围 |
| [docs/GENERATION_SYSTEM.md](./docs/GENERATION_SYSTEM.md) | 生成系统、词库和评分规则 |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | 视觉、交互、组件和导出规范 |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | 版本路线和阶段计划 |
| [docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) | 当前实现状态和风险 |
| [docs/MVP_RELEASE_CHECKLIST.md](./docs/MVP_RELEASE_CHECKLIST.md) | MVP 发布门槛 |

## 推荐技术方向

第一版建议采用 uni-app + Vue 3，沿用 OmniGen 系列移动端优先、本地生成、轻量导出的方向。

建议工程目录：

```text
VibeName/
  VibeName-Uniapp/
    pages/
    src/
      core/
      data/
      components/
      services/
      styles/
    static/
    scripts/
    tests/
```

## 第一阶段范围

MVP 只承诺本地命名生成和轻量品牌预览，不承诺域名查询、商标检索、账号同步或在线 AI 生成。

必须完成：

- 名称生成主流程。
- 风格、行业、长度过滤。
- 候选评分和理由说明。
- 收藏与白板。
- 复制导出。
- 概念卡片预览。
- H5 构建和 smoke 验证。

暂缓：

- 实时域名可用性查询。
- 商标和公司注册检索。
- 账号、云同步和团队协作。
- 远程 AI 命名。
- 真实 PNG 海报保存。
