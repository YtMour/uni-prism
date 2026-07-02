# VibeName 生成系统设计

## 设计原则

VibeName 第一版生成系统应本地化、可解释、可测试。它不依赖远程 AI，而是使用结构化词库、音节矩阵、行业权重和评分规则生成候选名称。

核心目标：

- 输出短、好读、有科技产品感的候选。
- 控制重复率和难读组合。
- 能解释名称为什么适合当前行业和风格。
- 支持 seed 复现和质量采样。

## 生成流水线

```text
用户偏好
  -> 选择风格模板
  -> 加载行业词库与权重
  -> 生成候选名称
  -> 规范化大小写
  -> 禁用词与冲突过滤
  -> 可读性评分
  -> 品牌感评分
  -> 行业匹配评分
  -> 去重与排序
  -> 输出候选卡片
```

## 核心数据结构

建议 TypeScript 风格模型：

```ts
export type NamingStyle =
  | 'micro-saas'
  | 'abstract'
  | 'action-driven';

export type Industry =
  | 'ai'
  | 'devtools'
  | 'fintech'
  | 'creator'
  | 'productivity'
  | 'design'
  | 'data';

export interface NameCandidate {
  id: string;
  name: string;
  style: NamingStyle;
  industries: Industry[];
  formula: string;
  syllables: string[];
  sourceParts: NamePart[];
  score: NameScore;
  reason: string;
  seed: string;
  createdAt: number;
}

export interface NameScore {
  readability: number;
  brandability: number;
  industryFit: number;
  brevity: number;
  distinctiveness: number;
  total: number;
}

export interface NamePart {
  value: string;
  type: 'industry' | 'suffix' | 'action' | 'benefit' | 'syllable';
  tags: string[];
  weight: number;
}
```

## 词库分类

当前实现中，核心生成逻辑位于 `VibeName-Uniapp/src/core/generator.js`，词库数据已拆分到 `VibeName-Uniapp/src/data/lexicon.js`。后续扩词库时优先编辑 `lexicon.js`，避免把数据继续堆进生成器逻辑。

短名重复率曾经是主要瓶颈，因此当前词库额外拆出了 `SHORT_DOMAIN_ROOTS`、`SHORT_ACTION_WORDS` 和扩展后的 `SHORT_SUFFIXES`。Short 模式优先使用短词池，避免先生成过长组合再过滤导致实际可用组合空间变窄。

### 现代科技词根

用于 Micro-SaaS Blend 和 Action-Driven。

| 类型 | 示例 | 用途 |
| --- | --- | --- |
| 工作流 | Flow、Task、Desk、Board、Stack | Productivity / DevTools |
| 速度 | Rapid、Swift、Flash、Sprint、Boost | Action-Driven |
| 智能 | Mind、Sense、Logic、Neural、Prompt | AI / Data |
| 构建 | Forge、Craft、Build、Mint、Launch | 工具和创造类产品 |
| 数据 | Grid、Chart、Metric、Query、Signal | Data / Analytics |

### SaaS 后缀

| 类型 | 示例 | 风险 |
| --- | --- | --- |
| 常见后缀 | ly、ify、base、hub、kit、stack | 容易同质化，需要评分降权 |
| 产品感后缀 | deck、grid、pilot、scope、forge | 品牌感较强 |
| 平台感后缀 | cloud、labs、works、studio | 更适合公司或产品线 |

### 抽象音节

用于 Neomorphic Abstract。

| 音节组 | 示例 |
| --- | --- |
| 开头 | Ve、Ze、Ae、No、Lu、Ki |
| 中段 | xi、ra、tho、len、mir、sol |
| 结尾 | is、a、io、en、ora、ix |

抽象名称必须通过发音过滤，避免连续 3 个以上难读辅音或无意义过长组合。

### 行业词

| 行业 | 词根示例 |
| --- | --- |
| AI / ML | Prompt、Neural、Vector、Synth、Model |
| DevTools | Code、Stack、Repo、Build、Deploy |
| Fintech | Mint、Ledger、Vault、Pay、Yield |
| Creator | Canvas、Cast、Muse、Clip、Studio |
| Productivity | Flow、Task、Focus、Plan、Note |
| Design | Frame、Pixel、Grid、Craft、Palette |
| Data | Query、Metric、Chart、Signal、Lake |

