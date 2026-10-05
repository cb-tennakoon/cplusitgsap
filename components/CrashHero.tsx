"use client";

import { useEffect, useState } from "react";

const PHONE = "94000000000"; // country code, no +

const HEADLINE = ["Computer", "crashed?", "Relax,", "we", "come", "to", "you."];
const DEVICES = ["laptops", "PCs", "printers", "WiFi routers", "TVs and monitors"];

export default function CrashHero() {
  const [eta, setEta] = useState(45);
  const [dev, setDev] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const a = setInterval(() => setDev((d) => (d + 1) % DEVICES.length), 2200);
    const b = setInterval(() => setEta((m) => (m > 38 ? m - 1 : m)), 1800);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#08080a] text-white">
      <style>{`
        @keyframes h-up{from{opacity:0;transform:translateY(.5em) rotateX(60deg)}to{opacity:1;transform:none}}
        @keyframes h-fade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes h-ring{0%{transform:scale(.4);opacity:.8}100%{transform:scale(2.4);opacity:0}}
        @keyframes h-blink{50%{opacity:0}}
        @keyframes h-grid{to{background-position:0 44px}}
        .h-word{display:inline-block;opacity:0;transform-origin:bottom;animation:h-up .7s cubic-bezier(.2,.8,.2,1) forwards}
        .h-in{opacity:0;animation:h-fade .6s ease-out forwards}
        .h-ring{animation:h-ring 2s ease-out infinite}
        .h-cursor{animation:h-blink 1s steps(1) infinite}
        .h-grid{animation:h-grid 3s linear infinite}
        @media (prefers-reduced-motion:reduce){.h-word,.h-in,.h-ring,.h-cursor,.h-grid{animation-duration:.01s!important;animation-delay:0s!important;animation-iteration-count:1!important}}
      `}</style>

      {/* background */}
      <div className="h-grid pointer-events-none absolute inset-0 opacity-[.06] [background-image:linear-gradient(#f97316_1px,transparent_1px),linear-gradient(90deg,#f97316_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_60%_40%,#000,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-12 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-10 lg:pb-10 lg:pt-8">
        {/* copy */}
        <div className="w-full text-center lg:text-left">
          <div
            className="h-in mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 backdrop-blur-sm"
            style={{ animationDelay: "100ms" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Technician available now · arrives in about{" "}
            <b className="tabular-nums">{eta}</b> min
          </div>

          <h1
            aria-label="Computer crashed? Relax, we come to you."
            className="mb-5 text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.08] tracking-tight [perspective:600px]"
          >
            {HEADLINE.map((w, i) => (
              <span key={i}>
                <span
                  className={`h-word ${
                    i >= 2
                      ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
                      : ""
                  }`}
                  style={{ animationDelay: `${i * 80 + 150}ms` }}
                >
                  {w}
                </span>{" "}
                {i === 1 && <br />}
              </span>
            ))}
          </h1>

          <p
            className="h-in mx-auto mb-8 max-w-[44ch] text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg"
            style={{ animationDelay: "700ms" }}
          >
            Home visits for{" "}
            <span className="inline-block min-w-[6.5ch] font-semibold text-orange-400">
              {DEVICES[dev]}
            </span>{" "}
            and everything else that stopped working. We repair every PC and
            laptop brand, except Apple.
          </p>

          <div
            className="h-in flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "850ms" }}
          >
            <a
              href="#book"
              className="rounded-2xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Book a visit
            </a>
            <a
              href={`https://wa.me/${PHONE}`}
              className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-7 py-3.5 font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
            >
              WhatsApp us
            </a>
            <a
              href={`tel:+${PHONE}`}
              className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-orange-200 transition hover:-translate-y-0.5 hover:border-orange-400/40"
            >
              Call now
            </a>
          </div>

          <div
            className="h-in mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 lg:justify-start"
            style={{ animationDelay: "1000ms" }}
          >
            {["Same-day visits", "Fixed price upfront", "30-day warranty"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-orange-500">✔</span>
                  {t}
                </span>
              )
            )}
          </div>

          <div
            className="h-in mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            style={{ animationDelay: "1150ms" }}
          >
            {["Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Samsung", "Toshiba"].map(
              (b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                >
                  {b}
                </span>
              )
            )}
            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
              No Apple / Mac
            </span>
            <span className="text-xs text-slate-500">and all other brands</span>
          </div>
        </div>

        {/* Windows-style repair window */}
        <div
          className="h-in mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
          style={{ animationDelay: "500ms", perspective: "1200px" }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({
              x: ((e.clientY - r.top) / r.height - 0.5) * -8,
              y: ((e.clientX - r.left) / r.width - 0.5) * 10,
            });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div
            className="flex flex-col gap-3 transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {/* Window 1: technician arriving */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1f23] text-white shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between bg-[#2b2b30] pl-3">
                <div className="flex items-center gap-2 py-2 text-xs text-slate-300">
                  <span className="grid grid-cols-2 gap-[2px]">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="h-[6px] w-[6px] bg-orange-500" />
                    ))}
                  </span>
                  Dispatch - Live
                </div>
                <div className="flex text-slate-400">
                  <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">
                    &#8212;
                  </span>
                  <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">
                    &#9633;
                  </span>
                  <span className="grid h-9 w-11 place-items-center text-sm hover:bg-red-600 hover:text-white">
                    &#10005;
                  </span>
                </div>
              </div>

              <div className="p-4 pb-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Technician arriving in
                    </p>
                    <p className="text-4xl font-bold tabular-nums text-orange-400">
                      {eta}
                      <span className="ml-1 text-lg font-medium text-slate-400">
                        min
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> En
                    route
                  </div>
                </div>

                <svg viewBox="0 0 400 100" className="mt-1 w-full" aria-hidden>
                  <path
                    id="h-route"
                    d="M20 84 C90 84 110 40 190 56 S300 84 372 40"
                    fill="none"
                    stroke="#f97316"
                    strokeOpacity=".5"
                    strokeWidth="2"
                    strokeDasharray="6 7"
                  />
                  <circle cx="20" cy="84" r="5" fill="#64748b" />
                  <text
                    x="372"
                    y="16"
                    textAnchor="end"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    Your home
                  </text>
                  <g transform="translate(372 40)">
                    <circle r="6" fill="#f97316" />
                    <circle
                      r="10"
                      fill="none"
                      stroke="#f97316"
                      className="h-ring"
                      style={{ transformOrigin: "center" }}
                    />
                  </g>
                  <g>
                    <circle r="7" fill="#fff" />
                    <circle r="3.5" fill="#ea580c" />
                    <animateMotion dur="9s" repeatCount="indefinite" rotate="0">
                      <mpath href="#h-route" />
                    </animateMotion>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}