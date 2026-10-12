"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Sparkles, ShieldCheck, CheckCheck } from 'lucide-react';
import { BRAND_IDENTITY } from '../../config/brand';

import { trackEvent } from '../../lib/analytics';

interface WhatsAppFloatingWidgetProps {
  locale?: 'ar' | 'en';
}

const PRESET_MESSAGES = [
  {
    id: 'asphalt',
    titleAr: 'طلب عرض سعر لأعمال سفلتة وطرق',
    titleEn: 'Request Quote for Road & Asphalting Works',
    msgAr: 'السلام عليكم، نود طلب عرض سعر ودراسة فنية لتنفيذ أعمال كشط وسفلتة لمشروع تابع لنا.',
    msgEn: 'Hello, we would like to request a quotation and technical proposal for asphalt milling and paving works.',
  },
  {
    id: 'stormwater',
    titleAr: 'استفسار عن شبكات تصريف مياه السيول',
    titleEn: 'Inquiry regarding Stormwater Drainage Networks',
    msgAr: 'السلام عليكم، نستفسر عن إمكانية تنفيذ وتمديد خطوط تصريف مياه الأمطار والسيول وتركيب المناهل.',
    msgEn: 'Hello, we are inquiring about pipeline execution for stormwater drainage and manhole installations.',
  },
  {
    id: 'newjersey',
    titleAr: 'توريد حواجز خرسانية (نيوجيرسي)',
    titleEn: 'Supply of New Jersey Concrete Barriers',
    msgAr: 'السلام عليكم، نود الاستفسار عن توريد حواجز خرسانية نيوجيرسي مسبقة الصب مطابقة لمواصفات وزارة النقل والأمانات.',
    msgEn: 'Hello, we would like to inquire about supplying precast New Jersey concrete road safety barriers.',
  },
  {
    id: 'prequalification',
    titleAr: 'طلب الملف التأهيلي والتصنيف الحكومي',
    titleEn: 'Request Prequalification Dossier & ISO Records',
    msgAr: 'السلام عليكم، نطلب تزويدنا بالملف التأهيلي وشهادات تصنيف المقاولين والآيزو لشركة هضاب الخليج.',
    msgEn: 'Hello, please provide us with the prequalification dossier, ISO certifications, and classification records.',
  },
];

export default function WhatsAppFloatingWidget({ locale = 'ar' }: WhatsAppFloatingWidgetProps) {
  const pathname = usePathname();
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [hasNewNotification, setHasNewNotification] = useState(true);

  const phoneClean = BRAND_IDENTITY.phone.replace(/[^0-9]/g, '').replace(/^0/, '966');

  const handleSendMessage = (text: string) => {
    trackEvent({
      category: 'conversion',
      action: 'whatsapp_click',
      label: text.slice(0, 30),
    });
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phoneClean}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewNotification(false);
  };

  if (pathname?.includes('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 flex flex-col items-end rtl:items-start select-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-fade-in transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002060] via-[#004080] to-[#0070BA] p-4.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-6 h-6 fill-emerald-400 text-transparent" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#002060]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <span>{isAr ? 'الإدارة الهندسية والمبيعات' : 'Engineering & Sales Support'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-[11px] text-sky-200/80">
                  {isAr ? 'متصل الآن - الرد خلال دقائق' : 'Online - Typically replies in minutes'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4.5 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
            {/* Welcome Bubble */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-start shadow-2xs space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                {isAr
                  ? 'مرحباً بك في هضاب الخليج للمقاولات 🇸🇦 كيف يمكننا مساندتك في مشروعك القادم؟'
                  : 'Welcome to Gulf Hills Contracting 🇸🇦 How can we support your upcoming project?'}
              </p>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                {isAr ? 'الآن' : 'Now'}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 text-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {isAr ? 'اختر نوع الطلب للرد السريع المباشر:' : 'Select inquiry type for instant chat:'}
              </span>

              <div className="space-y-1.5">
                {PRESET_MESSAGES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSendMessage(isAr ? preset.msgAr : preset.msgEn)}
                    className="w-full text-start p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span className="line-clamp-1">{isAr ? preset.titleAr : preset.titleEn}</span>
                    <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customMsg.trim()) {
                  handleSendMessage(customMsg.trim());
                }
              }}
              placeholder={isAr ? 'اكتب استفسارك هنا...' : 'Type your message...'}
              className="flex-1 h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={() => {
                if (customMsg.trim()) {
                  handleSendMessage(customMsg.trim());
                }
              }}
              className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        aria-label="WhatsApp Support"
        className={`group relative flex items-center gap-2.5 px-4.5 py-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
          isOpen
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-500/20'
        }`}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          {hasNewNotification && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
          )}
        </div>

        <span className="text-xs font-black tracking-wide hidden sm:inline-block">
          {isOpen ? (isAr ? 'إغلاق المحادثة' : 'Close Chat') : (isAr ? 'تواصل فوري (واتساب)' : 'Chat on WhatsApp')}
        </span>
      </button>
    </div>
  );
}
