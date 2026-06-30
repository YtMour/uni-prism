import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const h5Root = join(projectRoot, 'dist', 'build', 'h5');
const indexPath = join(h5Root, 'index.html');
const assetRoot = join(h5Root, 'assets');

assert.ok(existsSync(indexPath), 'dist/build/h5/index.html must exist. Run npm run build:h5 first.');
assert.ok(existsSync(assetRoot), 'dist/build/h5/assets must exist.');

const indexHtml = readFileSync(indexPath, 'utf8');
assert.match(indexHtml, /assets\/index-[^"]+\.js/, 'H5 index should reference a hashed JS bundle.');
assert.match(indexHtml, /assets\/index-[^"]+\.css/, 'H5 index should reference a hashed CSS bundle.');

const assetFiles = readdirSync(assetRoot);
const jsBundle = assetFiles.find((file) => /^index-.*\.js$/.test(file));
const cssBundle = assetFiles.find((file) => /^index-.*\.css$/.test(file));
const heroAsset = assetFiles.find((file) => /^d20-hero-premium-.*\.png$/.test(file));

assert.ok(jsBundle, 'H5 JS bundle should exist.');
assert.ok(cssBundle, 'H5 CSS bundle should exist.');
assert.ok(heroAsset, 'H5 should bundle the premium transparent d20 asset.');

const js = readFileSync(join(assetRoot, jsBundle), 'utf8');
const css = readFileSync(join(assetRoot, cssBundle), 'utf8');
const combined = `${indexHtml}\n${js}\n${css}`;

[
  'DiceForge',
  'Generate',
  'Recent',
  'Reroll',
  'Copy Text',
  'Preview Poster',
  'die-throw-path',
  'die-spin-settle',
  'd20-hero-premium'
].forEach((marker) => {
  assert.ok(combined.includes(marker), `H5 bundle should include ${marker}.`);
});

[
  'Save Poster',
  'Poster ready',
  'dice-spin',
  'd20-hero-cutout',
  'd20-hero-source-green'
].forEach((marker) => {
  assert.ok(!combined.includes(marker), `H5 bundle should not include ${marker}.`);
});

const legacyStaticLeaks = [
  join(h5Root, 'static', 'd20-hero.png'),
  join(h5Root, 'static', 'd20-hero-cutout.png'),
  join(h5Root, 'static', 'd20-hero-source-green.png')
].filter((file) => existsSync(file));
assert.deepEqual(legacyStaticLeaks, [], 'H5 output should not copy legacy/intermediate d20 images.');

const heroStats = statSync(join(assetRoot, heroAsset));
assert.ok(heroStats.size > 100_000, 'Premium d20 asset should not be an empty placeholder.');

console.log('H5 smoke passed.');
