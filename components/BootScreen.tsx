"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINES = [
  "BIOS v2.4 .................... OK",
  "RAM check .................... OK",
  "Detecting problem ............",
  "Searching nearest technician .",
  "Route calculated ............. OK",
  "Ready.",
];

type BootScreenProps = {
  onComplete?: () => void;
  minDuration?: number;
};

export default function BootScreen({ onComplete, minDuration = 3200 }: BootScreenProps) {
  const [visible, setVisible] = useState(true);
  const preRef = useRef<HTMLPreElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const skipped = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const pre = preRef.current;
    const bar = barRef.current;
    if (!pre || !bar) return;

    pre.textContent = "";
    const tl = gsap.timeline({
      onComplete: () => {
        if (!skipped.current) finish();
      },
    });

    // Type each line
    LINES.forEach((line, i) => {
      const proxy = { n: 0 };
      tl.to(
        proxy,
        {
          n: line.length,
          duration: Math.min(0.85, line.length * 0.026),
          ease: "none",
          onUpdate: () => {
            const current = pre.textContent?.split("\n") ?? [];
            current[i] = line.slice(0, Math.round(proxy.n));
            pre.textContent = current.slice(0, i + 1).join("\n");
          },
        },
        i === 0 ? 0.2 : "+=0.14"
      );
    });

    // Progress bar
    tl.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.5, ease: "power1.inOut" },
      0
    );

    // Pause on "Ready."
    tl.to({}, { duration: 0.5 });

    function finish() {
      if (finished.current) return;
      finished.current = true;
      gsap.to(wrapRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          setVisible(false);
          onComplete?.();
        },
      });
    }

    const safety = window.setTimeout(finish, minDuration + 1600);

    const skip = () => {
      if (skipped.current) return;
      skipped.current = true;
      tl.timeScale(9);
      window.setTimeout(finish, 180);
    };

    const el = wrapRef.current;
    el?.addEventListener("click", skip);

    return () => {
      tl.kill();
      window.clearTimeout(safety);
      el?.removeEventListener("click", skip);
    };
  }, [minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div ref={wrapRef} className="boot-screen" role="dialog" aria-label="System boot" tabIndex={0}>
      <div className="boot-inner">
        <pre ref={preRef} className="boot-text" />
        <div className="boot-bar-track" aria-hidden="true">
          <div ref={barRef} className="boot-bar-fill" />
        </div>
        <p className="boot-hint">Click to skip</p>
      </div>
    </div>
  );
}