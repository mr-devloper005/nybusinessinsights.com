"use client";

import { useMemo, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContentImageProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "aria-label" | "aria-hidden"> & {
  src?: string;
  alt: string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

/** Visual surface only — no network images (site-wide text-first layout). */
export function ContentImage({
  src: _src,
  alt,
  fill,
  className,
  style,
  priority: _priority,
  intrinsicWidth: _intrinsicWidth,
  intrinsicHeight: _intrinsicHeight,
  sizes: _sizes,
  loading: _loading,
  fetchPriority: _fetchPriority,
  ...rest
}: ContentImageProps) {
  const resolvedStyle = useMemo<CSSProperties>(() => {
    if (!fill) return style || {};
    return {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      ...style,
    };
  }, [fill, style]);

  const decorative = !alt.trim();
  return (
    <div
      {...rest}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : alt}
      className={cn(
        "pointer-events-none select-none bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950",
        className,
      )}
      style={resolvedStyle}
    />
  );
}
