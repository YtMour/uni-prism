package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type adMetrics struct {
	Impressions int    `json:"impressions"`
	Dismissals  int    `json:"dismissals"`
	LastEventAt string `json:"lastEventAt"`
	UpdatedAt   string `json:"updatedAt"`
}

type activityMetrics struct {
	DailyActiveUsers   int            `json:"dailyActiveUsers"`
	MonthlyActiveUsers int            `json:"monthlyActiveUsers"`
	TotalVisitors      int            `json:"totalVisitors"`
	ReturningVisitors  int            `json:"returningVisitors"`
	RetentionRate      float64        `json:"retentionRate"`
	Sessions           int            `json:"sessions"`
	Events             int            `json:"events"`
	Calculations       int            `json:"calculations"`
	RecordWrites       int            `json:"recordWrites"`
	AdEngagements      int            `json:"adEngagements"`
	EventBreakdown     map[string]int `json:"eventBreakdown"`
	DailyTrend         []dailyMetric  `json:"dailyTrend"`
	LastEventAt        string         `json:"lastEventAt"`
	UpdatedAt          string         `json:"updatedAt"`
}

type dailyMetric struct {
	Date     string `json:"date"`
	Users    int    `json:"users"`
	Events   int    `json:"events"`
	Sessions int    `json:"sessions"`
}

type snapshot struct {
	AppName         string               `json:"appName"`
	Environment     string               `json:"environment"`
	AdMode          string               `json:"adMode"`
	AdMetrics       adMetrics            `json:"adMetrics"`
	ActivityMetrics activityMetrics      `json:"activityMetrics"`
	Config          opsConfig            `json:"config"`
	ConfigHistory   []configHistoryEntry `json:"configHistory"`
	Permissions     []string             `json:"permissions"`
	Notes           []string             `json:"notes"`
	ServerTime      string               `json:"serverTime"`
	AppBasePending  bool                 `json:"appBasePending"`
}

type opsConfig struct {
	AdPlaceholderEnabled bool         `json:"adPlaceholderEnabled"`
	AppBaseSmokeStatus   string       `json:"appBaseSmokeStatus"`
	AppBaseSmokeChecks   []smokeCheck `json:"appBaseSmokeChecks"`
	H5Version            string       `json:"h5Version"`
	AndroidBaseStatus    string       `json:"androidBaseStatus"`
	ReleaseNote          string       `json:"releaseNote"`
	ShowReleaseNote      bool         `json:"showReleaseNote"`
	TestAnnouncement     string       `json:"testAnnouncement"`
	ShowTestAnnouncement bool         `json:"showTestAnnouncement"`
	UpdatedAt            string       `json:"updatedAt"`
}

type configRequest struct {
	AdPlaceholderEnabled *bool        `json:"adPlaceholderEnabled"`
	AppBaseSmokeStatus   string       `json:"appBaseSmokeStatus"`
	AppBaseSmokeChecks   []smokeCheck `json:"appBaseSmokeChecks"`
	H5Version            string       `json:"h5Version"`
	AndroidBaseStatus    string       `json:"androidBaseStatus"`
	ReleaseNote          string       `json:"releaseNote"`
	ShowReleaseNote      *bool        `json:"showReleaseNote"`
	TestAnnouncement     string       `json:"testAnnouncement"`
	ShowTestAnnouncement *bool        `json:"showTestAnnouncement"`
}

type smokeCheck struct {
	ID        string `json:"id"`
	Label     string `json:"label"`
	Status    string `json:"status"`
	Note      string `json:"note"`
	UpdatedAt string `json:"updatedAt"`
}

type configHistoryEntry struct {
	UpdatedAt              string `json:"updatedAt"`
	AdPlaceholderEnabled   bool   `json:"adPlaceholderEnabled"`
	AppBaseSmokeStatus     string `json:"appBaseSmokeStatus"`
	H5Version              string `json:"h5Version"`
	AndroidBaseStatus      string `json:"androidBaseStatus"`
	ShowTestAnnouncement   bool   `json:"showTestAnnouncement"`
	TestAnnouncementLength int    `json:"testAnnouncementLength"`
	PassedSmokeChecks      int    `json:"passedSmokeChecks"`
	BlockedSmokeChecks     int    `json:"blockedSmokeChecks"`
}

type adEventRequest struct {
	Type      string `json:"type"`
	Source    string `json:"source"`
	VisitorID string `json:"visitorId"`
	SessionID string `json:"sessionId"`
}

