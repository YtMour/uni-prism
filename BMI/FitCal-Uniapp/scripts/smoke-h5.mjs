import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const baseUrl = (process.env.FITCAL_H5_URL || 'http://127.0.0.1:5179/').replace(/\/?$/, '/')
const timeout = 15000

function assert(condition, message) {
	if (!condition) {
		throw new Error(message)
	}
}

async function textVisible(page, text) {
	return page.getByText(text, { exact: false }).isVisible({ timeout })
}

async function exactTextVisible(page, text) {
	return page.getByText(text, { exact: true }).isVisible({ timeout })
}

async function pageIncludes(page, text) {
	const deadline = Date.now() + timeout
	let bodyText = ''
	while (Date.now() < deadline) {
		bodyText = await page.locator('body').innerText({ timeout: 3000 }).catch(() => '')
		if (bodyText.includes(text)) {
			return true
		}
		await page.waitForTimeout(250)
	}
	console.error(`Expected text "${text}" was not found at ${page.url()}`)
	console.error(bodyText.slice(0, 500))
	return false
}

async function clickText(page, text) {
	await page.getByText(text, { exact: true }).click({ timeout })
}

async function main() {
	const browser = await chromium.launch({ headless: true })
	const page = await browser.newPage({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2
	})

	const consoleIssues = []
	page.on('console', (message) => {
		if (['error', 'warning'].includes(message.type())) {
			const text = message.text()
			if (!text.includes('Canvas2D: Multiple readback operations')) {
				consoleIssues.push(`${message.type()}: ${text}`)
			}
		}
	})
	page.on('pageerror', (error) => {
		consoleIssues.push(`pageerror: ${error.message}`)
	})

	try {
		await page.goto(baseUrl, { waitUntil: 'networkidle', timeout })

		for (const tab of ['BMI', 'Calories', 'Guidance', 'Records', 'Settings']) {
			assert(await exactTextVisible(page, tab), `Missing tab: ${tab}`)
		}

		await clickText(page, 'Calculate BMI')
		await clickText(page, 'Records')
		const recordsAfterCalculate = await page.locator('.record-row').count()
		assert(recordsAfterCalculate > 0, 'BMI calculation did not create a Records entry')

		await page.locator('.record-delete').first().click({ timeout })
		const recordsAfterDelete = await page.locator('.record-row').count()
		assert(recordsAfterDelete === recordsAfterCalculate - 1, 'Records delete did not remove one entry')

		await clickText(page, 'Calories')
		assert(await textVisible(page, 'AD SLOT - RESULT PAGE'), 'Missing result-page ad placeholder')

		await clickText(page, 'Guidance')
		assert(await textVisible(page, 'AD SLOT - GUIDANCE'), 'Missing guidance ad placeholder')

		await assertRouteIncludes(browser, `${baseUrl}#/pages/policy/policy?type=privacy`, 'Privacy Policy')
		await assertRouteIncludes(browser, `${baseUrl}#/pages/policy/policy?type=disclaimer`, 'Disclaimer')

		assert(consoleIssues.length === 0, `Console issues found:\n${consoleIssues.join('\n')}`)
		console.log('FitCal H5 smoke passed')
	} finally {
		await browser.close()
	}
}

async function assertRouteIncludes(browser, url, expectedText) {
	const routePage = await browser.newPage({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2
	})
	try {
		await routePage.goto(url, { waitUntil: 'networkidle', timeout })
		assert(await pageIncludes(routePage, expectedText), `${expectedText} route did not render at ${routePage.url()}`)
	} finally {
		await routePage.close()
	}
}

main().catch((error) => {
	console.error(error.message)
	process.exit(1)
})
