"use client";

import { useState } from "react";

const PHONE = "94000000000"; // country code, no +

type Issue = { id: string; title: string; mins: number; steps: string[] };
type Group = { id: string; label: string; icon: string; issues: Issue[] };

const GROUPS: Group[] = [
  {
    id: "computer",
    label: "Laptop & PC",
    icon: "💻",
    issues: [
      {
        id: "no-power",
        title: "Computer won't turn on",
        mins: 5,
        steps: [
          "Check the charger or power cable is pushed in firmly at both ends, and that the wall socket works (test it with a phone charger).",
          "Laptop: unplug the charger. Desktop: switch off the power switch on the back of the computer.",
          "Hold the power button down for 30 seconds, then let go.",
          "Plug the charger straight into the wall, not an extension, switch the desktop's back switch on, and press the power button once.",
        ],
      },
      {
        id: "slow",
        title: "Slow or freezing",
        mins: 5,
        steps: [
          "Save your work, then restart from Start > Power > Restart. Closing the lid or choosing Sleep does not count.",
          "Press Ctrl + Shift + Esc to open Task Manager, click the Memory column to sort it, and close apps you don't need.",
          "In Task Manager, open Startup apps and turn off programs you recognise and don't need at start-up.",
          "Open Settings > System > Storage. If the drive is nearly full, delete or move large files.",
        ],
      },
      {
        id: "black-screen",
        title: "Screen is black but the PC is on",
        mins: 3,
        steps: [
          "Check the monitor's power light is on, then press its Input or Source button to pick the right input.",
          "Push the video cable (HDMI, DisplayPort or VGA) in firmly at both ends.",
          "If your PC has a separate graphics card (ports lower down on the back), plug the cable into that card instead of the upper ports.",
          "Try a different cable, or another monitor or TV, to see which part is at fault.",
        ],
      },
      {
        id: "overheating",
        title: "Overheating or loud fan",
        mins: 4,
        steps: [
          "Make sure the laptop vents are not blocked (don't use it on a soft bed or pillow).",
          "Close unused programs and browser tabs to reduce CPU load.",
          "Restart the computer and leave it on a hard flat surface.",
          "If it still gets very hot or the fan is extremely loud, it may need a clean or new thermal paste.",
        ],
      },
      {
        id: "blue-screen",
        title: "Blue screen / sudden restart",
        mins: 4,
        steps: [
          "Note the stop code or error message if you see one.",
          "Restart and immediately press F8 or hold Shift while clicking Restart to enter Safe Mode.",
          "In Safe Mode, uninstall any recently installed software or drivers.",
          "Run Windows Update and check for optional driver updates.",
        ],
      },
      {
        id: "no-sound",
        title: "No sound from speakers",
        mins: 3,
        steps: [
          "Check the volume is not muted (look for a red speaker icon in the taskbar).",
          "Right-click the speaker icon → Open Volume mixer and make sure the app is not set to zero.",
          "Try plugging in headphones. If they work, the problem is with the speakers or audio jack.",
          "Go to Settings > System > Sound and select the correct output device.",
        ],
      },
      {
        id: "keyboard",
        title: "Keyboard or touchpad not working",
        mins: 3,
        steps: [
          "Restart the computer.",
          "On laptops, try pressing Fn + F keys (often F6 or F7) to re-enable the touchpad.",
          "For external keyboard/mouse, unplug and plug into a different USB port.",
          "Update or reinstall the keyboard/touchpad driver in Device Manager.",
        ],
      },
      {
        id: "battery",
        title: "Battery drains very fast",
        mins: 4,
        steps: [
          "Lower the screen brightness.",
          "Close apps running in the background (check Task Manager).",
          "Turn off Bluetooth and WiFi when not needed.",
          "Check Battery settings → Battery saver and turn it on. If the battery is old, it may need replacing.",
        ],
      },
    ],
  },
  {
    id: "printer",
    label: "Printer",
    icon: "🖨️",
    issues: [
      {
        id: "queue",
        title: "Print jobs stuck in the queue",
        mins: 3,
        steps: [
          "Open Settings > Bluetooth & devices > Printers & scanners and choose your printer.",
          "Click Open print queue, then in the Printer menu choose Cancel All Documents.",
          "Switch the printer off, wait 30 seconds, and switch it back on.",
          "Print one test page.",
        ],
      },
      {
        id: "offline",
        title: "Printer shows as offline",
        mins: 4,
        steps: [
          "Make sure the printer is on and its WiFi light is steady, not blinking. If it uses a USB cable, push the cable in firmly.",
          "Check the computer is on the same WiFi network as the printer.",
          "Open the print queue, click the Printer menu, and untick Use Printer Offline if it is ticked.",
          "Restart the printer and the computer, then try again.",
        ],
      },
      {
        id: "jam",
        title: "Paper jam",
        mins: 5,
        steps: [
          "Switch the printer off and unplug it.",
          "Open the covers and the paper tray and look for the stuck sheet. Check the back as well.",
          "Pull the paper out slowly with both hands, in the direction the paper travels. Don't use tools or force.",
          "Make sure no torn pieces are left, close everything, plug in, switch on and print a test page.",
        ],
      },
      {
        id: "blank-pages",
        title: "Prints blank or faded pages",
        mins: 3,
        steps: [
          "Check ink or toner levels in the printer software or on the printer display.",
          "Run the printer’s built-in nozzle check or cleaning cycle (usually in the maintenance menu).",
          "Make sure you are using the correct paper type setting.",
          "If cleaning doesn’t help, the cartridge may need replacing.",
        ],
      },
      {
        id: "wifi-printer",
        title: "Can't find wireless printer",
        mins: 4,
        steps: [
          "Make sure the printer is connected to the same WiFi network as your computer.",
          "Restart both the printer and the computer.",
          "On the computer go to Settings > Bluetooth & devices > Printers & scanners → Add device.",
          "If it still doesn't appear, try connecting with a USB cable temporarily and reinstall the driver.",
        ],
      },
      {
        id: "streaks",
        title: "Lines or streaks on printouts",
        mins: 3,
        steps: [
          "Run the printer’s cleaning or deep cleaning utility.",
          "Check if the ink/toner cartridge is properly seated.",
          "Clean the print head contacts gently with a dry lint-free cloth.",
          "If the problem continues, the print head or drum may need service.",
        ],
      },
    ],
  },
  {
    id: "wifi",
    label: "WiFi & Router",
    icon: "📶",
    issues: [
      {
        id: "no-internet",
        title: "No internet on any device",
        mins: 5,
        steps: [
          "Check a second device. If your phone has no internet either, the problem is the router or your provider.",
          "Unplug the router (and the modem, if it is a separate box) from power for 30 seconds.",
          "Plug it back in and wait 2 to 3 minutes for the lights to settle.",
          "Check the cable from the wall or provider box is pushed firmly into the router's internet port. If the lights still show a fault, ask your provider about an outage.",
        ],
      },
      {
        id: "one-device",
        title: "WiFi fails on just one device",
        mins: 3,
        steps: [
          "Turn that device's WiFi off and on, or switch airplane mode on and then off.",
          "Choose Forget on your network, then reconnect with the WiFi password.",
          "Restart the device.",
          "If the other devices work fine and this one still fails, the fault is probably in the device itself.",
        ],
      },
      {
        id: "weak-signal",
        title: "Weak signal in some rooms",
        mins: 5,
        steps: [
          "Move the router to a central, raised spot in the open. Avoid cupboards and the back of a TV.",
          "Keep it away from microwaves, cordless phones and thick walls.",
          "If it has antennas, point them straight up.",
          "Test again in the weak room. If the signal is still poor, you probably need a WiFi extender.",
        ],
      },
      {
        id: "slow-wifi",
        title: "WiFi is very slow",
        mins: 4,
        steps: [
          "Restart the router (unplug for 30 seconds).",
          "Move closer to the router and test speed again.",
          "Disconnect devices that are not in use.",
          "Check if your provider is having an outage or if you are over your data limit.",
        ],
      },
      {
        id: "cant-connect",
        title: "Can't connect to WiFi network",
        mins: 3,
        steps: [
          "Make sure you are typing the correct password (check caps lock).",
          "Forget the network and try connecting again.",
          "Restart your device and the router.",
          "Try connecting another device. If none can connect, the router settings may need resetting.",
        ],
      },
      {
        id: "drops",
        title: "WiFi keeps disconnecting",
        mins: 4,
        steps: [
          "Move closer to the router to rule out weak signal.",
          "Update your device’s WiFi driver (Device Manager on Windows).",
          "Change the router’s WiFi channel in its settings (try channels 1, 6 or 11 for 2.4 GHz).",
          "If it only happens on one device, the problem is likely with that device.",
        ],
      },
    ],
  },
  {
    id: "monitor",
    label: "Monitor",
    icon: "🖥️",
    issues: [
      {
        id: "mon-no-signal",
        title: "No signal or no picture",
        mins: 3,
        steps: [
          "Check the monitor's power light is on, then press its Input or Source button to pick the right input (HDMI, DisplayPort or VGA).",
          "Pull out the video cable and push it back in firmly at both ends.",
          "If your PC has a separate graphics card (ports lower down on the back), plug the cable into that card instead of the upper ports.",
          "Try a different cable or a different port on the monitor. If you can, test the monitor with another computer.",
        ],
      },
      {
        id: "mon-no-power",
        title: "Monitor won't turn on",
        mins: 3,
        steps: [
          "Check the power cable is pushed in firmly at both ends, and that the wall socket works (test it with a phone charger).",
          "If the monitor has a power adapter box, check the cable on both sides of it.",
          "Unplug the monitor for 60 seconds, plug it straight into the wall, not an extension, and press the power button.",
          "Watch the power light. If it stays dark or blinks, note the pattern and tell us when you book.",
        ],
      },
      {
        id: "mon-flicker",
        title: "Screen flickers or flashes",
        mins: 4,
        steps: [
          "Push the video cable in firmly at both ends, and keep it away from power cables and speakers.",
          "Try a different cable or a different port on the monitor.",
          "Right-click the desktop, open Display settings > Advanced display, and set the refresh rate to the highest option shown.",
          "Update the graphics driver from Windows Update or the graphics card maker's website.",
        ],
      },
      {
        id: "mon-blurry",
        title: "Picture is blurry or stretched",
        mins: 3,
        steps: [
          "Right-click the desktop and open Display settings.",
          "Under Display resolution, choose the option marked Recommended.",
          "Set Scale to the recommended value (often 100% or 125%).",
          "If it is still stretched, press the monitor's Auto or Menu button and look for an Aspect ratio or Auto adjust option.",
        ],
      },
      {
        id: "mon-second",
        title: "Second monitor not detected",
        mins: 4,
        steps: [
          "Check the second monitor is on and set to the right input, and that its cable is pushed in at both ends.",
          "Press the Windows key + P and choose Extend (or Duplicate).",
          "Open Settings > System > Display and click Detect under Multiple displays.",
          "Try a different cable or port. If the PC has a separate graphics card, use the ports on that card.",
        ],
      },
      {
        id: "mon-lines",
        title: "Lines, spots or wrong colours",
        mins: 3,
        steps: [
          "Push the video cable in firmly at both ends, and try a different cable.",
          "Check the colour settings in the monitor's own menu and choose Reset or Factory reset.",
          "Try the monitor with another computer. If the lines or spots are still there, the fault is in the monitor.",
          "Lines that don't move or dark patches that don't change usually mean the screen panel is damaged and needs a repair.",
        ],
      },
    ],
  },
];

