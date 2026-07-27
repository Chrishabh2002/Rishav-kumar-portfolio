"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

/**
 * Renders an organisation's real logo. Falls back to an Iconify glyph if the
 * image ever fails to load, so a broken asset never leaves an empty tile.
 */
export default function CompanyLogo({
  src,
  alt,
  fallbackIcon = "mdi:domain",
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`grid place-items-center ${className}`}>
        <Icon icon={fallbackIcon} className="w-2/3 h-2/3 text-cyan-300" />
      </span>
    );
  }

  return (
    <span className={`grid place-items-center overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${alt} logo`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`w-full h-full object-contain ${imgClassName}`}
      />
    </span>
  );
}
