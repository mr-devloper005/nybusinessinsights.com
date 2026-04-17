import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteContent } from '@/config/site.content'

export function CTASection() {
  return (
    <section className="pb-24 pt-12 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(110,26,55,0.14)] bg-[linear-gradient(135deg,rgba(110,26,55,0.98),rgba(63,18,31,0.98)_55%,rgba(114,186,169,0.9)_160%)] p-8 text-white shadow-[0_30px_90px_rgba(66,24,34,0.22)] sm:p-12 lg:p-16">
          <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.16) 0, transparent 26%, transparent 74%, rgba(255,255,255,0.1) 100%)' }} />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/88">
              <Sparkles className="h-4 w-4 text-[#D5E7B5]" />
              {siteContent.cta.badge}
            </div>

            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {siteContent.cta.title}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              {siteContent.cta.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 rounded-full bg-[#D5E7B5] px-7 text-sm font-semibold text-[#24161b] hover:bg-[#c5db9b]">
                <Link href={siteContent.cta.primaryCta.href}>
                  {siteContent.cta.primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 rounded-full border-white/20 bg-white/8 px-7 text-sm font-semibold text-white hover:bg-white/12 hover:text-white">
                <Link href={siteContent.cta.secondaryCta.href}>{siteContent.cta.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
