"use client";

import { useEffect, useState } from "react";

// ---- EDIT THESE (keep the hours the same as SystemStatusFooter.tsx) ----
const BRAND = "Doorstep Repairs";
const LOGO_SRC = "/LOGO2.png"; // file in the public/ folder, must match the name exactly
const PHONE = "94000000000"; // country code, no +
const PHONE_DISPLAY = "+94 00 000 0000";
const OPEN_HOUR = 8; // placeholder, set your real opening time
const CLOSE_HOUR = 21; // 9 PM
const TZ = "Asia/Colombo";
// ------------------------------------------------------------------------

const NAV = [
  { id: "symptoms", label: "What we fix" },
  { id: "xray", label: "Inside your device" },
  { id: "tracker", label: "How it works" },
  // { id: "repair-log", label: "Recent jobs" },
  { id: "contact", label: "Contact" },
];

const h12 = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

function Logo() {
  const [failed, setFailed] = useState(false);

  // if the image is missing or broken, show the four orange squares instead
  if (failed) {
    return (
      <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[9px] w-[9px] bg-orange-500" />
        ))}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt=""
      aria-hidden
      height={36}
      onError={() => setFailed(true)}
      className="h-8 w-auto object-contain sm:h-9"
    />
  );
}

export default function SiteHeader() {
  const [now, setNow] = useState<Date | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");

  // clock, for the open/closed pill
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // shadow after scrolling, and hide while the pinned X-ray section fills the screen
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 120) setActive("");
      const x = document.getElementById("xray");
      if (!x || !mq.matches) {
        setHidden(false);
        return;
      }
      const r = x.getBoundingClientRect();
      setHidden(r.top <= 8 && r.bottom >= window.innerHeight - 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // highlight the link of the section in the middle of the screen
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && window.scrollY >= 120) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Esc closes the mobile menu
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const hour = now ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false }).format(now)) % 24 : null;
  const open = hour === null ? true : hour >= OPEN_HOUR && hour < CLOSE_HOUR;
  const status = open ? `Open until ${h12(CLOSE_HOUR)}` : `Closed, opens ${h12(OPEN_HOUR)}`;
  const waMsg = encodeURIComponent("Hi, I'd like to book a home visit repair.");

  return (
    <header className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <style>{`
        @keyframes sh-ping{0%{box-shadow:0 0 0 0 rgba(16,185,129,.55)}100%{box-shadow:0 0 0 8px rgba(16,185,129,0)}}
        .sh-live{animation:sh-ping 1.8s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.sh-live{animation:none}}
      `}</style>

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-slate-100 bg-gray-200 shadow-md shadow-black/10"
            : "border-slate-100/70 bg-gray-200"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5 lg:h-16 lg:px-10">
          {/* brand */}
          <a href="#" className="flex items-center gap-3 text-slate-900" aria-label={`${BRAND}, back to top`}>
            <Logo />
          </a>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => {
              const on = active === n.id;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  aria-current={on ? "true" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                    on ? "bg-gray-100 text-slate-900" : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                  }`}
                >
                  {n.label}
                  {on && <span className="absolute inset-x-0 -bottom-[7px] mx-auto h-0.5 w-5 rounded bg-orange-500" />}
                </a>
              );
            })}
          </nav>

          {/* right side */}
          <div className="flex items-center gap-3">
            <span
              className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold md:flex ${
                open ? "border-emerald-600/30 bg-emerald-50 text-emerald-700" : "border-amber-600/30 bg-amber-50 text-amber-700"
              }`}
              suppressHydrationWarning
            >
              <span className={`h-2 w-2 rounded-full ${open ? "sh-live bg-emerald-500" : "bg-amber-500"}`} />
              {status}
            </span>

            <a href={`tel:+${PHONE}`} className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600 xl:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              {PHONE_DISPLAY}
            </a>

            <a
              href="#book"
              className="hidden rounded-xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500 sm:inline-flex"
            >
              Book a visit
            </a>

            {/* mobile menu button */}
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-800 transition hover:border-orange-500 lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {menu && (
        <div
          id="mobile-menu"
          className="absolute inset-x-3 top-full mt-2 overflow-hidden rounded-xl border border-slate-300 bg-gray-200 shadow-2xl shadow-black/20 lg:hidden"
        >
          <ul className="p-2">
            {NAV.map((n) => {
              const on = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setMenu(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                      on ? "bg-gray-100 text-slate-900" : "text-slate-700 hover:bg-gray-100"
                    }`}
                  >
                    {n.label}
                    {on && <span className="h-4 w-0.5 rounded bg-orange-500" />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-slate-300 bg-gray-100 p-4">
            <p className={`mb-3 flex items-center gap-2 text-xs font-semibold ${open ? "text-emerald-700" : "text-amber-700"}`}>
              <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-amber-500"}`} />
              {status}
            </p>
            <a
              href="#book"
              onClick={() => setMenu(false)}
              className="mb-3 block rounded-xl bg-orange-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-600/25"
            >
              Book a visit
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:+${PHONE}`} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-orange-700">
                Call now
              </a>
              <a
                href={`https://wa.me/${PHONE}?text=${waMsg}`}
                className="rounded-xl border border-emerald-600/40 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}