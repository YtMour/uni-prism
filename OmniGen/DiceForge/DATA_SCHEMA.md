# DiceForge 数据结构设计

## 设计原则

- 数据结构先服务 MVP，不提前建复杂规则引擎。
- 数值字段与展示字段分离。
- 所有随机结果应可由 seed 复现。
- 角色输出应能同时服务 UI、复制文本和海报导出。

## Character

```ts
type Character = {
  id: string;
  seed: string;
  name: CharacterName;
  race: RaceRef;
  class: ClassRef;
  background: BackgroundRef;
  alignment: Alignment;
  abilities: AbilityBlock;
  proficiencies: Proficiency[];
  gear: GearItem[];
  backstory: Backstory;
  createdAt: string;
};
```

## CharacterName

```ts
type CharacterName = {
  full: string;
  given: string;
  family?: string;
  epithet?: string;
};
```

## Race

```ts
type Race = {
  id: string;
  name: string;
  nameZh: string;
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  tags: string[];
  namePools?: {
    givenNames: string[];
    familyNames?: string[];
    epithets?: string[];
  };
};
```

## Class

```ts
type Class = {
  id: string;
  name: string;
  nameZh: string;
  primaryAbilities: AbilityKey[];
  proficiencyPool: Proficiency[];
  startingGearPool: GearItem[];
  storyTags: string[];
};
```

## Background

```ts
type Background = {
  id: string;
  name: string;
  nameZh: string;
  proficiencies: Proficiency[];
  gear: GearItem[];
  storyTags: string[];
};
```

## AbilityBlock

```ts
type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

type AbilityScore = {
  key: AbilityKey;
  base: number;
  bonus: number;
  total: number;
  modifier: number;
  rolls?: number[];
  dropped?: number;
};

type AbilityBlock = Record<AbilityKey, AbilityScore>;
```

## Proficiency

```ts
type Proficiency = {
  id: string;
  name: string;
  nameZh?: string;
  type: "skill" | "tool" | "weapon" | "armor" | "language" | "save";
  source: "race" | "class" | "background" | "generated";
};
```

## GearItem

```ts
type GearItem = {
  id: string;
  name: string;
  nameZh?: string;
  category: "weapon" | "armor" | "pack" | "tool" | "focus" | "misc";
  quantity?: number;
  source: "class" | "background" | "generated";
};
```

## Backstory

```ts
type Backstory = {
  sentences: [string, string, string];
  tags: string[];
  components: {
    origin: string;
    desire: string;
    conflict: string;
    secret: string;
  };
};
```

## ExportPayload

```ts
type ExportPayload = {
  characterId: string;
  seed: string;
  plainText: string;
  posterTitle: string;
  posterSubtitle: string;
  posterFields: Array<{
    label: string;
    value: string;
  }>;
};
```

## 数据校验

生成后必须进行校验：

- `name.full` 非空。
- `race.id`、`class.id`、`background.id` 非空。
- 六项属性全部存在。
- `total = base + bonus`。
- `modifier = floor((total - 10) / 2)`。
- `proficiencies` 按 `id + type` 去重。
- `gear` 按 `id + category` 去重。
- 三句背景均非空。