type activityEventRequest struct {
	Type      string `json:"type"`
	Source    string `json:"source"`
	VisitorID string `json:"visitorId"`
	SessionID string `json:"sessionId"`
}

type visitorStats struct {
	FirstSeen  time.Time
	LastSeen   time.Time
	EventCount int
	Days       map[string]bool
	Months     map[string]bool
}

type persistState struct {
	Metrics         adMetrics                  `json:"metrics"`
	Config          opsConfig                  `json:"config"`
	ConfigHistory   []configHistoryEntry       `json:"configHistory"`
	Visitors        map[string]*visitorStats   `json:"visitors"`
	Sessions        map[string]time.Time       `json:"sessions"`
	EventBreakdown  map[string]int             `json:"eventBreakdown"`
	DailyEvents     map[string]int             `json:"dailyEvents"`
	DailySessions   map[string]map[string]bool `json:"dailySessions"`
	TotalEvents     int                        `json:"totalEvents"`
	LastActivityAt  string                     `json:"lastActivityAt"`
	ActivityUpdated string                     `json:"activityUpdated"`
}

type store struct {
	mu              sync.RWMutex
	metrics         adMetrics
	visitors        map[string]*visitorStats
	sessions        map[string]time.Time
	eventBreakdown  map[string]int
	dailyEvents     map[string]int
	dailySessions   map[string]map[string]bool
	totalEvents     int
	lastActivityAt  string
	activityUpdated string
	config          opsConfig
	configHistory   []configHistoryEntry
	dataPath        string
}

func main() {
	port := env("FITCAL_API_PORT", "48791")
	dataPath := env("FITCAL_DATA_PATH", filepath.Join("data", "metrics.json"))
	state := &store{
		metrics: adMetrics{
			UpdatedAt: now(),
		},
		visitors:        map[string]*visitorStats{},
		sessions:        map[string]time.Time{},
		eventBreakdown:  map[string]int{},
		dailyEvents:     map[string]int{},
		dailySessions:   map[string]map[string]bool{},
		activityUpdated: now(),
		config:          defaultConfig(),
		dataPath:        dataPath,
	}
	if err := state.load(); err != nil {
		log.Printf("load metrics failed: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", withCors(healthHandler))
	mux.HandleFunc("/api/admin/summary", withCors(state.summaryHandler))
	mux.HandleFunc("/api/admin/ad-event", withCors(state.adEventHandler))
	mux.HandleFunc("/api/admin/activity-event", withCors(state.activityEventHandler))
	mux.HandleFunc("/api/admin/reset", withCors(state.resetHandler))
	mux.HandleFunc("/api/admin/config", withCors(state.configHandler))
	mux.HandleFunc("/api/admin/export", withCors(state.exportHandler))
	mux.HandleFunc("/api/app/config", withCors(state.appConfigHandler))

	addr := "0.0.0.0:" + port
	log.Printf("FitCal backend listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
		"time":   now(),
	})
}

func (s *store) summaryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	s.mu.RLock()
	metrics := s.metrics
	activity := s.activitySnapshotLocked()
	config := s.config
	history := append([]configHistoryEntry(nil), s.configHistory...)
	s.mu.RUnlock()

	writeJSON(w, http.StatusOK, snapshot{
		AppName:         "FitCal",
		Environment:     env("FITCAL_ENV", "local"),
		AdMode:          "fake-placeholder-only",
		AdMetrics:       metrics,
		ActivityMetrics: activity,
		Config:          config,
		ConfigHistory:   history,
		Permissions:     []string{},
		Notes: []string{
			"当前仅使用广告占位，不接入真实广告 SDK。",
			"Push / UniPush / GtPush 保持关闭。",
			"Android 权限在当前 MVP 中保持空配置。",
			"提醒节奏只是本地偏好，不请求系统通知权限。",
			"活跃与留存指标来自匿名测试事件，本地 JSON 文件仅用于测试持久化。",
		},
		ServerTime:     now(),
		AppBasePending: config.AppBaseSmokeStatus != "passed",
	})
}

func (s *store) configHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method == http.MethodGet {
		s.mu.RLock()
		config := s.config
		s.mu.RUnlock()
		writeJSON(w, http.StatusOK, config)
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	var body configRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	nextConfig, err := normalizeConfig(body, now())
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	s.mu.Lock()
	s.config = nextConfig
	s.appendConfigHistoryLocked(nextConfig)
	if err := s.saveLocked(); err != nil {
		log.Printf("save config failed: %v", err)
	}
	config := s.config
	s.mu.Unlock()

	writeJSON(w, http.StatusOK, config)
}

