import type { TaskKey } from "./site-config";
import type { SitePost } from "./site-connector";

const taskSeeds: Record<TaskKey, string> = {
  listing: "listing",
  classified: "classified",
  article: "article",
  image: "image",
  profile: "profile",
  social: "social",
  pdf: "pdf",
  org: "org",
  sbm: "sbm",
  comment: "comment",
  mediaDistribution: "media-distribution",
};

const taskTitles: Record<TaskKey, string[]> = {
  listing: [
    "Urban Coffee Studio",
    "Growth Labs Agency",
    "Northside Fitness",
    "PixelCraft Design",
    "Prime Auto Care",
  ],
  classified: [
    "Used MacBook Pro 16",
    "Studio Space for Rent",
    "Hiring Frontend Developer",
    "Weekend Photography Gig",
    "City Center Apartment",
  ],
  article: [
    "Scaling Local SEO in 2026",
    "The Future of Directory Sites",
    "Design Systems for Multi-Site",
    "From MVP to Marketplace",
    "Content Ops That Ship Fast",
  ],
  image: [
    "Golden Hour Interiors",
    "Mountain Trail Series",
    "Studio Portrait Set",
    "Neon Night Market",
    "Minimal Workspace",
  ],
  profile: [
    "Aisha Khan",
    "Rohan Patel",
    "Studio R&R",
    "Team Northwind",
    "Maya Desai",
  ],
  social: [
    "Community Launch Update",
    "Collab Request: Designers",
    "Weekly Trend Digest",
    "New Partnerships Announced",
    "Creator Spotlight Series",
  ],
  pdf: [
    "Local SEO Playbook",
    "Marketplace UX Guide",
    "Outbound Sales Template",
    "Agency Pricing Deck",
    "SaaS Metrics Cheatsheet",
  ],
  org: [
    "Northwind Collective",
    "Brightline Media",
    "Atlas Labs",
    "Cobalt Studio",
    "Zenith Partners",
  ],
  sbm: [
    "SEO Checklist 2026",
    "Directory Growth Tactics",
    "Backlink Outreach Vault",
    "AI Writing Tools List",
    "Local Listing Audit",
  ],
  comment: [
    "Reply: Agency Growth Stack",
    "Commentary: Link Building",
    "Response: Listing Quality",
    "Thread: SEO Experiments",
    "Hot Take: Directory UX",
  ],
  mediaDistribution: [
    "Regional Partnership Expansion Announced",
    "Quarterly Product Update Released to Press",
    "Industry Event Participation Confirmed",
    "Leadership Statement on Market Growth",
    "New Service Rollout Now Live",
  ],
};

const taskCategories: Record<TaskKey, string[]> = {
  listing: ["Marketing", "Tech", "Design", "Fitness", "Automotive"],
  classified: ["Jobs", "Real Estate", "Services", "Gigs", "Market"],
  article: ["Strategy", "SEO", "Product", "Growth", "Ops"],
  image: ["Lifestyle", "Travel", "Studio", "Urban", "Minimal"],
  profile: ["Founder", "Creator", "Agency", "Team", "Consultant"],
  social: ["Community", "News", "Updates", "Events", "Insights"],
  pdf: ["Guides", "Playbooks", "Templates", "Reports", "Docs"],
  org: ["Agency", "Studio", "Collective", "Partner", "Network"],
  sbm: ["Bookmarks", "Tools", "Resources", "SEO", "Research"],
  comment: ["Opinion", "Reply", "Discussion", "Feedback", "Debate"],
  mediaDistribution: ["Business", "Technology", "Science", "Entertainment", "Industry"],
};

const summaryByTask: Record<TaskKey, string> = {
  listing: "Verified business listing with trusted details.",
  classified: "Fresh deal posted by a verified seller.",
  article: "Long-form insight from industry experts.",
  image: "Curated visual story and gallery.",
  profile: "Featured creator profile and highlights.",
  social: "Community update and engagement thread.",
  pdf: "Downloadable resource for your team.",
  org: "Organization spotlight and services.",
  sbm: "Curated bookmark collection entry.",
  comment: "Response post with perspective and context.",
  mediaDistribution: "Published newsroom update with a clear summary and press-style framing.",
};

const randomFrom = (items: string[], index: number) =>
  items[index % items.length];

const buildImage = (task: TaskKey, index: number) =>
  `https://picsum.photos/seed/${taskSeeds[task]}-${index}/1200/800`;

export const getMockPostsForTask = (task: TaskKey): SitePost[] => {
  return Array.from({ length: 5 }).map((_, index) => {
    const title = taskTitles[task][index];
    const category = randomFrom(taskCategories[task], index);
    const slug = `${title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      id: `${task}-mock-${index + 1}`,
      title,
      slug,
      summary: summaryByTask[task],
      content: {
        type: task,
        category,
        location: "Delhi",
        description: summaryByTask[task],
        website: "https://example.com",
        phone: "+91-9999999999",
      },
      media: [{ url: buildImage(task, index), type: "IMAGE" }],
      tags: [task, category],
      authorName: "Site Master Pro",
      publishedAt: new Date().toISOString(),
    };
  });
};
