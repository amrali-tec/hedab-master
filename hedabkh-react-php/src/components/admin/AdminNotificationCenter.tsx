"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle,
  Mail,
  Clock,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { storageAdapter } from '../../services/storageAdapter';
import { Inquiry } from '../../types';

interface AdminNotificationCenterProps {
  locale: 'ar' | 'en';
}

export default function AdminNotificationCenter({ locale }: AdminNotificationCenterProps) {
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadInquiries = () => {
    const list = storageAdapter.getInquiries();
    setInquiries(list);
  };

  useEffect(() => {
    loadInquiries();
    const interval = setInterval(loadInquiries, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadInquiries = inquiries.filter((inq) => inq.status === 'new' || inq.status === 'in-progress');
  const unreadCount = unreadInquiries.length;

  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (err) {
      // AudioContext suppressed or unavailable
    }
  };

  const handleMarkAllRead = () => {
    inquiries.forEach((inq) => {
      if (inq.status === 'new') {
        storageAdapter.updateInquiryStatus(inq.id, 'in-progress');
      }
    });
    loadInquiries();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            playChime();
          }
        }}
        className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
        title={isAr ? 'مركز الإشعارات والتنبيهات' : 'Notifications'}
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-amber-500 animate-bounce' : ''}`} />
        <span className="hidden md:inline">{isAr ? 'الإشعارات' : 'Alerts'}</span>

        {unreadCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center -top-1 -right-1 shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-12 left-0 rtl:left-auto rtl:right-0 w-[320px] sm:w-[380px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-50 animate-scale-up text-start">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isAr ? 'مركز التنبيهات والطلبات' : 'Inquiry Notifications'}</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-mono font-bold">
                    {unreadCount} {isAr ? 'جديد' : 'New'}
                  </span>
                )}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={soundEnabled ? 'كتم صوت التنبيه' : 'تفعيل صوت التنبيه'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  {isAr ? 'تعيين كمقروء' : 'Mark Read'}
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="p-2 max-h-[320px] overflow-y-auto space-y-1.5 scrollbar-thin">
            {unreadInquiries.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Inbox className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'لا توجد طلبات جديدة حالياً' : 'No new notifications'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isAr ? 'جميع استفسارات وعروض الأسعار تم التعامل معها' : 'All customer inquiries have been processed'}
                </p>
              </div>
            ) : (
              unreadInquiries.slice(0, 6).map((inq) => (
                <Link
                  key={inq.id}
                  href={`/${locale}/admin/inquiries`}
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-sky-50/60 dark:hover:bg-sky-950/40 border border-slate-100 dark:border-slate-800 transition-all flex items-start gap-3 group block"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {inq.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {inq.createdAt || 'الآن'}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 truncate">
                      {isAr ? 'طلب عرض سعر / استفسار' : 'Quotation Inquiry'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {inq.message}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-center">
            <Link
              href={`/${locale}/admin/inquiries`}
              onClick={() => setIsOpen(false)}
              className="text-xs font-black text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-center gap-1.5"
            >
              <span>{isAr ? 'عرض كافة الطلبات والرسائل' : 'View all inquiries'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
