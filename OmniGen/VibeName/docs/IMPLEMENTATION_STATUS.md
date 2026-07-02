# VibeName 实现状态

## 总体状态

当前阶段：H5/Mobile MVP preview candidate，正在收敛 public H5 MVP release candidate。

当前已在 `VibeName-Uniapp` 模板工程中完成本地生成器、模块化移动端主界面、候选详情、Founder Whiteboard、Concept Preview、真实 Settings 偏好、分段隐私政策、分段免责声明、18 个主流应用语种选择、Arabic RTL 接线、本地收藏存储、复制入口、质量采样、单元测试、UI 源码审计、i18n 审计、H5 静态 smoke、Playwright 真浏览器 smoke、视觉截图归档、依赖审计基线和 H5 构建。当前可作为 H5 MVP preview candidate 继续验证；生成重复率已达到 public 建议阈值，核心 H5 验证链路和法律/i18n 入口已可复跑。public release 前主要剩余工作是 uni/vite 依赖链升级决策、正式法律审校和最终发布复核。

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
| MVP 发布评估 | Done | `docs/MVP_RELEASE_ASSESSMENT.md` 已建立 |
| 移动端界面设计图 | Done | `designs/` 已建立 6 张真实 App 页面状态设计图 |
| 运行时素材索引 | Done | `assets/` 已建立 App 图标、品牌和空状态素材 |
| 素材缺口审计 | Done | `assets/ASSET_AUDIT.md` 已确认当前 MVP 位图素材覆盖 |

## 功能实现状态

| 功能 | 状态 | 下一步 |
| --- | --- | --- |
| App 工程 | Done | `VibeName-Uniapp` 已创建并可运行 H5 |
| 本地生成器 | Done | `src/core/generator.js` 已实现风格结构、长度结构、候选生成、公式解释、可读性过滤和排序 |
| 词库数据 | Done | `src/data/lexicon.js` 已拆分并扩充 roots、short roots、suffixes、short actions、industry nouns、benefit words、abstract syllables |
| seed 随机 | Done | 已实现可复现 PRNG，并有测试覆盖 |
| 风格过滤 | Done | 支持 SaaS、Abstract、Action |
| 行业过滤 | Done | 支持 AI、DevTools、Fintech、Creator |
| 长度过滤 | Done | 支持 Short、Standard、Descriptive；Descriptive 会增加 benefit/use-case 片段，不再只是放宽长度 |
| 候选评分 | Done | 已实现 readability、brandability、industryFit、brevity、distinctiveness |
| 禁用词过滤 | Done | 已建立基础 banned fragments 和可读性过滤 |
| 候选卡片 UI | Done | 首页展示名称、结构标签、风格/行业标签、评分、理由、复制和收藏；评分显示可由设置控制 |
| Founder Whiteboard | Done | 已实现本地收藏、排序展示、复制全部、移除和预览 |
| 概念卡片预览 | Done | 已实现 App 内预览品牌落地页效果和免责声明 |
| 设置偏好 | Done | Result count、Use seed、Filter hard-to-read names、Show score details 均已接入真实状态和本地持久化 |
| 国际化 | Done | 18 个主流应用语种已接入 Settings 下拉，关键路径、结构标签、评分标签和法律页随 locale 更新；Arabic 使用 RTL |
| 隐私政策 | Done | Settings 可进入分段 Privacy policy，覆盖本地存储、未收集内容、用途、不出售/不远程传输、保留期限、用户控制、安全限制和变更条件 |
| 免责声明 | Done | Settings 可进入分段 Disclaimer，覆盖创意建议、不做可用性检查、商标/品牌风险、非专业建议、按现状提供和发布前自行尽调 |
| 本地存储 | Done | 已通过 `uni.setStorageSync` / `uni.getStorageSync` 保存收藏 |
| 复制导出 | Done | 已接入 `uni.setClipboardData` 和 browser clipboard fallback |
| H5 构建 | Done | `npm run build:h5` 通过 |
| 自动化测试 | Done | `npm test` 覆盖生成器、seed 稳定性、评分、可读性、重复率和 App 状态流 |
| 质量采样 | Done | `npm run sample:quality` 输出 `reports/generation-quality.json` |
| i18n 审计 | Done | `npm run audit:i18n` 检查 18 个主流 locale、key 一致、关键路径不回落英文、可见选项说明本地化、详细法律条款、Arabic RTL、关键组件翻译接线、LegalScreen 和法律入口 |
| H5 静态 smoke | Done | `npm run smoke:h5` 检查 H5 产物、关键文案、test ids、CSS 和静态素材 |
| 视觉截图归档 | Done | `reports/visual/` 已归档桌面、390px、360px 截图和布局指标，`npm run audit:visual` 可审计 |
| 真浏览器 smoke | Done | `npm run smoke:browser` 已使用 Playwright 覆盖生成、详情、保存、Preview、Whiteboard、Settings 12 张卡和移动视口 |
| 依赖审计基线 | Done | `npm run audit:deps` 输出 `reports/dependency-audit.json`，记录 4 moderate + 15 high 均来自已接受的 uni/vite/@intlify/esbuild 链 |
| 发布评估 | Done | `docs/MVP_RELEASE_ASSESSMENT.md` 已记录 preview candidate 判断 |

