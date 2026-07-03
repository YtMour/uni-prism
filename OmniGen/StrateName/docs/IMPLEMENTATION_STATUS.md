# StrateName 实现状态

更新时间：2026-07-03

## 当前结论

StrateName 当前处于文档建设阶段。项目已有原始概念文档，并已建立项目入口、产品规格、生成系统、设计系统、合规风险、路线图和 MVP 发布清单。

当前没有可运行 App 工程、生成器代码、词库代码、自动化测试、构建产物或浏览器验证结果。

## 当前文件状态

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| `StrateName/StrateName.md` | Done | 原始概念、视觉定位和功能设想 |
| `StrateName/README.md` | Done | 项目入口和当前范围 |
| `StrateName/docs/DOCUMENTATION_INDEX.md` | Done | 文档 source-of-truth |
| `StrateName/docs/PRODUCT_SPEC.md` | Done | 产品规格和 MVP 范围 |
| `StrateName/docs/GENERATION_SYSTEM.md` | Done | 生成系统、词库和评分规则 |
| `StrateName/docs/DESIGN_SYSTEM.md` | Done | 视觉、交互和提案卡规范 |
| `StrateName/docs/COMPLIANCE_AND_RISK.md` | Done | 合规风险和免责声明边界 |
| `StrateName/docs/ROADMAP.md` | Done | 阶段计划 |
| `StrateName/docs/MVP_RELEASE_CHECKLIST.md` | Done | 发布门槛 |
| `StrateName/StrateName-Uniapp/` | Not Started | 后续工程目录尚未创建 |
| `StrateName/assets/` | Done for first asset set | 已生成 App 图标、品牌小元素、空状态图标、装饰印章和提案模板底图 |
| `StrateName/designs/` | Done for design reference | 已生成 6 张后续真实界面状态参考图，不是 H5 运行截图 |

## 功能实现状态

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 本地名称生成 | Not Started | 仅有生成规则文档 |
| 结构化词库 | Not Started | 仅有字段设计 |
| 行业过滤 | Not Started | 仅有产品规格 |
| 组织形式切换 | Not Started | 仅有产品规格 |
| 候选评分 | Not Started | 仅有评分模型 |
| 禁用词过滤 | Not Started | 仅有策略 |
| 候选详情 | Not Started | 未实现 |
| 收藏/Shortlist | Not Started | 未实现 |
| 复制导出 | Not Started | 未实现 |
| Boardroom Proposal | Not Started | 未实现 |
| App icon / brand assets | Done for first asset set | 素材已生成，工程未接入 |
| Settings | Not Started | 未实现 |
| 隐私政策 | Not Started | 文案要求已定义，界面未实现 |
| 免责声明 | Not Started | 文案要求已定义，界面未实现 |
| H5 构建 | Not Started | 工程未创建 |
| 自动化测试 | Not Started | 工程未创建 |
| 质量采样 | Not Started | 脚本未创建 |
| 浏览器 smoke | Not Started | 脚本未创建 |

## 当前风险

| 风险 | 等级 | 处理方式 |
| --- | --- | --- |
| 合规风险 | High | MVP 必须明确“不做注册、商标、域名可用性判断” |
| 词库质量不足 | High | Phase 1 需要先建立结构化词库和禁用词表 |
| 名称过于通用 | Medium | 评分中加入差异性和降权规则 |
| 法律后缀误导 | High | 后缀选择器、详情和导出都必须显示预览用途提示 |
| 视觉过度金融化 | Medium | 设计系统限制深色和金色使用范围 |
| 文档先行但无实现 | Medium | 下一阶段应优先创建可运行 H5，而不是继续扩文档 |

## 推荐下一步

1. 创建 `StrateName-Uniapp/` 工程。
2. 按 [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md) 建立最小词库、生成器、评分器和过滤器。
3. 做首页生成流程和候选卡片。
4. 增加生成器单元测试和质量采样脚本。
5. 跑通 `npm test`、`npm run build:h5` 和基础 H5 smoke。
6. 回写本文件，把真实实现状态从 Not Started 更新为 Done 或 In Progress。

## 本轮未执行事项

- 未创建 App 工程。
- 未运行构建。
- 未运行测试。
- 未做浏览器验证。
- 已生成运行时素材和界面设计参考图，但尚未接入工程。
- 未进行法律审校。
