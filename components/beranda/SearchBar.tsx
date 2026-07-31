"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { areaChips, budget, vacantRooms } from "@/lib/content/beranda";
import { formatRupiah } from "@/lib/format";
import { routes } from "@/lib/routes";

/** Six steps across the real range, so every option reaches some inventory. */
const budgetSteps = Array.from(
  { length: 7 },
  (_, i) => budget.min + i * ((budget.max - budget.min) / 6),
);

/**
 * One elevated row: where, how much, go.
 *
 * The canon's search bar, taken straight — two named cells divided by a
 * hairline and an action that carries the live count. The previous slider was
 * more expressive, but a slider inside a search bar is a thing this category
 * does not do, and half-committing to the convention is what the direction
 * refuses. The count keeps the honesty the slider gave: you learn how much of
 * the inventory your figure reaches before you spend a click.
 */
export function SearchBar({ onDark = false }: { onDark?: boolean }) {
  const [area, setArea] = useState(areaChips[0].label);
  const [amount, setAmount] = useState<number>(budget.initial);

  const inArea = useMemo(
    () => vacantRooms.filter((room) => room.area === area),
    [area],
  );
  const matchCount = useMemo(
    () => inArea.filter((room) => room.rent <= amount).length,
    [inArea, amount],
  );

  const nearest = areaChips.find((chip) => chip.label === area)?.nearest;
  const cheapest = inArea[0];

  const cell = "flex flex-1 flex-col gap-1 px-6 py-4 text-left";
  const label = "text-[13px] font-semibold whitespace-nowrap text-ink";
  const control =
    "w-full cursor-pointer appearance-none bg-transparent text-[15px] text-ink-soft focus:outline-none";

  return (
    <div className="mx-auto mt-10 max-w-[780px]">
      <div className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper shadow-card sm:flex-row sm:items-stretch sm:rounded-full sm:pr-2">
        <label className={cell}>
          <span className={label}>Kawasan</span>
          <select
            className={control}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {areaChips.map((chip) => (
              <option key={chip.label} value={chip.label}>
                {chip.label}
              </option>
            ))}
          </select>
        </label>

        <span aria-hidden className="h-px w-full bg-line sm:h-auto sm:w-px" />

        <label className={cell}>
          <span className={label}>Budget maksimal</span>
          <select
            className={control}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          >
            {budgetSteps.map((step) => (
              <option key={step} value={step}>
                {formatRupiah(step)}
              </option>
            ))}
          </select>
        </label>

        <div className="p-2 sm:flex sm:items-center sm:p-0">
          <Link
            href={routes.pencarian}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-plum px-7 py-4 text-[15px] font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-plum-deep sm:w-auto"
          >
            {matchCount > 0 ? `Lihat ${matchCount} kamar` : "Lihat semua kamar"}
            <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>

      {/* An empty result names the way out rather than leaving a zero.
          Over a photograph this line goes solid stone: the softer ink grey has
          nothing to sit on there. */}
      <p
        aria-live="polite"
        className={`mt-4 text-[14px] ${onDark ? "text-stone" : "text-ink-soft"}`}
      >
        {matchCount > 0 ? (
          <>
            {matchCount} dari {inArea.length} kamar di {area} masuk budget kamu.
          </>
        ) : cheapest ? (
          <>
            Belum ada yang masuk. Termurah {formatRupiah(cheapest.rent)} di
            gedung {cheapest.building}.{" "}
            <button
              type="button"
              onClick={() => setAmount(cheapest.rent)}
              className={`cursor-pointer font-semibold underline underline-offset-2 ${onDark ? "text-stone hover:text-white" : "text-plum hover:text-ink"}`}
            >
              Naikkan budget
            </button>
          </>
        ) : (
          <>
            Belum ada kamar kosong di {area}.{" "}
            {nearest && (
              <button
                type="button"
                onClick={() => setArea(nearest)}
                className={`cursor-pointer font-semibold underline underline-offset-2 ${onDark ? "text-stone hover:text-white" : "text-plum hover:text-ink"}`}
              >
                Coba {nearest}
              </button>
            )}
          </>
        )}
      </p>
    </div>
  );
}
