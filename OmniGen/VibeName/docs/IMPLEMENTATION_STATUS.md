# VibeName 实现状态

## 总体状态

当前阶段：产品规划与文档建设。

当前目录已建立项目说明和规划文档，但尚未创建 App 工程、生成器代码、UI 页面、词库、测试、构建脚本或自动化验证。因此 VibeName 目前不是可运行应用，也不是 MVP 发布候选。

## 状态说明

| 状态 | 含义 |
| --- | --- |
| Done | 已完成并可作为当前基线 |
| In Progress | 正在推进 |
| Blocked | 存在明确阻塞 |
| Deferred | 已决定暂缓 |
| Not Started | 尚未开始 |

## 文档状态

| 项目 | 状态 | 说明 |
| --- | --- | --- |
| 概念文档 | Done | `VibeName.md` 已扩展为产品概念和文档入口 |
| README | Done | `README.md` 已建立项目入口 |
| 文档索引 | Done | `docs/DOCUMENTATION_INDEX.md` 已建立 |
| 产品规格 | Done | `docs/PRODUCT_SPEC.md` 已建立 |
| 生成系统设计 | Done | `docs/GENERATION_SYSTEM.md` 已建立 |
| 设计系统 | Done | `docs/DESIGN_SYSTEM.md` 已建立 |
| 路线图 | Done | `docs/ROADMAP.md` 已建立 |
| MVP 发布清单 | Done | `docs/MVP_RELEASE_CHECKLIST.md` 已建立 |
| 移动端界面设计图 | Done | `designs/` 已建立 6 张真实 App 页面状态设计图 |
| 运行时素材索引 | Done | `assets/` 已建立 App 图标、品牌和空状态素材 |
| 素材缺口审计 | Done | `assets/ASSET_AUDIT.md` 已确认当前 MVP 位图素材覆盖 |

## 功能实现状态

| 功能 | 状态 | 下一步 |
| --- | --- | --- |
| App 工程 | Not Started | 创建 `VibeName-Uniapp` |
| 本地生成器 | Not Started | 实现风格模板、词库加载和候选生成 |
| 词库数据 | Not Started | 建立 roots、suffixes、industries、bannedWords |
| seed 随机 | Not Started | 实现可复现 PRNG |
| 风格过滤 | Not Started | 支持 3 种命名风格 |
| 行业过滤 | Not Started | 支持至少 4 个 MVP 行业 |
| 长度过滤 | Not Started | Ultra Short、Standard Blend、Descriptive Compound |
| 候选评分 | Not Started | 实现 readability、brandability、industryFit、brevity、distinctiveness |
| 禁用词过滤 | Not Started | 建立敏感词和难读组合过滤 |
| 候选卡片 UI | Not Started | 展示名称、标签、评分、理由、复制和收藏 |
| Founder Whiteboard | Not Started | 本地收藏、对比、备注和复制全部 |
| 概念卡片预览 | Not Started | App 内预览品牌落地页效果 |
| 本地存储 | Not Started | 保存偏好、最近生成和收藏 |
| 复制导出 | Not Started | 浏览器 Clipboard 与 UniApp fallback |
| H5 构建 | Not Started | 建立正式 H5 build 命令 |
| 自动化测试 | Not Started | 覆盖生成器、评分和 UI 状态 |
| 质量采样 | Not Started | 输出重复率和评分分布 |
| H5 smoke | Not Started | 覆盖核心用户流 |
| 发布评估 | Not Started | 生成 MVP release assessment |

## 设计资产状态

| 资产 | 状态 | 说明 |
| --- | --- | --- |
| Home / Generator | Done | `designs/01-home-generator.png` |
| 生成结果列表 | Done | `designs/02-generated-results.png` |
| 候选详情底部面板 | Done | `designs/03-candidate-detail.png` |
| Founder Whiteboard | Done | `designs/04-founder-whiteboard.png` |
| Concept Preview | Done | `designs/05-concept-preview.png` |
| Settings | Done | `designs/06-settings.png` |

## 运行时素材状态

| 资产 | 状态 | 说明 |
| --- | --- | --- |
| App 图标源图 | Done | `assets/icons/app-icon-1024.png` |
| 应用内品牌 glyph | Done | `assets/brand/brand-glyph.png` |
| 概念预览背景 | Done | `assets/brand/concept-preview-panel.png` |
| 候选列表空状态 | Done | `assets/brand/empty-candidates.png` |
| Whiteboard 空状态 | Done | `assets/brand/empty-whiteboard.png` |
| 生成中 spark 标记 | Done | `assets/brand/generation-spark.png` |

## 当前决策

- 第一版采用本地生成，不依赖远程 AI。
- 第一版不做实时域名查询和商标检索。
- 第一版不承诺 PNG 保存，只做 App 内概念卡片预览。
- 第一版目标平台优先 H5/Mobile，后续再扩展 App、小程序或 PWA。
- 命名结果需要显示评分和理由，避免只给用户一串不可解释文本。
- 文档必须区分规划、已实现和已验证，不能把计划写成完成。

## 已知风险

| 风险 | 影响 | 处理建议 |
| --- | --- | --- |
| 科技命名后缀同质化 | 输出容易像模板组合 | 引入 distinctiveness 降权和更多行业词 |
| 抽象词可读性不稳定 | 用户难以记忆或拼写 | 加强音节和辅音过滤 |
| 域名/商标误解 | 用户可能误以为名称可注册 | UI 和文档明确免责声明 |
| 词库规模不足 | 重复率高、结果单调 | 建立质量采样脚本并按报告扩词库 |
| 视觉容易过度营销化 | 降低工具效率 | 保持移动端工具首屏，不做营销首页 |

## 下一步建议

1. 创建 `VibeName-Uniapp` 工程，建立 Vue 3/uni-app 基础页面。
2. 实现 `src/core/generator`、`src/core/scoring` 和首批 `src/data`。
3. 完成首页生成、候选卡片、收藏和复制。
4. 增加生成器测试和批量质量采样脚本。
5. 建立 H5 build、smoke 和 release checklist 的真实验证链路。

## 本轮验证

本轮完成了文档建设、6 张移动端真实界面状态设计图，以及 6 个独立运行时素材生成。没有运行应用构建、单元测试或浏览器 smoke，因为当前尚无 App 工程和可执行代码。
