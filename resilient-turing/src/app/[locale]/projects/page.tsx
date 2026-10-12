"use client";

import React, { use, useState } from "react";
import { Waves, Route, Trash2, Building2 } from "lucide-react";
import Link from "next/link";
import { useProjects } from "../../../hooks";
import { RevealText } from "../../../animations/motion-components";
import { BRAND_CONFIG } from "../../../data/brandConfig";
import { PageHeader } from "../../../components/ui/PageHeader";
import InteractiveSaudiMap from "../../../components/ui/InteractiveSaudiMap";
import { getCategoryTheme } from "../../../utils/categoryThemes";

interface ProjectsPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = use(params);
  const { data: projects, isLoading } = useProjects(locale);
  const isAr = locale === "ar";
  const brand = BRAND_CONFIG[locale];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const operationalStats = [
    {
      code: "ST-01",
      icon: <Waves className="w-5 h-5" />,
      value: isAr ? "٤٥٠" : "450",
      unit: isAr ? "كم" : "KM",
      title: isAr ? "أطوال شبكات تصريف السيول والأمطار" : "Stormwater Pipe Networks Length",
    },
    {
      code: "RD-02",
      icon: <Route className="w-5 h-5" />,
      value: isAr ? "١.٢ مليون" : "1.2M",
      unit: isAr ? "م²" : "m²",
      title: isAr ? "مساحات رصف وسفلتة الطرق" : "Asphalt Pavement Area",
    },
    {
      code: "DB-03",
      icon: <Trash2 className="w-5 h-5" />,
      value: isAr ? "٥٠٠ ألف" : "500K",
      unit: isAr ? "م³" : "m³",
      title: isAr ? "مخلفات هدم ونظافة أراضي منقولة" : "Transported Construction Debris",
    },
  ];

  const filteredProjects = projects?.filter((proj) => {
    const matchesSearch = (
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isCompleted = proj.progress === 100;
    if (statusFilter === 'active') {
      return matchesSearch && !isCompleted;
    }
    if (statusFilter === 'completed') {
      return matchesSearch && isCompleted;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 sm:pt-10 pb-20 min-h-[85vh] bg-transparent text-text-main transition-colors duration-300">
      <PageHeader
        title={isAr ? "سجل المشاريع التشغيلية والإنجاز الميداني" : "Operational Projects & Field Achievements Record"}
        subtitle={isAr
          ? "توثيق رسمي شامل لكافة عقود ومشاريع شركة هضاب الخليج المنفذة والجاري تنفيذها بنطاق أمانات وبلديات مناطق المملكة المختلفة."
          : "Comprehensive official record of all Gulf Hills projects and contracts, executed or currently in progress across various Saudi regions and municipalities."}
        currentPageLabel={isAr ? "المشاريع" : "Our Projects"}
        locale={locale}
      />

      <div className="space-y-16">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-4">
          {operationalStats.map((stat) => (
            <div
              key={stat.code}
              className="group relative flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-[#0B111E]/40 border border-slate-200/80 dark:border-sky-900/20 overflow-hidden shadow-md shadow-slate-200/40 dark:shadow-none transition-all duration-300"
            >
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 w-1 rounded-full bg-[#0070BA] dark:bg-brand-sky" />
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0070BA]/5 dark:bg-brand-sky/5 border border-[#0070BA]/15 dark:border-brand-sky/15 flex items-center justify-center text-[#0070BA] dark:text-brand-sky">
                {stat.icon}
              </div>
              <div className="space-y-1 text-start">
                <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  {stat.code}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0070BA] dark:text-brand-sky tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {stat.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Interactive Saudi Arabia Projects Map */}
        <section>
          <InteractiveSaudiMap locale={locale} />
        </section>

        {/* Filters and List */}
        <div className="space-y-10 pt-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-gray-800/20">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full lg:max-w-2xl text-start">
              <div className="w-full md:w-80 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "البحث عن طريق العميل، النطاق..." : "Search by client, scope..."}
                  className="w-full px-5 py-3 rounded-xl bg-white dark:bg-[#070C15]/40 border border-slate-200 dark:border-gray-850/40 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0070BA] dark:focus:border-brand-sky transition-colors shadow-inner"
                />
              </div>

              {/* Status Filter Tab Buttons */}
              <div className="flex rounded-xl bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-gray-850/40 p-1 shrink-0">
                {[
                  { id: 'all', label: isAr ? 'الكل' : 'All' },
                  { id: 'active', label: isAr ? 'المشاريع الجارية' : 'Active Projects' },
                  { id: 'completed', label: isAr ? 'المكتملة' : 'Completed' }
                ].map((tab) => {
                  const isActive = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-[#070C15] text-[#0070BA] dark:text-[#00B0F0] shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-text-main'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-655 dark:text-text-sub font-bold text-start shrink-0">
              {filteredProjects && (
                <span>
                  {isAr ? `تم تحديد ${filteredProjects.length} قطاعات عمل ميدانية` : `Found ${filteredProjects.length} field work sectors`}
                </span>
              )}
            </div>
          </div>

          {/* Grid display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/40 rounded-2xl h-[320px]"></div>
              ))}
            </div>
          ) : filteredProjects?.length === 0 ? (
            <div className="text-center py-20 bg-slate-100/30 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-200 dark:border-gray-800/20">
              <p className="text-sm text-slate-500 font-semibold">
                {isAr ? "لم يتم العثور على قطاعات تطابق بحثك حالياً." : "No sectors match your query currently."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((proj, idx) => {
                const zoneCode = "ZONE-" + String.fromCharCode(65 + (idx % 6));
                const sectorCode = "SEC-" + String(idx + 1).padStart(2, '0');
                const progress = proj.progress !== undefined ? proj.progress : 100;
                const statusLabel = progress === 100
                  ? (isAr ? "مكتمل" : "Completed")
                  : (isAr ? "جاري العمل" : "In Progress");

                const catTheme = getCategoryTheme(proj.category);

                return (
                  <Link
                    key={proj.id}
                    href={`/${locale}/projects/${proj.id}`}
                    className={`group relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border ${catTheme.cardBorder} ${catTheme.hoverBorder} ${catTheme.cardShadow} shadow-xl dark:shadow-2xl p-7 transition-all duration-500 hover:-translate-y-2.5 backdrop-blur-2xl cursor-pointer text-start overflow-hidden flex flex-col justify-between min-h-[340px]`}
                  >
                    {/* Catalog Color Spotlight Glow */}
                    <div className={`absolute top-0 right-0 w-44 h-44 ${catTheme.glowBg} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4 relative z-10">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={`w-2.5 h-2.5 rounded-full ${catTheme.badgeBg} border ${catTheme.badgeBorder} relative flex`} />
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          {sectorCode} / {zoneCode}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg ${catTheme.badgeBg} ${catTheme.badgeText} text-[9px] font-black tracking-wider uppercase border ${catTheme.badgeBorder}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="py-4 space-y-3 relative z-10">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${catTheme.accentText} block truncate`}>
                        {proj.category}
                      </span>
                      <h2 className={`text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug ${catTheme.titleHover} transition-colors duration-300`}>
                        {proj.title}
                      </h2>
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span className="truncate">{proj.client}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 relative z-10">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        <span>{isAr ? "معدل الإنجاز الميداني" : "FIELD COMPLETION RATE"}</span>
                        <span className={catTheme.accentText}>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div
                          className={`h-full bg-gradient-to-r ${catTheme.progressGradient} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className={`text-[11px] font-bold ${catTheme.accentText} flex items-center justify-end space-x-1 rtl:space-x-reverse group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300 pt-1`}>
                        <span>{isAr ? "عرض السجل الميداني التفصيلي" : "View Detailed Field Record"}</span>
                        <span>←</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Static footer */}
      <div className="pt-10 pb-8 border-t border-gray-200/15 dark:border-gray-800/25 flex justify-center text-xs text-text-sub font-semibold">
        <span>&copy; {new Date().getFullYear()} {brand.name}</span>
      </div>

    </div>
  );
}