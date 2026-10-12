"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BRAND_CONFIG } from '../../data/brandConfig';
import { storageAdapter } from '../../services/storageAdapter';
import { FooterConfig } from '../../types';

interface FooterProps {
  locale: 'ar' | 'en';
}

// Icons for social networks
const SocialIcon = ({ platform, className = 'w-4 h-4' }: { platform: string; className?: string }) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a2.997 2.997 0 0 0 2.11 2.107c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.002 3.002 0 0 0 2.11-2.107C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
};

const ArchitecturalAccent = ({ className = '' }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 1200 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <line x1="50" y1="120" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="150" y1="120" x2="150" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <line x1="250" y1="120" x2="250" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="350" y1="120" x2="350" y2="70" stroke="currentColor" strokeWidth="1.5" />
    <line x1="450" y1="120" x2="450" y2="30" stroke="currentColor" strokeWidth="1.5" />
    <line x1="550" y1="120" x2="550" y2="90" stroke="currentColor" strokeWidth="1.5" />
    <line x1="650" y1="120" x2="650" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="750" y1="120" x2="750" y2="60" stroke="currentColor" strokeWidth="1.5" />
    <line x1="850" y1="120" x2="850" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="950" y1="120" x2="950" y2="80" stroke="currentColor" strokeWidth="1.5" />
    <line x1="1050" y1="120" x2="1050" y2="40" stroke="currentColor" strokeWidth="1.5" />
    <line x1="1150" y1="120" x2="1150" y2="90" stroke="currentColor" strokeWidth="1.5" />
    
    <line x1="50" y1="20" x2="150" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="150" y1="50" x2="250" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="250" y1="10" x2="350" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="350" y1="70" x2="450" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="450" y1="30" x2="550" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="550" y1="90" x2="650" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="650" y1="20" x2="750" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="750" y1="60" x2="850" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="850" y1="10" x2="950" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="950" y1="80" x2="1050" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="1050" y1="40" x2="1150" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
  </svg>
);

