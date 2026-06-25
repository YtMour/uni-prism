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
http://localhost:5188/
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
| Dashboard | 已有原型 | 当前车辆、月度油费、平均油耗、趋势图、最近记录 |
| Add Fuel | 已有原型 | 加油记录字段、Business / Personal、Full tank、提交按钮 |
| Logs | 已有原型 | Fuel / Trip / Expense 分段、月份记录、空状态素材 |
| Garage | 已有原型 | 多车辆列表、主车辆标记、新增车辆入口、设置入口 |
| Reports | 已有原型 | 时间范围、商务/个人统计、分类支出、CSV 导出入口 |
| Settings | 已有原型 | 单位、货币、导出、语言、主题、隐私和免责声明入口 |
| Privacy | 已有草案 | 隐私政策草案 |
| Disclaimer | 已有草案 | 税务、计算和车辆决策免责声明 |

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

- 数据仍是静态样例，尚未接入本地存储。
- Add Fuel 字段当前是展示块，尚未改成真实输入组件。
- Business / Personal 可切换，但暂未写入记录。
- Settings 当前是展示项，尚未接入选择器或持久化设置。
- CSV 导出入口只是界面入口，尚未生成文件。
- 底部导航和小记录图标仍是临时符号，需要替换为稳定图标系统。
- 当前只有一个 uni-app 页面文件，后续需要按复杂度拆组件。

## 下一轮实现重点

1. 将 Add Fuel 改成真实输入表单。
2. 实现 `volume`、`totalCost`、`unitPrice` 任意两项推导第三项。
3. 接入本地记录列表和车辆列表状态。
4. 将 Dashboard、Logs、Reports 的数据改为来自同一数据源。
5. 替换临时字母图标为统一矢量图标。
6. 补齐 Settings 的单位、货币和导出偏好选择器。
7. 使用视觉自动化检查 Dashboard、Add Fuel、Logs、Garage、Reports、Settings。
