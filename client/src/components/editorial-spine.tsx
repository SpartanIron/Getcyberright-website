"use client";

import { Link } from "@/lib/navigation";
import { ArrowRight, Compass, Heart, Sparkles } from "lucide-react";

export interface EditorialSpineProps {
  whatChanged?: string | null;
  whyThisMatters?: string[] | null;
  actionThisWeek?: { label: string; href: string } | null;
  pending?: boolean;
}

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function EditorialSpine({
  whatChanged,
  whyThisMatters,
  actionThisWeek,
  pending,
}: EditorialSpineProps) {
  const hasAny =
    !!(whatChanged && whatChanged.trim()) ||
    !!(whyThisMatters && whyThisMatters.length > 0) ||
    !!actionThisWeek;

  if (!hasAny) return null;

  return (
    <section
      className="my-6 rounded-2xl border border-teal-300/60 dark:border-teal-700/50 bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-teal-950/40 dark:via-slate-950/60 dark:to-amber-950/30 p-5 sm:p-6 shadow-sm"
      aria-label="Editorial spine"
      data-testid="editorial-spine"
    >
      {pending && (
        <p className="mb-3 text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
          Editorial spine being added
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-3">
        {whatChanged && whatChanged.trim() && (
          <div data-testid="spine-what-changed">
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-[11px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">
                What Changed
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {whatChanged}
            </p>
          </div>
        )}
        {whyThisMatters && whyThisMatters.length > 0 && (
          <div data-testid="spine-why-this-matters">
            <div className="flex items-center gap-2 mb-1.5">
              <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-[11px] uppercase font-bold tracking-wider text-rose-700 dark:text-rose-400">
                Why This Matters to Your Family
              </h3>
            </div>
            <ul className="space-y-1.5">
              {whyThisMatters.map((b, i) => (
                <li
                  key={i}
                  className="text-sm leading-snug text-slate-800 dark:text-slate-200 flex gap-2"
                  data-testid={`spine-why-bullet-${i}`}
                >
                  <span className="text-rose-500 dark:text-rose-400 mt-0.5">&bull;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {actionThisWeek && (
          <div data-testid="spine-action-this-week">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-[11px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                One Action This Week
              </h3>
            </div>
            {isInternal(actionThisWeek.href) ? (
              <Link
                href={actionThisWeek.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 underline-offset-4 hover:underline"
                data-testid="spine-action-link"
              >
                {actionThisWeek.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {actionThisWeek.label}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function EditorialSpineMini({
  whatChanged,
  actionThisWeek,
}: {
  whatChanged?: string | null;
  actionThisWeek?: { label: string; href: string } | null;
}) {
  if (!whatChanged) return null;
  return (
    <div
      className="mt-2 text-[12px] leading-snug text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 border-l-2 border-teal-500 pl-2 py-1 rounded-sm"
      data-testid="editorial-spine-mini"
    >
      {whatChanged && (
        <p className="line-clamp-2">
          <span className="font-semibold">What changed: </span>
          {whatChanged}
        </p>
      )}
      {actionThisWeek && (
        <p className="line-clamp-1 mt-0.5">
          <span className="font-semibold">This week: </span>
          {actionThisWeek.label}
        </p>
      )}
    </div>
  );
}
