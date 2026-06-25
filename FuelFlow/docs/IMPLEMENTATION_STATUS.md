# FuelFlow 实现状态

更新时间：2026-06-25

## 当前阶段

FuelFlow 已进入 uni-app H5 原型搭建阶段。当前目标是在本地浏览器中验证真实 app 页面内容、信息架构、视觉方向和基础交互，再进入手机 app 端测试。

当前实现目录：

```text
FuelFlow-Uniapp/
```

当前 H5 入口：

```text
http://localhost:5188/ 或 dev server 自动分配的相邻端口
```

## 运行方式

在 `FuelFlow-Uniapp` 目录下运行：

```text
npm run dev:h5
```

构建 H5：

```text
npm run build:h5
```

注意：`package.json` 中通过 `UNI_INPUT_DIR=.` 指定根目录作为 uni-app 输入目录，避免 CLI 默认寻找 `src/manifest.json`。

## 已实现页面

当前原型采用单页状态切换，已覆盖以下视图：

| 视图 | 状态 | 说明 |
| --- | --- | --- |
| Dashboard | 可用原型 | 当前车辆、月度油费、平均油耗、趋势图、最近记录；指标来自当前 fuel logs 状态 |
| Add Fuel | 可输入原型 | 车辆选择、日期选择、站点、里程、油量、总价、单价、Business / Personal、Full tank、备注和提交 |
| Logs | 可用原型 | Fuel / Trip / Expense 分段、车辆/分类/时间范围筛选、月度/筛选合计、空状态素材；新增记录会进入列表 |
| Garage | 已有原型 | 多车辆列表、主车辆标记、新增车辆入口、设置入口 |
| Reports | 可用原型 | 时间范围、商务/个人统计、分类支出、按当前范围导出 CSV |
| Settings | 已有原型 | 单位、货币、导出格式、税务汇总、语言、主题、隐私和免责声明入口 |
| Privacy | 已有草案 | 隐私政策草案 |
| Disclaimer | 已有草案 | 税务、计算和车辆决策免责声明 |

## 本轮完成

- Add Fuel 已从静态展示块改成真实输入表单。
- `Fuel volume`、`Total cost`、`Unit price` 任意两项有效时会自动推导第三项。
- 提交 Add Fuel 后会写入当前页面状态，并返回 Dashboard。
- Dashboard 的本月支出、平均油耗、最近记录改为从当前 fuel logs 状态计算。
- Logs 的列表和月度合计改为读取当前 fuel logs 状态。
- Reports 的 Business / Personal 金额和比例改为读取当前 fuel logs 状态。
- Export CSV 入口已能在 H5 浏览器中生成 `fuelflow-fuel-logs.csv`。
- Settings 已增加会话内语言下拉选择，当前覆盖 English、Español、简体中文、繁體中文、Français、Deutsch、日本語、한국어、Português 九种语言的核心界面文案。
- Fuel logs、车辆里程和语言偏好已接入本地存储，H5 刷新后会恢复当前记录状态。
- Logs 已支持删除单条 fuel log。
- Logs 已支持进入 fuel log 编辑页，并保存修改。
- Settings 已支持默认分类切换，并影响新的 Add Fuel 记录。
- Settings 的语言和默认分类均使用 `picker` 选择器。
- Settings 已支持恢复样例数据，便于清理测试误录数据。
- Reports 导出 CSV 后会显示基础反馈。
- Privacy Policy 已补儿童隐私、数据保留与删除、用户控制、联系信息占位等发布前合规结构。
- Garage 已支持新增车辆和切换默认车辆，并已在 H5 自动化中回归。
- Settings 已支持距离单位和货币选择，并影响展示标签、金额输入单位和金额符号；picker 入口已在 H5 自动化中回归。
- Add Fuel 已支持车辆 picker、日期 picker 和站点输入，新增记录会保存车辆归属。
- Logs 已显示每条 fuel log 的车辆名；CSV 导出使用记录自己的车辆归属。
- Garage 已支持车辆编辑和删除；删除车辆时会把相关 fuel log 回退到剩余车辆，避免孤立记录。
- Logs 已支持按车辆、Business / Personal 和时间范围筛选，并显示筛选合计。
- Reports 已支持 All time / This month / Last 30 days 范围选择，统计和 CSV 导出会使用当前范围。
- Settings 已支持 CSV format 和 Tax summary picker，并接入本地持久化。
- CSV 导出字段已补 `station`、`currency`，并支持 Standard / Tax-ready 两种列结构；开启 Tax summary 时会追加商务、个人和总燃油金额汇总。
- 已执行 `npm run build:h5`，H5 构建通过。

## 本轮验证记录

