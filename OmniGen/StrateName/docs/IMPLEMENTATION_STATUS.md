# StrateName 实现状态

更新时间：2026-07-03

## 当前结论

`StrateName/StrateName-Uniapp/` 已完成 H5 MVP engineering candidate：可运行、可生成、可收藏、可进入 Shortlist、可预览 Boardroom Proposal，并已接入本轮独立生成的运行时素材。

当前状态是 **工程侧 H5 MVP 候选**。自动化、构建、质量采样、均衡人工抽样包、人工签核模板、文案审计、独立隐私政策页、独立免责声明页、16 种主流语言法律文案、扩展 a11y 审计、视觉审计、发布资源审计、交互 smoke、浏览器 smoke 和右侧浏览器 390px 检查已通过；公开发布当前为 Hold，仍需要完成人工候选签核、人工法律/商标文案审校和依赖审计风险决策。

本地预览地址：

```text
http://127.0.0.1:5193/
```

## 当前文件状态

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| `StrateName/StrateName-Uniapp/package.json` | Done | H5 dev/build/test/check/smoke/audit 脚本 |
| `StrateName/StrateName-Uniapp/src/data/lexicon.js` | Done | 行业、风格、tone、后缀、禁用片段和结构化词根 |
| `StrateName/StrateName-Uniapp/src/data/legalContent.js` | Done | 16 种主流语言的隐私政策、免责声明和 fallback 逻辑 |
| `StrateName/StrateName-Uniapp/src/core/generator.js` | Done | seed、生成、限定词组合、过滤、评分、理由和提案摘要 |
| `StrateName/StrateName-Uniapp/src/app/appState.js` | Done | 初始状态、Shortlist、备注、Proposal 选择和法律文档语言偏好 |
| `StrateName/StrateName-Uniapp/src/components/` | Done | Generate、Candidate、Detail、Shortlist、Proposal、Settings、Legal Document、TabBar |
| `StrateName/StrateName-Uniapp/src/styles/app.css` | Done | 设计系统色板、移动/桌面响应式、提案预览样式 |
| `StrateName/StrateName-Uniapp/static/` | Done | App icon、PWA icons、favicon、manifest、brand glyph、空状态、印章和 4 类 Proposal 模板底图 |
| `StrateName/StrateName-Uniapp/tests/` | Done | 生成器和状态管理核心测试 |
| `StrateName/StrateName-Uniapp/scripts/` | Done | 质量采样、人工抽样包、发布 gate、承诺性文案审计、扩展 a11y 审计、视觉审计、发布资源审计、H5 静态 smoke、交互 smoke、浏览器 smoke、依赖审计、依赖风险报告、MVP 评估 |
| `StrateName/StrateName-Uniapp/reports/` | Done for current pass | 质量报告、人工抽样包、人工签核模板、文案审计、a11y 审计、视觉审计、发布资源审计、交互 smoke、依赖审计报告、依赖风险报告、MVP 评估和截图 |
| `StrateName/designs/` | Done for design reference | 6 张界面参考图，不等同运行截图 |
| `StrateName/assets/` | Done and integrated | 第一批素材已复制接入 `StrateName-Uniapp/static/` |

## 功能实现状态

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 本地名称生成 | Done | 单次默认生成 8 个候选，不依赖服务端 |
| 结构化词库 | Done for MVP candidate | 已覆盖 4 个 MVP 行业、3 个风格、4 个 tone、企业/法律后缀和行业限定词 |
| 行业过滤 | Done | Finance、Consulting、Real Estate、Logistics |
| 组织形式切换 | Done | 企业语义后缀在 Generate；法律后缀预览在 Settings |
| 候选评分 | Done | 6 个维度，总分 100 |
| 禁用词过滤 | Done | 过滤高风险片段、知名品牌片段和难读组合 |
| 候选详情 | Done | 结构拆解、评分拆解、理由、免责声明和操作按钮；结构表已修复为两列布局 |
| 收藏/Shortlist | Done | 本地保存、取消、备注、复制全部和决策信号 |
| 复制导出 | Done | 单个名称、Shortlist、Proposal 摘要 |
| Boardroom Proposal | Done | Letterhead、Lobby Wall、Card、Cover 四个模板预览；复制和收藏操作已进入移动端首屏 |
| Settings | Done | 默认项、结果数量、过滤/评分开关、法律语言原生下拉、隐私/免责声明独立入口、清空数据 |
| 隐私政策 | Done for MVP UI | 独立页面展示；支持 16 种主流语言和阿语 RTL；公开发布前仍需人工法律审校 |
| 免责声明 | Done for MVP UI | 独立页面展示；支持 16 种主流语言和阿语 RTL；主流程、详情和 Proposal 仍保留短风险提示 |
| H5 构建 | Done | `npm run build:h5` 通过 |
| 自动化测试 | Done for core | `node --test` 通过 12 个核心用例，包含法律 i18n 和独立页面静态检查 |
| 质量采样 | Done | 11520 个候选，重复率 6.88%，禁用命中 0，可读性通过率 100%，平均分 91.38 |
| 人工抽样包 | Prepared | `npm run sample:manual-review` 生成 100 个候选，每个 MVP 行业 25 个，并生成 `manual-review-signoff.template.json`；仍需人工审查签核 |
| 承诺性文案审计 | Done | `npm run audit:copy` 通过，扫描 `src`、`pages` 和 `docs` |
| a11y 自动审计 | Done | `npm run audit:a11y` 通过，覆盖 Candidate Detail、Proposal、Settings、Privacy、Disclaimer 的按钮可访问名称和关键触控尺寸 |
| 自动视觉审计 | Done | `npm run audit:visual` 通过，覆盖 360、390、1280 宽度 |
| 发布资源审计 | Done | `npm run audit:release-assets` 通过，覆盖 title/meta、manifest、favicon、192/512 PWA icons |
| 交互 smoke | Done | `npm run smoke:interactions` 通过，覆盖详情保存、备注持久化、模板切换、清空确认、隐私页语言切换和免责声明页打开 |
| MVP 评估 | Done | `npm run assess:mvp` 输出 `not-public-release-ready`，自动 gate 通过，human-review 与 legal-review 为 blocker，dependency-audit 为 risk |
| 浏览器 smoke | Done | Playwright smoke 通过；右侧浏览器手动检查通过 |
| 依赖审计 | Reported | `reports/dependency-audit.json`：4 moderate、15 high、0 critical；`reports/dependency-risk.md` 显示 direct risk 来自 `@dcloudio/uni-app`、`@dcloudio/vite-plugin-uni`、`vite`，修复链涉及 major upgrade |

