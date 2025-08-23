"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Source = { src: string; type?: string };

type VendorFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  x5ExitFullScreen?: () => void;
};

type Props = {
  source: Source;
  className?: string;
  stallTimeoutMs?: number;
  autoFullscreenOnMobile?: boolean;
  /** 自動用第一幀當封面（預設 true） */
  posterFromFirstFrame?: boolean;
  /** 若影片放在 CDN，且你有開 CORS，設 true 會加上 crossOrigin="anonymous" */
  useCrossOriginForPoster?: boolean;
};

export default function VideoPlayer({
  source,
  className,
  stallTimeoutMs = 6000,
  autoFullscreenOnMobile = true,
  posterFromFirstFrame = true,
  useCrossOriginForPoster = false,
}: Props) {
  const [note, setNote] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posterDoneRef = useRef(false);

  const nonStdInline = {
    playsInline: true,
    "webkit-playsinline": "true",
    "x5-playsinline": "true",
    "x5-video-player-type": "h5",
    "x5-video-player-fullscreen": "false",
    "x5-video-orientation": "portrait",
  } as const;

  const tryFallback = useCallback(
    (reason: string) => {
      setNote(`播放异常（${reason}），请稍后重试或切换网络。`);
    },
    []
  );

  const armTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => tryFallback("加载超时"), stallTimeoutMs);
  }, [stallTimeoutMs, tryFallback]);

  useEffect(() => {
    armTimer();
    setPosterUrl(undefined);
    posterDoneRef.current = false;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [armTimer, source?.src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onOK = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNote(null);
    };
    const onBad = () => tryFallback("播放错误或卡顿");

    v.addEventListener("loadeddata", onOK);
    v.addEventListener("canplay", onOK);
    v.addEventListener("canplaythrough", onOK);
    v.addEventListener("stalled", onBad);
    v.addEventListener("error", onBad);
    v.addEventListener("emptied", onBad);
    v.addEventListener("waiting", onBad);

    return () => {
      v.removeEventListener("loadeddata", onOK);
      v.removeEventListener("canplay", onOK);
      v.removeEventListener("canplaythrough", onOK);
      v.removeEventListener("stalled", onBad);
      v.removeEventListener("error", onBad);
      v.removeEventListener("emptied", onBad);
      v.removeEventListener("waiting", onBad);
    };
  }, [tryFallback]);

  useEffect(() => {
    if (!posterFromFirstFrame) return;
    const v = videoRef.current;
    if (!v) return;

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
        const url = canvas.toDataURL("image/jpeg", 0.7);
        setPosterUrl(url);
        posterDoneRef.current = true;
      } catch {
        // 跨域問題或瀏覽器限制，直接略過
      }
    };

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
        v.removeEventListener("seeked", seekAndGrab);
        capture();
      }
    };

    if (v.readyState >= 1) {
      onMeta();
    } else {
      v.addEventListener("loadedmetadata", onMeta, { once: true });
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }
  }, [posterFromFirstFrame, source?.src]);

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    const byUA = /iPhone|iPad|iPod|Android|UCBrowser|QQBrowser|SogouMobileBrowser|Baidu/i.test(
      navigator.userAgent || ""
    );
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
        if (typeof v.webkitEnterFullscreen === "function") {
          v.webkitEnterFullscreen();
          return;
        }
        if (document.fullscreenElement == null && typeof v.requestFullscreen === "function") {
          await v.requestFullscreen();
          return;
        }
        if (typeof v.webkitRequestFullScreen === "function") {
          v.webkitRequestFullScreen();
          return;
        }
        if (typeof v.msRequestFullscreen === "function") {
          v.msRequestFullscreen();
          return;
        }
        if (typeof v.mozRequestFullScreen === "function") {
          v.mozRequestFullScreen();
          return;
        }
      } catch {
        // 忽略全螢幕失敗
      }
    };

    v.addEventListener("play", handlePlay);
    return () => v.removeEventListener("play", handlePlay);
  }, [autoFullscreenOnMobile]);

  if (!source) return null;

  return (
    <div className="w-full">
      <video
        key={source.src}
        ref={videoRef}
        controls
        preload="metadata"
        {...nonStdInline}
        {...(useCrossOriginForPoster ? { crossOrigin: "anonymous" as const } : {})}
        poster={posterUrl}
        className={["w-full rounded-lg shadow", className].filter(Boolean).join(" ")}
        style={{ touchAction: "manipulation" }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <source
          src={source.src}
          type={source.type ?? "video/mp4"}
        />
        您的浏览器不支持 HTML5 视频播放。
      </video>

      {note && <p className="mt-2 text-sm text-amber-700">{note}</p>}
    </div>
  );
}