# MVP Release Assessment

更新时间：2026-06-29

## 结论

当前 MythosGen 可以作为 **内部试玩 / 设计验证 MVP**，并已接近 **公开 H5 MVP 候选**；但仍不建议直接公开发布。

原因是核心生成、过滤、收藏、复制、Pocket、PNG/SVG Export、设置/隐私/免责声明、H5 smoke、H5 构建和采样质量门槛已经打通；但剩余 npm audit 风险、发布素材和 App 端验证仍未达到公开发布标准。

## 当前可发布级别

| 级别 | 结论 | 说明 |
| --- | --- | --- |
| 内部试玩 | 可以 | 核心页面和主要交互已可用，H5 构建通过 |
| 小范围设计评审 | 可以 | 首页、Filter、Pocket、Export、Settings 已完成视觉 smoke |
| 公开 H5 MVP | 接近候选，但暂不建议 | 生成质量和 PNG/SVG 导出已改善；仍需处理发布素材和剩余 npm audit 风险 |
| App 商店发布 | 不可 | 图标/启动图未替换，未做 App 端打包验证 |

## 已满足的 MVP 条件

- 单页生成体验已完成。
- 支持 Elf、Dragon、Spell 三类 Realm。
- 支持 Gender、Alignment、Tone 过滤。
- 支持复制、收藏、删除和本地存储。
- Pocket 收藏面板已具备筛选、选择、复制和删除。
- Export Card 已支持 H5 PNG/SVG 下载，并有导出失败提示。
- Settings 已包含本地偏好、Privacy Policy、Disclaimer、当前实现和后续计划。
- H5 smoke 合约脚本已接入 `npm run check`。
- H5 构建通过。
- 自动化测试覆盖 12 个文件、31 个用例。
- `package-lock.json` 已生成。
- `manifest.json` 已清理模板 Android 权限。
- 首页、Filter、Pocket、Export、Settings 已做视觉 smoke。
- 生成质量采样已改善：900 次采样唯一结果 836 个，重复率 7.11%。
- `vitest` 已升级到 3.2.6，npm audit 的 critical 漏洞已消除。

## 公开发布阻断项

| 阻断项 | 影响 | 建议处理 |
| --- | --- | --- |
| npm audit 风险 | 当前仍报告 27 个漏洞，其中 9 high、6 moderate、12 low；critical 已消除 | 审计 uni/vite 依赖链，等待兼容升级路径或形成明确发布风险说明 |
| 图标/启动图未替换 | 品牌完整度不足 | 替换 manifest 图标、启动图和 H5 favicon |
| App 端未验证 | H5 可构建不等于 App 可发布 | 执行 App 打包和真机 smoke |
| i18n 未接入 | 设置页和政策为英文，后续多市场发布受限 | 发布目标为英文时可保留；若面向中文市场需接入 i18n |

## 发布前最小完成清单

### P0 必须完成

1. 处理或记录剩余 npm audit 风险，尤其是 high 项。
2. 替换正式图标、启动图和 favicon。
3. 若目标包含 App，完成 App 打包和真机 smoke。

### P1 强烈建议

1. 替换 App 图标、启动图和 favicon。
2. 继续扩充每个 Realm 的音节素材并根据采样报告调权重。
3. 增加空状态、复制失败和存储失败提示。
4. 固化视觉截图基准，覆盖首页、Filter、Pocket、Export、Settings。
5. 将 Settings 中政策文案纳入 i18n 或明确英文发布策略。

## 后续完善路线

### Sprint 1: Release Hardening

- 处理剩余 npm audit high/moderate 风险。
- 替换发布图标、启动图和 favicon。
- 保持采样门槛并继续优化生成权重。

### Sprint 2: Creator Loop

- 将当前 H5 PNG 下载升级为 App 原生相册保存能力。
- 增加 App 端导出失败降级提示。
- Pocket 批量复制和导出选中真正可用。

### Sprint 3: Content Quality

- 扩充 Elf、Dragon、Spell 音节库。
- 增加重复规避和近期结果缓存。
- 根据采样报告调整权重。

### Sprint 4: Public Packaging

- 替换图标、启动图、favicon。
- 准备 H5 发布说明、截图和商店文案。
- 如果目标包含 App，执行 App 端打包与真机 smoke。