export function Footer({ locale }: FooterProps) {
  const pathname = usePathname();
  const brand = BRAND_CONFIG[locale as 'ar' | 'en'] || BRAND_CONFIG.ar;
  const currentYear = new Date().getFullYear();
  const isAr = locale === 'ar';

  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    const config = storageAdapter.getFooterConfig();
    setFooterConfig(config);
  }, []);

  if (pathname?.includes('/admin')) {
    return null;
  }

  const aboutText = footerConfig ? (isAr ? footerConfig.aboutTextAr : footerConfig.aboutTextEn) : (
    isAr 
      ? "شركة هضاب الخليج العربي للمقاولات، شريككم الوطني المعتمد لتنفيذ مشاريع البنية التحتية المتكاملة، وتطوير شبكات الطرق والسيول وفق أرقى المعايير الهندسية بالمملكة."
      : "Arabian Gulf Hills Contracting Company, your trusted national partner for integrated infrastructure, roads, and drainage networks under the highest engineering standards."
  );

  const quickLinks = footerConfig?.quickLinks || [
    { id: 'fl-1', labelAr: 'من نحن ورؤية 2030', labelEn: 'About Us & Vision 2030', path: '/about' },
    { id: 'fl-2', labelAr: 'المشاريع المحدثة', labelEn: 'Projects Showcase', path: '/projects' },
    { id: 'fl-3', labelAr: 'أسطول الآليات والمعدات', labelEn: 'Machinery Fleet', path: '/equipment' },
    { id: 'fl-4', labelAr: 'شهادات الآيزو والتصنيف', labelEn: 'ISO & Accreditations', path: '/certificates' },
    { id: 'fl-5', labelAr: 'تواصل معنا', labelEn: 'Contact Us', path: '/contact' },
  ];

  const engineeringLinks = footerConfig?.engineeringLinks || [
    { id: 'el-1', labelAr: 'تطوير الطرق وسفلتتها', labelEn: 'Road Paving & Development', path: '/services' },
    { id: 'el-2', labelAr: 'تصريف مياه الأمطار والسيول', labelEn: 'Stormwater Drainage Networks', path: '/services' },
    { id: 'el-3', labelAr: 'معالجة التشوه البصري', labelEn: 'Urban Landscape & Visual Pollution', path: '/services' },
    { id: 'el-4', labelAr: 'صيانة وتأهيل المرافق', labelEn: 'Facilities Maintenance & Rehab', path: '/services' },
  ];

  const contactPhone = footerConfig?.contact?.phone || brand.phone;
  const contactEmail = footerConfig?.contact?.email || brand.email;
  const contactAddress = footerConfig ? (isAr ? footerConfig.contact.addressAr : footerConfig.contact.addressEn) : brand.address;
  const contactMapUrl = footerConfig?.contact?.mapUrl || brand.mapUrl || "https://maps.app.goo.gl/o8L6PDszKYuXCJzT9";
  const contactCr = footerConfig?.contact?.cr || brand.cr;
  const contactVat = footerConfig?.contact?.vat || brand.vat;

  return (
    <footer className="relative z-10 bg-slate-50 text-slate-800 dark:bg-[#070C14] dark:text-slate-350 border-t border-slate-200 dark:border-slate-900/60 transition-colors duration-300">
      {/* Architectural Accent lines Background Frame */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[80%] pointer-events-none overflow-hidden -z-10 opacity-5 dark:opacity-15">
        <ArchitecturalAccent className="w-full h-full text-slate-400 dark:text-[#00B0F0] dark:opacity-20 object-bottom" />
      </div>
      
      {/* Brand & Sitemaps Grid */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Brand identity */}
        <div className="space-y-5">
          <Link href={`/${locale}`} className="relative block select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B0F0] rounded-xl">
            {/* Light Mode Logo */}
            <div className="dark:hidden">
              <Image 
                src="/logo-light.png" 
                alt={brand.name} 
                width={480}
                height={140}
                className="h-20 sm:h-24 md:h-28 w-auto object-contain max-w-[320px] sm:max-w-[380px] transition-transform duration-300 hover:scale-[1.02]" 
                priority
              />
            </div>
            {/* Dark Mode Logo */}
            <div className="hidden dark:block">
              <Image 
                src="/logo-dark.png" 
                alt={brand.name} 
                width={480}
                height={140}
                className="h-20 sm:h-24 md:h-28 w-auto object-contain max-w-[320px] sm:max-w-[380px] transition-transform duration-300 hover:scale-[1.02]" 
                priority
              />
            </div>
          </Link>
          
          <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-350 font-medium">
            {aboutText}
          </p>

          {/* CR & VAT Official Credentials */}
          <div className="pt-3 pb-3 space-y-2 border-y border-slate-200 dark:border-slate-800/80 text-xs md:text-sm text-slate-800 dark:text-slate-300 font-semibold">
            <div className="flex items-center justify-between">
              <span>{isAr ? 'الرقم الموحد 700:' : 'Unified Contact No. 700:'}</span>
              <span className="font-mono font-black text-slate-900 dark:text-white select-all">{contactCr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{isAr ? 'الرقم الضريبي:' : 'VAT Number:'}</span>
              <span className="font-mono font-black text-slate-900 dark:text-white select-all">{contactVat}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Strategic Services */}
        <div className="space-y-4">
          <h3 className="text-sm font-black tracking-wider text-slate-950 dark:text-white uppercase border-b border-slate-200 dark:border-slate-800 pb-2">
            {isAr ? "قطاعات الأعمال الإستراتيجية" : "Strategic Sectors"}
          </h3>
          <ul className="space-y-3 text-xs md:text-sm font-extrabold">
            {engineeringLinks.map((link) => {
              const fullPath = link.path.startsWith('http')
                ? link.path
                : `/${locale}${link.path.startsWith('/') ? link.path : `/${link.path}`}`;
              return (
                <li key={link.id}>
                  <Link 
                    href={fullPath} 
                    className="text-slate-700 hover:text-brand-blue dark:text-slate-350 dark:hover:text-brand-sky transition-colors duration-200 block"
                  >
                    {isAr ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-black tracking-wider text-slate-950 dark:text-white uppercase border-b border-slate-200 dark:border-slate-800 pb-2">
            {isAr ? "روابط سريعة" : "Quick Links"}
          </h3>
          <ul className="space-y-3 text-xs md:text-sm font-extrabold">
            {quickLinks.map((link) => {
              const fullPath = link.path.startsWith('http')
                ? link.path
                : link.path === '/'
                ? `/${locale}`
                : `/${locale}${link.path.startsWith('/') ? link.path : `/${link.path}`}`;
              return (
                <li key={link.id}>
                  <Link 
                    href={fullPath} 
                    className="text-slate-700 hover:text-brand-blue dark:text-slate-350 dark:hover:text-brand-sky transition-colors duration-200 block"
                  >
                    {isAr ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 4: Contact Channels */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-wider text-slate-950 dark:text-white uppercase border-b border-slate-200 dark:border-slate-800 pb-1.5">
            {isAr ? "قنوات الاتصال المعتمدة" : "Certified Contact Channels"}
          </h3>
          <div className="space-y-3 text-xs text-slate-800 dark:text-slate-350 font-medium">
            <p className="flex items-start gap-2.5">
              <span className="text-brand-yellow font-semibold">📍</span>
              <a 
                href={contactMapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline hover:text-brand-blue dark:hover:text-brand-sky"
              >
                {contactAddress}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-brand-yellow font-semibold">📞</span>
              <a 
                href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
                className="font-mono select-all hover:underline hover:text-brand-blue dark:hover:text-brand-sky" 
                dir="ltr"
              >
                {contactPhone}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-brand-yellow font-semibold">✉️</span>
              <a 
                href={`mailto:${contactEmail}`} 
                className="select-all hover:underline hover:text-brand-blue dark:hover:text-brand-sky"
              >
                {contactEmail}
              </a>
            </p>
          </div>

          {/* Social Links List */}
          <div className="flex items-center gap-2.5 pt-2">
            {(footerConfig?.socials || brand.socials)
              .filter((soc) => (soc as any).isEnabled !== false)
              .map((soc, sIdx) => (
                <a 
                  key={sIdx} 
                  href={soc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 rounded-full transition-all duration-200"
                  aria-label={soc.platform}
                >
                  <SocialIcon platform={soc.icon || soc.platform} className="w-4 h-4" />
                </a>
              ))}
          </div>
        </div>

      </div>

      {/* Official Accreditation Logos Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-100/70 via-white/80 to-slate-100/70 dark:from-[#050912] dark:via-[#090F1C] dark:to-[#050912] py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0070BA] dark:bg-[#00B0F0] animate-pulse" />
              <h4 className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                {isAr ? "الاعتمادات والمنصات الرسمية المرتبطة" : "Official Accreditations & Connected Platforms"}
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              {isAr ? "تراخيص حكومية سارية ومعتمدة 100%" : "100% Active & Valid Government Licenses"}
            </span>
          </div>

          {/* Accreditation Logos Grid (6 Official Entities) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 items-center">
            
            {/* 1. Saudi Vision 2030 */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/vision-2030-logo.jpg"
                  alt="Saudi Vision 2030"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'رؤية السعودية 2030' : 'Saudi Vision 2030'}
                </p>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  {isAr ? 'شريك التنمية' : 'National Partner'}
                </p>
              </div>
            </div>

            {/* 2. Ministry of Commerce */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0070BA] dark:hover:border-sky-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/ministry-of-commerce.png"
                  alt="Ministry of Commerce"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'وزارة التجارة' : 'Ministry of Commerce'}
                </p>
                <p className="text-[9px] font-mono font-bold text-[#0070BA] dark:text-sky-400 truncate">
                  CR: {brand.cr}
                </p>
              </div>
            </div>

            {/* 3. ZATCA + VAT */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/zatca-vat.png"
                  alt="ZATCA VAT Authority"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'هيئة الزكاة والضريبة' : 'ZATCA Authority'}
                </p>
                <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 truncate">
                  VAT Registered
                </p>
              </div>
            </div>

            {/* 4. Saudi Business Center */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/saudi-business-center.jpg"
                  alt="Saudi Business Center"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'المركز السعودي للأعمال' : 'Saudi Business Center'}
                </p>
                <p className="text-[9px] font-bold text-purple-600 dark:text-purple-400 truncate">
                  {isAr ? 'منصة الأعمال' : 'Business Hub'}
                </p>
              </div>
            </div>

            {/* 5. Balady Platform */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/balady-platform.png"
                  alt="Balady Platform"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'منصة بلدي الرقمية' : 'Balady Platform'}
                </p>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  {isAr ? 'الشؤون البلدية' : 'Municipal Portal'}
                </p>
              </div>
            </div>

            {/* 6. National Address */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/images/logos/national-address.jpg"
                  alt="National Address"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-start min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isAr ? 'العنوان الوطني' : 'National Address'}
                </p>
                <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 truncate">
                  {isAr ? 'موثق رسمياً' : 'SPL Verified'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Corporate bottom banner */}
      <div className="border-t border-slate-200/60 dark:border-slate-800 bg-slate-100/40 dark:bg-black/35 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-800 dark:text-slate-400 tracking-wider font-bold uppercase">
          
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-start max-w-2xl">
            <p>
              &copy; {currentYear} {brand.name}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <p className="text-[9px] text-slate-700 dark:text-slate-500 normal-case font-medium leading-relaxed">
              {isAr
                ? "جميع المشاريع والحلول منفذة بما يتوافق مع الكود العمراني السعودي والمعايير الهندسية الوطنية المعتمدة."
                : "All projects and engineering solutions are executed in compliance with the Saudi Building Code and approved national engineering standards."
              }
            </p>
          </div>

          <div className="flex items-center gap-3 text-center md:text-end shrink-0">
            <span>
              {isAr
                ? 'صمم وهندست بواسطة شركة هضاب الخليج العربي.'
                : 'Engineered & Designed by Gulf Hills Company.'}
            </span>
            <Link
              href={`/${locale}/admin/login`}
              className="px-2.5 py-1 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors lowercase"
              title={isAr ? 'دخول الإدارة' : 'Admin Login'}
            >
              🔒 {isAr ? 'بوابة الإدارة' : 'Admin'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
