import { chromium } from 'playwright'

const baseUrl = process.env.CAMPPACK_H5_URL || 'http://localhost:5174/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 430, height: 844 } })
const failures = []
const errors = []
const consoleErrors = []

page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
	if (message.type() === 'error') {
		consoleErrors.push(message.text())
	}
})

async function expectText(label, text) {
	await expectBodyText(label, text)
}

async function expectBodyText(label, text) {
	await page.waitForLoadState('load')
	const bodyText = await page.locator('body').innerText()
	if (!bodyText.includes(text)) {
		failures.push(`${label}: missing ${text}`)
	}
}

async function fillUniTextarea(testId, value) {
	await page.locator(`[data-testid="${testId}"] textarea`).evaluate((element, nextValue) => {
		element.value = nextValue
		element.dispatchEvent(new Event('input', { bubbles: true }))
		element.dispatchEvent(new CustomEvent('input', { bubbles: true, detail: { value: nextValue } }))
	}, value)
}

async function selectLanguage(label) {
	await page.getByTestId('settings-language-picker').selectOption({ label })
}

await page.goto(baseUrl)
await page.evaluate(() => localStorage.clear())
await page.reload()
await page.waitForTimeout(500)
await expectText('home', 'CampPack')
await page.getByText('Templates', { exact: true }).click()
await page.getByTestId('filter-family').click()
await expectText('family filter', 'Family Glamping')
await page.getByText('Import', { exact: true }).click()
await expectText('imported list', 'Imported template')
await page.waitForFunction(() => localStorage.getItem('camppack.mvp.v1')?.includes('Imported template'))

await page.reload()
await page.waitForFunction(() => document.body.innerText.includes('Imported template'))
await page.getByText('Family Glamping', { exact: true }).first().click()
await page.getByTestId('mode-pack').click()
await page.getByText('Cabin tent', { exact: true }).click()
await expectBodyText('pack progress', '1 / 8')
await page.getByTestId('mode-setup').click()
await expectBodyText('setup independent before toggle', '0 / 8')
await page.getByText('Cabin tent', { exact: true }).click()
await expectBodyText('setup progress', '1 / 8')
await page.getByTestId('mode-leave').click()
await expectBodyText('leave independent before toggle', '0 / 8 returned')
await page.getByText('Cabin tent', { exact: true }).click()
await expectBodyText('leave progress', '1 / 8 returned')
await page.getByText('Reset Leave', { exact: false }).click()
await expectBodyText('leave reset', '0 / 8 returned')
await page.getByTestId('mode-pack').click()
await expectBodyText('pack preserved after leave reset', '1 / 8')

await page.getByText('＋', { exact: true }).click()
await expectText('editor', 'Edit Gear')
await page.getByTestId('qty-plus').click()
await page.getByText('Save Item', { exact: false }).click()
await expectBodyText('saved editor return', '2')
await page.reload()
await page.getByText('Family Glamping', { exact: true }).first().click()
await expectBodyText('edited quantity persisted', '2')

await page.getByText('←', { exact: true }).click()
await expectText('lists after back', 'Your Checklists')
await page.getByTestId('new-checklist').click()
await expectBodyText('new checklist opens detail', 'New Checklist')
await page.getByTestId('delete-checklist').click()
await expectBodyText('delete confirm visible', 'Delete checklist?')
await page.getByTestId('confirm-yes').click()
await expectText('deleted checklist returns home', 'Your Checklists')

await page.getByText('Family Glamping', { exact: true }).first().click()
await page.getByTestId('rename-checklist').click()
await expectBodyText('renamed checklist visible', 'Family Glamping Edited')
await page.getByTestId('copy-checklist').click()
await expectBodyText('copied checklist visible', 'Family Glamping Edited Copy')
await page.getByText('Family Glamping Edited', { exact: true }).first().click()
await page.locator('[data-testid^="edit-"]').first().click()
await expectText('editor for renamed item', 'Edit Gear')
await page.getByTestId('item-name').locator('input').fill('Canvas cabin tent')
await page.getByTestId('item-weight').locator('input').fill('9.4')
await page.getByTestId('item-notes').locator('textarea').fill('Pole bag checked.')
await page.getByText('Save Item', { exact: false }).click()
await expectBodyText('renamed item visible', 'Canvas cabin tent')
await expectBodyText('updated weight visible', '9.4 kg')
await page.reload()
await page.getByText('Family Glamping Edited', { exact: true }).first().click()
await expectBodyText('renamed item persisted', 'Canvas cabin tent')

await page.getByTestId('add-gear').click()
await page.getByTestId('item-name').locator('input').fill('Waterproof map')
await page.getByTestId('item-weight').locator('input').fill('0.1')
await page.getByTestId('category-safety').click()
await page.getByTestId('item-notes').locator('textarea').fill('Route marked.')
await page.getByText('Save Item', { exact: false }).click()
await expectBodyText('added gear visible', 'Waterproof map')

await page.getByText('←', { exact: true }).click()
await expectText('lists before settings', 'Your Checklists')
await page.getByTestId('tab-settings').click()
await expectText('settings visible', 'Settings')
await page.getByTestId('settings-units').click()
await expectBodyText('unit changed to imperial', 'Imperial')
await selectLanguage('中文')
await expectBodyText('language changed', '设置')
await page.getByTestId('tab-lists').click()
await expectBodyText('home translated after language change', '你的清单')
await expectBodyText('home stat translated after language change', '已打包')
await page.getByTestId('tab-templates').click()
await expectBodyText('templates translated after language change', '搜索模板')
await expectBodyText('template import translated after language change', '导入')
await page.getByTestId('tab-settings').click()
await expectBodyText('settings language value translated', '中文')
await page.reload()
await page.getByTestId('tab-settings').click()
await expectBodyText('unit preference persisted', '英制')
await expectBodyText('language preference persisted', '中文')
await page.getByTestId('settings-export').click()
await expectBodyText('export data visible', '导出数据')
const exportedPayload = await page.getByTestId('data-payload').locator('textarea').inputValue()
const backupPayload = exportedPayload || await page.evaluate(() => localStorage.getItem('camppack.mvp.v1'))
if (!backupPayload.includes('Canvas cabin tent')) {
	failures.push('export: missing edited checklist data')
}
await page.getByText('←', { exact: true }).click()
await page.getByTestId('settings-import').click()
await fillUniTextarea('data-payload', backupPayload)
await page.getByTestId('apply-import').click()
await expectBodyText('lists after import detail', '你的清单')
await page.getByText('Family Glamping Edited', { exact: true }).first().click()
await expectBodyText('import data restored', 'Canvas cabin tent')
await page.getByText('←', { exact: true }).click()
await page.getByTestId('tab-settings').click()
await page.getByTestId('settings-privacy').click()
await expectBodyText('privacy page visible', '离线优先隐私')
await expectBodyText('privacy detail visible', '导出和导入')
await expectBodyText('privacy local storage visible', '本地存储')
await expectBodyText('disclaimer visible', '户外安全免责声明')
await expectBodyText('disclaimer emergency visible', '应急风险')
await page.getByText('←', { exact: true }).click()
await page.getByTestId('settings-reset').click()
await expectBodyText('reset confirm visible', '重置演示内容？')
await page.getByTestId('confirm-yes').click()
await expectBodyText('reset returns seeded list', 'Weekend Lake')

if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) {
	failures.push('layout: horizontal overflow at 430px viewport')
}

await browser.close()

if (errors.length || consoleErrors.length || failures.length) {
	console.error([...failures, ...errors, ...consoleErrors].join('\n'))
	process.exit(1)
}

console.log('H5 smoke passed')
