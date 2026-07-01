# DiceForge MVP 发布清单

## 发布判断

当前结论：DiceForge 已达到 H5 MVP 发布候选，但尚未达到全平台公开发布完成。

判断依据：

- H5 生成闭环已经打通：生成角色、查看角色卡、重掷、复制文本、海报预览、最近角色。
- 自动化验证链路已经存在：测试、browser 构建、UniApp H5 构建、H5 smoke、release audit、release assessment。
- 公开发布阻断仍存在：npm audit 已知中高风险未消除，真机 WebView/App 基座回归未完成。

## MVP 功能门槛

| 项目 | 当前状态 | 证据/说明 |
| --- | --- | --- |
| 生成 1 级角色 | Done | `src/core/generator.js` 已生成种族、职业、背景、阵营、属性、熟练项、装备和故事 |
| 4d6 去最低属性 | Done | `src/core/generator.test.js` 覆盖属性生成和修正值 |
| 职业友好属性分配 | Done | 高点数按职业主属性优先分配 |
| 重复熟练项/装备去重 | Done | 生成器按 `type:name`、`category:name` 去重 |
| 三句话背景 | Done | 生成 origin/desire/conflict/secret 组合故事 |
| 角色卡主流程 | Done | `BrowserApp.vue` 覆盖首页、生成中、角色卡、详情、重掷、导出和最近列表 |
| 中心 D20 交互 | Done | `HeroDie.vue` 使用透明 premium D20 图片和短投骰动效 |
| 文本复制 | Done | 浏览器入口使用 Clipboard API；UniApp 页面保留兼容路径 |
| 海报预览 | Done | MVP 只承诺 App 内预览和 Copy Text，不承诺 PNG 保存 |
| 最近角色 | Done | browser localStorage / Uni storage 路径已实现 |
| Android 权限收敛 | Done | 模板危险权限已移除，仅保留震动能力 |
| 手机端设计图覆盖 | Done | `designs/01-home-empty.png` 到 `08-recent-characters.png` 覆盖完整手机流程 |

## H5 发布候选门槛

| 门槛 | 命令/证据 | 当前状态 |
| --- | --- | --- |
| 单元测试 | `npm test` | Done |
| 浏览器验证构建 | `npm run build:browser` | Done |
| UniApp H5 构建 | `npm run build:h5` | Done |
| H5 产物 smoke | `npm run smoke:h5` | Done |
| 发布审计基线 | `npm run audit:release` | Done，但仍有已知中高风险 |
| 自动发布评估 | `npm run assess:release` | Done，报告见 `reports/mvp-release-assessment.json` |
| 完整检查串联 | `npm run check` | Done，作为 H5 候选门槛 |

## 公开发布阻断

| 阻断 | 严重度 | 处理建议 |
| --- | --- | --- |
| npm audit 仍有 19 个已知风险 | High | 评估 DCloud/Uni/Vite/esbuild 升级路径；升级后重新跑 `npm run check` 和视觉回归 |
| 真机 WebView/App 基座未回归 | High | 至少覆盖生成、重掷、复制、最近列表、海报预览、刷新恢复、横向溢出、控制台错误 |
| browser 与 UniApp 页面存在双实现 | Medium | 抽出共享组合逻辑或共享 UI 子组件，降低后续漂移风险 |
| PNG 海报保存未接入 | Medium | 维持 MVP 不承诺保存；后续以 canvas/截图链路单独验证字体、权限和裁切 |
| 词库规模有限 | Medium | 发布后根据重复感补充 race/class/background/name/story 矩阵 |

## 发布前人工回归清单

| 场景 | 检查点 |
| --- | --- |
| 首次打开 | 首页没有横向溢出，D20 居中，Generate 可点击 |
| 生成角色 | 生成动效结束后进入角色卡，字段不为空 |
| 连续生成 | 快速点击不会造成状态错乱或多层面板叠加 |
| 重掷面板 | Whole character、Story only、Stats only、Keep seed 行为符合预期 |
| 复制文本 | 成功复制后出现反馈，粘贴内容结构清晰 |
| 海报预览 | 角色名、职业、六项属性、故事和 seed 不截断、不重叠 |
| 最近列表 | 刷新后能恢复最近角色，搜索和清空可用 |
| 移动端显示 | 360px 宽度下按钮文字、属性格、底部栏不挤压 |
| App/WebView | 触感反馈可用或静默降级，复制权限失败时不崩溃 |

## 后续优化优先级

1. 依赖升级与 audit 风险收敛。
2. 真机 WebView/App 基座 smoke 和截图记录。
3. browser/UniApp 页面共享状态与组件抽取。
4. 生成器数据拆分到 `src/data`，扩大词库并降低重复感。
5. 真实 PNG 海报保存能力，完成 canvas/截图、字体和权限回归后再进入发布范围。
