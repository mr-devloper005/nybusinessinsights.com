"use client";

import { useMemo, useState, type CSSProperties, type ImgHTMLAttributes } from "react";

const PLACEHOLDER = "/placeholder.svg?height=900&width=1400";

type ContentImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string;
  alt: string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
};

export function ContentImage({
  src,
  alt,
  fill,
  className,
  style,
  sizes,
  loading,
  fetchPriority,
  priority,
  intrinsicWidth,
  intrinsicHeight,
  ...props
}: ContentImageProps) {
  const initialSrc = typeof src === "string" && src.trim() ? src : PLACEHOLDER;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  const width = intrinsicWidth ?? (fill ? 1600 : 800);
  const height = intrinsicHeight ?? (fill ? 900 : 600);

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

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={resolvedStyle}
      sizes={sizes}
      loading={priority ? "eager" : loading || "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : fetchPriority || "auto"}
      onError={() => {
        if (currentSrc !== PLACEHOLDER) {
          setCurrentSrc(PLACEHOLDER);
        }
      }}
    />
  );
}
