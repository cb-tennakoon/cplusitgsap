"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

const PHONE = "+94717714492"; // country code, no +
const LOG_ENDPOINT = "";

const DEVICES: { label: string; problems: string[] }[] = [
  { label: "Laptop", problems: ["Won't turn on", "Screen damaged", "Slow or freezing", "Battery or charger", "Overheating or loud fan"] },
  { label: "Desktop PC", problems: ["Won't turn on", "Slow or freezing", "Virus or pop-ups", "No display", "Upgrade"] },
  { label: "Printer", problems: ["Printing problem", "Paper jam", "Install or setup", "Poor print quality"] },
  { label: "WiFi / Router", problems: ["No signal in some rooms", "Keeps disconnecting", "New router setup", "Forgot password"] },
  { label: "Monitor", problems: ["No display", "Flickering screen", "Dead pixels / lines", "Port or connector issue", "Won't turn on"] },
  { label: "Something else", problems: [] },
];

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

const SLOTS = [
  { label: "Morning (9-12)", end: 12 },
  { label: "Afternoon (12-4)", end: 16 },
  { label: "Evening (4-7:30)", end: 19.5 },
];

type Field = "device" | "problem" | "area" | "day" | "slot" | "name";
type Answers = Partial<Record<Field, string>>;
type Full = { ref: string; name: string; device: string; problem: string; area: string; when: string };
type Msg = { id: number; from: "bot" | "user"; text?: string; summary?: Full; time?: string };
type Step = "busy" | Field | "confirm" | "done";

const ASAP = "ASAP";
const LATER = "Not sure yet";
const slotNeeded = (day?: string) => day !== ASAP && day !== LATER;

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nowTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const todayOpen = () => {
  const now = new Date().getHours() + new Date().getMinutes() / 60;
  return SLOTS.some((s) => s.end > now);
};

const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const dayFor = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const s = fmtDate(d);
  return offset === 0 ? `Today, ${s}` : offset === 1 ? `Tomorrow, ${s}` : s;
};

const whenOf = (a: Answers) =>
  a.day === ASAP ? "As soon as possible" : a.day === LATER ? "Not sure yet" : `${a.day}, ${a.slot}`;

const REF_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const makeRef = () => "RB-" + Array.from({ length: 4 }, () => REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)]).join("");

const waText = (b: Full) =>
  [
    "Hi, I'd like to book a home visit repair.",
    `Ref: ${b.ref}`,
    b.name ? `Name: ${b.name}` : "",
    `Device: ${b.device}`,
    `Problem: ${b.problem}`,
    `Area: ${b.area}`,
    `When: ${b.when}`,
  ]
    .filter(Boolean)
    .join("\n");

const DRAFT_KEY = "rb-draft";
type Draft = { name: string; area: string };
function loadDraft(): Draft {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    return { name: typeof d.name === "string" ? d.name : "", area: typeof d.area === "string" ? d.area : "" };
  } catch {
    return { name: "", area: "" };
  }
}
function saveDraft(d: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {}
}

function logBooking(b: Full) {
  if (!LOG_ENDPOINT) return;
  try {
    fetch(LOG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b), keepalive: true }).catch(() => {});
  } catch {}
}

const DEVICE_RX: [string, RegExp][] = [
  ["Laptop", /\b(laptop|notebook|macbook|chromebook)s?\b/],
  ["Desktop PC", /\b(desktop|pc|cpu|computer|tower)s?\b/],
  ["Printer", /\b(printer|scanner|toner|cartridge)s?\b/],
  ["WiFi / Router", /\b(wi-?fi|router|modem|internet|network)\b/],
  ["Monitor", /\b(monitor|screen|display)\b/],
];

