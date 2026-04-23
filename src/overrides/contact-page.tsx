import Link from 'next/link'
import { FileText, Mail, MessageSquare, PenLine, Send } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteIdentity } from '@/config/site.identity'

export const CONTACT_PAGE_OVERRIDE_ENABLED = true

const primaryTask = SITE_CONFIG.tasks.find((t) => t.enabled) || SITE_CONFIG.tasks[0]

export function ContactPageOverride() {
  const domain = siteIdentity.domain
  const editorialEmail = `editor@${domain}`
  const generalEmail = `contact@${domain}`

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c0e16] to-[#07080d] py-16 sm:py-20">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">Guest posts &amp; desk</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Contact
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Pitch a guest post, request a correction, or ask about syndication. We route every note to the right editor—no forms required, just clear email.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${editorialEmail}?subject=Guest%20post%20pitch`}
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 shadow-[0_0_28px_rgba(190,242,100,0.2)] hover:bg-lime-300"
              >
                <PenLine className="h-4 w-4" />
                Email a pitch
              </a>
              <Link
                href={primaryTask?.route || '/archive'}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4" />
                Browse archive
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            <a
              href={`mailto:${editorialEmail}`}
              className="group rounded-[1.75rem] border border-white/10 bg-[#11131d] p-8 transition hover:border-lime-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/15 text-lime-300">
                <MessageSquare className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-xl font-black uppercase tracking-tight text-white">Editorial desk</h2>
              <p className="mt-2 text-sm text-zinc-500">Stories, fact-checks, bylines, syndication</p>
              <p className="mt-6 break-all text-lg font-semibold text-lime-300 group-hover:underline">{editorialEmail}</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Put <span className="font-mono text-zinc-300">GUEST POST</span> or <span className="font-mono text-zinc-300">CORRECTION</span> in the subject so we triage faster.
              </p>
            </a>

            <a
              href={`mailto:${generalEmail}`}
              className="group rounded-[1.75rem] border border-white/10 bg-[#11131d] p-8 transition hover:border-lime-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-200">
                <Mail className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-xl font-black uppercase tracking-tight text-white">General enquiries</h2>
              <p className="mt-2 text-sm text-zinc-500">Partnerships, permissions, billing</p>
              <p className="mt-6 break-all text-lg font-semibold text-white group-hover:underline">{generalEmail}</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                For legal or formal notices, include links and references in the first message—we reply within two business days when possible.
              </p>
            </a>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-[#0f111a] p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
                  <Send className="h-4 w-4" />
                  What to include
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-zinc-400">
                  <li className="flex gap-2">
                    <span className="text-lime-400">—</span>
                    Working headline and 2–3 sentence angle for guest posts.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lime-400">—</span>
                    Link to the published piece plus the exact paragraph for corrections.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lime-400">—</span>
                    Your byline as you want it to appear, and any disclosure or COI text.
                  </li>
                </ul>
              </div>
              <div className="max-w-sm rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-zinc-400">
                <p className="font-semibold text-zinc-200">Desk hours</p>
                <p className="mt-2">We read inbound mail daily. Urgent corrections are prioritized same day when flagged in the subject line.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
