import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('shortlist remove action uses a clear remove icon instead of a checkmark', () => {
  const source = readFileSync(resolve('src/components/ShortlistScreen.vue'), 'utf8')

  assert.match(source, /class="remove-cell"/)
  assert.match(source, /:aria-label="ui\.shortlist\.removeAria"/)
  assert.doesNotMatch(source, /class="check-cell"/)
  assert.doesNotMatch(source, />✓<\/button>/)
})

test('bottom tabbar uses a bookmark shortlist icon with stable accessible labels', () => {
  const source = readFileSync(resolve('src/components/TabBar.vue'), 'utf8')
  const styles = readFileSync(resolve('src/styles/app.css'), 'utf8')

  assert.match(source, /:aria-label="item\.label"/)
  assert.match(source, /:class="\['tab-icon', `tab-icon-\$\{item\.id\}`\]"/)
  assert.match(source, /id: 'shortlist', label: this\.ui\.tabs\.shortlist, icon: ''/)
  assert.match(styles, /\.tab-icon-shortlist::before\s*\{/)
  assert.match(styles, /clip-path:\s*polygon\(0 0,\s*100% 0,\s*100% 100%,\s*50% 76%,\s*0 100%\)/)
  assert.doesNotMatch(source, /id: 'shortlist', label: 'Shortlist', icon: '▱'/)
  assert.doesNotMatch(source, /id: 'shortlist', label: 'Shortlist', icon: '☷'/)
})
