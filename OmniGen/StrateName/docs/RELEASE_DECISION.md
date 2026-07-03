# StrateName Release Decision

更新时间：2026-07-03

## 当前决策

**Hold for public release.**

`StrateName-Uniapp/` 当前可以作为工程侧 H5 MVP 候选继续内部评审；不建议直接公开发布。自动化、构建、核心交互、视觉和 PWA 发布资源已通过当前检查，但公开发布仍有两类人工 blocker 和一个依赖风险需要决策。

## 发布门槛状态

| Gate | 当前状态 | 证据 |
| --- | --- | --- |
| 生成质量 | Pass | `reports/generation-quality.json`：11520 candidates，重复率 0.0688，禁用命中 0 |
| 文案风险 | Pass | `reports/copy-audit.json`：0 risky claims |
| a11y 自动审计 | Pass | `reports/a11y-audit.json`：candidate detail、Proposal、Settings、Privacy、Disclaimer，0 findings |
| 视觉审计 | Pass | `reports/visual-audit.json`：360、390、1280 视口，0 findings |
| 发布资源 | Pass | `reports/release-assets-audit.json`：manifest、favicon、192/512 icon |
| 关键交互 | Pass | `reports/interaction-smoke.json`：8 checkpoints，含隐私页语言切换和免责声明页打开，0 console issues |
| 人工候选审查包 | Prepared | `reports/manual-review-sample.md`：100 个候选，每行业 25 个 |
| 人工候选签核 | Blocked | 缺少 `reports/manual-review-signoff.json` |
| 法律/商标/隐私审校 | Blocked | 需要人工审校 16 种语言免责声明、隐私政策和法律后缀说明 |
| 依赖审计 | Risk | `reports/dependency-risk.md`：4 moderate、15 high、0 critical；修复链涉及 major upgrade |

## 当前 assessment

`npm run assess:mvp` 当前输出：

```text
not-public-release-ready
```

Blockers：

- `human-review`
- `legal-review`

Risks：

- `dependency-audit`

## 转入公开 MVP 的条件

1. 完成 100 个候选人工审查，并从 `reports/manual-review-signoff.template.json` 生成 `reports/manual-review-signoff.json`。
2. 法律/商标/隐私审校确认 Settings、详情、Proposal、复制文本、独立隐私政策页、独立免责声明页和 16 种语言法律文案可以公开发布。
3. 在独立分支评估 uni-app / Vite 版本链升级，不直接运行 `npm audit fix --force` 覆盖当前可构建状态。
4. 重新运行 `npm run check` 和 `npm run smoke:browser`，确认构建、交互、视觉、a11y 和 assessment 均符合发布门槛。

## 不在当前 MVP 中承诺

- 公司注册可用性判断。
- 商标检索或法律意见。
- 域名、社交账号或跨司法辖区可用性查询。
- 账号、云同步或团队协作。
- 真实 PNG/PDF 批量导出。
