import { redirect } from "next/navigation";

export const revalidate = 3;

export default async function PdfDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  redirect(`/pdf/${resolvedParams.slug}`);
}
