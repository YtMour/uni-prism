# StrateName 生成系统

## 设计原则

StrateName 的生成系统以“稳重、可信、可解释”为第一优先级。它不是随机拼字玩具，而是一个结构化企业命名引擎。

核心原则：

- 本地生成，不依赖服务端。
- 每个候选都能解释词根、结构和行业匹配理由。
- 生成名称默认使用英文或英文化商业名称，适配跨境、B2B 和集团型业务。
- 不生成真实知名品牌、高混淆商标、敏感词、明显负面词或难读组合。
- 法律后缀只做视觉/格式预览，不暗示真实注册状态。

## 生成输入

| 输入 | 类型 | MVP 默认值 | 说明 |
| --- | --- | --- | --- |
| `industry` | enum | `consulting` | 行业领域 |
| `style` | enum | `globalVenture` | 商业风格序列 |
| `entitySuffix` | enum/list | `auto` | 组织形式或企业后缀 |
| `tone` | enum | `boardroom` | 稳重程度 |
| `length` | enum | `standard` | 名称长度 |
| `count` | number | `8` | 单次候选数量 |
| `seed` | string/null | `null` | 可选复现 seed |
| `strictness` | enum | `standard` | 风险过滤强度 |

## 行业分类

| 行业键 | 展示名称 | 命名偏好 |
| --- | --- | --- |
| `finance` | Finance & Capital | Crest、Prime、Vanguard、Meridian、Apex、Ledger、Northstar |
| `consulting` | Consulting & Service | Advisory、Partners、Strategy、Civic、Keystone、Clarity、Sterling |
| `realEstate` | Real Estate & Construction | Summit、Stone、Harbor、Cedar、Iron、Civic、Foundation |
| `logistics` | Logistics & Trade | Atlas、Bridge、Harbor、Route、Pioneer、Transit、Global |
| `industrial` | Manufacturing & Industrial | Iron、Forge、Beacon、Keystone、Alloy、Summit、Works |
| `holding` | Holdings & Group | Meridian、Crest、Northstar、Apex、Heritage、Vista、Union |

MVP 必须至少实现前四类，后两类可以作为扩展。

## 三大商业风格序列

### 1. Global Venture & Capital

定位：精干、专业、全球化，适合投资银行、管理咨询、法律服务、控股集团和高新企业服务。

结构：

- `strategicRoot + entitySuffix`
- `prestigeRoot + bridgeMorpheme + entitySuffix`
- `directionalRoot + corporateSuffix`

示例：

- `Crestway Partners`
- `Slate Capital`
- `Apex Holdings`
- `Meridian Ventures`

### 2. Heritage Industrial

定位：稳固、踏实、有行业根基，适合制造、贸易、地产、工程和传统实体企业。

结构：

- `materialRoot + industrialSuffix`
- `geographyRoot + tradeSuffix`
- `foundationRoot + trustSuffix`

示例：

- `Beacon Global`
- `IronRiver Industries`
- `Summit Trust`
- `Stonebridge Trading`

### 3. Neo-Enterprise Blend

定位：稳重中保留现代感，适合现代服务业、创意商业实体、跨界集团和新型 B2B 品牌。

结构：

- `latinStem + enterpriseEnding`
- `abstractRoot + softenedEnding`
- `strategicRoot + modernMorpheme`

示例：

- `Stratis Group`
- `Novaterra`
- `Integra`
- `Civora`

## 词库结构

建议 `src/data/lexicon.js` 使用结构化对象，不用散乱字符串数组。

```js
export const roots = [
  {
    token: "Crest",
    type: "prestige",
    industries: ["finance", "holding", "consulting"],
    styles: ["globalVenture"],
    tone: ["boardroom", "premium"],
    syllables: 1,
    meaning: "peak, authority, established ambition",
    riskFlags: []
  }
]
```

核心字段：

| 字段 | 说明 |
| --- | --- |
| `token` | 可组合词根 |
| `type` | `prestige`、`material`、`geography`、`directional`、`latin`、`abstract` |
| `industries` | 适配行业 |
| `styles` | 适配风格 |
| `tone` | 适配稳重程度 |
| `syllables` | 音节数量 |
| `meaning` | 生成理由 |
| `riskFlags` | 负面、混淆、真实品牌等风险标签 |

## 后缀与组织形式

### 企业语义后缀

| 后缀 | 适配行业 | 说明 |
| --- | --- | --- |
| `Partners` | consulting, finance, legal | 专业服务和合伙制语感 |
| `Capital` | finance, holding | 资本、投资和资产管理语感 |
| `Ventures` | finance, holding | 风险投资和成长业务语感 |
| `Holdings` | holding, realEstate, industrial | 控股、集团和资产平台语感 |
| `Group` | all | 通用集团语感 |
| `Industries` | industrial, realEstate | 实体、制造和工程语感 |
| `Trading` | logistics, industrial | 贸易和供应链语感 |
| `Trust` | finance, realEstate | 信托、可靠和稳健语感 |
| `Advisory` | consulting, finance | 顾问和专业服务语感 |
| `Global` | logistics, trading, industrial | 跨境和规模化语感 |

