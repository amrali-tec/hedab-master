import { useParams } from 'react-router-dom';
"use client";

import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, 
  Sparkles, Building2, ShieldCheck, ArrowUpRight, MessageSquare, AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { publicApi } from '../../../services/publicApi';
import QuickQuoteModal from '../../../components/ui/QuickQuoteModal';

export default function ContactPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMessage(isAr ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، الجوال، والرسالة).' : 'Please fill all required fields (Name, Phone, Message).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await publicApi.submitInquiry({
        name: formData.name,
        email: formData.email || 'info@hedabkh.com.sa',
        phone: formData.phone,
        message: `[${formData.subject || (isAr ? 'استفسار عام' : 'General Inquiry')}] ${formData.message}`,
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || (isAr ? 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: MapPin,
      titleAr: 'المقر الرئيسي للشركة',
      titleEn: 'Corporate Headquarters',
      detailAr: 'المملكة العربية السعودية — الرياض — حي الملز — شارع الظهران',
      detailEn: 'Riyadh, Al Malaz District, Dhahran St., Kingdom of Saudi Arabia',
      color: 'text-sky-600 dark:text-sky-400',
      bgGlow: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      badgeAr: 'سجل تجاري: 1010720712',
      badgeEn: 'CR: 1010720712',
    },
    {
      icon: Phone,
      titleAr: 'أرقام الاتصال والتواصل المباشر',
      titleEn: 'Direct Phone & Communications',
      detailAr: 'الهاتف الموحد: 011 472 0000 | الجوال الميداني: 050 720 7120',
      detailEn: 'Unified Tel: +966 11 472 0000 | Site Mobile: +966 50 720 7120',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      badgeAr: 'استجابة سريعة',
      badgeEn: 'Quick Response',
    },
    {
      icon: Mail,
      titleAr: 'البريد الإلكتروني والمناقصات',
      titleEn: 'Official Email & Tenders',
      detailAr: 'العام: info@hedabkh.com.sa | المناقصات: tenders@hedabkh.com.sa',
      detailEn: 'General: info@hedabkh.com.sa | RFQ: tenders@hedabkh.com.sa',
      color: 'text-amber-600 dark:text-amber-400',
      bgGlow: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      badgeAr: 'عروض أسعار رسمية',
      badgeEn: 'Official RFQs',
    },
    {
      icon: Clock,
      titleAr: 'ساعات العمل الرسمية',
      titleEn: 'Official Business Hours',
      detailAr: 'الأحد – الخميس: 8:00 صباحاً حتى 5:00 مساءً (الجمعة والسبت عطلة)',
      detailEn: 'Sunday – Thursday: 8:00 AM to 5:00 PM (Fri & Sat: Weekend)',
      color: 'text-purple-600 dark:text-purple-400',
      bgGlow: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      badgeAr: 'طوارئ 24/7 للمشاريع',
      badgeEn: '24/7 Site Support',
    },
  ];

  return (
    <div className="min-h-[90vh] bg-transparent text-text-main transition-colors duration-300 relative space-y-12 pb-20">
      
      {/* 1. Page Header */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 sm:pt-10">
        <PageHeader
          title={isAr ? 'تواصل معنا واطلب استشارة هندسية فورية' : 'Contact Us & Request Technical Consultation'}
          subtitle={isAr
            ? 'فريقنا الهندسي والإداري جاهز للرد على استفساراتكم، دراسة الجداول والكميات، وتقديم عروض أسعار تفصيلية لمشاريع البنية التحتية.'
            : 'Get in touch directly with Arabian Gulf Hills Contracting executive and project engineering divisions.'}
          currentPageLabel={isAr ? 'تواصل معنا' : 'Contact Us'}
          locale={locale}
        />
      </div>

      {/* 2. Direct Contact Info Cards Grid */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border ${card.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 text-start group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${card.bgGlow} border ${card.borderColor} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform shadow-xs`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                      {isAr ? card.badgeAr : card.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {isAr ? card.titleAr : card.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {isAr ? card.detailAr : card.detailEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  <span>{isAr ? 'خدمة معتمدة' : 'Verified Service'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split Section: Official Contact Form + RFQ Highlight Box */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-start">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-[#0070BA] dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isAr ? 'نموذج المراسلة المباشرة' : 'Direct Message Form'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? 'أرسل استفسارك أو طلبك للإدارة' : 'Send an Official Inquiry'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'سيتم توجيه رسالتك مباشرة للإدارة المختصة والرد خلال 24 ساعة عمل.'
                  : 'Your request will be routed directly to our executive engineering office.'}
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-emerald-800 dark:text-emerald-200">
                  {isAr ? 'تم استلام طلبكم بنجاح!' : 'Inquiry Received Successfully!'}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'شكراً لتواصلكم مع شركة هضاب الخليج للمقاولات. سيقوم أحد مهندسينا بالتواصل معكم في أقرب وقت.'
                    : 'Thank you for contacting Arabian Gulf Hills Contracting. Our team will get back to you shortly.'}
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-start">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'الاسم الكامل أو اسم الجهة' : 'Full Name or Company'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'م. عبدالله القحطاني / شركة...' : 'Eng. Abdullah...'}
                      required
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>

                  <div className="space-y-1 text-start">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'رقم الجوال للتواصل' : 'Mobile / Phone'} *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05xxxxxxxx"
                      required
                      dir="ltr"
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-start">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com.sa"
                      dir="ltr"
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>

                  <div className="space-y-1 text-start">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'الموضوع / مجال المشروع' : 'Subject / Project Sector'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
                    >
                      <option value="">{isAr ? 'اختر مجال الخدمة...' : 'Select Service Category...'}</option>
                      <option value="كشط وسفلتة طرق">{isAr ? 'أعمال كشط وسفلتة الطرق' : 'Road Asphalt & Paving'}</option>
                      <option value="تصريف مياه الأمطار والسيول">{isAr ? 'شبكات درء أخطار السيول' : 'Stormwater Drainage'}</option>
                      <option value="حواجز نيوجيرسي خرسانية">{isAr ? 'حواجز نيوجيرسي خرسانية' : 'New Jersey Concrete Barriers'}</option>
                      <option value="تشغيل وصيانة مقابر">{isAr ? 'عقود تشغيل وصيانة مرافق' : 'O&M Facilities Management'}</option>
                      <option value="استئجار أسطول وآليات">{isAr ? 'استئجار أسطول ومعدات ثقيلة' : 'Heavy Equipment Rental'}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'تفاصيل الرسالة أو نطاق المشروع' : 'Message Details or Project Scope'} *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'يرجى كتابة تفاصيل المشروع، الموقع الجغرافي، والكميات المتوقعة...' : 'Write project specifications, site location, and requirements...'}
                    required
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0070BA] to-[#002060] dark:from-sky-500 dark:to-[#002060] text-white font-black text-xs sm:text-sm hover:shadow-xl hover:shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (isAr ? 'جاري الإرسال...' : 'Submitting...')
                      : (isAr ? 'إرسال الرسالة للإدارة الهندسية' : 'Submit Official Message')}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: RFQ Pop-up Banner + Location Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pop-up RFQ Banner Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-100/90 via-white to-slate-100/90 dark:from-[#002060] dark:via-[#003080] dark:to-[#0070BA] text-slate-900 dark:text-white space-y-5 shadow-lg dark:shadow-xl border border-slate-200/90 dark:border-sky-400/30 text-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-white/10 backdrop-blur-md text-amber-600 dark:text-amber-300 text-xs font-bold border border-amber-500/20 dark:border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                <span>{isAr ? 'نموذج طلب عرض السعر التفاعلي' : 'Interactive RFQ Engine'}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {isAr ? 'هل تحتاج إلى عرض سعر دقيق وفوري؟' : 'Need an Immediate Itemized RFQ?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-sky-100 leading-relaxed font-medium">
                  {isAr
                    ? 'استخدم نموذج طلب عروض الأسعار التفاعلي المكون من 4 خطوات لاختيار الخدمة وتحديد مساحة وكميات المشروع والحصول على دراسة فنية سريعة.'
                    : 'Use our 4-step interactive RFQ modal to configure your project scope and request immediate pricing.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{isAr ? 'فتح نموذج طلب عرض السعر (Pop-up)' : 'Open Interactive RFQ Modal'}</span>
              </button>
            </div>

            {/* Corporate Location Embed Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-start">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                  <Building2 className="w-4 h-4 text-[#0070BA] dark:text-sky-400" />
                  <span>{isAr ? 'خريطة الموقع — مدينة الرياض' : 'Location Map — Riyadh'}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {isAr ? 'مقر معتمد' : 'Verified'}
                </span>
              </div>

              {/* Embedded Map Frame */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <iframe
                  title="Company Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115967.66986423018!2d46.738586!3d24.68773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x6a084c85be8dbab8!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>{isAr ? 'الرياض — حي الملز' : 'Al Malaz, Riyadh'}</span>
                <a
                  href="https://maps.google.com/?q=24.68773,46.738586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0070BA] dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>{isAr ? 'فتح في خرائط Google' : 'Google Maps'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={locale}
      />
    </div>
  );
}
