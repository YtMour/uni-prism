# FuelFlow 视觉与验收清单

更新时间：2026-06-25

本文档用于每轮 UI 修改后的检查。只有实际检查过的项目，才能在交付说明中写成“已验证”。

## 基本原则

- H5 预览用于查看真实 app 页面，不做假手机外框。
- 不出现假状态栏、假时间、假设备边框、假系统导航。
- 页面背景、内容宽度和底部安全区应接近真实 WebView/app 体验。
- 首屏必须直接是 Dashboard 或当前功能页，不做营销落地页。

## 推荐视口

| 视口 | 用途 |
| --- | --- |
| 390 x 844 | iPhone 常见宽度 |
| 430 x 932 | 大屏手机 |
| 360 x 800 | 较窄 Android |
| 768 x 1024 | 平板或桌面窄窗 |

## 页面检查

### Dashboard

- 当前车辆、月度油费、平均油耗可在首屏看见。
- 趋势图是连续曲线，不断裂、不溢出、不被裁切。
- 最近记录行左右信息不重叠。
- 底部导航不遮挡最后一条内容。
- 顶部 app icon 能显示。

### Add Fuel

- 所有字段在手机宽度下不横向溢出。
- 大数字、单位、标签层级清楚。
- Business / Personal 分段控件可读。
- Full tank 开关不与文字重叠。
- 主按钮在底部区域容易点击。

### Logs

- Fuel / Trip / Expense 分段控件宽度均衡。
- 月份标题、合计金额和记录行对齐稳定。
- 空状态插画能加载，且不压缩变形。
- 记录行的金额、油量、分类不重叠。

### Garage

- 车辆插画能加载。
- 多车辆卡片在窄屏下不挤压文本。
- Primary 标签不遮挡车辆名。
- Add vehicle 和 Settings 入口清楚。

### Reports

- 报告插画能加载。
- Business / Personal 两栏在窄屏仍可读。
- Spending by category 金额和比例不重叠。
- Export CSV 入口清楚，但不暗示税务建议已经自动完成。

### Settings

- Settings 能从顶部按钮或 Garage 进入。
- Vehicle defaults、Data and export、App、Legal 分组完整。
- Privacy Policy 和 Disclaimer 能进入并返回。
- 设置行右侧值不被长说明挤出屏幕。

## 素材检查

必须确认：

- `static/design-assets/app-icon/app-icon-fuelflow.png` 正常加载。
- `static/design-assets/illustrations/empty-fuel-log.png` 正常加载。
- `static/design-assets/illustrations/garage-vehicles.png` 正常加载。
- `static/design-assets/illustrations/reports-export.png` 正常加载。
- 浏览器控制台没有资源 404。

小图标策略：

- 不再直接依赖 AI 生成 PNG 做 24px 级别小图标。
- 底部导航、记录类型、工具按钮优先使用 SVG、CSS 图标、uni-icons 或后续稳定图标库。
- 如果使用 PNG 图标，必须逐个单独生成并检查透明背景、边距和缩小时可读性。

## 自动化检查建议

每轮 UI 修改后建议执行：

1. 启动或确认 H5 服务可访问。
2. 用浏览器自动化打开 `http://localhost:5188/`。
3. 分别点击 Dashboard、Add Fuel、Logs、Garage、Reports、Settings。
4. 收集 console error/warn。
5. 检查 failed requests。
6. 保存关键页面截图用于人工复核。
7. 运行 `npm run build:h5`。

## 交付说明规则

- 实际跑过 `npm run build:h5` 才能写“构建通过”。
- 实际打开页面并检查过资源，才能写“素材正常显示”。
- 实际点击过 Settings、Privacy、Disclaimer，才能写“设置和法律页面可访问”。
- 如果只更新了文档，不要声称 UI 或构建已重新验证。
