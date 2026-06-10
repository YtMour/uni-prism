import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2] === 'dev' ? 'dev' : 'build'
const viteBin = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')
const extraArgs = process.argv.slice(3)
const args = mode === 'dev' ? [viteBin, '--host', '0.0.0.0', ...extraArgs] : [viteBin, 'build', ...extraArgs]

const child = spawn(process.execPath, args, {
	cwd: root,
	stdio: 'inherit',
	env: {
		...process.env,
		UNI_INPUT_DIR: root,
		UNI_PLATFORM: 'h5'
	}
})

child.on('exit', code => {
	process.exit(code ?? 1)
})
