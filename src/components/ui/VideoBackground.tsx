"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force loop by listening to ended event
    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play().catch((error) => {
        console.log("Failed to restart video:", error);
      });
    };

    // Ensure video plays when loaded
    const handleCanPlay = () => {
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    };

    // Handle errors
    const handleError = (e: Event) => {
      console.error("Video error:", e);
    };

    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Try to play immediately
    video.play().catch((error) => {
      console.log("Initial autoplay was prevented:", error);
    });

    // Attempt to unmute on user interaction
    const enableAudio = () => {
      if (video && !hasInteracted) {
        video.muted = false;
        setHasInteracted(true);
        console.log("Audio enabled");
      }
    };

    // Listen for any user interaction to enable audio
    const interactionEvents = ["click", "touchstart", "keydown"];
    interactionEvents.forEach((event) => {
      document.addEventListener(event, enableAudio, { once: true });
    });

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, enableAudio);
      });
    };
  }, [hasInteracted]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-transparent">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 mix-blend-screen"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to ensure text contrast while keeping video visible */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
