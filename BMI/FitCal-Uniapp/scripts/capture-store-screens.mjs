import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const baseUrl = (process.env.FITCAL_H5_URL || 'http://127.0.0.1:5179/').replace(/\/?$/, '/')
const outputDir = path.resolve(process.cwd(), '..', 'docs', 'store-screenshots')
const timeout = 15000

const shots = [
	{ file: '01-bmi-en.png', language: 'en', tab: 'BMI', waitFor: 'Your result' },
	{ file: '02-calories-en.png', language: 'en', tab: 'Calories', waitFor: 'Daily target' },
	{ file: '03-guidance-en.png', language: 'en', tab: 'Guidance', waitFor: 'Meal focus' },
	{ file: '04-records-en.png', language: 'en', tab: 'Records', waitFor: 'Weight trend' },
	{ file: '05-settings-en.png', language: 'en', tab: 'Settings', waitFor: 'Privacy Policy' },
	{ file: '06-bmi-zh-Hans.png', language: 'zh-Hans', tab: 'BMI', waitFor: '你的结果' },
	{ file: '07-settings-zh-Hans.png', language: 'zh-Hans', tab: '设置', waitFor: '隐私政策' }
]

async function main() {
	await fs.mkdir(outputDir, { recursive: true })
	const browser = await chromium.launch({ headless: true })
	const page = await browser.newPage({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2
	})

	try {
		await page.route('**/api/app/config', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					adPlaceholderEnabled: true,
					h5Version: '',
					releaseNote: '',
					testAnnouncement: '',
					showTestAnnouncement: false,
					updatedAt: ''
				})
			})
		})

		for (const shot of shots) {
			await openPreparedApp(page, shot.language)
			await clickTab(page, shot.tab)
			await page.getByText(shot.waitFor, { exact: false }).first().waitFor({ timeout })
			await page.screenshot({
				path: path.join(outputDir, shot.file),
				fullPage: false
			})
		}
		console.log(`FitCal store screenshots written to ${outputDir}`)
	} finally {
		await browser.close()
	}
}

async function openPreparedApp(page, language) {
	await page.goto(baseUrl, { waitUntil: 'networkidle', timeout })
	await page.evaluate((value) => {
		window.localStorage.clear()
		window.localStorage.setItem('fitcal_app_language', value)
		window.localStorage.setItem('fitcal_units', 'metric')
		window.localStorage.setItem('fitcal_target_weight', '62.0')
		window.localStorage.setItem('fitcal_guide_unlocked', 'true')
	}, language)
	await page.reload({ waitUntil: 'networkidle', timeout })
}

async function clickTab(page, label) {
	await page.locator('.nav-item').filter({ hasText: label }).click({ timeout })
	await page.waitForTimeout(400)
}

main().catch((error) => {
	console.error(error.message)
	process.exit(1)
})
