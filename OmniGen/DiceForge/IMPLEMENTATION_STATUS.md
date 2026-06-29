# DiceForge 实现状态

## 总体状态

当前阶段：文档建设。

项目尚未进入代码实现。当前文档用于锁定 MVP 范围、规则边界、生成系统、UX 规范和后续构建路线。

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
| 原始概念文档 | Done | `DiceForge.md` 已存在 |
| README 入口 | Done | 已建立文档导航和 MVP 原则 |
| 产品规格 | Done | 已定义目标用户、场景和 MVP 范围 |
| 规则规格 | Done | 已定义 5E 轻量规则边界 |
| 生成系统设计 | Done | 已定义生成流水线和文本矩阵 |
| UX 设计规范 | Done | 已定义视觉、布局、动效和导出体验 |
| 数据结构设计 | Done | 已定义核心 TypeScript 风格模型 |
| 构建计划 | Done | 已定义 Phase 0 到 Phase 5 |
| 界面设计图 | Done | 已生成手机端完整页面流，见 `designs/mobile-v2/` |

## 功能实现状态

| 功能 | 状态 | 下一步 |
| --- | --- | --- |
| 种族数据 | Not Started | 建立结构化数据源 |
| 职业数据 | Not Started | 建立结构化数据源 |
| 背景数据 | Not Started | 建立结构化数据源 |
| 阵营数据 | Not Started | 建立九宫格枚举 |
| seed 随机上下文 | Not Started | 选定随机库或实现轻量 PRNG |
| 4d6 属性生成 | Not Started | 实现并添加单元测试 |
| 属性修正值计算 | Not Started | 实现并添加边界测试 |
| 职业友好属性分配 | Not Started | 定义职业主属性映射 |
| 熟练项去重 | Not Started | 按 `id + type` 去重 |
| 装备去重 | Not Started | 按 `id + category` 去重 |
| 三句话背景 | Not Started | 建立文本矩阵 |
| 角色卡 UI | Not Started | 根据 UX 规范实现 |
| 文本复制 | Not Started | 实现纯文本格式 |
| 海报导出 | Deferred | MVP 后半段推进 |
| 本地记录 | Deferred | Phase 3 推进 |

## 设计资产状态

| 资产 | 状态 | 说明 |
| --- | --- | --- |
| 移动端首页空状态 | Done | `designs/mobile-home-empty.png` |
| 移动端角色卡详情 | Done | `designs/mobile-character-card.png` |
| 移动端导出复制页 | Done | `designs/mobile-export-copy.png` |
| 桌面端生成工作台 | Done | `designs/desktop-generator-workbench.png` |
| 手机端 V2 完整页面流 | Done | `designs/mobile-v2/`，作为当前手机端 MVP 设计基准 |

## 当前决策

- MVP 只生成 1 级角色。
- 默认属性分配使用职业友好模式。
- 阵营只影响文本风味，不影响数值。
- 第一版不做完整车卡编辑器。
- 第一版不做云同步和账号系统。
- 导出文本优先于海报导出。

## 已知风险

- D&D 规则版权边界需要谨慎，避免复制规则书长文本。
- 中文和英文双语字段会增加数据维护成本。
- 文本矩阵若词库太少，容易出现重复感。
- 海报导出在移动端可能遇到字体加载和 canvas 截图问题。

## 下一步建议

1. 选择技术栈和运行目标。
2. 建立 `src/data` 的种族、职业、背景、阵营数据。
3. 实现可复现随机上下文。
4. 实现角色生成核心并补基础测试。
5. 再进入角色卡 UI。
