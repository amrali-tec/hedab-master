"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Wrench,
  Inbox,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Layers,
  Truck,
  Sparkles,
  Handshake,
  Image as ImageIcon,
  Newspaper,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/useAdminAuth';
import { storageAdapter } from '../../services/storageAdapter';

interface AdminSidebarProps {
  locale: 'ar' | 'en';
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  locale,
  isCollapsed,
  setIsCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [inquiryCount, setInquiryCount] = useState(0);

  const isAr = locale === 'ar';

  useEffect(() => {
    const updateCount = () => {
      const inquiries = storageAdapter.getInquiries();
      const newCount = inquiries.filter((i) => i.status === 'new').length;
      setInquiryCount(newCount);
    };

    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: isAr ? 'لوحة التحكم الرئيسية' : 'Dashboard Overview',
      path: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: isAr ? 'استوديو بناء الصفحات والكتل' : 'Visual Page Builder',
      path: `/${locale}/admin/visual-builder`,
      icon: Layers,
      badge: isAr ? 'CMS' : 'CMS',
      badgeColor: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
    },
    {
      label: isAr ? 'مكتبة الوسائط المركزية' : 'Media Library',
      path: `/${locale}/admin/media`,
      icon: ImageIcon,
    },
    {
      label: isAr ? 'المشاريع الهندسية' : 'Projects',
      path: `/${locale}/admin/projects`,
      icon: FolderKanban,
    },
    {
      label: isAr ? 'الأخبار والمقالات' : 'News & Articles',
      path: `/${locale}/admin/articles`,
      icon: Newspaper,
    },
    {
      label: isAr ? 'الخدمات والأعمال' : 'Services',
      path: `/${locale}/admin/services`,
      icon: Wrench,
    },
    {
      label: isAr ? 'أسطول الآليات والمعدات' : 'Equipment Fleet',
      path: `/${locale}/admin/equipment`,
      icon: Truck,
    },
    {
      label: isAr ? 'فريق العمل والقيادة' : 'Team Members',
      path: `/${locale}/admin/team`,
      icon: Users,
    },
    {
      label: isAr ? 'الشهادات والاعتمادات' : 'Certificates',
      path: `/${locale}/admin/certificates`,
      icon: Award,
    },
    {
      label: isAr ? 'الشركاء والعملاء' : 'Partners',
      path: `/${locale}/admin/partners`,
      icon: Handshake,
    },
    {
      label: isAr ? 'مؤشرات الإنجاز (KPIs)' : 'Statistics & KPIs',
      path: `/${locale}/admin/statistics`,
      icon: TrendingUp,
    },
    {
      label: isAr ? 'صندوق الاستفسارات' : 'Inquiries Box',
      path: `/${locale}/admin/inquiries`,
      icon: Inbox,
      badge: inquiryCount > 0 ? inquiryCount : undefined,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      label: isAr ? 'المستخدمين والصلاحيات' : 'Users & Permissions',
      path: `/${locale}/admin/users`,
      icon: ShieldCheck,
    },
    {
      label: isAr ? 'إعدادات النظام والنسخ' : 'Settings & Backup',
      path: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 z-40 flex flex-col bg-slate-900/95 dark:bg-[#060c18]/95 backdrop-blur-xl border-slate-800 text-slate-100 transition-all duration-300 ${
        isAr ? 'right-0 border-l' : 'left-0 border-r'
      } ${isCollapsed ? 'w-16' : 'w-64 lg:w-72'}`}
    >
      {/* Brand Header (56px) */}
      <div
        className={`flex items-center justify-between border-b border-slate-800/80 shrink-0 h-14 ${
          isCollapsed ? 'px-2 justify-center' : 'px-4'
        }`}
      >
        <Link
          href={`/${locale}/admin`}
          className="flex items-center gap-2.5 overflow-hidden group"
          title={isAr ? 'هضاب الخليج — بوابة الإدارة الموحدة' : 'Gulf Hills — Admin Portal'}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002060] via-[#0070BA] to-[#00B0F0] p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-white tracking-wide truncate">
                {isAr ? 'هضاب الخليج' : 'Gulf Hills'}
              </span>
              <span className="text-[9px] text-sky-400 font-semibold tracking-wider uppercase truncate">
                {isAr ? 'بوابة الإدارة الموحدة' : 'Admin Portal'}
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors md:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Toggle Expand / Collapse Button (Desktop Only) */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors hidden md:block cursor-pointer ${
            isCollapsed ? 'mt-1' : ''
          }`}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={isCollapsed ? (isAr ? 'توسيع القائمة الجانبية' : 'Expand Sidebar') : (isAr ? 'طي القائمة الجانبية' : 'Collapse Sidebar')}
        >
          {isAr ? (
            isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className={`flex-1 overflow-y-auto py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 ${isCollapsed ? 'px-1.5' : 'px-3'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.path
            : pathname === item.path || (item.path !== `/${locale}/admin` && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
              }}
              className={`flex items-center gap-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}
              title={item.label}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:scale-110 group-hover:text-sky-400'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 font-medium">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${item.badgeColor || 'bg-sky-500 text-white'}`}
                >
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-slate-900" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile & Logout */}
      <div className={`border-t border-slate-800/80 space-y-1.5 shrink-0 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {!isCollapsed && user && (
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">{user.name}</span>
              <span className="text-[9px] text-slate-400 truncate">{isAr ? user.roleTitleAr : user.roleTitleEn}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          </div>
        )}

        <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
          <Link
            href={`/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex-1 ${
              isCollapsed ? 'justify-center w-full p-2' : ''
            }`}
            title={isAr ? 'زيارة الموقع الحي' : 'Visit Live Site'}
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            {!isCollapsed && <span>{isAr ? 'الموقع العام' : 'Public Site'}</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ${
              isCollapsed ? 'w-full flex items-center justify-center p-2' : ''
            }`}
            title={isAr ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
