import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";

export const revalidate = 3;

export const generateMetadata = () => buildTaskMetadata("org");

export default function TeamPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="org" category={searchParams?.category} />;
}
