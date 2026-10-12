"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  Eye,
  Sliders,
  ShieldCheck,
  Building2,
  FolderKanban,
  Truck,
  Award,
  Users,
  Newspaper,
} from 'lucide-react';
import { contentEngine } from '../../../../services/contentEngine';
import { ContentPage } from '../../../../lib/cms/blockSchemas';

interface VisualBuilderIndexProps {
  params: Promise<{ locale: string }>;
}

export default function VisualBuilderIndexPage({ params }: VisualBuilderIndexProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [pages, setPages] = useState<ContentPage[]>([]);

  useEffect(() => {
    setPages(contentEngine.getPages());
  }, []);

  const pageDescriptions: Record<string, { ar: string; en: string; icon: any; color: string }> = {
    'page-home': {
      ar: 'الصفحة الرئيسية الكاملة: البانر الرئيسي، لوحة الخدمات، الخط الزمني 3D، المشاريع، خريطة التغطية، الشركاء، والإحصائيات.',
      en: 'Main homepage: Hero, Services, 3D Timeline, Projects, Map, Partners, and Stats.',
      icon: Sparkles,
      color: 'from-sky-500 to-blue-600',
    },
    'page-about': {
      ar: 'صفحة عن الشركة: قصة التأسيس، الرؤية والرسالة الاستراتيجية، القيم المؤسسية، والإحصائيات العامة.',
      en: 'About Us page: Founding story, corporate vision & mission, and key metrics.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-600',
    },
    'page-services': {
      ar: 'صفحة الخدمات الهندسية: التخصصات الإنشائية، أعمال الكشط والسفلتة، شبكات السيول، الحواجز الخرسانية، ولوحة التحكم.',
      en: 'Services page: Infrastructure capabilities, road milling, stormwater drainage, and precast barriers.',
      icon: Building2,
      color: 'from-blue-600 to-indigo-700',
    },
    'page-projects': {
      ar: 'صفحة المشاريع والعقود: معرض المشاريع السيادية المنجزة، عقود صيانة الطرق، الخريطة الجغرافية، والشركاء.',
      en: 'Projects page: Completed municipal contracts, asphalt paving track record, and regional interactive map.',
      icon: FolderKanban,
      color: 'from-[#0070BA] to-cyan-600',
    },
    'page-equipment': {
      ar: 'صفحة أسطول الآليات: كتل استعراض أكثر من 150 معدة ثقيلة، مكائن الكشط، الفرادات، ومحطات التتبع اللحظي IoT.',
      en: 'Fleet page: Heavy machinery showcase (150+ units), cold milling planers, pavers, and IoT telematics.',
      icon: Truck,
      color: 'from-amber-500 to-yellow-600',
    },
    'page-certificates': {
      ar: 'صفحة الاعتمادات والشهادات: مركز الكتالوجات السيادية، ملف البروفايل PDF، المحتوى المحلي 52.97%، وشهادات ISO.',
      en: 'Certificates center: Sovereign document library, corporate profile PDF, 52.97% local content, and 5 ISO certs.',
      icon: Award,
      color: 'from-rose-500 to-pink-600',
    },
    'page-chairman': {
      ar: 'صفحة كلمة رئيس مجلس الإدارة: التوجيه الاستراتيجي للشركة، الرسالة القيادية، ومستهدفات رؤية المملكة 2030.',
      en: "Chairman's message page: Strategic direction, executive address, and Vision 2030 targets.",
      icon: Layers,
      color: 'from-amber-600 to-orange-600',
    },
    'page-team': {
      ar: 'صفحة الهيكل الإداري: الفريق الإداري والقيادة الفنية، مدراء المشاريع الميدانيين، واشتراطات الجودة والسلامة.',
      en: 'Team & Leadership page: Executive officers, senior project managers, and HSE quality engineers.',
      icon: Users,
      color: 'from-purple-500 to-violet-600',
    },
    'page-news': {
      ar: 'صفحة المركز الإعلامي: الأخبار والمستجدات الإنشائية، تغطية تدشين الأسطول، والتغطيات الصحفية للمشاريع.',
      en: 'News & Media page: Corporate press releases, technical milestone announcements, and project updates.',
      icon: Newspaper,
      color: 'from-teal-500 to-emerald-600',
    },
    'page-contact': {
      ar: 'صفحة التواصل وطلب عروض الأسعار: نموذج RFQ، أرقام الخط الساخن المباشر، الفروع، والواتساب الفوري.',
      en: 'Contact & RFQ page: Quote request forms, direct hotlines, branches, and instant WhatsApp chat.',
      icon: Sliders,
      color: 'from-indigo-500 to-purple-600',
    },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border border-slate-800 p-8 shadow-2xl shadow-slate-950/60">
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'منظومة إدارة المحتوى المرئي الشاملة (10 صفحات معتمدة)' : 'Visual CMS Directory (10 Certified Pages)'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl mb-3">
              {isAr ? 'استوديو بناء وتخصيص صفحات الموقع' : 'Visual Page & Block Builder Directory'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'تحكم تركيبي كامل في جميع صفحات الموقع (10 صفحات): بناء وتعديل الكتل، مسودات عمل معزولة، معاينة لحظية، ونشر ذري مع سجل إصدارات واسترجاع فوري.'
                : 'Full compositional control over all 10 site pages: build & edit blocks, isolated drafts, live preview, and atomic rollback.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/admin/visual-builder/page-home`}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'فتح محرر الرئيسية مباشرة' : 'Edit Home Page'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'جميع الصفحات التركيبية النشطة (10 صفحات متاحة للتعديل)' : 'Active Visual Pages (10 Editable Pages)'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {pages.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => {
            const meta = pageDescriptions[page.id] || {
              ar: 'صفحة محتوى مرئية مبنية من كتل معتمدة ومخصصة.',
              en: 'Visual page composed of validated blocks.',
              icon: FileText,
              color: 'from-slate-700 to-slate-900',
            };
            const Icon = meta.icon;

            return (
              <div
                key={page.id}
                className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 flex flex-col justify-between hover:border-sky-500/50 hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-md shadow-sky-500/10 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'منشور ومعتمد' : 'Published'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {isAr ? page.titleAr : page.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {isAr ? meta.ar : meta.en}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-mono">
                    المسار: /{locale}/{page.slug === 'home' ? '' : page.slug}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${locale}/${page.slug === 'home' ? '' : page.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={isAr ? 'معاينة الصفحة العامة' : 'Preview Public Page'}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/${locale}/admin/visual-builder/${page.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 text-xs font-bold transition-all"
                    >
                      <span>{isAr ? 'فتح المحرر' : 'Edit Blocks'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
