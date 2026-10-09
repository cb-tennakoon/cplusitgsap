"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PHONE = "94000000000"; // country code, no +

type Cause = { name: string; chance: number };
type Symptom = {
  id: string;
  icon: string;
  title: string;
  hint: string;
  causes: Cause[];
  costMin: number;
  costMax: number;
  time: string;
  note: string;
};

const SYMPTOMS: Symptom[] = [
  {
    id: "no-power",
    icon: "⏻",
    title: "Won't turn on",
    hint: "No lights, no sound",
    causes: [
      { name: "Faulty charger or power adapter", chance: 45 },
      { name: "Dead battery or power board", chance: 35 },
      { name: "Motherboard fault", chance: 20 },
    ],
    costMin: 3500,
    costMax: 25000,
    time: "30 min to 2 hrs",
    note: "Most charger and battery faults are fixed on the spot.",
  },
  {
    id: "slow",
    icon: "🐢",
    title: "Very slow",
    hint: "Freezing, long loading",
    causes: [
      { name: "Too many startup apps or malware", chance: 50 },
      { name: "Old hard drive failing", chance: 30 },
      { name: "Low RAM or dust overheating", chance: 20 },
    ],
    costMin: 2500,
    costMax: 15000,
    time: "45 min to 1.5 hrs",
    note: "An SSD upgrade often makes an old PC feel new.",
  },
  {
    id: "no-internet",
    icon: "📶",
    title: "No internet",
    hint: "Wi-Fi or cable not working",
    causes: [
      { name: "Router or ISP issue", chance: 40 },
      { name: "Wi-Fi adapter or driver", chance: 35 },
      { name: "Wrong network settings", chance: 25 },
    ],
    costMin: 1500,
    costMax: 6000,
    time: "20 to 45 min",
    note: "Quick tip: restart the router for 30 seconds first.",
  },
  {
    id: "printer",
    icon: "🖨️",
    title: "Printer not printing",
    hint: "Offline, blank or stuck",
    causes: [
      { name: "Stuck queue or missing driver", chance: 40 },
      { name: "Clogged print head or empty ink", chance: 35 },
      { name: "Paper path or hardware fault", chance: 25 },
    ],
    costMin: 1500,
    costMax: 8000,
    time: "20 to 60 min",
    note: "Ink and toner cost extra if a refill is needed.",
  },
  {
    id: "screen",
    icon: "🖥️",
    title: "Broken screen",
    hint: "Cracks, lines or black display",
    causes: [
      { name: "Cracked display panel", chance: 60 },
      { name: "Loose or damaged display cable", chance: 25 },
      { name: "Backlight or graphics fault", chance: 15 },
    ],
    costMin: 12000,
    costMax: 45000,
    time: "1 to 2 hrs",
    note: "Some panels must be ordered. We confirm the part price first.",
  },
  {
    id: "noise",
    icon: "🔊",
    title: "Strange noise or smell",
    hint: "Loud fan, clicking, burning",
    causes: [
      { name: "Dust-clogged or failing fan", chance: 55 },
      { name: "Failing hard drive (clicking)", chance: 25 },
      { name: "Overheating or electrical fault", chance: 20 },
    ],
    costMin: 2500,
    costMax: 12000,
    time: "30 to 90 min",
    note: "If you smell burning, switch off and unplug it now.",
  },
];

