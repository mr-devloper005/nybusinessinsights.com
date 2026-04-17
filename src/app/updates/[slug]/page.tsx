import { TaskDetailPage } from '@/components/tasks/task-detail-page'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'

export const revalidate = 3

export async function generateStaticParams() {
  const posts = await fetchTaskPosts('mediaDistribution', 50)
  if (!posts.length) return [{ slug: 'placeholder' }]
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await fetchTaskPostBySlug('mediaDistribution', resolvedParams.slug)
  return post ? await buildPostMetadata('mediaDistribution', post) : await buildTaskMetadata('mediaDistribution')
}

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <TaskDetailPage task="mediaDistribution" slug={resolvedParams.slug} />
}
