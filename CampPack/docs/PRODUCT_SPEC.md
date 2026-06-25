# CampPack 产品规格

## 1. 产品目标

CampPack 的目标是成为户外出行前后的装备清点助手。它解决的不是“记录待办”，而是三个高频风险：

- 出发前漏装核心装备。
- 到达营地后找不到或遗漏已取出的装备。
- 撤营时把地钉、灯具、餐具、儿童用品或高价装备留在营地。

产品必须在无网络、弱光、户外反光和单手操作条件下依然可用。

## 2. 用户画像

| 用户 | 需求 | 关键功能 |
| --- | --- | --- |
| 新手露营者 | 不知道带什么，怕漏装备 | 专家模板、一键导入、分类清单 |
| 家庭露营组织者 | 人多物品杂，需要撤营防遗漏 | 多分类、数量、Leave 模式 |
| 重装徒步用户 | 关注重量和冗余 | 重量统计、单位切换、基础重量 |
| 户外内容创作者 | 反复复用不同拍摄 / 露营配置 | 模板复制、备注、装备组 |

## 3. 核心场景

### 3.1 行前装包 Pack

用户在家中或车库按分类检查装备。每个条目支持勾选、数量、重量、备注和可选优先级。顶部显示总进度和总重量。

验收标准：

- 用户可以从模板创建清单。
- 用户可以新增、编辑、删除装备条目。
- 勾选状态刷新后仍保留。
- 重量总计随条目变更实时更新。

### 3.2 到达搭建 Setup

用户到达营地后检查哪些装备已经取出、安装或进入使用状态。Setup 状态独立于 Pack 状态，避免现场操作破坏行前记录。

验收标准：

- Setup 模式可以独立勾选。
- 切回 Pack 模式时 Pack 状态不丢失。
- 可按未完成、分类、关键装备过滤。

### 3.3 撤营回收 Leave

用户撤营时从 Pack 已装入装备生成需要回收的清单，逐项确认放回车内或背包。

验收标准：

- 一键进入 Leave 模式时，已 Pack 的装备进入待回收状态。
- 未 Pack 的装备默认不进入撤营清单，除非用户手动加入。
- Leave 完成度独立计算。
- 用户可以重置本次 Leave 状态，重新开始撤营检查。

## 4. MVP 功能范围

### 必须实现

- 清单列表: 新建、复制、删除、重命名。
- 模板导入: 至少 3 套内置模板。
- 清单详情: 分类、条目、数量、重量、备注。
- 三阶段模式: Pack / Setup / Leave。
- 本地持久化: App 重启后数据保留。
- 重量统计: 总重量、已勾选重量、公制 / 英制显示。
- 搜索与筛选: 按名称、分类、未完成、关键装备过滤。
- 设置页: 单位系统、语言占位、数据导出入口占位。

### 暂缓实现

- 账号系统。
- 云同步。
- 多人协作。
- 天气 API。
- 商店和订阅。
- 社区模板下载。

## 5. 内置模板建议

### Solo Bushcraft

分类建议：

- Shelter: tarp, tent stakes, guyline, groundsheet.
- Sleep: sleeping bag, sleeping pad, pillow.
- Fire & Tools: lighter, ferro rod, knife, multitool.
- Cooking: stove, fuel, pot, mug, water filter.
- Safety: first aid kit, headlamp, whistle, map.

### Family Glamping

分类建议：

- Shelter: large tent, canopy, mat, chairs.
- Kitchen: cooler, tableware, stove, food box.
- Kids: spare clothes, toys, wipes, medicine.
- Comfort: lanterns, blanket, power bank.
- Safety: first aid kit, sunscreen, insect repellent.

### Ultralight Backpacking

分类建议：

- Big Three: shelter, backpack, sleep system.
- Worn / Carried: trekking poles, rain jacket, insulation.
- Cooking: stove, fuel, pot, spoon.
- Hydration: bottles, filter, treatment tablets.
- Essentials: headlamp, repair kit, first aid, navigation.

## 6. 后期功能池

| 功能 | 价值 | 建议阶段 |
| --- | --- | --- |
| 自定义模板 | 提升复用率 | V1.1 |
| 导出 / 分享清单 | 方便家庭协作 | V1.1 |
| 数据备份与恢复 | 降低换机风险 | V1.2 |
| 云同步 | 多设备使用 | V2.0 |
| 协作清点 | 家庭和团队场景 | V2.0 |
| 预算 / 价格统计 | 装备管理扩展 | V2.1 |
| 天气与温度建议 | 行前辅助 | V2.1 |
| 专业模板商店 | 商业化 | V2.2 |

## 7. 非功能要求

- 清单条目 500 条以内操作不卡顿。
- 核心功能断网可用。
- 本地数据写入失败必须给出提示。
- 删除清单前必须二次确认。
- 不采集位置、联系人、相册等敏感权限，除非后续功能确实需要。
