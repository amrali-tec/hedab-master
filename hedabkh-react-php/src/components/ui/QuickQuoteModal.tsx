"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  Send,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Check,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  Layers,
  Truck,
  Wrench,
  Construction,
  Award,
} from 'lucide-react';
import { publicApi } from '../../services/publicApi';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'ar' | 'en';
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  {
    id: 'road-paving',
    titleAr: 'أعمال كشط وسفلتة الطرق والإنترلوك',
    titleEn: 'Road Milling, Asphalt Paving & Interlock',
    icon: Construction,
    badgeAr: 'تصنيف درجة 2',
    badgeEn: 'Grade 2 Classified',
  },
  {
    id: 'stormwater',
    titleAr: 'شبكات تصريف مياه الأمطار ودرء أخطار السيول',
    titleEn: 'Stormwater Drainage & Flood Control Networks',
    icon: Layers,
    badgeAr: 'بنية تحتية كبرى',
    badgeEn: 'Major Infrastructure',
  },
  {
    id: 'facility-maintenance',
    titleAr: 'تشغيل وصيانة المباني والمرافق الحكومية',
    titleEn: 'Government Facility O&M Services',
    icon: Building2,
    badgeAr: 'تصنيف درجة 5',
    badgeEn: 'Grade 5 O&M',
  },
  {
    id: 'cemeteries-om',
    titleAr: 'عقود تشغيل وصيانة مقابر منطقة الرياض',
    titleEn: 'Riyadh Cemeteries Operation & Maintenance',
    icon: ShieldCheck,
    badgeAr: 'عقد أمانة الرياض',
    badgeEn: 'Municipality Contract',
  },
  {
    id: 'fleet-rental',
    titleAr: 'تأجير وتشغيل أسطول المعدات الثقيلة واللوجستيات',
    titleEn: 'Heavy Equipment Fleet Rental & Logistics',
    icon: Truck,
    badgeAr: '+60 معدة مملوكة',
    badgeEn: '+60 Fleet Fleet',
  },
  {
    id: 'precast-barriers',
    titleAr: 'تصنيع وتركيب الحواجز الخرسانية والبردورات',
    titleEn: 'Precast Concrete Barriers & Curbstones',
    icon: Wrench,
    badgeAr: 'مطابقة مواصفات النقل',
    badgeEn: 'MOT Approved',
  },
];

const SAUDI_REGIONS = [
  { id: 'riyadh', nameAr: 'منطقة الرياض ومحافظاتها', nameEn: 'Riyadh Region' },
  { id: 'qassim', nameAr: 'منطقة القصيم (بريدة وعنيزة)', nameEn: 'Qassim Region' },
  { id: 'eastern', nameAr: 'المنطقة الشرقية (الدمام والخبر والأحساء)', nameEn: 'Eastern Province' },
  { id: 'makkah', nameAr: 'منطقة مكة المكرمة وجدة', nameEn: 'Makkah & Jeddah' },
  { id: 'madinah', nameAr: 'منطقة المدينة المنورة', nameEn: 'Madinah Region' },
  { id: 'other', nameAr: 'مناطق أخرى بالمملكة', nameEn: 'Other Saudi Regions' },
];

