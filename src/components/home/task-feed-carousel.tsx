"use client";

import type { SitePost } from "@/lib/site-connector";
import type { TaskConfig } from "@/lib/site-config";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";

export function TaskFeedCarousel({
  task,
  posts,
}: {
  task: TaskConfig;
  posts: SitePost[];
}) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 snap-x snap-mandatory">
        {posts.slice(0, 4).map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className={
              task.key === "article"
                ? "snap-start flex-[0_0_290px] sm:flex-[0_0_360px] lg:flex-[0_0_420px]"
                : task.key === "image"
                  ? "snap-start flex-[0_0_240px] sm:flex-[0_0_280px] lg:flex-[0_0_320px]"
                  : task.key === "pdf"
                    ? "snap-start flex-[0_0_220px] sm:flex-[0_0_250px] lg:flex-[0_0_280px]"
                    : task.key === "classified"
                      ? "snap-start flex-[0_0_280px] sm:flex-[0_0_320px] lg:flex-[0_0_360px]"
                      : "snap-start flex-[0_0_260px] sm:flex-[0_0_300px] lg:flex-[0_0_340px]"
            }
          >
            <TaskPostCard
              post={post}
              taskKey={task.key}
              href={buildPostUrl(task.key, post.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
