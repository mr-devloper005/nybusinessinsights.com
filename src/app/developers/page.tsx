import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";

export const revalidate = 3;
export const generateMetadata = () => buildTaskMetadata("pdf");

export default function PdfLibraryPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="pdf" category={searchParams?.category} />;
}
