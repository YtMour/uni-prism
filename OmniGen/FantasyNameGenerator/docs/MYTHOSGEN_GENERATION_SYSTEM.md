# MythosGen Generation System

## 目标

生成系统需要在离线、本地、可维护的前提下产出稳定风格的奇幻名字。早期不依赖远程 AI，使用结构化音节矩阵、权重、过滤器和后处理规则。

## 数据模型

每个生成领域由四类数据组成。

| 数据 | 说明 |
| --- | --- |
| Prefix | 名字开头，决定第一印象和音系来源 |
| Core | 中段音节，决定流动感、重量感和异域感 |
| Suffix | 收尾音，决定性别倾向、种族感和记忆点 |
| Modifier | 阵营、语气、元素、古典词根等附加权重 |

建议数据结构：

```ts
type Syllable = {
  text: string;
  tags: string[];
  weight: number;
  avoidWith?: string[];
};

type GeneratorRealm = {
  id: string;
  label: string;
  prefixes: Syllable[];
  cores: Syllable[];
  suffixes: Syllable[];
  patterns: string[];
};
```

## 生成流程

1. 选择领域：Elf、Dragon、Magic。
2. 应用过滤器：Gender、Alignment、Tone。
3. 根据 tags 调整候选音节权重。
4. 选择 pattern，例如 `prefix + core + suffix` 或 `prefix + suffix`。
5. 执行音节拼接与清理。
6. 检查禁用组合、重复字符和过长结果。
7. 返回 name、realm、tags、seed 和 explain metadata。

## 领域规则

### Elf Names

风格关键词：优雅、轻盈、星光、自然、古老血脉。

- 常用开头：`Ae`、`Ere`、`Cael`、`Lia`、`Thae`。
- 常用中段：`lia`、`thil`、`rion`、`syl`、`ael`。
- 常用收尾：`wind`、`gorn`、`riel`、`thas`、`nor`。
- 避免过重爆破音连续出现。

### Dragon Names

风格关键词：威严、古老、火焰、石质、压迫感。

- 常用开头：`Ig`、`Thor`、`Vol`、`Krag`、`Draz`。
- 常用中段：`rax`、`vath`、`gor`、`zhar`、`mord`。
- 常用收尾：`os`、`or`、`ath`、`ion`、`urn`。
- 可以允许更长、更硬的辅音组合。

### Magic & Spells

风格关键词：拉丁语感、秘仪、抽象元素、古老法典。

- 结构优先使用双词组合，例如 `Vortex Lumina`。
- 第一词偏动作或力量，第二词偏元素或概念。
- 可输出法术名、神器名、仪式名。

## 过滤器设计

| 过滤器 | 值 | 作用 |
| --- | --- | --- |
| Gender | Masculine / Feminine / Neutral | 调整收尾音和柔硬音比例 |
| Alignment | Holy / Shadow / Primal | 调整光明、低沉、原始音节权重 |
| Tone | Elegant / Harsh / Ancient | 控制长度、辅音密度和古典词根比例 |

## 质量守卫

- 结果长度默认控制在 5 到 16 个字符，咒语可到 24 个字符。
- 禁止出现三次以上连续相同字符。
- 避免明显现代英语单词直接拼接导致廉价感。
- 每次生成返回 seed，方便后续复现或生成变体。
- 收藏内容保存生成 metadata，方便未来按规则回放。

## 后续扩展

- 新增 Realm Pack：Dwarf、Orc、Demon、Celestial、Fae、Ancient Kingdom。
- 引入 Markov 或 weighted grammar 混合模式，但保留规则解释能力。
- 增加批量生成与 CSV/JSON 导出。
- 支持用户自定义词根包。
