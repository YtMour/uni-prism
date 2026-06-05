import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type AdMetrics = {
  impressions: number
  dismissals: number
  lastEventAt: string
  updatedAt: string
}

type ActivityMetrics = {
  dailyActiveUsers: number
  monthlyActiveUsers: number
  totalVisitors: number
  returningVisitors: number
  retentionRate: number
  sessions: number
  events: number
  calculations: number
  recordWrites: number
  adEngagements: number
  eventBreakdown: Record<string, number>
  dailyTrend: DailyMetric[]
  lastEventAt: string
  updatedAt: string
}

type DailyMetric = {
  date: string
  users: number
  events: number
  sessions: number
}

type Summary = {
  appName: string
  environment: string
  adMode: string
  adMetrics: AdMetrics
  activityMetrics: ActivityMetrics
  config: OpsConfig
  permissions: string[]
  notes: string[]
  serverTime: string
  appBasePending: boolean
}

type OpsConfig = {
  adPlaceholderEnabled: boolean
  appBaseSmokeStatus: 'pending' | 'passed' | 'blocked'
  h5Version: string
  androidBaseStatus: 'not-started' | 'custom-base-testing' | 'passed' | 'blocked'
  releaseNote: string
  showReleaseNote: boolean
  testAnnouncement: string
  showTestAnnouncement: boolean
  updatedAt: string
}

const apiBase = import.meta.env.VITE_FITCAL_API_BASE || ''

