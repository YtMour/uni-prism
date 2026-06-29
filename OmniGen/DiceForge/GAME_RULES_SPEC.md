# DiceForge 规则规格

## 规则边界

DiceForge 参考 D&D 5E 的角色创建框架，但 MVP 只实现一张 1 级角色卡所需的轻量规则。文档和应用中应避免大段复刻规则书文本，只保留必要的结构化数据、摘要和计算逻辑。

## 角色组成

一个角色由以下部分组成：

- Race：种族
- Class：职业
- Background：背景
- Alignment：阵营
- Ability Scores：六项属性
- Proficiencies：熟练项
- Starting Gear：初始装备
- Backstory：三句话背景

## 属性生成

MVP 使用经典 4d6 去最低规则：

1. 对每项属性掷 4 个 d6。
2. 去掉最低的一个结果。
3. 将剩余 3 个结果相加。
4. 重复 6 次，得到 STR、DEX、CON、INT、WIS、CHA。
5. 应用种族属性加成。
6. 计算修正值。

修正值公式：

```text
modifier = floor((score - 10) / 2)
```

示例：

| 属性值 | 修正值 |
| --- | --- |
| 8 | -1 |
| 10 | +0 |
| 12 | +1 |
| 14 | +2 |
| 16 | +3 |

## 种族范围

MVP 建议先支持以下种族：

- Human
- Elf
- Dwarf
- Halfling
- Tiefling
- Dragonborn
- Half-Elf
- Half-Orc
  
每个种族至少包含：

- 英文名
- 中文名
- 属性加成
- 风味标签
- 可选命名词库

## 职业范围

MVP 建议先支持以下职业：

- Fighter
- Rogue
- Wizard
- Cleric
- Paladin
- Ranger
- Bard
- Barbarian

每个职业至少包含：

- 英文名
- 中文名
- 主属性建议
- 熟练项摘要
- 初始装备池
- 背景故事风味标签

## 背景范围

MVP 建议先支持以下背景：

- Acolyte
- Criminal
- Folk Hero
- Noble
- Sage
- Soldier
- Urchin
- Guild Artisan

背景用于影响：

- 技能熟练项
- 工具或语言摘要
- 背景故事语气
- 初始装备补充项

## 阵营

阵营使用九宫格：

- Lawful Good
- Neutral Good
- Chaotic Good
- Lawful Neutral
- True Neutral
- Chaotic Neutral
- Lawful Evil
- Neutral Evil
- Chaotic Evil

MVP 阵营只影响文本风味，不影响数值。

## 冲突处理规则

- 若职业和背景给出重复熟练项，应去重并补充候选项。
- 若装备池重复，应合并为一条摘要。
- 若种族属性加成和职业主属性完全错位，不强制修正，保留随机性。
- 若生成结果出现邪恶阵营，应确保背景故事可用于桌面游戏，不生成破坏玩家协作的极端行为指令。

## 可复现性

推荐所有随机过程接受 seed：

- 同一个 seed 应生成同一个角色。
- 不传 seed 时使用系统随机源。
- 复制文本中可附带短 seed，方便重新生成。

