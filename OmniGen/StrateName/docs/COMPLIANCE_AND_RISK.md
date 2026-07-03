# StrateName 合规与风险边界

## 基本原则

StrateName 只能提供企业命名灵感，不能提供法律、商标、公司注册、域名、税务、投资或商业合规意见。

产品内所有生成、评分和预览都必须明确保持以下边界：

- 名称可读、好看或评分高，不代表可注册。
- 显示 `Inc.`、`LLC`、`Ltd.` 等后缀，不代表公司已经成立。
- 没有风险提示，不代表不存在商标、公司登记、域名或市场混淆风险。
- 用户在正式使用前必须自行进行人工尽调。

## MVP 免责声明

建议在独立 Disclaimer 页面、首次使用提示和导出摘要中保留免责声明：

1. StrateName generates creative business-name suggestions only.
2. It does not check company registry, trademark, domain, social handle or legal availability.
3. It is not legal, financial, tax, investment or business advice.
4. Users must verify availability and compliance with qualified professionals before using a name.
5. Legal suffixes such as Ltd., Inc., LLC and Corp. are visual formatting options only.

当前 H5 MVP 已将隐私政策和免责声明拆成独立页面，并提供 16 种主流语言法律文案：

- `en`
- `zh-Hans`
- `zh-Hant`
- `es`
- `fr`
- `de`
- `ja`
- `ko`
- `pt-BR`
- `it`
- `ru`
- `ar`
- `hi`
- `id`
- `tr`
- `vi`

中文界面可对应为：

1. StrateName 仅提供企业命名灵感。
2. 本应用不检查公司注册、商标、域名、社媒账号或法律可用性。
3. 本应用不构成法律、财务、税务、投资或商业建议。
4. 正式使用名称前，用户应自行联系专业人士完成尽调。
5. `Ltd.`、`Inc.`、`LLC`、`Corp.` 等后缀仅为格式预览，不代表公司已注册或可注册。

## 法律后缀处理

### 展示策略

- MVP 可以提供 `Ltd.`、`Inc.`、`LLC`、`Corp.` 作为展示选项。
- 每次打开法律后缀选择器时，应在底部显示简短提示。
- 导出摘要中必须包含法律后缀免责声明。
- 不要按国家/州宣称某个后缀适用，除非后续接入可靠法律规则库并完成审校。

### 数据结构建议

```js
{
  label: "LLC",
  displayName: "LLC",
  type: "legalSuffix",
  regions: ["US"],
  mvpEnabled: true,
  disclaimerKey: "legalSuffixPreviewOnly"
}
```

`regions` 仅用于展示和后续扩展，不用于 MVP 的合规判断。

## 商标和真实品牌风险

必须建立本地禁用词和高风险词表，至少覆盖：

- 全球知名公司和平台名称。
- 明显近似拼写。
- 金融、医疗、保险、法律等高监管行业中容易误导的词。
- 暗示政府、银行、证券、监管机构背书的词。
- 负面含义词。

候选命中高风险词时应直接过滤；命中弱风险词时可以降权并展示提示。

## 公司注册风险

StrateName 不应提供以下表达：

- “available”
- “registerable”
- “safe to use”
- “trademark clear”
- “legally approved”
- “guaranteed”

推荐表达：

- “Creative suggestion”
- “Needs verification”
- “Check registry before use”
- “Trademark review required”
- “Domain availability not checked”

## 域名和账号风险

MVP 不接入域名或社媒账号查询。界面中不应显示“域名可用”或“账号可用”。

后续如果添加域名查询，必须：

- 标明查询时间。
- 处理 API 失败和过期结果。
- 不把域名可注册等同于商标安全。
- 不在无结果时暗示可用。

## 隐私边界

MVP 建议完全本地化：

- 不上传生成结果。
- 不上传收藏列表。
- 不上传用户备注。
- 不上传 seed。
- 不使用账号体系。

本地存储可以保存：

- 最近生成结果。
- 收藏候选。
- 用户备注。
- 默认过滤器。
- UI 设置。

必须提供：

- 清空本地数据。
- 隐私政策入口。
- 本地数据范围说明。
- 法律文案语言选择。

## 高监管行业提示

以下行业需要更谨慎的文案：

- Banking
- Securities
- Insurance
- Healthcare
- Legal services
- Government contractors
- Education credentials
- Crypto and financial products

当用户选择这些行业或候选包含相关词时，系统应提示“名称可能涉及更高合规审查，请在使用前咨询专业人士”。

## 发布前合规验收

公开 H5 MVP 发布前必须完成：

- 独立免责声明页存在且可从 Settings 访问。
- 独立隐私政策页存在且可从 Settings 访问。
- 主流语言法律文案已覆盖，且公开发布前完成对应语言审校。
- 导出摘要包含免责声明。
- 法律后缀选择器有预览用途提示。
- 生成结果没有“可注册”“无商标风险”等承诺性文案。
- 禁用词表覆盖至少 100 个高风险真实品牌/机构片段。
- 隐私政策明确说明数据不上传。
- 清空本地数据可用。
- 人工抽样 100 个候选，无明显真实知名品牌、高混淆词或冒犯性内容。