function App() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [configDraft, setConfigDraft] = useState<OpsConfig | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)
  const configDirtyRef = useRef(false)
  const savingConfigRef = useRef(false)

  async function loadSummary() {
    setLoading((current) => current && !summary)
    setError('')
    try {
      const response = await fetch(`${apiBase}/api/admin/summary`)
      if (!response.ok) throw new Error(`API 返回 ${response.status}`)
      const nextSummary = await response.json()
      setSummary(nextSummary)
      if (!configDirtyRef.current && !savingConfigRef.current) {
        setConfigDraft(nextSummary.config)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '后台摘要加载失败')
    } finally {
      setLoading(false)
    }
  }

  async function resetMetrics() {
    setResetting(true)
    setError('')
    try {
      const response = await fetch(`${apiBase}/api/admin/reset`, { method: 'POST' })
      if (!response.ok) throw new Error(`API 返回 ${response.status}`)
      await loadSummary()
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试数据重置失败')
    } finally {
      setResetting(false)
    }
  }

  async function saveConfig() {
    if (!configDraft) return
    setSavingConfig(true)
    savingConfigRef.current = true
    setError('')
    try {
      const response = await fetch(`${apiBase}/api/admin/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configDraft)
      })
      if (!response.ok) throw new Error(`API 返回 ${response.status}`)
      configDirtyRef.current = false
      await loadSummary()
    } catch (err) {
      setError(err instanceof Error ? err.message : '运营配置保存失败')
    } finally {
      setSavingConfig(false)
      savingConfigRef.current = false
    }
  }

  function updateConfigDraft(nextConfig: OpsConfig) {
    configDirtyRef.current = true
    setConfigDraft(nextConfig)
  }

  useEffect(() => {
    loadSummary()
    const timer = window.setInterval(loadSummary, 10000)
    return () => window.clearInterval(timer)
  }, [])

  const dismissalRate = useMemo(() => {
    if (!summary?.adMetrics.impressions) return '0%'
    return `${Math.round(summary.adMetrics.dismissals / summary.adMetrics.impressions * 100)}%`
  }, [summary])

  const activity = summary?.activityMetrics
  const topEvents = useMemo(() => {
    if (!activity) return []
    return Object.entries(activity.eventBreakdown)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 8)
  }, [activity])

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FitCal 后台</p>
          <h1>内部运营看板</h1>
        </div>
        <div className="actions">
          <button className="refresh secondary" onClick={resetMetrics} disabled={resetting}>
            {resetting ? '重置中...' : '重置测试数据'}
          </button>
          <button className="refresh" onClick={loadSummary}>刷新</button>
        </div>
      </header>

      {error && <section className="banner error">后端不可用：{error}</section>}
      {loading && !summary && <section className="banner">正在加载后台摘要...</section>}

      {summary && activity && (
        <>
          <section className="grid">
            <MetricCard label="运行环境" value={summary.environment} />
            <MetricCard label="广告模式" value={summary.config.adPlaceholderEnabled ? '占位开启' : '占位关闭'} />
            <MetricCard label="H5 版本" value={summary.config.h5Version || '--'} />
            <MetricCard label="Android 基座" value={androidBaseEnabled(summary.config.androidBaseStatus) ? '开启' : '关闭'} />
            <MetricCard label="App-base smoke" value={smokeEnabled(summary.config.appBaseSmokeStatus) ? '开启' : '关闭'} />
          </section>

          {configDraft && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">运营配置</p>
                  <h2>测试下发配置</h2>
                </div>
                <span className="pill">用户端只读</span>
              </div>
              <div className="config-grid">
                <label className="config-card">
                  <span>广告占位</span>
                  <select
                    aria-label="广告占位"
                    value={configDraft.adPlaceholderEnabled ? 'on' : 'off'}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      adPlaceholderEnabled: event.target.value === 'on'
                    })}
                  >
                    <option value="on">开启</option>
                    <option value="off">关闭</option>
                  </select>
                </label>
                <label className="config-card">
                  <span>H5 版本</span>
                  <input
                    aria-label="H5 版本"
                    value={configDraft.h5Version}
                    maxLength={80}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      h5Version: event.target.value
                    })}
                  />
                </label>
                <label className="config-card">
                  <span>Android 基座</span>
                  <select
                    aria-label="Android 基座"
                    value={androidBaseEnabled(configDraft.androidBaseStatus) ? 'on' : 'off'}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      androidBaseStatus: event.target.value === 'on' ? 'passed' : 'blocked'
                    })}
                  >
                    <option value="on">开启</option>
                    <option value="off">关闭</option>
                  </select>
                </label>
                <label className="config-card">
                  <span>App-base smoke</span>
                  <select
                    aria-label="App-base smoke"
                    value={smokeEnabled(configDraft.appBaseSmokeStatus) ? 'on' : 'off'}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      appBaseSmokeStatus: event.target.value === 'on' ? 'passed' : 'blocked'
                    })}
                  >
                    <option value="on">开启</option>
                    <option value="off">关闭</option>
                  </select>
                </label>
                <label className="config-card">
                  <span>发布备注展示</span>
                  <select
                    aria-label="发布备注展示"
                    value={configDraft.showReleaseNote ? 'show' : 'hide'}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      showReleaseNote: event.target.value === 'show'
                    })}
                  >
                    <option value="hide">不在 App 显示</option>
                    <option value="show">在 App 显示</option>
                  </select>
                </label>
                <label className="config-card">
                  <span>测试公告展示</span>
                  <select
                    aria-label="测试公告展示"
                    value={configDraft.showTestAnnouncement ? 'show' : 'hide'}
                    onChange={(event) => updateConfigDraft({
                      ...configDraft,
                      showTestAnnouncement: event.target.value === 'show'
                    })}
                  >
                    <option value="hide">关闭</option>
                    <option value="show">开启</option>
                  </select>
                </label>
              </div>
              <label className="config-card wide">
                <span>发布备注</span>
                <textarea
                  aria-label="发布备注"
                  value={configDraft.releaseNote}
                  maxLength={240}
                  placeholder="例如：本版本完成后台配置下发和广告占位测试。"
                  onChange={(event) => updateConfigDraft({
                    ...configDraft,
                    releaseNote: event.target.value
                  })}
                />
              </label>
              <label className="config-card wide">
                <span>测试公告</span>
                <textarea
                  aria-label="测试公告"
                  value={configDraft.testAnnouncement}
                  maxLength={240}
                  placeholder="例如：当前仅验证广告占位和启动页，不接真实广告 SDK。"
                  onChange={(event) => updateConfigDraft({
                    ...configDraft,
                    testAnnouncement: event.target.value
                  })}
                />
              </label>
              <div className="config-footer">
                <span>最后更新：{formatTime(summary.config.updatedAt)}</span>
                <button className="refresh" onClick={saveConfig} disabled={savingConfig}>
                  {savingConfig ? '保存中...' : '保存配置'}
                </button>
              </div>
            </section>
          )}

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">活跃度</p>
                <h2>匿名测试指标</h2>
              </div>
              <span className="pill">内存统计</span>
            </div>
            <div className="grid metrics">
              <MetricCard label="日活 DAU" value={activity.dailyActiveUsers.toLocaleString()} />
              <MetricCard label="月活 MAU" value={activity.monthlyActiveUsers.toLocaleString()} />
              <MetricCard label="匿名访客" value={activity.totalVisitors.toLocaleString()} />
              <MetricCard label="回访人数" value={activity.returningVisitors.toLocaleString()} />
              <MetricCard label="测试留存率" value={formatPercent(activity.retentionRate)} />
              <MetricCard label="会话数" value={activity.sessions.toLocaleString()} />
              <MetricCard label="事件数" value={activity.events.toLocaleString()} />
              <MetricCard label="最后事件" value={formatTime(activity.lastEventAt)} />
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">趋势</p>
                <h2>近 7 日测试活跃</h2>
              </div>
              <span className="pill">JSON 持久化</span>
            </div>
            <div className="trend-list">
              {activity.dailyTrend.map((item) => (
                <TrendRow key={item.date} item={item} maxEvents={maxTrendEvents(activity.dailyTrend)} />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">行为漏斗</p>
                <h2>核心动作计数</h2>
              </div>
            </div>
            <div className="grid metrics">
              <MetricCard label="计算次数" value={activity.calculations.toLocaleString()} />
              <MetricCard label="记录写入" value={activity.recordWrites.toLocaleString()} />
              <MetricCard label="广告互动" value={activity.adEngagements.toLocaleString()} />
              <MetricCard label="数据口径" value="测试态" />
            </div>
            <div className="event-list">
              {topEvents.length ? topEvents.map(([eventName, count]) => (
                <div className="event-row" key={eventName}>
                  <span>{eventLabel(eventName)}</span>
                  <strong>{count.toLocaleString()}</strong>
                </div>
              )) : <div className="empty-state">还没有收到用户端测试事件。</div>}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">广告占位</p>
                <h2>本地测试指标</h2>
              </div>
              <span className="pill">未接 SDK</span>
            </div>
            <div className="grid metrics">
              <MetricCard label="展示次数" value={summary.adMetrics.impressions.toLocaleString()} />
              <MetricCard label="关闭次数" value={summary.adMetrics.dismissals.toLocaleString()} />
              <MetricCard label="关闭率" value={dismissalRate} />
              <MetricCard label="最后广告事件" value={formatTime(summary.adMetrics.lastEventAt)} />
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">合规边界</p>
                <h2>当前 MVP 规则</h2>
              </div>
            </div>
            <div className="notes">
              {summary.notes.map((note) => (
                <div className="note" key={note}>{note}</div>
              ))}
            </div>
          </section>

          <section className="panel subtle">
            <div className="row">
              <span>API 来源</span>
              <strong>{apiBase || '同源 /api 代理'}</strong>
            </div>
            <div className="row">
              <span>服务器时间</span>
              <strong>{formatTime(summary.serverTime)}</strong>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function TrendRow({ item, maxEvents }: { item: DailyMetric; maxEvents: number }) {
  const width = maxEvents > 0 ? Math.max(6, Math.round(item.events / maxEvents * 100)) : 0
  return (
    <div className="trend-row">
      <div className="trend-date">{formatDay(item.date)}</div>
      <div className="trend-track">
        <div className="trend-bar" style={{ width: `${width}%` }} />
      </div>
      <div className="trend-values">
        <strong>{item.events}</strong>
        <span>事件 / {item.users} 人 / {item.sessions} 会话</span>
      </div>
    </div>
  )
}

function maxTrendEvents(items: DailyMetric[]) {
  return Math.max(0, ...items.map((item) => item.events))
}

function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function formatTime(value: string) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

function eventLabel(value: string) {
  const labels: Record<string, string> = {
    app_open: '打开应用',
    tab_view: '切换页面',
    bmi_calculate: 'BMI 计算',
    calorie_calculate: '热量计算',
    record_write: '写入记录',
    record_update: '编辑记录',
    record_delete: '删除记录',
    records_clear: '清空记录',
    ad_impression: '广告展示',
    ad_dismissal: '广告关闭'
  }
  return labels[value] || value
}

function smokeEnabled(value: OpsConfig['appBaseSmokeStatus']) {
  return value === 'passed'
}

function androidBaseEnabled(value: OpsConfig['androidBaseStatus']) {
  return value === 'passed'
}

createRoot(document.getElementById('root')!).render(<App />)
