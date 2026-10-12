"use client";

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  FolderKanban,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface InteractiveSaudiMapProps {
  locale?: 'ar' | 'en';
  onSelectRegion?: (regionId: string) => void;
}

interface SaudiRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  projectCount: number;
  activeKm: string;
  pinX: number; // Percentage
  pinY: number; // Percentage
  highlightColor: string;
  sampleProjects: {
    id: string;
    titleAr: string;
    titleEn: string;
    image: string;
    progress: number;
    clientAr: string;
    clientEn: string;
  }[];
}

const SAUDI_REGIONS: SaudiRegion[] = [
  {
    id: 'riyadh',
    nameAr: 'منطقة الرياض (المقر الرئيسي)',
    nameEn: 'Riyadh Province (HQ)',
    projectCount: 12,
    activeKm: '+350 كم',
    pinX: 52,
    pinY: 48,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-1',
        titleAr: 'تشغيل وصيانة مقابر المسلمين بمدينة الرياض',
        titleEn: 'Operation and Maintenance of Muslim Cemeteries in Riyadh',
        image: '/images/projects/project-1.jpg',
        progress: 78,
        clientAr: 'أمانة منطقة الرياض',
        clientEn: 'Riyadh Municipality',
      },
      {
        id: 'proj-8',
        titleAr: 'صيانة وتشغيل شبكات تصريف السيول والمياه الأرضية (بلدية العزيزية)',
        titleEn: 'Stormwater & Groundwater Networks (Al-Aziziyah)',
        image: '/images/before-after/stormwater-drainage-after.jpg',
        progress: 100,
        clientAr: 'أمانة منطقة الرياض',
        clientEn: 'Riyadh Municipality',
      },
    ],
  },
  {
    id: 'qassim',
    nameAr: 'منطقة القصيم (بريدة وعنيزة)',
    nameEn: 'Al-Qassim Province (Buraidah & Unaizah)',
    projectCount: 2,
    activeKm: '+85 كم',
    pinX: 44,
    pinY: 36,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-2',
        titleAr: 'صيانة الشوارع نطاق بلدية شرق بريدة',
        titleEn: 'Street Maintenance in East Buraidah Municipality',
        image: '/images/before-after/road-paving-after.jpg',
        progress: 74,
        clientAr: 'أمانة منطقة القصيم',
        clientEn: 'Al-Qassim Municipality',
      },
      {
        id: 'proj-3',
        titleAr: 'معالجة بلاغات 940 والتشوهات البصرية شمال مدينة بريدة',
        titleEn: 'Resolving 940 Reports & Visual Pollution North Buraidah',
        image: '/images/before-after/visual-pollution-after.jpg',
        progress: 100,
        clientAr: 'أمانة منطقة القصيم',
        clientEn: 'Al-Qassim Municipality',
      },
    ],
  },
  {
    id: 'kharj',
    nameAr: 'محافظة الخرج ورماح والمزاحمية',
    nameEn: 'Al-Kharj, Rmahh & Al-Muzahmiyah',
    projectCount: 8,
    activeKm: '+190 كم',
    pinX: 58,
    pinY: 55,
    highlightColor: '#002060',
    sampleProjects: [
      {
        id: 'proj-5',
        titleAr: 'تشغيل وصيانة مباني ومرافق بلدية محافظة الخرج',
        titleEn: 'O&M of Al-Kharj Municipality Buildings & Facilities',
        image: '/images/projects/project-5.jpg',
        progress: 83,
        clientAr: 'بلدية محافظة الخرج',
        clientEn: 'Al-Kharj Municipality',
      },
      {
        id: 'proj-12',
        titleAr: 'صيانة معدات بلدية محافظة رماح',
        titleEn: 'Maintenance of Rmahh Municipality Fleet & Equipment',
        image: '/images/projects/project-12.jpg',
        progress: 100,
        clientAr: 'بلدية محافظة رماح',
        clientEn: 'Rmahh Municipality',
      },
    ],
  },
  {
    id: 'ghat_zulfi',
    nameAr: 'محافظات الغاط والزلفي والمجمعة',
    nameEn: 'Al-Ghat, Al-Zulfi & Al-Majmaah',
    projectCount: 5,
    activeKm: '+110 كم',
    pinX: 48,
    pinY: 32,
    highlightColor: '#4A90E2',
    sampleProjects: [
      {
        id: 'proj-13',
        titleAr: 'صيانة الطرق الرئيسية والسوالف بمحافظة الغاط',
        titleEn: 'Main & Secondary Roads Maintenance in Al-Ghat',
        image: '/images/projects/project-13.jpg',
        progress: 100,
        clientAr: 'بلدية محافظة الغاط',
        clientEn: 'Al-Ghat Municipality',
      },
    ],
  },
  {
    id: 'madinah',
    nameAr: 'منطقة المدينة المنورة',
    nameEn: 'Al-Madinah Province',
    projectCount: 2,
    activeKm: '+45 كم',
    pinX: 28,
    pinY: 42,
    highlightColor: '#6B46C1',
    sampleProjects: [
      {
        id: 'proj-6',
        titleAr: 'صيانة الطرق وتصريف السيول بالمدينة',
        titleEn: 'Road Maintenance & Stormwater Channels',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
        progress: 80,
        clientAr: 'أمانة منطقة المدينة المنورة',
        clientEn: 'Madinah Municipality',
      },
    ],
  },
];

