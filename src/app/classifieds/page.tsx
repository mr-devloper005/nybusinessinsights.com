import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("classified", {
    path: "/classifieds",
    title: taskPageMetadata.classified.title,
    description: taskPageMetadata.classified.description,
  });

export default function ClassifiedsPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="classified" category={searchParams?.category} />;
}
