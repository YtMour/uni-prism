# MythosGen QA Verification

更新时间：2026-06-29

本文档记录 MythosGen 当前 H5 原型的验证范围、已执行命令、浏览器结论和已知问题。后续每次修复交互、视觉或构建问题时，优先更新本文件，再同步 `IMPLEMENTATION_STATUS.md`。

## 当前验证结论

- H5 开发服务：`npm run dev:h5`，当前使用端口 `5179`。
- H5 构建验证：`npm run check` 已执行通过。
- 自动化测试：12 个测试文件、31 个用例通过。
- H5 smoke：`npm run smoke:h5` 已接入 `npm run check`。
- 生成质量采样：`npm run sample:quality` 已生成 `reports/generation-quality.json`；当前 900 次采样唯一结果 836 个，重复率 7.11%。
- H5 构建：`DONE Build complete`。
- 依赖审计：`vitest` 已升级到 3.2.6，critical 漏洞已消除；`npm audit --audit-level=moderate` 仍报告 27 个漏洞，主要来自 uni/vite 依赖链。
- 外部浏览器：用户反馈可点击，说明业务代码和 dev 服务在普通浏览器链路中可用。
- Codex 右侧内置浏览器：曾出现用户可见 tab 与自动化可控 tab 脱节，表现为用户手动点击无响应，但自动化坐标点击可触发页面事件。

## 已执行命令

```bash
npm run test -- tests/tapInteractionContract.test.js
npm run test -- tests/realmControlContract.test.js
npm run smoke:h5
npm run sample:quality
npm run check
npm run dev:h5
npm audit --audit-level=moderate
```

## 自动化覆盖

| 测试文件 | 覆盖内容 |
| --- | --- |
| `tests/generator.test.js` | Realm 生成、seed、metadata |
| `tests/favorites.test.js` | 收藏去重、删除、本地存储 key 和上限 |
| `tests/settings.test.js` | 设置默认值、归一化、偏好更新 |
| `tests/policy.test.js` | 隐私政策、免责声明、当前实现和后续计划 |
| `tests/pocket.test.js` | 收藏口袋筛选和 Realm 标签 |
| `tests/topActions.test.js` | 顶部 Pocket 与声明入口语义 |
| `tests/controlStyle.test.js` | Realm 控件圆角和分段样式约束 |
| `tests/exportCard.test.js` | SVG Export Card 内容转义、PNG/SVG 文件名和失败提示 |
| `tests/sampler.test.js` | 生成质量采样统计结构和公开 MVP 重复率门槛 |
| `tests/realmStatus.test.js` | 顶部 Realm 状态文案 |
| `tests/realmControlContract.test.js` | Realm 切换事件使用 `select-realm` 与 `@tap` |
| `tests/tapInteractionContract.test.js` | 用户触控入口不再使用 `@click`，统一使用 `@tap` |

## 浏览器 Smoke 范围

当前 H5 首页应验证以下交互：

| 操作 | 预期 |
| --- | --- |
| 点击 `Filter` | 打开 `Mythos Filters` 抽屉 |
| 点击 Realm：Elf / Dragon / Spell | 当前 Realm、顶部状态和生成结果同步更新 |
| 点击 `Favorite` | 当前名称保存到 Pocket，按钮进入 saved 状态 |
| 点击顶部 Pocket | 打开 `Inspiration Pocket` 面板 |
| 点击 `Export` | 打开 `Export Card` 预览，并提供 PNG/SVG 下载入口 |
| 点击右上角声明入口 | 跳转 Settings，并显示 Privacy Policy 与 Disclaimer |

## 视觉 Smoke 范围

| 页面 | 检查点 |
| --- | --- |
| 首页 | 右上角 Pocket 状态点不裁切、不压住图标；底部 Realm 和工具栏无异常圆角或重边框 |
| Filter | 仍为底部抽屉，不被全高面板样式污染；Reset / Apply 在一屏内可见 |
| Pocket | 全高收藏面板，底部选中计数和 Export Selected 不溢出视口 |
| Export | 全高预览面板，卡片和 PNG/SVG 按钮一屏内完整可见，无外层滚动条 |
| Settings | 首屏设置项可读，隐私政策和免责声明在后续滚动区域 |

## Codex 右侧内置浏览器已知问题

### 现象

在右侧内置浏览器中，页面显示正常，但用户手动点击可能没有反应；同一地址在外部浏览器可以点击。

### 已观察到的诊断信号

出现过以下状态：

```json
{
  "userTabs": [],
  "autoTabs": [
    {
      "id": "14",
      "url": "http://127.0.0.1:5179/#/",
      "title": "MythosGen"
    }
  ]
}
```

这表示右侧浏览器的用户可见层和自动化可控层不完全一致。此时不能把“自动化点得动”直接等价为“用户当前可见 tab 手动点得动”。

### 代码侧排除项

已检查并修复：

- 用户入口统一改为 uni-app `@tap`。
- 关键事件从模板内联 `$emit` 改为具名 methods。
- Realm 自定义事件改为 `select-realm`，避免和原生/表单 `change` 语义混淆。
- 关键按钮增加 `data-testid`，减少自动化选择器误判。
- 自动化坐标点击命中 `Filter` 后可打开抽屉，说明页面 DOM、按钮区域和业务事件链可工作。

### 当前处理建议

如果右侧内置浏览器仍无法手动点击：

1. 点击浏览器空白区域，让右侧页面重新获得焦点。
2. 刷新 `http://127.0.0.1:5179/#/`。
3. 关闭右侧 tab 后重新打开同一地址。
4. 以外部浏览器作为人工验收主链路，右侧内置浏览器用于截图和自动化辅助检查。

## 后续验证计划

- 建立视觉截图基准，覆盖首页、Filter、Pocket、Settings。
- 在 App 原生保存完成后，补充相册写入和失败降级验证。
