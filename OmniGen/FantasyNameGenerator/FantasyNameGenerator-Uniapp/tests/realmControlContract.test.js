import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

describe('realm control event contract', () => {
  it('uses an explicit select-realm event instead of the ambiguous change event', () => {
    const component = fs.readFileSync(
      path.join(root, 'components/mythos/RealmControl.vue'),
      'utf8'
    )
    const page = fs.readFileSync(path.join(root, 'pages/index/index.vue'), 'utf8')

    expect(component).toContain('@tap="selectRealm(realm.id)"')
    expect(component).toContain("this.$emit('select-realm', realmId)")
    expect(component).toContain("emits: ['select-realm']")
    expect(component).not.toContain("$emit('change'")
    expect(page).toContain('@select-realm="setRealm"')
    expect(page).not.toContain('@change="setRealm"')
  })
})
