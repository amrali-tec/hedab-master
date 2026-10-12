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
import { storageAdapter } from '../../../services/storageAdapter';
import {
  Project,
  Certificate,
  Service,
  Inquiry,
  ActivityLog,
} from '../../../types';
import { useAdminAuth } from '../../../context/useAdminAuth';

interface AdminOverviewProps {
  params: Promise<{ locale: string }>;
}

export default function AdminOverviewPage({ params }: AdminOverviewProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const { user } = useAdminAuth();
  const isAr = locale === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setProjects(storageAdapter.getProjects(locale));
    setCertificates(storageAdapter.getCertificates(locale));
    setServices(storageAdapter.getServices(locale));
    setInquiries(storageAdapter.getInquiries());
    setLogs(storageAdapter.getLogs());
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002060] via-[#004080] to-[#0070BA] text-white p-6 sm:p-8 shadow-xl shadow-sky-950/20 border border-sky-600/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'مركز القيادة والتحكم' : 'Executive Command Center'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isAr
                ? `مرحباً بك، ${user?.name || 'م. أيمن جميل الحاتم'}`
                : `Welcome, ${user?.name || 'Eng. Ayman Al-Hatem'}`}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              {isAr
                ? 'لوحة إدارة شركة هضاب الخليج للمقاولات - التحكم المباشر في بيانات المشاريع، الاعتمادات، وصندوق طلبات عروض الأسعار.'
                : 'Arabian Gulf Hills Operations - Live management of engineering projects, certifications, and procurement leads.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/admin/projects`}
              className="px-4 py-2.5 rounded-xl bg-white text-[#002060] text-xs font-black hover:bg-sky-50 transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة مشروع' : 'New Project'}</span>
            </Link>
            <Link
              href={`/${locale}/admin/inquiries`}
              className="px-4 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/70 border border-sky-400/30 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Inbox className="w-4 h-4" />
              <span>
                {isAr ? 'صندوق الوارد' : 'Inquiries'}
                {newInquiries > 0 && ` (${newInquiries})`}
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
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'المشاريع المنفذة والنشطة' : 'Active Projects'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalProjects}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {avgProgress}% {isAr ? 'متوسط الإنجاز' : 'Avg. Progress'}
            </span>
          </div>
        </Link>

        {/* Metric 2: Certificates */}
        <Link
          href={`/${locale}/admin/certificates`}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'الشهادات والاعتمادات' : 'Certifications'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {certificates.length}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ({isoCount} ISO {isAr ? 'معتمدة' : 'Accredited'})
            </span>
          </div>
        </Link>

        {/* Metric 3: Inquiries */}
        <Link
          href={`/${locale}/admin/inquiries`}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'طلبات التواصل والعروض' : 'Inquiries & Leads'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {inquiries.length}
            </span>
            {newInquiries > 0 ? (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                {newInquiries} {isAr ? 'جديدة' : 'New'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {isAr ? 'تمت المتابعة' : 'All Clear'}
              </span>
            )}
          </div>
        </Link>

        {/* Metric 4: Services */}
        <Link
          href={`/${locale}/admin/services`}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'الخدمات الهندسية' : 'Core Services'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {services.length}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {isAr ? 'مجالات تخصص رئيسية' : 'Major Divisions'}
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
