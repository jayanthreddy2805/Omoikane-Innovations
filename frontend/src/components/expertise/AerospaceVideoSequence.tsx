"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AerospaceVideoSequence.module.css";

type Clip = {
  id: string;
  src: string;
  alt: string;
  bgColor: string;
};

const CLIPS: Clip[] = [
  {
    id: "uav-flight",
    src: "/videos/expertise/01-uav-flight.mp4",
    alt: "Fixed-wing unmanned aircraft in a flight-test turn",
    bgColor: "#D9DEE0", // cool light gray
  },
  {
    id: "flight-control",
    src: "/videos/expertise/02-flight-control.mp4",
    alt: "Aerospace actuator and mechanical flight-control linkage being tested",
    bgColor: "#8796A3", // muted blue-gray
  },
  {
    id: "airframe-assembly",
    src: "/videos/expertise/03-airframe-assembly.mp4",
    alt: "Technicians assembling and inspecting an unmanned aircraft",
    bgColor: "#F1F0EB", // warm technical off-white
  },
  {
    id: "rf-communications",
    src: "/videos/expertise/04-rf-communications.mp4",
    alt: "Engineer testing antenna and radio communication equipment",
    bgColor: "#242A2E", // deep graphite
  },
  {
    id: "field-operations",
    src: "/videos/expertise/05-uav-field-operations.mp4",
    alt: "Unmanned aircraft accelerating along a test runway and taking off",
    bgColor: "#111518", // aerospace near-black
  },
];

function safePlay(video: HTMLVideoElement | null) {
  if (!video) return;
  video.currentTime = 0;
  video.muted = true;
  video.playbackRate = 1.5;
  const playback = video.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {
      // Browser autoplay can still be denied by user/device policy.
    });
  }
}

type AerospaceVideoSequenceProps = {
  active?: boolean;
  reducedMotion?: boolean;
};

export default function AerospaceVideoSequence({
  active = false,
  reducedMotion = false,
}: AerospaceVideoSequenceProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const playedRef = useRef(false);

  const setFinalComposition = useCallback(() => {
    tileRefs.current.forEach((tile, index) => {
      if (!tile) return;
      gsap.set(tile, {
        autoAlpha: index === 4 ? 1 : 0, // only the last one is visible
        xPercent: -50,
        yPercent: -50,
      });
    });
    if (stageRef.current) {
      gsap.set(stageRef.current, { backgroundColor: CLIPS[4].bgColor });
    }
  }, []);

  // 1. Setup the timeline once (or when reducedMotion changes)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const tiles = tileRefs.current;
    const videos = videoRefs.current;

    const context = gsap.context(() => {
      if (reducedMotion) {
        setFinalComposition();
        return;
      }

      // Base state: center is xPercent: -50, yPercent: -50
      // Initial off-stage positions relative to the center:
      gsap.set(tiles[0], { xPercent: -50, yPercent: 200, autoAlpha: 1 }); // bottom
      gsap.set(tiles[1], { xPercent: -50, yPercent: 200, autoAlpha: 1 }); // bottom
      gsap.set(tiles[2], { xPercent: -300, yPercent: -50, autoAlpha: 1 }); // left
      gsap.set(tiles[3], { xPercent: 200, yPercent: -50, autoAlpha: 1 }); // right
      gsap.set(tiles[4], { xPercent: -50, yPercent: -300, autoAlpha: 1 }); // top
      
      // Removed background color setter

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
      });

      // 0s — Video 01 enters from bottom
      tl.call(() => safePlay(videos[0]), [], 0);
      tl.to(tiles[0], { yPercent: -50, duration: 1, ease: "power3.out" }, 0);

      // 4.7s — Video 01 moves upward out.
      tl.to(tiles[0], { yPercent: -300, duration: 0.8, ease: "power2.in" }, 4.7);
      // THEN Video 02 enters from bottom.
      tl.call(() => safePlay(videos[1]), [], 5.5);
      tl.to(tiles[1], { yPercent: -50, duration: 1, ease: "power3.out" }, 5.5);

      // 10.2s — Video 02 moves left out.
      tl.to(tiles[1], { xPercent: -300, duration: 0.8, ease: "power2.in" }, 10.2);
      // THEN Video 03 enters from left.
      tl.call(() => safePlay(videos[2]), [], 11.0);
      tl.to(tiles[2], { xPercent: -50, duration: 1, ease: "power3.out" }, 11.0);

      // 15.7s — Video 03 moves right out.
      tl.to(tiles[2], { xPercent: 200, duration: 0.8, ease: "power2.in" }, 15.7);
      // THEN Video 04 enters from right.
      tl.call(() => safePlay(videos[3]), [], 16.5);
      tl.to(tiles[3], { xPercent: -50, duration: 1, ease: "power3.out" }, 16.5);

      // 21.2s — Video 04 moves downward out.
      tl.to(tiles[3], { yPercent: 200, duration: 0.8, ease: "power2.in" }, 21.2);
      // THEN Video 05 enters from top.
      tl.call(() => safePlay(videos[4]), [], 22.0);
      tl.to(tiles[4], { yPercent: -50, duration: 1, ease: "power3.out" }, 22.0);

      // 26.7s — Video 05 moves upward out, making way for Video 01 to loop from bottom
      tl.to(tiles[4], { yPercent: -300, duration: 0.8, ease: "power2.in" }, 26.7);

      timelineRef.current = tl;
    }, stage);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      context.revert();
      videos.forEach((video) => video?.pause());
      playedRef.current = false; // Reset for StrictMode
    };
  }, [reducedMotion, setFinalComposition]);

  // 2. Trigger playback when active becomes true
  useEffect(() => {
    if (!active) {
      timelineRef.current?.pause();
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }
    if (active && playedRef.current) {
      timelineRef.current?.resume();
      return;
    }
    if (active && !playedRef.current) {
      playedRef.current = true;
      if (reducedMotion) {
        safePlay(videoRefs.current[4]);
      } else if (timelineRef.current) {
        timelineRef.current.play(0);
      }
    }
  }, [active, reducedMotion]);

  return (
    <div className={styles.frame}>
      <div className={styles.stage} ref={stageRef} aria-label="Five-video aerospace sequence">
        {CLIPS.map((clip, index) => (
          <div
            className={styles.tile}
            key={clip.id}
            ref={(node) => { tileRefs.current[index] = node; }}
            data-clip={clip.id}
          >
            <video
              ref={(node) => { videoRefs.current[index] = node; }}
              className={styles.video}
              src={clip.src}
              muted
              playsInline
              preload="none"
              aria-label={clip.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
