import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const baseUrl = (process.env.FITCAL_H5_URL || 'http://127.0.0.1:5179/').replace(/\/?$/, '/')
const timeout = 15000

const languages = [
	{ key: 'en', settings: 'Settings', records: 'Records', guidance: 'Guidance' },
	{ key: 'zh-Hans', settings: '设置', records: '记录', guidance: '指南' },
	{ key: 'es', settings: 'Ajustes', records: 'Registros', guidance: 'Guía' },
	{ key: 'de', settings: 'Einstellungen', records: 'Verlauf', guidance: 'Leitfaden' },
	{ key: 'ja', settings: '設定', records: '記録', guidance: 'ガイド' }
]

async function main() {
	const browser = await chromium.launch({ headless: true })
	const page = await browser.newPage({
		viewport: { width: 360, height: 780 },
		deviceScaleFactor: 2
	})
	const failures = []

	try {
		await page.route('**/api/app/config', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					adPlaceholderEnabled: true,
					testAnnouncement: '',
					showTestAnnouncement: false,
					updatedAt: ''
				})
			})
		})

		for (const language of languages) {
			await prepareLanguage(page, language.key)
			for (const tab of [language.settings, language.records, language.guidance]) {
				await page.locator('.nav-item').filter({ hasText: tab }).click({ timeout })
				await page.waitForTimeout(500)
				const issues = await findVisibleOverflow(page)
				if (issues.length) {
					failures.push(`${language.key}/${tab}: ${issues.slice(0, 5).join('; ')}`)
				}
			}
			const csvIssues = await auditCsvOwnershipAndLayout(page, language)
			failures.push(...csvIssues)
		}
	} finally {
		await browser.close()
	}

	if (failures.length) {
		console.error('FitCal narrow layout audit failed:')
		for (const failure of failures) {
			console.error(`- ${failure}`)
		}
		process.exit(1)
	}

	console.log('FitCal narrow layout audit passed')
}

async function prepareLanguage(page, language) {
	await page.goto(baseUrl, { waitUntil: 'networkidle', timeout })
	await page.evaluate((value) => {
		window.localStorage.clear()
		window.localStorage.setItem('fitcal_app_language', value)
		window.localStorage.setItem('fitcal_target_weight', '62.0')
	}, language)
	await page.reload({ waitUntil: 'networkidle', timeout })
}

async function findVisibleOverflow(page) {
	return page.evaluate(() => {
		const viewportWidth = document.documentElement.clientWidth
		const selectors = [
			'text',
			'.screen-title',
			'.screen-subtitle',
			'.setting-title',
			'.setting-value',
			'.segmented-item',
			'.chip',
			'.record-meta',
			'.record-weight',
			'.metric-label',
			'.metric-value',
			'.guide-title',
			'.guide-copy',
			'.nav-label',
			'button'
		]
		const issues = []
		for (const element of document.querySelectorAll(selectors.join(','))) {
			const style = window.getComputedStyle(element)
			if (style.display === 'none' || style.visibility === 'hidden') continue
			const rect = element.getBoundingClientRect()
			if (rect.width <= 0 || rect.height <= 0) continue
			if (rect.left < -1 || rect.right > viewportWidth + 1) {
				issues.push(`${readText(element)} crosses viewport ${Math.round(rect.left)}-${Math.round(rect.right)}`)
				continue
			}
			if (element.scrollWidth > element.clientWidth + 2 && style.overflowX === 'visible') {
				issues.push(`${readText(element)} overflows element ${element.clientWidth}/${element.scrollWidth}`)
			}
		}
		return issues
	})
}

async function auditCsvOwnershipAndLayout(page, language) {
	const issues = []
	await page.locator('.nav-item').filter({ hasText: language.records }).click({ timeout })
	await page.waitForTimeout(300)
	const recordsCsvControls = await page.locator('.record-row, .plain-card, button').filter({ hasText: 'CSV' }).count()
	if (recordsCsvControls > 0) {
		issues.push(`${language.key}/records: CSV controls must stay in Settings`)
	}

	await page.locator('.nav-item').filter({ hasText: language.settings }).click({ timeout })
	await page.waitForTimeout(300)
	const settingsCsvLayout = await page.evaluate(() => {
		const card = Array.from(document.querySelectorAll('.data-card')).find((element) => (element.textContent || '').includes('CSV'))
		if (!card) {
			return { missing: true }
		}
		const buttons = Array.from(card.querySelectorAll('button, uni-button')).map((button) => {
			const rect = button.getBoundingClientRect()
			return {
				text: (button.textContent || '').replace(/\s+/g, ' ').trim(),
				left: rect.left,
				right: rect.right,
				top: rect.top,
				width: rect.width
			}
		})
		const input = card.querySelector('textarea, uni-textarea')
		const inputRect = input?.getBoundingClientRect()
		return {
			missing: false,
			buttons,
			inputTop: inputRect?.top ?? null,
			viewportWidth: document.documentElement.clientWidth
		}
	})
	if (settingsCsvLayout.missing) {
		issues.push(`${language.key}/settings: missing local CSV data card`)
		return issues
	}
	if (settingsCsvLayout.buttons.length !== 2) {
		issues.push(`${language.key}/settings: expected 2 CSV buttons, got ${settingsCsvLayout.buttons.length}`)
	}
	for (const button of settingsCsvLayout.buttons) {
		if (button.left < -1 || button.right > settingsCsvLayout.viewportWidth + 1) {
			issues.push(`${language.key}/settings: CSV button crosses viewport ${button.text}`)
		}
	}
	if (settingsCsvLayout.buttons.length === 2) {
		const [first, second] = settingsCsvLayout.buttons
		const overlap = Math.abs(first.top - second.top) < 4
		if (overlap) {
			issues.push(`${language.key}/settings: CSV buttons should stack vertically on narrow screens`)
		}
		if (settingsCsvLayout.inputTop !== null && settingsCsvLayout.inputTop <= second.top) {
			issues.push(`${language.key}/settings: CSV input overlaps CSV action buttons`)
		}
	}
	return issues
}

function readText(element) {
	const text = (element.textContent || '').replace(/\s+/g, ' ').trim()
	return text.slice(0, 40) || element.className || element.tagName
}

main().catch((error) => {
	console.error(error.message)
	process.exit(1)
})
