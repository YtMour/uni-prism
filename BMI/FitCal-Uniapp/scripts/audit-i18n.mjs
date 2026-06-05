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

const i18nSource = fs.readFileSync(path.join(root, 'services/i18n.ts'), 'utf8')
const englishBlock = extractObjectBlock(i18nSource, 'en')
const zhHansBlock = extractObjectBlock(i18nSource, "'zh-Hans'")
const englishKeys = extractTranslationKeys(englishBlock)
const zhHansKeys = extractTranslationKeys(zhHansBlock)

for (const key of englishKeys) {
	if (!zhHansKeys.has(key)) {
		failures.push(`services/i18n.ts: zh-Hans missing translation key "${key}".`)
	}
}

for (const key of zhHansKeys) {
	if (!englishKeys.has(key)) {
		failures.push(`services/i18n.ts: en missing translation key "${key}".`)
	}
}

const usedKeys = new Set()
for (const file of listSourceFiles(root)) {
	const source = fs.readFileSync(file, 'utf8')
	for (const match of source.matchAll(/\bt\([^,]+,\s*['"`]([^'"`]+)['"`]/g)) {
		usedKeys.add(match[1])
	}
}

for (const key of usedKeys) {
	if (key.includes('${')) {
		continue
	}
	if (!englishKeys.has(key)) {
		failures.push(`services/i18n.ts: runtime key "${key}" is used but missing from en.`)
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

function extractObjectBlock(source, key) {
	const keyIndex = source.indexOf(`${key}: {`)
	if (keyIndex === -1) {
		throw new Error(`Cannot find i18n block ${key}`)
	}
	const start = source.indexOf('{', keyIndex)
	let depth = 0
	for (let index = start; index < source.length; index++) {
		const char = source[index]
		if (char === '{') depth++
		if (char === '}') depth--
		if (depth === 0) {
			return source.slice(start, index + 1)
		}
	}
	throw new Error(`Cannot parse i18n block ${key}`)
}

function extractTranslationKeys(source) {
	const keys = new Set()
	for (const match of source.matchAll(/'([^']+)':\s*'/g)) {
		keys.add(match[1])
	}
	return keys
}

function listSourceFiles(directory) {
	const result = []
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (entry.name === 'node_modules' || entry.name === 'dist') continue
		const fullPath = path.join(directory, entry.name)
		if (entry.isDirectory()) {
			result.push(...listSourceFiles(fullPath))
			continue
		}
		if (/\.(vue|ts)$/.test(entry.name)) {
			result.push(fullPath)
		}
	}
	return result
}
