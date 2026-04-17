import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("image", {
    path: "/images",
    title: taskPageMetadata.image.title,
    description: taskPageMetadata.image.description,
  });

export default function ImageSharingPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="image" category={searchParams?.category} />;
}
