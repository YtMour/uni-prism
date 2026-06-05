import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const checks = [
	{
		file: 'pages/index/index.vue',
		pattern: /toLocaleString\('en-US',\s*\{\s*month:\s*'short'\s*\}\)/,
		message: 'Record dates must not use English month names in runtime UI.'
	},
	{
		file: 'pages/index/index.vue',
		pattern: /\$\{this\.compactRecordDate\([^}]+\)\}\s+to\s+\$\{this\.compactRecordDate/,
		message: 'Record date ranges must use i18n copy instead of hard-coded "to".'
	},
	{
		file: 'pages/index/index.vue',
		pattern: /`Enter \$\{[^`]+`/,
		message: 'Validation messages must use i18n copy instead of hard-coded English.'
	},
	{
		file: 'pages/index/index.vue',
		pattern: /releaseBannerVisible\(\)/,
		message: 'Release notes and H5 version must stay admin-only unless a dedicated user-facing design is added.'
	}
]

const failures = []

for (const check of checks) {
	const filePath = path.join(root, check.file)
	const source = fs.readFileSync(filePath, 'utf8')
	if (check.pattern.test(source)) {
		failures.push(`${check.file}: ${check.message}`)
	}
}

if (failures.length) {
	console.error('FitCal i18n audit failed:')
	for (const failure of failures) {
		console.error(`- ${failure}`)
	}
	process.exit(1)
}

console.log('FitCal i18n audit passed')
