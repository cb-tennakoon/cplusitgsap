"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PHONE = "94717714492";
const HEADLINE = ["Computer", "crashed?", "Relax,", "we", "come", "to", "you."];
const DEVICES = ["Laptops", "PCs", "Printers", "WiFi routers", "Monitors"];

// Real working photos
const RAW: [string, string, string, number][] = [
  ["Laptop", "Cracked screen replaced at home", "/heroimg/Laptop.jpg", 25],
  ["PC", "Slow desktop cleaned & upgraded to SSD", "/heroimg/PC.jpg", 210],
  ["Printer", "Jammed printer fixed, head cleaned", "/heroimg/Printer.jpg", 160],
  ["WiFi", "Dead-zone router setup and tuning", "/heroimg/WiFi.jpg", 195],
  ["Data", "Virus removed, files safely recovered", "/heroimg/Data.jpg", 140],
  ["Battery", "Worn-out laptop battery replaced", "/heroimg/Battery.jpg", 95],
  ["Keyboard", "Spilled-drink keyboard swapped", "/heroimg/Keyboard.jpg", 270],
  ["Monitor", "Flickering monitor diagnosed", "/heroimg/Monitor.jpg", 230],
  ["RAM", "Memory upgrade for smooth multitasking", "/heroimg/RAM.jpg", 300],
  ["Network", "Home network cabling and setup", "/heroimg/Network.jpg", 180],
  ["Windows", "Fresh Windows install + drivers", "/heroimg/Windows.jpg", 205],
  ["Cooling", "Overheating fixed: fan + new paste", "/heroimg/Cooling.jpg", 10],
  ["Electronics", "Small electronics & gadget repair", "/heroimg/Electronics.jpg", 40],
  ["Backup", "Backup and cloud storage set up", "/heroimg/Backup.jpg", 215],
  ["Gaming", "Gaming PC tuned for smooth play", "/heroimg/Gaming.jpg", 280],
];

const SLIDES = RAW.map(([tag, title, src, hue]) => ({
  src,
  tag,
  title,
  hue,
  alt: `${tag} repair: ${title}`,
}));

const SLIDE_S = 5;
const ETA_MIN = 46;
const ETA_MAX = 72;
const randomEta = () => ETA_MIN + Math.floor(Math.random() * (ETA_MAX - ETA_MIN + 1));

