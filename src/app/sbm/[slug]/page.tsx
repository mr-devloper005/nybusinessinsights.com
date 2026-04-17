import { TaskDetailPage } from "@/components/tasks/task-detail-page";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";

export const revalidate = 3;

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("sbm", 50);
  if (!posts.length) {
    return [{ slug: "placeholder" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("sbm", resolvedParams.slug);
  return post ? await buildPostMetadata("sbm", post) : await buildTaskMetadata("sbm");
}

export default async function BookmarkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <TaskDetailPage task="sbm" slug={resolvedParams.slug} />;
}
