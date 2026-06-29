# Implementation Status

更新时间：2026-06-29

## 当前状态

MythosGen 已从文档构建进入初步 H5 原型阶段。`OmniGen/` 是随机生成系列 App 的管理文件夹，根目录只保留 README 管理和介绍文档；`FantasyNameGenerator/` 是当前 MythosGen App 项目文件夹。`FantasyNameGenerator-Uniapp/` 已包含单页生成体验、基础生成器模块、运行时素材和测试/构建脚本。

## 已完成

- 建立 OmniGen 总文档入口。
- 将首个子项目明确为 MythosGen。
- 建立 MythosGen 产品规划。
- 建立生成系统设计。
- 建立设计系统说明。
- 建立路线图。
- 整理文档索引。
- 明确文件夹职责：根目录管理系列，`FantasyNameGenerator/` 承载 MythosGen App。
- 索引 `design/` 下设计参考图与透明素材，新增 `design/ASSET_INDEX.md`。
- 将运行时素材复制到 `FantasyNameGenerator-Uniapp/static/mythos/`。
- 建立 `package.json`、`vite.config.js` 和 Vitest 生成器测试。
- 实现 `common/generator.js`，支持 Elf、Dragon、Magic 三类 Realm、seed、metadata 与收藏去重。
- 实现首页初版 UI：生成画布、Realm 切换、过滤器底部抽屉、复制、收藏口袋和导出预览骨架。
- 将首页拆分为 `components/mythos/` 下的 Topbar、ResultStage、RealmControl、ActionBar、FilterSheet、PocketSheet、ExportSheet。
- 将收藏去重、上限、删除和本地存储 key 抽到 `common/favorites.js`，并补充 Vitest 覆盖。
- 修复本地预览不可访问问题：5179 端口此前没有开发服务器监听；现在通过 `npm run dev:h5` 启动并保持访问。
- 对比 `home-generation.png` 与 `filters-sheet-v2.png` 后重整首页视觉：去掉结果区厚重卡片感，改为顶部三段式、无外框结果舞台、Realm 分段控件和工具栏式操作。
- 重整过滤器抽屉为分段控件结构，补充 grabber、居中标题、关闭图标、Reset / Apply 操作。
- 继续调整首屏高度与留白：页面主容器改为纵向弹性布局，结果舞台占中间弹性空间，底部 Realm 与操作栏贴近首屏底部，并增加舞台底部分隔线避免断层。
- 重新设计顶部区域，移除与底部 Realm 分段控件冲突的 Realm 下拉菜单；顶部只展示当前 Realm 状态，并提供 Pocket 与声明/设置两个独立入口，Realm 切换保持在底部唯一入口。
- 区分 Pocket 与 Favorite 的视觉语义：顶部 Pocket 使用书本/列表符号作为“查看已收藏”入口，底部 Favorite 保留星标作为“收藏当前结果”动作。
- 修复 Realm 分段控件圆角异常：移除内部分隔线方案，改为外层轨道 + 三个等宽内层按钮，三项统一圆角、统一间距。
- 重构 Pocket 面板：从简陋底部 sheet 改为与 App 容器同宽的全高收藏库面板，补充 Realm tabs、选择圆点、图标化复制/删除、选中计数和导出选中入口。
- 将右上角入口明确为声明/设置入口，新增 `pages/settings/settings.vue`，覆盖默认 Realm、触感反馈和动画强度设置。
- 新增 `common/policy.js`，将 Privacy Policy、Disclaimer、Current Implementation 和 Next Improvements 拆成结构化内容，由设置页统一渲染，避免长文硬编码在模板中。
- 修复 H5 `uni-button` 默认样式导致底部工具按钮出现残留边框/半卡片的问题。
- 加固 H5 触控交互链：主页面和组件用户入口统一从 `@click` 改为 uni-app `@tap`，关键触发逻辑从模板内联 `$emit` 改为具名 methods，并新增 `data-testid` 供自动化点击回归使用。
- 补充 `tests/policy.test.js`，覆盖本地生成/本地存储声明、创意用途免责声明、当前实现摘要和后续改进计划。
- 补充 `tests/tapInteractionContract.test.js` 与 `tests/realmControlContract.test.js`，覆盖触控事件契约和 Realm 切换事件契约。
- 新增 `MYTHOSGEN_QA_VERIFICATION.md`，记录 `npm run check`、H5 smoke 范围、外部浏览器验证结论和 Codex 右侧内置浏览器事件层脱节问题。
- 修复 Export 视觉问题：将 Export 从底部 sheet 调整为独立全高预览面板，隔离为 `export-panel` 样式，避免污染 Filter 底部抽屉，并消除外层滚动条和底部按钮贴边问题。
- 修复右上角 Pocket 历史/收藏状态显示：移除外露数字角标，改为按钮内嵌小金点，避免裁切和压住图标。
- 继续优化首页顶部与底部导航视觉：右上角 Pocket/声明入口改为无边框图标按钮，补齐 `uni-button::after` reset；底部操作栏从竖线切分表格改为浅色胶囊工具条。
- 新增 `MVP_RELEASE_ASSESSMENT.md`，明确当前版本可用于内部试玩和设计验证，但不建议直接公开发布。
- 扩充 Elf、Dragon、Magic 词库，并将 seed 随机源改为更适合连续 seed 的哈希随机；`npm run sample:quality` 当前 900 次采样唯一结果 836 个，重复率 7.11%。
- 将采样质量门槛纳入 `tests/sampler.test.js`，要求公开 MVP 采样总重复率不超过 35%，单 Realm 不超过 45%。
- Export Card 已增加 PNG 下载入口，并保留 SVG 下载入口；浏览器不支持图片导出时会给出明确失败提示。
- `tests/exportCard.test.js` 已覆盖 PNG 文件名和导出失败提示。
- 将 Vitest 从 1.6.1 升级到 3.2.6，移除 npm audit 中的 critical 漏洞；同时修复 `package-lock.json` 中无版本 optional 占位包导致 npm 10 `Invalid Version` 的安装问题。
- 当前 `npm run check` 在 Vitest 3.2.6 下通过：12 个测试文件、31 个用例、H5 smoke 和 H5 build 均通过。

