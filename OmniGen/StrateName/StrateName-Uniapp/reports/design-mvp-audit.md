# StrateName H5 Design and MVP Audit

更新时间：2026-07-03

## 结论

当前 H5 工程可以作为工程侧 MVP 候选继续发布评审，但仍不建议在未处理依赖风险和人工法律审校前公开发布。

主要原因：

- 自动化测试、构建、H5 smoke、承诺性文案审计、扩展 a11y 审计、视觉审计、发布资源审计、交互 smoke 和浏览器 smoke 均通过。
- 核心流程可用：Generate、Candidate Detail、Shortlist、Boardroom Proposal、Settings、Privacy Policy、Disclaimer。
- 结果页 compact chips、候选详情结构表和 Proposal 首屏操作已完成本轮修复。
- 依赖审计仍有 19 个 issue，其中 15 个 high。
- 隐私政策和免责声明已拆成独立页面，并支持 16 种主流语言法律文案；公开发布前仍需人工候选签核和人工法律审校。

## 本轮真实检查

| 项目 | 结果 |
| --- | --- |
| 当前浏览器地址 | `http://127.0.0.1:5193/` |
| Generate / Results | Pass |
| Candidate Detail | Pass |
| Shortlist | Pass |
| Boardroom Proposal | Pass |
| Settings / Compliance | Pass |
| Privacy Policy / i18n | Pass |
| Disclaimer / i18n | Pass |
| 390px 横向滚动 | Pass |
| 浏览器 console error/warning | Pass，未发现 error/warning |
| Proposal 模板素材加载 | Pass，`/static/templates/letterhead-bg.png` 已加载 |
| `npm run audit:visual` | Pass，3 个视口 0 findings |
| `npm run audit:copy` | Pass，0 risky claims |
| `npm run audit:a11y` | Pass，0 findings；覆盖 candidate-detail、proposal、settings、privacy、disclaimer |
| `npm run assess:mvp` | Pass with status，`not-public-release-ready` |

本轮截图：

- `reports/visual-audit/01-generate-results-390x844.png`
- `reports/visual-audit/02-candidate-detail-390x844.png`
- `reports/visual-audit/03-shortlist-390x844.png`
- `reports/visual-audit/04-proposal-390x844.png`
- `reports/visual-audit/05-settings-390x844.png`

## 设计图符合度

| 参考图 | 当前符合点 | 当前差距 | 优先级 |
| --- | --- | --- | --- |
| `01-home-generator.png` | 品牌栏、Business Name Generator、五项筛选、主按钮、底部 4 tab 基本一致 | 空状态在当前持久化结果状态下未展示；控制图标是文本符号，不是统一图标体系 | P2 |
| `02-generated-results.png` | 8 candidates、候选卡、分数、复制/收藏、风险提示、compact chip 条已存在 | 后续可继续优化图标体系和卡片信息密度 | P2 |
| `03-candidate-detail.png` | 详情抽屉、总分、标签、评分条、两列结构表、理由、免责声明和操作按钮存在 | 后续可继续优化首屏视觉密度 | P2 |
| `04-shortlist.png` | 保存项、分数、风险状态、备注、决策信号、本地存储提示、清空按钮可访问名称存在 | 缺少表头式 Name/Score/Risk/Note 对齐；只有 1 个保存项时视觉支撑偏弱 | P2 |
| `05-boardroom-proposal.png` | Proposal 页、候选选择、4 模板 tab、Export summary、Copy proposal text、Add to Shortlist、Letterhead 底图、tagline、免责声明存在 | Letterhead 边框和纸张层次可继续细化 | P2 |
| `06-settings-compliance.png` | 默认项、数量 stepper、开关、法律语言原生下拉、隐私入口、免责声明入口、法律后缀、清空数据存在 | 图标体系仍是文本符号，但符号按钮可访问名称和触控尺寸已纳入自动审计 | P2 |

## 缺失或不匹配元素