func (s *store) exportHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	s.mu.RLock()
	metrics := s.metrics
	activity := s.activitySnapshotLocked()
	config := s.config
	history := append([]configHistoryEntry(nil), s.configHistory...)
	s.mu.RUnlock()

	w.Header().Set("Content-Disposition", "attachment; filename=fitcal-admin-export.json")
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"exportedAt":       now(),
		"appName":          "FitCal",
		"environment":      env("FITCAL_ENV", "local"),
		"adMetrics":        metrics,
		"activityMetrics":  activity,
		"config":           config,
		"configHistory":    history,
		"productionNotice": "Local smoke/testing export only. No user body measurements are collected by the backend.",
	})
}

func (s *store) appConfigHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	s.mu.RLock()
	config := s.config
	s.mu.RUnlock()

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"adPlaceholderEnabled": config.AdPlaceholderEnabled,
		"h5Version":            "",
		"releaseNote":          "",
		"testAnnouncement":     visibleText(config.TestAnnouncement, config.ShowTestAnnouncement),
		"showTestAnnouncement": config.ShowTestAnnouncement,
		"updatedAt":            config.UpdatedAt,
	})
}

func (s *store) adEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	var body adEventRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if err := validateAdEvent(body.Type); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	s.mu.Lock()
	if body.Type == "impression" {
		s.metrics.Impressions++
	}
	if body.Type == "dismissal" {
		s.metrics.Dismissals++
	}
	s.metrics.LastEventAt = now()
	s.metrics.UpdatedAt = s.metrics.LastEventAt
	s.recordActivityLocked(activityEventRequest{
		Type:      "ad_" + body.Type,
		Source:    body.Source,
		VisitorID: body.VisitorID,
		SessionID: body.SessionID,
	}, time.Now().UTC())
	if err := s.saveLocked(); err != nil {
		log.Printf("save metrics failed: %v", err)
	}
	metrics := s.metrics
	s.mu.Unlock()

	writeJSON(w, http.StatusOK, metrics)
}

func (s *store) activityEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	var body activityEventRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if err := validateActivityEvent(body.Type); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	s.mu.Lock()
	s.recordActivityLocked(body, time.Now().UTC())
	if err := s.saveLocked(); err != nil {
		log.Printf("save metrics failed: %v", err)
	}
	activity := s.activitySnapshotLocked()
	s.mu.Unlock()

	writeJSON(w, http.StatusOK, activity)
}

func (s *store) resetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	s.mu.Lock()
	s.resetLocked()
	if err := s.saveLocked(); err != nil {
		log.Printf("save metrics failed: %v", err)
	}
	activity := s.activitySnapshotLocked()
	metrics := s.metrics
	s.mu.Unlock()

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"adMetrics":       metrics,
		"activityMetrics": activity,
	})
}

func validateAdEvent(eventType string) error {
	if eventType == "impression" || eventType == "dismissal" {
		return nil
	}
	return errors.New("type must be impression or dismissal")
}

func validateActivityEvent(eventType string) error {
	allowed := map[string]bool{
		"app_open":          true,
		"tab_view":          true,
		"bmi_calculate":     true,
		"calorie_calculate": true,
		"record_write":      true,
		"record_update":     true,
		"record_delete":     true,
		"records_clear":     true,
		"ad_impression":     true,
		"ad_dismissal":      true,
	}
	if allowed[eventType] {
		return nil
	}
	return errors.New("unsupported activity event type")
}

func defaultConfig() opsConfig {
	return opsConfig{
		AdPlaceholderEnabled: true,
		AppBaseSmokeStatus:   "pending",
		AppBaseSmokeChecks:   defaultSmokeChecks(),
		H5Version:            "1.0.1",
		AndroidBaseStatus:    "custom-base-testing",
		ReleaseNote:          "MVP smoke hardening in progress.",
		ShowReleaseNote:      false,
		TestAnnouncement:     "",
		ShowTestAnnouncement: false,
		UpdatedAt:            now(),
	}
}