### 法律形式后缀

| 后缀 | 展示用途 | 风险提示 |
| --- | --- | --- |
| `Ltd.` | 有限公司格式预览 | 不代表任何司法辖区已注册 |
| `Inc.` | 美国公司格式预览 | 不代表已成立或可注册 |
| `LLC` | 美国有限责任公司格式预览 | 不代表已成立或可注册 |
| `Corp.` | 公司格式预览 | 不代表已成立或可注册 |
| `GmbH` | 德语地区公司格式预览 | MVP 可暂缓 |
| `Pte. Ltd.` | 新加坡公司格式预览 | MVP 可暂缓 |

实现上应区分 `semanticSuffix` 和 `legalSuffix`：

- `Crestway Partners` 中的 `Partners` 是企业语义后缀。
- `Crestway Partners LLC` 中的 `LLC` 是法律形式后缀。

## 生成流程

1. 读取用户输入和本地偏好。
2. 根据 `industry`、`style`、`tone` 过滤可用词根。
3. 按结构模板生成候选。
4. 应用音节、长度、重复字符、难读组合和禁用词过滤。
5. 计算评分。
6. 去重并按评分排序。
7. 为每个候选生成解释、标签和风险提示。
8. 返回指定数量候选。

## 结构模板

| 模板 | 示例 | 适用 |
| --- | --- | --- |
| `{prestigeRoot}{bridge} {suffix}` | Crestway Partners | capital, consulting |
| `{materialRoot}{geoRoot} {suffix}` | IronRiver Industries | industrial, realEstate |
| `{geoRoot} {suffix}` | Beacon Global | logistics, industrial |
| `{latinStem}{enterpriseEnding}` | Novaterra | neo-enterprise |
| `{directionalRoot} {suffix}` | Northstar Group | holding, consulting |
| `{foundationRoot}{bridge} {suffix}` | Stonebridge Trust | realEstate, finance |

桥接片段示例：

- `way`
- `bridge`
- `field`
- `stone`
- `river`
- `crest`
- `mark`

## 评分模型

总分建议 100 分。

| 维度 | 权重 | 说明 |
| --- | --- | --- |
| Professional Fit | 25 | 是否符合企业、集团、资本或服务机构语感 |
| Trust Signal | 20 | 是否稳定、可信、不过度轻浮 |
| Industry Match | 20 | 是否匹配用户选择行业 |
| Readability | 15 | 是否易读、易拼、音节合理 |
| Distinctiveness | 10 | 是否避免过度通用和重复 |
| Risk Control | 10 | 是否避开敏感词、高混淆词和负面含义 |

候选卡片应展示总分和 2 到 3 条简短理由，不要把评分伪装成法律或市场验证。

## 过滤规则

### 必须过滤

- 明显敏感词、仇恨词、色情词、暴力词和政治极端词。
- 真实知名公司、知名商标和高度近似拼写。
- 明显负面商业含义，如 fraud、scam、debt trap、collapse。
- 难读组合，如连续 4 个辅音、重复元音过多、过长无分隔。
- 与法律后缀组合后容易误导的名称。

### 应该降权

- 过度通用的 `Global Group`、`Prime Capital` 等组合。
- 名称长度超过目标档位。
- 同一批候选中词根重复过多。
- 行业匹配弱但分数高的跨风格组合。

## 质量采样

后续工程应提供 `npm run sample:quality`，输出到 `reports/generation-quality.json`。

建议指标：

| 指标 | MVP 阈值 |
| --- | --- |
| 采样候选数 | >= 10000 |
| 重复实例率 | < 8% |
| 禁用词命中率 | 0 |
| 平均总分 | >= 78 |
| 可读性通过率 | >= 92% |
| 行业覆盖 | 每个 MVP 行业都能生成 >= 500 个唯一候选 |
| 单批通过候选数 | 单次 8 个候选中至少 5 个通过 |

## 示例输出对象

```js
{
  name: "Crestway Partners",
  displayName: "Crestway Partners LLC",
  style: "globalVenture",
  industry: "finance",
  semanticSuffix: "Partners",
  legalSuffix: "LLC",
  score: 88,
  tags: ["Capital-ready", "Boardroom", "Professional services"],
  breakdown: {
    professionalFit: 23,
    trustSignal: 18,
    industryMatch: 18,
    readability: 14,
    distinctiveness: 8,
    riskControl: 7
  },
  rationale: [
    "Crest suggests authority and a high point of ambition.",
    "Partners fits advisory, capital and professional-service contexts.",
    "The name is concise and suitable for a formal proposal card."
  ],
  disclaimer: "Creative naming suggestion only. Verify company registration, trademark and domain availability before use."
}
```
