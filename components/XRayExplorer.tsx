"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ─── SVG helpers ─── */
const O = "#fb923c";
const W = "rgba(255,255,255,0.35)";

type Dim = { dim?: boolean };

const stroke = (dim?: boolean) => ({
  className: "xr-line",
  pathLength: 1,
  fill: "none" as const,
  stroke: dim ? W : O,
  strokeWidth: dim ? 1.4 : 2.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const Path = ({ d, dim }: { d: string } & Dim) => (
  <path d={d} {...stroke(dim)} />
);
const Rect = ({
  x, y, w, h, rx = 0, dim,
}: { x: number; y: number; w: number; h: number; rx?: number } & Dim) => (
  <rect x={x} y={y} width={w} height={h} rx={rx} {...stroke(dim)} />
);
const Circ = ({
  cx, cy, r, dim,
}: { cx: number; cy: number; r: number } & Dim) => (
  <circle cx={cx} cy={cy} r={r} {...stroke(dim)} />
);

/* ─── Types ─── */
type Hot = {
  id: string;
  label: string;
  x: number;
  y: number;
  problem: string;
  fix: string;
  time: string;
};

type Device = {
  id: string;
  name: string;
  tagline: string;
  art: ReactNode;
  hots: Hot[];
};

const DEVICES: Device[] = [
  {
    id: "laptop",
    name: "Laptop",
    tagline: "Where laptops fail most often.",
    art: (
      <>
        <Rect x={110} y={40} w={380} h={215} rx={14} />
        <Rect x={126} y={56} w={348} h={183} rx={6} dim />
        <Circ cx={300} cy={48} r={3} dim />
        <Path d="M300 239 V255" dim />
        <Path d="M100 258 H500 L540 296 H60 Z" />
        <Path d="M60 296 H540 V306 Q540 312 534 312 H66 Q60 312 60 306 Z" />
        <Rect x={130} y={266} w={110} h={20} rx={3} dim />
        <Rect x={275} y={268} w={50} h={16} rx={2} dim />
        <Circ cx={420} cy={277} r={11} dim />
        <Path d="M420 266 V288 M409 277 H431" dim />
      </>
    ),
    hots: [
      {
        id: "screen",
        label: "Screen",
        x: 300, y: 140,
        problem: "Cracked, flickering, or lines across the display.",
        fix: "Replace the panel or reseat a loose display cable.",
        time: "1–2 hrs",
      },
      {
        id: "battery",
        label: "Battery",
        x: 185, y: 276,
        problem: "Won't charge, drains fast, or the case is bulging.",
        fix: "Test it, then fit a replacement battery.",
        time: "30 min",
      },
      {
        id: "ram",
        label: "RAM & SSD",
        x: 300, y: 276,
        problem: "Very slow, freezing, random restarts.",
        fix: "Upgrade RAM and move to a fast SSD. Your data is cloned across.",
        time: "45–90 min",
      },
      {
        id: "fan",
        label: "Cooling fan",
        x: 420, y: 277,
        problem: "Loud fan, hot base, sudden shutdowns.",
        fix: "Open up, clean the dust, renew thermal paste or the fan.",
        time: "45–60 min",
      },
    ],
  },
  {
    id: "pc",
    name: "Desktop PC",
    tagline: "Inside a tower, one part usually fails.",
    art: (
      <>
        <Rect x={200} y={30} w={200} h={340} rx={14} />
        <Rect x={214} y={46} w={172} h={308} rx={6} dim />
        <Rect x={270} y={80} w={60} h={60} rx={6} dim />
        <Circ cx={300} cy={110} r={22} />
        <Path d="M300 88 V132 M278 110 H322 M284 94 L316 126 M316 94 L284 126" dim />
        <Rect x={346} y={80} w={8} h={64} dim />
        <Rect x={358} y={80} w={8} h={64} dim />
        <Rect x={222} y={200} w={156} h={40} rx={6} />
        <Circ cx={262} cy={220} r={13} dim />
        <Circ cx={318} cy={220} r={13} dim />
        <Rect x={222} y={296} w={156} h={46} rx={6} dim />
        <Circ cx={300} cy={319} r={16} />
        <Path d="M300 303 V335 M284 319 H316" dim />
      </>
    ),
    hots: [
      {
        id: "cpu",
        label: "CPU fan",
        x: 300, y: 110,
        problem: "Overheating, loud fan, automatic shutdowns.",
        fix: "Clean the cooler, apply fresh paste, or replace the fan.",
        time: "30–45 min",
      },
      {
        id: "ram",
        label: "RAM",
        x: 356, y: 112,
        problem: "Beeps on start, crashes, corrupted files.",
        fix: "Test each stick and replace the faulty one.",
        time: "20–40 min",
      },
      {
        id: "gpu",
        label: "Graphics card",
        x: 300, y: 220,
        problem: "No display, screen artifacts, games crashing.",
        fix: "Reseat and clean it, or repair or replace the card.",
        time: "30–60 min",
      },
      {
        id: "psu",
        label: "Power supply",
        x: 300, y: 319,
        problem: "Won't turn on or powers off at random.",
        fix: "Test with a meter and swap the power supply.",
        time: "30 min",
      },
    ],
  },
  {
    id: "printer",
    name: "Printer",
    tagline: "Most printer faults are small and fixable.",
    art: (
      <>
        <Rect x={120} y={160} w={360} h={140} rx={14} />
        <Path d="M190 160 L208 80 H392 L410 160" />
        <Path d="M150 205 H450" dim />
        <Rect x={262} y={188} w={76} h={34} rx={6} />
        <Rect x={270} y={196} w={14} h={18} dim />
        <Rect x={290} y={196} w={14} h={18} dim />
        <Rect x={310} y={196} w={14} h={18} dim />
        <Circ cx={190} cy={262} r={14} dim />
        <Circ cx={190} cy={262} r={5} dim />
        <Rect x={400} y={176} w={64} h={26} rx={5} dim />
        <Circ cx={412} cy={189} r={3} dim />
        <Circ cx={426} cy={189} r={3} dim />
        <Path d="M200 300 V318 H400 V300" />
        <Rect x={220} y={312} w={160} h={44} rx={3} dim />
      </>
    ),
    hots: [
      {
        id: "head",
        label: "Print head",
        x: 300, y: 205,
        problem: "Streaky, faded, or blank pages.",
        fix: "Deep-clean the head or replace the cartridge.",
        time: "20–40 min",
      },
      {
        id: "tray",
        label: "Paper tray",
        x: 300, y: 100,
        problem: "Says no paper when it is loaded.",
        fix: "Realign the tray and clean the pickup roller.",
        time: "20 min",
      },
      {
        id: "roller",
        label: "Feed rollers",
        x: 190, y: 262,
        problem: "Paper jams and crumples.",
        fix: "Remove scraps, clean or replace worn rollers.",
        time: "30–60 min",
      },
      {
        id: "board",
        label: "Control board",
        x: 432, y: 189,
        problem: "Shows offline, error lights, won't connect.",
        fix: "Reinstall the driver, update firmware, rejoin the Wi-Fi.",
        time: "20–40 min",
      },
    ],
  },
  {
    id: "router",
    name: "WiFi router",
    tagline: "Slow or dropping WiFi usually starts here.",
    art: (
      <>
        <Rect x={80} y={250} w={440} h={80} rx={14} />
        <Rect x={143} y={90} w={14} h={160} rx={7} />
        <Rect x={293} y={70} w={14} h={180} rx={7} />
        <Rect x={443} y={90} w={14} h={160} rx={7} />
        <Path d="M240 50 Q300 10 360 50" dim />
        <Path d="M258 64 Q300 36 342 64" dim />
        <Circ cx={130} cy={290} r={5} dim />
        <Circ cx={160} cy={290} r={5} dim />
        <Circ cx={190} cy={290} r={5} dim />
        <Circ cx={220} cy={290} r={5} dim />
        <Rect x={332} y={278} w={26} h={20} rx={3} dim />
        <Rect x={366} y={278} w={26} h={20} rx={3} dim />
        <Rect x={400} y={278} w={26} h={20} rx={3} dim />
        <Circ cx={470} cy={288} r={9} />
      </>
    ),
    hots: [
      {
        id: "antenna",
        label: "Antenna",
        x: 300, y: 80,
        problem: "Weak signal and dead zones in some rooms.",
        fix: "Reposition or replace the antenna, add a mesh node if needed.",
        time: "30–45 min",
      },
      {
        id: "board",
        label: "Main board",
        x: 175, y: 290,
        problem: "Red blinking lights, keeps rebooting.",
        fix: "Reset, update firmware, or replace an overheating unit.",
        time: "20–40 min",
      },
      {
        id: "lan",
        label: "LAN ports",
        x: 379, y: 288,
        problem: "Wired devices won't connect.",
        fix: "Test the cable and port, move to a working port or replace.",
        time: "15–30 min",
      },
      {
        id: "power",
        label: "Power jack",
        x: 470, y: 288,
        problem: "Router is dead or restarts by itself.",
        fix: "Test the adapter voltage and replace the adapter or jack.",
        time: "15–30 min",
      },
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    tagline: "Office, home and gaming monitors.",
    art: (
      <>
        <Rect x={90} y={50} w={420} h={250} rx={12} />
        <Rect x={106} y={66} w={388} h={190} rx={6} dim />
        <Path d="M120 100 H480 M120 150 H480" dim />
        <Rect x={120} y={206} w={110} h={40} rx={4} />
        <Circ cx={140} cy={226} r={8} dim />
        <Circ cx={170} cy={226} r={8} dim />
        <Circ cx={200} cy={226} r={8} dim />
        <Path d="M270 300 L256 352 H344 L330 300" />
        <Path d="M210 356 H390" />
        <Rect x={400} y={272} w={20} h={10} rx={2} dim />
        <Rect x={428} y={272} w={20} h={10} rx={2} dim />
        <Rect x={456} y={272} w={20} h={10} rx={2} dim />
      </>
    ),
    hots: [
      {
        id: "backlight",
        label: "Backlight",
        x: 300, y: 128,
        problem: "Dim screen, dark patches, or flickering.",
        fix: "Replace the LED backlight strips or the panel cable.",
        time: "1–2 hrs",
      },
      {
        id: "psu",
        label: "Power board",
        x: 175, y: 226,
        problem: "Clicking, won't turn on, power light blinks.",
        fix: "Replace swollen capacitors or the power board.",
        time: "1–2 hrs",
      },
      {
        id: "hdmi",
        label: "HDMI and DisplayPort",
        x: 438, y: 277,
        problem: "No signal, or the picture cuts out.",
        fix: "Test the cable, clean the port or re-solder it.",
        time: "30–60 min",
      },
      {
        id: "stand",
        label: "Stand",
        x: 300, y: 330,
        problem: "Wobbly, sagging or loose on the desk.",
        fix: "Tighten or replace the stand, or fit a monitor arm.",
        time: "20–30 min",
      },
    ],
  },
];

const N = DEVICES.length;

export default function XRayExplorer() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [hot, setHot] = useState<Record<string, string>>({});
  const [drawn, setDrawn] = useState<Set<number>>(() => new Set([0]));

  // Track which panel is in view
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const panels = root.querySelectorAll<HTMLElement>("[data-device]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number(entry.target.getAttribute("data-device"));
          if (!Number.isNaN(i)) {
            setIdx(i);
            setDrawn((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
          }
        }
      },
      { root, threshold: 0.5 }
    );

    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>(`[data-device="${i}"]`);
    if (!panel) return;

    // Scroll only the horizontal scroller – not the page
    root.scrollTo({
      left: panel.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section id="xray" className="relative bg-[#08080a] text-white">
      <style>{`
        @keyframes xr-draw { to { stroke-dashoffset: 0 } }
        @keyframes xr-card { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        @keyframes xr-scan { 0% { top: 0; opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { top: 100%; opacity: 0 } }
        .xr-line { stroke-dasharray: 1; stroke-dashoffset: 1 }
        .xr-on .xr-line { animation: xr-draw 1.6s ease forwards }
        .xr-scan { animation: xr-scan 3s linear infinite }
        .xr-card { animation: xr-card 0.3s ease-out }
        .xr-scroller {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .xr-scroller::-webkit-scrollbar { display: none }
        .xr-panel {
          flex: 0 0 100%;
          width: 100%;
          min-width: 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        @media (prefers-reduced-motion: reduce) {
          .xr-line { stroke-dashoffset: 0 !important; animation: none !important }
          .xr-scan { display: none }
        }
      `}</style>

      <div className="pointer-events-none absolute -left-28 top-1/3 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px]" />

      {/* Header – NOT sticky so it never covers content */}
      <div className="relative z-20 border-b border-white/5 px-5 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:text-left">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              See inside your device
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-pretty text-sm text-slate-400 sm:max-w-none lg:mx-0">
              Hover or tap a glowing point to see the common problem and our fix.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-2 lg:justify-end" aria-label="Devices">
            {DEVICES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => goTo(i)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  idx === i
                    ? "border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                    : "border-white/15 bg-white/5 text-slate-300 hover:border-orange-400/50"
                }`}
              >
                {d.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto mt-3 h-[2px] max-w-7xl overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full origin-left bg-orange-500 transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${N > 1 ? idx / (N - 1) : 0})` }}
          />
        </div>
      </div>

      {/* Horizontal scroller */}
      <div ref={scrollerRef} className="xr-scroller">
        {DEVICES.map((d, i) => {
          const active = d.hots.find((h) => h.id === hot[d.id]);
          const isDrawn = drawn.has(i);

          return (
            <article
              key={d.id}
              data-device={i}
              id={`dev-${d.id}`}
              className="xr-panel px-5 py-8 lg:px-10 lg:py-10"
            >
              <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
                {/* Left: title + card (centred on phones only) */}
                <div className="min-w-0 text-center md:text-left">
                  <p className="font-mono text-xs tracking-wider text-orange-400">
                    Device {i + 1} of {N}
                  </p>
                  <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-slate-400">{d.tagline}</p>

                  <div className="mt-6 min-h-[12rem]">
                    {!active ? (
                      <div className="rounded-2xl border border-dashed border-white/15 px-5 py-6 text-sm text-slate-500">
                        Hover or tap a glowing point on the drawing.
                      </div>
                    ) : (
                      <div
                        key={active.id}
                        className="xr-card rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                      >
                        <p className="text-sm font-semibold text-orange-400">
                          {active.label}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                          Common problem
                        </p>
                        <p className="mt-0.5 text-slate-200">{active.problem}</p>
                        <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                          Our fix
                        </p>
                        <p className="mt-0.5 text-slate-200">{active.fix}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-between">
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                            Usually {active.time}
                          </span>
                          <a
                            href="#book"
                            className="text-sm font-semibold text-orange-400 hover:text-orange-300"
                          >
                            Book this fix →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: full x-ray drawing */}
                <div
                  className={`relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 ${
                    isDrawn ? "xr-on" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fb923c 1px, transparent 1px), linear-gradient(90deg, #fb923c 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {isDrawn && (
                    <div className="xr-scan pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
                  )}

                  <svg
                    viewBox="0 0 600 400"
                    className="relative h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))",
                    }}
                    role="img"
                    aria-label={`X-ray drawing of a ${d.name}`}
                  >
                    {d.art}
                  </svg>

                  {d.hots.map((h) => {
                    const on = hot[d.id] === h.id;
                    const select = () =>
                      setHot((prev) => ({ ...prev, [d.id]: h.id }));

                    return (
                      <button
                        key={h.id}
                        type="button"
                        onMouseEnter={select}
                        onFocus={select}
                        onClick={select}
                        aria-label={`${h.label}: show problem and fix`}
                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                        style={{
                          left: `${(h.x / 600) * 100}%`,
                          top: `${(h.y / 400) * 100}%`,
                        }}
                      >
                        <span className="relative flex h-9 w-9 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500/45" />
                          <span
                            className={`relative h-[15px] w-[15px] rounded-full border-2 border-white shadow-md transition ${
                              on ? "scale-125 bg-orange-500" : "bg-orange-500/90"
                            }`}
                          />
                        </span>
                        {on && (
                          <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-lg">
                            {h.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}