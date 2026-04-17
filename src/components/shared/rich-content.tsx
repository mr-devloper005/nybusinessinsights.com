import { cn } from "@/lib/utils";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

export const formatRichHtml = (raw?: string | null, fallback = "Details coming soon.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) {
    return sanitizeRichHtml(source);
  }

  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

const baseClasses =
  "article-content prose prose-slate max-w-none text-base leading-7 prose-p:my-4 prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-strong:font-semibold prose-h2:my-7 prose-h2:text-3xl prose-h2:font-bold prose-h2:leading-tight prose-h3:my-5 prose-h3:text-2xl prose-h3:font-semibold prose-h3:leading-tight prose-ul:my-5 prose-ol:my-5 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4";

export function RichContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return <article className={cn(baseClasses, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
