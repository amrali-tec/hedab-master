import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Calendar, FileText, CheckCircle, ArrowRight, X, Sparkles, Tag, User, ExternalLink } from "lucide-react";
import { BRAND_CONFIG } from "../../../data/brandConfig";
import { storageAdapter } from "../../../services/storageAdapter";
import { RichArticleItem } from "../../../types";

interface NewsItem {
  id: string;
  slug?: string;
  category: string;
  type: "license" | "project" | "milestone" | "article";
  date: string;
  title: string;
  desc: string;
  specs?: string[];
  contentHtml?: string;
  coverImage?: string;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
}

import { useArticles } from "../../../hooks";

interface NewsPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function NewsPage(props?: any) {
  const routerParams = useParams<{ locale?: string }>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
  const brand = BRAND_CONFIG[locale];
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  const { data: apiArticles } = useArticles();
  const richArticles = React.useMemo(() => {
    const isVisible = (a: RichArticleItem) => {
      if (a.status === 'published') return true;
      if (a.status === 'scheduled') {
        const pubDate = new Date(a.scheduledAt || a.publishedAt);
        return !isNaN(pubDate.getTime()) && pubDate <= new Date();
      }
      return a.isPublished === true;
    };

    if (apiArticles && apiArticles.length > 0) {
      return apiArticles.filter(isVisible);
    }
    return storageAdapter.getPublicArticles();
  }, [apiArticles]);

  const staticNewsItems: NewsItem[] = [
    {
      id: "news-1",
      category: isAr ? "ترخيص معتمد" : "Official License",
      type: "license",
      date: "2026-05-12",
      title: isAr
        ? "الحصول على اعتماد أمانة منطقة الرياض لأعمال تصريف السيول"
        : "Obtaining Riyadh Municipality Accreditation for Flood Mitigation",
      desc: isAr
        ? "حصلت شركة هضاب الخليج العربي للمقاولات على الاعتماد الفني الرسمي لتنفيذ وتمديد خطوط المياه الخرسانية مسبقة الصنع لدرء أخطار السيول والأمطار ببلديات الرياض."
        : "Gulf Hills achieved official technical accreditation to execute and lay precast concrete stormwater pipelines across Riyadh municipal subdivisions.",
      specs: isAr 
        ? ["الجهة المصدرة: أمانة منطقة الرياض", "رقم الاعتماد: RUH-MUNI-FL-2026", "نطاق الصلاحية: ساري حتى 2029"]
        : ["Issuer: Riyadh Region Municipality", "Accredited Key: RUH-MUNI-FL-2026", "Validity: Active until 2029"]
    },
    {
      id: "news-2",
      category: isAr ? "مشروع مكتمل" : "Completed Project",
      type: "project",
      date: "2026-04-01",
      title: isAr
        ? "إتمام مشروع سفلتة وصيانة المحور الشرقي الرئيسي ببلديات العاصمة"
        : "Completion of East Main Highway Paving and Upkeep",
      desc: isAr
        ? "أنهت الفرق الميدانية للمؤسسة أعمال كشط وسفلتة وإعادة تأهيل أرصفة الإنترلوك والبردورات للمحور الإنشائي الرابط ببلديات شرق العاصمة وفق الكود السعودي للطرق."
        : "Our field divisions completed asphalt milling, highway paving, and interlock pavement maintenance linking the eastern municipal corridor.",
      specs: isAr
        ? ["الموقع: شرق الرياض، السعودية", "المساحة الإجمالية: 120,000 م²", "الجهة المالكة: وزارة الشؤون البلدية والقروية"]
        : ["Site: East Riyadh, KSA", "Total Area: 120,000 m²", "Client: Ministry of Municipal & Rural Affairs"]
    },
    {
      id: "news-3",
      category: isAr ? "ترخيص معتمد" : "Official License",
      type: "license",
      date: "2026-03-15",
      title: isAr
        ? "تأهيل وتأمين شهادة المطابقة البيئية ونظم الإدارة ISO 14001"
        : "Securing ISO 14001 Environmental Management Certification",
      desc: isAr
        ? "نجحت إدارة الجودة والبيئة بالشركة في مطابقة متطلبات ومعايير الإصحاح ونظافة بيئة المشاريع، والحصول على شهادة الآيزو الرسمية لإدارة البيئة."
        : "Our Quality and Compliance team successfully matched environmental safety benchmarks, receiving the ISO 14001 standard certification.",
      specs: isAr
        ? ["الشهادة: ISO 14001:2015", "جهة التدقيق: مسجل الاعتماد الدولي", "حالة الملف: مطابق ومعتمد"]
        : ["Standard: ISO 14001:2015", "Auditor: International Register of Quality", "Status: Fully Verified"]
    },
    {
      id: "news-4",
      category: isAr ? "مشروع مكتمل" : "Completed Project",
      type: "project",
      date: "2026-01-20",
      title: isAr
        ? "توريد الدفعة الأولى من حواجز نيوجرسي الخرسانية لعقود الطرق لعام 2026"
        : "Supplying First Batch of 2026 New Jersey Concrete Barriers",
      desc: isAr
        ? "أنجزت مصانع الصب المسبق التابعة للمجموعة توريد وتركيب 2,500 حاجز نيوجرسي خرساني مسبق الصنع لصالح عقود السلامة المرورية بوزارة النقل."
        : "Our precast concrete yards finalized casting and installing 2,500 New Jersey barriers for highway traffic safety contracts.",
      specs: isAr
        ? ["المعدات المستخدمة: ناقلات ثقيلة مخصصة", "الكمية الموردة: 2,500 حاجز خرساني", "الجهة المستلمة: وزارة النقل والخدمات اللوجستية"]
        : ["Logistics: Custom flatbed fleet", "Volume: 2,500 precast units", "Client: Ministry of Transport"]
    }
  ];

