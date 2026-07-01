# VibeName MVP 发布清单

## 发布判断

当前结论：VibeName 尚未达到 MVP 发布候选。

原因：

- 尚未创建 App 工程。
- 尚未实现生成器、UI、存储、复制、白板或概念预览。
- 尚无测试、构建、smoke、质量采样或发布评估。

## MVP 功能门槛

| 门槛 | 当前状态 | 说明 |
| --- | --- | --- |
| App 工程可运行 | Not Started | 需要创建 `VibeName-Uniapp` |
| 本地名称生成 | Not Started | 结构化词库和规则生成 |
| 3 种命名风格 | Not Started | Micro-SaaS、Abstract、Action-Driven |
| 至少 4 个行业过滤 | Not Started | AI、DevTools、Fintech、Creator Economy |
| 长度控制 | Not Started | Ultra Short、Standard Blend、Descriptive Compound |
| 候选评分 | Not Started | 5 个评分维度和总分 |
| 禁用词过滤 | Not Started | 敏感词、负面词、难读组合 |
| 候选卡片 | Not Started | 名称、标签、评分、理由、复制、收藏 |
| Founder Whiteboard | Not Started | 收藏、对比、备注、复制全部 |
| 本地持久化 | Not Started | 偏好、最近生成、收藏 |
| 概念卡片预览 | Not Started | App 内预览，不承诺 PNG 保存 |
| 免责声明 | Not Started | 明确非域名、非商标、非法律建议 |

## H5 发布候选门槛

| 门槛 | 命令/证据 | 当前状态 |
| --- | --- | --- |
| 单元测试 | `npm test` | Not Started |
| 生成质量采样 | `npm run sample:quality` | Not Started |
| H5 构建 | `npm run build:h5` | Not Started |
| H5 smoke | `npm run smoke:h5` | Not Started |
| 依赖审计 | `npm audit` 或项目审计脚本 | Not Started |
| 发布评估 | `npm run assess:release` | Not Started |
| 完整检查串联 | `npm run check` | Not Started |

## 建议验收阈值

| 指标 | MVP 阈值 |
| --- | --- |
| 单次候选数量 | 默认 8 个 |
| 批量采样规模 | 至少 1000 次 |
| 重复率 | 不高于 8% |
| 平均总分 | 不低于 70 |
| 基础过滤通过率 | 不低于 70% |
| 移动端最小宽度 | 360px 无横向滚动 |
| 收藏恢复 | 刷新后保留 |
| 复制操作 | 成功或明确失败反馈 |

## 发布前人工回归清单

| 场景 | 检查点 |
| --- | --- |
| 首次打开 | 首页直接进入生成工具，不是营销页 |
| 生成名称 | 点击 Generate 后出现候选列表 |
| 风格切换 | 三种风格输出气质有明显差异 |
| 行业过滤 | 行业选择能影响结果和理由 |
| 长度过滤 | 超短、标准、描述型长度符合预期 |
| 候选详情 | 能看到评分拆解和生成理由 |
| 收藏 | 收藏后进入 Whiteboard |
| 刷新恢复 | 收藏、最近生成和偏好不丢失 |
| 复制 | 单个名称和全部候选均可复制 |
| 概念预览 | 名称、tagline 和标签不重叠 |
| 移动端显示 | 360px 宽度下按钮、卡片、底部栏不挤压 |
| 免责声明 | 不暗示域名或商标可用 |

## 公开发布阻断

| 阻断 | 严重度 | 处理建议 |
| --- | --- | --- |
| 没有 App 工程 | High | 先完成 Phase 1 |
| 没有生成器和词库 | High | 建立核心生成系统 |
| 没有质量采样 | High | 增加重复率和评分分布报告 |
| 没有构建验证 | High | 建立 H5 build 和 smoke |
| 没有移动端回归 | High | 覆盖 360px、390px、桌面居中 |
| 没有免责声明 | Medium | 明确创意建议不代表法律可用 |

## 后续优化优先级

1. 建立工程和最小生成闭环。
2. 扩充词库并加入评分过滤。
3. 完成收藏、白板、复制和本地持久化。
4. 建立质量采样、H5 smoke 和发布评估。
5. 根据用户反馈决定是否接入域名查询、AI 增强和 PNG 导出。
