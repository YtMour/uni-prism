# CampPack 实现状态

更新时间：2026-06-26

## 当前状态

项目已进入 H5 MVP 候选阶段。`CampPack-Uniapp` 内已有 uni-app / Vue 3 工程，当前单页实现已从纯演示数据推进到本地 repository、内置模板数据、H5 持久化、Pack / Setup / Leave 独立状态和自动化 H5 smoke；仍未完成 App 真机构建、完整清单 CRUD、隐私政策和商店发布物料。

## 已完成

- 梳理 README 中的产品定位、视觉方向、核心功能和技术设想。
- 将 README 调整为项目入口。
- 新增产品规格、设计系统、技术方案、路线图、QA 清单。
- 明确 MVP 与后期功能边界。
- 明确 Pack / Setup / Leave 三阶段状态需要独立存储。
- 基于设计系统生成首批视觉探索资产，保存于 `assets/design/`。
- 重新生成 6 张页面级设计稿，保存于 `assets/design/screens/`，作为后续 App 页面实现依据。
- 单独生成 App 图标和 10 个应用内素材图标，保存于 `assets/design/icons/`。
- 初始化 `CampPack-Uniapp` 工程，并实现 H5 可运行单页原型。
- 实现 Lists / Templates / Checklist Detail / Gear Editor / Settings 的页面状态切换骨架。
- 接入 `static/icons/ui/` 下的轻量 PNG 图标资源。
- 修复应用图标和应用内图标在圆形容器、模板卡片、设置列表和底部导航中的裁切/贴边问题。
- 将底部导航栏调整为不透明纸张色遮挡层，避免滚动内容透出重叠。
- 拆分 `IconMark`、`AppTabbar`、`TemplateCard`、`ChecklistCard`、`SettingsSection` 组件。
- 新增 `npm run audit:architecture`，防止演示数据、图标映射和重复卡片结构重新回流到 `pages/index/index.vue`。
- 新增 `npm run audit:visual`，检查图标安全边距、底部导航不透明、滚动区底部预留和关键容器裁切策略。
- 修复组件化后的 H5 回退：`IconMark` 改用 uni-app `image mode="aspectFit"` 并自带尺寸规则；`TemplateCard` 自带卡片布局样式；Templates 筛选项固定四列单行显示。
- 修复拆分组件后的样式穿透问题：`ChecklistCard`、`SettingsSection`、`AppTabbar` 现在自带核心布局样式，避免列表卡、设置列表和底部导航依赖父页面全局样式。
- 修复页面切换继承滚动位置导致详情页顶部被裁切的问题，统一通过 `setScreen()` 切换页面并重置 `scroll-view`。
- 修复 H5 `button` 默认样式造成的按钮高度和文本垂直偏移问题，统一关键按钮、筛选项、分段控件的尺寸和对齐。
- 补齐主要点击反馈：模板筛选、模板导入、清单标题切换、模式切换、装备勾选、Leave 重置、编辑器数量/单位/关键装备开关、删除和保存。
- 为主要交互控件补充稳定测试标识，右侧浏览器验证不再依赖不稳定的渲染标签。
- 新增 `data/templates.js`，内置 Solo Bushcraft、Family Glamping、Ultralight Backpacking 三套 MVP 模板及装备条目。
- 新增 `services/campRepository.js`，集中处理 schema、模板导入、清单读取保存、装备更新删除、Leave 重置和三阶段状态切换。
- H5 storage 已通过 `uni.*StorageSync` 加 `localStorage` fallback 实现刷新后保留。
- 清单首页、模板导入、详情页勾选、Leave reset、Gear Editor 保存/删除已接入 repository，不再只依赖页面内存演示数组。
- Pack / Setup / Leave 已按独立 `checkedItemIds` 存储，Leave reset 不覆盖 Pack / Setup。
- 新增 `npm test`，覆盖模板导入持久化、三阶段独立状态和 Leave reset 不覆盖其他阶段。
- 新增 `npm run smoke:h5`，覆盖 H5 模板筛选/导入、刷新持久化、三阶段切换、Leave reset、编辑保存和移动视口横向溢出检查。
- 补齐空白清单创建、当前清单删除、装备名称/重量/备注编辑、设置页单位切换和单位偏好持久化。
- 扩展 `npm run smoke:h5`，覆盖空白清单创建/删除、装备完整字段编辑、设置单位切换和刷新后单位持久化。
- 补齐清单重命名、复制、装备新增、装备分类调整、隐私页入口和设置页数据重置。
- 扩展 repository 测试与 H5 smoke，覆盖复制清单独立 item id、数据重置回到种子数据、隐私页打开和新增装备链路。
- 补齐删除/重置确认弹层、分类菜单按钮、语言偏好切换、JSON 导出和 JSON 导入。
- 扩展 repository 测试与 H5 smoke，覆盖导出/导入有效数据包、无效导入拒绝、语言持久化、确认弹层和导入后数据恢复。
- 新增 `i18n/messages.js`，覆盖 English、中文、Español、Français、Deutsch、日本語、한국어、Português 八种主流语言。
- 隐私页扩展为隐私政策和户外安全免责声明双段内容，并接入多语言文案。
- 主要入口文案已接入语言切换，包括首页副标题、清单标题、模板、设置、隐私和免责声明。
- 已完成 `npm test`、`npm run audit:visual`、`npm run audit:architecture`、`npm run build:h5`、`npm run smoke:h5` 和右侧浏览器 430 x 844 移动视口视觉/点击链路检查。

