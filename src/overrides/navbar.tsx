'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

export const NAVBAR_OVERRIDE_ENABLED = true

const utilityLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Contact Us', href: '/contact' },
]

export function NavbarOverride() {
  return (
    <header className="border-b border-neutral-200 bg-white text-neutral-800">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-4 gap-y-1 px-4 py-3 text-[13px] sm:px-6">
          {utilityLinks.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-black">{item.label}</Link>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <Link href="/" className="text-5xl font-black uppercase tracking-[0.18em] text-black sm:text-6xl" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
          {SITE_CONFIG.name}
        </Link>
      </div>
      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-4 text-sm uppercase tracking-[0.08em] sm:px-6">
          <Link href="/" className="text-[#4a90ff]">Home</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
          <Link href="/search" className="hover:text-black"><Search className="h-4 w-4" /></Link>
        </div>
      </div>
    </header>
  )
}
