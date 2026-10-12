"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { BRAND_CONFIG } from '../../data/brandConfig';
import ar from '../../data/locales/ar.json';
import en from '../../data/locales/en.json';
import { useUiStore } from '../../context/useUiStore';
import { MagneticButton } from '../../animations/motion-components';
import { Search, FileText, Download, PhoneCall, ArrowLeft, ArrowRight, Send, Sparkles } from 'lucide-react';
import GlobalCommandPalette from '../ui/GlobalCommandPalette';
import CorporateProfileModal from '../ui/CorporateProfileModal';
import { QuickQuoteModal } from '../ui/QuickQuoteModal';
import { storageAdapter } from '../../services/storageAdapter';
import { HeaderConfig } from '../../types';
import { Button, Badge } from '../ui/primitives';

interface HeaderProps {
  locale: 'ar' | 'en';
}

const SunIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828-9.9a5 5 0 117.071 7.071l-7.071-7.071z" />
  </svg>
);

const MoonIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SystemIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArchitecturalAccent = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="60" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="20" y1="60" x2="20" y2="25" stroke="currentColor" strokeWidth="1.5" />
    <line x1="30" y1="60" x2="30" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="40" y1="60" x2="40" y2="35" stroke="currentColor" strokeWidth="1.5" />
    <line x1="50" y1="60" x2="50" y2="15" stroke="currentColor" strokeWidth="1.5" />
    <line x1="60" y1="60" x2="60" y2="45" stroke="currentColor" strokeWidth="1.5" />
    <line x1="10" y1="10" x2="20" y2="25" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="20" y1="25" x2="30" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="30" y1="5" x2="40" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="40" y1="35" x2="50" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="50" y1="15" x2="60" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  const activeLocale = (locale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const brand = BRAND_CONFIG[activeLocale] || BRAND_CONFIG.ar;
  const dict = activeLocale === 'ar' ? ar : en;
  const isAr = activeLocale === 'ar';

  // Hydration guard & CMS Header Config Loader
  useEffect(() => {
    setMounted(true);
    const config = storageAdapter.getHeaderConfig();
    setHeaderConfig(config);
  }, []);

  // Keyboard listener to close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // GSAP animation & Body Scroll Lock for full-screen mobile menu drawer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const menu = mobileMenuRef.current;
    const links = mobileLinksRef.current?.children;
    if (!menu) return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.killTweensOf([menu, links]);
      gsap.set(menu, { display: 'flex', opacity: 0, y: -10 });
      gsap.to(menu, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      });
      if (links) {
        gsap.fromTo(
          links,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, stagger: 0.03, ease: 'power1.out', delay: 0.05 }
        );
      }
    } else {
      document.body.style.overflow = '';
      gsap.killTweensOf([menu, links]);
      gsap.to(menu, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(menu, { display: 'none' });
        },
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const switchLanguage = () => {
    const targetLocale = locale === 'ar' ? 'en' : 'ar';
    if (!pathname) return;

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'ar' || segments[0] === 'en') {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }

    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  // If currently on admin pages, do not render public site header
  if (pathname?.includes('/admin')) {
    return null;
  }

  // Compile navigation links dynamically from CMS with fallback
  const navItems: { label: string; path: string; badge?: string; isExternal?: boolean }[] = headerConfig?.menuItems
    ? headerConfig.menuItems
        .filter((item) => item.isEnabled)
        .map((item) => {
          const itemPath = item.path.startsWith('http')
            ? item.path
            : item.path === '/'
            ? `/${locale}`
            : `/${locale}${item.path.startsWith('/') ? item.path : `/${item.path}`}`;
          return {
            label: isAr ? item.labelAr : item.labelEn,
            path: itemPath,
            badge: isAr ? item.badgeAr : item.badgeEn,
            isExternal: item.isExternal,
          };
        })
    : [
        { label: dict.nav.home, path: `/${locale}`, isExternal: false },
        { label: dict.nav.about, path: `/${locale}/about`, isExternal: false },
        { label: locale === 'ar' ? 'رسالة الرئيس' : "Chairman's Message", path: `/${locale}/chairman-message`, isExternal: false },
        { label: dict.nav.services, path: `/${locale}/services`, isExternal: false },
        { label: locale === 'ar' ? 'الأسطول والمعدات' : 'Fleet & Equipment', path: `/${locale}/equipment`, badge: locale === 'ar' ? 'جديد' : 'New', isExternal: false },
        { label: dict.nav.projects, path: `/${locale}/projects`, isExternal: false },
        { label: dict.nav.team, path: `/${locale}/team`, isExternal: false },
        { label: dict.nav.certificates, path: `/${locale}/certificates`, isExternal: false },
        { label: (dict.nav as any).news || "News", path: `/${locale}/news`, isExternal: false },
        { label: dict.nav.contact, path: `/${locale}/contact`, isExternal: false },
      ];

  const announcement = headerConfig?.announcement;
  const ctaButton = headerConfig?.ctaButton;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-md transition-all duration-300">
        
        {/* Tier 1: Top Utility & Action Bar (Full Screen Width) */}
        <div className="w-full bg-[#002060] dark:bg-[#070C14] text-white py-2 px-4 sm:px-6 md:px-10 border-b border-sky-400/20">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
            
            {/* Announcement / Hotline */}
            <div className="flex items-center gap-3 truncate">
              {announcement?.isEnabled && (
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold truncate text-slate-100">
                    {isAr ? announcement.textAr : announcement.textEn}
                  </span>
                </div>
              )}
              {announcement?.phone && (
                <a
                  href={`tel:${announcement.phone}`}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                >
                  <PhoneCall className="w-3 h-3 text-[#00B0F0]" />
                  <span>{isAr ? announcement.buttonTextAr || announcement.phone : announcement.buttonTextEn || announcement.phone}</span>
                </a>
              )}
            </div>

            {/* Desktop Utility Actions Container */}
            <div className="hidden xl:flex items-center space-x-2 2xl:space-x-3 rtl:space-x-reverse shrink-0">
              {/* Quick Search Palette Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 border border-white/15 focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                title={locale === 'ar' ? 'بحث شامل (Ctrl + K)' : 'Search (Ctrl + K)'}
              >
                <Search className="w-3.5 h-3.5 text-sky-300" />
                <span>{locale === 'ar' ? 'البحث الشامل' : 'Search'}</span>
                <kbd className="hidden 2xl:inline-block px-1.5 py-0.2 rounded bg-white/15 text-[9px] font-mono text-sky-200">
                  ⌘K
                </kbd>
              </button>

              {/* Interactive Multi-Step Project Quote & RFQ Trigger Button */}
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer shadow-md shadow-amber-950/20 whitespace-nowrap shrink-0 border border-amber-300/40"
                title={locale === 'ar' ? 'طلب عرض سعر فوري أو مناقصة لمشروعك' : 'Request Instant Project Quotation & RFQ'}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? 'طلب عرض سعر' : 'Request RFQ'}</span>
              </button>

              {/* Direct Official PDF Download Button */}
              <a
                href="/gulf-hills-profile.pdf"
                download="Arabian-GulfHILLS-Profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer shadow-xs whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-400"
                title={locale === 'ar' ? 'تحميل البروفايل الرسمي للشركة (PDF - 23 صفحة)' : 'Download Official Company Profile PDF'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>{locale === 'ar' ? 'بروفايل الشركة PDF' : 'Download Profile'}</span>
              </a>

              {/* Corporate Profile Dossier Modal Trigger */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer shadow-xs whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                title={locale === 'ar' ? 'معاينة ومناقصات الملف التأهيلي التفاعلي' : 'Interactive Corporate Profile Dossier'}
              >
                <FileText className="w-3.5 h-3.5 text-sky-300" />
                <span>{locale === 'ar' ? 'الملف التأهيلي' : 'Profile Dossier'}</span>
              </button>

              {/* Segmented Theme Switcher */}
              {mounted && (
                <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/15 shrink-0">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-1 rounded-full transition-all duration-200 cursor-pointer ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                    aria-label="Light Theme"
                  >
                    <SunIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-1 rounded-full transition-all duration-200 cursor-pointer ${theme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
                    aria-label="Dark Theme"
                  >
                    <MoonIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-1 rounded-full transition-all duration-200 cursor-pointer ${theme === 'system' ? 'bg-[#0070BA] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
                    aria-label="System Theme"
                  >
                    <SystemIcon className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Premium Language Switcher Button */}
              <MagneticButton range={15} strength={0.1}>
                <button
                  onClick={switchLanguage}
                  className="px-3 py-1 border border-sky-400/50 text-white rounded-lg text-xs font-black tracking-wider uppercase hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer shadow-xs whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                >
                  {dict.lang.label}
                </button>
              </MagneticButton>
            </div>

            {/* Mobile Language trigger in Top Bar */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse xl:hidden">
              <button
                onClick={switchLanguage}
                className="px-2 py-0.5 border border-sky-400/50 text-white rounded text-[10px] font-extrabold uppercase cursor-pointer"
              >
                {locale === 'ar' ? 'EN' : 'AR'}
              </button>
            </div>

          </div>
        </div>

        {/* Tier 2: Main Header Bar with Large Logo & Full Screen Width Desktop Navigation */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 h-28 sm:h-32 lg:h-36 flex items-center justify-between gap-6 relative">
          
          {/* Architectural Accent lines */}
          <ArchitecturalAccent className="absolute left-4 top-1/2 -translate-y-1/2 h-16 sm:h-20 w-auto pointer-events-none text-slate-300 dark:text-[#00B0F0] opacity-20 hidden md:block" />
          
          {/* Company Logo / Name */}
          <Link 
            href={`/${locale}`} 
            className="relative block select-none py-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B0F0] rounded-xl"
            onClick={closeMobileMenu}
          >
            {/* Light Mode Logo */}
            <div className="dark:hidden flex items-center">
              <Image 
                src="/logo-light.png" 
                alt={brand.name} 
                width={650}
                height={190}
                className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-[8.5rem] w-auto object-contain max-w-[320px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[700px] transition-transform duration-300 hover:scale-[1.02]" 
                priority
              />
            </div>
            {/* Dark Mode Logo */}
            <div className="hidden dark:flex items-center">
              <Image 
                src="/logo-dark.png" 
                alt={brand.name} 
                width={650}
                height={190}
                className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-[8.5rem] w-auto object-contain max-w-[320px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[700px] transition-transform duration-300 hover:scale-[1.02]" 
                priority
              />
            </div>
          </Link>

          {/* Full Screen Width Desktop Navigation Links */}
          <nav 
            className="hidden xl:flex items-center space-x-1.5 2xl:space-x-3.5 rtl:space-x-reverse font-black text-sm xl:text-[15px] 2xl:text-base tracking-normal uppercase whitespace-nowrap overflow-x-auto no-scrollbar py-1"
            aria-label="Main Navigation"
          >
            {navItems.map((item, idx) => {
              const isActive = pathname === item.path || (pathname && item.path !== `/${locale}` && pathname.startsWith(item.path));
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className={`relative px-3 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B0F0] ${
                    isActive
                      ? 'text-[#0070BA] dark:text-[#00B0F0] font-black bg-sky-500/10 border-b-2 border-[#0070BA] dark:border-[#00B0F0]'
                      : 'text-slate-800 dark:text-slate-100 hover:text-[#0070BA] dark:hover:text-[#00B0F0] hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                  {...(item.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="warning" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile & Tablet Controls (xl:hidden) */}
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse xl:hidden">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#00B0F0] cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile PDF Icon */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0070BA] dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer flex items-center gap-1 text-[10px] font-bold focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
              aria-label="Corporate Profile"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === 'ar' ? 'الملف' : 'PDF'}</span>
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2.5 text-slate-800 dark:text-slate-100 hover:text-[#00B0F0] cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800/80 focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Full Screen Mobile & Tablet Navigation Drawer Overlay (xl:hidden) */}
        <div 
          id="mobile-navigation-drawer"
          ref={mobileMenuRef}
          className="hidden xl:hidden fixed top-28 sm:top-32 left-0 right-0 bottom-0 w-full h-[calc(100dvh-7rem)] bg-white dark:bg-[#070C14] text-slate-900 dark:text-slate-100 border-t border-slate-200/80 dark:border-slate-800/80 overflow-y-auto overscroll-contain shadow-2xl z-50 flex flex-col justify-between"
        >
          <div 
            ref={mobileLinksRef}
            className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col space-y-6 text-xs font-bold tracking-wider uppercase min-h-full justify-between"
          >
            <div className="space-y-6">
              {/* Quick Actions Bar in Drawer */}
              <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-200 dark:border-slate-800/60">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setIsQuoteOpen(true);
                  }}
                  className="py-3 px-2 rounded-2xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center gap-1 font-black text-[11px] shadow-md shadow-amber-950/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'طلب عرض سعر' : 'RFQ'}</span>
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setIsSearchOpen(true);
                  }}
                  className="py-3 px-2 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center gap-1 font-black text-[11px] shadow-xs focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                >
                  <Search className="w-4 h-4 text-[#0070BA] dark:text-[#00B0F0]" />
                  <span>{locale === 'ar' ? 'البحث' : 'Search'}</span>
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setIsProfileModalOpen(true);
                  }}
                  className="py-3 px-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0070BA] dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex flex-col items-center justify-center gap-1 font-black text-[11px] shadow-xs focus-visible:ring-2 focus-visible:ring-[#00B0F0]"
                >
                  <FileText className="w-4 h-4 text-[#0070BA] dark:text-[#00B0F0]" />
                  <span>{locale === 'ar' ? 'الملف' : 'Profile'}</span>
                </button>
              </div>

              {/* Navigation Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2">
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.path || (pathname && item.path !== `/${locale}` && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      onClick={closeMobileMenu}
                      className={`group px-4 py-3.5 rounded-2xl border transition-all flex items-center justify-between font-black text-base sm:text-lg shadow-xs focus-visible:ring-2 focus-visible:ring-[#00B0F0] ${
                        isActive
                          ? 'bg-[#0070BA]/10 dark:bg-[#00B0F0]/15 border-[#0070BA] dark:border-[#00B0F0] text-[#0070BA] dark:text-[#00B0F0]'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/60 hover:bg-sky-50 dark:hover:bg-[#00B0F0]/10 text-slate-800 dark:text-slate-200 hover:text-[#0070BA] dark:hover:text-[#00B0F0]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="warning" size="sm">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions & Details */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-4">
              {/* Theme Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">
                  {isAr ? 'ثيم الصفحات' : 'Display Theme'}
                </span>
                {mounted && (
                  <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700/60 shadow-xs">
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${theme === 'light' ? 'bg-[#0070BA] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {isAr ? 'فاتح' : 'Light'}
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${theme === 'dark' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {isAr ? 'داكن' : 'Dark'}
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${theme === 'system' ? 'bg-[#0070BA] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {isAr ? 'تلقائي' : 'System'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Global Command Search Palette */}
      <GlobalCommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
      />

      {/* Corporate Profile PDF Modal */}
      <CorporateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        locale={locale}
      />

      {/* Interactive Project RFQ & Quotation Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={activeLocale}
      />
    </>
  );
}

export default Header;
