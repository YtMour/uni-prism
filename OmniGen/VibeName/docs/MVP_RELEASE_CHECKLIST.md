# VibeName MVP 发布清单

## 发布判断

当前结论：VibeName 已达到 H5 MVP preview candidate，并已完成多项 public H5 MVP release candidate 前置门槛；尚未宣称最终 public MVP release。

原因：

- 首版生成器、UI、存储、复制、白板、概念预览、分段隐私政策、分段免责声明和 18 个主流应用语种选择已经实现。
- 单元测试、质量采样、UI 源码审计、i18n 审计、H5 静态 smoke、Playwright 真浏览器 smoke、H5 构建、视觉截图归档和依赖审计基线已通过。
- 生成质量重复率已从 21.51% 降到 7.61%，达到 public release 建议阈值。
- public release 仍需 uni/vite 工具链升级决策、正式法律审校和最终发布前复核。

## MVP 功能门槛

| 门槛 | 当前状态 | 说明 |
| --- | --- | --- |
| App 工程可运行 | Done | `VibeName-Uniapp` H5 可运行 |
| 本地名称生成 | Done | 结构化词库和规则生成已实现，风格/行业/长度会改变结构或词源 |
| 3 种命名风格 | Done | SaaS、Abstract、Action |
| 至少 4 个行业过滤 | Done | AI、DevTools、Fintech、Creator |
| 长度控制 | Done | Short、Standard、Descriptive；Descriptive 会加入 benefit/use-case 片段 |
| 候选评分 | Done | 5 个评分维度和总分 |
| 禁用词过滤 | Done | 基础 banned fragments 和可读性过滤 |
| 候选卡片 | Done | 名称、标签、评分、理由、复制、收藏 |
| Founder Whiteboard | Done | 收藏、排序、移除、复制全部、预览 |
| 设置偏好 | Done | Result count、Use seed、Filter hard-to-read names、Show score details 均真实影响状态或展示 |
| 国际化 | Done | Settings 中 18 个主流应用语种可切换，关键路径和法律页随 locale 更新，Arabic 使用 RTL |
| 隐私政策 | Done | Settings 可进入分段 Privacy policy，明确本地存储、未收集内容、用途、不出售/不远程传输、保留期限、用户控制、安全限制和变更条件 |
| 本地持久化 | Done | 收藏使用本地 storage |
| 概念卡片预览 | Done | App 内预览，不承诺 PNG 保存 |
| 免责声明 | Done | Settings 可进入分段 Disclaimer，明确创意建议、不做可用性检查、商标/品牌风险、非专业建议、按现状提供和发布前自行尽调 |

## H5 发布候选门槛

| 门槛 | 命令/证据 | 当前状态 |
| --- | --- | --- |
| 单元测试 | `npm test` | Done |
| 生成质量采样 | `npm run sample:quality` | Done，报告在 `reports/generation-quality.json` |
| i18n 审计 | `npm run audit:i18n` | Done，检查 18 个主流 locale、key 一致、关键路径不回落英文、可见选项说明本地化、详细法律条款、Arabic RTL、关键组件翻译接线和法律入口 |
| H5 构建 | `npm run build:h5` | Done |
| H5 静态 smoke | `npm run smoke:h5` | Done，检查构建产物、关键文案、test ids、CSS 和素材 |
| 视觉归档审计 | `npm run audit:visual` | Done，检查 `reports/visual/` 截图和布局指标 |
| 真浏览器 smoke | `npm run smoke:browser` | Done，Playwright 覆盖生成、详情、保存、Preview、Whiteboard、Settings、语言切换、隐私政策、免责声明和移动视口 |
| 依赖审计基线 | `npm run audit:deps` | Done，记录 4 moderate + 15 high 均来自接受名单内的 uni/vite/@intlify/esbuild 链 |
| 发布评估 | `docs/MVP_RELEASE_ASSESSMENT.md` | Done |
| 完整检查串联 | `npm run check` | Done，当前串联 `npm test && npm run sample:quality && npm run audit:ui && npm run audit:i18n && npm run build:h5 && npm run smoke:h5 && npm run audit:visual && npm run smoke:browser && npm run audit:deps` |

## 建议验收阈值

| 指标 | MVP 阈值 |
| --- | --- |
| 单次候选数量 | 默认 8 个 |
| 批量采样规模 | 至少 1000 次 |
| MVP preview 重复率 | 不高于 25% |
| Public release 建议重复率 | 不高于 8% |
| 平均总分 | 不低于 70 |
| 基础过滤通过率 | 不低于 70% |
| 移动端最小宽度 | 360px 无横向滚动 |
| 收藏恢复 | 刷新后保留 |
| 复制操作 | 成功或明确失败反馈 |

