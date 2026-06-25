# FuelFlow 页面内容规格

更新时间：2026-06-25

本文档约束当前 MVP 原型的页面内容、字段和交互入口。实现时应以真实 app 页面为准，不创建假设备外框、假状态栏或只用于展示的手机壳。

## 全局结构

主导航：

| 入口 | 说明 |
| --- | --- |
| Dashboard | 当前车辆概览和关键指标 |
| Logs | 加油、行程、支出记录 |
| Garage | 车辆管理和车辆切换 |
| Reports | 汇总、导出和税务辅助 |

全局主操作：

| 入口 | 说明 |
| --- | --- |
| Add Fuel | 底部中间主按钮，优先添加加油记录 |
| Settings | 顶部或 Garage 内入口，不占底部主导航 |

## Dashboard

目标：用户打开 app 后 1 秒内知道当前车辆、本月花费、平均油耗和最近记录。

必须显示：

| 内容 | 说明 |
| --- | --- |
| 当前车辆 | 车辆名、当前里程、最近更新时间 |
| This month | 本月燃油支出 |
| Avg. economy | 平均油耗，默认美国市场使用 MPG |
| Fuel economy chart | 低噪趋势图，不做拟物仪表盘 |
| Recent logs | 最近 3 条记录 |
| View all | 跳转 Logs |

交互要求：

- 当前车辆区域后续应可进入车辆切换或车辆详情。
- Recent logs 中的记录后续应可进入详情。
- 趋势图必须连续、可读，不能出现断裂、异常裁切或装饰线误导。

## Add Fuel

目标：加油站场景下快速完成记录。

必须字段：

| 字段 | 说明 |
| --- | --- |
| Vehicle | 默认当前车辆 |
| Date | 默认今天 |
| Odometer | 当前总里程 |
| Fuel volume | 加油量，单位跟随车辆设置 |
| Total cost | 总金额 |
| Unit price | 单价 |
| Full tank | 是否加满，影响油耗可信度 |
| Category | Business 或 Personal |
| Note | 可选备注 |

计算规则：

- `Fuel volume`、`Total cost`、`Unit price` 任意两项有效时，自动推导第三项。
- 如果 `Full tank` 为关闭，记录仍保存，但 Dashboard 趋势应标记为估算或排除。
- `Category` 默认取 Settings 中的默认分类。

交互要求：

- 数字字段应优先适配移动端数字输入。
- 主按钮文字使用 `Add fuel`。
- 提交成功后返回 Dashboard 或 Logs，并能看到新增记录。

## Logs

目标：快速回看和筛选历史记录。

必须显示：

| 内容 | 说明 |
| --- | --- |
| 类型分段 | Fuel、Trip、Expense |
| 月份分组 | 例如 May 2025 |
| 月度合计 | 当前月份总金额 |
| 记录行 | 日期、站点/商户、分类、金额、油量或距离 |
| 空状态 | 没有记录时显示轻量插画和简短说明 |

后续筛选：

- Business / Personal。
- 时间范围。
- 车辆。

## Garage

目标：支持多车辆管理，但不抢占快速记录路径。

必须显示：

| 内容 | 说明 |
| --- | --- |
| 车辆插画 | 页面情绪和空状态辅助 |
| 车辆列表 | 车辆名、里程、平均油耗 |
| Primary | 当前默认车辆标记 |
| Add vehicle | 新增车辆入口 |
| Settings | 设置入口 |

车辆字段：

- 车辆名。
- 品牌和型号。
- 年份，可选。
- 初始里程。
- 距离单位。
- 油量单位。
- 油耗单位。
- 货币。

## Reports

目标：让海外自由职业司机和普通车主能理解支出结构，并为导出做准备。

必须显示：

| 内容 | 说明 |
| --- | --- |
| 时间范围 | 默认最近 30 天或当前月 |
| Business total | 商务分类金额和比例 |
| Personal total | 个人分类金额和比例 |
| Spending by category | Fuel、Maintenance、Tolls 等分类 |
| Export CSV | CSV 导出入口 |

边界要求：

- 税务相关文案必须保持工具定位，不暗示具体税务建议。
- PDF 报告和年度报告后置，不阻塞 MVP。

## Settings

目标：管理单位、货币、导出偏好、法律信息。

必须分组：

| 分组 | 内容 |
| --- | --- |
| Vehicle defaults | Distance、Fuel volume、Economy、Currency |
| Data and export | Default category、CSV format、Tax summary |
| App | Language、Theme |
| Legal | Privacy Policy、Disclaimer |

交互要求：

- 单位和货币后续应使用选择器。
- 设置变化应影响新记录默认值和 Dashboard/Reports 展示。
- Privacy Policy 和 Disclaimer 必须可从 Settings 进入。

## 文案原则

- 界面主文案先使用英文，服务海外市场。
- 中文用于项目文档和开发说明。
- 文案短、直接、专业。
- 不使用“智能养车管家”“车主生态”等泛化营销词。
