import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.SIGNET_SMOKE_PORT || 5292)
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

function assertIncludes(text, expected) {
	if (!text.includes(expected)) {
		throw new Error(`Expected page text to include "${expected}", got: ${text}`)
	}
}

async function exportDemoMode(browser, url, expectedLabel, expectedSize) {
	const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await page.goto(url, { waitUntil: 'load' })
	await page.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await page.locator('.editor-topbar .export-button').click()
	await page.waitForFunction(() => document.body.innerText.includes('Ready locally'), null, { timeout: 10000 })
	const text = await page.locator('.export-card').innerText()
	assertIncludes(text, expectedLabel)
	const canvasSize = await page.locator('canvas').evaluate(canvas => ({
		width: Number(canvas.getAttribute('width')),
		height: Number(canvas.getAttribute('height'))
	}))
	if (canvasSize.width !== expectedSize.width || canvasSize.height !== expectedSize.height) {
		throw new Error(`Unexpected ${expectedLabel} canvas size: ${canvasSize.width}x${canvasSize.height}`)
	}
	await page.close()
}

if (!existsSync(join(root, 'index.html'))) {
	throw new Error('H5 dist is missing. Run npm run build:h5 first.')
}

const server = createStaticServer()
await listen(server)

const browser = await chromium.launch()
try {
	const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await page.goto(baseUrl, { waitUntil: 'load' })
	await page.evaluate(() => localStorage.clear())
	await page.goto(`${baseUrl}/?demoPhoto=landscape#/`, { waitUntil: 'load' })
	await page.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })

	const title = await page.title()
	if (title !== 'Signet') throw new Error(`Expected title Signet, got ${title}`)

	const editorText = await page.locator('.page').innerText()
	assertIncludes(editorText, 'Edit Frame')
	assertIncludes(editorText, 'PNG · 1600 × 1200 · Landscape')

	await page.locator('.editor-topbar .export-button').click()
	await page.waitForFunction(() => document.body.innerText.includes('Ready locally'), null, { timeout: 10000 })

	const exportText = await page.locator('.export-card').innerText()
	assertIncludes(exportText, 'Ready locally')
	assertIncludes(exportText, 'Q86 · No upscale · 1600px cap')
	const storedHistory = await page.evaluate(() => localStorage.getItem('signet.exportHistory'))
	if (!storedHistory || !storedHistory.includes('signet-fullFrame')) {
		throw new Error(`Export history was not recorded: ${storedHistory}`)
	}

	const canvasSize = await page.locator('canvas').evaluate(canvas => ({
		width: Number(canvas.getAttribute('width')),
		height: Number(canvas.getAttribute('height'))
	}))
	if (canvasSize.width !== 1600 || canvasSize.height !== 1483) {
		throw new Error(`Unexpected H5 export canvas size: ${canvasSize.width}x${canvasSize.height}`)
	}

	await page.locator('.export-card .danger').click()
	await page.locator('.editor-topbar [aria-label="Back"]').click()
	await page.waitForSelector('.preset-row', { timeout: 10000 })
	const presetCount = await page.locator('.preset-card').count()
	if (presetCount < 6) throw new Error(`Expected at least 6 presets, got ${presetCount}`)
	const homeTextAfterExport = await page.locator('.page').innerText()
	assertIncludes(homeTextAfterExport, 'Recent Exports')
	await page.locator('[data-testid="preset-signature"]').click()
	await page.waitForSelector('.position-panel', { timeout: 10000 })
	const signatureText = await page.locator('.page').innerText()
	assertIncludes(signatureText, 'Position')
	await page.locator('.position-panel .primary-button').click()
	await page.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await page.locator('.editor-topbar [aria-label="Back"]').click()
	await page.locator('.settings-button').click()
	await page.waitForSelector('.settings-row', { timeout: 10000 })
	await page.locator('[data-testid="settings-reset-editor"]').waitFor({ timeout: 10000 })
	await page.locator('[data-testid="settings-export"]').click()
	await page.locator('[data-testid="export-width-1080"]').click()
	await page.locator('[data-testid="export-format-png"]').click()
	const storedSettings = await page.evaluate(() => localStorage.getItem('signet.exportSettings'))
	if (!storedSettings || !storedSettings.includes('1080') || !storedSettings.includes('image/png')) {
		throw new Error(`Export settings were not persisted: ${storedSettings}`)
	}
	await page.locator('.detail-close').click()
	const settingsSummary = await page.locator('.page').innerText()
	assertIncludes(settingsSummary, '1080px / PNG')
	await page.locator('[data-testid="clear-export-history"]').click()
	const clearedHistory = await page.evaluate(() => localStorage.getItem('signet.exportHistory'))
	const clearedData = JSON.parse(clearedHistory || '[]')
	const clearedItems = Array.isArray(clearedData) ? clearedData : clearedData.data
	if (!Array.isArray(clearedItems) || clearedItems.length !== 0) throw new Error(`Export history was not cleared: ${clearedHistory}`)
	const customPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await customPage.goto(`${baseUrl}/?demoPhoto=landscape&exportWidth=1080&exportFormat=png#/`, { waitUntil: 'load' })
	await customPage.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await customPage.locator('.editor-topbar .export-button').click()
	await customPage.waitForFunction(() => document.body.innerText.includes('Ready locally'), null, { timeout: 10000 })

	const pngExportText = await customPage.locator('.export-card').innerText()
	assertIncludes(pngExportText, 'Ready locally')
	assertIncludes(pngExportText, 'PNG · No upscale · 1080px cap')
	const pngCanvasSize = await customPage.locator('canvas').evaluate(canvas => ({
		width: Number(canvas.getAttribute('width')),
		height: Number(canvas.getAttribute('height'))
	}))
	if (pngCanvasSize.width !== 1080 || pngCanvasSize.height !== 1002) {
		throw new Error(`Unexpected custom H5 export canvas size: ${pngCanvasSize.width}x${pngCanvasSize.height}`)
	}
	await customPage.close()

	const longTextPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await longTextPage.goto(`${baseUrl}/?demoPhoto=landscape#/`, { waitUntil: 'load' })
	await longTextPage.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await longTextPage.evaluate(() => {
		localStorage.setItem('signet.editorSettings', JSON.stringify({
			presetId: 'darkMat',
			mode: 'fullFrame',
			selectedSwatch: '#1A2A3A',
			borderValue: 36,
			opacity: 78,
			markSize: 48,
			offset: 50,
			bandHeight: 20,
			captionSize: 44,
			alignment: 'Center',
			selectedAnchor: 'bottom-center',
			watermarkText: 'Signet Long Watermark Name For Export Stress',
			showWatermarkName: true,
			showMetadataLine: true,
			metadataFields: [
				{ key: 'camera', label: 'Camera', value: 'Very Long Camera Body Name With Extra Descriptor' },
				{ key: 'lens', label: 'Lens', value: 'Ultra Wide Prime Lens With Long Marketing Name' },
				{ key: 'shutter', label: 'Shutter', value: '1/250s' },
				{ key: 'aperture', label: 'Aperture', value: 'f/2.8' },
				{ key: 'iso', label: 'ISO', value: 'ISO 200' },
				{ key: 'focal', label: 'Focal', value: '35mm Equivalent Field Of View' }
			]
		}))
	})
	await longTextPage.reload({ waitUntil: 'load' })
	await longTextPage.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await longTextPage.locator('.editor-topbar .export-button').click()
	await longTextPage.waitForFunction(() => document.body.innerText.includes('Ready locally'), null, { timeout: 10000 })
	const longCanvasSize = await longTextPage.locator('canvas').evaluate(canvas => ({
		width: Number(canvas.getAttribute('width')),
		height: Number(canvas.getAttribute('height'))
	}))
	if (![1080, 1600].includes(longCanvasSize.width) || longCanvasSize.height < 900) {
		throw new Error(`Unexpected long text export canvas size: ${longCanvasSize.width}x${longCanvasSize.height}`)
	}
	await longTextPage.close()

	const errorPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
	await errorPage.goto(`${baseUrl}/?demoPhoto=landscape&simulateExportError=1#/`, { waitUntil: 'load' })
	await errorPage.waitForSelector('.editor-topbar .export-button', { timeout: 10000 })
	await errorPage.locator('.editor-topbar .export-button').click()
	await errorPage.waitForFunction(() => document.body.innerText.includes('Export failed'), null, { timeout: 10000 })
	const errorText = await errorPage.locator('.export-card').innerText()
	assertIncludes(errorText, 'Retry')
	assertIncludes(errorText, 'Simulated export failure')
	await errorPage.close()

	await exportDemoMode(browser, `${baseUrl}/?demoPhoto=landscape&mode=bottomBand&exportWidth=1600&exportFormat=jpeg#/`, 'Bottom Band · 1600 × 1520', { width: 1600, height: 1520 })
	await exportDemoMode(browser, `${baseUrl}/?demoPhoto=landscape&mode=inPhoto&exportWidth=1600&exportFormat=jpeg#/`, 'In-Photo · 1600 × 1200', { width: 1600, height: 1200 })

	console.log('h5 smoke passed')
} finally {
	await browser.close()
	await close(server)
}
