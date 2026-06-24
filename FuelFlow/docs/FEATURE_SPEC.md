# FuelFlow 功能规格草案

## 数据对象

### Vehicle

| 字段 | 说明 |
| --- | --- |
| name | 用户自定义车辆名 |
| make / model | 品牌和型号 |
| year | 年份，可选 |
| distanceUnit | km 或 mi |
| volumeUnit | L 或 gal |
| economyUnit | L/100km 或 MPG |
| currency | 货币 |
| initialOdometer | 初始里程 |
| active | 是否当前默认车辆 |

### Fuel Log

| 字段 | 说明 |
| --- | --- |
| vehicleId | 所属车辆 |
| date | 加油日期 |
| odometer | 当前总里程 |
| tripDistance | 单次里程，可选 |
| volume | 加油量 |
| totalCost | 总金额 |
| unitPrice | 单价 |
| fullTank | 是否加满 |
| category | Business 或 Personal |
| station | 加油站，可选 |
| note | 备注 |

计算规则：
- `totalCost = volume * unitPrice`。
- 当用户填写任意两项 `volume`、`totalCost`、`unitPrice` 时，自动推导第三项。
- 油耗只在存在可信前后里程和加油量时计算。
- 如果不是 full tank，记录仍保留，但趋势油耗应标记为估算或排除。

### Trip Log

| 字段 | 说明 |
| --- | --- |
| vehicleId | 所属车辆 |
| date | 日期 |
| startOdometer | 起始里程，可选 |
| endOdometer | 结束里程，可选 |
| distance | 行程距离 |
| category | Business 或 Personal |
| purpose | 出行目的，可选 |
| note | 备注 |

MVP 可暂缓独立 Trip Log，但 Business / Personal 分类应在 Fuel Log 中先保留。

### Expense Log

| 字段 | 说明 |
| --- | --- |
| vehicleId | 所属车辆 |
| date | 日期 |
| type | Maintenance、Insurance、Parking、Tolls、Other |
| amount | 金额 |
| category | Business 或 Personal |
| vendor | 商户，可选 |
| note | 备注 |

## MVP 范围

### 必须包含

- 创建和切换车辆。
- 添加加油记录。
- 自动计算单价、油量或总金额。
- 计算平均油耗。
- 查看本月油费和最近记录。
- 记录 Business / Personal 分类。
- 单位设置：km/mi、L/gal、L/100km/MPG。
- 基础 CSV 导出字段设计。

### 可以后置

- PDF 报告。
- OCR 识别小票。
- 加油站定位。
- 云同步。
- Apple / Google 登录。
- 订阅和支付。
- 车辆保养提醒。
- 年度明信片式报告。

### 暂不进入

- OBD 硬件接入。
- 保险报价。
- 维修店预约。
- 社区内容。
- 路线导航。

## 关键计算口径

### 距离

- 默认使用车辆当前单位。
- 如果用户输入不同单位，保存时应标准化，并在显示时按偏好转换。

### 油耗

L/100km：

```text
fuelVolumeLiters / distanceKm * 100
```

MPG：

```text
distanceMiles / fuelVolumeGallons
```

### 成本

月度成本：

```text
sum(fuel.totalCost + expenses.amount within selected month)
```

每公里或每英里成本：

```text
totalCost / distance
```

### 商务占比

```text
businessDistance / totalDistance
businessCost / totalCost
```

## 首屏内容建议

Dashboard 首屏应回答四个问题：

1. 当前看的是哪辆车。
2. 这个月花了多少钱。
3. 最近油耗是否稳定。
4. 下一步最快能不能记录一笔。

推荐指标：
- This month: total fuel cost
- Avg. economy
- Last fill-up
- Business ratio

## 导出字段建议

CSV 首版字段：

```text
date,vehicle,name,type,category,odometer,distance,volume,total_cost,unit_price,currency,full_tank,note
```

后续可扩展：

```text
station,vendor,purpose,created_at,updated_at
```

## 风险点

- 单位换算如果后期补，会造成数据迁移复杂。
- full tank 口径不清会导致油耗趋势不可信。
- Business / Personal 如果只是备注字段，导出价值会下降。
- 首屏如果堆太多卡片，会削弱快速记录目标。
- 税务导出不能暗示具体税务建议，应保持工具和数据整理定位。
