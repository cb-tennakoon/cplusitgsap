"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = "94000000000"; // country code, no +

type Job = { title: string; area: string; time: string };

// IMPORTANT: these are SAMPLE jobs. Replace them with your real recent jobs,
// because this section is meant to be proof of experience.
const JOBS: Job[] = [
  { title: "Laptop screen replaced", area: "Nugegoda", time: "40 min" },
  { title: "WiFi dead zone fixed", area: "Dehiwala", time: "25 min" },
  { title: "Printer reinstalled", area: "Colombo 7", time: "15 min" },
  { title: "Slow PC upgraded to SSD", area: "Mount Lavinia", time: "55 min" },
  { title: "Laptop fan cleaned, new paste", area: "Rajagiriya", time: "35 min" },
  { title: "Router replaced, WiFi set up", area: "Maharagama", time: "30 min" },
  { title: "Virus removed from desktop", area: "Battaramulla", time: "45 min" },
  { title: "Laptop battery replaced", area: "Kotte", time: "20 min" },
  { title: "Printer paper jam cleared", area: "Colombo 5", time: "15 min" },
  { title: "Desktop power supply swapped", area: "Kaduwela", time: "40 min" },
  { title: "TV HDMI port repaired", area: "Piliyandala", time: "50 min" },
  { title: "Windows reinstalled, data saved", area: "Colombo 3", time: "70 min" },
];

type Seg = { t: string; c: string };

const segs = (j: Job): Seg[] => [
  { t: "✔ ", c: "text-emerald-400" },
  { t: j.title, c: "text-slate-100" },
  { t: ", ", c: "text-slate-600" },
  { t: j.area, c: "text-orange-300" },
  { t: ", ", c: "text-slate-600" },
  { t: j.time, c: "text-emerald-300" },
];

const fullLen = (j: Job) => segs(j).reduce((a, s) => a + s.t.length, 0);

/** render only the first n characters, keeping each segment's colour */
function Line({ job, n }: { job: Job; n?: number }) {
  let left = n ?? Infinity;
  return (
    <>
      {segs(job).map((s, i) => {
        if (left <= 0) return null;
        const part = s.t.slice(0, left);
        left -= part.length;
        return (
          <span key={i} className={s.c}>
            {part}
          </span>
        );
      })}
    </>
  );
}

export default function LiveRepairLog() {
  const boxRef = useRef<HTMLDivElement>(null);
  const kRef = useRef(3);
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState<{ k: number; j: number }[]>([
    { k: 0, j: 0 },
    { k: 1, j: 1 },
    { k: 2, j: 2 },
  ]);
  const [cur, setCur] = useState(3);
  const [n, setN] = useState(0);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // only type while the box is on screen and the tab is visible
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let inView = false;
    const sync = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // typing loop: type a line, pause, commit it, start the next one
  useEffect(() => {
    if (!active || reduce) return;
    const len = fullLen(JOBS[cur]);
    let t: ReturnType<typeof setTimeout>;
    if (n < len) {
      t = setTimeout(() => setN(n + 1), 22 + Math.random() * 32);
    } else {
      t = setTimeout(() => {
        const k = kRef.current++;
        setDone((d) => [...d, { k, j: cur }].slice(-8));
        setCur((c) => (c + 1) % JOBS.length);
        setN(0);
      }, 1300);
    }
    return () => clearTimeout(t);
  }, [n, cur, active, reduce]);

  const staticList = JOBS.slice(0, 7);

  return (
    <section id="repair-log" className="relative overflow-x-clip bg-[#08080a] px-5 py-16 text-white sm:py-20 lg:px-10">
      <style>{`
        @keyframes rl-blink{50%{opacity:0}}
        @keyframes rl-pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.55)}100%{box-shadow:0 0 0 10px rgba(16,185,129,0)}}
        .rl-cursor{animation:rl-blink 1s steps(1) infinite}
        .rl-live{animation:rl-pulse 1.8s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.rl-cursor,.rl-live{animation:none}}
      `}</style>
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Recent jobs, logged live</h2>
          <p className="mt-3 text-slate-400">A running record of home visits: what was fixed, where, and how long it took.</p>
        </div>

        {/* screen readers get the full list; the animation is decorative */}
        <ul className="sr-only">
          {JOBS.map((j) => (
            <li key={j.title}>
              {j.title}, {j.area}, {j.time}
            </li>
          ))}
        </ul>

        <div ref={boxRef} aria-hidden className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl shadow-black/60">
          {/* title bar */}
          <div className="flex items-center justify-between bg-[#2b2b30] pl-3">
            <div className="flex items-center gap-2 py-2 text-xs text-slate-300">
              <span className="grid grid-cols-2 gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[6px] w-[6px] bg-orange-500" />
                ))}
              </span>
              Command Prompt - repairs.log
            </div>
            <div className="flex text-slate-400">
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">&#8212;</span>
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">&#9633;</span>
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-red-600 hover:text-white">&#10005;</span>
            </div>
          </div>

          {/* feed: bottom-anchored, old lines fade out at the top */}
          <div
            className="flex h-[20rem] flex-col justify-end gap-1.5 overflow-hidden px-5 py-4 font-mono text-[13px] leading-relaxed sm:h-[23rem] sm:text-sm"
            style={{ maskImage: "linear-gradient(to bottom, transparent 0, #000 28%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 28%)" }}
          >
            {reduce
              ? staticList.map((j) => (
                  <p key={j.title}>
                    <Line job={j} />
                  </p>
                ))
              : (
                <>
                  {done.map((d) => (
                    <p key={d.k}>
                      <Line job={JOBS[d.j]} />
                    </p>
                  ))}
                  <p>
                    <Line job={JOBS[cur]} n={n} />
                    <span className="rl-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-orange-400" />
                  </p>
                </>
              )}
          </div>

          {/* footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-5 py-3 text-xs">
            <span className="font-mono text-slate-400">
              C:\Repairs&gt; type repairs.log
            </span>
            <span className="flex items-center gap-2 font-mono text-emerald-300">
              <span className="rl-live h-2 w-2 rounded-full bg-emerald-400" />
              live
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#book" className="rounded-2xl bg-orange-600 px-6 py-3 font-semibold shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500">
            Add yours to the log
          </a>
          <a
            href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hi, I'd like to book a home visit repair.")}`}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}