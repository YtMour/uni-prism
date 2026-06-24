import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'

const html = await readFile(new URL('../preview/index.html', import.meta.url), 'utf8')

describe('static preview smoke', () => {
  it('renders the current app shell and main views', () => {
    assert.match(html, /<main class="screen">/)
    assert.match(html, /data-view="home"/)
    assert.match(html, /data-view="travel"/)
    assert.match(html, /data-view="settings"/)
    assert.match(html, /RateLens/)
  })

  it('keeps the preview free of old phone-shell and fake status bar containers', () => {
    assert.doesNotMatch(html, /class="[^"]*\bphone\b/)
    assert.doesNotMatch(html, /class="[^"]*\bstatus-bar\b/)
    assert.doesNotMatch(html, /class="status"/)
    assert.doesNotMatch(html, /class="[^"]*\sstatus"/)
  })

  it('contains key clickable flows for conversion, travel, and offline state', () => {
    assert.match(html, /id="base-menu"/)
    assert.match(html, /data-base-select/)
    assert.match(html, /id="target-menu"/)
    assert.match(html, /data-target-select/)
    assert.match(html, /id="swap"/)
    assert.match(html, /id="result-value"/)
    assert.match(html, /id="travel-menu"/)
    assert.match(html, /data-travel-select/)
    assert.match(html, /id="top-left"/)
    assert.match(html, /aria-label', canGoBack \? t\('common\.back'\) : t\('common\.settings'\)/)
    assert.match(html, /data-tip="15"/)
    assert.match(html, /data-people="-1"/)
    assert.match(html, /data-toggle-offline/)
  })

  it('opens explicit settings pickers instead of cycling key preferences', () => {
    assert.match(html, /data-settings-mode="\$\{action\}"/)
    assert.match(html, /data-base-setting="\$\{currency\.code\}"/)
    assert.match(html, /data-watched-setting="\$\{currency\.code\}"/)
    assert.match(html, /data-language-select="\$\{locale\}"/)
    assert.match(html, /Australian Dollar/)
    assert.match(html, /Singapore Dollar/)
    assert.match(html, /South Korean Won/)
    assert.match(html, /Thai Baht/)
    assert.match(html, /澳元/)
    assert.match(html, /新加坡元/)
    assert.match(html, /韩元/)
    assert.match(html, /泰铢/)
    assert.doesNotMatch(html, /data-language-toggle/)
    assert.doesNotMatch(html, /languages\[\(languages\.indexOf\(state\.locale\) \+ 1\) % languages\.length\]/)
  })

  it('contains English and Simplified Chinese i18n resources and locale-aware formatting', () => {
    assert.match(html, /'en-US'/)
    assert.match(html, /'zh-CN'/)
    assert.match(html, /Simplified Chinese/)
    assert.match(html, /换算/)
    assert.match(html, /旅行默认值/)
    assert.match(html, /税费/)
    assert.match(html, /免责声明/)
    assert.match(html, /new Intl\.NumberFormat\(state\.locale/)
    assert.ok(html.includes("replace(/\\{(\\w+)\\}/g"))
  })

  it('contains privacy policy and disclaimer detail content', () => {
    assert.match(html, /Privacy Policy/)
    assert.match(html, /隐私政策/)
    assert.match(html, /Local-first calculations/)
    assert.match(html, /Cached exchange rates/)
    assert.match(html, /Disclaimer/)
    assert.match(html, /免责声明/)
    assert.match(html, /Estimate-only rates/)
    assert.match(html, /No financial advice/)
  })

  it('uses the same tax-then-tip travel order as the product spec', () => {
    assert.match(html, /const taxedSubtotal = bill\(\) \* \(1 \+ state\.tax \/ 100\)/)
    assert.match(html, /const total = taxedSubtotal \* \(1 \+ state\.tip \/ 100\)/)
    assert.match(html, /Approx\. CNY 369\.41 per person/)
  })
})
