import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardSettingsPage() {
  return (
    <PageShell
      title="Dashboard Settings"
      description="Manage your account and notification preferences."
      actions={
        <Button asChild>
          <Link href="/settings/profile">Edit Profile</Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Update email, password, and profile details.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/settings">Manage Account</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="mt-2 text-sm text-muted-foreground">Control how you receive activity updates.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/notifications">View Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
