"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentImage } from "@/components/shared/content-image";
import { SITE_CONFIG, type TaskConfig } from "@/lib/site-config";
import { siteContent } from "@/config/site.content";
import { SITE_THEME } from "@/config/site.theme";

const FALLBACK_IMAGE = "/placeholder.svg?height=1400&width=2400";

const heroClasses = {
  'search-first': {
    section: 'border-b border-slate-200 bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_42%,#ffffff_100%)] text-slate-950',
    overlay: 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.12),transparent_26%)]',
    grid: 'lg:grid-cols-[1.08fr_0.92fr]',
    card: 'border border-white/70 bg-white/80 shadow-[0_28px_90px_rgba(15,23,42,0.12)]',
    title: 'text-slate-950',
    body: 'text-slate-600',
    badge: 'bg-slate-950 text-white',
    primary: 'bg-slate-950 text-white hover:bg-slate-800',
    secondary: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100',
  },
  'spotlight-split': {
    section: 'border-b border-[rgba(123,72,35,0.14)] bg-[linear-gradient(180deg,#1f1613_0%,#2d1d17_50%,#fff7ed_100%)] text-white',
    overlay: 'bg-[linear-gradient(90deg,rgba(20,12,9,0.88)_0%,rgba(32,19,14,0.66)_45%,rgba(255,247,237,0)_100%)]',
    grid: 'lg:grid-cols-[1.14fr_0.86fr]',
    card: 'border border-white/10 bg-white/8 shadow-[0_28px_100px_rgba(18,9,4,0.4)] backdrop-blur-md',
    title: 'text-white',
    body: 'text-amber-100/78',
    badge: 'bg-[#ffdd9c] text-[#2a160c]',
    primary: 'bg-[#ffdd9c] text-[#2a160c] hover:bg-[#ffd17d]',
    secondary: 'border border-white/18 bg-white/10 text-white hover:bg-white/16',
  },
  'gallery-mosaic': {
    section: 'border-b border-slate-800 bg-[linear-gradient(180deg,#07111f_0%,#0c172b_45%,#101c31_100%)] text-white',
    overlay: 'bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.16),transparent_26%)]',
    grid: 'lg:grid-cols-[0.95fr_1.05fr]',
    card: 'border border-white/10 bg-slate-900/65 shadow-[0_30px_110px_rgba(15,23,42,0.45)] backdrop-blur-xl',
    title: 'text-white',
    body: 'text-slate-300',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    primary: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    secondary: 'border border-white/18 bg-white/6 text-white hover:bg-white/12',
  },
  'catalog-promo': {
    section: 'border-b border-[rgba(66,74,42,0.14)] bg-[linear-gradient(180deg,#f6f6ee_0%,#f4f7df_35%,#ffffff_100%)] text-[#18210f]',
    overlay: 'bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.16),transparent_22%),radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_24%)]',
    grid: 'lg:grid-cols-[1.12fr_0.88fr]',
    card: 'border border-[#dce5c2] bg-white/90 shadow-[0_28px_80px_rgba(64,76,34,0.12)]',
    title: 'text-[#18210f]',
    body: 'text-[#5c684b]',
    badge: 'bg-[#18210f] text-[#ebf5d9]',
    primary: 'bg-[#18210f] text-[#ebf5d9] hover:bg-[#25331a]',
    secondary: 'border border-[#dce5c2] bg-white text-[#18210f] hover:bg-[#f4f7df]',
  },
} as const;

export function HeroSection({ images, tasks }: { images: string[]; tasks: TaskConfig[] }) {
  const slides = useMemo(() => {
    const valid = images.filter(Boolean);
    return valid.length ? valid.slice(0, 4) : [FALLBACK_IMAGE];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const primaryTask = tasks.find((task) => task.key === SITE_THEME.home.primaryTask) || tasks[0];
  const featuredTasks = tasks.filter((task) => SITE_THEME.home.featuredTaskKeys.includes(task.key)).slice(0, 3);
  const palette = heroClasses[SITE_THEME.hero.variant];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides]);

  return (
    <section className={`relative overflow-hidden ${palette.section}`}>
      <div className="absolute inset-0">
        <ContentImage
          key={slides[activeIndex]}
          src={slides[activeIndex]}
          alt={`Featured visual ${activeIndex + 1} from ${SITE_CONFIG.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
          intrinsicWidth={1600}
          intrinsicHeight={900}
        />
      </div>
      <div className={`absolute inset-0 ${palette.overlay}`} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className={`grid items-center gap-12 ${palette.grid}`}>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${palette.badge}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {SITE_THEME.hero.eyebrow}
            </div>
            <h1 className={`mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${palette.title}`}>
              {siteContent.hero.title[0]} <span className="block opacity-90">{siteContent.hero.title[1]}</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 sm:text-lg ${palette.body}`}>{siteContent.hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className={`rounded-full px-6 ${palette.primary}`}>
                <Link href={siteContent.hero.primaryCta.href}>
                  {siteContent.hero.primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={`rounded-full px-6 ${palette.secondary}`}>
                <Link href={siteContent.hero.secondaryCta.href}>{siteContent.hero.secondaryCta.label}</Link>
              </Button>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              <div className={`flex items-center gap-3 rounded-[1.6rem] p-4 ${palette.card}`}>
                <div className="rounded-full bg-white/10 p-3 text-current">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">Primary task</p>
                  <p className="mt-1 text-lg font-semibold">{primaryTask?.label || SITE_CONFIG.name}</p>
                  <p className="mt-1 text-sm opacity-75">{primaryTask?.description}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 rounded-[1.6rem] p-4 ${palette.card}`}>
                <div className="rounded-full bg-white/10 p-3 text-current">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">Explore flow</p>
                  <p className="mt-1 text-lg font-semibold">{featuredTasks.length} highlighted surfaces</p>
                  <p className="mt-1 text-sm opacity-75">Built for discovery without repeating the same layout rhythm.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`overflow-hidden rounded-[2rem] p-4 sm:p-5 ${palette.card}`}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] sm:min-h-[280px]">
                  <ContentImage
                    src={slides[(activeIndex + 1) % slides.length] || slides[0]}
                    alt={`Supporting visual from ${SITE_CONFIG.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    intrinsicWidth={1000}
                    intrinsicHeight={1200}
                  />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  {featuredTasks.map((task, index) => (
                    <div key={task.key} className="rounded-[1.4rem] border border-white/10 bg-black/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-65">Lane {index + 1}</p>
                          <p className="mt-2 text-xl font-semibold">{task.label}</p>
                        </div>
                        <Star className="h-4 w-4 opacity-70" />
                      </div>
                      <p className="mt-3 text-sm leading-6 opacity-75">{task.description}</p>
                      <Link href={task.route} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
                        Open section
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {slides.length > 1 ? (
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-10 bg-primary' : 'w-2.5 bg-current/30'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