## 工程模块状态

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 状态层 | Done | `src/app/appState.js` 抽出生成、保存、移除和预览状态流 |
| 文案/展示 helpers | Done | `src/app/labels.js` 抽出 option label/description、structure label、tagline 和 score rows |
| 国际化资源 | Done | `src/app/i18n.js` 维护 18 个主流应用语种、消息表、fallback、RTL direction 和翻译 helper |
| App shell | Done | `src/components/AppShell.vue` |
| 生成页 | Done | `src/components/GeneratorScreen.vue` |
| 候选卡片 | Done | `src/components/CandidateCard.vue` |
| 详情面板 | Done | `src/components/DetailSheet.vue` |
| Whiteboard | Done | `src/components/WhiteboardScreen.vue` |
| Preview | Done | `src/components/PreviewScreen.vue` |
| Settings | Done | `src/components/SettingsScreen.vue` |
| Legal | Done | `src/components/LegalScreen.vue` |
| 共享样式 | Done | `src/styles/app.css`，使用普通 H5 px 布局，避免本地浏览器直接挂载时 rpx/uni 标签样式异常 |

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
- 命名结果需要显示评分、结构、词源类型和理由，避免只给用户一串不可解释文本。
- Style、Industry、Length 必须真实影响输出结构或词源，不允许成为只改标签的虚假选择。
- Settings 中的 Result count、Use seed、Filter hard-to-read names、Show score details 必须真实影响生成或展示，不保留虚假开关。
- 国际化必须是 Settings 中可切换的真实界面状态，不只是在文档里声明支持；主流语言列表必须真实可选，Arabic 必须进入 RTL。
- 隐私政策和免责声明必须在 App 内可达，并使用分段正文明确本地存储、未收集内容、不出售/不远程传输、用户清除控制、安全限制、名称仅为创意建议、按现状提供以及域名/商标/法律可用性需自行验证。
- 文档必须区分规划、已实现和已验证，不能把计划写成完成。
- 为适配当前右侧浏览器预览，`main.js` 保留 uni-app `createApp` 导出，同时在浏览器环境显式挂载 `pages/index/index.vue`。
- 右侧浏览器验收必须包含截图或布局指标，不能只看 DOM 文本和控制台。

## 已知风险

| 风险 | 影响 | 处理建议 |
| --- | --- | --- |
| 科技命名后缀同质化 | 输出容易像模板组合 | 已区分 SaaS compound、Coined word、Action phrase；下一步继续扩词库和采样 |
| 抽象词可读性不稳定 | 用户难以记忆或拼写 | 加强音节和辅音过滤 |
| 域名/商标误解 | 用户可能误以为名称可注册 | Settings 分段免责声明和 Preview 提醒已明确边界；公开发布前仍需法律审校 |
| 词库规模不足 | 重复率高、结果单调 | 已将重复率从 62.02% 降到 7.61%，当前已达 public 建议阈值；后续继续按真实反馈扩词库 |
| 依赖审计风险 | public release 风险 | `npm run audit:deps` 已建立 19 个 moderate/high 基线，来自 uni/vite 依赖链；不建议直接 `--force`，仍需升级决策 |
| 视觉容易过度营销化 | 降低工具效率 | 保持移动端工具首屏，不做营销首页 |

## 下一步建议

1. 评估 uni/vite 工具链升级路径，避免直接 `npm audit fix --force` 破坏构建。
2. 增加复制/收藏/刷新恢复的更多交互级自动化断言。
3. 做 public 发布前最终人工/真机复核。
4. 根据真实反馈继续扩词库和行业覆盖。

## 本轮验证

本轮完成了 `VibeName-Uniapp` 首版实现，并执行了：