func normalizeConfig(body configRequest, updatedAt string) (opsConfig, error) {
	if body.AdPlaceholderEnabled == nil {
		return opsConfig{}, errors.New("adPlaceholderEnabled is required")
	}
	if body.ShowReleaseNote == nil {
		return opsConfig{}, errors.New("showReleaseNote is required")
	}
	if body.ShowTestAnnouncement == nil {
		return opsConfig{}, errors.New("showTestAnnouncement is required")
	}
	status := body.AppBaseSmokeStatus
	if status == "" {
		status = "pending"
	}
	if status != "pending" && status != "passed" && status != "blocked" {
		return opsConfig{}, errors.New("appBaseSmokeStatus must be pending, passed, or blocked")
	}
	smokeChecks := normalizeSmokeChecks(body.AppBaseSmokeChecks, updatedAt)
	if status == "passed" && !allSmokeChecksPassed(smokeChecks) {
		return opsConfig{}, errors.New("all appBaseSmokeChecks must pass before appBaseSmokeStatus can be passed")
	}
	androidStatus := body.AndroidBaseStatus
	if androidStatus == "" {
		androidStatus = "custom-base-testing"
	}
	if androidStatus != "not-started" && androidStatus != "custom-base-testing" && androidStatus != "passed" && androidStatus != "blocked" {
		return opsConfig{}, errors.New("androidBaseStatus must be not-started, custom-base-testing, passed, or blocked")
	}
	announcement := body.TestAnnouncement
	if len(announcement) > 240 {
		announcement = announcement[:240]
	}
	releaseNote := body.ReleaseNote
	if len(releaseNote) > 240 {
		releaseNote = releaseNote[:240]
	}
	return opsConfig{
		AdPlaceholderEnabled: *body.AdPlaceholderEnabled,
		AppBaseSmokeStatus:   status,
		AppBaseSmokeChecks:   smokeChecks,
		H5Version:            normalizeText(body.H5Version, "1.0.1"),
		AndroidBaseStatus:    androidStatus,
		ReleaseNote:          releaseNote,
		ShowReleaseNote:      *body.ShowReleaseNote,
		TestAnnouncement:     announcement,
		ShowTestAnnouncement: *body.ShowTestAnnouncement,
		UpdatedAt:            updatedAt,
	}, nil
}

func defaultSmokeChecks() []smokeCheck {
	return []smokeCheck{
		{ID: "bmi-flow", Label: "BMI 数值键盘、计算和记录写入", Status: "pending"},
		{ID: "calories-flow", Label: "热量计算控件、结果卡和广告占位", Status: "pending"},
		{ID: "guidance-flow", Label: "指南、宏量视觉和 7 日指南 CTA", Status: "pending"},
		{ID: "records-flow", Label: "记录增删、趋势切换和图表边界", Status: "pending"},
		{ID: "settings-policy", Label: "设置持久化、政策页面和原生返回", Status: "pending"},
		{ID: "restart-persistence", Label: "重启后单位、记录和图表设置持久化", Status: "pending"},
		{ID: "manifest-permissions", Label: "无异常权限弹窗、无 Push/GtPush 回归", Status: "pending"},
	}
}

func normalizeSmokeChecks(input []smokeCheck, updatedAt string) []smokeCheck {
	defaults := defaultSmokeChecks()
	byID := map[string]smokeCheck{}
	for _, item := range input {
		byID[item.ID] = item
	}
	result := make([]smokeCheck, 0, len(defaults))
	for _, item := range defaults {
		if saved, exists := byID[item.ID]; exists {
			item.Status = normalizeSmokeStatus(saved.Status)
			item.Note = normalizeText(saved.Note, "")
			if saved.UpdatedAt != "" {
				item.UpdatedAt = saved.UpdatedAt
			}
			if item.UpdatedAt == "" || saved.Status != item.Status || saved.Note != item.Note {
				item.UpdatedAt = updatedAt
			}
		}
		result = append(result, item)
	}
	return result
}

func normalizeSmokeStatus(value string) string {
	if value == "passed" || value == "blocked" {
		return value
	}
	return "pending"
}

func allSmokeChecksPassed(checks []smokeCheck) bool {
	if len(checks) == 0 {
		return false
	}
	for _, check := range checks {
		if check.Status != "passed" {
			return false
		}
	}
	return true
}

func visibleText(value string, visible bool) string {
	if !visible {
		return ""
	}
	return value
}

func normalizeText(value string, fallback string) string {
	if value == "" {
		return fallback
	}
	if len(value) > 80 {
		return value[:80]
	}
	return value
}

