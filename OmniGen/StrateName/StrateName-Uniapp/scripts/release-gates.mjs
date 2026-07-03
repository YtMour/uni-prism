function countValue(counts, key) {
  return Number(counts?.[key] || 0)
}

function fixKind(fixAvailable) {
  if (!fixAvailable) return 'none'
  if (fixAvailable?.isSemVerMajor) return 'semver-major'
  if (fixAvailable === true) return 'available'
  return 'available'
}

function viaLabels(via = []) {
  return via.map((item) => {
    if (typeof item === 'string') return item
    return item.title || item.name || item.dependency || 'advisory'
  })
}

export function evaluateManualReviewGate(manualSample, signoff) {
  const sampleSize = Number(manualSample?.sampleSize || 0)
  const expectedSize = 100

  if (sampleSize < expectedSize) {
    return {
      id: 'human-review',
      status: 'fail',
      detail: `Manual review sample is incomplete: ${sampleSize}/${expectedSize} candidates prepared.`
    }
  }

  if (!signoff) {
    return {
      id: 'human-review',
      status: 'blocked',
      detail: `${sampleSize} candidates prepared; manual signoff missing. Create reports/manual-review-signoff.json from the template.`
    }
  }

  const status = String(signoff.status || '').trim().toLowerCase()
  const reviewer = String(signoff.reviewer || '').trim()
  const reviewedAt = String(signoff.reviewedAt || '').trim()
  const reviewedCount = Number(signoff.reviewedCount || 0)
  const rejectedCount = Number(signoff.rejectedCount || 0)

  if (status !== 'approved') {
    return {
      id: 'human-review',
      status: 'blocked',
      detail: `Manual review status is "${status || 'missing'}"; release requires approved signoff.`
    }
  }

  if (!reviewer || !reviewedAt) {
    return {
      id: 'human-review',
      status: 'blocked',
      detail: 'Manual review signoff is missing reviewer or reviewedAt.'
    }
  }

  if (reviewedCount < sampleSize) {
    return {
      id: 'human-review',
      status: 'blocked',
      detail: `${reviewedCount}/${sampleSize} reviewed; every sampled candidate must be checked.`
    }
  }

  if (rejectedCount > 0) {
    return {
      id: 'human-review',
      status: 'fail',
      detail: `${rejectedCount} sampled candidates were rejected by human review.`
    }
  }

  return {
    id: 'human-review',
    status: 'pass',
    detail: `${reviewedCount}/${sampleSize} reviewed and approved by ${reviewer} on ${reviewedAt}.`
  }
}

export function summarizeDependencyAudit(auditReport = {}) {
  const vulnerabilities = auditReport.vulnerabilities || {}
  const counts = auditReport.metadata?.vulnerabilities || {}
  const packages = Object.values(vulnerabilities).map((entry) => ({
    name: entry.name,
    severity: entry.severity,
    isDirect: Boolean(entry.isDirect),
    via: viaLabels(entry.via),
    fix: fixKind(entry.fixAvailable)
  })).sort((a, b) => {
    if (a.isDirect !== b.isDirect) return a.isDirect ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  const total = countValue(counts, 'total')
  const critical = countValue(counts, 'critical')
  const high = countValue(counts, 'high')
  const moderate = countValue(counts, 'moderate')
  const directPackages = packages.filter((item) => item.isDirect).map((item) => item.name)
  const semverMajorRequired = packages.some((item) => item.fix === 'semver-major')
  const status = critical > 0 ? 'fail' : total > 0 ? 'risk' : 'pass'
  const recommendation = status === 'pass'
    ? 'No npm audit vulnerabilities reported.'
    : semverMajorRequired
      ? 'Do not run npm audit fix --force blindly; validate the uni-app/Vite major upgrade chain in a separate branch.'
      : 'Apply available non-major fixes in a controlled branch and rerun build/smoke checks.'

  return {
    status,
    counts: {
      moderate,
      high,
      critical,
      total
    },
    directPackages,
    transitiveCount: Math.max(0, packages.length - directPackages.length),
    semverMajorRequired,
    packages,
    recommendation
  }
}

export function formatDependencyRiskMarkdown(summary) {
  const packageRows = summary.packages.map((item) => {
    return `| ${item.name} | ${item.severity} | ${item.isDirect ? 'direct' : 'transitive'} | ${item.fix} | ${item.via.slice(0, 3).join('; ')} |`
  })

  return [
    '# StrateName Dependency Risk Report',
    '',
    `Status: ${summary.status}`,
    '',
    `Counts: ${summary.counts.moderate} moderate, ${summary.counts.high} high, ${summary.counts.critical} critical, ${summary.counts.total} total.`,
    '',
    `Direct vulnerable packages: ${summary.directPackages.length ? summary.directPackages.join(', ') : 'None'}.`,
    '',
    `Semver-major fix required: ${summary.semverMajorRequired ? 'yes' : 'no'}.`,
    '',
    `Recommendation: ${summary.recommendation}`,
    '',
    '| Package | Severity | Scope | Fix | Via |',
    '| --- | --- | --- | --- | --- |',
    ...packageRows,
    ''
  ].join('\n')
}
