import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Award,
  Inbox,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import {
  Project,
  Certificate,
  Service,
  Inquiry,
  ActivityLog,
  RichArticleItem,
} from '../../../types';
import { useAdminAuth } from '../../../context/useAdminAuth';

interface AdminOverviewProps {
  params: Promise<{ locale: string }>;
}

export default function AdminOverviewPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
  const { user } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [articles, setArticles] = useState<RichArticleItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminApi.getProjects(locale),
      adminApi.getCertificates(locale),
      adminApi.getServices(locale),
      adminApi.getInquiries(),
      adminApi.getRichArticles(),
      adminApi.getActivityLogs(),
    ]).then(([p, c, s, inq, art, l]) => {
      if (mounted) {
        setProjects(p || []);
        setCertificates(c || []);
        setServices(s || []);
        setInquiries(inq || []);
        setArticles(art || []);
        setLogs(l || []);
      }
    }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, [locale]);

  // Derived metrics
  const totalProjects = projects.length;
  const avgProgress =
    totalProjects > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects
        )
      : 0;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const isoCount = certificates.filter((c) => c.type === 'iso').length;

  return (
    <div className="space-y-8">
      {/* 1. Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001845] via-[#002855] to-[#004080] text-white p-6 sm:p-8 shadow-2xl shadow-sky-950/30 border border-sky-500/30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 text-start">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black border border-white/15 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAr ? 'مركز القيادة والتحكم الإنشائي' : 'Executive Command Center'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isAr ? 'النظام متصل — Hostinger Cloud' : 'Live Production — Hostinger'}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isAr
                ? `مرحباً بك، ${user?.name || 'م. أيمن جميل الحاتم'}`
                : `Welcome, ${user?.name || 'Eng. Ayman Al-Hatem'}`}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed font-medium">
              {isAr
                ? 'لوحة إدارة شركة هضاب الخليج للمقاولات — تحكم كامل ومباشر في العقود والمشاريع الميدانية، كتالوج الاعتمادات الرسمية، وإدارة عروض الأسعار.'
                : 'Arabian Gulf Hills Operations Command — Real-time control of civil infrastructure contracts, sovereign accreditation assets, and client procurement leads.'}
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/admin/projects`}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-sky-950/30 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'إضافة مشروع جديد' : 'New Project'}</span>
            </Link>
            <Link
              href={`/${locale}/admin/articles`}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'إضافة خبر جديد' : 'New Article'}</span>
            </Link>
            <Link
              href={`/${locale}/admin/inquiries`}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Inbox className="w-4 h-4 text-sky-300" />
              <span>
                {isAr ? 'صندوق الوارد' : 'Inquiries'}
                {newInquiries > 0 && (
                  <span className="ms-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {newInquiries}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Projects */}
        <Link
          href={`/${locale}/admin/projects`}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-500/50 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isAr ? 'المشاريع المنفذة والنشطة' : 'Active Projects'}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0070BA] dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalProjects}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              {avgProgress}% {isAr ? 'متوسط الإنجاز' : 'Avg. Completion'}
            </span>
          </div>
        </Link>

        {/* Metric 2: Certificates */}
        <Link
          href={`/${locale}/admin/certificates`}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isAr ? 'الشهادات والاعتمادات' : 'Certifications'}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {certificates.length}
            </span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-900/40">
              {isoCount} ISO {isAr ? 'معتمدة' : 'Accredited'}
            </span>
          </div>
        </Link>

        {/* Metric 3: Inquiries */}
        <Link
          href={`/${locale}/admin/inquiries`}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isAr ? 'طلبات التواصل والعروض' : 'Inquiries & Leads'}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {inquiries.length}
            </span>
            {newInquiries > 0 ? (
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/40 animate-pulse">
                {newInquiries} {isAr ? 'جديدة' : 'New'}
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                {isAr ? 'مستقرة' : 'All Clear'}
              </span>
            )}
          </div>
        </Link>

        {/* Metric 4: Services */}
        <Link
          href={`/${locale}/admin/services`}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isAr ? 'الخدمات الهندسية' : 'Core Services'}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {services.length}
            </span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-200 dark:border-purple-900/40">
              {isAr ? 'مجالات تخصص رئيسية' : 'Specialized Sectors'}
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Main Grid: Recent Inquiries & Projects Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Right Column: Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isAr ? 'أحدث طلبات التواصل وعروض الأسعار' : 'Recent Inquiries & RFP Leads'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'الرسائل الواردة عبر نموذج الموقع' : 'Leads sent from the public contact form'}
              </p>
            </div>
            <Link
              href={`/${locale}/admin/inquiries`}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-500/30 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {inquiry.name}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        inquiry.status === 'new'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : inquiry.status === 'in-progress'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {inquiry.status === 'new'
                        ? isAr ? 'جديدة' : 'New'
                        : inquiry.status === 'in-progress'
                        ? isAr ? 'قيد المتابعة' : 'In Progress'
                        : isAr ? 'مكتملة' : 'Resolved'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {inquiry.message}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {inquiry.phone} | {inquiry.email}
                  </p>
                </div>

                <Link
                  href={`/${locale}/admin/inquiries`}
                  className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
                >
                  {isAr ? 'متابعة' : 'Inspect'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right/Left Column: Top Active Projects (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isAr ? 'مشاريع قيد الإنجاز' : 'Ongoing Projects'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'نسب الإنجاز الميداني' : 'Field completion percentages'}
              </p>
            </div>
            <Link
              href={`/${locale}/admin/projects`}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'إدارة' : 'Manage'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {project.title}
                  </span>
                  <span className="font-black text-sky-600 dark:text-sky-400 font-mono">
                    {project.progress || 0}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-[#002060] transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{project.client}</span>
                  <span>{project.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Activity Logs Ticker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <Clock className="w-4 h-4 text-sky-500" />
          <span>{isAr ? 'سجل العمليات والنشاطات الأخيرة' : 'Recent Operations & Activity Log'}</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    log.action === 'create'
                      ? 'bg-emerald-500'
                      : log.action === 'update'
                      ? 'bg-sky-500'
                      : log.action === 'delete'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {log.entityTitle}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({log.adminName})
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(log.timestamp).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
