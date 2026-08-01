"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { ToastProvider } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ACTORS, setActor } from "@/lib/management/store";
import { useManagement } from "@/lib/management/useManagement";

const NAV = [
  { href: "/management/buildings", label: "Gedung" },
  { href: "/management/activity", label: "Aktivitas" },
];

/**
 * The frame every management screen sits in.
 *
 * Header, navigation, the actor selector, and — permanently, not dismissibly —
 * the line saying this is a prototype. A client must not leave this screen
 * believing their data persists.
 *
 * The visual world is the public site's: same tokens, same card surface, same
 * plum-for-actions. There is no separate "internal" look, because the argument
 * this panel exists to make is that the manager and the renter are looking at
 * one system.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { actor, apply, reset } = useManagement();

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-canvas">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas">
          {/* Two rows on a phone. In one row the wordmark and the actor selector
            took the full width and squeezed the nav to nothing — the panel had
            no navigation at all below about 640px. */}
          <div className="wrap-wide flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 sm:h-16 sm:flex-nowrap sm:gap-x-8 sm:py-0">
            <Link
              href="/management/buildings"
              className="text-[20px] font-semibold tracking-[-0.01em] whitespace-nowrap"
            >
              Kostella{" "}
              <span className="font-medium text-ink-soft">Pengelola</span>
            </Link>

            <nav
              aria-label="Panel pengelola"
              className="no-scrollbar order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto"
            >
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-[14px] font-medium transition-colors",
                      active
                        ? "bg-ink text-stone"
                        : "text-ink-soft hover:bg-stone hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Chosen, not authenticated — and labelled that way. Without it an
              audit log records one anonymous user and proves nothing. */}
            <label className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-3 text-[13px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum sm:px-4">
              <span className="whitespace-nowrap text-ink-soft">
                Masuk sebagai
              </span>
              <select
                value={actor}
                onChange={(e) => apply((s) => setActor(s, e.target.value))}
                className="cursor-pointer appearance-none bg-transparent py-2 text-[13px] font-semibold focus:outline-none"
              >
                {ACTORS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {/* Not a toast, not dismissible. The one sentence a client must not miss. */}
        <p className="border-b border-held/25 bg-held-soft/60 px-5 py-2 text-center text-[13px] text-held sm:px-8">
          Prototipe — perubahan tersimpan di browser ini saja, tidak terkirim ke
          mana pun.
        </p>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line">
          <div className="wrap-wide flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-[12px] text-ink-soft">
            <span>Kostella Pengelola · prototipe</span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-[13px] font-semibold text-plum transition-colors hover:text-ink"
            >
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden />
              Atur ulang data demo
            </button>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
