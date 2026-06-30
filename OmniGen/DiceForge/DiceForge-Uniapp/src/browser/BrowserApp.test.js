import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { test } from 'node:test';

const source = readFileSync(new URL('./BrowserApp.vue', import.meta.url), 'utf8');
const heroDieSource = readFileSync(new URL('./components/HeroDie.vue', import.meta.url), 'utf8');
const uniPageSource = readFileSync(new URL('../pages/index/index.vue', import.meta.url), 'utf8');
const rootUniPageSource = readFileSync(new URL('../../pages/index/index.vue', import.meta.url), 'utf8');
const heroDiePng = readFileSync(new URL('../../static/d20-hero-premium.png', import.meta.url));

function readRgbaPng(buffer) {
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8;
  let width = 0;
  let height = 0;
  const idatChunks = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      assert.equal(data[8], 8, 'hero die PNG must use 8-bit color');
      assert.equal(data[9], 6, 'hero die PNG must be RGBA');
    }
    if (type === 'IDAT') idatChunks.push(data);
    if (type === 'IEND') break;
    offset += length + 12;
  }

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(idatChunks));
  const pixels = Buffer.alloc(width * height * bytesPerPixel);
  let rawOffset = 0;
  let pixelOffset = 0;
  const paeth = (left, up, upLeft) => {
    const estimate = left + up - upLeft;
    const leftDistance = Math.abs(estimate - left);
    const upDistance = Math.abs(estimate - up);
    const upLeftDistance = Math.abs(estimate - upLeft);
    if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
    if (upDistance <= upLeftDistance) return up;
    return upLeft;
  };
  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const current = raw[rawOffset + x];
      const left = x >= bytesPerPixel ? pixels[pixelOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[pixelOffset + x - stride] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[pixelOffset + x - stride - bytesPerPixel] : 0;
      let value = current;
      if (filter === 1) value = current + left;
      if (filter === 2) value = current + up;
      if (filter === 3) value = current + Math.floor((left + up) / 2);
      if (filter === 4) value = current + paeth(left, up, upLeft);
      pixels[pixelOffset + x] = value & 0xff;
    }
    rawOffset += stride;
    pixelOffset += stride;
  }
  return {
    width,
    height,
    alphaAt(x, y) {
      return pixels[(y * width + x) * bytesPerPixel + 3];
    }
  };
}

test('browser verification app exposes every mobile design state', () => {
  [
    'data-view="home"',
    'data-view="generating"',
    'data-view="character"',
    'data-view="reroll-sheet"',
    'data-view="export-text"',
    'data-view="export-poster"',
    'data-view="recent"'
  ].forEach((marker) => {
    assert.ok(source.includes(marker), `${marker} should exist`);
  });
});

test('browser verification app keeps the central die as an interactive visual object', () => {
  assert.ok(source.includes('<HeroDie :forging="isGenerating" @forge="forgeCharacter" />'));
  assert.ok(heroDieSource.includes('class="hero-die"'));
  assert.ok(heroDieSource.includes('class="die-core"'));
  assert.ok(heroDieSource.includes('class="die-spinner"'));
  assert.ok(heroDieSource.includes('class="die-art"'));
  assert.ok(heroDieSource.includes('/static/d20-hero-premium.png'));
  assert.ok(heroDieSource.includes('die-ground-shadow'));
  assert.ok(heroDieSource.includes('@keyframes die-throw-path'));
  assert.ok(heroDieSource.includes('@keyframes die-spin-settle'));
  assert.ok(heroDieSource.includes('@keyframes aura-forge-pulse'));
  assert.ok(heroDieSource.includes('@keyframes shadow-forge-pulse'));
});

test('browser verification app carries the mobile design visual anchors', () => {
  [
    'ornate-top-bar',
    'parchment-texture',
    'ornate-frame',
    'paper-vignette',
    'stat-divider',
    'radio-dot',
    'seed-toggle',
    'Apply Reroll'
  ].forEach((marker) => {
    assert.ok(source.includes(marker), `${marker} should exist`);
  });
});

test('browser verification app constrains recent preview and die presentation', () => {
  [
    '.recent-preview .ghost-button',
    '<h2>Recent</h2>',
    'width: 100%;',
  ].forEach((marker) => {
    assert.ok(source.includes(marker), `${marker} should exist`);
  });
  assert.ok(heroDieSource.includes('d20-hero-premium.png'));
  assert.ok(heroDieSource.includes('object-fit: contain'));
});

