"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// ---- EDIT THESE ----
const BRAND = "C Plus iT Solutions";
const LOGO = "/LOGO2.png";
const PHONE = "94717714492";
const PHONE_DISPLAY = "+94 717 714 492";
const EMAIL = "info@cplusit.com";

const OPEN_HOUR = 8;
const OPEN_MINUTE = 0;

const CLOSE_HOUR = 19; // 7:30 PM
const CLOSE_MINUTE = 30;

const TZ = "Asia/Colombo";

const AREAS = [
  "Kelaniya",
  "Wattala",
  "Kiribathgoda",
  "Peliyagoda",
  "Mulleriyawa / Kolonnawa",
  "Sapugakanda",
  "Makola",
  "Siyambalape",
  "Mahara",
  "Kaduwela",
  "Angoda",
  "Thalawathugoda",
  "Nawala",
  "Biyagama",
  "Colombo 1 to 15",
  "Nugegoda",
  "Rajagiriya",
  "Battaramulla",
  "Kotte",
];

const LINKS = [
  { label: "What we fix", href: "#symptoms" },
  { label: "See inside your device", href: "#xray" },
  { label: "How a visit works", href: "#tracker" },
  { label: "Book a visit", href: "#book" },
];
// --------------------

const formatTime = (hour: number, minute: number = 0) => {
  const period = hour < 12 ? "AM" : "PM";
  const h = hour % 12 || 12;
  if (minute === 0) return `${h} ${period}`;
  return `${h}:${String(minute).padStart(2, "0")} ${period}`;
};

