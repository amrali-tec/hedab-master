"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderKanban,
  Wrench,
  Award,
  Users,
  Building2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Truck,
  Phone,
  FileText,
  FileCheck,
} from 'lucide-react';
import { mockData } from '../../data/mockData';

interface GlobalCommandPaletteProps {
  locale?: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalCommandPalette({
  locale = 'ar',
  isOpen,
  onClose,
}: GlobalCommandPaletteProps) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentData = mockData[locale] || mockData.ar;

  // Search Results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default quick navigation links
      return [
        {
          id: 'nav-projects',
          type: 'page',
          title: isAr ? 'المشاريع الهندسية المنجزة والميدانية' : 'Engineering Projects Portfolio',
          subtitle: isAr ? 'استعراض سجل مشاريع الطرق والسيول والخرسانة' : 'View all infrastructure projects',
          url: `/${locale}/projects`,
          icon: FolderKanban,
          badge: isAr ? 'صفحة' : 'Page',
        },
        {
          id: 'nav-services',
          type: 'page',
          title: isAr ? 'الخدمات والقطاعات التشغيلية' : 'Engineering Services & Sectors',
          subtitle: isAr ? 'سفلتة، تصريف سيول، حواجز نيوجيرسي، وصيانة' : 'Asphalt, stormwater, barriers & maintenance',
          url: `/${locale}/services`,
          icon: Wrench,
          badge: isAr ? 'صفحة' : 'Page',
        },
        {
          id: 'nav-equipment',
          type: 'page',
          title: isAr ? 'أسطول الآليات والمعدات الثقيلة' : 'Heavy Machinery & Equipment Fleet',
          subtitle: isAr ? 'كاشطات Wirtgen، رصاصات Dynapac، وشاحنات النقل' : 'Milling machines, rollers, dump trucks',
          url: `/${locale}/equipment`,
          icon: Truck,
          badge: isAr ? 'أسطول' : 'Fleet',
        },
        {
          id: 'nav-certificates',
          type: 'page',
          title: isAr ? 'شهادات الاعتماد والآيزو الرسمية' : 'Certificates & ISO Accreditations',
          subtitle: isAr ? 'ISO 9001 / 14001 / 45001 وتصنيف المقاولين' : 'Official accreditations & compliance records',
          url: `/${locale}/certificates`,
          icon: Award,
          badge: isAr ? 'اعتمادات' : 'ISO',
        },
        {
          id: 'nav-team',
          type: 'page',
          title: isAr ? 'فريق العمل والكوادر الهندسية والقيادية' : 'Executive Leadership & Engineering Team',
          subtitle: isAr ? 'مدراء المشاريع والمهندسون المشرفون' : 'Leadership & field project engineers',
          url: `/${locale}/team`,
          icon: Users,
          badge: isAr ? 'فريق' : 'Team',
        },
        {
          id: 'nav-contact',
          type: 'page',
          title: isAr ? 'تواصل معنا وطلب عروض الأسعار' : 'Contact Us & Request Quotation',
          subtitle: isAr ? 'العنوان الوطني بالرياض، الهاتف والبريد' : 'National address, phone & RFQ',
          url: `/${locale}/contact`,
          icon: Phone,
          badge: isAr ? 'تواصل' : 'Contact',
        },
      ];
    }

    const items: Array<{
      id: string;
      type: string;
      title: string;
      subtitle: string;
      url: string;
      icon: any;
      badge: string;
    }> = [];

    // Search Projects
    currentData.projects?.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.client.toLowerCase().includes(q) ||
        proj.location.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: `proj-${proj.id}`,
          type: 'project',
          title: proj.title,
          subtitle: `${proj.category} • ${proj.client} • ${proj.location}`,
          url: `/${locale}/projects/${proj.id}`,
          icon: FolderKanban,
          badge: isAr ? 'مشروع' : 'Project',
        });
      }
    });

    // Search Services
    currentData.services?.forEach((serv) => {
      if (
        serv.title.toLowerCase().includes(q) ||
        serv.description.toLowerCase().includes(q) ||
        serv.features?.some((f) => f.toLowerCase().includes(q))
      ) {
        items.push({
          id: `serv-${serv.id}`,
          type: 'service',
          title: serv.title,
          subtitle: serv.description,
          url: `/${locale}/services`,
          icon: Wrench,
          badge: isAr ? 'خدمة' : 'Service',
        });
      }
    });

    // Search Certificates
    currentData.certificates?.forEach((cert) => {
      if (
        cert.title.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        cert.idNumber.toLowerCase().includes(q)
      ) {
        items.push({
          id: `cert-${cert.id}`,
          type: 'certificate',
          title: cert.title,
          subtitle: `${cert.issuer} • ${cert.idNumber}`,
          url: `/${locale}/certificates`,
          icon: Award,
          badge: isAr ? 'شهادة' : 'ISO',
        });
      }
    });

    // Search Team
    currentData.team?.forEach((mem) => {
      if (
        mem.name.toLowerCase().includes(q) ||
        mem.role.toLowerCase().includes(q) ||
        mem.bio.toLowerCase().includes(q)
      ) {
        items.push({
          id: `team-${mem.id}`,
          type: 'team',
          title: mem.name,
          subtitle: mem.role,
          url: `/${locale}/team`,
          icon: Users,
          badge: isAr ? 'قيادة' : 'Member',
        });
      }
    });

    return items;
  }, [query, currentData, locale, isAr]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-24 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-scale-up flex flex-col">
        {/* Search Input Header */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-3">
          <Search className="w-5 h-5 text-sky-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isAr
                ? 'ابحث عن أي مشروع، خدمة، شهادة آيزو، أو معدات...'
                : 'Search projects, services, ISO records, machinery...'
            }
            className="flex-1 bg-transparent text-sm md:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-1 scrollbar-thin">
          {results.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <Search className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isAr ? 'لم يتم العثور على نتائج تطابق بحثك' : 'No matching results found'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'جرب البحث بكلمات أخرى مثل: سفلتة، سيول، نيوجيرسي، الرياض' : 'Try searching for: asphalt, drainage, ISO, Riyadh'}
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl text-start transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-500/40 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm font-black truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                      {item.badge}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-sky-500 rtl:rotate-180" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">↑↓</kbd>{' '}
              {isAr ? 'للتنقل' : 'to navigate'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">↵</kbd>{' '}
              {isAr ? 'للاختيار' : 'to select'}
            </span>
          </div>
          <span className="text-sky-600 dark:text-sky-400 font-mono font-bold">
            {results.length} {isAr ? 'عنصر' : 'items'}
          </span>
        </div>
      </div>
    </div>
  );
}
