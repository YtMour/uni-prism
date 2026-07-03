# StrateName MVP 发布清单

本文档定义 StrateName H5 MVP 的公开发布门槛。当前 `StrateName-Uniapp/` 已达到工程侧 H5 MVP 候选状态；公开发布当前为 Hold，仍需完成人工候选签核、依赖风险决策和人工法律审校。

## 1. 文档与范围

| 检查项 | 状态 | 说明 |
| --- | --- | --- |
| 项目 README | Done | [../README.md](../README.md) |
| 文档索引 | Done | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |
| 产品规格 | Done | [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) |
| 生成系统 | Done | [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md) |
| 设计系统 | Done | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| 合规风险 | Done | [COMPLIANCE_AND_RISK.md](./COMPLIANCE_AND_RISK.md) |
| 路线图 | Done | [ROADMAP.md](./ROADMAP.md) |
| 实现状态 | Done | [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) |
| 发布决策 | Done | [RELEASE_DECISION.md](./RELEASE_DECISION.md) |

## 2. 工程与基础运行

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| `StrateName-Uniapp/` 工程 | 可安装、可运行 | Done |
| H5 dev 命令 | 可本地启动 | Done；`npm run dev:h5` |
| H5 build 命令 | 构建成功 | Done；`npm run build:h5` |
| `npm test` | 通过 | Done |
| `npm run check` | 串联关键检查 | Done |
| `npm run sample:manual-review` | 生成 100 个候选人工审查包 | Prepared |
| `npm run audit:copy` | 承诺性文案审计通过 | Done |
| `npm run audit:a11y` | 自动 a11y 审计通过 | Done |
| `npm run audit:visual` | 视觉审计通过 | Done |
| `npm run audit:release-assets` | 发布资源审计通过 | Done |
| `npm run smoke:interactions` | 关键交互 smoke 通过 | Done |
| `npm run assess:mvp` | 汇总发布评估 | Done；当前 `not-public-release-ready` |
| 人工候选签核 | 有可追踪 signoff 文件 | Blocked；模板已生成，正式 signoff 未完成 |
| 依赖审计 | 有报告和风险决策 | Partial；报告和风险摘要已生成，版本链风险未处理 |

## 3. 核心产品功能

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 本地名称生成 | 单次生成 8 个候选 | Done |
| 三大商业风格 | Global Venture、Heritage Industrial、Neo-Enterprise | Done |
| 行业过滤 | 至少 4 个 MVP 行业 | Done |
| 组织形式切换 | 企业语义后缀和法律形式后缀分离 | Done |
| 候选评分 | 至少 6 个评分维度 | Done |
| 候选详情 | 结构拆解、理由、风险提示 | Done |
| 收藏/取消收藏 | 本地持久化 | Done |
| Shortlist | 对比、备注、复制全部 | Done |
| 复制导出 | 单个名称和候选列表可复制 | Done |
| Boardroom Proposal | 至少 2 个预览模板 | Done；当前 4 个模板 |
| Settings | 偏好、法律语言原生下拉、隐私入口、免责声明入口、清空数据 | Done |

## 4. 生成质量

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 采样候选数 | >= 10000 | Done；当前 11520 |
| 重复实例率 | < 8% | Done；当前 6.88% |
| 禁用词命中率 | 0 | Done；当前 0 |
| 平均评分 | >= 78 | Done；当前 91.38 |
| 可读性通过率 | >= 92% | Done；当前 100% |
| 行业覆盖 | 每个 MVP 行业 >= 500 个唯一候选 | Done；当前每行业 >= 2722 |
| 人工抽样 | 100 个候选无明显高风险问题 | Prepared；已生成 100 个候选，每行业 25 个，并生成签核模板；人工审查未完成 |
| 人工签核 | `manual-review-signoff.json` 确认全部样本通过 | Blocked；公开发布前必须完成 |

## 5. 合规与隐私

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 独立免责声明页 | Settings 可进入，支持主流语言 | Done for MVP UI；16 种语言，人工法律审校未完成 |
| 独立隐私政策页 | Settings 可进入，支持主流语言 | Done for MVP UI；16 种语言，人工法律审校未完成 |
| 法律文案语言 | 覆盖主流语言，不止中英 | Done；en、zh-Hans、zh-Hant、es、fr、de、ja、ko、pt-BR、it、ru、ar、hi、id、tr、vi |
| 法律后缀提示 | 选择器、详情或导出可见 | Done |
| 导出免责声明 | 复制摘要包含风险边界 | Done |
| 禁止承诺性文案 | 不出现 available/registerable/safe to use 等承诺 | Done by script；`npm run audit:copy` 通过 |
| 清空本地数据 | 可用且有二次确认 | Done |
| 数据上传 | MVP 不上传用户数据 | Done by architecture；本地生成和本地存储 |
| 法律审校 | 发布前完成人工审校 | Not Started |

## 6. UI 与体验

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 360px 移动适配 | 无横向滚动 | Done；右侧浏览器检查 |
| 390px 移动适配 | 主流程可用 | Done；右侧浏览器检查 |
| 桌面适配 | 内容宽度受控 | Done；1280px 检查 |
| 候选名称换行 | 长名称不溢出 | Done for current generated set |
| 图标按钮 | 有可访问名称 | Done by automated/static audit；顶部、Proposal 和 Settings 符号按钮已补 aria-label |
| 提案卡预览 | 布局稳定，不遮挡文字 | Done for current templates |
| 结果页 compact chips | 生成后隐藏完整筛选面板 | Done |
| 候选详情结构表 | label/value 不粘连 | Done |
| Proposal 首屏操作 | Copy proposal text 和 Add to Shortlist 可见 | Done |
| PWA 元数据 | title、description、theme-color、manifest、favicon | Done |
| PWA 图标 | 192/512 PNG 图标 | Done |
| 视觉截图归档 | mobile + desktop | Done for current pass；`reports/visual-audit/` |

## 7. 自动化验证

当前已运行并通过：

```text
npm test
npm run sample:quality
npm run sample:manual-review
npm run audit:copy
npm run build:h5
npm run smoke:h5
npm run audit:a11y
npm run audit:visual
npm run audit:release-assets
npm run smoke:interactions
npm run check
npm run smoke:browser
npm run assess:mvp
```

当前已运行但仍有风险：

```text
npm run audit:deps
```

报告：`StrateName-Uniapp/reports/dependency-audit.json`，当前 4 moderate、15 high、0 critical。

当前自动化补充摘要：

- `npm test` 当前 12 个用例通过，包含法律 i18n 覆盖和独立页面静态检查。
- `npm run audit:a11y` 覆盖 candidate-detail、proposal、settings、privacy、disclaimer。
- `npm run smoke:interactions` 当前 8 个 checkpoints，包含隐私页语言切换和免责声明页打开。

补充风险摘要：`StrateName-Uniapp/reports/dependency-risk.md`。直接风险包为 `@dcloudio/uni-app`、`@dcloudio/vite-plugin-uni`、`vite`，修复链涉及 major upgrade。

公开 H5 MVP 发布前仍需完成人工候选签核、法律审校和依赖版本链风险决策。

## 当前发布判断

当前可以作为工程侧 H5 MVP 候选继续发布评审；不建议直接公开发布。

阻断项：

- 100 个候选人工审查包已生成，但未完成人工品牌/混淆/冒犯性签核。
- 未做人工法律/商标/隐私文案审校。
- npm audit 仍有 19 个 issue，尚未做 uni-app / Vite major upgrade 风险决策。
- App/小程序平台图标矩阵尚未派生；H5 PWA icon 已完成。
