"use client";

import type { Era } from "@/types/map";

interface Props {
  eras: Era[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function EraSlider({ eras, activeIndex, onChange }: Props) {
  const activeEra = eras[activeIndex];
  const pct = activeIndex / (eras.length - 1); // 0 to 1

  return (
    <div className="w-full select-none px-2 sm:px-4 pt-5 pb-4">
      {/* Track + dots */}
      <div className="relative">
        {/* Base track — spans from center of first dot to center of last dot */}
        <div className="absolute top-3 left-3 right-3 h-px bg-[var(--border-2)]" />

        {/* Active fill — correct CSS: percentage of (100% - 24px) */}
        <div
          className="absolute top-3 left-3 h-px bg-[#F7931A] transition-all duration-300"
          style={{
            width: `calc(${pct * 100}% - ${pct * 24}px)`,
          }}
        />

        {/* Dots + labels */}
        <div className="relative flex justify-between">
          {eras.map((era, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <button
                key={era.id}
                onClick={() => onChange(i)}
                className="group relative flex flex-col items-center gap-2 z-10 outline-none"
                aria-label={era.label}
                aria-pressed={isActive}
              >
                {/* Dot */}
                <div
                  className={[
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "border-[#F7931A] bg-[#F7931A] scale-110 shadow-[0_0_12px_rgba(247,147,26,0.5)]"
                      : isPast
                      ? "border-[#F7931A] bg-transparent"
                      : "border-[var(--border-2)] bg-transparent group-hover:border-[var(--fg-muted)]",
                  ].join(" ")}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Year label */}
                <div className="flex flex-col items-center text-center max-w-[72px]">
                  <span
                    className={[
                      "text-[13px] font-bold leading-none transition-colors whitespace-nowrap",
                      isActive
                        ? "text-[#F7931A]"
                        : isPast
                        ? "text-[var(--fg-dim)]"
                        : "text-[var(--fg-muted)] group-hover:text-[var(--fg-dim)]",
                    ].join(" ")}
                  >
                    {era.year}
                  </span>
                  <span
                    className={[
                      "hidden sm:block text-[11px] mt-0.5 leading-tight transition-colors text-center",
                      isActive ? "text-[var(--fg-muted)]" : "text-[var(--fg-ghost)]",
                    ].join(" ")}
                  >
                    {era.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>


    </div>
  );
}