import { storageAdapter } from '../../services/storageAdapter';

interface InteractiveSaudiMapProps {
  locale?: 'ar' | 'en';
  onSelectRegion?: (regionId: string) => void;
  customRegions?: SaudiRegion[];
}

export default function InteractiveSaudiMap({
  locale = 'ar',
  onSelectRegion,
  customRegions,
}: InteractiveSaudiMapProps) {
  const isAr = locale === 'ar';
  const [storedRegions, setStoredRegions] = useState<SaudiRegion[]>(SAUDI_REGIONS);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('riyadh');

  useEffect(() => {
    if (customRegions && customRegions.length > 0) {
      setStoredRegions(customRegions);
    } else {
      const list = storageAdapter.getSaudiRegions();
      if (list && list.length > 0) {
        setStoredRegions(list as any);
      }
    }
  }, [customRegions]);

  const regions = customRegions && customRegions.length > 0 ? customRegions : storedRegions;
  const selectedRegion =
    regions.find((r) => r.id === selectedRegionId) || regions[0] || SAUDI_REGIONS[0];

  const handlePinClick = (regionId: string) => {
    setSelectedRegionId(regionId);
    if (onSelectRegion) {
      onSelectRegion(regionId);
    }
  };

  const totalProjectsAcrossKingdom = SAUDI_REGIONS.reduce(
    (acc, r) => acc + r.projectCount,
    0
  );

  return (
    <div className="space-y-6 text-start">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isAr ? 'الانتشار الجغرافي للمشاريع' : 'Geographical Projects Distribution'}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {isAr
              ? 'خريطة انتشار مشاريع هضاب الخليج عبر المملكة 🇸🇦'
              : 'Gulf Hills Projects Map across Saudi Arabia 🇸🇦'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'تغطية ميدانية واسعة لأعمال البنية التحتية والطرق وشبكات السيول والحواجز الخرسانية'
              : 'Field execution coverage for roads, stormwater drainage, and road safety barriers'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-center">
            <div className="text-lg font-black text-sky-600 font-mono">
              {totalProjectsAcrossKingdom}+
            </div>
            <div className="text-[10px] text-slate-500 font-bold">
              {isAr ? 'مشروع بالمملكة' : 'Kingdom Projects'}
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-lg font-black text-emerald-600 font-mono">
              5
            </div>
            <div className="text-[10px] text-slate-500 font-bold">
              {isAr ? 'مناطق رئيسية' : 'Key Regions'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Map Graphic & Interactive Pins (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-[#001845] to-[#002060] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-sky-900/40 flex flex-col justify-between min-h-[440px]">
          
          {/* Background Topo & Grid Lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#00B0F0 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          
          {/* Map Region Pills */}
          <div className="relative z-10 flex flex-wrap gap-2 pb-4">
            {SAUDI_REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handlePinClick(region.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-sky-200 border border-white/10'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isAr ? region.nameAr : region.nameEn}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px] font-mono">
                    {region.projectCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Saudi Map Canvas */}
          <div className="relative flex-1 flex items-center justify-center my-4 min-h-[260px]">
            {/* Stylized Saudi Map Silhouette */}
            <svg
              viewBox="0 0 800 650"
              className="w-full h-full max-h-[340px] drop-shadow-2xl opacity-80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Glow Boundary */}
              <path
                d="M 210,130 L 320,110 L 440,160 L 580,180 L 680,240 L 730,300 L 700,380 L 620,440 L 510,540 L 390,580 L 260,530 L 210,420 L 170,330 L 140,240 Z"
                fill="url(#mapGrad)"
                stroke="#00B0F0"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#002060" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#004080" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0070BA" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Interactive Pins on Map */}
            {SAUDI_REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const regionLabel = isAr
                ? `منطقة ${region.nameAr} - ${region.projectCount} مشاريع منجزة`
                : `${region.nameEn} - ${region.projectCount} completed projects`;

              return (
                <div
                  key={region.id}
                  role="button"
                  tabIndex={0}
                  aria-label={regionLabel}
                  aria-pressed={isSelected}
                  style={{
                    left: `${region.pinX}%`,
                    top: `${region.pinY}%`,
                  }}
                  onClick={() => handlePinClick(region.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePinClick(region.id);
                    }
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group focus:outline-none"
                >
                  {/* Radar Pulse Effect */}
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                      isSelected ? 'bg-sky-400' : 'bg-white/40'
                    }`}
                    style={{ animationDuration: isSelected ? '1.5s' : '3s' }}
                  />

                  {/* Pin Node */}
                  <div
                    className={`relative px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl transition-all group-focus:ring-2 group-focus:ring-sky-300 ${
                      isSelected
                        ? 'bg-sky-500 text-white ring-4 ring-sky-500/30 scale-110'
                        : 'bg-slate-900/90 text-sky-300 border border-sky-400/40 hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px] font-black whitespace-nowrap">
                      {isAr ? region.nameAr.split(' ')[0] : region.nameEn.split(' ')[0]}
                    </span>
                    <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] font-mono font-bold flex items-center justify-center">
                      {region.projectCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note inside map */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-sky-200/70 border-t border-white/10 pt-3">
            <span>{isAr ? 'اضغط على أي منطقة لعرض المشاريع المنفذة' : 'Click any region to view projects'}</span>
            <span className="font-mono text-sky-300 font-bold">KSA INFRASTRUCTURE MAP</span>
          </div>
        </div>

        {/* Right Side: Selected Region Projects & Details (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Region Title Card */}
            <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider">
                  {isAr ? 'المنطقة المحددة' : 'Selected Province'}
                </span>
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {selectedRegion.activeKm} {isAr ? 'أطوال منجزة' : 'Executed'}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isAr ? selectedRegion.nameAr : selectedRegion.nameEn}
              </h3>
            </div>

            {/* Sample Projects in this Region */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 block">
                {isAr ? 'أبرز المشاريع في هذه المنطقة:' : 'Landmark Projects in this Region:'}
              </span>

              <div className="space-y-3">
                {selectedRegion.sampleProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 hover:shadow-md transition-all flex items-center gap-3.5"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={proj.image} alt={proj.titleAr} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                        {isAr ? proj.titleAr : proj.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-sky-500" />
                        <span className="truncate">{isAr ? proj.clientAr : proj.clientEn}</span>
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-[#002060] rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-sky-600">
                          {proj.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Link to Full Projects Page */}
          <Link
            href={`/${locale}/projects`}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs font-black hover:shadow-lg shadow-sky-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'استعراض كافة مشاريع المنطقة والمملكة' : 'Explore All Kingdom Projects'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
}