## 风格模板

### Micro-SaaS Blend

模板：

```text
root + suffix
domainRoot + productSuffix
verbRoot + platformSuffix
shortRoot + shortSuffix
root + benefit + suffix
```

示例：

- Flowbase
- CodeArk
- Mintify
- TaskPilot

评分重点：

- brevity 权重高。
- industryFit 权重中高。
- 常见后缀过多时 distinctiveness 降权。

### Neomorphic Abstract

模板：

```text
prefixSyllable + middleSyllable + endingSyllable
softRoot + abstractEnding
```

示例：

- Vexis
- Zentra
- Aethel
- Norix

评分重点：

- readability 必须过阈值。
- brandability 权重高。
- industryFit 通过标签弱绑定，不强行解释。

### Action-Driven

模板：

```text
actionVerb + domain
speedWord + productDomain
valuePromise + object
shortAction + shortRoot
shortAction + shortRoot + shortSuffix
actionVerb + industryNoun + benefit
```

示例：

- LaunchStack
- PeakData
- ShiftPage
- BoostFrame

评分重点：

- industryFit 和清晰度权重高。
- 长度过长时 brevity 降权。

每个候选会输出 `formula`，例如 `industry + suffix` 或 `action + industry + benefit`，详情面板显示这个公式和词源片段，防止用户只看到无法解释的组合结果。

## 评分模型

建议 MVP 先使用 0 到 100 分的加权评分：

| 维度 | 权重 | 说明 |
| --- | --- | --- |
| readability | 30% | 是否好读、好拼、没有难读辅音堆叠 |
| brandability | 25% | 是否像一个现代科技品牌 |
| industryFit | 20% | 是否匹配所选行业 |
| brevity | 15% | 是否足够短 |
| distinctiveness | 10% | 是否避免过度常见模板 |

## 过滤规则

必须过滤：

- 空字符串或长度小于 3。
- 长度大于 18，除非用户选择描述型组合。
- 连续 3 个以上相同字符。
- 过多连续辅音或连续元音。
- 禁用词、敏感词、明显负面含义。
- 与内置保留品牌高度相似的词。

应该过滤：

- 后缀重复感过强的候选。
- 同一批结果中仅大小写不同的候选。
- 音节切分后不可读的抽象词。

## 质量采样脚本

当前已提供：

```bash
npm run sample:quality
```

输出指标：

- sampleSize
- duplicateRate
- averageScore
- passRate
- averageLength
- topRejectedReasons
- scoreDistribution

当前报告输出：

- `VibeName-Uniapp/reports/generation-quality.json`

当前 2026-07-02 采样结果：

| 指标 | 当前值 |
| --- | ---: |
| batchCount | 1440 |
| totalCandidates | 11520 |
| uniqueNames | 10643 |
| duplicateRate | 7.61% |
| averageScore | 86.58 |
| passRate | 100% |

MVP preview 阈值：

- `sampleSize >= 1000`
- `duplicateRate <= 0.25`
- `passRate >= 0.98`
- `averageScore >= 70`

Public release 建议阈值：

- `sampleSize >= 1000`
- `duplicateRate <= 0.08`
- `passRate >= 0.70`
- `averageScore >= 70`

## 商标、域名与隐私边界

MVP 不做实时域名或商标可用性判断。当前 App 已在 Preview 保留创意建议提醒，并在 Settings 提供分段 Privacy policy 和 Disclaimer：

- Privacy policy：说明生成结果、收藏和偏好设置保存在本地设备，当前 MVP 不收集账号/邮箱/位置/支付/媒体权限等信息，不出售、不共享、不上传命名输入，并说明保留期限、清除方式、剪贴板边界和安全限制。
- Disclaimer：说明生成名称仅为创意建议，不检查域名、商标、公司注册、应用商店、社交账号或限制词，公开使用前需要自行完成检索、法律审查和市场适配判断。

后续如接入域名查询，应明确标注只是域名注册状态，不代表商标或法律可用性。
