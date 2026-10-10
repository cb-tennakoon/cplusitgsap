"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PHONE = "94000000000"; // country code, no +

const STEPS = [
  { icon: "📱", title: "Booked", time: "Instant", text: "We confirm on WhatsApp and send the technician's name and photo." },
  { icon: "🛵", title: "Technician on the way", time: "30 to 60 min", text: "You get a live arrival time. Most visits start within the hour." },
  { icon: "🔍", title: "Diagnosing", time: "15 to 30 min", text: "Checked at your door. You hear the cause and a fixed price before any work starts." },
  { icon: "🔧", title: "Fixing", time: "30 min to 2 hrs", text: "Repaired in front of you with genuine parts. We ask before replacing anything." },
  { icon: "✔️", title: "Tested", time: "10 min", text: "We test everything with you: power, speed, WiFi, printing." },
  { icon: "✅", title: "Done", time: "Warranty included", text: "You pay when you are happy. 30-day warranty on the repair." },
];
const N = STEPS.length;

export default function LiveRepairTracker() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const scootRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const tl = tlRef.current;
    if (!section || !tl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ys: number[] = [];

    const measure = () => {
      const top = tl.getBoundingClientRect().top;
      ys = dotRefs.current.map((d) => (d ? d.getBoundingClientRect().top - top + d.offsetHeight / 2 : 0));
    };

    const apply = (p: number) => {
      if (!ys.length) return;
      const y = ys[0] + p * (ys[N - 1] - ys[0]);
      if (fillRef.current) fillRef.current.style.height = `${y}px`;
      if (scootRef.current) scootRef.current.style.transform = `translate(-50%, ${y - 20}px)`;
      // a step becomes active slightly before the scooter reaches it
      let i = 0;
      ys.forEach((dy, k) => {
        if (y >= dy - 40) i = k;
      });
      setIdx((prev) => (prev === i ? prev : i));
    };

    const ctx = gsap.context(() => {
      if (reduce) {
        measure();
        apply(1);
        return;
      }
      ScrollTrigger.create({
        trigger: tl,
        start: "top 65%",
        end: "bottom 60%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          apply(self.progress);
        },
        onUpdate: (self) => apply(self.progress),
      });
    }, section);

    measure();
    apply(0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  const msg = encodeURIComponent("Hi, I'd like to book a home visit repair.");
  const cur = STEPS[idx];

  return (
    <section ref={sectionRef} id="tracker" className="relative overflow-x-clip bg-[#08080a] px-5 py-16 text-white sm:py-20 lg:px-10">
      <style>{`
        @keyframes lt-ping{0%{box-shadow:0 0 0 0 rgba(249,115,22,.55)}100%{box-shadow:0 0 0 14px rgba(249,115,22,0)}}
        .lt-now{animation:lt-ping 1.6s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.lt-now{animation:none}}
      `}</style>
      <div className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        {/* Left column on desktop (sticky). On mobile it "dissolves" (contents) so the bar below can stick. */}
        <div className="contents lg:sticky lg:top-20 lg:block lg:self-start">
          <div className="text-center lg:text-left">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Track your repair, step by step</h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-slate-400 lg:mx-0">
              From the moment you book, you always know what is happening. Scroll to follow a typical visit.
            </p>
          </div>

          {/* DESKTOP status card */}
          <div className="mt-6 hidden rounded-2xl border border-white/10 bg-white/[.04] p-5 lg:block">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Current step</span>
              <span className="font-mono">
                {idx + 1} / {N}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-3 text-2xl font-bold">
              <span>{cur.icon}</span>
              {cur.title}
            </p>
            <p className="mt-1 text-sm text-orange-300">{cur.time}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded bg-white/10">
              <div className="h-full rounded bg-orange-500 transition-all duration-500" style={{ width: `${((idx + 1) / N) * 100}%` }} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href="#book" className="rounded-2xl bg-orange-600 px-6 py-3 font-semibold shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500">
              Book a visit
            </a>
            <a
              href={`https://wa.me/${PHONE}?text=${msg}`}
              className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
            >
              WhatsApp us
            </a>
          </div>

          {/* MOBILE / TABLET sticky bar */}
          <div className="sticky top-3 z-30 mb-8 mt-8 rounded-2xl border border-orange-500/30 bg-[#101013]/95 p-3 shadow-xl shadow-black/60 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cur.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{cur.title}</p>
                <p className="text-xs text-orange-300">{cur.time}</p>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {idx + 1} / {N}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded bg-white/10">
              <div className="h-full rounded bg-orange-500 transition-all duration-500" style={{ width: `${((idx + 1) / N) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* timeline */}
        <ol ref={tlRef} className="relative pl-16">
          <div className="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-white/10" />
          <div ref={fillRef} className="absolute left-5 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-400 to-orange-600" style={{ height: 0 }} />

          <div
            ref={scootRef}
            aria-hidden
            className="absolute left-5 top-0 z-20 grid h-10 w-10 place-items-center rounded-full border-2 border-orange-300 bg-orange-600 text-xl shadow-lg shadow-orange-600/40 will-change-transform"
            style={{ transform: "translate(-50%, -20px)" }}
          >
            {idx === N - 1 ? "✅" : "🛵"}
          </div>

          {STEPS.map((s, i) => {
            const done = i < idx;
            const now = i === idx;
            return (
              <li key={s.title} className="relative pb-14 last:pb-0">
                <span
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className={`absolute left-[-2.75rem] top-6 z-10 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border-2 text-[10px] font-bold transition-colors duration-300 ${
                    done
                      ? "border-emerald-400 bg-emerald-500 text-black"
                      : now
                        ? "lt-now border-orange-400 bg-orange-500"
                        : "border-white/20 bg-[#08080a]"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>

                <div
                  className={`rounded-2xl border p-5 transition-all duration-500 ${
                    now
                      ? "border-orange-500/50 bg-orange-500/10 opacity-100"
                      : done
                        ? "border-white/10 bg-white/[.03] opacity-80"
                        : "border-white/5 bg-white/[.02] opacity-45"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-between">
                    <h3 className="flex items-center justify-center gap-3 text-xl font-semibold lg:justify-start">
                      <span className="text-2xl">{s.icon}</span>
                      {s.title}
                    </h3>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">{s.time}</span>
                  </div>
                  <p className="mt-2 text-center text-slate-400 lg:text-left">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}