import { describe, expect, it } from 'vitest'
import {
  buildExportCardSvg,
  buildExportFailureMessage,
  buildExportFileName,
  buildPngExportFileName
} from '../common/exportCard.js'

describe('export card', () => {
  it('builds a downloadable svg card with escaped generated content', () => {
    const svg = buildExportCardSvg({
      name: 'Aesyl & <Thas>',
      realmLabel: 'Elf Names',
      alignment: 'Holy'
    })

    expect(svg).toContain('<svg')
    expect(svg).toContain('Aesyl &amp; &lt;Thas&gt;')
    expect(svg).toContain('Elf Names · Holy')
    expect(svg).toContain('MythosGen')
    expect(svg).not.toContain('Aesyl & <Thas>')
  })

  it('builds a stable safe file name', () => {
    expect(buildExportFileName('Aesyl Thas!')).toBe('mythosgen-aesyl-thas.svg')
  })

  it('builds a stable png file name for creator exports', () => {
    expect(buildPngExportFileName('Vortex Lumina!')).toBe('mythosgen-vortex-lumina.png')
  })

  it('returns a clear fallback message when image export is unavailable', () => {
    expect(buildExportFailureMessage('png')).toBe('PNG export is unavailable here. SVG download is still ready.')
  })
})
