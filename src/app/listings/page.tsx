import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("listing", {
    path: "/listings",
    title: taskPageMetadata.listing.title,
    description: taskPageMetadata.listing.description,
  });

export default function ListingsPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="listing" category={searchParams?.category} />;
}
