# FuelFlow MVP 发布验收清单

更新时间：2026-06-25

本文档定义 FuelFlow 从 H5 原型推进到可发布 MVP 前必须满足的验收口径。发布判断以真实 app 页面、真实数据流和自动化/人工复核结果为准。

## MVP 发布目标

FuelFlow MVP 应能让用户完成一个完整的本地油费记录闭环：

1. 选择或使用默认车辆。
2. 添加加油记录。
3. 自动计算油量、总价、单价之间的关系。
4. 在 Dashboard、Logs、Reports 中看到同一份数据。
5. 刷新或重启后保留本地记录和语言偏好。
6. 删除误录记录或恢复样例数据。
7. 导出 CSV，并获得明确反馈。
8. 从 Settings 查看隐私政策和免责声明。

## 发布必须满足

| 项目 | MVP 要求 | 当前状态 |
| --- | --- | --- |
| H5 构建 | `npm run build:h5` 通过 | 已通过 |
| 首屏 | Dashboard 直接进入可用内容 | 已完成 |
| 加油录入 | Vehicle、Date、Station、Odometer、Fuel volume、Total cost、Unit price、Full tank、Category、Note 可填写 | 已完成，H5 自动化已回归 |
| 自动计算 | Fuel volume / Total cost / Unit price 任意两项推导第三项 | 已完成，上一轮已回归；后续表单改动需继续回归 |
| 数据贯通 | Dashboard、Logs、Reports 使用同一份 fuel logs | 已完成 |
| 本地存储 | fuel logs、车辆、语言、默认分类、距离单位、货币刷新后保留 | 已完成 |
| 误操作恢复 | 可删除 fuel log，可恢复样例数据 | 已完成，已回归 |
| 记录编辑 | 可进入 fuel log 编辑页并保存修改 | 已完成，已回归 |
| 默认分类 | Settings 中默认分类影响新记录 | 已完成 |
| 车辆管理 | Garage 可新增、编辑、删除车辆，可切换默认车辆，fuel log 保存车辆归属 | 已完成，H5 自动化已回归；仍需 App 端回归 |
| 单位/货币 | Settings 可选择距离单位和货币，并影响展示标签、金额输入单位和金额符号 | 基础完成，H5 picker 入口和 Add Fuel 单位已回归；不做历史数据换算 |
| Logs 筛选 | 可按车辆、Business / Personal 和时间范围筛选 fuel logs | 已完成，H5 自动化已回归 |
| Reports 范围 | Reports 可切换 All time / This month / Last 30 days，并按当前范围统计 | 已完成，H5 自动化已回归 |
| CSV 导出 | H5 可触发 CSV 下载，并在界面显示反馈；支持 Standard / Tax-ready 列结构和 Tax summary 汇总 | H5 已完成，仍需 App 端验证 |
| 法律页 | Privacy Policy、Disclaimer 可从 Settings 进入 | 已完成 |
| 国际化 | 语言下拉可访问，核心界面文案不出现 key 泄漏 | 基础完成，语言使用 picker，9 种语言入口已回归 |
| 视觉 | 360/390/430 手机宽度无横向溢出，底部导航不遮挡关键操作 | 360px Logs/Garage/Settings 已回归；390/430 和 App 端仍需回归 |

## 仍不属于 MVP 阻断

- PDF 报告。
- 云同步和账号。
- OCR 小票识别。
- App Store / Google Play 付费和订阅。
- 完整税务规则自动判断。
- 维修、保险、过路费的完整录入闭环。
- 高级图表和年度报告。

## 发布前仍需重点验证

1. Android/iOS WebView 或 App 端 CSV 保存行为。
2. 语言、默认分类、距离单位、货币、CSV format、Tax summary、Logs 筛选和 Reports 范围下拉在 App 端原生 picker 中的选择行为。
3. 刷新、关闭重开、清空数据后的本地状态一致性。
4. 删除记录后 Dashboard 平均油耗和车辆里程是否仍合理。
5. 长文本语言下 360px 视口无横向溢出。
6. Privacy / Disclaimer 文案在目标市场正式发布前复核；当前已补儿童隐私、数据保留、用户控制和联系信息占位。
7. 距离单位从 mi 切到 km 时目前只改变展示标签，不换算历史数值；若发布到非美国市场，需在发布说明或下一轮实现中补换算策略。

## 当前发布判断

当前版本已经达到“本地 H5 可用 MVP 候选”的程度：核心记录闭环可跑通，刷新后数据可保留，误操作有基础恢复方式，CSV 导出有明确反馈。

尚未建议直接发布到应用商店：仍需 App 端导出、原生 picker、真机视觉和基础隐私合规复核。

## 最近一次 H5 验证

验证日期：2026-06-25

- `npm run build:h5`：通过。
- `npm run dev:h5`：启动成功，当前本机端口为 `http://localhost:5189/`。
- Garage：新增车辆 `Work Van` 成功，保存后成为默认车辆；点击 `Daily Sedan` 可切回默认车辆；编辑 `Weekend SUV` 为 `Weekend SUV Pro` 后保存成功；删除车辆后相关记录回退到剩余车辆。
- Add Fuel：可读取当前默认车辆并显示 `Daily Sedan`；车辆 picker、日期 picker、站点输入可见；提交 `Pilot Test Station` 后 Logs 显示 `Pilot Test Station · Daily Sedan · Personal`。
- Settings：距离单位、货币、默认分类、语言共 4 个 picker 入口可见。
- 国际化：语言 picker 展示 9 种语言入口。
- 货币：货币 picker 展示 USD、EUR、GBP、JPY、CNY。
- Add Fuel：Total cost 和 Price per gallon 单位读取当前 `currency` 状态。
- Logs：All vehicles、All categories、All time 筛选入口可见。
- Reports：Export CSV、Business、Personal 和当前范围统计可见。
- Settings：Standard、Enabled、Default category picker 可见，导出偏好入口可渲染。
- 视觉：390px 下页面 `scrollWidth` 等于 `clientWidth`，未发现实际横向滚动；360px 下 Logs、Garage、Settings 上一轮已回归无实际横向滚动。
- 控制台：未捕获 `warn` / `error`。