  // Map dynamic rich articles from Visual Rich Text Editor
  const mappedRichArticles: NewsItem[] = richArticles.map((art) => ({
    id: art.id,
    slug: art.slug,
    category: isAr ? art.categoryAr : art.categoryEn,
    type: 'article',
    date: new Date(art.publishedAt).toISOString().split('T')[0],
    title: isAr ? art.titleAr : art.titleEn,
    desc: isAr ? art.excerptAr : art.excerptEn,
    contentHtml: isAr ? art.contentAr : (art.contentEn || art.contentAr),
    coverImage: art.coverImage,
    author: {
      name: isAr ? art.author.nameAr : art.author.nameEn,
      role: isAr ? art.author.roleAr : art.author.roleEn,
      avatar: art.author.avatar,
    },
  }));

  const allNewsItems = [...mappedRichArticles, ...staticNewsItems];

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300 min-h-[85vh] relative">
      
      {/* Band 1: Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 pt-8 sm:pt-10 pb-8">
        <PageHeader
          title={isAr ? "المركز الإعلامي والأخبار" : "Corporate Milestones & News"}
          subtitle={isAr
            ? "تابع أحدث إنجازات مشاريعنا الميدانية، التقارير الهندسية، والتراخيص الحكومية المعتمدة لشركة هضاب الخليج."
            : "Follow the latest updates on completed civil works, engineering reports, and corporate compliance logs."}
          currentPageLabel={isAr ? "الأخبار والإنجازات" : "News & Milestones"}
          locale={locale}
        />
      </div>

      {/* Band 2: Milestones Feed Grid */}
      <div className="w-full py-16 bg-slate-100/50 dark:bg-slate-900/40 border-t border-b border-slate-200/50 dark:border-sky-950/20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allNewsItems.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 dark:bg-[#0B111E]/30 dark:border-gray-850/50 dark:text-white flex flex-col justify-between space-y-4 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(0,176,240,0.06)] hover:border-[#0070BA] dark:hover:border-[#00B0F0] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-start relative overflow-hidden"
              >
                {/* Tech background lines */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      item.type === "article"
                        ? "bg-[#002060]/10 dark:bg-sky-500/15 text-[#0070BA] dark:text-sky-400 border border-[#0070BA]/30"
                        : item.type === "license"
                        ? "bg-[#0070BA]/10 dark:bg-sky-500/10 text-[#0070BA] dark:text-sky-400 border border-[#0070BA]/20 dark:border-sky-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}>
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>

                  {item.coverImage && (
                    <div className="h-40 w-full rounded-xl overflow-hidden mb-2">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <h3 className="text-base md:text-lg font-black leading-snug text-slate-900 dark:text-white group-hover:text-[#0070BA] dark:group-hover:text-[#00B0F0] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-655 dark:text-text-sub leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-gray-800/30 flex items-center justify-between text-[10px] font-bold text-[#0070BA] dark:text-brand-sky relative z-10">
                  <span>{isAr ? "اقرأ التقرير والتفاصيل الكاملة" : "Read Full Story & Details"}</span>
                  <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300 ${isAr ? "rotate-180" : ""}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div onClick={() => setSelectedItem(null)} className="absolute inset-0 cursor-pointer"></div>
          <div className="w-full max-w-3xl bg-white dark:bg-[#0D1527] border border-slate-100 dark:border-[#00B0F0]/30 rounded-2xl shadow-2xl relative flex flex-col transition-all duration-300 text-start z-10 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-gray-800/40 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0D1527] z-20">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#0070BA] dark:text-brand-sky uppercase">
                {selectedItem.category}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200/40 dark:border-gray-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-550 dark:text-slate-400 border-b border-slate-100 dark:border-gray-800/40 pb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0070BA] dark:text-brand-sky" />
                  <span>{selectedItem.date}</span>
                </div>
                {selectedItem.author && (
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedItem.author.avatar}
                      alt={selectedItem.author.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedItem.author.name}</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {selectedItem.title}
              </h2>

              {selectedItem.coverImage && (
                <div className="w-full h-64 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={selectedItem.coverImage}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* If full rich HTML content exists, render it */}
              {selectedItem.contentHtml ? (
                <div
                  className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedItem.contentHtml }}
                />
              ) : (
                <p className="text-sm text-slate-700 dark:text-text-sub leading-relaxed font-semibold">
                  {selectedItem.desc}
                </p>
              )}
              
              {selectedItem.specs && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-gray-850/20 space-y-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#0070BA] dark:text-brand-sky uppercase">
                    <CheckCircle className="w-4 h-4" />
                    <span>{isAr ? "بيانات المتابعة الفنية" : "TECHNICAL METADATA LOG"}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {selectedItem.specs.map((spec: string, sIdx: number) => (
                      <li key={sIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky"></span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-gray-800/40 flex items-center justify-between gap-3">
                {selectedItem.slug ? (
                  <Link
                    href={`/${locale}/news/${selectedItem.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
                  >
                    <span>{isAr ? 'قراءة في صفحة المقال المخصصة' : 'Read on Dedicated Page'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sitemap footer */}
      <div className="pt-10 pb-8 border-t border-gray-200/15 dark:border-gray-800/25 flex justify-center text-xs text-text-sub font-semibold">
        <span>&copy; {new Date().getFullYear()} {brand.name}</span>
      </div>

    </div>
  );
}