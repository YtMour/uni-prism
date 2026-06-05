<template>
	<view class="screen">
		<view class="input-grid">
			<view class="result-panel mini-panel">
				<text class="section-label">{{ copy('records.current') }}</text>
				<text class="mini-number">{{ currentWeight }} {{ weightUnit }}</text>
			</view>
			<view class="result-panel mini-panel">
				<text class="section-label">BMI</text>
				<text class="mini-number">{{ displayBmiValue }}</text>
			</view>
		</view>

		<button class="primary-button" hover-class="button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('add-record')">{{ copy('records.add') }}</button>

		<view class="plain-card">
			<text class="field-label">{{ copy('records.targetProgress') }}</text>
			<view class="metric-row">
				<text>{{ copy('records.target') }}</text>
				<text class="metric-value">{{ targetProgress.targetText }}</text>
			</view>
			<view class="metric-row">
				<text>{{ targetProgress.statusText }}</text>
				<text class="metric-value">{{ targetProgress.differenceText }}</text>
			</view>
			<text class="note">{{ targetProgress.hasTarget ? copy('records.targetSetNote') : copy('records.targetMissingNote') }}</text>
			<view class="input-row setting-input-row">
				<input class="field-input target-weight-input" type="digit" v-model="targetWeightModel" />
				<text class="unit-label">{{ weightUnit }}</text>
			</view>
			<text v-if="targetWeightError" class="error-text">{{ targetWeightError }}</text>
			<button class="secondary-button" hover-class="secondary-button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('save-target-weight')">{{ copy('records.saveTarget') }}</button>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('records.progressSummary') }}</text>
			<view class="metric-row">
				<text>{{ copy('records.saved') }}</text>
				<text class="metric-value">{{ recordProgressSummary.recordCountText }}</text>
			</view>
			<view class="metric-row">
				<text>{{ recordProgressSummary.directionText }}</text>
				<text class="metric-value">{{ recordProgressSummary.changeText }}</text>
			</view>
			<text class="note">{{ recordProgressSummary.periodText }}</text>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<text class="field-label no-margin">{{ copy('records.recent') }}</text>
				<text class="setting-value">{{ records.length }}/{{ totalRecordCount }}</text>
			</view>
		</view>

		<view class="trend-summary">
			<view>
				<text class="trend-title">{{ trendSummary.title }}</text>
				<text class="trend-range">{{ copy('records.range', { value: trendSummary.rangeText }) }}</text>
			</view>
			<view class="trend-latest">
				<text class="trend-latest-label">{{ copy('records.latest') }}</text>
				<text class="trend-latest-value">{{ trendSummary.latestValue }}</text>
			</view>
		</view>

		<view class="trend-card">
			<canvas class="trend-canvas" canvas-id="recordsTrendCanvas" id="recordsTrendCanvas"></canvas>
			<view v-if="trendPoints.length" class="trend-y-axis">
				<text v-for="label in trendSummary.yLabels" :key="label">{{ label }}</text>
			</view>
			<view v-if="trendPoints.length" class="trend-x-axis">
				<text>{{ trendSummary.startLabel }}</text>
				<text>{{ trendSummary.endLabel }}</text>
			</view>
			<view v-if="!trendPoints.length" class="empty-trend">
				<text>{{ copy('records.emptyTrend') }}</text>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('records.visible') }}</text>
			<view class="record-row" v-for="record in records" :key="record.id">
				<view v-if="editingRecordId === record.id" class="record-edit">
					<view class="record-edit-row">
						<input class="record-edit-input" type="digit" v-model="editWeight" />
						<input class="record-edit-input" type="digit" v-model="editBmi" />
					</view>
					<text class="record-meta">{{ record.date }}</text>
				</view>
				<view v-else class="record-info">
					<text class="record-weight">{{ record.weight }} {{ weightUnit }}</text>
					<text class="record-meta">{{ record.date }} · BMI {{ record.bmi }}</text>
				</view>
				<view v-if="editingRecordId === record.id" class="record-actions">
					<text class="record-action" @tap="saveRecord(record)">{{ copy('action.save') }}</text>
					<text class="record-delete" @tap="cancelEdit">{{ copy('action.cancel') }}</text>
				</view>
				<view v-else class="record-actions">
					<text class="record-action" @tap="startEdit(record)">{{ copy('action.edit') }}</text>
					<text class="record-delete" @tap="$emit('delete-record', record.id)">{{ copy('action.delete') }}</text>
				</view>
			</view>
			<text v-if="!records.length" class="empty-copy">{{ emptyRecordCopy }}</text>
		</view>

		<text class="note">{{ copy('records.localOnly') }}</text>
	</view>
</template>

