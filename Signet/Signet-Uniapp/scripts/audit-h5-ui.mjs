import { mkdirSync, createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(projectRoot, 'dist')
const outDir = join(projectRoot, 'preview')
const port = Number(process.env.SIGNET_AUDIT_PORT || 5293)
const baseUrl = `http://127.0.0.1:${port}`
const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml'
}

function createStaticServer() {
	return createServer((req, res) => {
		const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
		const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
		let filePath = join(root, safePath)
		if (!existsSync(filePath) || urlPath === '/') filePath = join(root, 'index.html')
		res.setHeader('Content-Type', types[extname(filePath)] || 'application/octet-stream')
		createReadStream(filePath).on('error', () => {
			res.statusCode = 404
			res.end('not found')
		}).pipe(res)
	})
}

async function listen(server) {
	await new Promise((resolveListen, rejectListen) => {
		server.once('error', rejectListen)
		server.listen(port, '127.0.0.1', resolveListen)
	})
}

async function close(server) {
	await new Promise(resolveClose => server.close(resolveClose))
}

function assert(condition, message) {
	if (!condition) throw new Error(message)
}

async function visibleText(page) {
	return page.locator('.page').innerText({ timeout: 10000 })
}

async function assertNoHorizontalOverflow(page, label) {
	const metrics = await page.evaluate(() => ({
		clientWidth: document.documentElement.clientWidth,
		scrollWidth: document.documentElement.scrollWidth,
		bodyScrollWidth: document.body.scrollWidth
	}))
	const overflow = Math.max(metrics.scrollWidth, metrics.bodyScrollWidth) - metrics.clientWidth
	assert(overflow <= 2, `${label} horizontal overflow ${overflow}px`)
}

async function assertViewportFit(page, selector, label) {
	const box = await page.locator(selector).evaluate(el => {
		const rect = el.getBoundingClientRect()
		return {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right,
			width: rect.width,
			height: rect.height,
			viewportWidth: window.innerWidth,
			viewportHeight: window.innerHeight
		}
	})
	assert(box.width > 0 && box.height > 0, `${label} has no visible size`)
	assert(box.left >= -2 && box.right <= box.viewportWidth + 2, `${label} exceeds horizontal viewport`)
	assert(box.top >= -2 && box.bottom <= box.viewportHeight + 2, `${label} exceeds vertical viewport`)
}

async function capture(page, name) {
	await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: true })
}

async function auditViewport(browser, viewport, suffix) {
	const page = await browser.newPage({ viewport })
	await page.goto(baseUrl, { waitUntil: 'load' })
	await page.evaluate(() => localStorage.clear())
	await page.goto(baseUrl, { waitUntil: 'load' })
	await page.waitForSelector('.preset-row', { timeout: 10000 })
	let text = await visibleText(page)
	assert(text.includes('Signet'), `${suffix} home missing Signet`)
	assert(text.includes('Choose Photo'), `${suffix} home missing Choose Photo`)
	assert(await page.locator('.preset-card').count() >= 6, `${suffix} home missing presets`)
	await assertNoHorizontalOverflow(page, `${suffix} home`)
	await capture(page, `audit-h5-home-${suffix}`)

	await page.goto(`${baseUrl}/?demoPhoto=landscape#/`, { waitUntil: 'load' })
	await page.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	text = await visibleText(page)
	assert(text.includes('Edit Frame'), `${suffix} editor missing title`)
	assert(text.includes('Watermark'), `${suffix} editor missing watermark control`)
	await assertNoHorizontalOverflow(page, `${suffix} editor`)
	await capture(page, `audit-h5-editor-${suffix}`)

	await page.goto(`${baseUrl}/?demoPhoto=landscape&mode=bottomBand#/`, { waitUntil: 'load' })
	await page.waitForSelector('.control-panel', { timeout: 10000 })
	text = await visibleText(page)
	assert(text.includes('Bottom Band'), `${suffix} left note did not enter bottom band`)
	await assertNoHorizontalOverflow(page, `${suffix} bottom band`)
	await capture(page, `audit-h5-bottom-band-${suffix}`)

	await page.locator('.editor-topbar .export-button').click()
	await page.waitForFunction(() => document.body.innerText.includes('Ready locally'), null, { timeout: 10000 })
	await assertViewportFit(page, '.export-card', `${suffix} export card`)
	text = await page.locator('.export-card').innerText()
	assert(text.includes('Ready locally'), `${suffix} export did not finish`)
	assert(text.includes('Bottom Band'), `${suffix} export missing mode label`)
	await capture(page, `audit-h5-export-${suffix}`)
	await page.locator('.export-card .danger').click()

	await page.goto(baseUrl, { waitUntil: 'load' })
	await page.waitForSelector('.settings-button', { timeout: 10000 })
	await page.locator('.settings-button').click()
	await page.waitForSelector('.settings-row', { timeout: 10000 })
	text = await visibleText(page)
	assert(text.includes('Settings'), `${suffix} settings missing title`)
	assert(text.includes('Recent Exports'), `${suffix} settings missing export history`)
	await assertNoHorizontalOverflow(page, `${suffix} settings`)
	await capture(page, `audit-h5-settings-${suffix}`)
	await page.close()
}

async function auditFailure(browser) {
	const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await page.goto(`${baseUrl}/?demoPhoto=landscape&simulateExportError=1#/`, { waitUntil: 'load' })
	await page.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await page.locator('.editor-topbar .export-button').click()
	await page.waitForFunction(() => document.body.innerText.includes('Export failed'), null, { timeout: 10000 })
	await assertViewportFit(page, '.export-card', 'failure export card')
	const text = await page.locator('.export-card').innerText()
	assert(text.includes('Retry'), 'failure state missing Retry')
	await capture(page, 'audit-h5-export-error')
	await page.close()
}

if (!existsSync(join(root, 'index.html'))) {
	throw new Error('H5 dist is missing. Run npm run build:h5 first.')
}

mkdirSync(outDir, { recursive: true })
const server = createStaticServer()
await listen(server)

const browser = await chromium.launch()
try {
	await auditViewport(browser, { width: 390, height: 844 }, 'mobile')
	await auditViewport(browser, { width: 820, height: 1180 }, 'tablet')
	await auditFailure(browser)
	console.log('h5 UI audit passed')
} finally {
	await browser.close()
	await close(server)
}
