import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideVideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
}

const GUIDE_VIDEOS: Record<string, string> = {
  "how-to-secure-facebook-account-privacy-settings": "/videos/guides/facebook_security_guide.mp4",
  "how-to-secure-instagram-account-privacy-settings": "/videos/guides/instagram_security_guide.mp4",
  "how-to-secure-x-twitter-account-privacy-settings": "/videos/guides/twitter_security_guide.mp4",
  "how-to-secure-tiktok-account-privacy-settings": "/videos/guides/tiktok_security_guide.mp4",
  "how-to-secure-linkedin-account-privacy-settings": "/videos/guides/linkedin_security_guide.mp4",
  "how-to-secure-whatsapp-account-privacy-settings": "/videos/guides/whatsapp_security_guide.mp4",
};

export function getGuideVideoUrl(slug: string): string | null {
  return GUIDE_VIDEOS[slug] || null;
}

export function GuideVideoPlayer({ src, title, poster }: GuideVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setProgress(video.currentTime);
    };
    const onLoaded = () => {
      setDuration(video.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      setShowControls(true);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (hasEnded) {
      videoRef.current.currentTime = 0;
      setHasEnded(false);
    }
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
    setHasEnded(false);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative group rounded-xl overflow-hidden bg-black aspect-video mb-8 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      data-testid="guide-video-player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onClick={togglePlay}
        data-testid="guide-video-element"
      />

      {!isPlaying && !hasEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white ml-1" fill="white" />
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white/90 text-sm font-medium drop-shadow-lg">
              Watch: {title}
            </p>
          </div>
        </div>
      )}

      {hasEnded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 cursor-pointer" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-transform hover:scale-110 mb-3">
            <RotateCcw className="w-7 h-7 text-white" />
          </div>
          <p className="text-white/90 text-sm font-medium">Replay</p>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress"
          onClick={handleSeek}
          data-testid="video-progress-bar"
        >
          <div
            className="h-full bg-primary rounded-full relative transition-all"
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-0 min-w-0 text-white hover:bg-white/20 border-none"
              onClick={togglePlay}
              data-testid="btn-video-play"
            >
              {isPlaying ? <Pause className="w-4 h-4" fill="white" /> : <Play className="w-4 h-4" fill="white" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-0 min-w-0 text-white hover:bg-white/20 border-none"
              onClick={toggleMute}
              data-testid="btn-video-mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <span className="text-white/70 text-xs tabular-nums ml-1">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 min-h-0 min-w-0 text-white hover:bg-white/20 border-none"
            onClick={handleFullscreen}
            data-testid="btn-video-fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