## 发布前人工回归清单

| 场景 | 检查点 |
| --- | --- |
| 首次打开 | 首页直接进入生成工具，不是营销页 |
| 生成名称 | 点击 Generate 后出现候选列表 |
| 风格切换 | 三种风格输出气质有明显差异 |
| 行业过滤 | 行业选择能影响结果和理由 |
| 长度过滤 | 超短、标准、描述型长度和结构符合预期 |
| 选项说明 | Style、Industry、Length 下方说明当前选择会改变什么 |
| 候选详情 | 能看到评分拆解、结构标签、词源片段类型和生成理由 |
| 设置偏好 | Result count、Use seed、Filter hard-to-read names、Show score details 真实影响输出或展示 |
| 语言切换 | 18 个主流应用语种均在 Settings 下拉中可选；切换日语后设置标题更新，切换 Arabic 后页面进入 RTL，切回简体中文后法律页文案更新 |
| 隐私政策 | 分段显示本地存储、未收集内容、用途、不出售/不远程传输、保留期限、清除本地数据、剪贴板边界、安全限制和变更条件 |
| 收藏 | 收藏后进入 Whiteboard |
| 刷新恢复 | 收藏、最近生成和偏好不丢失 |
| 复制 | 单个名称和全部候选均可复制 |
| 概念预览 | 名称、tagline 和标签不重叠 |
| 移动端显示 | 360px 宽度下按钮、卡片、底部栏不挤压 |
| 免责声明 | 分段显示创意建议、不做域名/商标/公司注册/账号可用性检查、商标风险、非专业建议、按现状提供和发布前自行尽调 |

## 当前自动化覆盖

| 检查 | 覆盖范围 |
| --- | --- |
| `npm test` | 生成器、seed 稳定性、评分、可读性、风格结构差异、长度结构差异、候选公式解释、AI 冠词语法、public 重复率阈值、保存/移除/预览/设置状态流 |
| `npm run sample:quality` | 11520 个候选采样、重复率、平均分、通过率、结构分布和违规项；当前阈值 `duplicateRate <= 0.08` |
| `npm run audit:ui` | whiteboard 不允许 sticky/fixed 覆盖内容、核心 UI 规则存在、详情面板限制在 430px App frame 并居中 |
| `npm run audit:i18n` | 18 个主流应用语种 key 一致、关键路径文案和可见选项说明不回落英文、详细法律条款、Arabic RTL、关键组件 `t(...)` 接线、Settings 法律入口和 LegalScreen 存在 |
| `npm run build:h5` | uni-app H5 正式构建 |
| `npm run smoke:h5` | 构建产物关键文案、test ids、设置控件、语言控件、法律入口、公式说明、CSS 和静态素材 |
| `npm run audit:visual` | `reports/visual/layout-report.json` 和桌面/390px/360px 截图，检查 8 张候选卡、详情 sheet 宽度和横向溢出 |
| `npm run smoke:browser` | Playwright 真浏览器生成、详情公式、保存、Preview、Whiteboard、Settings 12 张卡、隐藏评分、18 语种下拉、日语切换、Arabic RTL、简体中文分段法律页、详细法律条款和移动视口无横向溢出 |
| `npm run audit:deps` | `reports/dependency-audit.json`，固定当前 4 moderate + 15 high uni/vite 工具链风险基线 |
| 右侧浏览器指标 | 1280x720、390x844、360x800 下检查选项说明、候选差异化、详情词源、设置真实生效、横向溢出、卡片重叠、控制台 warn/error |

## 公开发布阻断

| 阻断 | 严重度 | 处理建议 |
| --- | --- | --- |
| uni/vite 工具链升级未决 | High | 已建立审计基线；单独评估升级，不直接 `--force` |
| 正式法律审校未完成 | Medium | 当前法律页为产品透明说明和免责声明草案；public release 前需要正式审校 |
| App/小程序真机未评估 | Medium | H5 MVP 后再进入 App/小程序分发评估 |

## 后续优化优先级

1. 评估 uni/vite 工具链升级路径。
2. 增加复制、刷新恢复和更多 Whiteboard 操作的交互级自动化覆盖。
3. 做 public 发布前最终人工/真机复核。
4. 根据用户反馈决定是否接入域名查询、AI 增强和 PNG 导出。
