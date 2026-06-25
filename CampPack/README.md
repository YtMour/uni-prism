# CampPack

CampPack 是一款面向露营、徒步和家庭户外场景的离线装备清单 App。核心目标不是做通用 Todo，而是帮助用户在行前装包、到达搭建、撤营回收三个真实节点里少漏装备、快做检查，并在无网络环境下保持完整可用。

项目计划基于 uni-app、Vue 3 和 Vite 构建，优先覆盖 iOS / Android App，后续按验证结果扩展到 H5 或小程序。

## 当前定位

- **目标用户**: 轻量露营用户、重装徒步用户、家庭户外组织者、户外内容创作者。
- **核心差异**: 三阶段清点模式、模板化装备库、离线优先、本地重量统计。
- **产品风格**: Gallerist Minimalism，以纸张色、大地浅灰、黑曜石和苔藓绿构成克制的户外工具美学。
- **商业方向**: 免费核心清单能力，后续通过专业模板包、Pro 数据能力和跨设备同步扩展付费空间。

## 文档入口

| 文档 | 用途 |
| --- | --- |
| [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) | 产品目标、用户场景、MVP 范围、后期功能池 |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | 视觉语言、组件规范、交互和动效原则 |
| [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md) | 技术架构、数据模型、离线存储、跨端策略 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 分阶段实现计划、里程碑、优先级 |
| [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) | 当前实现状态、风险、决策记录 |
| [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) | 功能验收、离线验证、发布前检查清单 |

## MVP 范围

MVP 只做能验证 CampPack 价值的核心闭环：

1. 创建或导入一份露营清单。
2. 按分类管理装备条目、数量、重量和备注。
3. 在 Pack / Setup / Leave 三个模式中分别清点。
4. Leave 模式支持从 Pack 状态一键反向生成撤营检查。
5. 本地持久化，断网时完整可用。
6. 提供至少 3 套内置模板: Solo Bushcraft、Family Glamping、Ultralight Backpacking。
7. 支持公制 / 英制重量显示与总重统计。

## 技术原则

- **离线优先**: 用户核心数据默认只依赖本地存储；任何联网能力都必须是可选增强。
- **简单先行**: MVP 阶段优先使用 uni-app Storage / Pinia 持久化；SQLite、同步服务和云备份进入后续阶段。
- **清单状态可追溯**: Pack、Setup、Leave 的勾选状态不能互相覆盖，需要独立记录。
- **跨端可降级**: App 端优先使用触觉反馈、SQLite 等能力；H5 / 小程序必须有无感降级方案。
- **可验证交付**: 每个里程碑都需要对应功能验收、离线 smoke 和数据迁移检查。

## 后续建设顺序

1. 搭建 uni-app 基础工程、路由、状态管理和本地数据层。
2. 实现清单首页、模板导入、清单详情和三阶段模式切换。
3. 补齐重量统计、单位切换、搜索筛选、撤营反向检查。
4. 建立 H5 / App smoke 检查脚本和手工验收清单。
5. 再评估 Pro 功能: 自定义模板、导出分享、云同步、协作清点、天气与行程辅助。
