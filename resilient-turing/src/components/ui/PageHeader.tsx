"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { RevealText } from "../../animations/motion-components";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  currentPageLabel: string;
  locale: string;
  parentPath?: {
    label: string;
    href: string;
  };
  badgeText?: string;
}

export function PageHeader({ title, subtitle, currentPageLabel, locale, parentPath }: PageHeaderProps) {
  const isAr = locale === "ar";
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <header className="w-full pt-28 pb-8 md:pt-32 md:pb-10 mb-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Clean Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 rtl:space-x-reverse text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-1.5 hover:text-[#0070BA] dark:hover:text-brand-sky transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>{isAr ? "الرئيسية" : "Home"}</span>
          </Link>

          <ChevronIcon className="w-4 h-4 text-slate-400 dark:text-slate-600" />

          {parentPath && (
            <>
              <Link 
                href={parentPath.href}
                className="hover:text-[#0070BA] dark:hover:text-brand-sky transition-colors"
              >
                {parentPath.label}
              </Link>
              <ChevronIcon className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            </>
          )}

          <span className="text-[#002060] dark:text-brand-sky font-extrabold" aria-current="page">
            {currentPageLabel}
          </span>
        </nav>

        {/* Oversized Page Title & Clean Subtitle */}
        <div className="space-y-3 pt-1">
          <RevealText tagName="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {title}
          </RevealText>
          {subtitle && (
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}