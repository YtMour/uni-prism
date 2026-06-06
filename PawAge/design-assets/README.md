# PawAge 设计素材索引

本目录存放 PawAge 使用 imagegen 生成的统一风格位图素材。当前素材遵循 `Design.md` 中的 Soft Minimalism / Modern Illustration 方向：奶油色背景、肉桂棕、鼠尾草绿、柔和粉橘与浅蓝点缀，整体避免医疗化、过度卡通化和高饱和电商风。

## imagegen

路径：`design-assets/imagegen/`

| 文件 | 用途 |
| --- | --- |
| `app-icon-1024.png` | App 图标正式尺寸，1024x1024。 |
| `app-icon-1024-rounded.png` | App 图标圆角透明版，1024x1024，四角 alpha 透明。 |
| `app-icon-source.png` | App 图标原始生成图，保留用于二次裁切或重采样。 |
| `onboarding-hero-landscape.png` | 横版 onboarding / 官网主视觉大图。 |
| `app-preview-portrait.png` | 竖版 App Store 预览或产品展示图。 |
| `share-card-background.png` | Instagram Story / TikTok 分享卡背景。 |
| `lifecycle-puppy.png` | Puppy / Junior 阶段小图素材。 |
| `lifecycle-kitten.png` | Kitten / Junior 阶段小图素材。 |
| `lifecycle-senior-pets.png` | Senior / Geriatric 阶段小图素材。 |
| `timeline-paw-marker.png` | 生命周期时间轴脚印节点素材。 |
| `lifecycle-puppy-transparent.png` | 纯绿幕重生成后抠除背景的幼犬透明素材。 |
| `lifecycle-kitten-transparent.png` | 纯绿幕重生成后抠除背景的幼猫透明素材。 |
| `lifecycle-senior-pets-transparent.png` | 纯绿幕重生成后抠除背景的老年宠物透明素材。 |
| `timeline-paw-marker-transparent.png` | 纯绿幕重生成后抠除背景的时间轴脚印节点透明素材。 |
| `onboarding-hero-subject-transparent.png` | Onboarding 主视觉中的宠物 + 时间轴主体透明版。 |

### 页面设计图

路径：`design-assets/imagegen/screens/`

| 文件 | 用途 |
| --- | --- |
| `screen-home-dashboard.png` | 首页 Dashboard 设计图。 |
| `screen-add-pet.png` | 新建 / 编辑宠物档案设计图。 |
| `screen-life-stage-detail.png` | 生命周期详情页设计图。 |
| `screen-share-card-builder.png` | 分享卡编辑器设计图。 |
| `screen-settings-privacy.png` | 设置、隐私与 Pro 入口设计图。 |

### 抠除背景素材

路径：`design-assets/imagegen/cutouts/`

| 文件 | 用途 |
| --- | --- |
| `dog-adult.png` | 透明背景成年犬单体素材。 |
| `cat-adult.png` | 透明背景成年猫单体素材。 |
| `lifecycle-puppy-transparent.png` | 透明背景幼犬生命周期素材。 |
| `lifecycle-kitten-transparent.png` | 透明背景幼猫生命周期素材。 |
| `lifecycle-senior-pets-transparent.png` | 透明背景老年宠物生命周期素材。 |
| `timeline-paw-marker-transparent.png` | 透明背景生命周期脚印节点素材。 |
| `dog-size-small.png` | 透明背景小型犬体型选择素材。 |
| `dog-size-medium.png` | 透明背景中型犬体型选择素材。 |
| `dog-size-large.png` | 透明背景大型犬体型选择素材。 |
| `dog-size-giant.png` | 透明背景巨型犬体型选择素材。 |
| `onboarding-hero-subject.png` | 透明背景 onboarding 宠物 + 时间轴主体组合素材。 |
| `icon-food-bowl.png` | 透明背景营养建议图标。 |
| `icon-activity-toy.png` | 透明背景活动建议图标。 |
| `icon-wellness-leaf.png` | 透明背景养护建议图标。 |
| `icon-birthday-milestone.png` | 透明背景生日 / 年龄升级提醒图标。 |
| `icon-reminder-bell.png` | 透明背景通知提醒图标。 |
| `empty-pet-bed.png` | 透明背景无宠物档案空状态素材。 |
| 其它 PNG | 运行时可直接使用的透明素材。生成过程中的绿幕源图已清理。 |

## 接入建议

- App 内真实文案建议使用前端文本叠加，不直接写入图片，避免多语言和清晰度问题。
- 新生成的 `cutouts/*.png` 已经是透明背景，可直接叠加在页面、分享卡或空状态中。
- 旧的小图仍为方形带奶油色背景；运行时优先使用对应的 `*-transparent.png` 版本。
- 分享卡建议使用 `share-card-background.png` 作为背景，再由前端叠加宠物名字、年龄、阶段和 PawAge 标识。
- `onboarding-hero-landscape.png` 和 `share-card-background.png` 是完整背景 / 场景图，不建议直接抠除背景。需要可叠加元素时，使用对应的透明主体素材，或重新生成专用 cutout。
- `app-icon-1024-rounded.png` 可作为需要透明圆角的图标源；正式上架前仍建议在 iOS / Android 图标蒙版下做一次视觉检查。

## 清理记录

已删除生成过程中的绿幕源图、失败 alpha 样本和重复旧命名素材。当前 `design-assets/imagegen/` 保留设计稿、背景图、图标源图和最终透明 PNG；PawAge 应用运行目录 `static/assets/` 只保留首版 App 需要引用的精简素材。

## 素材缺口建议

当前素材已经能覆盖首页、建档页、生命周期详情、分享卡和设置页。后续如果继续丰富，优先补以下几类：

- 宠物头像占位：猫、狗、混合宠物的默认头像。
- Pro 权益素材：高级报告、分享模板、自定义提醒的轻量插画。
- 多宠 Dashboard 素材：两只或三只宠物组合图，用于多宠空状态和 Pro 引导。
- 错误 / 权限状态素材：通知权限关闭、清除数据确认、分享失败等小状态图。
- App Store 截图套图：带真实前端 UI 文案的最终截图，不建议继续依赖生成图里的伪文字。
