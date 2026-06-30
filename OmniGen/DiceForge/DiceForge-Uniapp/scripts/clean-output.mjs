import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const mode = process.argv[2] || 'all';

const targetsByMode = {
  browser: [
    join(projectRoot, 'dist', 'index.html'),
    join(projectRoot, 'dist', 'assets')
  ],
  h5: [
    join(projectRoot, 'dist', 'build', 'h5')
  ],
  all: [
    join(projectRoot, 'dist')
  ]
};

const targets = targetsByMode[mode];
if (!targets) {
  throw new Error(`Unknown clean mode: ${mode}`);
}

targets.forEach((target) => {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
});

console.log(`Cleaned ${mode} output.`);
