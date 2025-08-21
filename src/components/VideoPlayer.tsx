// /src/components/VideoPlayer.tsx
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Source = { src: string; type?: string; label?: string };

type VendorFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullScreen?: () => void;
  msRequestFullscreen?: () => void;
};

type Props = {
  sources: Source[];
  className?: string;
  stallTimeoutMs?: number;
  showQualitySelector?: boolean;
  autoFullscreenOnMobile?: boolean;
  /** 自動用第一幀當封面（預設 true） */
  posterFromFirstFrame?: boolean;
  /** 若影片放在 CDN，且你有開 CORS，設 true 會加上 crossOrigin="anonymous" */
  useCrossOriginForPoster?: boolean;
};

export default function VideoPlayer({
  sources,
  className,
  stallTimeoutMs = 6000,
  showQualitySelector = true,
  autoFullscreenOnMobile = true,
  posterFromFirstFrame = true,
  useCrossOriginForPoster = false,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posterDoneRef = useRef(false); // 只擷取一次

  const labels = useMemo(
    () =>
      sources.map((s) => {
        if (s.label) return s.label;
        const u = s.src;
        if (u.includes("-480")) return "480p";
        if (u.includes("-720")) return "720p";
        return "原画质";
      }),
    [sources]
  );

  const nonStdInline = {
    "webkit-playsinline": "true",
    "x5-playsinline": "true",
  } as Record<string, string>;

  const current = sources[idx];

  const tryFallback = useCallback(
    (reason: string) => {
      if (idx + 1 >= sources.length) {
        setNote("目前來源無法播放，請稍後重試或切換網路。");
        return;
      }
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setNote(`播放異常（${reason}），已自動切換：${labels[nextIdx]}`);
    },
    [idx, labels, sources.length]
  );

  const armTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => tryFallback("載入逾時"), stallTimeoutMs);
  }, [stallTimeoutMs, tryFallback]);

  // 切換來源時重置
  useEffect(() => {
    armTimer();
    setPosterUrl(undefined);
    posterDoneRef.current = false;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [armTimer, current?.src]);

  // 事件：成功 or 失敗
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onOK = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNote(null);
    };
    const onBad = () => tryFallback("播放錯誤/停滯");

    v.addEventListener("loadeddata", onOK);
    v.addEventListener("canplay", onOK);
    v.addEventListener("canplaythrough", onOK);
    v.addEventListener("stalled", onBad);
    v.addEventListener("error", onBad);
    v.addEventListener("emptied", onBad);

    return () => {
      v.removeEventListener("loadeddata", onOK);
      v.removeEventListener("canplay", onOK);
      v.removeEventListener("canplaythrough", onOK);
      v.removeEventListener("stalled", onBad);
      v.removeEventListener("error", onBad);
      v.removeEventListener("emptied", onBad);
    };
  }, [tryFallback]);

  // 用第一幀（實際上 0.2s）當封面
  useEffect(() => {
    if (!posterFromFirstFrame) return;
    const v = videoRef.current;
    if (!v) return;

    // 將某一幀畫到 canvas 並回傳 base64
    const capture = () => {
      if (posterDoneRef.current) return;
      if (v.videoWidth === 0 || v.videoHeight === 0) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL("image/jpeg", 0.8);
        setPosterUrl(url);          // 用 state 綁定 poster，瀏覽器會立即更新
        posterDoneRef.current = true;
      } catch {
        // 若為跨網域且無 CORS，會失敗；此時只能不顯示 poster（或改用靜態圖）
      }
    };

    // 策略：loadedmetadata 後先 seek 到 0.2s，等 seeked 再擷取，避免黑幀
    const onMeta = () => {
      if (posterDoneRef.current) return;
      const t = Math.min(0.2, Math.max(0.05, (v.duration || 1) * 0.01));
      const seekAndGrab = () => {
        v.removeEventListener("seeked", seekAndGrab);
        capture();
      };
      v.addEventListener("seeked", seekAndGrab, { once: true });
      try {
        v.currentTime = t;
      } catch {
        // 有些瀏覽器不允許立即 seek，退回 loadeddata 擷取
        v.removeEventListener("seeked", seekAndGrab);
        capture();
      }
    };

    // 後備：若 metadata 已就緒，直接觸發；否則等事件
    if (v.readyState >= 1) {
      onMeta();
    } else {
      v.addEventListener("loadedmetadata", onMeta, { once: true });
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }
  }, [posterFromFirstFrame, current?.src]);

  // 手機自動全螢幕（手勢觸發 play）
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    const byUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || "");
    const byWidth = window.matchMedia?.("(max-width: 639px)").matches ?? false;
    return byUA || byWidth;
  };

  useEffect(() => {
    if (!autoFullscreenOnMobile) return;
    const v = videoRef.current as VendorFullscreenVideo | null;
    if (!v) return;

    const handlePlay = async () => {
      if (!isMobile()) return;
      try {
        if (typeof v.webkitEnterFullscreen === "function") { v.webkitEnterFullscreen(); return; }
        if (document.fullscreenElement == null && typeof v.requestFullscreen === "function") { await v.requestFullscreen(); return; }
        if (typeof v.webkitRequestFullScreen === "function") { v.webkitRequestFullScreen(); return; }
        if (typeof v.msRequestFullscreen === "function") { v.msRequestFullscreen(); return; }
      } catch { /* ignore */ }
    };

    v.addEventListener("play", handlePlay);
    return () => v.removeEventListener("play", handlePlay);
  }, [autoFullscreenOnMobile]);

  const changeQuality = useCallback(
    (i: number) => {
      if (i === idx) return;
      setIdx(i);
      setNote(null);
      setPosterUrl(undefined);
      posterDoneRef.current = false;

      const v = videoRef.current;
      if (v) {
        const wasPlaying = !v.paused;
        v.load();
        if (wasPlaying) void v.play().catch(() => {});
      }
    },
    [idx]
  );

  if (!current) return null;

  return (
    <div className="w-full">
      <video
        key={`${idx}-${current.src}`}
        ref={videoRef}
        controls
        preload="metadata"
        playsInline
        {...(useCrossOriginForPoster ? { crossOrigin: "anonymous" as const } : {})}
        {...nonStdInline}
        poster={posterUrl}
        className={["w-full rounded-lg shadow", className].filter(Boolean).join(" ")}
        style={{ touchAction: "manipulation" }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <source src={current.src} type={current.type ?? "video/mp4"} />
        您的瀏覽器不支援 HTML5 影片。
      </video>

      {note && <p className="mt-2 text-sm text-amber-700">{note}</p>}

      {showQualitySelector && (
        <div className="mt-2 flex flex-wrap gap-2">
          {labels.map((lb, i) => (
            <button
              key={i}
              onClick={() => changeQuality(i)}
              className={[
                "px-3 py-1.5 rounded-full text-sm border",
                i === idx
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-800 border-gray-300 hover:border-emerald-400",
              ].join(" ")}
              aria-pressed={i === idx}
            >
              {lb}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