## 验证记录

| 验证 | 结果 |
| --- | --- |
| `npm test` | Pass；12 个用例 |
| `npm run sample:quality` | Pass；11520 candidates，avg 91.38，duplicate 0.0688 |
| `npm run sample:manual-review` | Pass；100 candidates，25 per MVP industry，并生成 signoff template |
| `npm run audit:copy` | Pass；0 risky claims |
| `npm run build:h5` | Pass |
| `npm run smoke:h5` | Pass；8 个运行时素材存在 |
| `npm run audit:a11y` | Pass；candidate-detail、proposal、settings、privacy、disclaimer，0 findings |
| `npm run audit:visual` | Pass；3 个视口、0 findings |
| `npm run audit:release-assets` | Pass；PWA metadata and icons are present |
| `npm run smoke:interactions` | Pass；8 checkpoints |
| `npm run check` | Pass；串联 test、quality sample、manual review sample、copy audit、build、static smoke、a11y、visual、release assets、interaction smoke、dependency audit、MVP assessment |
| `npm run smoke:browser` | Pass；生成、页面切换、隐私/免责声明页面和控制台检查通过 |
| `npm run audit:deps` | Report only；19 个 npm audit issue，并生成 `reports/dependency-risk.md` |
| `npm run assess:mvp` | Pass with status；`not-public-release-ready`，blocker: human-review、legal-review，risk: dependency-audit |
| 右侧浏览器 390px | Pass；title、manifest、favicon、description、顶部按钮 aria-label、Generate 页面和无横向溢出均正常 |
| 右侧浏览器默认视口 | Pass；Proposal 操作可见，console 无 error/warning |
| 视觉截图 | Saved；`StrateName-Uniapp/reports/visual-audit/` |

## 当前风险

| 风险 | 等级 | 处理方式 |
| --- | --- | --- |
| 人工候选签核未完成 | High | 已生成 100 候选样本和 signoff template；公开发布前需生成 `reports/manual-review-signoff.json` |
| npm audit 仍有 high 漏洞 | High | 已归档依赖风险报告；不要直接 `npm audit fix --force`，需评估 uni-app / Vite major upgrade 版本链 |
| 合规/法律文案未人工审校 | High | 公开发布前必须审校 16 种语言免责声明、隐私政策和法律后缀说明 |
| 词库仍偏英文商业命名 | Medium | 后续扩行业词根和地区语感；100 个候选审查包已准备 |
| 原生平台图标矩阵未派生 | Medium | 发布 App/小程序前补齐；H5 PWA 192/512 已派生 |
| 真实 PNG 导出未实现 | Low | MVP 当前只承诺 App 内预览和复制摘要 |

## 推荐下一步

1. 使用 `reports/manual-review-sample.md` 和 `reports/manual-review-signoff.template.json` 完成人工抽样签核，检查真实品牌、高混淆词和冒犯性内容。
2. 公开发布前进行人工法律/商标/隐私文案审校。
3. 处理依赖审计报告，确认是否升级 uni-app / Vite 版本链或记录接受风险。
4. 若发布 App/小程序，派生对应平台完整图标矩阵。
5. 若要承诺导出图片，再实现真实 PNG/PDF 导出链路。
