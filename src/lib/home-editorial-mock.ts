import type { SitePost } from '@/lib/site-connector'

/** Rich placeholder posts for the editorial home until the CMS feed is wired. No images — text only. */
const MOCK_ENTRIES: Array<{ title: string; category: string; summary: string }> = [
  {
    title: 'Regional Partnership Expansion Announced',
    category: 'Business',
    summary:
      'We are opening three new collaboration corridors this quarter. The roadmap prioritizes shared editorial standards, faster handoffs between teams, and a single source of truth for announcements. Partners can expect clearer timelines, named contacts, and weekly office hours for escalations.',
  },
  {
    title: 'Quarterly Product Update Released to Press',
    category: 'Product',
    summary:
      'This release tightens publishing workflows, improves draft visibility for approvers, and adds structured fields for compliance notes. Editorial leads asked for fewer clicks between review and publish; we reduced that path by half while keeping audit trails intact.',
  },
  {
    title: 'Industry Event Participation Confirmed',
    category: 'Events',
    summary:
      'Our team will host a walkthrough of the newsroom stack and a live Q&A on content governance. Sessions are designed for operators who manage high-volume updates without sacrificing accuracy. Registration opens next week with limited seats for hands-on labs.',
  },
  {
    title: 'Leadership Statement on Market Growth',
    category: 'Leadership',
    summary:
      'Growth this year reflects disciplined investment in distribution infrastructure rather than chasing vanity metrics. We are doubling down on reader trust, transparent sourcing, and measurable outcomes for partners who rely on this channel for critical updates.',
  },
  {
    title: 'New Service Rollout Now Live',
    category: 'Operations',
    summary:
      'The rollout introduces tiered publishing roles, scheduled embargo windows, and automated sanity checks before go-live. Early adopters reported shorter incident response times and fewer manual corrections during peak traffic windows.',
  },
  {
    title: 'Editorial Guidelines Refresh for 2026',
    category: 'Editorial',
    summary:
      'Headlines must stand alone in feeds; dekks are optional but encouraged for complex stories. We clarified voice rules for crisis coverage, attribution for third-party data, and when to run corrections versus silent fixes. The full guide lives in the team wiki with printable checklists.',
  },
  {
    title: 'Data Privacy Review Completed',
    category: 'Compliance',
    summary:
      'External counsel signed off on retention schedules, export procedures, and regional carve-outs. Product and legal aligned on a single dashboard for requests so support teams do not need to switch tools during time-sensitive inquiries.',
  },
  {
    title: 'Community Feedback Integration Sprint',
    category: 'Community',
    summary:
      'We synthesized five hundred inbound notes into twelve themes. The sprint produced quick wins for navigation clarity and a longer bet on personalized digests. Thank-you responses went to everyone who left contact details.',
  },
  {
    title: 'Infrastructure Hardening Ahead of Peak Season',
    category: 'Technology',
    summary:
      'Caching layers were reshaped to isolate hot documents, and we added circuit breakers around optional enrichments. Load tests simulated three times last year’s peak with acceptable latency budgets and zero data loss in failover drills.',
  },
  {
    title: 'Year in Review: What Readers Engaged With Most',
    category: 'Insights',
    summary:
      'Long explainers outperformed short alerts on time-on-page, while bullet briefing formats won on return visits. The lesson is not one format to rule them all—it is matching depth to intent and signing posts clearly so audiences know what they are opening.',
  },
  {
    title: 'Sustainability Report: Operations and Footprint',
    category: 'Impact',
    summary:
      'Energy use per published story dropped after batching builds and tightening preview sandboxes. Travel policy now defaults to virtual briefings unless on-site verification is essential. Suppliers received a scored checklist covering labor and materials traceability.',
  },
  {
    title: 'Accessibility Audit: Wins and Remaining Gaps',
    category: 'Accessibility',
    summary:
      'Keyboard flows passed on primary templates; color contrast issues were fixed on alert banners. Remaining work focuses on embedded third-party widgets and ensuring skip links stay stable when dynamic promos load. Fixes are ticketed with owners and dates.',
  },
  {
    title: 'Newsletter Relaunch With Smarter Segments',
    category: 'Audience',
    summary:
      'Segments now respect frequency caps and topic affinity instead of blasting the full list. Welcome paths introduce beat preferences early. Early metrics show higher confirmation rates and fewer one-star inbox feedback comments.',
  },
  {
    title: 'Security Bulletin: Credential Rotation Complete',
    category: 'Security',
    summary:
      'All integration keys were rotated after the scheduled maintenance window. No customer action is required. We added anomaly alerts on auth failure spikes and documented rollback steps for on-call engineers in the runbook appendix.',
  },
  {
    title: 'Field Notes: Reporting From the Regional Desk',
    category: 'Field',
    summary:
      'Correspondents filed dispatches under tighter word limits with mandatory context sidebars. Editors tested a “why this matters now” line atop each piece; focus groups said it helped casual readers stay oriented without feeling talked down to.',
  },
  {
    title: 'Benchmarks: How We Compare to Sector Averages',
    category: 'Research',
    summary:
      'We are ahead on median time-to-publish for breaking items and slightly behind on multimedia attach rate by design. The gap is intentional while we keep pages lightweight. Quarterly reviews will revisit when bandwidth and rights workflows mature.',
  },
]

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getHomeEditorialMockPosts(): SitePost[] {
  return MOCK_ENTRIES.map((entry, index) => {
    const slug = `${slugify(entry.title)}-mock-${index + 1}`
    return {
      id: `home-editorial-mock-${index + 1}`,
      title: entry.title,
      slug,
      summary: entry.summary,
      content: {
        type: 'mediaDistribution',
        category: entry.category,
        description: entry.summary,
      },
      media: [],
      tags: ['mediaDistribution', entry.category],
      authorName: 'Editorial desk',
      publishedAt: new Date(Date.now() - index * 86400000 * 3).toISOString(),
    }
  })
}

/** Real posts first (capped), then mocks by slug until `maxTotal` — swap mocks out later when the feed is full. */
export function mergeEditorialPostsForHome(real: SitePost[], mocks: SitePost[], maxTotal = 16): SitePost[] {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const p of real) {
    if (out.length >= maxTotal) break
    if (!seen.has(p.slug)) {
      seen.add(p.slug)
      out.push(p)
    }
  }
  for (const m of mocks) {
    if (out.length >= maxTotal) break
    if (!seen.has(m.slug)) {
      seen.add(m.slug)
      out.push(m)
    }
  }
  return out
}
