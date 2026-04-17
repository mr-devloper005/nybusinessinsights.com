import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ArticlePreviewPage() {
  return (
    <PageShell
      title="Article Preview"
      description="A quick look at your draft before publishing."
      actions={
        <Button variant="outline" asChild>
          <Link href="/dashboard/articles/new">Back to Editor</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-foreground">Draft Title</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This is a placeholder preview. Use this page to confirm layout, typography, and spacing.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  )
}