## 未完成

- Export Card 已支持 H5 PNG/SVG 下载；App 原生相册保存尚未实现。
- 尚未替换 manifest 图标和 App 启动图。
- 设置页当前为英文产品文案，尚未接入完整 i18n。
- `npm audit --audit-level=moderate` 当前仍报告 27 个漏洞，其中 9 个 high、6 个 moderate、12 个 low；critical 已通过升级 Vitest 消除，剩余风险主要来自 uni/vite 依赖链，`npm audit fix --force` 会走破坏性升级，不建议在未验证 uni-app 兼容性前执行。
- 右侧 Codex 内置浏览器存在手动点击不响应的环境问题；外部浏览器和自动化坐标点击链路可用，后续需补独立 smoke 脚本减少人工判断误差。
- `manifest.json` 已清理模板 Android 权限；若进入 App 发布仍需替换图标/启动图并做 App 端打包验证。
- 已新增 `npm run smoke:h5` 和 `npm run sample:quality`，并将 smoke 接入 `npm run check`。

## 主要风险

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 生成质量回归 | 用户会觉得随机结果廉价 | 保留采样门槛，后续继续按报告调权重 |
| UI 过度装饰 | 破坏移动端效率 | 遵守极简画廊风，结果优先 |
| 功能范围膨胀 | MVP 延迟 | Phase 1 只做生成、过滤、收藏、复制 |
| App 原生导出未验证 | H5 下载能力不能等价为 App 相册保存 | 进入 App 发布前补原生保存和真机 smoke |
| 内置浏览器事件层脱节 | 容易误判为业务代码点击失效 | 以外部浏览器和自动化 smoke 作为验收主链路，右侧浏览器异常记录到 QA 文档 |

## 推荐下一步

1. 继续评估 uni/vite 依赖链的 high/moderate audit 风险，等待可兼容升级路径或形成发布风险说明。
2. 替换正式图标、启动图和 H5 favicon。
3. 若目标包含 App，补 App 原生相册保存和真机 smoke。
4. 继续把共享 sheet 样式收敛为更小的样式模块，减少重复 CSS。
5. 重新裁切小尺寸透明素材，替换当前顶部与 Realm 控件里的文本符号。
6. 补充收藏口袋入口的长期位置：当前 Favorite 已可保存，Pocket 列表入口后续可放入底部 Favorite 长按或独立资料库页。
7. 若进入多语言发布准备，将设置页政策与免责声明内容纳入 i18n 管理。
8. 按 `MVP_RELEASE_ASSESSMENT.md` 的 P0 清单继续处理生成质量、npm audit、发布素材和 App 端验证。
