"use client";

import React, { use, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  FileText,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Download,
  Upload,
  Database,
  AlertCircle,
  Globe,
  Search,
  Sparkles,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { SeoSettingsConfig, SeoPageMeta } from '../../../../types';

interface SettingsAdminProps {
  params: Promise<{ locale: string }>;
}

export default function SettingsAdminPage({ params }: SettingsAdminProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'seo' | 'backup'>('general');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Brand Settings Form
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nameAr: '',
      nameEn: '',
      taglineAr: '',
      taglineEn: '',
      phone: '',
      email: '',
      cr: '',
      vat: '',
      addressAr: '',
      addressEn: '',
      profilePdfUrl: '',
      profileReleaseYearAr: '',
      profileReleaseYearEn: '',
      profileDisclaimerAr: '',
      profileDisclaimerEn: '',
    },
  });

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState<SeoSettingsConfig | null>(null);
  const [selectedSeoPage, setSelectedSeoPage] = useState<keyof SeoSettingsConfig>('home');
  const [seoPageData, setSeoPageData] = useState<SeoPageMeta>({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    keywordsAr: [],
    keywordsEn: [],
    ogImage: '',
  });
  const [keywordsArInput, setKeywordsArInput] = useState('');
  const [keywordsEnInput, setKeywordsEnInput] = useState('');
  const [isSeoSaving, setIsSeoSaving] = useState(false);

  const loadSettings = () => {
    const current = storageAdapter.getBrandSettings();
    reset(current);
    const seo = storageAdapter.getSeoSettings();
    setSeoSettings(seo);
    if (seo && seo[selectedSeoPage]) {
      setSeoPageData(seo[selectedSeoPage]);
      setKeywordsArInput((seo[selectedSeoPage].keywordsAr || []).join(', '));
      setKeywordsEnInput((seo[selectedSeoPage].keywordsEn || []).join(', '));
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (seoSettings && seoSettings[selectedSeoPage]) {
      const p = seoSettings[selectedSeoPage];
      setSeoPageData(p);
      setKeywordsArInput((p.keywordsAr || []).join(', '));
      setKeywordsEnInput((p.keywordsEn || []).join(', '));
    }
  }, [selectedSeoPage, seoSettings]);

  const onSubmit = (data: any) => {
    storageAdapter.saveBrandSettings(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoSettings) return;

    const updatedKeywordsAr = keywordsArInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const updatedKeywordsEn = keywordsEnInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const updatedSeo: SeoSettingsConfig = {
      ...seoSettings,
      [selectedSeoPage]: {
        ...seoPageData,
        keywordsAr: updatedKeywordsAr,
        keywordsEn: updatedKeywordsEn,
      },
    };

    setSeoSettings(updatedSeo);
    setIsSeoSaving(true);
    storageAdapter.saveSeoSettings(updatedSeo);
    setTimeout(() => {
      setIsSeoSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 400);
  };

  const handleExportBackup = () => {
    const jsonStr = storageAdapter.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gulf_hills_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = storageAdapter.importAllData(content);
        if (res.success) {
          setImportStatus(
            isAr
              ? `تمت استعادة ${res.count} عنصراً وقسماً بنجاح!`
              : `Successfully restored ${res.count} data items!`
          );
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setImportError(res.error || (isAr ? 'فشل استيراد ملف النسخة الاحتياطية' : 'Failed to import backup file'));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isAr
          ? 'هل تريد بالتأكيد إعادة تعيين كافة البيانات إلى الحالة الافتراضية الأولية؟'
          : 'Are you sure you want to reset all data to default initial values?'
      )
    ) {
      storageAdapter.resetToInitialSeed();
      setIsResetDone(true);
      setTimeout(() => {
        setIsResetDone(false);
        window.location.reload();
      }, 1500);
    }
  };

  const seoPagesList: { id: keyof SeoSettingsConfig; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الصفحة الرئيسية (Home)', labelEn: 'Homepage' },
    { id: 'about', labelAr: 'عن الشركة (About)', labelEn: 'About Us' },
    { id: 'services', labelAr: 'الخدمات والأعمال (Services)', labelEn: 'Services' },
    { id: 'projects', labelAr: 'سجل المشاريع (Projects)', labelEn: 'Projects' },
    { id: 'equipment', labelAr: 'أسطول المعدات (Equipment)', labelEn: 'Equipment' },
    { id: 'certificates', labelAr: 'الشهادات والآيزو (Certificates)', labelEn: 'Certificates' },
    { id: 'team', labelAr: 'فريق العمل (Team)', labelEn: 'Team' },
    { id: 'news', labelAr: 'الأخبار والمستجدات (News)', labelEn: 'News & Insights' },
    { id: 'contact', labelAr: 'تواصل معنا (Contact)', labelEn: 'Contact Us' },
    { id: 'chairmanMessage', labelAr: 'رسالة رئيس المجلس (Chairman)', labelEn: "Chairman's Statement" },
  ];

  return (
    <div className="space-y-6 max-w-5xl text-start pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-sky-500" />
            <span>{isAr ? 'إعدادات النظام والهوية والـ SEO' : 'System Identity, SEO & Backup Settings'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'تعديل السجل التجاري، أرقام التواصل، ميتا محركات البحث (SEO)، والنسخ الاحتياطي'
              : 'Official IDs, direct contacts, search engine meta tags, and local backup'}
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'تم حفظ التعديلات بنجاح' : 'Settings saved successfully'}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#002060] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isAr ? '1. البيانات المؤسسية والتواصل' : '1. Corporate & Contact'}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#002060] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? '2. بروفايل الشركة والـ PDF' : '2. Profile & Dossier'}</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'seo'
              ? 'bg-[#002060] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isAr ? '3. محركات البحث وميتا الصفحات (SEO)' : '3. SEO & Meta Tags'}</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'backup'
              ? 'bg-[#002060] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{isAr ? '4. النسخ الاحتياطي والاستعادة' : '4. Backup & Recovery'}</span>
        </button>
      </div>

      {/* TAB 1: General Corporate Data */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-sky-500" />
              <span>{isAr ? 'البيانات التجارية والرسمية' : 'Commercial & Registration Data'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رقم السجل التجاري (CR)' : 'Commercial Registration (CR)'}
                </label>
                <input
                  type="text"
                  {...register('cr')}
                  placeholder="7023600179"
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الرقم الضريبي الموحد (VAT)' : 'VAT Identification Number'}
                </label>
                <input
                  type="text"
                  {...register('vat')}
                  placeholder="310989009900003"
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم الشركة بالعربية' : 'Company Name (Arabic)'}
                </label>
                <input
                  type="text"
                  {...register('nameAr')}
                  placeholder="شركة هضاب الخليج العربي للمقاولات"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم الشركة بالإنجليزية' : 'Company Name (English)'}
                </label>
                <input
                  type="text"
                  {...register('nameEn')}
                  placeholder="Arabian Gulf Hills Contracting Company"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'قنوات التواصل والمراسلات' : 'Contact Channels & Address'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رقم الهاتف المباشر' : 'Direct Phone'}
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="00966115126774"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="info@hedabkh.com.sa"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'العنوان الوطني والمقر الرئيسي' : 'Headquarters Address'}
              </label>
              <input
                type="text"
                {...register('addressAr')}
                placeholder="3140 الشيخ صالح بن غصون، الملز، REMA7501, 7501، الرياض 12832"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ البيانات المؤسسية' : 'Save Corporate Data'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Profile & Dossier */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'إدارة الملف التأهيلي وبروفايل الشركة (Corporate Profile & Dossier)' : 'Corporate Profile & Dossier Settings'}</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رابط ملف البروفايل المباشر (PDF File URL)' : 'Corporate Profile PDF URL'}
                </label>
                <input
                  type="text"
                  {...register('profilePdfUrl')}
                  placeholder="/gulf-hills-profile.pdf"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان/إصدار الملف التأهيلي (عربي)' : 'Release Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    {...register('profileReleaseYearAr')}
                    placeholder="إصدار الشركة لعام 2026م"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان/إصدار الملف التأهيلي (إنجليزي)' : 'Release Title (English)'}
                  </label>
                  <input
                    type="text"
                    {...register('profileReleaseYearEn')}
                    placeholder="Company Release 2026"
                    dir="ltr"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'صيغة إخلاء المسؤولية القانونية (عربي)' : 'Legal Disclaimer (Arabic)'}
                </label>
                <textarea
                  {...register('profileDisclaimerAr')}
                  rows={3}
                  placeholder="تنويه رسمي: هذا المستند عبارة عن ملخص استعراضي وتأهيلي مبدئي..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'صيغة إخلاء المسؤولية القانونية (إنجليزي)' : 'Legal Disclaimer (English)'}
                </label>
                <textarea
                  {...register('profileDisclaimerEn')}
                  rows={3}
                  placeholder="Official Notice: This document serves as an informational prequalification summary..."
                  dir="ltr"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ إعدادات البروفايل' : 'Save Profile Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SEO & Social Meta */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Page Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {isAr ? 'اختر الصفحة المراد تخصيص وسوم الميتا ومحركات البحث لها:' : 'Select page to configure SEO metadata:'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isAr ? 'يتم تطبيق هذه الإعدادات على محركات بحث Google والوسوم الاجتماعية OpenGraph.' : 'Applies to Google Search index & OpenGraph social shares.'}
              </span>
            </div>

            <select
              value={selectedSeoPage}
              onChange={(e) => setSelectedSeoPage(e.target.value as keyof SeoSettingsConfig)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 focus:outline-none cursor-pointer"
            >
              {seoPagesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {isAr ? p.labelAr : p.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* SEO Form */}
          <form onSubmit={handleSaveSeo} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" />
                <span>
                  {isAr ? `تخصيص SEO: ${seoPagesList.find((p) => p.id === selectedSeoPage)?.labelAr}` : `SEO Meta for: ${selectedSeoPage}`}
                </span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Active Page: {selectedSeoPage}
              </span>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'عنوان الصفحة لمحركات البحث (Meta Title بالعربية)' : 'Meta Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={seoPageData.titleAr || ''}
                  onChange={(e) => setSeoPageData({ ...seoPageData, titleAr: e.target.value })}
                  placeholder="شركة هضاب الخليج للمقاولات | ..."
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'عنوان الصفحة لمحركات البحث (Meta Title بالإنجليزية)' : 'Meta Title (English)'}
                </label>
                <input
                  type="text"
                  value={seoPageData.titleEn || ''}
                  onChange={(e) => setSeoPageData({ ...seoPageData, titleEn: e.target.value })}
                  placeholder="Gulf Hills Contracting | ..."
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'وصف الميتا لمحركات البحث (Meta Description بالعربية)' : 'Meta Description (Arabic)'}
                </label>
                <textarea
                  value={seoPageData.descriptionAr || ''}
                  onChange={(e) => setSeoPageData({ ...seoPageData, descriptionAr: e.target.value })}
                  rows={2}
                  placeholder="وصف مختصر وجذاب يظهر في نتائج بحث Google..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'وصف الميتا لمحركات البحث (Meta Description بالإنجليزية)' : 'Meta Description (English)'}
                </label>
                <textarea
                  value={seoPageData.descriptionEn || ''}
                  onChange={(e) => setSeoPageData({ ...seoPageData, descriptionEn: e.target.value })}
                  rows={2}
                  placeholder="Brief compelling description appearing in search results..."
                  dir="ltr"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  required
                />
              </div>
            </div>

            {/* Keywords & OG Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الكلمات المفتاحية (عربي - مفصولة بفاصلة)' : 'Keywords (Arabic - comma separated)'}
                </label>
                <input
                  type="text"
                  value={keywordsArInput}
                  onChange={(e) => setKeywordsArInput(e.target.value)}
                  placeholder="هضاب الخليج, مقاولات, سفلتة طرق, سيول"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الكلمات المفتاحية (إنجليزي - مفصولة بفاصلة)' : 'Keywords (English - comma separated)'}
                </label>
                <input
                  type="text"
                  value={keywordsEnInput}
                  onChange={(e) => setKeywordsEnInput(e.target.value)}
                  placeholder="Gulf Hills, contracting, road paving, drainage"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'رابط صورة المشاركة الاجتماعية (OpenGraph Image URL)' : 'Social Share Image (OG Image URL)'}
              </label>
              <input
                type="text"
                value={seoPageData.ogImage || ''}
                onChange={(e) => setSeoPageData({ ...seoPageData, ogImage: e.target.value })}
                placeholder="/images/projects/project-1.jpg"
                dir="ltr"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSeoSaving}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات الـ SEO لهذه الصفحة' : 'Save SEO Meta for this Page'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Backup & Recovery */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-500" />
              <span>{isAr ? 'النسخ الاحتياطي وإدارة البيانات المحلية (CMS Backup & Restore)' : 'Local CMS Backup & Restore'}</span>
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              JSON File Storage
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'نظراً لأن النظام يعمل محلياً في بيئة التطوير باستخدام localStorage، يمكنك تصدير كافة بيانات الموقع، المشاريع، التعديلات، والمقالات إلى ملف JSON واحد والاحتفاظ به أو استعادته في أي وقت بنقرة واحدة.'
              : 'Export complete site database (projects, services, fleet, articles, settings) into a single JSON file or restore from a backup file.'}
          </p>

          {importStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{importError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleExportBackup}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 flex flex-col items-center justify-center space-y-2 group transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {isAr ? 'تصدير نسخة احتياطية كاملة (JSON)' : 'Export Full Backup (JSON)'}
              </span>
              <span className="text-[10px] text-slate-400 text-center">
                {isAr ? 'تنزيل ملف يحتوي على كافة أقسام ومحتويات الموقع' : 'Download JSON snapshot of all database tables'}
              </span>
            </button>

            <label className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 flex flex-col items-center justify-center space-y-2 group transition-all cursor-pointer">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {isAr ? 'استيراد نسخة احتياطية (JSON)' : 'Import Backup File (JSON)'}
              </span>
              <span className="text-[10px] text-slate-400 text-center">
                {isAr ? 'استعادة كافة البيانات المحفوظة مسبقاً' : 'Restore site data from previous JSON file'}
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                {isAr ? 'إعادة تعيين البيانات للمصنع' : 'Reset All to Initial Factory Seed'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isAr ? 'إعادة تهيئة كافة الجداول والمشاريع إلى القيم الافتراضية الأولية' : 'Restores initial mock data across all modules'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة التعيين' : 'Reset Factory'}</span>
            </button>
          </div>

          {isResetDone && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'تمت استعادة البيانات الافتراضية بنجاح! جاري التحديث...' : 'Factory defaults restored! Reloading...'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
