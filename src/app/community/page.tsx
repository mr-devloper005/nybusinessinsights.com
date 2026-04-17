import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";

export const revalidate = 3;
export const generateMetadata = () => buildTaskMetadata("social");

export default function CommunityPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="social" category={searchParams?.category} />;
}
