export const CATEGORY_OPTIONS: Array<{ name: string; slug: string }> = [
  { name: "Business", slug: "business" },
  { name: "Health", slug: "health" },
  { name: "Technology", slug: "technology" },
  { name: "Real Estate", slug: "real-estate" },
  { name: "Home Improvement", slug: "home-improvement" },
  { name: "Automotive", slug: "automotive" },
  { name: "Travel", slug: "travel" },
  { name: "Blog", slug: "blog" },
  { name: "Shopping", slug: "shopping" },
  { name: "Service", slug: "service" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Beauty", slug: "beauty" },
  { name: "Pet & Animal", slug: "pet-animal" },
  { name: "Food", slug: "food" },
  { name: "Furniture", slug: "furniture" },
  { name: "Electric", slug: "electric" },
  { name: "Jobs & Payroll", slug: "jobs-payroll" },
  { name: "Finance", slug: "finance" },
  { name: "Crypto", slug: "crypto" },
  { name: "Casino", slug: "casino" },
  { name: "CBD", slug: "cbd" },
  { name: "Social Media", slug: "social-media" },
  { name: "Game & Sports", slug: "game-sports" },
  { name: "Arts", slug: "arts" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Shipping & Transportation", slug: "shipping-transportation" },
  { name: "Education", slug: "education" },
  { name: "Family & Parenting", slug: "family-parenting" },
  { name: "Law & Legal", slug: "law-legal" },
  { name: "Fashion", slug: "fashion" },
  { name: "Photography", slug: "photography" },
  { name: "Adult", slug: "adult" },
  { name: "Event", slug: "event" },
  { name: "Digital", slug: "digital" },
  { name: "News", slug: "news" },
  { name: "V News Media", slug: "v-news-media" },
  { name: "Vefogix Media Agency", slug: "vefogix-media-agency" },
  { name: "Vefogix Media News", slug: "vefogix-media-news" },
  { name: "Industry & Manufacturing", slug: "industry-manufacturing" },
];

const allowed = new Set(
  CATEGORY_OPTIONS.flatMap((item) => [item.slug.toLowerCase(), item.name.toLowerCase()])
);

export const isValidCategory = (value: string) =>
  allowed.has(value.trim().toLowerCase());

export const normalizeCategory = (value: string) => {
  const normalized = value.trim().toLowerCase();
  const match = CATEGORY_OPTIONS.find(
    (item) =>
      item.slug.toLowerCase() === normalized ||
      item.name.toLowerCase() === normalized
  );
  return match?.slug || normalized;
};
