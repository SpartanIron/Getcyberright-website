"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InlinePromoVideoProps {
  src: string;
  poster?: string;
  heading?: string;
  description?: string;
  className?: string;
}

export function InlinePromoVideo({ src, poster, heading, description, className = "" }: InlinePromoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {heading && (
        <h3 className="text-xl font-semibold mb-2 text-center" data-testid="text-inline-video-heading">
          {heading}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-lg mx-auto">
          {description}
        </p>
      )}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-black max-w-2xl mx-auto">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            preload="none"
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            data-testid="video-inline-promo"
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                size="icon"
                variant="default"
                className="rounded-full bg-primary/90 shadow-xl"
                onClick={togglePlay}
                aria-label="Play video"
                data-testid="button-inline-play"
              >
                <Play className="w-6 h-6 ml-0.5" />
              </Button>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-white/90 bg-black/40 backdrop-blur-sm"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              data-testid="button-inline-pause"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white/90 bg-black/40 backdrop-blur-sm"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              data-testid="button-inline-mute"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