export default function SystemStatusFooter() {
  const [now, setNow] = useState<Date | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!mapOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMapOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapOpen]);

  const hour = now
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: TZ,
          hour: "numeric",
          hour12: false,
        }).format(now)
      ) % 24
    : null;

  const minute = now
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: TZ,
          minute: "numeric",
        }).format(now)
      )
    : 0;

  // Open from 8:00 to 19:30
  const open =
    hour === null
      ? true
      : hour > OPEN_HOUR && hour < CLOSE_HOUR
        ? true
        : hour === OPEN_HOUR && minute >= OPEN_MINUTE
          ? true
          : hour === CLOSE_HOUR && minute < CLOSE_MINUTE
            ? true
            : false;

  const clock = now
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        hour: "numeric",
        minute: "2-digit",
      }).format(now)
    : "";

  const date = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(now)
    : "";

  const services = [
    { label: "Home Visits", on: "Available", off: "Closed now" },
    { label: "Office Visits", on: "Available", off: "Closed now" },
    {
      label: "WhatsApp",
      on: "Replying now",
      off: `Replies at ${formatTime(OPEN_HOUR, OPEN_MINUTE)}`,
    },
    {
      label: "Phone",
      on: "Answering",
      off: `Opens at ${formatTime(OPEN_HOUR, OPEN_MINUTE)}`,
    },
  ];

  const waMsg = encodeURIComponent(
    "Hi, I'd like to book a home or office visit repair."
  );

  return (
    <footer
      id="contact"
      className="relative overflow-x-clip border-t border-white/10 bg-[#08080a] text-white"
    >
      <style>{`
        @keyframes sf-ping{0%{box-shadow:0 0 0 0 rgba(16,185,129,.55)}100%{box-shadow:0 0 0 10px rgba(16,185,129,0)}}
        .sf-live{animation:sf-ping 1.8s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.sf-live{animation:none}}
      `}</style>

      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-14 lg:px-10">
        {/* ---------- System Status ---------- */}
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

          <div
            className={`flex items-center justify-center gap-3 px-5 py-3 text-center text-sm font-semibold sm:text-base lg:justify-start lg:text-left ${
              open
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-amber-500/15 text-amber-300"
            }`}
            aria-live="polite"
          >
            <span className="text-lg">{open ? "✅" : "🕘"}</span>
            {open
              ? `All systems running · Home & Office visits available until ${formatTime(
                  CLOSE_HOUR,
                  CLOSE_MINUTE
                )}.`
              : `We're closed right now. We open at ${formatTime(
                  OPEN_HOUR,
                  OPEN_MINUTE
                )}. Leave a message and we will reply.`}
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <li
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-center lg:text-left"
                >
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p
                    className={`mt-1 flex items-center justify-center gap-2 text-sm font-semibold lg:justify-start ${
                      open ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        open ? "sf-live bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {open ? s.on : s.off}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`tel:+${PHONE}`}
                className="rounded-xl bg-orange-600 px-6 py-3 font-semibold shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
              >
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

        {/* ---------- SERVICE AREA CARD (Full width) ---------- */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1e]">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            {/* Map */}
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="group relative overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r"
              aria-label="View full service area map"
            >
              <Image
                src="/MAP.jpg"
                alt="Service area map – Kelaniya and surrounding areas within 5 km"
                width={800}
                height={500}
                className="h-full min-h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                <span className="rounded-full bg-black/70 px-5 py-2.5 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  Click to enlarge map
                </span>
              </div>
            </button>

            {/* Areas list */}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-orange-400">
                  Service Area
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                  Home + Office visits
                </span>
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Kelaniya + ~5 km radius
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                We come to your home or office within this area.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-500">
                Not on the list? Message us — we may still be able to come.
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Brand + Contact + Quick links ---------- */}
        <div className="grid gap-10 py-14 text-center sm:grid-cols-2 lg:grid-cols-3 lg:text-left">
          {/* Brand */}
          <div>
            <a
              href="#"
              aria-label={`${BRAND} home`}
              className="mx-auto inline-block lg:mx-0"
            >
              <Image
                src={LOGO}
                alt={BRAND}
                width={240}
                height={80}
                className="h-12 w-auto sm:h-14"
              />
            </a>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-400 lg:mx-0">
              One technician. We come to your{" "}
              <strong className="text-slate-300">home</strong> or{" "}
              <strong className="text-slate-300">office</strong>. Laptops, PCs,
              printers, WiFi and monitors.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-orange-400">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <a
                  href={`tel:+${PHONE}`}
                  className="transition hover:text-orange-300"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${PHONE}?text=${waMsg}`}
                  className="transition hover:text-orange-300"
                >
                  WhatsApp chat
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition hover:text-orange-300"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="text-slate-500">
                Daily, {formatTime(OPEN_HOUR, OPEN_MINUTE)} to{" "}
                {formatTime(CLOSE_HOUR, CLOSE_MINUTE)}
              </li>
            </ul>
          </div>

          {/* Quick links */}
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

      {/* ---------- Taskbar ---------- */}
      <div className="relative border-t border-white/10 bg-[#1b1b1f]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-x-6 gap-y-2 px-5 py-3 text-center text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:justify-between sm:text-left lg:px-10">
          <div className="flex items-center justify-center gap-3">
            <span className="grid grid-cols-2 gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-[7px] w-[7px] bg-orange-500" />
              ))}
            </span>
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <span>
                &copy; {now ? now.getFullYear() : 2026} {BRAND}. All rights
                reserved.
              </span>
              <span className="text-slate-500">
                Site developed by{" "}
                <a
                  href="https://cb95.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 underline underline-offset-4 transition hover:text-orange-300"
                >
                  cb95.xyz
                </a>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="hidden items-center gap-2 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  open ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {open ? "Online" : "Offline"}
            </span>
            {now && (
              <span
                className="text-center font-mono leading-tight text-slate-300 sm:text-right"
                suppressHydrationWarning
              >
                {clock}
                <br />
                <span className="text-slate-500">{date}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ---------- MAP LIGHTBOX ---------- */}
      {mapOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setMapOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Service area map"
        >
          <button
            type="button"
            onClick={() => setMapOpen(false)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Close map"
          >
            ×
          </button>

          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/MAP.jpg"
              alt="Service area map – Kelaniya and surrounding areas within 5 km"
              width={1200}
              height={800}
              className="h-auto max-h-[90vh] w-full object-contain"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-center text-sm text-white">
              <p className="font-semibold">Our service area</p>
              <p className="text-slate-300">
                Kelaniya centre · ~5 km radius · Home & Office visits
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}