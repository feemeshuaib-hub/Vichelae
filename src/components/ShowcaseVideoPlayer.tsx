import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, Info } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface ShowcaseVideoPlayerProps {
  heading: string;
  caption: string;
  videoSrc: string;
  posterSrc: string;
  eyebrow: string;
  darkSurface?: boolean;
}

export const ShowcaseVideoPlayer: React.FC<ShowcaseVideoPlayerProps> = ({
  heading,
  caption,
  videoSrc,
  posterSrc,
  eyebrow,
  darkSurface = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [showPlaceholderNotice, setShowPlaceholderNotice] = useState(false);

  const handleTogglePlay = async () => {
    if (videoUnavailable) {
      setShowPlaceholderNotice((prev) => !prev);
      return;
    }

    const videoEl = videoRef.current;
    if (!videoEl) return;

    try {
      if (videoEl.paused) {
        await videoEl.play();
        setIsPlaying(true);
      } else {
        videoEl.pause();
        setIsPlaying(false);
      }
    } catch {
      setVideoUnavailable(true);
      setIsPlaying(false);
      setShowPlaceholderNotice(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const titleColor = darkSurface ? 'text-[#FFF9F0]' : 'text-[#245B59]';
  const subColor = darkSurface ? 'text-[#FFF9F0]/80' : 'text-[#245B59]/75';
  const eyebrowColor = darkSurface ? 'text-[#E8C994]' : 'text-[#245B59]/70';

  return (
    <div className="space-y-5">
      <div className="max-w-2xl">
        <p className={`text-xs font-semibold tracking-[0.2em] uppercase ${eyebrowColor}`}>
          {eyebrow}
        </p>
        <h2
          className={`mt-2 font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-balance ${titleColor}`}
        >
          {heading}
        </h2>
        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${subColor}`}>
          {caption}
        </p>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E8C994] bg-[#245B59]">
        {!videoUnavailable ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={posterSrc}
            playsInline
            muted={isMuted}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setVideoUnavailable(true);
              setIsPlaying(false);
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <ResilientImage
            src={posterSrc}
            alt={heading}
            className="h-full w-full object-cover"
          />
        )}

        {/* Scrim for control legibility */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isPlaying
              ? 'bg-gradient-to-t from-[#245B59]/75 via-transparent to-transparent opacity-80'
              : 'bg-gradient-to-t from-[#245B59]/80 via-[#245B59]/15 to-transparent opacity-100'
          }`}
        />

        {/* Honest placeholder notice if external .mp4 asset is not yet placed in /public/videos */}
        {videoUnavailable && showPlaceholderNotice && (
          <div className="absolute inset-x-4 top-4 sm:inset-x-6 sm:top-6 rounded-lg border border-[#E8C994] bg-[#245B59]/95 p-4 text-[#FFF9F0] backdrop-blur-sm max-w-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs sm:text-sm leading-relaxed space-y-1">
                <p className="font-semibold text-[#E8C994]">
                  Replaceable Video File Pending
                </p>
                <p className="text-[#FFF9F0]/90">
                  No video file is currently mounted at{' '}
                  <code className="text-[#E8C994] font-mono">{videoSrc}</code>. Add your
                  MP4 file to <code className="text-[#E8C994] font-mono">public{videoSrc}</code>{' '}
                  before deployment to enable live video playback; displaying the high-resolution
                  event preview poster in the meantime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? `Pause ${heading}` : `Play ${heading}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E8C994] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#245B59] transition-colors hover:bg-[#FFF9F0] cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF9F0]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>{videoUnavailable ? 'Preview Notice' : 'Play Showcase'}</span>
                </>
              )}
            </button>

            {!videoUnavailable && (
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="inline-flex items-center justify-center rounded-lg border border-[#FFF9F0]/40 bg-[#245B59]/80 p-2.5 text-[#FFF9F0] hover:border-[#E8C994] cursor-pointer min-h-[44px] min-w-[44px]"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#FFF9F0]/90">
            <Film className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
            <span className="hidden sm:inline font-mono">{videoSrc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