| 类别 | 现状 | 建议 |
| --- | --- | --- |
| 结果页紧凑筛选条 | Done；生成后显示 compact chips，完整 filter panel 默认隐藏 | 后续可优化 chip 图标 |
| 候选详情结构表 | Done；两列 grid，label/value 分离 | 后续可优化结构解释文本 |
| 控制图标 | 文本符号仍存在，但顶部、Proposal、Settings 符号按钮已有 aria-label，触控目标已通过 a11y audit | 后续可统一使用代码图标或图标组件；若小程序原生 tabBar 再派生 PNG |
| Proposal 首屏 | Done；Export summary、Copy proposal text、Add to Shortlist 在 390px 首屏可见 | 后续可优化 preview 纸张层次 |
| 完整法律文案 | Done for MVP UI；隐私政策和免责声明已拆为独立页面，覆盖 16 种主流语言 | 公开发布前仍需人工法律审校 |
| 自动化视觉审计 | Done；`audit:visual` 检查横向滚动、详情结构和 Proposal 首屏 | 后续扩更多交互 |
| 承诺性文案审计 | Done；`audit:copy` 扫描 source/docs | 后续接入 CI |

## 自动化验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `npm run check` | Pass | 包含 `npm test`、`sample:quality`、`build:h5`、`smoke:h5` |
| `npm run smoke:browser` | Pass | Playwright 覆盖生成和页面切换 |
| `npm run audit:copy` | Pass | 0 risky claims |
| `npm run audit:a11y` | Pass | candidate-detail、proposal、settings、privacy、disclaimer，labels、metadata、key touch targets checked |
| `npm run audit:visual` | Pass | 360、390、1280 视口 0 findings |
| `npm run audit:release-assets` | Pass | PWA metadata and icons are present |
| `npm run smoke:interactions` | Pass | 8 checkpoints，包含隐私页语言切换和免责声明页打开 |
| `npm run sample:manual-review` | Pass | 100 candidates prepared, 25 per MVP industry；signoff template generated |
| `npm run assess:mvp` | Pass with status | blocker: human-review、legal-review；risk: dependency-audit |
| `npm run audit:deps` | Reported | 4 moderate、15 high、0 critical；dependency-risk report generated |

质量采样：

- sample size: 11520
- average score: 91.38
- duplicate instance rate: 0.0688
- banned hits: 0
- readability pass rate: 1

依赖审计摘要：

- `@dcloudio/uni-app` high，direct risk，fix 需要 semver major。
- `@dcloudio/vite-plugin-uni` high，direct risk，fix 需要 semver major。
- `vite` high，direct risk，fix 指向 Vite 8 major。
- `esbuild` moderate，fix 指向 Vite major。

## MVP 发布判断

当前可作为工程侧 H5 MVP 候选进入发布评审，但不建议直接公开发布。

可以作为：

- 内部 H5 功能候选。
- 设计还原评审版本。
- 生成质量和交互链路验证版本。

不应作为公开 MVP 的原因：

- 依赖 high 漏洞未决策。
- 100 个候选人工审查包已准备，但尚未人工签核。
- 法律/隐私文案未完成公开发布级审校。
- 更完整的人工可访问性审查仍可作为公开发布前补充项。

## 后续优化计划

### Phase A：设计阻断修复

1. 修复 Candidate Detail 结构表两列布局。
2. 生成后结果页改成 compact chip header，避免完整筛选面板挤压候选卡。
3. 已补 Proposal/Settings 符号按钮可访问名称和触控尺寸；后续可替换为统一图标组件。
4. 调整 Proposal 首屏，让导出操作和免责声明更接近参考图。

### Phase B：发布前验证补齐

1. 新增 `audit:visual`，覆盖 360、390、1280 宽度。
2. 新增 `audit:copy`，扫描承诺性法律/商标/域名文案。
3. 扩展 `sample:quality` 到 >=10000，并输出每行业唯一候选数和可读性通过率。
4. 已增加关键 UI 交互测试：详情保存、备注输入、Proposal 模板切换、清空数据确认；后续可扩展到复制结果 toast 和空状态。

### Phase C：发布风险处理

1. 评估 uni-app / Vite 依赖升级路径，不直接使用 `npm audit fix --force`。
2. 扩展完整隐私政策、免责声明和法律后缀说明页面。
3. 完成人工候选签核和法律审校。
4. 派生 favicon/PWA/platform icons。

### Phase D：MVP 发布候选复审

1. 重新运行 `npm run check`、`npm run smoke:browser`、`npm run audit:deps`。
2. 归档完整视觉截图。
3. 更新 `docs/MVP_RELEASE_CHECKLIST.md` 和 `docs/IMPLEMENTATION_STATUS.md`。
