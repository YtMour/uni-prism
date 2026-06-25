# CampPack Icon Assets

本目录保存逐个生成的 App 图标与 App 内素材图标。每个 PNG 都由单独 imagegen 请求生成，避免多图合并后裁切异常。

## 文件清单

| 文件 | 用途 |
| --- | --- |
| `app-icon.png` | 应用图标概念 |
| `category-shelter.png` | Shelter 分类 |
| `category-cooking.png` | Cooking 分类 |
| `category-gear.png` | Gear 分类 |
| `category-clothing.png` | Clothing 分类 |
| `category-safety.png` | Safety / First Aid 分类 |
| `category-hydration.png` | Hydration 分类 |
| `category-fire-tools.png` | Fire & Tools 分类 |
| `nav-checklists.png` | Lists / Checklists 导航 |
| `nav-templates.png` | Templates 导航 |
| `nav-settings.png` | Settings 导航 |

## 使用建议

- 这些 PNG 适合作为视觉方向和临时素材。
- 正式开发时，导航和分类图标建议重绘成 SVG，或用 lucide 图标按同样颜色和线宽实现。
- App 图标建议在 Figma / SVG 中重绘后导出 iOS 与 Android 所需尺寸。
- 当前 PNG 背景为温暖纸张色，不是透明背景；如用于真实 UI，应优先重绘为透明 SVG。
