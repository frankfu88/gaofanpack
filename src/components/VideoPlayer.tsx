// /src/components/VideoPlayer.tsx
"use client";
import React from "react";

type Source = { src: string; type?: string };

type Props = {
  sources: Source[];
  poster?: string;
  className?: string;
  /** 額外傳給 <video> 的屬性（可選） */
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
};

/**
 * 穩定的行動端影片播放器：
 * - controls + preload="metadata"
 * - playsInline，並附帶微信/QQ X5 內核相容屬性（以物件展開方式避免 TS/ESLint 警告）
 * - 支援 poster、多來源 <source>，瀏覽器會自動挑可播的來源
 */
export default function VideoPlayer({
  sources,
  poster,
  className,
  videoProps,
}: Props) {
  const nonStandardInlineAttrs = {
    // 非標準但對微信/QQ X5 內核有用的屬性，透過物件展開避免型別錯誤
    "webkit-playsinline": "true",
    "x5-playsinline": "true",
  } as Record<string, string>;

  return (
    <video
      controls
      preload="metadata"
      playsInline
      {...nonStandardInlineAttrs}
      poster={poster}
      className={["w-full rounded-lg shadow", className].filter(Boolean).join(" ")}
      {...videoProps}
    >
      {sources.map((s, i) => (
        <source key={i} src={s.src} type={s.type ?? "video/mp4"} />
      ))}
      您的瀏覽器不支援 HTML5 影片。
    </video>
  );
}
