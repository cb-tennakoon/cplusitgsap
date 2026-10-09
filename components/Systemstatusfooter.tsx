"use client";

import { useEffect, useState } from "react";

// ---- EDIT THESE ----
const BRAND = "Doorstep Repairs";
const PHONE = "94000000000"; // country code, no +
const PHONE_DISPLAY = "+94 00 000 0000";
const EMAIL = "hello@yourdomain.lk";
const OPEN_HOUR = 8; // 8 AM (placeholder, set your real opening time)
const CLOSE_HOUR = 21; // 9 PM
const TZ = "Asia/Colombo";
const SOCIAL = {
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage",
  youtube: "https://youtube.com/@yourchannel",
};
// Placeholder areas. List only the areas you really cover.
const AREAS = [
  "Colombo 1 to 15",
  "Nugegoda",
  "Dehiwala",
  "Mount Lavinia",
  "Rajagiriya",
  "Battaramulla",
  "Kotte",
  "Maharagama",
  "Kaduwela",
  "Piliyandala",
];
// --------------------

const h12 = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

const LINKS = [
  { label: "What we fix", href: "#symptoms" },
  { label: "See inside your device", href: "#xray" },
  { label: "How a visit works", href: "#tracker" },
  { label: "Recent jobs", href: "#repair-log" },
  { label: "Book a visit", href: "#book" },
];

function Icon({ name }: { name: "facebook" | "instagram" | "youtube" | "whatsapp" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  if (name === "facebook")
    return (
      <svg {...common} fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    );
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (name === "instagram")
    return (
      <svg {...common} {...stroke}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  if (name === "youtube")
    return (
      <svg {...common} {...stroke}>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9l5 3-5 3z" fill="currentColor" />
      </svg>
    );
  return (
    <svg {...common} {...stroke}>
      <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 19.4L3 21z" />
    </svg>
  );
}

export default function SystemStatusFooter() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);

  // Before mount we show the "open" text so server and client HTML match.
  const hour = now ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false }).format(now)) % 24 : null;
  const open = hour === null ? true : hour >= OPEN_HOUR && hour < CLOSE_HOUR;

  const clock = now ? new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(now) : "";
  const date = now ? new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "numeric", year: "numeric" }).format(now) : "";

  const services = [
    { label: "Home visits", on: "Available", off: "Closed now" },
    { label: "WhatsApp", on: "Replying now", off: `Replies at ${h12(OPEN_HOUR)}` },
    { label: "Phone", on: "Answering", off: `Opens at ${h12(OPEN_HOUR)}` },
  ];

  const waMsg = encodeURIComponent("Hi, I'd like to book a home visit repair.");

  return (
    <footer id="contact" className="relative overflow-x-clip border-t border-white/10 bg-[#08080a] text-white">
      <style>{`
        @keyframes sf-ping{0%{box-shadow:0 0 0 0 rgba(16,185,129,.55)}100%{box-shadow:0 0 0 10px rgba(16,185,129,0)}}
        .sf-live{animation:sf-ping 1.8s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.sf-live{animation:none}}
      `}</style>
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-14 lg:px-10">
        {/* ---------- System Status window ---------- */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1f23] shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between bg-[#2b2b30] pl-3">
            <div className="flex items-center gap-2 py-2 text-xs text-slate-300">
              <span className="grid grid-cols-2 gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[6px] w-[6px] bg-orange-500" />
                ))}
              </span>
              System Status
            </div>
            <div className="flex text-slate-400">
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">&#8212;</span>
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-white/10">&#9633;</span>
              <span className="grid h-9 w-11 place-items-center text-sm hover:bg-red-600 hover:text-white">&#10005;</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold sm:text-base ${
              open ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
            }`}
            aria-live="polite"
          >
            <span className="text-lg">{open ? "✅" : "🕘"}</span>
            {open
              ? `All systems running, we're open until ${h12(CLOSE_HOUR)}.`
              : `We're closed right now. We open at ${h12(OPEN_HOUR)}. Leave a message and we will reply.`}
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <ul className="grid gap-3 sm:grid-cols-3">
              {services.map((s) => (
                <li key={s.label} className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`mt-1 flex items-center gap-2 text-sm font-semibold ${open ? "text-emerald-300" : "text-amber-300"}`}>
                    <span className={`h-2 w-2 rounded-full ${open ? "sf-live bg-emerald-400" : "bg-amber-400"}`} />
                    {open ? s.on : s.off}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:+${PHONE}`} className="rounded-xl bg-orange-600 px-6 py-3 font-semibold shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500">
                Call now
              </a>
              <a
                href={`https://wa.me/${PHONE}?text=${waMsg}`}
                className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Columns ---------- */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr_1fr]">
          <div>
            <p className="text-xl font-bold">{BRAND}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              One technician, repairs at your door: laptops, PCs, printers, WiFi and home electronics. All PC and laptop brands, except Apple.
            </p>
            <div className="mt-5 flex gap-3">
              {(
                [
                  ["facebook", SOCIAL.facebook, "Facebook"],
                  ["instagram", SOCIAL.instagram, "Instagram"],
                  ["youtube", SOCIAL.youtube, "YouTube"],
                  ["whatsapp", `https://wa.me/${PHONE}`, "WhatsApp"],
                ] as const
              ).map(([n, href, label]) => (
                <a
                  key={n}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:text-orange-300"
                >
                  <Icon name={n} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-orange-400">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <a href={`tel:+${PHONE}`} className="transition hover:text-orange-300">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${PHONE}?text=${waMsg}`} className="transition hover:text-orange-300">
                  WhatsApp chat
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="transition hover:text-orange-300">
                  {EMAIL}
                </a>
              </li>
              <li className="text-slate-500">
                Daily, {h12(OPEN_HOUR)} to {h12(CLOSE_HOUR)}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-orange-400">Service areas</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <li key={a} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Not on the list? Message us and we will tell you if we can come.</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-orange-400">Quick links</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-orange-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------- Windows-style taskbar ---------- */}
      <div className="relative border-t border-white/10 bg-[#1b1b1f]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 text-xs text-slate-400 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="grid grid-cols-2 gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-[7px] w-[7px] bg-orange-500" />
              ))}
            </span>
            <span>
              &copy; {now ? now.getFullYear() : 2026} {BRAND}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 sm:flex">
              <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-amber-400"}`} />
              {open ? "Online" : "Offline"}
            </span>
            {now && (
              <span className="text-right font-mono leading-tight text-slate-300" suppressHydrationWarning>
                {clock}
                <br />
                <span className="text-slate-500">{date}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}