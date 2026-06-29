const CARD_WIDTH = 1200
const CARD_HEIGHT = 1500

export function buildExportFileName(name) {
  return `${buildExportSlug(name)}.svg`
}

export function buildPngExportFileName(name) {
  return `${buildExportSlug(name)}.png`
}

export function buildExportFailureMessage(format = 'image') {
  const label = String(format || 'image').toUpperCase()
  return `${label} export is unavailable here. SVG download is still ready.`
}

function buildExportSlug(name) {
  const slug = String(name || 'name')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'name'
  return `mythosgen-${slug}`
}

export function buildExportCardSvg({ name, realmLabel, alignment, brand = 'MythosGen' }) {
  const safeName = escapeXml(name)
  const safeMeta = escapeXml(`${realmLabel} · ${alignment}`)
  const safeBrand = escapeXml(brand)

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">`,
    '<rect width="1200" height="1500" fill="#FBF9F5"/>',
    '<rect x="76" y="76" width="1048" height="1348" rx="18" fill="none" stroke="#E7E1D8" stroke-width="3"/>',
    '<path d="M150 180H250M150 180V280M150 180C168 190 178 202 184 224" fill="none" stroke="#D7A94A" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M1050 1320H950M1050 1320V1220M1050 1320C1032 1310 1022 1298 1016 1276" fill="none" stroke="#D7A94A" stroke-width="5" stroke-linecap="round"/>',
    `<text x="600" y="700" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="#1C1A27">${safeName}</text>`,
    `<text x="600" y="780" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="34" fill="#77727D">${safeMeta}</text>`,
    `<text x="600" y="860" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="34" fill="#77727D">${safeBrand}</text>`,
    '</svg>'
  ].join('')
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
