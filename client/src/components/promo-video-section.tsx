import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    {
      src: "/videos/ai-generated-example-1.mp4",
      poster: "/videos/poster-mission.png",
      label: "Our Mission",
      description: "See how GetCyberRight protects families from online threats",
    },
    {
      src: "/videos/ai-generated-example-2.mov",
      poster: "/videos/poster-why-it-matters.png",
      label: "Why It Matters",
      description: "Real families. Real protection. Real results.",
    },
  ];

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

  const switchVideo = (index: number) => {
    if (index === activeVideo) return;
    setActiveVideo(index);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" data-testid="section-promo-video">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-5">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              See It in Action
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-promo-heading">
            See How We Help Families Like Yours
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Real guidance for real families. Watch how we make cybersecurity simple, personal, and actually useful.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-black">
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                key={videos[activeVideo].src}
                src={videos[activeVideo].src}
                poster={videos[activeVideo].poster}
                className="w-full h-full object-cover"
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                data-testid="video-promo"
              />

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    size="icon"
                    variant="default"
                    className="rounded-full bg-primary/90 shadow-xl"
                    onClick={togglePlay}
                    data-testid="button-play-promo"
                    aria-label="Play video"
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
                  data-testid="button-pause-promo"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white/90 bg-black/40 backdrop-blur-sm"
                  onClick={toggleMute}
                  data-testid="button-mute-promo"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {videos.length > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              {videos.map((video, index) => (
                <Button
                  key={index}
                  variant={activeVideo === index ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full gap-2 ${
                    activeVideo === index
                      ? "bg-primary text-white border-primary-border"
                      : "text-white/70"
                  }`}
                  onClick={() => switchVideo(index)}
                  data-testid={`button-video-tab-${index}`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  {video.label}
                </Button>
              ))}
            </div>
          )}

          <p className="text-center text-sm text-white/50 mt-4" data-testid="text-video-description">
            {videos[activeVideo].description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
