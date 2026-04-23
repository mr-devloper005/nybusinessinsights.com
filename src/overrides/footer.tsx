import type { ReactNode } from 'react'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteIdentity } from '@/config/site.identity'

export const FOOTER_OVERRIDE_ENABLED = true

const primaryTask = SITE_CONFIG.tasks.find((t) => t.enabled) || SITE_CONFIG.tasks[0]

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-200 transition hover:border-lime-400/60 hover:text-lime-300"
    >
      {children}
    </Link>
  )
}

export function FooterOverride() {
  const domain = siteIdentity.domain
  const infoEmail = `info@${domain}`
  const pressEmail = `press@${domain}`

  return (
    <footer className="border-t border-white/10 bg-[#05060a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 className="max-w-xl text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
              Maximizing reach for independent reporting and syndicated articles.
            </h2>
            <div className="mt-8 max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold text-zinc-200">Become a distribution partner</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Pitch your desk, licensing model, or regional bundle. We reply within two business days.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 hover:bg-lime-300"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:items-end lg:text-right">
            <div className="space-y-2 text-sm text-zinc-400">
              <p>
                <a href={`mailto:${infoEmail}`} className="text-zinc-200 hover:text-lime-300">
                  {infoEmail}
                </a>
              </p>
              <p>
                <a href={`mailto:${pressEmail}`} className="text-zinc-200 hover:text-lime-300">
                  {pressEmail}
                </a>
              </p>
              <p className="max-w-xs lg:ml-auto">Editorial &amp; distribution — New York desk, remote contributors worldwide.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10"
              >
                Guest post
              </Link>
              <Link
                href={primaryTask?.route || '/archive'}
                className="rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-zinc-950 hover:bg-lime-300"
              >
                Read latest
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#11131d] ring-1 ring-white/10 sm:h-[4.5rem] sm:w-[4.5rem]">
              <img
                src="/favicon.png"
                alt=""
                width={72}
                height={72}
                className="h-full w-full object-contain p-1.5"
                decoding="async"
              />
            </span>
            <p className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
              {SITE_CONFIG.name}
            </p>
          </div>
          <div className="flex gap-3">
            <SocialIcon href="https://twitter.com" label="X">
              <span className="text-xs font-black">𝕏</span>
            </SocialIcon>
            <SocialIcon href="https://instagram.com" label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://tiktok.com" label="TikTok">
              <span className="text-[10px] font-black">TT</span>
            </SocialIcon>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-lime-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-lime-300">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-lime-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
