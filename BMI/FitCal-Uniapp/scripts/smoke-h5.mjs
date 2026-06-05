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

async function anyExactTextVisible(page, text) {
	const matches = page.getByText(text, { exact: true })
	const count = await matches.count()
	for (let index = 0; index < count; index += 1) {
		if (await matches.nth(index).isVisible({ timeout: 1000 }).catch(() => false)) {
			return true
		}
	}
	return false
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

async function clickTab(page, label) {
	await page.locator('.nav-item').filter({ hasText: label }).click({ timeout })
}

async function clickSettingOption(page, settingLabel, option) {
	await page.locator('.plain-card').filter({ hasText: settingLabel }).getByText(String(option), { exact: true }).click({ timeout })
}

async function clickSettingChip(page, settingLabel, option) {
	await page.locator('.plain-card')
		.filter({ hasText: settingLabel })
		.locator('.chip')
		.filter({ hasText: String(option) })
		.first()
		.click({ timeout })
}

async function fillSettingInput(page, settingLabel, value) {
	const card = page.locator('.plain-card').filter({ hasText: settingLabel })
	await card.locator('input').fill(value, { timeout })
}

async function selectLanguage(page, label) {
	const pickerRow = page.locator('.picker-row')
	const select = pickerRow.locator('select')
	if (await select.count()) {
		await select.selectOption({ label }, { timeout })
		return
	}
	await pickerRow.click({ timeout })
	const pickerItem = page.locator('.uni-picker-view-content .uni-picker-item').filter({ hasText: label }).first()
	await pickerItem.click({ timeout })
	await page.locator('.uni-picker-action').filter({ hasText: '完成' }).click({ timeout })
}

async function setStoredLanguage(page, language) {
	await page.evaluate((value) => {
		window.localStorage.setItem('fitcal_app_language', value)
	}, language)
	await reloadApp(page)
}

async function countRecords(page) {
	return page.locator('.record-row').count()
}

async function assertRecordCount(page, expected, message) {
	const count = await countRecords(page)
	assert(count === expected, `${message}. Expected ${expected}, got ${count}`)
}

async function editFirstRecord(page, weight, bmi) {
	await page.getByText('编辑', { exact: true }).or(page.getByText('Edit', { exact: true })).first().click({ timeout })
	const editInputs = page.locator('.record-row').first().locator('input')
	await editInputs.nth(0).fill(weight, { timeout })
	await editInputs.nth(1).fill(bmi, { timeout })
	await page.getByText('保存', { exact: true }).or(page.getByText('Save', { exact: true })).first().click({ timeout })
}

async function reloadApp(page) {
	await page.reload({ waitUntil: 'domcontentloaded', timeout })
	await page.waitForTimeout(500)
}

async function setOpsConfig(page, config) {
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
				updatedAt: '',
				...config
			})
		})
	})
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
		await setOpsConfig(page, {
			h5Version: '9.9.9',
			releaseNote: 'Hidden release note must not render',
			testAnnouncement: 'Smoke announcement text',
			showTestAnnouncement: false
		})
		await page.goto(baseUrl, { waitUntil: 'networkidle', timeout })
		await page.evaluate(() => window.localStorage.clear())
		await reloadApp(page)
		assert(!(await page.getByText('Hidden release note must not render', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), 'Hidden release note rendered in user app')
		assert(!(await page.getByText('Smoke announcement text', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), 'Hidden test announcement rendered in user app')

		for (const tab of ['BMI', 'Calories', 'Guidance', 'Records', 'Settings']) {
			assert(await exactTextVisible(page, tab), `Missing tab: ${tab}`)
		}

		await clickText(page, 'Calculate BMI')
		await clickTab(page, 'Records')
		const recordsAfterCalculate = await countRecords(page)
		assert(recordsAfterCalculate > 0, 'BMI calculation did not create a Records entry')

		await clickTab(page, 'Settings')
		await page.locator('.record-delete').first().click({ timeout })
		const recordsAfterDelete = await countRecords(page)
		assert(recordsAfterDelete === recordsAfterCalculate - 1, 'Records delete did not remove one entry')
		assert(await exactTextVisible(page, 'Weight trend'), 'Missing Weight trend control')
		await clickText(page, 'BMI trend')
		await clickTab(page, 'Records')
		assert(await exactTextVisible(page, 'BMI trend'), 'BMI trend did not render after switching chart mode')

		await clickTab(page, 'Calories')
		assert(await textVisible(page, 'Ad placeholder - result page'), 'Missing result-page ad placeholder')
		assert(await exactTextVisible(page, 'FitCal Test Ad'), 'Missing fake ad creative in Calories')
		await clickText(page, 'Close')
		assert(!(await page.getByText('FitCal Test Ad', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), 'Fake ad close did not hide Calories ad')

		await clickTab(page, 'Guidance')
		assert(await textVisible(page, 'Ad placeholder - guidance'), 'Missing guidance ad placeholder')
		assert(await exactTextVisible(page, 'FitCal Test Ad'), 'Missing fake ad creative in Guidance')
		assert(await exactTextVisible(page, 'Goal checkpoint'), 'Missing Guidance goal checkpoint')
		assert(await exactTextVisible(page, 'Recent movement'), 'Missing Guidance recent movement')
		await clickText(page, 'Open 7-Day Guide')
		assert(await exactTextVisible(page, '7-Day Guide'), '7-Day Guide did not open')
		assert(await exactTextVisible(page, 'Day 7'), '7-Day Guide did not render all days')
		await clickText(page, 'Hide 7-Day Guide')
		assert(!(await page.getByText('Day 7', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), '7-Day Guide did not hide')
		await clickText(page, 'Open 7-Day Guide')

		await clickTab(page, 'Settings')
		assert(!(await page.getByText('Ad placeholder test', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), 'Internal ad test controls should not be visible in user Settings')
		assert(!(await page.getByText('Impressions', { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)), 'Internal ad counters should not be visible in user Settings')
		await page.getByText('Imperial', { exact: true }).first().click({ timeout })
		assert(await anyExactTextVisible(page, 'Imperial'), 'Imperial setting was not visible after switching units')
		await setStoredLanguage(page, 'zh-Hans')
		await clickTab(page, '设置')
		assert(await anyExactTextVisible(page, '简体中文'), 'Language selector did not switch to Simplified Chinese')
		assert(await anyExactTextVisible(page, '设置'), 'Settings title did not switch to Simplified Chinese')
		assert(await exactTextVisible(page, '记录筛选'), 'Settings content did not switch to Simplified Chinese')
		await setStoredLanguage(page, 'es')
		await clickTab(page, 'Ajustes')
		assert(await anyExactTextVisible(page, 'Ajustes'), 'Settings title did not switch to Spanish')
		await setStoredLanguage(page, 'zh-Hans')
		await reloadApp(page)
		await clickTab(page, '设置')
		assert(await anyExactTextVisible(page, '英制'), 'Unit setting did not persist after reload')
		assert(await anyExactTextVisible(page, '简体中文'), 'Language selector did not persist after reload')
		await clickTab(page, '指南')
		assert(await exactTextVisible(page, '第 7 天'), '7-Day Guide open state did not persist after reload')

		await clickTab(page, '指南')
		await clickText(page, '每周')
		await clickTab(page, '设置')
		await clickSettingChip(page, '最大保存记录', 5)
		await clickTab(page, '记录')
		await fillSettingInput(page, '目标进度', '140')
		await clickText(page, '保存目标')
		await reloadApp(page)
		await clickTab(page, '指南')
		assert(await anyExactTextVisible(page, '每周'), 'Reminder setting did not persist after reload')
		await clickTab(page, 'BMI')
		for (let index = 0; index < 8; index += 1) {
			await clickText(page, '计算 BMI')
		}
		await clickTab(page, '记录')
		await assertRecordCount(page, 5, 'Max saved records setting did not trim Records list')
		assert(await exactTextVisible(page, '目标进度'), 'Target progress panel did not render')
		assert(await exactTextVisible(page, '140.0 lb'), 'Saved target weight did not render in Records')
		assert(await exactTextVisible(page, '12.0 lb'), 'Target progress difference did not render')
		assert(await exactTextVisible(page, '进度摘要'), 'Progress summary panel did not render')
		assert(await exactTextVisible(page, '5 条记录'), 'Progress summary record count did not render')
		assert(await exactTextVisible(page, '无变化'), 'Progress summary direction did not render')
		await clickTab(page, '设置')
		await editFirstRecord(page, '150', '26')
		assert(await anyExactTextVisible(page, '150.0 lb'), 'Edited record weight did not render')
		assert(await textVisible(page, 'BMI 26.0'), 'Edited record BMI did not render')
		await clickTab(page, '记录')
		assert(await exactTextVisible(page, '10.0 lb'), 'Edited record did not update target progress')
		await clickTab(page, '设置')
		assert(await exactTextVisible(page, '记录筛选'), 'Record filter panel did not render')
		await clickText(page, '最近 5 条')
		await clickTab(page, '记录')
		await assertRecordCount(page, 5, 'Last 5 filter did not show five records')
		await clickTab(page, '设置')
		await clickText(page, 'BMI 25+')
		await clickTab(page, '记录')
		await assertRecordCount(page, 1, 'BMI 25+ filter did not show the edited high-BMI record')
		await clickTab(page, '设置')
		await clickText(page, '全部')
		await clickTab(page, '记录')
		await assertRecordCount(page, 5, 'All filter did not restore records')
		await clickTab(page, '指南')
		assert(await anyExactTextVisible(page, '每周'), 'Guidance did not show reminder rhythm')
		assert(await anyExactTextVisible(page, '目标检查点'), 'Guidance target checkpoint did not persist after reminder setup')
		await reloadApp(page)
		await clickTab(page, '记录')
		assert(await exactTextVisible(page, '140.0 lb'), 'Saved target weight did not persist after reload')
		assert(await anyExactTextVisible(page, '150.0 lb'), 'Edited record did not persist after reload')
		await clickTab(page, '设置')
		assert(await exactTextVisible(page, '记录筛选'), 'Record filter did not render after reload')

		await clickTab(page, '设置')
		await clickText(page, '清除本地数据')
		await clickTab(page, '记录')
		await assertRecordCount(page, 0, 'Clear local data did not empty Records list')
		assert(await exactTextVisible(page, '暂无记录。'), 'Empty Records copy did not render')
		await reloadApp(page)
		await clickTab(page, '记录')
		await assertRecordCount(page, 0, 'Cleared Records list did not persist after reload')

		await assertRouteIncludes(browser, `${baseUrl}#/pages/policy/policy?type=privacy`, '隐私政策', 'zh-Hans')
		await assertRouteIncludes(browser, `${baseUrl}#/pages/policy/policy?type=disclaimer`, '免责声明', 'zh-Hans')

		assert(consoleIssues.length === 0, `Console issues found:\n${consoleIssues.join('\n')}`)
		console.log('FitCal H5 smoke passed')
	} finally {
		await browser.close()
	}
}

async function assertRouteIncludes(browser, url, expectedText, language = 'en') {
	const routePage = await browser.newPage({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2
	})
	try {
		await routePage.addInitScript((value) => {
			window.localStorage.setItem('fitcal_app_language', value)
		}, language)
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