## 未完成

- 多页面路由拆分与组件化。
- Pinia store。
- App 图标和应用内素材图标的矢量重绘与多尺寸导出。
- App 构建验证与真机 smoke。
- 仍需把所有长尾按钮、表单字段和模板内容继续细化到完整逐字国际化。
- App 图标和启动图正式平台尺寸导出。
- 隐私政策和发布说明页面。

## 关键决策

| 决策 | 理由 |
| --- | --- |
| MVP 不做账号和云同步 | 保持离线优先，降低实现和隐私复杂度 |
| 重量统一以克存储 | 保证单位换算一致，避免精度漂移 |
| 三阶段状态独立保存 | 防止现场搭建和撤营操作覆盖行前记录 |
| Storage 先行，SQLite 后置 | 当前没有数据规模证据支撑过早引入 SQLite |
| 文档先拆分再开发 | 当前 README 是愿景稿，直接开发容易范围膨胀 |
| 页面实现优先参考 `assets/design/screens/` | 宣传图不作为 App 页面构建依据 |
| 图标容器默认不裁切 | 生成类 PNG 容易带细边和贴边内容，页面层统一留安全边距更稳 |
| 底部导航必须不透明 | 移动端滚动内容透出会造成状态重叠和误读 |
| 页面状态机和展示组件分离 | 降低单文件冲突概率，后续接入真实 store 时迁移成本更低 |
| 子组件自带核心布局样式 | 避免组件化后依赖父页面样式穿透导致图标缺失和卡片撑爆 |
| H5 storage 增加 `localStorage` fallback | 当前浏览器 smoke 需要刷新后真实保留，不能只依赖 uni storage 运行时实现 |

## 当前风险

- 当前仍是单页状态机，虽然已接 repository，但还不是最终多页面架构。
- 导入/导出当前是文本 JSON 面板，后续 App 端应接系统分享和文件选择器。
- 当前国际化先覆盖主流程和政策页，模板数据和全部 microcopy 后续还要继续补齐。
- 删除/重置确认已存在，但视觉上仍是轻量弹层，发布前可再做文案和危险态细节打磨。
- 模板内容需要后续按目标市场再校准，避免不符合海外用户习惯。
- 设计方向偏审美，需要在真机户外可读性上持续压实。
- 如果未来支持小程序，触觉反馈、字体、存储和导出能力需要单独适配。
- App 端图标仍需要平台尺寸导出和真机启动图检查。

## 下一步建议

1. 新增发布说明页面和版本记录。
2. 将 JSON 导入/导出升级为 App 端文件选择和系统分享。
3. 将 `assets/design/icons/app-icon.png` 重绘为矢量图标并导出平台尺寸。
4. 补 Android / iOS 真机图标、启动图和底部安全区检查。
5. 按真实 App 包继续跑真机 smoke。
