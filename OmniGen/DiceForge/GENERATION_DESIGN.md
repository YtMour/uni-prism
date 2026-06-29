# DiceForge 生成系统设计

## 生成目标

DiceForge 的生成系统要在“规则可信”和“故事有灵魂”之间取平衡。数值部分必须可解释，文本部分允许有风味随机，但不能出现互相矛盾或无法上桌的结果。

## 生成流水线

```text
seed
  -> random context
  -> race
  -> class
  -> background
  -> alignment
  -> ability rolls
  -> race bonuses
  -> derived modifiers
  -> proficiencies
  -> starting gear
  -> name
  -> backstory
  -> export payload
```

## 随机上下文

随机上下文用于统一管理随机行为：

- 当前 seed
- 随机函数
- 已选标签
- 已生成字段
- 冲突记录

这样可以避免各模块各自调用随机源，导致结果无法复现。

## 角色身份生成

### 种族

种族通过均匀随机选择。后续可以加入权重配置，但 MVP 先保持简单。

### 职业

职业通过均匀随机选择。后续可以提供职业偏好筛选，例如“法系优先”“近战优先”。

### 背景

背景可使用轻权重策略，避免和职业组合过于单一。例如 Soldier + Fighter 常见但不应总是出现。

### 阵营

阵营初期均匀随机。若后续发现邪恶阵营导致故事不可用，可以降低邪恶阵营权重。

## 属性分配策略

MVP 推荐两种模式：

### 规则随机模式

直接按 STR、DEX、CON、INT、WIS、CHA 顺序掷骰。这个模式最忠实于随机，但可能产生低效角色。

### 职业友好模式

先生成 6 个属性值，再按职业主属性排序分配。推荐作为默认模式，因为它更适合新手直接使用。

默认建议：

```text
mode = class_friendly
```

## 背景故事生成

三句话结构：

1. 身份与过去：角色曾经是谁。
2. 当前动机：角色为什么踏上冒险。
3. 隐秘冲突：角色身上有什么未解决的问题。

文本矩阵由以下维度组成：

- origin：出身
- loss：失去或失败
- desire：目标
- enemy：敌人或阻碍
- secret：秘密
- omen：不祥预兆

示例模板：

```text
{name} 曾是 {origin} 的 {classFlavor}。
如今，{pronoun} 为了 {desire} 踏上旅途，同时躲避 {enemy} 的追查。
但 {pronoun} 尚未意识到，{secret} 正在改变命运的方向。
```

## 命名生成

MVP 可以使用按种族分组的词库：

- givenNames
- familyNames
- epithets

若没有足够词库，可以先生成：

```text
{GivenName} {FamilyName}
```

后续再加入称号：

```text
{GivenName} {FamilyName}, the {Epithet}
```

## 导出文本格式

复制文本应优先清晰，避免依赖 Markdown 表格，因为部分聊天工具会破坏表格布局。

推荐格式：

```text
DiceForge Character
Name: Arlen Voss
Race/Class: Human Fighter
Background: Soldier
Alignment: Neutral Good

Abilities:
STR 16 (+3), DEX 12 (+1), CON 14 (+2)
INT 10 (+0), WIS 11 (+0), CHA 9 (-1)

Proficiencies:
Athletics, Intimidation, Survival

Gear:
Longsword, chain mail, explorer's pack

Backstory:
...

Seed: df-7K2M9
```

## 质量约束

- 不允许空故事句。
- 不允许同一装备重复出现。
- 不允许同一熟练项重复出现。
- 不允许属性修正值与属性值不匹配。
- 不允许导出文本缺少名称、种族、职业或属性。

