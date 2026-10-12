"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Building2,
  CheckCircle2,
  Award,
  Shield,
  Route,
  Layers,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Landmark,
  Check,
  RotateCw,
  ListTree,
  FileCheck2,
  FileBadge2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { RevealText } from '../../animations/motion-components';
import { Rotating3DTimelineCarousel, ALL_TIMELINE_ITEMS, TimelineItem } from '../ui/Rotating3DTimelineCarousel';
import { storageAdapter } from '../../services/storageAdapter';

interface ProjectsTimelineSectionProps {
  locale: 'ar' | 'en';
}

export function ProjectsTimelineSection({ locale }: ProjectsTimelineSectionProps) {
  const isAr = locale === 'ar';
  const [viewMode, setViewMode] = useState<'3d' | 'tree'>('3d');
  const [milestones, setMilestones] = useState<TimelineItem[]>(ALL_TIMELINE_ITEMS);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = storageAdapter.getTimelineItems();
    if (list && list.length > 0) {
      setMilestones(list as any);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isAr ? 350 : -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isAr ? -350 : 350, behavior: 'smooth' });
    }
  };

  return (
    <section id="timeline" className="space-y-8 text-start">
      {/* 1. Main Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-[#002060] dark:text-sky-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
            <span>{isAr ? 'المسار الزمني المؤسسي الشامل (2021 - 2026)' : 'COMPREHENSIVE ROADMAP (2021 - 2026)'}</span>
          </div>
          <RevealText tagName="h2" className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {isAr ? 'محطات النمو والتراخيص والاعتمادات والمشاريع' : 'Milestones of Growth, Accreditations & Projects'}
          </RevealText>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
            {isAr
              ? 'سجل وثائقي موثق يجمع السجلات التجارية والتراخيص البلدية وشهادات الآيزو وتصنيف المقاولين وأضخم العقود الميدانية المنفذة والجارية.'
              : 'A verified chronological record combining commercial registrations, municipal permits, ISO certificates, contractor classification, and mega ongoing civil projects.'}
          </p>
        </div>

        {/* View Mode Switcher: 3D Cylinder vs Horizontal Blueprint Tree */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === '3d'
                ? 'bg-[#002060] text-white dark:bg-sky-500 dark:text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'العرض الأسطواني 3D' : '3D Cylinder 360°'}</span>
          </button>

          <button
            onClick={() => setViewMode('tree')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-[#002060] text-white dark:bg-sky-500 dark:text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>{isAr ? 'المخطط الهندسي الأفقي' : 'Horizontal Blueprint'}</span>
          </button>
        </div>
      </div>

      {/* 2. Render Based on Selected View Mode */}
      {viewMode === '3d' ? (
        /* --- 3D Rotating 360 Cylinder View --- */
        <Rotating3DTimelineCarousel locale={locale} />
      ) : (
        /* --- Horizontal Alternating Timeline: فوق الخط وتحت الخط --- */
        <div className="space-y-4">
          {/* Scroll Navigation Header for Horizontal Track */}
          <div className="flex items-center justify-between gap-4 pb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>{isAr ? 'المسار الزمني الأفقي المتناوب (فوق الخط وتحت الخط)' : 'Horizontal Alternating Track (Above & Below Line)'}</span>
            </span>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#002060] hover:text-white dark:hover:bg-sky-400 dark:hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#002060] hover:text-white dark:hover:bg-sky-400 dark:hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Horizontal Track Arena */}
          <div
            ref={scrollContainerRef}
            className="relative w-full overflow-x-auto pb-6 pt-6 select-none scrollbar-thin"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {/* Height Container for Above & Below Layout */}
            <div className="relative min-w-[1900px] h-[640px] flex items-center px-8">
              
              {/* Central Continuous Horizontal Spine Line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-gradient-to-r from-[#002060] via-[#0070BA] to-sky-400 dark:from-sky-600 dark:via-sky-400 dark:to-emerald-400 rounded-full shadow-sm z-0" />

              {/* 7 Horizontal Milestones Columns */}
              <div className="grid grid-cols-7 gap-8 w-full relative z-10">
                {milestones.map((m, idx) => {
                  const isAbove = idx % 2 === 0; // Even: Above the line | Odd: Below the line
                  const Icon = m.icon;
                  const isCurrent = m.year === '2026' || m.year === '2026+';

                  return (
                    <div
                      key={m.id}
                      className="relative flex flex-col items-center justify-center h-[640px] text-start"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* 1. Center Node on the Horizontal Line */}
                      <div className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-950 border-3 border-[#002060] dark:border-sky-400 flex items-center justify-center shadow-lg z-20 transition-transform duration-300 hover:scale-110">
                        <Icon className="w-5 h-5 text-[#002060] dark:text-sky-400" />
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>

                      {/* 2. Vertical Stem Line connecting Node to Card */}
                      <div
                        className={`absolute w-0.5 bg-gradient-to-b ${
                          isAbove
                            ? 'top-[16.5rem] bottom-1/2 from-transparent via-[#0070BA]/50 to-[#0070BA] dark:to-sky-400'
                            : 'top-1/2 bottom-[16.5rem] from-[#0070BA] via-[#0070BA]/50 to-transparent dark:from-sky-400'
                        }`}
                      />

                      {/* 3. The Card: Sits Above or Below the Line */}
                      <div
                        className={`absolute w-full max-w-[260px] p-4 rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#0070BA] dark:hover:border-sky-400 transition-all duration-300 ${
                          isAbove ? 'top-2' : 'bottom-2'
                        } flex flex-col justify-between space-y-2.5`}
                      >
                        {/* Card Header: Year Pill & Location */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#002060] dark:bg-sky-500 text-white dark:text-black text-[10px] font-mono font-black shadow-xs">
                            {m.year}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#0070BA] dark:text-sky-400" />
                            <span>{isAr ? m.locationAr : m.locationEn}</span>
                          </span>
                        </div>

                        {/* Image Thumbnail */}
                        <div className="relative h-24 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                          <img
                            src={m.image}
                            alt={isAr ? m.titleAr : m.titleEn}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 start-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[8px] font-bold text-white">
                            {isAr ? m.clientAr : m.clientEn}
                          </div>
                        </div>

                        {/* Title & Badge */}
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-sky-600 dark:text-sky-400 line-clamp-1 block">
                            {isAr ? m.badgeAr : m.badgeEn}
                          </span>
                          <h4 className="text-xs font-black text-slate-950 dark:text-white leading-snug line-clamp-2">
                            {isAr ? m.titleAr : m.titleEn}
                          </h4>
                        </div>

                        {/* Highlight 1 */}
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[9px] font-semibold text-slate-700 dark:text-slate-300">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{isAr ? m.highlightsAr[0] : m.highlightsEn[0]}</span>
                        </div>

                        {/* Link */}
                        <div className="pt-1 flex items-center justify-end">
                          <Link
                            href={`/${locale}${m.link}`}
                            className="text-[9px] font-black text-[#002060] dark:text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <span>{isAr ? 'التفاصيل' : 'Details'}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Bottom CTA Card */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-950 dark:text-white">
            {isAr ? 'هل تبحث عن سجل كامل للمشاريع والشهادات الرسمية؟' : 'Looking for complete projects and ISO certificates?'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr
              ? 'يمكنك استعراض كتالوج المشاريع الهندسية وشهادات الاعتماد الحكومية المعتمدة.'
              : 'Browse our full catalog of civil infrastructure projects and government accreditations.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${locale}/projects`}
            className="px-4 py-2.5 rounded-lg bg-[#002060] dark:bg-sky-500 text-white dark:text-black hover:bg-[#003399] text-xs font-black transition-all shadow-xs"
          >
            {isAr ? 'سجل المشاريع' : 'Projects Record'}
          </Link>
          <Link
            href={`/${locale}/certificates`}
            className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 text-xs font-bold transition-all shadow-xs"
          >
            {isAr ? 'الشهادات والاعتمادات' : 'Certificates'}
          </Link>
        </div>
      </div>
    </section>
  );
}
