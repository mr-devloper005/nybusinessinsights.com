import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("profile", {
    path: "/profile",
    title: taskPageMetadata.profile.title,
    description: taskPageMetadata.profile.description,
  });

export default function ProfilePage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="profile" category={searchParams?.category} />;
}