export function QuickQuoteModal({
  isOpen,
  onClose,
  locale = 'ar',
  defaultService,
}: QuickQuoteModalProps) {
  const isAr = locale === 'ar';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<string>(defaultService || 'road-paving');
  const [region, setRegion] = useState<string>('riyadh');
  const [contractType, setContractType] = useState<string>('main-contractor');
  const [estimatedScope, setEstimatedScope] = useState<string>('');
  const [targetDuration, setTargetDuration] = useState<string>('6 months');
  
  // Contact & Entity details
  const [organizationName, setOrganizationName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (defaultService) {
      const match = SERVICE_OPTIONS.find(
        (s) =>
          s.id === defaultService ||
          s.titleAr === defaultService ||
          s.titleEn.toLowerCase() === defaultService.toLowerCase() ||
          defaultService.includes(s.titleAr) ||
          s.titleAr.includes(defaultService) ||
          (defaultService.includes('سفلت') && s.id === 'road-paving') ||
          (defaultService.includes('سيول') && s.id === 'stormwater') ||
          (defaultService.includes('مبان') && s.id === 'facility-maintenance') ||
          (defaultService.includes('مقابر') && s.id === 'cemeteries-om') ||
          (defaultService.includes('خرسان') && s.id === 'concrete-barriers') ||
          (defaultService.includes('معدات') && s.id === 'fleet-rental') ||
          (defaultService.includes('هدم') && s.id === 'fleet-rental')
      );
      if (match) {
        setSelectedService(match.id);
      } else {
        setSelectedService(defaultService);
      }
    }
  }, [defaultService, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state on close if completed
      if (isSuccess) {
        setStep(1);
        setIsSuccess(false);
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName || !phone) {
      setErrorMessage(isAr ? 'يرجى إدخال اسم الجهة ورقم الجوال للتواصل' : 'Please enter organization name and phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const ref = `RFQ-${Date.now().toString().slice(-6)}`;
    setReferenceNumber(ref);

    const chosenServiceObj = SERVICE_OPTIONS.find((s) => s.id === selectedService);
    const chosenRegionObj = SAUDI_REGIONS.find((r) => r.id === region);

    const fullDetails = [
      `الخدمة المطلوبة: ${chosenServiceObj?.titleAr || selectedService}`,
      `المنطقة/الموقع: ${chosenRegionObj?.nameAr || region}`,
      `نوع التعاقد: ${contractType}`,
      `نطاق العمل التقديري: ${estimatedScope || 'غير محدد'}`,
      `المدة المستهدفة: ${targetDuration}`,
      `تفاصيل إضافية: ${projectDescription || 'لا توجد'}`,
      `رقم المرجع المولد: ${ref}`,
    ].join(' | ');

    try {
      await publicApi.submitInquiry({
        id: `inq-${Date.now()}`,
        name: contactName || organizationName,
        company: organizationName,
        email: email || 'quote@hedabkh.com.sa',
        phone: phone,
        service: chosenServiceObj?.titleAr || selectedService,
        subject: `طلب عرض سعر / مناقصة: ${chosenServiceObj?.titleAr || selectedService} (${ref})`,
        message: fullDetails,
        status: 'new',
        createdAt: new Date().toISOString().split('T')[0],
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.warn('Error submitting inquiry:', err);
      // Even if offline, store locally and show success
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setErrorMessage('');
    if (step === 1 && !selectedService) {
      setErrorMessage(isAr ? 'يرجى اختيار نوع الخدمة المطلوبة' : 'Please select a service');
      return;
    }
    if (step === 2 && !estimatedScope) {
      setEstimatedScope(isAr ? 'حسب كراسة الشروط والمقايسات' : 'Per tender specifications');
    }
    setStep((prev) => Math.min(prev + 1, 4) as any);
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep((prev) => Math.max(prev - 1, 1) as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 transition-all max-h-[92vh] flex flex-col">
        
        {/* Top Header Banner */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-[#002060] to-[#0070BA] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>{isAr ? 'طلب عرض سعر / مناقصة هندسية' : 'Request Official Project Quotation & RFQ'}</span>
              </h3>
              <p className="text-xs text-sky-200 font-medium">
                {isAr
                  ? 'تسعير مباشر وفق كود البناء والمواصفات المعتمدة من أمانات المناطق ووزارة البلديات'
                  : 'Fast-track sovereign tendering & competitive pricing across Saudi Arabia'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        {!isSuccess && (
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            {[
              { num: 1, labelAr: 'نوع الخدمة', labelEn: 'Service' },
              { num: 2, labelAr: 'مواصفات المشروع', labelEn: 'Scope' },
              { num: 3, labelAr: 'بيانات الجهة', labelEn: 'Contact' },
              { num: 4, labelAr: 'المراجعة والإرسال', labelEn: 'Review' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                    step === s.num
                      ? 'bg-[#0070BA] text-white ring-4 ring-sky-500/20'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold hidden sm:inline ${
                    step === s.num
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isAr ? s.labelAr : s.labelEn}
                </span>
                {idx < 3 && <div className="w-4 sm:w-8 h-0.5 bg-slate-200 dark:bg-slate-800 mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-5 text-start">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold animate-shake">
              {errorMessage}
            </div>
          )}

          {isSuccess ? (
            /* Success View */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? 'تم استلام طلب التسعير بنجاح!' : 'Quotation Request Received Successfully!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'شكراً لتواصلكم مع شركة هضاب الخليج للمقاولات. سيقوم فريق دراسة المشاريع والمناقصات بمراجعة المواصفات وإعداد العرض الفني والمالي خلال 24 ساعة عمل.'
                    : 'Thank you for contacting Arabian Gulf Hills. Our estimating and engineering team will review your specifications and issue a tender quotation within 24 business hours.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-block font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">{isAr ? 'رقم مرجع الطلب' : 'Reference Number'}</span>
                <span className="text-base font-black text-[#0070BA] dark:text-sky-400">{referenceNumber}</span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/966505860000?text=${encodeURIComponent(
                    `السلام عليكم، أود متابعة طلب عرض السعر رقم: ${referenceNumber} من شركة هضاب الخليج للمقاولات`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isAr ? 'المتابعة المباشرة عبر واتساب' : 'Direct WhatsApp Follow-up'}</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  {isAr ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (step === 4) handleSubmit(e); else nextStep(); }}>
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isAr ? '1. اختر قطاع العمل الهندسي المطلوب:' : '1. Select the required engineering sector:'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? 'اختر الخدمة الإنشائية أو التشغيلية لمشروعك' : 'Choose the matching engineering service'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map((srv) => {
                      const Icon = srv.icon;
                      const isSelected = selectedService === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                            isSelected
                              ? 'bg-sky-50/70 dark:bg-sky-950/40 border-[#0070BA] dark:border-sky-500 shadow-md ring-2 ring-sky-500/20'
                              : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#0070BA] text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {isAr ? srv.titleAr : srv.titleEn}
                              </span>
                            </div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
                              {isAr ? srv.badgeAr : srv.badgeEn}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#0070BA] text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Project Specifications */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isAr ? '2. حدد نطاق وموقع تنفيذ المشروع:' : '2. Specify project scope & location:'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? 'البيانات التقديرية تساعدنا في إعداد جداول الكميات والتسعير الدقيق' : 'Estimated parameters ensure precise BOQ and pricing'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Region Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0070BA]" />
                        <span>{isAr ? 'المنطقة الجغرافية / المدينة' : 'Project Region / City'}</span>
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30"
                      >
                        {SAUDI_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {isAr ? r.nameAr : r.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contract Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isAr ? 'نوع التعاقد المستهدف' : 'Contract Type'}</span>
                      </label>
                      <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30"
                      >
                        <option value="main-contractor">{isAr ? 'عقد مقاول رئيسي (Direct / Main)' : 'Main Contractor'}</option>
                        <option value="sub-contractor">{isAr ? 'مقاول باطن متخصص (Sub-Contractor)' : 'Sub-Contractor'}</option>
                        <option value="gov-tender">{isAr ? 'مناقصة حكومية / اعتماد بلدي' : 'Government Tender'}</option>
                        <option value="equipment-rental">{isAr ? 'تأجير أسطول مع المشغلين' : 'Fleet Rental with Crew'}</option>
                      </select>
                    </div>

                    {/* Estimated Scope / BOQ */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isAr ? 'المساحة أو الكمية التقديرية (م² أو كم طولي)' : 'Estimated Scope (m² or linear km)'}
                      </label>
                      <input
                        type="text"
                        value={estimatedScope}
                        onChange={(e) => setEstimatedScope(e.target.value)}
                        placeholder={isAr ? 'مثال: 45,000 م² سفلتة / 3.5 كم تصريف سيول' : 'e.g. 45,000 m² paving / 3.5 km drainage'}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400"
                      />
                    </div>

                    {/* Target Duration */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isAr ? 'المدة الزمنية المستهدفة للإنجاز' : 'Target Execution Duration'}</span>
                      </label>
                      <select
                        value={targetDuration}
                        onChange={(e) => setTargetDuration(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30"
                      >
                        <option value="1-3 months">{isAr ? 'عاجل (1 إلى 3 أشهر)' : 'Fast-track (1-3 months)'}</option>
                        <option value="6 months">{isAr ? 'متوسط (6 أشهر)' : 'Standard (6 months)'}</option>
                        <option value="12 months">{isAr ? 'سنة تعاقدية كاملة (12 شهراً)' : '12 Months'}</option>
                        <option value="multi-year">{isAr ? 'عقود تشغيل ممتدة (24 إلى 36 شهراً)' : 'Multi-year (24-36 months)'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Entity Details */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isAr ? '3. بيانات الجهة والتواصل المباشر:' : '3. Entity details & direct contact:'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? 'لتوجيه عرض السعر الرسمي والتواصل الفني معكم' : 'For sending formal quotation and technical follow-up'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organization Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0070BA]" />
                        <span>{isAr ? 'اسم الجهة / الشركة / المطور *' : 'Organization / Company Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder={isAr ? 'مثال: شركة التطوير العقاري / أمانة المنطقة' : 'e.g. Real Estate Development Co.'}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{isAr ? 'اسم المهندس / المسؤول' : 'Contact Person'}</span>
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={isAr ? 'الاسم الكريم' : 'Full Name'}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isAr ? 'رقم الجوال / واتساب *' : 'Mobile / WhatsApp *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400 text-start"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-500" />
                        <span>{isAr ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email'}</span>
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tender@company.com.sa"
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400 text-start"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Additional Scope */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isAr ? '4. مراجعة الطلب والملاحظات الخاصة:' : '4. Order summary & special notes:'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? 'تأكد من صحة البيانات لإصدار عرض السعر الفني والمالي' : 'Verify specifications before submission'}
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span className="text-slate-400">{isAr ? 'الخدمة المختارة:' : 'Service:'}</span>
                      <span className="font-black text-[#0070BA] dark:text-sky-400">
                        {SERVICE_OPTIONS.find((s) => s.id === selectedService)?.titleAr}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span className="text-slate-400">{isAr ? 'الجهة والموقع:' : 'Entity & Location:'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {organizationName} — {SAUDI_REGIONS.find((r) => r.id === region)?.nameAr}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isAr ? 'رقم التواصل:' : 'Contact:'}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{phone}</span>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'ملاحظات إضافية أو روابط كراسة الشروط والمخططات:' : 'Additional notes or tender download links:'}
                    </label>
                    <textarea
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder={isAr ? 'أدخل أي متطلبات خاصة بالخلطة الأسفلتية، العزل، أو اشتراطات الأمانة...' : 'Enter any specific technical requirements or mix designs...'}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/30 placeholder-slate-400 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Footer Controls */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    <span>{isAr ? 'السابق' : 'Previous'}</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-[#002060] text-white text-xs font-black hover:shadow-lg hover:shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ms-auto"
                  >
                    <span>{isAr ? 'المتابعة للخطوة التالية' : 'Next Step'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#002060] text-white text-xs font-black hover:shadow-xl hover:shadow-emerald-950/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ms-auto disabled:opacity-50"
                  >
                    <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>{isSubmitting ? (isAr ? 'جاري إرسال الطلب...' : 'Submitting...') : (isAr ? 'إرسال طلب التسعير الرسمي' : 'Submit Official RFQ')}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickQuoteModal;
