/* eslint-disable */
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Source = { src: string; type?: string; label?: string };

type VendorFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  requestFullscreen?: () => void;
  x5EnterFullscreen?: () => void;
  baiduEnterFullscreen?: () => void;
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

// 增強的瀏覽器檢測
const detectBrowser = (): string => {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes("metasr") || ua.includes("sogou")) return "sogou";
  if (ua.includes("qqbrowser") || ua.includes("mqqbrowser")) return "qq";
  if (ua.includes("ucbrowser") || ua.includes("ucweb") || ua.includes("ubrowser")) return "uc";
  if (ua.includes("baidubrowser") || ua.includes("baiduboxapp")) return "baidu";
  if (ua.includes("micromessenger")) return "wechat";
  if (ua.includes("qq/")) return "qq_app";
  
  if (ua.includes("miuibrowser")) return "miui";
  if (ua.includes("huaweibrowser")) return "huawei";
  if (ua.includes("oppobrowser")) return "oppo";
  if (ua.includes("vivobrowser")) return "vivo";
  if (ua.includes("360se") || ua.includes("360ee")) return "360";
  
  if (ua.includes("android")) return "android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "ios";
  return "standard";
};

// 錯誤追蹤函數
const trackError = (
  error: string,
  context: { currentIndex: number; totalSources: number },
  browserType: string,
  errorObj?: unknown
) => {
  console.error('VideoPlayer Error:', { error, context, browserType, errorObj });
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posterDoneRef = useRef(false);
  const browserType = useRef(detectBrowser());
  const maxRetries = 3;

  const current = sources[idx];

  const labels = useMemo(
    () =>
      sources.map((s) => {
        if (s.label) return s.label;
        const u = s.src;
        if (u.includes("-480")) return "480p";
        if (u.includes("-720")) return "720p";
        if (u.includes("-1080")) return "1080p";
        return "原画质";
      }),
    [sources]
  );

  const getPreloadStrategy = useCallback((): string => {
    switch (browserType.current) {
      case 'uc':
      case 'qq':
      case 'baidu':
        return 'none';
      default:
        return 'metadata';
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const attrs: Record<string, string> = {
      "webkit-playsinline": "true",
      "x-webkit-airplay": "allow",
      "x5-playsinline": "true",
      "x5-video-player-type": "h5-page",
      "x5-video-player-fullscreen": "true",
      "x5-video-orientation": "portrait",
      "x5-video-ignore-metadata": "true",
    };

    switch (browserType.current) {
      case "uc":
        attrs["uc-playsinline"] = "true";
        attrs["uc-video-controls"] = "false";
        break;
      case "qq":
      case "wechat":
        attrs["x5-video-player-type"] = "h5";
        attrs["x5-video-player-fullscreen"] = "true";
        break;
      case "baidu":
        attrs["baidu-playsinline"] = "true";
        break;
      case "miui":
        attrs["miui-playsinline"] = "true";
        break;
      case "sogou":
        attrs["sogou-playsinline"] = "true";
        break;
    }

    Object.entries(attrs).forEach(([key, value]) => {
      v.setAttribute(key, value);
    });

    return () => {
      Object.keys(attrs).forEach(key => v.removeAttribute(key));
    };
  }, [current?.src]);

  const tryFallback = useCallback(
    (reason: string) => {
      trackError(reason, { currentIndex: idx, totalSources: sources.length }, browserType.current);
      
      if (retryCount < maxRetries && idx < sources.length) {
        setRetryCount(prev => prev + 1);
        setNote(`載入異常（${reason}），重試中... (${retryCount + 1}/${maxRetries})`);
        
        const v = videoRef.current;
        if (v) {
          v.load();
        }
        return;
      }

      if (idx + 1 >= sources.length) {
        setNote("所有視頻源都無法播放，請檢查網路連接或稍後重試。");
        return;
      }

      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setRetryCount(0);
      setNote(`播放異常（${reason}），已自動切換：${labels[nextIdx]}`);
    },
    [idx, labels, sources.length, retryCount, maxRetries]
  );

  const armTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => tryFallback("載入逾時"), stallTimeoutMs);
  }, [stallTimeoutMs, tryFallback]);

  const requestFullscreen = useCallback(async (element: VendorFullscreenVideo) => {
    try {
      switch (browserType.current) {
        case "uc":
          if ((window as any).ucweb && (window as any).ucweb.startRequest) {
            (window as any).ucweb.startRequest("video.fullScreen", JSON.stringify({ enable: true }));
            setIsFullscreen(true);
            return;
          }
          break;
        case "qq":
        case "wechat":
          if ((element as any).x5EnterFullscreen) {
            (element as any).x5EnterFullscreen();
            setIsFullscreen(true);
            return;
          }
          break;
        case "baidu":
          if ((element as any).baiduEnterFullscreen) {
            (element as any).baiduEnterFullscreen();
            setIsFullscreen(true);
            return;
          }
          break;
      }

      if (element.requestFullscreen) {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
        setIsFullscreen(true);
      } else if (element.webkitEnterFullscreen) {
        element.webkitEnterFullscreen();
        setIsFullscreen(true);
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
        setIsFullscreen(true);
      } else if ((window as any).X5 && (window as any).X5.requestFullscreen) {
        (window as any).X5.requestFullscreen(element);
        setIsFullscreen(true);
      }
    } catch (error: unknown) {
      console.error("Fullscreen request failed:", error);
      trackError("Fullscreen failed", { currentIndex: idx, totalSources: sources.length }, browserType.current, error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
      setIsFullscreen(false);
    } catch (error: unknown) {
      console.error("Exit fullscreen failed:", error);
    }
  }, []);

  useEffect(() => {
    armTimer();
    setPosterUrl(undefined);
    posterDoneRef.current = false;
    setIsPlaying(false);
    setRetryCount(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [armTimer, current?.src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onOK = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNote(null);
      setRetryCount(0);
    };

    const onBad = () => tryFallback("播放錯誤/停滯");
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    v.addEventListener("loadeddata", onOK);
    v.addEventListener("canplay", onOK);
    v.addEventListener("canplaythrough", onOK);
    v.addEventListener("stalled", onBad);
    v.addEventListener("error", onBad);
    v.addEventListener("emptied", onBad);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      v.removeEventListener("loadeddata", onOK);
      v.removeEventListener("canplay", onOK);
      v.removeEventListener("canplaythrough", onOK);
      v.removeEventListener("stalled", onBad);
      v.removeEventListener("error", onBad);
      v.removeEventListener("emptied", onBad);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
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
        const url = canvas.toDataURL("image/jpeg", 0.8);
        setPosterUrl(url);
        posterDoneRef.current = true;
      } catch (error: unknown) {
        console.warn("Cannot capture poster due to CORS policy:", error);
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
  }, [posterFromFirstFrame, current?.src]);

  const isMobile = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    const byUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || "");
    const byWidth = window.matchMedia?.("(max-width: 639px)").matches ?? false;
    return byUA || byWidth;
  }, []);

  useEffect(() => {
    if (!autoFullscreenOnMobile) return;
    const v = videoRef.current as VendorFullscreenVideo | null;
    if (!v) return;

    const handlePlay = async () => {
      if (!isMobile()) return;

      if (browserType.current === "uc" || browserType.current === "qq") {
        setTimeout(() => requestFullscreen(v), 300);
      } else {
        await requestFullscreen(v);
      }
    };

    v.addEventListener("play", handlePlay);
    return () => v.removeEventListener("play", handlePlay);
  }, [autoFullscreenOnMobile, requestFullscreen, isMobile]);

  const changeQuality = useCallback(
    (i: number) => {
      if (i === idx) return;
      
      const v = videoRef.current;
      const currentTime = v?.currentTime || 0;
      const wasPlaying = v && !v.paused;

      setIdx(i);
      setNote(null);
      setPosterUrl(undefined);
      posterDoneRef.current = false;
      setRetryCount(0);

      if (v) {
        v.load();
        
        const restoreState = () => {
          if (currentTime > 0) {
            v.currentTime = currentTime;
          }
          if (wasPlaying) {
            v.play().catch(() => {});
          }
        };

        if (v.readyState >= 2) {
          restoreState();
        } else {
          v.addEventListener("loadeddata", restoreState, { once: true });
        }
      }
    },
    [idx, sources.length]
  );

  const toggleFullscreen = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;

    if (isFullscreen || document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await requestFullscreen(v);
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.pause();
    } else {
      v.play().catch(e => {
        console.error("Play failed:", e);
        tryFallback("播放失敗");
      });
    }
  }, [isPlaying, tryFallback]);

  const reloadVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    
    setNote("重新載入中...");
    setRetryCount(0);
    v.load();
  }, []);

  if (!current) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-600">沒有可用的視頻源</p>
      </div>
    );
  }

  const needCustomControls = ["uc", "qq", "baidu", "sogou"].includes(browserType.current);

  return (
    <div className={`w-full relative ${browserType.current}-browser`}>
      <div className="relative">
        <video
          key={`${idx}-${current.src}`}
          ref={videoRef}
          controls={!needCustomControls}
          preload={getPreloadStrategy()}
          playsInline
          {...(useCrossOriginForPoster ? { crossOrigin: "anonymous" as const } : {})}
          poster={posterUrl}
          className={["w-full rounded-lg shadow", className].filter(Boolean).join(" ")}
          style={{ 
            touchAction: "manipulation",
            objectFit: "contain",
            background: "#000"
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <source src={current.src} type={current.type ?? "video/mp4"} />
          您的瀏覽器不支援 HTML5 影片。
        </video>

        {needCustomControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex justify-center space-x-4">
              <button 
                onClick={togglePlay}
                className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label={isPlaying ? "暫停" : "播放"}
              >
                {isPlaying ? "⏸" : "▶️"}
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="全螢幕"
              >
                {isFullscreen ? "⏷" : "⛶"}
              </button>
              
              <button 
                onClick={reloadVideo}
                className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="重新載入"
              >
                🔄
              </button>
            </div>
          </div>
        )}
      </div>

      {note && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">{note}</p>
          {note.includes("無法播放") && (
            <button 
              onClick={reloadVideo}
              className="mt-2 px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition-colors"
            >
              重新嘗試
            </button>
          )}
        </div>
      )}

      {showQualitySelector && sources.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {labels.map((lb, i) => (
            <button
              key={i}
              onClick={() => changeQuality(i)}
              className={[
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                i === idx
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-800 border-gray-300 hover:border-emerald-400 hover:text-emerald-600",
              ].join(" ")}
              aria-pressed={i === idx}
              disabled={i === idx}
            >
              {lb}
            </button>
          ))}
        </div>
      )}

      {browserType.current !== "standard" && (
        <div className="mt-2 text-xs text-gray-500">
          檢測到 {browserType.current} 瀏覽器，已啟用兼容模式
        </div>
      )}
    </div>
  );
}