const PROBLEM_RX: [string, RegExp][] = [
  ["Won't turn on", /(won'?t|not|doesn'?t|does not|can'?t).{0,12}(turn|power|start|boot|switch) on|\bdead\b|no power/],
  ["Screen damaged", /crack|smash|shatter|broken screen|lines on (the )?screen|flicker/],
  ["Virus or pop-ups", /virus|malware|pop-?ups?|hacked/],
  ["Slow or freezing", /\b(slow|lag|laggy|freez\w*|hang\w*)\b/],
  ["Battery or charger", /battery|charg/],
  ["Overheating or loud fan", /overheat|\bfan\b|noisy|too hot/],
  ["Paper jam", /\bjam/],
  ["Printing problem", /(won'?t|not) print|print quality|streak|faded/],
  ["Keeps disconnecting", /disconnect|dropping|keeps dropping/],
  ["No signal in some rooms", /no signal|dead zone|weak signal/],
  ["No display", /no (picture|display|video|image)|black screen|blank screen/],
  ["Flickering screen", /flicker|flickering/],
  ["Dead pixels / lines", /dead pixel|lines on|vertical line|horizontal line/],
  ["Port or connector issue", /hdmi|usb port|\bport\b|vga|displayport/],
  ["Upgrade", /upgrade|\bssd\b|\bram\b|more storage/],
  ["Install or setup", /install|reinstall|set ?up|windows/],
];

const AREA_RX = AREAS.map((a) => [a, new RegExp(`\\b${a.toLowerCase().replace(/[\/]/g, "\\$&")}\\b`)] as const);
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const WEEKDAY_RX = /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tues?|wed|thu|thurs?|fri|sat)\b/;

function nextWeekday(idx: number) {
  let off = (idx - new Date().getDay() + 7) % 7;
  if (off === 0) off = 7;
  return dayFor(off);
}

function extract(raw: string): Answers {
  const t = raw.toLowerCase().replace(/\bmt\.? lavinia\b/, "mount lavinia");
  const out: Answers = {};

  for (const [label, rx] of DEVICE_RX) if (rx.test(t)) { out.device = label; break; }
  for (const [label, rx] of PROBLEM_RX) if (rx.test(t)) { out.problem = label; break; }

  const num = t.match(/\bcolombo\s*(\d{1,2})\b/);
  if (num) out.area = `Colombo ${Number(num[1])}`;
  else for (const [a, rx] of AREA_RX) if (rx.test(t)) { out.area = a; break; }

  if (/\b(urgent|asap|emergency|right away|immediately)\b/.test(t)) out.day = ASAP;
  else if (/\b(tomorrow|tmrw|tmr)\b/.test(t)) out.day = dayFor(1);
  else if (/\bweekend\b/.test(t)) out.day = nextWeekday(6);
  else {
    const w = t.match(WEEKDAY_RX);
    if (w) out.day = nextWeekday(WEEKDAYS.indexOf(w[1].slice(0, 3)));
    else if (/\b(today|tonight)\b/.test(t) && todayOpen()) out.day = dayFor(0);
  }

  if (/\bmorning\b/.test(t)) out.slot = SLOTS[0].label;
  else if (/\bafternoon\b/.test(t)) out.slot = SLOTS[1].label;
  else if (/\b(evening|night|tonight)\b/.test(t)) out.slot = SLOTS[2].label;

  return out;
}

const describe = (p: Answers) =>
  [p.device, p.problem, p.area, p.day && p.slot ? `${p.day}, ${p.slot}` : p.day ?? p.slot].filter(Boolean).join(", ");

function firstMissing(a: Answers): Field | null {
  if (!a.device) return "device";
  if (!a.problem) return "problem";
  if (!a.area) return "area";
  if (!a.day) return "day";
  if (slotNeeded(a.day) && !a.slot) return "slot";
  if (a.name === undefined) return "name";
  return null;
}

const promptFor = (f: Field, a: Answers) =>
  ({
    device: "What needs fixing?",
    problem: a.device && a.device !== "Something else" ? `${a.device}: what's the problem?` : "Describe what needs fixing.",
    area: "Which area are you in?",
    day: "When should we come?",
    slot: "What time of day suits you?",
    name: "Last one: what name should I put on the booking?",
  })[f];

const PLACEHOLDER: Record<Field, string> = {
  device: "Or type it all: laptop screen cracked, Kelaniya, tomorrow morning",
  problem: "Or describe the problem",
  area: "Or type your area",
  day: "Or type a day: Monday, tomorrow, asap",
  slot: "Or type: morning, afternoon, evening",
  name: "Your name",
};

function Chip({ label, onClick, i, tone = "orange" }: { label: string; onClick: () => void; i: number; tone?: "orange" | "slate" }) {
  const look =
    tone === "orange"
      ? "border-orange-400/50 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25 focus-visible:ring-orange-300"
      : "border-white/20 bg-white/10 text-slate-300 hover:bg-white/15 focus-visible:ring-white/40";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${i * 40}ms` }}
      className={`cb-pop cb-bot rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 ${look}`}
    >
      {label}
    </button>
  );
}

function Bubble({ m }: { m: Msg }) {
  const mine = m.from === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`cb-pop max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          mine
            ? "cb-user rounded-br-md bg-orange-600 text-white shadow-lg shadow-orange-900/30"
            : "cb-bot rounded-bl-md border border-white/10 bg-white/10 text-slate-100 backdrop-blur-sm"
        }`}
      >
        {m.summary ? (
          <div>
            <p className="mb-2 text-sm font-semibold text-orange-300">Booking {m.summary.ref}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {(
                [
                  ["Name", m.summary.name],
                  ["Device", m.summary.device],
                  ["Problem", m.summary.problem],
                  ["Area", m.summary.area],
                  ["When", m.summary.when],
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <Fragment key={k}>
                    <dt className="text-slate-400">{k}</dt>
                    <dd className="font-medium text-slate-100">{v}</dd>
                  </Fragment>
                ))}
            </dl>
          </div>
        ) : (
          <span className="whitespace-pre-wrap">{m.text}</span>
        )}
        {mine && m.time && (
          <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-orange-100/70">
            {m.time}
            <span aria-hidden className="text-emerald-200">✓✓</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function ChatBookingPro() {
  const boxRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const refCode = useRef("");
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("busy");
  const [ans, setAns] = useState<Answers>({});
  const [saved, setSaved] = useState<Draft>({ name: "", area: "" });
  const [booking, setBooking] = useState<Full | null>(null);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const push = useCallback((m: Omit<Msg, "id">) => {
    const id = idRef.current++;
    setMsgs((list) => [...list, { ...m, id }]);
  }, []);

  const say = useCallback(
    (lines: (string | Full)[], next: Step) => {
      setStep("busy");
      const fast = prefersReduced();
      let at = 0;
      lines.forEach((line) => {
        const len = typeof line === "string" ? line.length : 40;
        if (!fast) {
          later(() => setTyping(true), at);
          at += 600 + Math.min(len * 14, 800);
        }
        later(() => {
          setTyping(false);
          push(typeof line === "string" ? { from: "bot", text: line } : { from: "bot", summary: line });
        }, at);
        if (!fast) at += 250;
      });
      later(() => setStep(next), at + (fast ? 0 : 150));
    },
    [later, push]
  );

  const intro = useCallback(() => {
    const d = loadDraft();
    setSaved(d);
    setAns(d.name ? { name: d.name } : {});
    say(
      [
        d.name ? `Welcome back, ${d.name}.` : "Hi! I'll get your repair booked in a few taps.",
        "What needs fixing? Pick one, or just type it all in one go.",
      ],
      "device"
    );
  }, [say]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          intro();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, [intro]);

  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced() ? "auto" : "smooth" });
  }, [msgs, typing, step]);

  const user = (t: string) => push({ from: "user", text: t, time: nowTime() });

  const finish = (a: Answers, lead: string[]) => {
    if (!refCode.current) refCode.current = makeRef();
    const full: Full = {
      ref: refCode.current,
      name: a.name ?? "",
      device: a.device ?? "",
      problem: a.problem ?? "",
      area: a.area ?? "",
      when: whenOf(a),
    };
    setBooking(full);
    saveDraft({ name: full.name || saved.name, area: full.area });
    logBooking(full);
    say([...lead, "Here's your booking. Check it, then send it on WhatsApp.", full], "confirm");
  };

  const advance = (next: Answers, lead: string[]) => {
    const f = firstMissing(next);
    if (!f) finish(next, lead);
    else say([...lead, promptFor(f, next)], f);
  };

  const commit = (patch: Answers, lead: string[] = []) => {
    const next: Answers = { ...ans, ...patch };
    setAns(next);
    advance(next, lead);
  };

  const pick = (field: Field, value: string) => {
    user(value);
    commit({ [field]: value });
  };

  const skipName = () => {
    user("Skip");
    commit({ name: "" });
  };

  const handleText = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || step === "busy" || step === "confirm" || step === "done") return;
    user(t);
    setText("");

    if (step === "name") {
      commit({ name: t.replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 40) });
      return;
    }

    const patch = extract(t);
    if (step === "device" && !Object.keys(patch).length) {
      patch.device = "Something else";
      patch.problem = t.slice(0, 140);
    }
    if (step === "problem" && !patch.problem) patch.problem = t.slice(0, 140);
    if (step === "area" && !patch.area) {
      const c = t.replace(/[^\p{L}\p{N} .,'-]/gu, "").trim().slice(0, 60);
      if (c) patch.area = c;
    }
    if (patch.device && !patch.problem && !ans.problem && t.length >= 18) patch.problem = t.slice(0, 140);

    if (!Object.keys(patch).length) {
      say(
        [step === "day" || step === "slot" ? "I didn't catch that. Try 'tomorrow' or 'Monday', or tap an option." : "I didn't catch that. Tap an option or try again."],
        step
      );
      return;
    }
    commit(patch, Object.keys(patch).length >= 2 ? [`Got it: ${describe(patch)}.`] : []);
  };

  const change = (label: string, clear: Field[]) => {
    user(`Change the ${label.toLowerCase()}`);
    const next: Answers = { ...ans };
    clear.forEach((f) => delete next[f]);
    setAns(next);
    advance(next, []);
  };

  const copy = async () => {
    if (!booking) return;
    try {
      await navigator.clipboard.writeText(waText(booking));
      setCopied(true);
      later(() => setCopied(false), 2000);
    } catch {}
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    refCode.current = "";
    setTyping(false);
    setMsgs([]);
    setBooking(null);
    setText("");
    intro();
  };

  const need: Field[] = ["device", "problem", "area", "day", ...(slotNeeded(ans.day) ? (["slot"] as Field[]) : []), "name"];
  const answered = need.filter((f) => (f === "name" ? ans.name !== undefined : !!ans[f])).length;
  const pct = Math.round((answered / need.length) * 100);

  const problems = DEVICES.find((d) => d.label === ans.device)?.problems ?? [];

  // Fixed filter: show all slots that haven't ended yet
  const nowDecimal = new Date().getHours() + new Date().getMinutes() / 60;
  const slotOptions = SLOTS.filter((s) => {
    if (!ans.day?.startsWith("Today")) return true;
    return s.end > nowDecimal;
  });

  const waHref = booking ? `https://wa.me/${PHONE}?text=${encodeURIComponent(waText(booking))}` : "#";
  const inputOn = step !== "confirm" && step !== "done";
  const field: Field | null = step === "busy" || step === "confirm" || step === "done" ? null : step;

  return (
    <section id="book" className="relative overflow-x-clip px-5 py-16 sm:py-20 lg:px-10">
      <style>{`
        @keyframes cb-pop{0%{opacity:0;transform:translateY(10px) scale(.85)}60%{opacity:1;transform:translateY(-1px) scale(1.03)}100%{opacity:1;transform:none}}
        @keyframes cb-dot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}
        @keyframes float1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.1)}}
        @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,15px) scale(1.05)}}
        @keyframes float3{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,25px)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .cb-pop{animation:cb-pop .32s cubic-bezier(.2,.9,.3,1.2) both}
        .cb-bot{transform-origin:bottom left}
        .cb-user{transform-origin:bottom right}
        .cb-dot{animation:cb-dot 1.1s infinite}
        .bg-animate{
          background: linear-gradient(-45deg, #1a1a1f, #2a2a32, #1e1e24, #25252d, #1c1c22);
          background-size: 400% 400%;
          animation: gradientShift 14s ease infinite;
        }
        .blob1{animation:float1 9s ease-in-out infinite}
        .blob2{animation:float2 11s ease-in-out infinite}
        .blob3{animation:float3 8s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){
          .cb-pop,.cb-dot,.bg-animate,.blob1,.blob2,.blob3{animation:none}
        }
      `}</style>

      <div className="bg-animate absolute inset-0" />
      <div className="blob1 pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-500/15 blur-[100px]" />
      <div className="blob2 pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-emerald-500/12 blur-[110px]" />
      <div className="blob3 pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-12 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:px-10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-emerald-500/15 blur-[90px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-1.5 text-sm font-medium text-orange-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live booking · usually within 1 hour
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Book a{" "}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                technician visit
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-base text-slate-400 sm:text-lg">
              Tap through a few questions, or type it in one sentence.
              <br className="hidden sm:block" />
              Your booking opens in WhatsApp, ready to send.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-xs text-orange-400">✓</span>
                Fixed price upfront
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">✓</span>
                Same-day visits
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs text-amber-400">✓</span>
                30-day warranty
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <div
            ref={boxRef}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#121215]/90 shadow-2xl shadow-black/50 backdrop-blur-md"
          >
            <div className="bg-gradient-to-r from-[#1c1c22] to-[#25252d]">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 grid-cols-2 place-content-center gap-[3px] rounded-full bg-orange-500 p-2.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="h-full w-full bg-white/90" />
                  ))}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">Repair desk</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Booking assistant
                  </p>
                </div>
                {booking && <span className="ml-auto font-mono text-xs text-orange-300">{booking.ref}</span>}
              </div>
              <div className="h-1 bg-white/5" role="progressbar" aria-label="Booking progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={step === "confirm" || step === "done" ? 100 : pct}>
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500" style={{ width: `${step === "confirm" || step === "done" ? 100 : pct}%` }} />
              </div>
            </div>

            <div
              ref={feedRef}
              role="log"
              aria-live="polite"
              aria-label="Booking conversation"
              className="flex h-[22rem] flex-col gap-2 overflow-y-auto px-4 py-4 sm:h-[26rem]"
            >
              {msgs.map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
              {typing && (
                <div className="flex justify-start" aria-hidden>
                  <div className="cb-pop cb-bot flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/10 px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="cb-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: `${i * 160}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="min-h-[8rem] border-t border-white/10 bg-black/30 px-4 py-3">
              {step === "device" && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {DEVICES.map((d, i) => (
                    <Chip key={d.label} i={i} label={d.label} onClick={() => pick("device", d.label)} />
                  ))}
                </div>
              )}

              {step === "problem" && problems.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {problems.map((p, i) => (
                    <Chip key={p} i={i} label={p} onClick={() => pick("problem", p)} />
                  ))}
                </div>
              )}

              {step === "area" && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {saved.area && <Chip i={0} label={`${saved.area} (last time)`} onClick={() => pick("area", saved.area)} />}
                  {AREAS.filter((a) => a !== saved.area)
                    .slice(0, 8)
                    .map((a, i) => (
                      <Chip key={a} i={i + 1} label={a} onClick={() => pick("area", a)} />
                    ))}
                </div>
              )}

              {step === "day" && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <Chip i={0} label="ASAP" onClick={() => pick("day", ASAP)} />
                  {[...(todayOpen() ? [0] : []), 1, 2, 3, 4].map((o, i) => (
                    <Chip key={o} i={i + 1} label={dayFor(o)} onClick={() => pick("day", dayFor(o))} />
                  ))}
                  <Chip i={6} label={LATER} tone="slate" onClick={() => pick("day", LATER)} />
                </div>
              )}

              {step === "slot" && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {ans.day?.startsWith("Today") && (
                    <Chip i={0} label="ASAP / Next available" onClick={() => pick("slot", "ASAP / Next available")} />
                  )}
                  {slotOptions.map((s, i) => (
                    <Chip key={s.label} i={i + 1} label={s.label} onClick={() => pick("slot", s.label)} />
                  ))}
                </div>
              )}

              {step === "name" && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <Chip i={0} label="Skip" tone="slate" onClick={skipName} />
                </div>
              )}

              {inputOn && (
                <form onSubmit={handleText} className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={160}
                    disabled={step === "busy"}
                    aria-label={field ? PLACEHOLDER[field] : "Type your answer"}
                    placeholder={field ? PLACEHOLDER[field] : "..."}
                    className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || step === "busy"}
                    className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-500 disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              )}

              {(step === "confirm" || step === "done") && (
                <div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (step === "confirm") say(["Opening WhatsApp. Press send there and we'll confirm a time."], "done");
                      }}
                      className="cb-pop rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                    >
                      {step === "done" ? "Open WhatsApp again" : "Send on WhatsApp"}
                    </a>
                    <button
                      type="button"
                      onClick={copy}
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      {copied ? "Copied" : "Copy booking"}
                    </button>
                    <button
                      type="button"
                      onClick={restart}
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Start over
                    </button>
                  </div>

                  {step === "confirm" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">Change:</span>
                      <Chip i={0} tone="slate" label="Device" onClick={() => change("Device", ["device", "problem"])} />
                      <Chip i={1} tone="slate" label="Problem" onClick={() => change("Problem", ["problem"])} />
                      <Chip i={2} tone="slate" label="Area" onClick={() => change("Area", ["area"])} />
                      <Chip i={3} tone="slate" label="When" onClick={() => change("When", ["day", "slot"])} />
                      <Chip i={4} tone="slate" label="Name" onClick={() => change("Name", ["name"])} />
                    </div>
                  )}

                  {LOG_ENDPOINT && (
                    <p className="mt-3 text-xs text-slate-500">A copy of this booking is saved so we can follow up if the WhatsApp message doesn&apos;t arrive.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}