const bg = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 18%), hsl(${(hue + 35) % 360} 50% 9%))`;

export default function CrashHero() {
  const rootRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLSpanElement>(null);
  const api = useRef({ next: () => {}, prev: () => {}, to: (_n: number) => {} });

  const [eta, setEta] = useState(52);
  const [dev, setDev] = useState(0);
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // ETA + device word
  useEffect(() => {
    setEta(randomEta());
    const a = setInterval(() => setDev((d) => (d + 1) % DEVICES.length), 2200);
    const b = setInterval(() => {
      setEta((m) => {
        const step = [-1, -1, 0, 1][Math.floor(Math.random() * 4)];
        return Math.min(ETA_MAX, Math.max(ETA_MIN, m + step));
      });
    }, 4000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  useEffect(() => {
    if (!devRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      devRef.current,
      { yPercent: 70, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, [dev]);

  // Center active thumbnail
  useEffect(() => {
    const rail = railRef.current;
    const btn = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !btn) return;
    rail.scrollTo({
      left: btn.offsetLeft - rail.clientWidth / 2 + btn.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  // Main GSAP + carousel logic
  useEffect(() => {
    const root = rootRef.current;
    const deck = deckRef.current;
    const rail = railRef.current;
    if (!root || !deck || !rail) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = SLIDES.length;
    const cleanups: Array<() => void> = [];
    let current = 0;
    let hovering = false;
    let prog: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const goTo = (n: number) => {
        if (isAnimating) return;
        const next = (n + N) % N;
        if (next === current) return;

        setIsAnimating(true);
        current = next;
        setActive(current);

        // Crossfade the main card
        const cards = deck.querySelectorAll(".slide-card");
        cards.forEach((card, i) => {
          if (i === current) {
            gsap.fromTo(
              card,
              { opacity: 0, scale: 1.04, y: 12 },
              { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" }
            );
          } else {
            gsap.to(card, { opacity: 0, scale: 0.98, duration: 0.5, ease: "power2.in" });
          }
        });

        // Progress bar
        prog?.kill();
        if (!reduce) {
          prog = gsap.fromTo(
            barRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: SLIDE_S,
              ease: "none",
              onComplete: () => {
                if (!hovering) goTo(current + 1);
              },
            }
          );
          if (hovering) prog.pause();
        }

        setTimeout(() => setIsAnimating(false), 700);
      };

      api.current = {
        next: () => goTo(current + 1),
        prev: () => goTo(current - 1),
        to: goTo,
      };

      // Initial
      goTo(0);

      // Entrance
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".g-badge", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
          .fromTo(".g-word", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06 }, "-=0.4")
          .fromTo(".g-fade", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.5")
          .fromTo(".g-chip", { y: 12, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.03 }, "-=0.4")
          .fromTo(".g-deck", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.2)
          .fromTo(".g-rail", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.7);
      } else {
        gsap.set(".g-badge,.g-word,.g-fade,.g-chip,.g-deck,.g-rail", { opacity: 1 });
      }

      // Floating badges
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>(".g-float").forEach((el, i) =>
          gsap.to(el, {
            y: i % 2 ? -7 : 7,
            duration: 2.4 + i * 0.3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          })
        );
      }

      // Pause on hover
      const enter = () => {
        hovering = true;
        prog?.pause();
      };
      const leave = () => {
        hovering = false;
        prog?.resume();
      };
      deck.addEventListener("mouseenter", enter);
      deck.addEventListener("mouseleave", leave);

      // Swipe
      let x0 = 0;
      const down = (e: PointerEvent) => (x0 = e.clientX);
      const up = (e: PointerEvent) => {
        const dx = e.clientX - x0;
        if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
      };
      deck.addEventListener("pointerdown", down);
      deck.addEventListener("pointerup", up);

      cleanups.push(() => {
        deck.removeEventListener("mouseenter", enter);
        deck.removeEventListener("mouseleave", leave);
        deck.removeEventListener("pointerdown", down);
        deck.removeEventListener("pointerup", up);
      });

      // Thumbnail rail wheel + drag
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        e.preventDefault();
        rail.scrollLeft += e.deltaY;
      };

      let dragging = false;
      let moved = false;
      let sx = 0;
      let sl = 0;

      const rDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        dragging = true;
        moved = false;
        sx = e.clientX;
        sl = rail.scrollLeft;
      };
      const rMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 4) moved = true;
        rail.scrollLeft = sl - dx;
      };
      const rUp = () => (dragging = false);
      const rClick = (e: MouseEvent) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      };

      rail.addEventListener("wheel", onWheel, { passive: false });
      rail.addEventListener("pointerdown", rDown);
      window.addEventListener("pointermove", rMove);
      window.addEventListener("pointerup", rUp);
      rail.addEventListener("click", rClick, true);

      cleanups.push(() => {
        rail.removeEventListener("wheel", onWheel);
        rail.removeEventListener("pointerdown", rDown);
        window.removeEventListener("pointermove", rMove);
        window.removeEventListener("pointerup", rUp);
        rail.removeEventListener("click", rClick, true);
      });
    }, root);

    return () => {
      cleanups.forEach((f) => f());
      prog?.kill();
      ctx.revert();
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const current = SLIDES[active];

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#08080a] text-white">
      <style>{`
        .h-noscroll{scrollbar-width:none}
        .h-noscroll::-webkit-scrollbar{display:none}
      `}</style>

      {/* bg */}
      <div className="pointer-events-none absolute inset-0 opacity-[.05] [background-image:linear-gradient(#f97316_1px,transparent_1px),linear-gradient(90deg,#f97316_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 pb-14 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14 lg:pb-12 lg:pt-8">
          
          {/* LEFT */}
          <div className="g-left w-full min-w-0 text-center lg:text-left">
            <div className="g-badge mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-[13px] font-semibold text-orange-300 opacity-0 sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>
                <span className="sm:hidden">Available now · ~</span>
                <span className="hidden sm:inline">Technician available now · arrives in about </span>
                <b className="tabular-nums">{eta}</b> min
              </span>
            </div>

            <h1 className="mb-5 text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.08] tracking-tight">
              {HEADLINE.map((w, i) => (
                <span key={i}>
                  <span className="inline-block overflow-hidden pb-[.1em] align-bottom">
                    <span
                      className={`g-word inline-block opacity-0 ${
                        i >= 2 ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent" : ""
                      }`}
                    >
                      {w}
                    </span>
                  </span>{" "}
                  {i === 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="g-fade mx-auto mb-8 max-w-[44ch] text-base leading-relaxed text-slate-400 opacity-0 lg:mx-0 lg:text-lg">
              Home & Office visits for{" "}
              <span className="inline-block min-w-[6.5ch] overflow-hidden align-bottom">
                <span ref={devRef} className="inline-block font-semibold text-orange-400">
                  {DEVICES[dev]}
                </span>
              </span>{" "}
              and everything else that stopped working. We repair every PC and laptop brand.
            </p>

            <div className="g-fade flex flex-wrap items-center justify-center gap-3 opacity-0 lg:justify-start">
              <a href="#book" className="rounded-2xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-500">
                Book a visit
              </a>
              <a href={`https://wa.me/${PHONE}`} className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-7 py-3.5 font-semibold text-emerald-300 transition hover:bg-emerald-500/20">
                WhatsApp us
              </a>
              <a href={`tel:+${PHONE}`} className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-orange-200 transition hover:border-orange-400/40">
                Call now
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 lg:justify-start">
              {["Same-day visits", "Fixed price upfront", "30-day warranty"].map((t) => (
                <span key={t} className="g-chip flex items-center gap-1.5 opacity-0">
                  <span className="text-orange-500">✔</span> {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {["Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Samsung","Toshiba"].map((b) => (
                <span key={b} className="g-chip rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 opacity-0">
                  {b}
                </span>
              ))}
              {/* <span className="g-chip rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 opacity-0">
                No Apple / Mac
              </span> */}
            </div>
          </div>

          {/* ========== RIGHT SIDE - FIXED ========== */}
          <div className="mx-auto w-full min-w-0 max-w-lg lg:mx-0 lg:max-w-none">
            <div className="g-deck relative opacity-0">
              {/* floating badges */}
              <div className="g-float absolute -top-3 right-2 z-30 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#0d1512]/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Next visit ~<b className="tabular-nums">{eta}</b> min
              </div>
              <div className="g-float absolute -bottom-2 left-3 z-30 hidden rounded-full border border-orange-400/30 bg-[#16100b]/90 px-3.5 py-1.5 text-xs font-semibold text-orange-300 shadow-lg backdrop-blur-md sm:block">
                🏠 Home visit · Fixed price
              </div>

              {/* MAIN CARD */}
              <div
                ref={deckRef}
                tabIndex={0}
                role="region"
                aria-label="Recent repair work"
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") api.current.next();
                  if (e.key === "ArrowLeft") api.current.prev();
                }}
                className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 outline-none sm:h-[420px] lg:h-[460px]"
              >
                {SLIDES.map((s, i) => (
                  <div
                    key={s.src}
                    className={`slide-card absolute inset-0 transition-opacity ${
                      i === active ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                    style={{ background: bg(s.hue) }}
                  >
                    {/* Real photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={s.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={i < 3 ? "eager" : "lazy"}
                      draggable={false}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                    {/* Badge */}
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      Our recent work
                    </span>

                    {/* Number */}
                    <span className="absolute right-5 top-8 text-6xl font-black tabular-nums text-white/20 sm:text-7xl">
                      {pad(i + 1)}
                    </span>

                    {/* Caption */}
                    <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
                      <span className="mb-2 inline-block rounded-md bg-orange-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                        {s.tag}
                      </span>
                      <p className="max-w-[28ch] text-lg font-semibold leading-snug text-white">
                        {s.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="g-rail mt-5 flex items-center gap-3 opacity-0">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <div ref={barRef} className="h-full origin-left scale-x-0 bg-orange-500" />
              </div>
              <span className="text-xs font-medium tabular-nums text-slate-400">
                {pad(active + 1)} / {pad(SLIDES.length)}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="g-rail mt-3 flex items-center gap-2 opacity-0">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => api.current.prev()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-lg transition hover:bg-orange-600"
              >
                ‹
              </button>

              <div
                ref={railRef}
                className="h-noscroll flex min-w-0 flex-1 cursor-grab gap-2 overflow-x-auto py-1 active:cursor-grabbing"
              >
                {SLIDES.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    aria-label={`Show ${s.tag}`}
                    aria-current={i === active}
                    onClick={() => api.current.to(i)}
                    className={`relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded-lg border transition ${
                      i === active
                        ? "scale-105 border-orange-500 ring-2 ring-orange-500/40"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-center text-[9px] font-semibold text-white">
                      {s.tag}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Next"
                onClick={() => api.current.next()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-lg transition hover:bg-orange-600"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}