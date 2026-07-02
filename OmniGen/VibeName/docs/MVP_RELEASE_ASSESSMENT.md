# VibeName MVP 发布评估

评估日期：2026-07-02

## 结论

当前结论：VibeName 已达到 H5 MVP preview candidate，并基本达到 public H5 MVP release candidate 的产品和验证门槛；尚未宣称最终 public MVP release。

可以继续用于本地 H5 预览、产品演示和命名体验测试。分段隐私政策、分段免责声明、18 个主流应用语种选择和 Arabic RTL 接线已经进入应用和自动化检查链。公开发布前仍需要对 uni/vite 工具链漏洞基线做升级决策，完成正式法律审校，并完成最终人工/真机复核。

## 已通过门槛

| 门槛 | 证据 | 状态 |
| --- | --- | --- |
| 本地 H5 可构建 | `npm run build:h5` | Pass |
| 完整检查链 | `npm run check` | Pass |
| 单元测试 | `npm test` | Pass |
| UI 源码审计 | `npm run audit:ui` | Pass |
| i18n 审计 | `npm run audit:i18n` | Pass |
| H5 静态 smoke | `npm run smoke:h5` | Pass |
| 视觉归档审计 | `npm run audit:visual` | Pass |
| Playwright 真浏览器 smoke | `npm run smoke:browser` | Pass |
| 依赖审计基线 | `npm run audit:deps` | Pass |
| 生成质量采样 | `npm run sample:quality` | Pass |
| 右侧浏览器运行态 | 1280x720 + 390x844 + 360x800 指标和截图检查 | Pass |
| 法律和国际化入口 | Settings 18 语种选择、Arabic RTL、分段 Privacy policy、分段 Disclaimer | Pass |

## 生成质量结果

报告路径：`VibeName-Uniapp/reports/generation-quality.json`

| 指标 | 当前值 | MVP preview 阈值 | 状态 |
| --- | ---: | ---: | --- |
| 批次数 | 1440 | >= 125 | Pass |
| 候选总数 | 11520 | >= 1000 | Pass |
| 唯一名称 | 10643 | - | Info |
| 重复实例率 | 7.61% | <= 8% public 建议阈值 | Pass |
| 平均分 | 86.58 | >= 70 | Pass |
| 通过率 | 100% | >= 98% | Pass |
| Short 平均长度 | 7.80 | <= 10 | Pass |
| Standard 平均长度 | 11.48 | - | Info |
| Descriptive 平均长度 | 14.86 | - | Info |

结构分布：

| 结构 | 数量 |
| --- | ---: |
| SaaS compound | 3840 |
| Coined abstract | 3840 |
| Verb noun | 3840 |

## 已知阻断

| 阻断 | 严重度 | 说明 | 处理计划 |
| --- | --- | --- | --- |
| uni/vite 工具链升级未决 | High | `npm run audit:deps` 已记录 19 vulnerabilities 基线，来自 uni/vite/@intlify/esbuild 链 | 不直接 `--force`；单独评估 uni 工具链升级 |
| 正式法律审校未完成 | Medium | 当前分段隐私政策和免责声明为 MVP 透明说明草案 | public release 前由具备资质的法律顾问复核 |
| App/小程序分发未评估 | Medium | 当前只评估 H5 | H5 发布后单独评估 |

## 发布判断

| 发布类型 | 判断 |
| --- | --- |
| 本地 H5 预览 | 可以 |
| 内部 MVP preview | 可以 |
| 公开 H5 MVP | 候选基本达成，依赖升级决策、正式法律审校和最终复核后再发布 |
| App / 小程序分发 | 未评估 |

## 下一轮最短路径

1. 对 uni/vite 依赖链做升级可行性评估，避免直接 `npm audit fix --force` 破坏构建。
2. 完成分段隐私政策和免责声明的正式法律审校。
3. 增加复制、保存、刷新恢复的交互级自动化断言。
4. 完成 public 发布前最终人工/真机复核。
