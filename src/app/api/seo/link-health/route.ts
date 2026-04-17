import { NextResponse } from "next/server";

import { fetchSiteFeed } from "@/lib/site-connector";
import { SITE_CONFIG } from "@/lib/site-config";
import { extractOutboundLinksFromPost, runLinkHealthChecks } from "@/lib/link-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limit = Math.max(1, Math.min(Number(searchParams.get("limit") || 120), 1000));
  const maxLinks = Math.max(1, Math.min(Number(searchParams.get("maxLinks") || 200), 1000));
  const timeoutMs = Math.max(1000, Math.min(Number(searchParams.get("timeoutMs") || 8000), 30000));
  const concurrency = Math.max(1, Math.min(Number(searchParams.get("concurrency") || 6), 20));

  const feed = await fetchSiteFeed(limit, { fresh: true });
  if (!feed?.posts?.length) {
    return NextResponse.json(
      {
        success: false,
        message: "No posts available for link health check.",
      },
      { status: 404 }
    );
  }

  const baseOrigin = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const candidates = feed.posts.flatMap((post) => extractOutboundLinksFromPost(post, baseOrigin));
  const checked = await runLinkHealthChecks(candidates, { maxLinks, timeoutMs, concurrency });

  const broken = checked.filter((item) => !item.ok);
  const healthy = checked.filter((item) => item.ok);

  return NextResponse.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      scannedPosts: feed.posts.length,
      discoveredOutboundLinks: candidates.length,
      uniqueCheckedLinks: checked.length,
      healthyCount: healthy.length,
      brokenCount: broken.length,
      broken,
      healthy,
    },
  });
}
