"use client";

import React, { use } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  ArrowRight,
  FolderKanban,
  Wrench,
  Truck,
  Users,
  Award,
  Handshake,
  TrendingUp,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface DesignHubProps {
  params: Promise<{ locale: string }>;
}

export default function DesignHubPage({ params }: DesignHubProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const visualPages = [
    {
      id: 'page-home',
      titleAr: 'الصفحة الرئيسية الكاملة',
      titleEn: 'Main Corporate Home Page',
      descAr: 'تحكم تركيبي في الهيرو، الخدمات، الخط الزمني 3D، المشاريع، خريطة المملكة، الشركاء، والإحصائيات.',
      descEn: 'Full composition: Hero, Services, 3D Timeline, Projects, Saudi Map, Partners, and Stats.',
      color: 'from-sky-500 to-blue-600',
      href: `/${locale}/admin/visual-builder/page-home`,
    },
    {
      id: 'page-about',
      titleAr: 'صفحة عن الشركة (الرؤية والرسالة)',
      titleEn: 'About Us (Vision & Mission)',
      descAr: 'تخصيص البانر التعريفي، نصوص الرؤية والرسالة، مؤشرات الأداء، وشارات الاعتماد.',
      descEn: 'Customize overview banner, corporate vision/mission statements, KPIs, and accreditation.',
      color: 'from-emerald-500 to-teal-600',
      href: `/${locale}/admin/visual-builder/page-about`,
    },
    {
      id: 'page-chairman',
      titleAr: 'صفحة كلمة رئيس مجلس الإدارة',
      titleEn: "Chairman's Message",
      descAr: 'تخصيص البانر القيادي، الكلمة الاستراتيجية، ومستهدفات رؤية المملكة 2030.',
      descEn: 'Executive leadership address, strategic direction, and Vision 2030 targets.',
      color: 'from-amber-500 to-orange-600',
      href: `/${locale}/admin/visual-builder/page-chairman`,
    },
    {
      id: 'page-contact',
      titleAr: 'صفحة التواصل وطلب عروض الأسعار',
      titleEn: 'Contact & RFQ Inquiries',
      descAr: 'تخصيص نموذج طلب الأسعار RFQ، عناوين الفروع، الخط الساخن، وودجت الواتساب.',
      descEn: 'RFQ tender form, branch locations, direct hotlines, and WhatsApp widget.',
      color: 'from-indigo-500 to-purple-600',
      href: `/${locale}/admin/visual-builder/page-contact`,
    },
  ];

  const entityRepositories = [
    {
      titleAr: 'مستودع المشاريع المركزي',
      titleEn: 'Projects Repository',
      icon: FolderKanban,
      href: `/${locale}/admin/projects`,
    },
    {
      titleAr: 'مستودع الخدمات والأعمال',
      titleEn: 'Services Repository',
      icon: Wrench,
      href: `/${locale}/admin/services`,
    },
    {
      titleAr: 'أسطول الآليات والمعدات',
      titleEn: 'Equipment Fleet',
      icon: Truck,
      href: `/${locale}/admin/equipment`,
    },
    {
      titleAr: 'فريق العمل والقيادة',
      titleEn: 'Team & Leadership',
      icon: Users,
      href: `/${locale}/admin/team`,
    },
    {
      titleAr: 'الشهادات وتصنيف الآيزو',
      titleEn: 'Certificates & ISO',
      icon: Award,
      href: `/${locale}/admin/certificates`,
    },
    {
      titleAr: 'الشركاء والجهات الحكومية',
      titleEn: 'Partners & Clients',
      icon: Handshake,
      href: `/${locale}/admin/partners`,
    },
    {
      titleAr: 'مؤشرات الإنجاز والأرقام',
      titleEn: 'Statistics & KPIs',
      icon: TrendingUp,
      href: `/${locale}/admin/statistics`,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border border-slate-800 p-8 shadow-2xl shadow-slate-950/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'مركز التصميم والمحتوى الموحد' : 'Unified Design & Content Studio'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl mb-3">
              {isAr ? 'استوديو بناء الصفحات وإدارة الكيانات المركزية' : 'Visual Page Builder & Entity Hub'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'تم توحيد تجربة التحرير في استوديو الـ Visual CMS المعتمد: صفحات تركيبية من كتل مضبوطة، ومستودعات بيانات أعمال مركزية تمنع تكرار مصادر الحقيقة.'
                : 'All page customization is unified in the Visual CMS Studio, while business data is maintained in central single-source repositories.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/admin/visual-builder`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'فتح دليل استوديو Visual Builder' : 'Open Visual Builder'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Pages Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'محررات الصفحات المرئية (Visual Page Editors)' : 'Visual Page Editors'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visualPages.map((page) => (
            <div
              key={page.id}
              className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 flex flex-col justify-between hover:border-sky-500/50 hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${page.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استوديو كتل معتمد' : 'Validated Studio'}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {isAr ? page.titleAr : page.titleEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {isAr ? page.descAr : page.descEn}
                </p>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-800/80">
                <Link
                  href={page.href}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm group-hover:shadow-sky-500/20"
                >
                  <span>{isAr ? 'فتح المحرر المرئي' : 'Launch Visual Editor'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Central Repositories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'مستودعات بيانات الأعمال المركزية (Single Source of Truth)' : 'Central Entity Repositories'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {entityRepositories.map((repo) => {
            const Icon = repo.icon;
            return (
              <Link
                key={repo.href}
                href={repo.href}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                  {isAr ? repo.titleAr : repo.titleEn}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