func (s *store) recordActivityLocked(event activityEventRequest, eventTime time.Time) {
	visitorID := normalizeID(event.VisitorID, "anonymous")
	sessionID := normalizeID(event.SessionID, visitorID+"-session")
	day := eventTime.Format("2006-01-02")
	month := eventTime.Format("2006-01")

	visitor, exists := s.visitors[visitorID]
	if !exists {
		visitor = &visitorStats{
			FirstSeen: eventTime,
			Days:      map[string]bool{},
			Months:    map[string]bool{},
		}
		s.visitors[visitorID] = visitor
	}
	visitor.LastSeen = eventTime
	visitor.EventCount++
	visitor.Days[day] = true
	visitor.Months[month] = true
	s.sessions[sessionID] = eventTime
	s.totalEvents++
	s.eventBreakdown[event.Type]++
	s.dailyEvents[day]++
	if s.dailySessions[day] == nil {
		s.dailySessions[day] = map[string]bool{}
	}
	s.dailySessions[day][sessionID] = true
	s.lastActivityAt = eventTime.Format(time.RFC3339)
	s.activityUpdated = s.lastActivityAt
}

func (s *store) activitySnapshotLocked() activityMetrics {
	nowTime := time.Now().UTC()
	day := nowTime.Format("2006-01-02")
	month := nowTime.Format("2006-01")
	dailyActive := 0
	monthlyActive := 0
	returning := 0

	for _, visitor := range s.visitors {
		if visitor.Days[day] {
			dailyActive++
		}
		if visitor.Months[month] {
			monthlyActive++
		}
		if len(visitor.Days) > 1 || visitor.EventCount > 1 {
			returning++
		}
	}

	breakdown := make(map[string]int, len(s.eventBreakdown))
	for key, value := range s.eventBreakdown {
		breakdown[key] = value
	}
	totalVisitors := len(s.visitors)
	retentionRate := 0.0
	if totalVisitors > 0 {
		retentionRate = float64(returning) / float64(totalVisitors)
	}

	return activityMetrics{
		DailyActiveUsers:   dailyActive,
		MonthlyActiveUsers: monthlyActive,
		TotalVisitors:      totalVisitors,
		ReturningVisitors:  returning,
		RetentionRate:      retentionRate,
		Sessions:           len(s.sessions),
		Events:             s.totalEvents,
		Calculations:       breakdown["bmi_calculate"] + breakdown["calorie_calculate"],
		RecordWrites:       breakdown["record_write"],
		AdEngagements:      breakdown["ad_impression"] + breakdown["ad_dismissal"],
		EventBreakdown:     breakdown,
		DailyTrend:         s.dailyTrendLocked(nowTime),
		LastEventAt:        s.lastActivityAt,
		UpdatedAt:          s.activityUpdated,
	}
}

func (s *store) dailyTrendLocked(nowTime time.Time) []dailyMetric {
	trend := make([]dailyMetric, 0, 7)
	for offset := 6; offset >= 0; offset-- {
		dayTime := nowTime.AddDate(0, 0, -offset)
		day := dayTime.Format("2006-01-02")
		users := 0
		for _, visitor := range s.visitors {
			if visitor.Days[day] {
				users++
			}
		}
		trend = append(trend, dailyMetric{
			Date:     day,
			Users:    users,
			Events:   s.dailyEvents[day],
			Sessions: len(s.dailySessions[day]),
		})
	}
	return trend
}

func (s *store) load() error {
	content, err := os.ReadFile(s.dataPath)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}

	var state persistState
	if err := json.Unmarshal(content, &state); err != nil {
		return err
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	if state.Metrics.UpdatedAt != "" {
		s.metrics = state.Metrics
	}
	if state.Config.UpdatedAt != "" {
		s.config = mergeConfigDefaults(state.Config)
	}
	s.configHistory = normalizeConfigHistory(state.ConfigHistory)
	s.visitors = ensureVisitors(state.Visitors)
	s.sessions = ensureSessions(state.Sessions)
	s.eventBreakdown = ensureCounters(state.EventBreakdown)
	s.dailyEvents = ensureCounters(state.DailyEvents)
	s.dailySessions = ensureDailySessions(state.DailySessions)
	s.totalEvents = state.TotalEvents
	s.lastActivityAt = state.LastActivityAt
	if state.ActivityUpdated != "" {
		s.activityUpdated = state.ActivityUpdated
	}
	return nil
}

