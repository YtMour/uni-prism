import { describe, expect, it } from 'vitest'
import { REALM_CONTROL_STYLE } from '../common/controlStyle.js'

describe('realm control style tokens', () => {
  it('uses one outer track and equally rounded inner segments', () => {
    expect(REALM_CONTROL_STYLE).toEqual({
      trackRadiusRpx: 26,
      segmentRadiusRpx: 16,
      segmentGapRpx: 8,
      usesInternalDividers: false,
      segmentsFillTrack: true
    })
  })
})
