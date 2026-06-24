# FuelFlow: Mileage & Fuel Tracker 🚗⚓

> 让养车成本一目了然。FuelFlow 是一款追求极致高效、视觉优雅、支持多车辆管理与国际化单位自适应的跨平台油费与里程追踪工具。项目基于 uni-app 框架构建，全方位直击海外私家车主、跨境公路旅行爱好者以及网约车/配送自由职业者（Gig Workers）的日常记账与税务抵扣需求。

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-black?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/Framework-uni--app%20%7C%20Vue3%20%7C%20Vite-blue?style=for-the-badge)]()
[![Market](https://img.shields.io/badge/Market-Global%20%28App%20Store%20%26%20Google%20Play%29-brightgreen?style=for-the-badge)]()

---

## 🌟 一、 视觉理念与 UI/UX 风格规范 (Gallerist Minimalism)

FuelFlow 摒弃了传统汽车工具软件粗犷、冰冷、充满拟物齿轮或复杂拟真仪表的“修车厂”画风，转而追求**当代艺术画廊（Gallerist Minimalism）**的通透感与呼吸感。我们认为，数据记录不应是负担，用车成本的图表也可以像现代杂志插页一样优雅、直观。

### 1. 色调方案 (Color Palette)
* **主背景色（App Canvas Background）：** 温暖的**羊皮纸白 (#FBF9F5)** 或 **石墨浅灰 (#F5F5F7)**。这种低饱和度的底色能有效中和传统表格的枯燥感，给车主带来干净、解压的视觉体验。
* **主要交互与文字色（Brand Accent）：** **汽油蓝 (#1A3644)** 或 **工业复古绿 (#2B4C3F)**。采用高级、克制的暗色系来代表能源与稳健，确保在强光或车载环境下具备极佳的对比度。
* **暗影与卡片质感：** 全量采用极淡的、弥散性的**柔和阴影 (Soft Shadows)**，让各个油费记录卡片呈现“悬浮于纸张之上”的立体悬浮感，层级分明。

### 2. 字体规范 (Typography)
* **核心数据与油耗数值：** 采用定制的大字号无衬线体（Sans-Serif），如 *Inter* 或 *Montserrat*，确保在颠簸的车载环境或快速撇视下，数字（如油耗 `6.5 L/100km` 或油价 `$3.45`）依然具备极佳的视认性。
* **分类标签与车辆型号：** 引入优雅的**西方经典衬线体 (Serif)**，如 *Playfair Display* 或 *Lora*，在界面核心分类与车型简称区域（如 `My Mustang`）微弱点缀，彰显高级的私人定制感。

### 3. 高效录入交互 (Speed-Entry UI)
* **大按钮大卡片：** 考虑到车主通常在加油站刚加完油、准备起步的短时间内进行记录，App 底部常驻一个极简的、扩大点击区域的“＋”号。
* **智能数字滚轮：** 拒绝繁琐的文本键入，油价、加油量、当前里程数全面采用手感丝滑、带微弱触感反馈（Haptic Feedback）的**定制化数字滚动滑块**或大网格数字键盘，实现 5 秒内快速闪电记账。

---

## 🚀 二、 核心功能规划与模块设计 (Feature Architecture)

FuelFlow 旨在打破传统记账“输入数字就完事”的传统做法，深度解决不同群体车主在油耗监控、差旅报销及税务抵扣中的核心痛点：

### 1. 闪电加油记录与油耗分析 (Smart Fueling Log) —— **核心刚需**
* **多维数据联动输入：** 用户只需输入 `当前总里程`（或单次小计里程）、`加油总金额`、`单价` 三者中的任意两者，App 会自动解算并补全第三项数据。
* **智能油耗算法：** 自动根据两次加油之间的里程差与加油量，计算出真实的**百公里油耗 (L/100km)** 或 **每加仑英里数 (MPG)**，并生成不带焦虑感的极简流线型趋势图。
* **多车辆管理 (Multi-Vehicle Garage)：** 适合家庭多车管理或兼职司机，一键流畅滑屏切换不同的车型卡片（如：*Daily Sedan* / *Weekend SUV*），各自数据完全独立。

### 2. 商务里程与税务抵扣分类器 (Business vs. Personal Trips) —— **海外高溢价痛点**
* **差旅分类标签：** 针对海外庞大的网约车司机和配送员（Gig Workers）刚需，每笔记录支持一键勾选为 `Business（商务出车）` 或 `Personal（个人通勤）`。
* **一键导出税务账单：** 提供符合国税局（如美国 IRS 抵扣标准）格式的 CSV/PDF 报销报表。一键导出即可用于每年的个人所得税（Tax Return）里程抵扣，直接帮用户省钱。

### 3. 养车账本扩展 (Total Car Cost Pocket) —— **长效留存**
* 除去基础油费，同时支持扩展记录：`保养 (Maintenance)`、`保险 (Insurance)`、`停车/过路费 (Tolls)`。App 在年底自动生成一张画廊明信片质感的“年度用车消费报告”。

---
