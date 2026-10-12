"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { RevealText } from "../../animations/motion-components";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  currentPageLabel?: string;
  locale?: string;
  parentPath?: {
    label: string;
    href: string;
  };
  badgeText?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, currentPageLabel, locale = 'ar', parentPath, badgeText, badge }: PageHeaderProps) {
  const isAr = locale === "ar";
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;
  const activeBadge = badge || badgeText;

  return (
    <header className="w-full mb-8 rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 md:p-10 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-4 text-start">
        {/* Clean Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-1.5 hover:text-[#0070BA] dark:hover:text-sky-400 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>{isAr ? "الرئيسية" : "Home"}</span>
          </Link>

          <ChevronIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />

          {parentPath && (
            <>
              <Link 
                href={parentPath.href}
                className="hover:text-[#0070BA] dark:hover:text-sky-400 transition-colors"
              >
                {parentPath.label}
              </Link>
              <ChevronIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </>
          )}

          {currentPageLabel && (
            <span className="text-[#0070BA] dark:text-sky-400 font-extrabold" aria-current="page">
              {currentPageLabel}
            </span>
          )}
        </nav>

        {/* Optional Sovereign Badge */}
        {activeBadge && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0070BA]/10 dark:bg-sky-500/10 border border-[#0070BA]/20 dark:border-sky-500/20 text-[#0070BA] dark:text-sky-300 text-xs font-bold font-mono">
              {activeBadge}
            </span>
          </div>
        )}

        {/* Oversized Page Title & Clean Subtitle */}
        <div className="space-y-3 pt-1">
          <RevealText tagName="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {title}
          </RevealText>
          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}