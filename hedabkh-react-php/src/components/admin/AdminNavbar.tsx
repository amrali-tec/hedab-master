"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Bell,
  RefreshCw,
  Search,
  CheckCircle,
} from 'lucide-react';
import AdminNotificationCenter from './AdminNotificationCenter';
import { useAdminAuth } from '../../context/useAdminAuth';

interface AdminNavbarProps {
  locale: 'ar' | 'en';
  onMobileMenuToggle: () => void;
}

export default function AdminNavbar({
  locale,
  onMobileMenuToggle,
}: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAr = locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = (newLocale: 'ar' | 'en') => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 400);
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left / Right Start: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isAr ? 'لوحة تحكم هضاب الخليج' : 'Gulf Hills Control Panel'}</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isAr ? 'متصل ومباشر' : 'Live Sync'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {isAr
              ? 'إدارة محتوى الموقع، المشاريع، الاعتمادات، وصندوق الطلبات'
              : 'Content management, engineering tenders, accreditations & leads'}
          </p>
        </div>
      </div>

      {/* Right / Left End: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Real-time Notification Center */}
        <AdminNotificationCenter locale={locale} />

        {/* Refresh Data */}
        <button
          onClick={handleRefresh}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer`}
          title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          <span className="hidden md:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
        </button>

        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">{isAr ? 'الوضع الفاتح' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden lg:inline">{isAr ? 'الوضع الداكن' : 'Dark'}</span>
              </>
            )}
          </button>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => switchLocale(isAr ? 'en' : 'ar')}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-black text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>{isAr ? 'English' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
}
