import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export const CONTACT_PAGE_OVERRIDE_ENABLED = true

export function ContactPageOverride() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavbarShell />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold uppercase tracking-[0.04em]">Contact Us</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-700">For editorial questions, announcement requests, corrections, or publishing enquiries, use the contact details below or reply through your existing author account.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="border border-neutral-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Editorial desk</p>
            <p className="mt-4 text-lg font-semibold">editor@example.com</p>
          </div>
          <div className="border border-neutral-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">General enquiries</p>
            <p className="mt-4 text-lg font-semibold">contact@example.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
