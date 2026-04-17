import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const licenses = [
  { name: 'Next.js', description: 'MIT License' },
  { name: 'React', description: 'MIT License' },
  { name: 'Tailwind CSS', description: 'MIT License' },
]

export default function LicensesPage() {
  return (
    <PageShell
      title="Licenses"
      description="Open source licenses and acknowledgements."
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-3">
          {licenses.map((license) => (
            <div key={license.name} className="rounded-lg border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{license.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{license.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}
