# StrateName Interface Design References

本目录保存 StrateName 的后续真实界面设计参考图。它们通过内置 image generation 工具生成，用于指导后续 `StrateName-Uniapp/` 的页面实现、组件拆分、视觉密度和交互状态。

这些图片不是宣传图，也不是已运行 H5 的截图。后续工程实现完成后，仍需要用真实浏览器截图替换或补充到 `StrateName-Uniapp/reports/visual/`。

## 设计图清单

| 文件 | 尺寸 | 对应真实界面状态 | 用途 |
| --- | --- | --- | --- |
| [01-home-generator.png](./01-home-generator.png) | 853x1844 | Home / Generator 空状态 | 过滤器、生成按钮、空状态和主导航 |
| [02-generated-results.png](./02-generated-results.png) | 853x1844 | Generated Results | 候选卡片、评分、复制、收藏和风险提示 |
| [03-candidate-detail.png](./03-candidate-detail.png) | 853x1844 | Candidate Detail | 词根结构、评分拆解、理由、法律后缀提示和底部操作 |
| [04-shortlist.png](./04-shortlist.png) | 853x1844 | Shortlist | 候选对比、备注、风险标签、本地存储提示和 4 项底部导航 |
| [05-boardroom-proposal.png](./05-boardroom-proposal.png) | 853x1844 | Boardroom Proposal | Letterhead 预览、模板切换、tagline、导出摘要和合规提示 |
| [06-settings-compliance.png](./06-settings-compliance.png) | 853x1844 | Settings / Compliance | 默认生成设置、seed、过滤开关、隐私/免责声明入口和清空本地数据 |

## 使用原则

- 以这些图作为第一版 UI 目标，但不要逐像素照抄生成图中的偶发细节。
- 真实实现必须优先符合 [../docs/PRODUCT_SPEC.md](../docs/PRODUCT_SPEC.md)、[../docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md) 和 [../docs/COMPLIANCE_AND_RISK.md](../docs/COMPLIANCE_AND_RISK.md)。
- 保留 4 项底部导航：`Generate`、`Shortlist`、`Proposal`、`Settings`。
- 不加入域名可用、商标无风险、公司可注册等承诺性状态。
- 候选名称、评分、风险提示和法律后缀提示必须是真实产品流程的一部分，不做营销装饰。
- 后续实现时，移动端真实截图建议覆盖 360px 和 390px 宽度；本目录图片仅作为高分辨率竖屏设计参考。

## 生成提示摘要

本批图片均使用内置 `image_gen`，按 `ui-mockup` 类型生成。统一约束为：

- 扁平移动 App 界面截图，不带手机壳、浏览器框、手持设备、3D 场景或营销海报背景。
- StrateName 企业命名生成器真实功能界面，不做 landing page 或虚假宣传图。
- 使用 `#F8F5EF`、`#FBF9F5`、`#1B3B2B`、`#0F1E36`、`#B08D57`、`#B7791F` 这一组克制企业视觉色。
- UI 控件要像后续 Vue/uni-app 可实现的真实组件，保留触控尺寸、列表密度、卡片、底部导航和合规提示。
- 避免域名可用、商标清晰、法律注册通过、云同步、协作、营销标语、霓虹渐变和无意义装饰。

对应屏幕提示分别聚焦：

1. Home / Generator：过滤器、生成按钮、空状态。
2. Generated Results：候选列表、评分、复制、收藏、免责声明。
3. Candidate Detail：结构拆解、评分条、理由、法律后缀预览提示。
4. Shortlist：4 个候选对比、本地存储提示、4 项底部导航。
5. Boardroom Proposal：Letterhead 预览、模板切换、tagline、导出摘要。
6. Settings / Compliance：默认设置、seed、过滤、隐私政策、免责声明和清空数据。
