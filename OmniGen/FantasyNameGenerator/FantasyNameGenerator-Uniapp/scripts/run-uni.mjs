import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const cli = resolve(projectRoot, 'node_modules/@dcloudio/vite-plugin-uni/bin/uni.js')

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: {
    ...process.env,
    UNI_INPUT_DIR: '.'
  },
  stdio: 'inherit'
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
