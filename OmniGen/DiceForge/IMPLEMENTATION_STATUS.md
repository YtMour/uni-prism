# DiceForge 实现状态

## 总体状态

当前阶段：H5 MVP 发布候选加固。

已在 `DiceForge-Uniapp` 模板项目内完成核心生成器、手机端页面流、浏览器验证入口、正式 UniApp H5 构建链路、H5 smoke 和 release audit 基线。当前可作为 H5 内测/发布候选继续真机与依赖风险复核，尚不应宣称为所有平台公开发布完成。

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
| 种族数据 | Done | 已在 `DiceForge-Uniapp/src/core/generator.js` 建立首批结构化数据 |
| 职业数据 | Done | 已建立首批 Fighter/Rogue/Wizard/Cleric/Bard/Ranger 数据 |
| 背景数据 | Done | 已建立首批背景、熟练项、装备和故事组件 |
| 阵营数据 | Done | 已建立九宫格阵营枚举 |
| seed 随机上下文 | Done | 已实现轻量 PRNG，可复现同 seed 角色 |
| 4d6 属性生成 | Done | 已实现 4d6 drop lowest 并纳入测试 |
| 属性修正值计算 | Done | 已实现并纳入测试 |
| 职业友好属性分配 | Done | 已按职业主属性分配高点数 |
| 熟练项去重 | Done | 已按 `type + name` 去重 |
| 装备去重 | Done | 已按 `category + name` 去重 |
| 三句话背景 | Done | 已用背景矩阵生成 origin/desire/conflict/secret 文案 |
| 角色卡 UI | Done | 已覆盖首页、生成中、角色卡、详情、重掷、导出、海报、最近列表 |
| 文本复制 | Done | 已实现 browser clipboard / UniApp clipboard 兼容路径 |
| 海报预览 | Done | MVP 保留 App 内海报预览，并提供 Copy Text；真实 PNG 保存移入后续增强，避免假保存入口 |
| 本地记录 | Done | 已实现最近角色 localStorage / Uni storage 路径 |
| 浏览器验证入口 | Done | `h5-main.js` 指向 `src/browser/BrowserApp.vue`，用于本地浏览器预览和视觉验证 |
| UniApp H5 构建链路 | Done | `npm run build:h5` 会先清理 `dist/build/h5` 再构建，产物位于 `DiceForge-Uniapp/dist/build/h5/` |
| H5 发布 smoke | Done | `npm run smoke:h5` 检查清理后正式 H5 产物包含 premium D20、投骰动画、核心页面文案，且不包含假保存和旧 D20 中间图 |
| 发布审计基线 | Done | `npm run audit:release` 锁定当前 npm audit 风险基线：19 total，15 high，4 moderate，0 critical |
| Android 权限 | Done | 已收敛为仅保留 `VIBRATE`，移除相机、账号、电话状态、日志、写设置等模板权限 |

## 设计资产状态

| 资产 | 状态 | 说明 |
| --- | --- | --- |
| 移动端首页空状态 | Done | `designs/mobile-home-empty.png` |
| 移动端角色卡详情 | Done | `designs/mobile-character-card.png` |
| 移动端导出复制页 | Done | `designs/mobile-export-copy.png` |
| 桌面端生成工作台 | Done | `designs/desktop-generator-workbench.png` |
| 手机端 V2 完整页面流 | Done | `designs/mobile-v2/`，作为当前手机端 MVP 设计基准 |
| App 图标与界面图标素材 | Done | `assets/icons/`，包含 App 图标、源图和透明 PNG |

## 本轮实现验证

- `npm test`：通过，覆盖生成器和浏览器页面状态标记。
- `npm run build:browser`：通过，构建前已清理 browser 输出，产物位于 `DiceForge-Uniapp/dist/`。
- `npm run build:h5`：通过，构建前已清理 H5 输出，产物位于 `DiceForge-Uniapp/dist/build/h5/`。
- `npm run smoke:h5`：通过，验证清理后正式 H5 产物包含 premium D20、投骰动画，且不包含假保存和旧 D20 中间图。
- `npm run audit:release`：通过，当前 npm audit 风险被锁定为已知基线：19 total，15 high，4 moderate，0 critical。
- `npm run check`：通过，串联测试、browser 构建、正式 H5 构建、H5 smoke 和 release audit。
- `npm run assess:release`：通过并生成 `reports/mvp-release-assessment.json`，结论为 `h5MvpCandidate: true`、`publicReleaseReady: false`。
- 右侧浏览器：已用 `http://127.0.0.1:5187/` 验证首页、premium D20 加载、生成角色、导出文本、海报预览、无 Save Poster、无横向溢出、控制台无 error。

## 当前决策

- MVP 只生成 1 级角色。
- 默认属性分配使用职业友好模式。
- 阵营只影响文本风味，不影响数值。
- 第一版不做完整车卡编辑器。
- 第一版不做云同步和账号系统。
- 导出文本优先于海报保存；MVP 只承诺海报预览，不承诺 PNG 保存。
- 中心随机骰子使用 `HeroDie` 组件和高质感透明 PNG `static/d20-hero-premium.png`，动效采用短距离投骰路径 `die-throw-path` 与自旋落地 `die-spin-settle`，避免旧 CSS D20 的裁切和变形问题。

## 已知风险

- D&D 规则版权边界需要谨慎，避免复制规则书长文本。
- 中文和英文双语字段会增加数据维护成本。
- 文本矩阵若词库太少，容易出现重复感。
- npm audit 仍有已知中高风险，主要来自 DCloud/Uni/Vite/esbuild 依赖链；当前已用 release audit 锁定基线，但公开发布前仍需评估升级路径。
- 真机 App、小程序和不同 WebView 尚未完成完整回归；当前发布候选主要面向浏览器 H5。
- 当前 `DiceForge-Uniapp` 同时存在 UniApp 页面和 browser 验证页面；中心 D20、导出操作和权限已收敛，但后续仍应抽出共享状态逻辑，减少双实现漂移。
- 真实 PNG 海报保存需要 canvas/截图链路和移动端权限/字体回归，暂不进入 MVP 承诺。

## 下一步建议

1. 评估 DCloud/Uni/Vite 依赖升级路径，争取降低 npm audit 中高风险。
2. 用真机 WebView / App 基座做发布前 smoke：生成、重掷、复制、最近列表、海报预览、刷新恢复。
3. 抽出共享组合逻辑，减少 `pages/index/index.vue` 与 `src/browser/BrowserApp.vue` 的重复。
4. 将生成器数据拆分到 `src/data`，为扩展种族、职业和背景做准备。
5. 后续再接入真实 PNG 海报保存能力，处理字体、截图和移动端权限问题。
