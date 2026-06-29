# MythosGen: Fantasy Name Creator

> 赋予虚无以姓名。MythosGen 是一款追求审美、沉浸式交互，并专为 D&D 跑团玩家、奇幻小说作者与 RPG 游戏玩家设计的无限角色命名应用。

## 独立定位

`FantasyNameGenerator/` 是当前需要构建的 MythosGen App 项目文件夹。后续应用源码、uni-app 配置、页面、组件、生成数据、静态资源、项目内说明和构建脚本都应保存在本目录内。

MythosGen 是 OmniGen 随机生成系列下的首个重点 App。它按独立应用规划和发布，确保品牌、功能、数据和商业化路径足够清晰；OmniGen 根目录只承担系列管理与文档索引职责。

## 视觉定位

- **App 名称：** MythosGen
- **副标题：** Fantasy Name Creator
- **交互点缀色：** 暮色深紫 `#1C1A27`
- **主画布：** 羊皮纸白 `#FBF9F5`
- **核心字体：** `Cinzel` 或 `Playfair Display`
- **卡片质感：** 轻微磨砂玻璃、柔和阴影、极简装裱线

## 核心功能

### The Trinity Realms

**Elf Names**

- 风格：优雅、轻盈、自然、星光感。
- 音节倾向：`Ae-`、`Ere-`、`Cael-`、`-lia-`、`-thil-`、`-riel`。
- 示例：`Caerithon`、`Aeliana`。

**Dragon Names**

- 风格：沉重、威严、古老、火焰与石质感。
- 音节倾向：`Ig-`、`Thor-`、`Vol-`、`-rax-`、`-vath-`、`-or`。
- 示例：`Ignisvath`、`Thoraxor`。

**Magic & Spells**

- 风格：神秘、深奥、拉丁语感与秘仪感。
- 结构倾向：双词组合、元素词根、抽象概念。
- 示例：`Vortex Lumina`、`Crux Mystica`。

### Mythos Filters

- **Gender：** Masculine / Feminine / Gender-Neutral。
- **Alignment：** Holy / Shadow / Primal。
- **Tone：** Elegant / Harsh / Ancient。

### Inspiration Pocket

- 双击收藏满意结果。
- 长按复制结果。
- 本地暂存夹保存名字、类型、过滤器和 seed。
- 选中名字可导出为极简画廊海报卡片。

## MVP 判断标准

- 用户打开应用后可以在 5 秒内生成第一个名字。
- 用户能快速切换 Elf、Dragon、Magic 三类生成器。
- 至少 80% 的采样结果具备可读性和对应领域风格。
- 收藏、复制和导出不打断主生成体验。

## 相关文档

- [文档索引](docs/DOCUMENTATION_INDEX.md)
- [产品规划](docs/MYTHOSGEN_PRODUCT_PLAN.md)
- [生成系统](docs/MYTHOSGEN_GENERATION_SYSTEM.md)
- [设计系统](docs/MYTHOSGEN_DESIGN_SYSTEM.md)
- [路线图](docs/MYTHOSGEN_ROADMAP.md)
- [实现状态](docs/IMPLEMENTATION_STATUS.md)

## 保存位置约定

- App 代码：`FantasyNameGenerator/src/` 或 uni-app 对应源码目录。
- 页面与组件：保存在 `FantasyNameGenerator/` 内，不放到 OmniGen 根目录。
- 生成数据：保存在 `FantasyNameGenerator/` 内，例如 `data/`、`common/` 或 `src/data/`。
- 根目录：只保留 OmniGen 系列管理 README。
- MythosGen 项目文档：保存在 `FantasyNameGenerator/docs/`。
