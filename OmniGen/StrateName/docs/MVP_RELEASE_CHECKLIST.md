# StrateName MVP 发布清单

本文档定义 StrateName H5 MVP 的公开发布门槛。当前项目仍在文档建设阶段，除文档基线外，其余项目均未完成。

## 1. 文档与范围

| 检查项 | 状态 | 说明 |
| --- | --- | --- |
| 项目 README | Done | [../README.md](../README.md) |
| 文档索引 | Done | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |
| 产品规格 | Done | [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) |
| 生成系统 | Done | [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md) |
| 设计系统 | Done | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| 合规风险 | Done | [COMPLIANCE_AND_RISK.md](./COMPLIANCE_AND_RISK.md) |
| 路线图 | Done | [ROADMAP.md](./ROADMAP.md) |
| 实现状态 | Done | [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) |

## 2. 工程与基础运行

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| `StrateName-Uniapp/` 工程 | 可安装、可运行 | Not Started |
| H5 dev 命令 | 可本地启动 | Not Started |
| H5 build 命令 | 构建成功 | Not Started |
| `npm test` | 通过 | Not Started |
| `npm run check` | 串联关键检查 | Not Started |
| 依赖审计 | 有报告和风险决策 | Not Started |

## 3. 核心产品功能

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 本地名称生成 | 单次生成 8 个候选 | Not Started |
| 三大商业风格 | Global Venture、Heritage Industrial、Neo-Enterprise | Not Started |
| 行业过滤 | 至少 4 个 MVP 行业 | Not Started |
| 组织形式切换 | 企业语义后缀和法律形式后缀分离 | Not Started |
| 候选评分 | 至少 6 个评分维度 | Not Started |
| 候选详情 | 结构拆解、理由、风险提示 | Not Started |
| 收藏/取消收藏 | 本地持久化 | Not Started |
| Shortlist | 对比、备注、复制全部 | Not Started |
| 复制导出 | 单个名称和候选列表可复制 | Not Started |
| Boardroom Proposal | 至少 2 个预览模板 | Not Started |
| Settings | 偏好、隐私、免责声明、清空数据 | Not Started |

## 4. 生成质量

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 采样候选数 | >= 10000 | Not Started |
| 重复实例率 | < 8% | Not Started |
| 禁用词命中率 | 0 | Not Started |
| 平均评分 | >= 78 | Not Started |
| 可读性通过率 | >= 92% | Not Started |
| 行业覆盖 | 每个 MVP 行业 >= 500 个唯一候选 | Not Started |
| 人工抽样 | 100 个候选无明显高风险问题 | Not Started |

## 5. 合规与隐私

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 分段免责声明 | Settings 可访问 | Not Started |
| 分段隐私政策 | Settings 可访问 | Not Started |
| 法律后缀提示 | 选择器、详情或导出可见 | Not Started |
| 导出免责声明 | 复制摘要包含风险边界 | Not Started |
| 禁止承诺性文案 | 不出现 available/registerable/safe to use 等承诺 | Not Started |
| 清空本地数据 | 可用且有二次确认 | Not Started |
| 数据上传 | MVP 不上传用户数据 | Not Started |
| 法律审校 | 发布前完成人工审校 | Not Started |

## 6. UI 与体验

| 检查项 | 发布要求 | 当前状态 |
| --- | --- | --- |
| 360px 移动适配 | 无横向滚动 | Not Started |
| 390px 移动适配 | 主流程可用 | Not Started |
| 桌面适配 | 内容宽度受控 | Not Started |
| 候选名称换行 | 长名称不溢出 | Not Started |
| 图标按钮 | 有可访问名称 | Not Started |
| 提案卡预览 | 布局稳定，不遮挡文字 | Not Started |
| 视觉截图归档 | mobile + desktop | Not Started |

## 7. 自动化验证

公开 H5 MVP 发布前至少需要以下命令：

```text
npm test
npm run sample:quality
npm run audit:ui
npm run audit:i18n
npm run build:h5
npm run smoke:h5
npm run smoke:browser
npm run audit:visual
npm run audit:deps
```

建议后续用 `npm run check` 串联上述命令。

## 当前发布判断

当前不能发布 H5 MVP。

原因：

- App 工程未创建。
- 核心生成器未实现。
- UI 未实现。
- 合规入口未实现。
- 无测试、构建、采样或 smoke 验证。

下一步应优先进入 Phase 1：工程脚手架与最小生成器。
