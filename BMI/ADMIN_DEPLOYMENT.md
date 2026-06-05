# FitCal 后台部署说明

最后更新：2026-06-05

## 用途

FitCal 后台是内部运营与 smoke 检查看板。

它展示后端状态、广告占位测试指标、匿名活跃度、测试留存、合规边界和 Android App-base smoke 状态。这些内部信息不应展示在用户端 App 中。

## 服务

- Go 后端：`FitCal-Backend`
- React 后台：`FitCal-Admin`
- 后端端口：`48791`
- 后台端口：`48792`
- 网络绑定：`0.0.0.0`，支持局域网访问
- 测试数据文件：`FitCal-Backend/data/metrics.json`

## Docker 启动

在项目根目录运行：

```bash
docker compose up -d --build
```

打开：

- 后台：`http://localhost:48792/`
- 后端健康检查：`http://localhost:48791/api/health`
- 后端摘要：`http://localhost:48791/api/admin/summary`

局域网访问时，把 `localhost` 替换成本机局域网 IP：

```text
http://<LAN-IP>:48792/
```

后台前端通过 nginx 同源代理 `/api` 访问 Go 后端，所以局域网设备不需要直接访问 `localhost:48791`。

## 停止

```bash
docker compose down
```

## 当前范围

- 后台已中文化显示。
- 活跃度、日活、月活、测试留存等指标来自匿名测试事件。
- 当前后端使用本地 JSON 做测试持久化，Docker 重启后会恢复指标。
- `FitCal-Backend/data/` 已加入 git 忽略，不应提交测试统计数据。
- 后台提供“重置测试数据”按钮，用于清空当前统计。
- 后台提供运营配置面板，用于下发广告占位开关、App-base smoke 状态和测试公告。
- 后台提供版本发布配置，用于记录 H5 版本、Android 基座状态和发布备注；这些发布备注默认只在后台保留，不下发到用户端公告。
- 用户端只读取广告占位开关和测试公告；App-base smoke 状态只用于后台内部展示。
- 用户端会约每 10 秒刷新一次配置，所以广告占位开关和测试公告无需重启页面即可生效。
- 用户端只上报事件类型、匿名 visitorId、sessionId，不上传身高、体重、BMI、热量目标等身体数据。
- 当前不接入真实广告 SDK。
- Push / UniPush / GtPush 模块保持关闭。
- Android 权限在当前 MVP 中保持空配置。
- 用户端 Settings 不展示内部广告计数或 App-base smoke 信息。

## 接口

- `GET /api/health`
- `GET /api/admin/summary`
- `POST /api/admin/ad-event`
- `POST /api/admin/activity-event`
- `POST /api/admin/reset`
- `GET /api/admin/config`
- `POST /api/admin/config`
- `GET /api/app/config`

支持的匿名活跃事件：

- `app_open`
- `tab_view`
- `bmi_calculate`
- `calorie_calculate`
- `record_write`
- `record_update`
- `record_delete`
- `records_clear`

运营配置字段：

- `adPlaceholderEnabled`: 是否显示广告占位
- `appBaseSmokeStatus`: `pending` / `passed` / `blocked`
- `testAnnouncement`: 内部测试公告，最多 240 字符
- `h5Version`: 当前 H5 测试版本
- `androidBaseStatus`: `not-started` / `custom-base-testing` / `passed` / `blocked`
- `releaseNote`: 发布备注，最多 240 字符
- `showReleaseNote`: 后台兼容字段；当前用户端公告不读取发布备注

App 页面可见反应：

- `adPlaceholderEnabled=false` 会隐藏整个广告占位组件。
- `testAnnouncement` 会显示在 App 顶部品牌栏下方。
- 当前 App 顶部只读取独立测试公告：`showTestAnnouncement=true` 且 `testAnnouncement` 非空时显示一条公告。H5 版本和发布备注保留在后台配置中，不进入用户端公告栏。
- `appBaseSmokeStatus` 只影响后台状态卡，不展示给用户端。

后台摘要中包含近 7 日测试趋势：

- 每日匿名用户数
- 每日事件数
- 每日会话数

## 本地验证

```bash
cd FitCal-Backend
go test ./...

cd FitCal-Admin
npm run build

docker compose config
docker compose up -d --build

curl http://127.0.0.1:48791/api/health
curl http://127.0.0.1:48792/api/admin/summary
```