type Result = "fixed" | "nope";

export default function TryThisFirst() {
  const [tab, setTab] = useState(GROUPS[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<Record<string, Result>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const reset = (issue: Issue) => {
    setChecked((c) => {
      const next = { ...c };
      issue.steps.forEach((_, i) => delete next[`${issue.id}-${i}`]);
      return next;
    });
    setResult((r) => {
      const next = { ...r };
      delete next[issue.id];
      return next;
    });
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + GROUPS.length) % GROUPS.length;
    setTab(GROUPS[n].id);
    document.getElementById(`tab-${GROUPS[n].id}`)?.focus();
  };

  return (
    <section id="try-first" className="relative overflow-x-clip bg-[#08080a] px-5 py-16 text-white sm:py-20 lg:px-10">
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mx-0 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Try this first</h2>
          <p className="mt-3 text-slate-400">
            Free fixes you can do yourself in a few minutes. If they don&apos;t work, book a home visit and we&apos;ll take it from there.
          </p>
        </div>

        {/* Warning */}
        <div className="mb-8 flex flex-col items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
          <span className="text-xl">⚠️</span>
          <p className="text-sm leading-relaxed text-amber-100">
            Stop and don&apos;t try these if you smell burning, see smoke or a swollen battery, or liquid got inside. Switch off, unplug, and book a visit instead.
          </p>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Device type" className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-start">
          {GROUPS.map((g, i) => {
            const on = tab === g.id;
            return (
              <button
                key={g.id}
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={on}
                aria-controls={`panel-${g.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(g.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                  on
                    ? "border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span>{g.icon}</span>
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Issues */}
        {GROUPS.map((g) => (
          <div
            key={g.id}
            role="tabpanel"
            id={`panel-${g.id}`}
            aria-labelledby={`tab-${g.id}`}
            hidden={tab !== g.id}
            className={`${tab === g.id ? "flex" : "hidden"} flex-wrap items-start justify-center gap-4 lg:justify-start`}
          >
            {g.issues.map((issue) => {
              const done = issue.steps.filter((_, i) => checked[`${issue.id}-${i}`]).length;
              const res = result[issue.id];
              const isOpen = openId === issue.id;
              const wa = `https://wa.me/${PHONE}?text=${encodeURIComponent(
                `Hi, I tried the tips for "${issue.title}" (${g.label}) but it's still not working. Can you visit?`
              )}`;

              return (
                <div
                  key={issue.id}
                  className={`w-full max-w-xl rounded-2xl border transition-all duration-300 sm:w-[calc(50%-0.5rem)] sm:max-w-none ${
                    isOpen
                      ? "border-orange-500/40 bg-[#121215] shadow-xl shadow-orange-900/20"
                      : "border-white/10 bg-[#0c0c0e] hover:border-white/20 hover:bg-[#101012]"
                  }`}
                >
                  {/* Card header */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : issue.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <p className="font-semibold leading-snug">{issue.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        About {issue.mins} min
                        {done > 0 && ` · ${done}/${issue.steps.length} done`}
                        {res === "fixed" && " · Fixed ✓"}
                      </p>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                        isOpen
                          ? "border-orange-500/50 bg-orange-500/20 text-orange-300"
                          : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {/* Expandable body */}
                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <ol className="space-y-3">
                        {issue.steps.map((s, i) => {
                          const key = `${issue.id}-${i}`;
                          const on = !!checked[key];
                          return (
                            <li key={key}>
                              <label className="flex cursor-pointer items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggle(key)}
                                  className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                                />
                                <span
                                  className={`text-[15px] leading-relaxed ${
                                    on ? "text-slate-500 line-through" : "text-slate-200"
                                  }`}
                                >
                                  {s}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="mt-5 border-t border-white/10 pt-4">
                        {!res && (
                          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                            <span className="text-sm text-slate-400">Did that fix it?</span>
                            <button
                              type="button"
                              onClick={() => setResult((r) => ({ ...r, [issue.id]: "fixed" }))}
                              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                              Yes, fixed
                            </button>
                            <button
                              type="button"
                              onClick={() => setResult((r) => ({ ...r, [issue.id]: "nope" }))}
                              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                            >
                              Still not working
                            </button>
                          </div>
                        )}

                        {res === "fixed" && (
                          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                            <p className="text-center text-sm text-emerald-300 lg:text-left">
                              Glad that worked. No visit needed.
                            </p>
                            <button
                              type="button"
                              onClick={() => reset(issue)}
                              className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
                            >
                              Start again
                            </button>
                          </div>
                        )}

                        {res === "nope" && (
                          <div className="text-center lg:text-left">
                            <p className="text-sm text-slate-300">
                              Thanks for trying. That points to a fault that needs a proper look.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                              <a
                                href="#book"
                                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
                              >
                                Book a home visit
                              </a>
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
                              >
                                WhatsApp us
                              </a>
                              <button
                                type="button"
                                onClick={() => reset(issue)}
                                className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
                              >
                                Start again
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}