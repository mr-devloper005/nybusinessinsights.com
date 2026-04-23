'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, PenLine, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export const NAVBAR_OVERRIDE_ENABLED = true

const primaryTask = SITE_CONFIG.tasks.find((t) => t.enabled) || SITE_CONFIG.tasks[0]

const navPills = [
  { label: 'Home', href: '/' },
  { label: 'Archive', href: primaryTask?.route || '/archive' },
  { label: 'Search', href: '/search?master=1' },
  { label: 'Contact', href: '/contact' },
]

export function NavbarOverride() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07080d]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#11131d] ring-1 ring-white/10">
            <img
              src="/favicon.png"
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
              decoding="async"
            />
            <span className="sr-only">{SITE_CONFIG.name} home</span>
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-lime-300/90">Media desk</span>
            <span className="block text-sm font-bold uppercase tracking-[0.12em]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navPills.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                  active ? 'bg-lime-400 text-zinc-950' : 'text-zinc-300 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search?master=1"
            className="hidden rounded-full border border-white/15 p-2.5 text-zinc-200 hover:border-lime-400/50 hover:text-white sm:inline-flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href={primaryTask?.route || '/archive'}
            className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10 sm:inline-flex"
          >
            Latest
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-zinc-950 shadow-[0_0_24px_rgba(190,242,100,0.25)] hover:bg-lime-300"
          >
            <PenLine className="h-3.5 w-3.5" />
            Guest post
          </Link>
          <button
            type="button"
            className="inline-flex rounded-full border border-white/15 p-2 text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0b0d14] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navPills.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-lime-300 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Guest post
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
