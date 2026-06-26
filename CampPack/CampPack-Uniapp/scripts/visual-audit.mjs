import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const root = process.cwd()
const pagePath = path.join(root, 'pages', 'index', 'index.vue')
const page = fs.readFileSync(pagePath, 'utf8')
const iconComponent = fs.readFileSync(path.join(root, 'components', 'shared', 'IconMark.vue'), 'utf8')
const tabbarComponent = fs.readFileSync(path.join(root, 'components', 'shared', 'AppTabbar.vue'), 'utf8')
const templateComponent = fs.readFileSync(path.join(root, 'components', 'templates', 'TemplateCard.vue'), 'utf8')
const checklistComponent = fs.readFileSync(path.join(root, 'components', 'lists', 'ChecklistCard.vue'), 'utf8')
const settingsComponent = fs.readFileSync(path.join(root, 'components', 'settings', 'SettingsSection.vue'), 'utf8')

const failures = []

function assertIncludes(label, needle) {
	if (!page.includes(needle)) {
		failures.push(`${label}: missing ${needle}`)
	}
}

function cssBlock(selector, source = page) {
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'))
	return match?.[1] || ''
}

function assertCss(label, selector, pattern, source = page) {
	const block = cssBlock(selector, source)
	if (!pattern.test(block)) {
		failures.push(`${label}: ${selector} does not match ${pattern}`)
	}
}

function imageBounds(file) {
	const png = PNG.sync.read(fs.readFileSync(file))
	let minX = png.width
	let minY = png.height
	let maxX = -1
	let maxY = -1

	for (let y = 0; y < png.height; y += 1) {
		for (let x = 0; x < png.width; x += 1) {
			const idx = (png.width * y + x) << 2
			if (png.data[idx + 3] > 12) {
				minX = Math.min(minX, x)
				minY = Math.min(minY, y)
				maxX = Math.max(maxX, x)
				maxY = Math.max(maxY, y)
			}
		}
	}

	return {
		width: png.width,
		height: png.height,
		left: minX,
		top: minY,
		right: png.width - 1 - maxX,
		bottom: png.height - 1 - maxY
	}
}

const uiIconDir = path.join(root, 'static', 'icons', 'ui')
for (const name of fs.readdirSync(uiIconDir).filter((file) => file.endsWith('.png'))) {
	const bounds = imageBounds(path.join(uiIconDir, name))
	const minMargin = Math.min(bounds.left, bounds.top, bounds.right, bounds.bottom)
	const requiredMargin = Math.ceil(Math.min(bounds.width, bounds.height) * 0.08)
	if (minMargin < requiredMargin) {
		failures.push(`${name}: transparent safe margin ${minMargin}px is below ${requiredMargin}px`)
	}
}