export default function SymptomPicker() {
  const [sel, setSel] = useState<string | null>(null);
  const [rightHeight, setRightHeight] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const costRef = useRef<HTMLSpanElement>(null);
  const flipRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const active = SYMPTOMS.find((s) => s.id === sel) ?? null;
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sync right panel height to left tiles height
  useEffect(() => {
    const updateHeight = () => {
      if (leftRef.current) {
        setRightHeight(leftRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // tiles flip
  useEffect(() => {
    const k = reduce() ? 0 : 1;
    SYMPTOMS.forEach((s) => {
      const el = flipRefs.current[s.id];
      if (el) gsap.to(el, { rotateY: s.id === sel ? 180 : 0, duration: 0.6 * k, ease: "power3.inOut" });
    });
  }, [sel]);

  // report slides in
  useEffect(() => {
    if (!active || !reportRef.current) return;
    const k = reduce() ? 0 : 1;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        reportRef.current,
        { x: 60 * k, opacity: 0, clipPath: "inset(0 0 100% 0)" },
        { x: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7 * k, ease: "power3.out" }
      )
        .fromTo(".rp-scan", { y: "-10%", opacity: 0.8 }, { y: "110%", opacity: 0, duration: 0.8 * k, ease: "none" }, 0.1)
        .fromTo(".rp-row", { opacity: 0, x: 16 * k }, { opacity: 1, x: 0, duration: 0.4 * k, stagger: 0.1 * k }, 0.35)
        .fromTo(".rp-bar", { width: "0%" }, { width: (i, t) => t.dataset.w + "%", duration: 0.9 * k, stagger: 0.12 * k, ease: "power2.out" }, 0.6);

      const c = { v: 0 };
      gsap.to(c, {
        v: active.costMin,
        duration: 1 * k,
        ease: "power2.out",
        onUpdate: () => {
          if (costRef.current) costRef.current.textContent = Math.round(c.v).toLocaleString();
        },
      });
    }, reportRef);
    return () => ctx.revert();
  }, [active]);

  const msg = active
    ? `Hi, I need help: ${active.title}. Estimated LKR ${active.costMin.toLocaleString()} - ${active.costMax.toLocaleString()}. Can you visit?`
    : "";

  return (
    <section id="symptoms" ref={root} className="relative overflow-hidden bg-[#08080a] px-5 py-20 text-white lg:px-10">
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-orange-600/10 blur-[110px]" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s wrong with your device?</h2>
          <p className="mt-3 text-slate-400">Tap the problem that matches. We&apos;ll show the likely cause, price and time before you book.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          
          {/* LEFT - tiles */}
          <div
            ref={leftRef}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
            style={{ perspective: "1000px" }}
          >
            {SYMPTOMS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSel(s.id)}
                aria-pressed={sel === s.id}
                className="relative h-40 rounded-2xl text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              >
                <div
                  ref={(el) => {
                    flipRefs.current[s.id] = el;
                  }}
                  className="relative h-full w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* front */}
                  <div
                    className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[.04] p-4 transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-orange-500/10"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <p className="font-semibold leading-tight">{s.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
                    </div>
                  </div>
                  {/* back */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-orange-500/60 bg-gradient-to-br from-orange-600 to-orange-700 p-4 text-center shadow-lg shadow-orange-600/30"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <span className="text-2xl">✔</span>
                    <p className="font-semibold leading-tight">{s.title}</p>
                    <p className="text-xs text-orange-100">Report ready</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT - exact same height as left + scroll */}
          <div
            className="w-full"
            style={rightHeight ? { height: rightHeight } : undefined}
          >
            {!active && (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-500">
                <div>
                  <p className="text-4xl">🩺</p>
                  <p className="mt-3">Pick a problem to run a free diagnosis.</p>
                </div>
              </div>
            )}

            {active && (
              <div
                ref={reportRef}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141417] shadow-2xl shadow-black/50"
                aria-live="polite"
              >
                {/* Scan line */}
                <div className="rp-scan pointer-events-none absolute inset-x-0 z-10 h-16 bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />

                {/* Fixed header */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#1c1c20] px-5 py-3 font-mono text-xs text-slate-400">
                  <span>diagnostic-report / {active.id}</span>
                  <span className="flex items-center gap-2 text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> done
                  </span>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 space-y-5 overflow-y-auto p-5">
                  <div className="rp-row">
                    <p className="text-xs text-slate-500">Problem</p>
                    <p className="text-xl font-bold">{active.title}</p>
                  </div>

                  <div className="rp-row">
                    <p className="mb-2 text-xs text-slate-500">Likely cause</p>
                    <div className="space-y-3">
                      {active.causes.map((c) => (
                        <div key={c.name}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-200">{c.name}</span>
                            <span className="font-mono text-orange-300">{c.chance}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded bg-white/10">
                            <div className="rp-bar h-full rounded bg-orange-500" data-w={c.chance} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rp-row grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">Estimated cost</p>
                      <p className="mt-1 text-lg font-bold text-orange-400">
                        LKR <span ref={costRef}>{active.costMin.toLocaleString()}</span>
                        <span className="block text-xs font-medium text-slate-400">
                          up to {active.costMax.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">Time needed</p>
                      <p className="mt-1 text-lg font-bold">{active.time}</p>
                    </div>
                  </div>

                  <p className="rp-row text-sm text-slate-400">{active.note}</p>

                  <div className="rp-row flex flex-wrap gap-3">
                    <a
                      href="#book"
                      className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Book this fix
                    </a>
                    <a
                      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`}
                      className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
                    >
                      Ask on WhatsApp
                    </a>
                  </div>

                  <p className="rp-row text-xs text-slate-600">
                    Estimate only. Final price is confirmed after inspection at your home.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}