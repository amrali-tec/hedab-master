"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Award,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  HardHat,
  Crown,
  FolderKanban,
} from 'lucide-react';
import { BRAND_IDENTITY } from '../../config/brand';
import { mockData } from '../../data/mockData';
import { storageAdapter } from '../../services/storageAdapter';

interface CorporateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'ar' | 'en';
}

export default function CorporateProfileModal({
  isOpen,
  onClose,
  locale = 'ar',
}: CorporateProfileModalProps) {
  const isAr = locale === 'ar';
  const printRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const s = storageAdapter.getBrandSettings();
    setSettings(s);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentData = mockData[locale] || mockData.ar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col">
        {/* Actions Bar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                {isAr ? 'الملف التأهيلي الرسمي للشركة (Prequalification Dossier)' : 'Official Prequalification Dossier'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'جاهز للطباعة أو الحفظ كـ PDF للمناقصات والاعتمادات الحكومية' : 'Print-ready / Save as PDF for tenders'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={settings?.profilePdfUrl || "/gulf-hills-profile.pdf"}
              download="Arabian-GulfHILLS-Profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black hover:shadow-lg shadow-emerald-950/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تنزيل بروفايل الشركة (PDF)' : 'Download Profile PDF'}</span>
            </a>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4 text-sky-500" />
              <span>{isAr ? 'طباعة / معاينة' : 'Print View'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document View */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-8 bg-white text-slate-900 font-sans"
        >
          {/* Document Header Letterhead */}
          <div className="border-b-4 border-[#002060] pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-start">
              <div className="h-16 sm:h-20 w-auto flex items-center justify-center">
                <img src="/logo-light.png" alt={BRAND_IDENTITY.name.ar} className="h-full w-auto object-contain max-w-[280px]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002060]">
                  {BRAND_IDENTITY.name.ar}
                </h1>
                <h2 className="text-xs font-bold text-slate-500 tracking-wider">
                  {BRAND_IDENTITY.name.en}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 mt-1">
                  <span>س.ت: {BRAND_IDENTITY.cr}</span>
                  <span>•</span>
                  <span>الرقم الضريبي: {BRAND_IDENTITY.vat}</span>
                </div>
              </div>
            </div>

            {/* Version Badge */}
            <div className="text-center sm:text-end p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest block">
                {isAr ? 'ملف التعريف والتأهيل الفني' : 'Technical Profile Dossier'}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#002060] block pt-1">
                {isAr
                  ? settings?.profileReleaseYearAr || 'إصدار الشركة لعام 2026م'
                  : settings?.profileReleaseYearEn || 'Company Release 2026'}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="space-y-3 text-start">
            <h3 className="text-sm font-black text-[#002060] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>نبذة عن الشركة والقدرات التشغيلية</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              تعتبر <strong>شركة هضاب الخليج العربي للمقاولات</strong> إحدى الشركات الوطنية الرائدة في قطاع المقاولات العامة وتطوير البنية التحتية بالمملكة العربية السعودية، متخصصة في تنفيذ مشاريع صيانة وسفلتة الطرق، تمديد شبكات تصريف مياه الأمطار والسيول، وتصنيع وتركيب الحواجز الخرسانية مسبقة الصب (نيوجيرسي) والأرصفة، مستندة إلى كادر هندسي رفيع وأسطول آليات ثقيلة متكامل.
            </p>
          </div>

          {/* Section 2: Official Accreditations & ISO Certifications */}
          <div className="space-y-3 text-start">
            <h3 className="text-sm font-black text-[#002060] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>الشهادات والاعتمادات الرسمية (ISO Accreditations)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-start space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase font-mono block">ISO 9001:2015</span>
                <h4 className="text-xs font-black text-slate-900">نظام إدارة الجودة الشاملة</h4>
                <p className="text-[10px] text-slate-500">معتمد لتنفيذ عقود البنية التحتية والطرق</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-start space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono block">ISO 14001:2015</span>
                <h4 className="text-xs font-black text-slate-900">نظام الإدارة البيئية</h4>
                <p className="text-[10px] text-slate-500">الالتزام بالاستدامة والمعايير البيئية</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-start space-y-1">
                <span className="text-[10px] font-bold text-sky-700 uppercase font-mono block">ISO 45001:2018</span>
                <h4 className="text-xs font-black text-slate-900">السلامة والصحة المهنية</h4>
                <p className="text-[10px] text-slate-500">حماية الكوادر والمواقع الميدانية</p>
              </div>
            </div>
          </div>

          {/* Section 3: Core Service Sectors & Machinery Fleet */}
          <div className="space-y-3 text-start">
            <h3 className="text-sm font-black text-[#002060] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>المجالات التشغيلية والأسطول الميداني</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-black text-slate-900 block">سفلتة وكشط الطرق</span>
                <span className="text-[10px] text-slate-500">كاشطات Wirtgen & رصاصات Dynapac</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-black text-slate-900 block">شبكات تصريف السيول</span>
                <span className="text-[10px] text-slate-500">حفارات CAT & أنابيب حتى 2400 ملم</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-black text-slate-900 block">حواجز نيوجيرسي الخرسانية</span>
                <span className="text-[10px] text-slate-500">صب مسبق وفق كود وزارة النقل</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-black text-slate-900 block">تشغيل وصيانة المرافق</span>
                <span className="text-[10px] text-slate-500">عقود أمانة الرياض والمناطق</span>
              </div>
            </div>
          </div>

          {/* Section 4: Landmark Projects Portfolio */}
          <div className="space-y-3 text-start">
            <h3 className="text-sm font-black text-[#002060] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-sky-600" />
              <span>سجل المشاريع المنجزة ونماذج الأعمال</span>
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-start">
                <thead className="bg-[#002060] text-white text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5">اسم المشروع</th>
                    <th className="p-2.5">الجهة المالكة / العميل</th>
                    <th className="p-2.5">الموقع</th>
                    <th className="p-2.5 text-center">حالة الإنجاز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentData.projects?.slice(0, 5).map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2.5 font-bold text-slate-900">{p.title}</td>
                      <td className="p-2.5 text-slate-600">{p.client}</td>
                      <td className="p-2.5 text-slate-600">{p.location}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {p.progress || 100}% مكتمل
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-start print:border-slate-300">
            <div className="flex items-center gap-1.5 text-[#002060] font-black text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{isAr ? 'إخلاء مسؤولية تنظيمي وقانوني (Legal Disclaimer)' : 'Executive Legal Disclaimer'}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              {isAr
                ? settings?.profileDisclaimerAr || 'تنويه رسمي: هذا المستند عبارة عن ملخص استعراضي وتأهيلي مبدئي للتعريف بالقدرات التشغيلية وسابقة الأعمال لشركة هضاب الخليج العربي للمقاولات. لا يُعتبر هذا المستند عقداً ملزماً أو تعهداً مالياً أو إيجاباً قانونياً رتيباً على الشركة، وتخضع كافة الالتزامات والاعتمادات النهائية للعقود الرسمية المنفصلة والموقعة بين الأطراف ذات العلاقة.'
                : settings?.profileDisclaimerEn || 'Official Notice: This document serves as an informational prequalification summary showcasing the capabilities and track record of Arabian Gulf Hills Contracting Company. It does not constitute a legally binding contract, offer, or financial obligation. All formal commitments are subject to separate fully executed agreements.'}
            </p>
          </div>

          {/* Document Footer: Contacts & Official Stamp */}
          <div className="border-t-2 border-[#002060] pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="space-y-1 text-start">
              <p className="font-bold text-slate-900">العنوان الوطني المعتمد:</p>
              <p>{BRAND_IDENTITY.address.ar}</p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] pt-1">
                <span>هاتف: {BRAND_IDENTITY.phone}</span>
                <span>•</span>
                <span>البريد: {BRAND_IDENTITY.email}</span>
              </div>
            </div>

            {/* Official Stamp & Signature Box */}
            <div className="w-44 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-2 text-center bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ختم وتوقيع الإدارة التنفيذية</span>
              <span className="text-xs font-black text-[#002060] mt-1">هضاب الخليج للمقاولات</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">2026 RELEASE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