func (s *store) saveLocked() error {
	if err := os.MkdirAll(filepath.Dir(s.dataPath), 0755); err != nil {
		return err
	}
	state := persistState{
		Metrics:         s.metrics,
		Config:          s.config,
		ConfigHistory:   s.configHistory,
		Visitors:        s.visitors,
		Sessions:        s.sessions,
		EventBreakdown:  s.eventBreakdown,
		DailyEvents:     s.dailyEvents,
		DailySessions:   s.dailySessions,
		TotalEvents:     s.totalEvents,
		LastActivityAt:  s.lastActivityAt,
		ActivityUpdated: s.activityUpdated,
	}
	content, err := json.MarshalIndent(state, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.dataPath, content, 0600)
}

func (s *store) appendConfigHistoryLocked(config opsConfig) {
	s.configHistory = append([]configHistoryEntry{configHistoryEntryFrom(config)}, s.configHistory...)
	if len(s.configHistory) > 20 {
		s.configHistory = s.configHistory[:20]
	}
}

func configHistoryEntryFrom(config opsConfig) configHistoryEntry {
	passed, blocked := smokeCheckCounts(config.AppBaseSmokeChecks)
	return configHistoryEntry{
		UpdatedAt:              config.UpdatedAt,
		AdPlaceholderEnabled:   config.AdPlaceholderEnabled,
		AppBaseSmokeStatus:     config.AppBaseSmokeStatus,
		H5Version:              config.H5Version,
		AndroidBaseStatus:      config.AndroidBaseStatus,
		ShowTestAnnouncement:   config.ShowTestAnnouncement,
		TestAnnouncementLength: len(config.TestAnnouncement),
		PassedSmokeChecks:      passed,
		BlockedSmokeChecks:     blocked,
	}
}

func smokeCheckCounts(checks []smokeCheck) (int, int) {
	passed := 0
	blocked := 0
	for _, check := range checks {
		if check.Status == "passed" {
			passed++
		}
		if check.Status == "blocked" {
			blocked++
		}
	}
	return passed, blocked
}

func normalizeConfigHistory(history []configHistoryEntry) []configHistoryEntry {
	if len(history) > 20 {
		return history[:20]
	}
	if history == nil {
		return []configHistoryEntry{}
	}
	return history
}

func (s *store) resetLocked() {
	timestamp := now()
	s.metrics = adMetrics{UpdatedAt: timestamp}
	s.visitors = map[string]*visitorStats{}
	s.sessions = map[string]time.Time{}
	s.eventBreakdown = map[string]int{}
	s.dailyEvents = map[string]int{}
	s.dailySessions = map[string]map[string]bool{}
	s.totalEvents = 0
	s.lastActivityAt = ""
	s.activityUpdated = timestamp
}

func ensureVisitors(value map[string]*visitorStats) map[string]*visitorStats {
	if value == nil {
		return map[string]*visitorStats{}
	}
	for _, visitor := range value {
		if visitor.Days == nil {
			visitor.Days = map[string]bool{}
		}
		if visitor.Months == nil {
			visitor.Months = map[string]bool{}
		}
	}
	return value
}

func ensureSessions(value map[string]time.Time) map[string]time.Time {
	if value == nil {
		return map[string]time.Time{}
	}
	return value
}

func ensureCounters(value map[string]int) map[string]int {
	if value == nil {
		return map[string]int{}
	}
	return value
}

func ensureDailySessions(value map[string]map[string]bool) map[string]map[string]bool {
	if value == nil {
		return map[string]map[string]bool{}
	}
	for day, sessions := range value {
		if sessions == nil {
			value[day] = map[string]bool{}
		}
	}
	return value
}

func mergeConfigDefaults(config opsConfig) opsConfig {
	defaults := defaultConfig()
	config.AppBaseSmokeChecks = normalizeSmokeChecks(config.AppBaseSmokeChecks, now())
	if config.H5Version == "" {
		config.H5Version = defaults.H5Version
	}
	if config.AndroidBaseStatus == "" {
		config.AndroidBaseStatus = defaults.AndroidBaseStatus
	}
	return config
}

func normalizeID(value string, fallback string) string {
	if value == "" {
		return fallback
	}
	if len(value) > 80 {
		return value[:80]
	}
	return value
}

func withCors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, value interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("write json failed: %v", err)
	}
}

func now() string {
	return time.Now().UTC().Format(time.RFC3339)
}

func env(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