<script lang="ts">
	import { t } from '../services/i18n'
	import type { AppLanguage, RecordProgressSummary, TargetProgress, TrendMode, TrendPoint, TrendSummary, WeightRecord } from '../types/fitcal'

	export default {
		props: {
			currentWeight: { type: String, required: true },
			weightUnit: { type: String, required: true },
			displayBmiValue: { type: String, required: true },
			appLanguage: { type: String as () => AppLanguage, required: true },
			targetProgress: { type: Object as () => TargetProgress, required: true },
			targetWeight: { type: String, required: true },
			targetWeightError: { type: String, required: true },
			recordProgressSummary: { type: Object as () => RecordProgressSummary, required: true },
			totalRecordCount: { type: Number, required: true },
			trendMode: { type: String as () => TrendMode, required: true },
			trendPoints: { type: Array as () => TrendPoint[], required: true },
			trendSummary: { type: Object as () => TrendSummary, required: true },
			records: { type: Array as () => WeightRecord[], required: true }
		},
		data() {
			return {
				editingRecordId: null as number | null,
				editWeight: '',
				editBmi: ''
			}
		},
		emits: {
			'update:targetWeight': (_value: string) => true,
			'save-target-weight': () => true,
			'add-record': () => true,
			'delete-record': (_recordId: number) => true,
			'update-record': (_record: WeightRecord) => true
		},
		computed: {
			targetWeightModel: {
				get(): string {
					return this.targetWeight
				},
				set(value: string) {
					this.$emit('update:targetWeight', value)
				}
			},
			emptyRecordCopy() {
				return this.totalRecordCount ? this.copy('records.emptyFiltered') : this.copy('records.empty')
			}
		},
		watch: {
			trendPoints: {
				handler() {
					this.drawTrend()
				},
				deep: true
			},
			trendMode() {
				this.drawTrend()
			}
		},
		mounted() {
			this.drawTrend()
		},
		methods: {
			copy(key: string, params?: Record<string, string | number>) {
				return t(this.appLanguage, key, params)
			},
			startEdit(record: WeightRecord) {
				this.editingRecordId = record.id
				this.editWeight = record.weight
				this.editBmi = record.bmi
			},
			cancelEdit() {
				this.editingRecordId = null
				this.editWeight = ''
				this.editBmi = ''
			},
			saveRecord(record: WeightRecord) {
				this.$emit('update-record', {
					...record,
					weight: this.editWeight,
					bmi: this.editBmi
				})
				this.cancelEdit()
			},
			drawTrend() {
				this.$nextTick(() => {
					const uniApi = uni as unknown as {
						createCanvasContext: (canvasId: string, component?: unknown) => TrendCanvasContext
						createSelectorQuery: () => TrendSelectorQuery
					}

					uniApi.createSelectorQuery()
						.in(this)
						.select('.trend-canvas')
						.boundingClientRect((rect) => {
							const width = rect?.width || 360
							const height = rect?.height || 220
							const context = uniApi.createCanvasContext('recordsTrendCanvas', this)

							context.clearRect(0, 0, width, height)
							this.drawGrid(context, width, height)
							this.drawLine(context, width, height)
							this.drawDots(context, width, height)
							context.draw()
						})
						.exec()
				})
			},
			scalePoint(point: TrendPoint, width: number, height: number) {
				return {
					x: point.x / 360 * width,
					y: point.y / 220 * height
				}
			},
			drawGrid(context: TrendCanvasContext, width: number, height: number) {
				context.setStrokeStyle('#EAF1F1')
				context.setLineWidth(1)
				;[0.25, 0.5, 0.75].forEach((ratio) => {
					const y = height * ratio
					context.beginPath()
					context.moveTo(0, y)
					context.lineTo(width, y)
					context.stroke()
				})
			},
			drawLine(context: TrendCanvasContext, width: number, height: number) {
				if (this.trendPoints.length < 2) return
				context.setStrokeStyle('#0F9F8F')
				context.setLineWidth(5)
				context.setLineCap('round')
				context.setLineJoin('round')
				this.trendPoints.forEach((point, index) => {
					const scaled = this.scalePoint(point, width, height)
					if (index === 0) {
						context.beginPath()
						context.moveTo(scaled.x, scaled.y)
						return
					}
					context.lineTo(scaled.x, scaled.y)
				})
				context.stroke()
			},
			drawDots(context: TrendCanvasContext, width: number, height: number) {
				this.trendPoints.forEach((point) => {
					const scaled = this.scalePoint(point, width, height)
					context.beginPath()
					context.setFillStyle('#FDE1DC')
					context.arc(scaled.x, scaled.y, 13, 0, Math.PI * 2)
					context.fill()
					context.beginPath()
					context.setFillStyle('#F06F5D')
					context.arc(scaled.x, scaled.y, 6, 0, Math.PI * 2)
					context.fill()
				})
			}
		}
	}

	interface TrendCanvasContext {
		arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void
		beginPath(): void
		clearRect(x: number, y: number, width: number, height: number): void
		draw(): void
		fill(): void
		lineTo(x: number, y: number): void
		moveTo(x: number, y: number): void
		setFillStyle(color: string): void
		setLineCap(lineCap: 'butt' | 'round' | 'square'): void
		setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void
		setLineWidth(width: number): void
		setStrokeStyle(color: string): void
		stroke(): void
	}

	interface TrendSelectorQuery {
		exec(): void
		in(component: unknown): TrendSelectorQuery
		select(selector: string): {
			boundingClientRect(callback: (rect?: { width: number; height: number }) => void): TrendSelectorQuery
		}
	}
</script>