- `npm run build:h5` 通过。
- `npm run dev:h5` 启动成功；本机 `5188` 被占用时，dev server 自动使用 `http://localhost:5189/`。
- H5 浏览器自动化验证 Garage 新增 `Work Van`，保存后车辆进入列表并成为 `Primary`。
- H5 浏览器自动化验证点击 `Daily Sedan` 车辆卡可切回默认车辆。
- H5 浏览器自动化验证 Add Fuel 显示当前默认车辆 `Daily Sedan`。
- H5 浏览器自动化验证 Add Fuel 录入 `Pilot Test Station` 后提交，Logs 显示 `Pilot Test Station · Daily Sedan · Personal`。
- H5 浏览器自动化验证 Edit Fuel 页面包含车辆选择和站点字段。
- H5 浏览器自动化验证 Garage 编辑 `Weekend SUV` 为 `Weekend SUV Pro` 后保存成功。
- H5 浏览器自动化验证删除 `Weekend SUV Pro` 后，相关记录回退到 `Daily Sedan`，没有孤立车辆名。
- H5 浏览器自动化验证 Settings 有 4 个 picker 入口：距离单位、货币、默认分类、语言。
- H5 浏览器自动化验证语言 picker 展示 English、Español、简体中文、繁體中文、Français、Deutsch、日本語、한국어、Português。
- H5 浏览器自动化验证货币 picker 展示 USD、EUR、GBP、JPY、CNY。
- H5 浏览器自动化抽查 Add Fuel 的 Total cost 和 Price per gallon 单位读取当前 `currency` 状态。
- H5 浏览器自动化验证 Logs 出现 All vehicles、All categories、All time 筛选入口。
- H5 浏览器自动化验证 Reports 出现 Export CSV、Business、Personal，并可渲染当前范围统计。
- H5 浏览器自动化验证 Settings 出现 Standard、Enabled、Default category picker，导出偏好入口可渲染。
- 390px 视口下页面 `scrollWidth` 等于 `clientWidth`，未发现实际横向滚动。
- 360px 视口下检查 Logs、Garage、Settings，未发现实际页面横向滚动；Settings 中 H5 picker 运行时隐藏层会出现 400px 节点，但页面 `scrollWidth` 未超过可视内容宽度。
- 浏览器控制台 `warn` / `error` 为空。

## 已修正的设计方向问题

- 页面不再使用假手机外框、假状态栏或浏览器里的设备展示壳。
- H5 页面按真实 app 内容区展示，而不是设计图裁切预览。
- Dashboard 图表已改为连续 SVG 趋势线，不使用断裂 div 线段。
- 大插画和 app icon 使用静态素材目录中的 PNG。
- 小型导航和记录图标暂时使用 CSS/文本符号，避免 AI PNG 白底和留白导致缩小时不可读。
- 已补 Settings、Privacy、Disclaimer 相关信息入口。

## 当前资源目录

设计源素材：

```text
docs/design-assets/
```

app 静态素材：

```text
FuelFlow-Uniapp/static/design-assets/
```

关键素材：

| 素材 | 路径 | 用途 |
| --- | --- | --- |
| App icon | `static/design-assets/app-icon/app-icon-fuelflow.png` | 顶部品牌图标、后续应用图标基础 |
| Empty fuel log | `static/design-assets/illustrations/empty-fuel-log.png` | Logs 空状态 |
| Garage vehicles | `static/design-assets/illustrations/garage-vehicles.png` | Garage 页面插画 |
| Reports export | `static/design-assets/illustrations/reports-export.png` | Reports 页面插画 |

## 当前限制

- 数据目前已接入本地存储，并支持编辑、删除和恢复样例数据；还没有导入或多设备同步。
- Add Fuel 已可提交 fuel log，并支持站点输入、日期 picker、车辆 picker 和 Logs 进入详情编辑页；Logs 已支持车辆、分类和时间范围筛选。
- Business / Personal 已写入新增记录，但 Trip / Expense 类型仍是展示入口，尚未接入真实数据。
- Settings 当前有语言、默认分类、距离单位、货币、CSV format 和 Tax summary picker，并已接入本地持久化。
- 距离单位和货币当前会影响展示标签/金额符号，但不会换算历史数值。
- 语言选择已接入本地存储，但尚未接入系统语言自动识别或远端同步。
- CSV 导出在 H5 中可生成文件并显示反馈，已支持字段配置和当前报告范围；还没有 App 端保存验证或导出历史。
- 底部导航和小记录图标仍是临时符号，需要替换为稳定图标系统。
- 当前只有一个 uni-app 页面文件，后续需要按复杂度拆组件。

## 下一轮实现重点

1. 完成跨端导出兼容处理，确认 H5/App 端都能保存 CSV。
2. 在 Android/iOS 真机或模拟器回归原生 picker、底部导航、导出和本地存储。
3. 明确距离单位切换的换算策略，决定是只影响新记录还是迁移历史记录。
4. 替换临时字母图标为统一矢量图标。
5. 将单文件页面拆成 Dashboard、AddFuel、EditFuel、Logs、Garage、Reports、Settings 等组件。
6. 继续使用视觉自动化检查 Dashboard、Add Fuel、Edit Fuel、Logs、Garage、Reports、Settings、Privacy、Disclaimer。
