"use client";

import React, { useState, useEffect } from 'react';
import { Cookie, Zap, Check, X, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isAr = !location.pathname.startsWith('/en');

  useEffect(() => {
    try {
      const consent = localStorage.getItem('hedabkh_cookie_consent');
      const hasCookie = document.cookie.includes('hedabkh_cookie_consent=1');
      if (!consent && !hasCookie) {
        // Show after a brief delay for optimal UX
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('hedabkh_cookie_consent', 'accepted');
      document.cookie = 'hedabkh_cookie_consent=1; path=/; max-age=31536000; SameSite=Lax';
    } catch {}
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('hedabkh_cookie_consent', 'dismissed');
      document.cookie = 'hedabkh_cookie_consent=1; path=/; max-age=604800; SameSite=Lax';
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Cache Policy Notice"
      className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:end-6 sm:max-w-md z-50 animate-fade-in-up"
    >
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 dark:bg-[#070B14]/95 text-white border border-sky-500/30 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
        {/* Header Icons & Title */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{isAr ? 'سياسة ملفات الارتباط والتحديث الحي' : 'Cookies & Real-Time Sync Policy'}</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {isAr ? 'بيانات حية' : 'Live'}
                </span>
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Description */}
        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-medium">
          {isAr
            ? 'نسمح بحفظ ملفات تعريف الارتباط (Cookies) لحفظ تفضيلاتك وجلستك بأمان، مع تعطيل التخزين المؤقت للمتصفح (Browser Cache Disabled) لضمان تحميل أحدث المشاريع والمستندات وعروض الأسعار مباشرة.'
            : 'We enable essential Cookies to securely preserve your session and preferences, while disabling browser cache to guarantee you always load the latest live projects, documents, and tenders.'}
        </p>

        {/* Badges Matrix */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Cookies: {isAr ? 'مسموح حفظها' : 'Enabled'}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-1.5 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Cache: {isAr ? 'معطل / تحديث حي' : 'Disabled (Live)'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-[#002060] text-white text-xs font-black hover:shadow-lg hover:shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isAr ? 'موافق ومتابعة' : 'Accept & Proceed'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            <span>{isAr ? 'إغلاق' : 'Dismiss'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
