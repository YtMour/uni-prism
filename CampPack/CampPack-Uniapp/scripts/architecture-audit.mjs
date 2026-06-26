import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pagePath = path.join(root, 'pages', 'index', 'index.vue')
const page = fs.readFileSync(pagePath, 'utf8')
const failures = []

function assertFile(file) {
	if (!fs.existsSync(path.join(root, file))) {
		failures.push(`missing module: ${file}`)
	}
}

function assertIncludes(label, needle) {
	if (!page.includes(needle)) {
		failures.push(`${label}: index.vue missing ${needle}`)
	}
}

function assertNotIncludes(label, needle) {
	if (page.includes(needle)) {
		failures.push(`${label}: index.vue still contains ${needle}`)
	}
}

assertFile('common/icons.js')
assertFile('data/demoData.js')
assertFile('data/templates.js')
assertFile('services/campRepository.js')
assertFile('components/shared/IconMark.vue')
assertFile('components/shared/AppTabbar.vue')
assertFile('components/templates/TemplateCard.vue')
assertFile('components/lists/ChecklistCard.vue')
assertFile('components/settings/SettingsSection.vue')

assertIncludes('data module', "from '../../data/demoData.js'")
assertIncludes('icon module', "from '../../components/shared/IconMark.vue'")
assertIncludes('tabbar module', "from '../../components/shared/AppTabbar.vue'")
assertIncludes('template card module', "from '../../components/templates/TemplateCard.vue'")
assertIncludes('checklist card module', "from '../../components/lists/ChecklistCard.vue'")
assertIncludes('settings section module', "from '../../components/settings/SettingsSection.vue'")
assertIncludes('repository module', "from '../../services/campRepository.js'")
assertIncludes('template module', "from '../../data/templates.js'")

assertNotIncludes('icon mapping', 'const iconSources =')
assertNotIncludes('inline checklist seed', "{ name: 'Weekend Lake'")
assertNotIncludes('inline settings seed', "preferenceItems: [")
assertNotIncludes('legacy demo gear import', ' gear, ')
assertNotIncludes('legacy demo categories import', ' collapsedCategories, ')

const lineCount = page.split(/\r?\n/).length
if (lineCount > 1800) {
	failures.push(`index.vue line count ${lineCount} exceeds 1800 after MVP repository and i18n integration`)
}

if (failures.length) {
	console.error(failures.join('\n'))
	process.exit(1)
}

console.log('Architecture audit passed')