test('browser verification app does not distort the hero die artwork', () => {
  assert.ok(heroDieSource.includes('aspect-ratio: 1 / 1'));
  assert.ok(heroDieSource.includes('--die-y-offset'));
  assert.ok(!heroDieSource.includes('/static/icons/icon-d20.png'));
  assert.ok(!heroDieSource.includes('/static/d20-hero-cutout.png'));
  assert.ok(!heroDieSource.includes('.die-core::before'));
  assert.ok(!heroDieSource.includes('mix-blend-mode: soft-light'));
  assert.ok(!heroDieSource.includes('width: calc(100% + 16px)'));
  assert.ok(!heroDieSource.includes('drop-shadow(0 22px'));
  assert.ok(!heroDieSource.includes('rotate(390deg)'));
  assert.ok(!heroDieSource.includes('die-toss'));
  assert.ok(!heroDieSource.includes('rotate(-2deg)'));
  assert.ok(!heroDieSource.includes('rotate(2deg)'));
  assert.ok(!source.includes('d20-art'));
  assert.ok(!source.includes('d20-core'));
});

test('hero die uses a forge roll animation instead of a shake', () => {
  [
    'animation: die-throw-path',
    'animation: die-spin-settle',
    'animation: aura-forge-pulse',
    'animation: shadow-forge-pulse',
    'translate3d(-64%, -70%, 0)',
    'translate3d(-38%, -54%, 0)',
    'rotate(234deg)',
    'rotate(-54deg)',
    'scaleX(0.58)',
    '.hero-die:focus-visible .arcane-ring'
  ].forEach((marker) => {
    assert.ok(heroDieSource.includes(marker), `${marker} should exist`);
  });
  assert.ok(heroDieSource.includes('outline: none'));
  assert.ok(!heroDieSource.includes('rotateX('));
  assert.ok(!heroDieSource.includes('rotateY('));
});

test('hero die premium asset has transparent background and intact body', () => {
  const png = readRgbaPng(heroDiePng);
  assert.deepEqual([png.width, png.height], [1254, 1254]);

  [
    [0, 0],
    [20, 20],
    [1253, 0],
    [0, 1253],
    [1253, 1253],
    [120, 620],
    [1130, 620]
  ].forEach(([x, y]) => {
    assert.equal(png.alphaAt(x, y), 0, `background at ${x},${y} must be transparent`);
  });

  [
    [627, 265],
    [627, 627],
    [275, 555],
    [978, 555],
    [627, 1120]
  ].forEach(([x, y]) => {
    assert.ok(png.alphaAt(x, y) >= 180, `die body at ${x},${y} must remain opaque`);
  });
});

test('browser verification app resets scroll when changing screens', () => {
  [
    'ref="screenScroll"',
    'scrollToTop()',
    'this.$nextTick'
  ].forEach((marker) => {
    assert.ok(source.includes(marker), `${marker} should exist`);
  });
});

test('MVP export flow does not promise fake poster saving', () => {
  [source, uniPageSource, rootUniPageSource].forEach((content) => {
    assert.ok(!content.includes('Save Poster'));
    assert.ok(!content.includes('Poster ready'));
    assert.ok(!content.includes('savePoster()'));
  });
  assert.ok(source.includes('Copy Text'));
  assert.ok(source.includes('Preview Poster'));
});

test('UniApp pages use the premium d20 instead of the legacy CSS die', () => {
  [uniPageSource, rootUniPageSource].forEach((content) => {
    assert.ok(content.includes('/static/d20-hero-premium.png'));
    assert.ok(content.includes('die-throw-path'));
    assert.ok(content.includes('die-spin-settle'));
    assert.ok(!content.includes('class="d20-core"'));
    assert.ok(!content.includes('@keyframes dice-spin'));
    assert.ok(!content.includes('rotate(390deg)'));
  });
});

test('release gate scripts are checked into the app project', () => {
  [
    '../../scripts/clean-output.mjs',
    '../../scripts/smoke-h5.mjs',
    '../../scripts/audit-release.mjs',
    '../../scripts/assess-release.mjs'
  ].forEach((scriptPath) => {
    assert.ok(existsSync(new URL(scriptPath, import.meta.url)), `${scriptPath} should exist`);
  });
});

test('package scripts expose a release assessment command', () => {
  const packageJson = readFileSync(new URL('../../package.json', import.meta.url), 'utf8');
  assert.ok(packageJson.includes('"assess:release": "node scripts/assess-release.mjs"'));
  assert.ok(packageJson.includes('npm run assess:release'));
});