- `npm test`：通过，覆盖候选数量/去重/评分/seed 稳定性/可读性、风格结构差异、长度结构差异、候选公式解释、AI 冠词语法、public 重复率阈值、App 设置状态流、18 个主流 locale、locale fallback、Arabic RTL、详细法律文案和发布脚本契约。
- `npm run sample:quality`：通过，采样 11520 个候选，重复率 7.61%，平均分 86.58，通过率 100%，报告输出到 `reports/generation-quality.json`。
- `npm run check`：通过，包含 `npm test && npm run sample:quality && npm run audit:ui && npm run audit:i18n && npm run build:h5 && npm run smoke:h5 && npm run audit:visual && npm run smoke:browser && npm run audit:deps`。
- `npm run build:h5`：通过，正式 H5 构建成功。
- `npm run audit:i18n`：通过，检查 18 个主流应用语种 key 一致、关键路径文案和可见选项说明不回落英文、详细隐私政策/免责声明条款、Arabic RTL、核心组件翻译接线和法律入口。
- `npm run smoke:h5`：通过，检查 H5 产物关键文案、test ids、CSS 和静态素材。
- `npm run audit:visual`：通过，检查 `reports/visual/layout-report.json` 和 3 张截图存在，且桌面/390px/360px 无横向溢出。
- `npm run smoke:browser`：通过，Playwright 真浏览器覆盖生成 8 张卡、详情公式、保存、Preview、Whiteboard、设置切到 12 张卡、隐藏评分、18 语种下拉、切换日语、切换 Arabic RTL、切回简体中文、打开分段隐私政策/免责声明、检查详细法律条款和移动视口无横向溢出，报告输出到 `reports/browser-smoke.json`。
- `npm run audit:deps`：通过，报告输出到 `reports/dependency-audit.json`；当前基线为 4 moderate + 15 high，全部归因于接受名单内的 uni/vite/@intlify/esbuild 工具链风险。
- 右侧浏览器 `http://127.0.0.1:5191/`：已手动验证首页、生成 8 个候选、详情底部面板、保存、Concept Preview、Whiteboard、Settings，控制台无新增 error/warn。
- 源码 UI 审计：`npm run audit:ui` 已覆盖 whiteboard 正常文档流、核心 UI 规则存在、详情底部面板必须限制在 430px App frame 并水平居中。
- 视觉验收：已用右侧浏览器布局指标确认首页恢复为 430px App frame、segmented control/grid、chips/flex、48px primary button 和正常空状态卡片，不再是裸 HTML/压扁状态。
- 桌面宽屏验收：1280x720 下生成 8 个候选，候选卡片不重叠；详情底部面板宽度为 430px，left/right 与 App frame 对齐；sheet actions 未溢出；控制台无 warn/error。
- 移动视口验收：390x844 下无横向溢出，空状态与 Whiteboard bar 间距 18px；详情面板宽度为 375px 并贴合 App frame；候选卡片不重叠，sheet actions 未溢出；控制台无 warn/error。
- 本轮生成器验收：右侧浏览器确认 SaaS / Abstract / Action 会输出不同结构标签和不同名称形态；Length 选到 Descriptive 后会生成三段式名称，例如 `ShiftLabGuided`，详情中显示 `Shift · action`、`Lab · industry`、`Guided · benefit`。
- 本轮选项说明验收：右侧浏览器确认 style、industry、length 下方均显示当前选择的作用说明；390x844 移动视口下说明文字无横向溢出，控制台无 warn/error。
- 本轮设置真实性验收：右侧浏览器确认 Result count 从 8 调到 12 后生成 12 张候选卡；Show score details 关闭后候选卡评分 pill 为 0；390x844 下无横向溢出。
- 本轮法律/i18n 验收：右侧浏览器和 Playwright smoke 确认 Settings 提供 18 个主流应用语种，日语切换后标题更新，意大利语设置行本地化，Arabic 切换后 `.app-shell` 进入 RTL，切回简体中文后 Privacy policy 显示不出售/不远程传输和清除本地数据控制，Disclaimer 显示商标风险、按现状提供和发布前自行尽调。
- 本轮视觉归档：`reports/visual/desktop-1280x720.png`、`mobile-390x844.png`、`mobile-360x800.png` 和 `layout-report.json` 已生成；三个视口候选卡为 8、详情 sheet 贴合 App frame、无横向溢出。

当前未完成：uni/vite 依赖链升级决策、public 发布前正式法律审校、最终人工/真机复核、App/小程序分发评估。