if (!page.includes('icon-art') && !iconComponent.includes('class="icon-mark icon-art"')) {
	failures.push('safe icon wrapper: missing icon-art class')
}
if (!iconComponent.includes('<image') || !iconComponent.includes('mode="aspectFit"')) {
	failures.push('icon component: IconMark must use uni-app image with aspectFit mode')
}
if (!/\.icon-mark\s*\{[\s\S]*object-fit:\s*contain/.test(iconComponent)) {
	failures.push('icon fit: IconMark missing object-fit contain')
}
if (!/\.icon-mark\s*\{[\s\S]*width:\s*var\(--icon-width/.test(iconComponent) || !/\.icon-mark\s*\{[\s\S]*!important/.test(iconComponent)) {
	failures.push('icon sizing: IconMark must own fixed width and height rules')
}
assertCss('round icon overflow', '.round-icon', /overflow:\s*visible/)
assertCss('template icon overflow', '.template-art', /overflow:\s*visible/)
assertCss('template filters', '.chips', /display:\s*grid/)
assertCss('template filters', '.chips', /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/)
assertCss('template filter chip', '.chip', /width:\s*100%/)
assertCss('template filter chip', '.chip', /min-width:\s*0/)
assertCss('template filter chip', '.chip', /font-size:\s*16px/)
assertCss('template card layout', '.template-card', /display:\s*grid/, templateComponent)
assertCss('template card layout', '.template-card', /grid-template-columns:\s*92px minmax\(0,\s*1fr\) auto/, templateComponent)
assertCss('template card tags', '.template-card .tag-row', /margin-bottom:\s*0/, templateComponent)
if (!/@media\s*\(max-width:\s*430px\)[\s\S]*grid-template-columns:\s*56px minmax\(0,\s*1fr\) 78px/.test(templateComponent)) {
	failures.push('mobile template card layout: TemplateCard must keep icon, copy, and import action on one row')
}
if (templateComponent.includes('grid-column: 2;')) {
	failures.push('mobile import placement: TemplateCard import action must not drop to a second row')
}
assertCss('tabbar opacity', '.tabbar', /background:\s*#FBF9F5/)
assertCss('tabbar opacity', '.tabbar', /backdrop-filter:\s*none/)
assertCss('tabbar clipping', '.tabbar', /overflow:\s*hidden/)
assertCss('tabbar grid', '.tabbar', /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/)
assertCss('tabbar barrier', '.tabbar::before', /background:\s*#FBF9F5/)
assertCss('tab width', '.tab', /width:\s*100%/)
assertCss('tab width', '.tab', /min-width:\s*0/)
assertCss('tab width', '.tab', /box-sizing:\s*border-box/)
assertCss('tab centering', '.tab', /display:\s*flex/, tabbarComponent)
assertCss('tab centering', '.tab', /align-items:\s*center/, tabbarComponent)
assertCss('tab centering', '.tab', /justify-content:\s*center/, tabbarComponent)
assertCss('checklist card owns layout', '.list-main', /display:\s*flex/, checklistComponent)
assertCss('checklist card owns layout', '.phase-grid', /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/, checklistComponent)
assertCss('settings section owns layout', '.settings-card', /overflow:\s*hidden/, settingsComponent)
assertCss('settings section owns layout', '.setting-row', /display:\s*flex/, settingsComponent)
assertCss('settings section owns layout', '.setting-label', /flex:\s*1/, settingsComponent)
assertCss('scroll safe area', '.screen', /padding:\s*54px 24px 176px/)
assertIncludes('scroll reset binding', ':scroll-top="scrollTop"')
assertIncludes('screen transition helper', 'setScreen(screen)')
assertIncludes('screen transition helper', 'this.scrollTop = 0')
assertCss('button reset', '.app-shell button', /display:\s*flex/)
assertCss('button reset', '.app-shell button', /align-items:\s*center/)
assertCss('button reset', '.app-shell button', /justify-content:\s*center/)
assertCss('chip vertical centering', '.chip', /display:\s*flex/)
assertCss('chip vertical centering', '.chip', /align-items:\s*center/)
assertIncludes('template filter state', 'activeTemplateFilter')
assertIncludes('template filter click', '@click="activeTemplateFilter = chip.key"')
assertIncludes('template filtered list', 'filteredTemplates')
assertIncludes('template import action', 'importTemplate(template)')
assertIncludes('gear toggle action', 'toggleGear(item)')
assertIncludes('gear edit action', 'class="edit-gear-button"')
assertIncludes('gear edit action', '@click.stop="editGear(item)"')
assertIncludes('active checklist title', 'activeChecklistName')
assertIncludes('stable filter selector', "data-testid=\"'filter-' + chip.key.toLowerCase()\"")
assertIncludes('stable mode selector', "data-testid=\"'mode-' + phase\"")
assertIncludes('stable editor selector', 'data-testid="qty-plus"')
assertIncludes('stable editor selector', 'data-testid="unit-lb"')
assertIncludes('stable editor selector', 'data-testid="critical-toggle"')
assertIncludes('editor quantity decrement', 'adjustQuantity(-1)')
assertIncludes('editor quantity increment', 'adjustQuantity(1)')
assertIncludes('unit toggle action', 'setUnit(')
assertIncludes('critical toggle action', 'toggleCritical')
assertIncludes('leave reset action', 'resetLeave()')

if (failures.length) {
	console.error(failures.join('\n'))
	process.exit(1)
}

console.log('Visual audit passed')
