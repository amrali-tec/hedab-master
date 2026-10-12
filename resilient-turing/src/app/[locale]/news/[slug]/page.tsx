import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { RichArticleItem } from '../../../../types';

interface ArticlePageProps {
  params: Promise<{ locale: 'ar' | 'en'; slug: string }>;
}

export async function generateStaticParams() {
  const articles = storageAdapter.getArticles();
  const params: { locale: 'ar' | 'en'; slug: string }[] = [];

  const locales: ('ar' | 'en')[] = ['ar', 'en'];

  locales.forEach((locale) => {
    articles.forEach((article) => {
      params.push({
        locale,
        slug: article.slug,
      });
    });
    // Fallback for static default slugs
    params.push(
      { locale, slug: 'stormwater-drainage-riyadh-accreditation' },
      { locale, slug: 'east-riyadh-highway-paving-milestone' },
      { locale, slug: 'iso-14001-environmental-certification' }
    );
  });

  return params;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';
  const articles = storageAdapter.getArticles();
  const article = articles.find((a) => a.slug === slug) || articles[0];

  if (!article) {
    return {
      title: isAr ? 'مقال غير موجود | هضاب الخليج' : 'Article Not Found | Gulf Hills',
    };
  }

  const title = isAr ? `${article.titleAr} | هضاب الخليج للمقاولات` : `${article.titleEn} | Gulf Hills Contracting`;
  const description = isAr ? article.excerptAr : article.excerptEn;
  const baseUrl = 'https://hedabkh.com.sa';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: article.coverImage }],
      url: `${baseUrl}/${locale}/news/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/news/${slug}`,
      languages: {
        'ar-SA': `${baseUrl}/ar/news/${slug}`,
        'en-US': `${baseUrl}/en/news/${slug}`,
      },
    },
  };
}

export default async function ArticleSinglePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';
  const articles = storageAdapter.getArticles();
  
  // Find article by slug or ID
  const article = articles.find((a) => a.slug === slug || a.id === slug) || articles[0];

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const title = isAr ? article.titleAr : article.titleEn;
  const excerpt = isAr ? article.excerptAr : article.excerptEn;
  const content = isAr ? article.contentAr : article.contentEn;
  const authorName = isAr ? article.author.nameAr : article.author.nameEn;
  const authorRole = isAr ? article.author.roleAr : article.author.roleEn;
  const categoryLabel = isAr ? article.categoryAr : article.categoryEn;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: [article.coverImage.startsWith('http') ? article.coverImage : `https://hedabkh.com.sa${article.coverImage}`],
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'شركة هضاب الخليج العربي للمقاولات',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hedabkh.com.sa/logo-light.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hedabkh.com.sa/${locale}/news/${slug}`,
    },
  };

  return (
    <article className="min-h-screen bg-transparent text-slate-900 dark:text-white pb-24 text-start">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* 1. Article Hero Header */}
      <div className="relative py-12 md:py-20 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href={`/${locale}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/news`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {isAr ? 'الأخبار والمستجدات' : 'News & Insights'}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[240px] sm:max-w-md">
              {title}
            </span>
          </nav>

          {/* Category & Date Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold font-mono">
              {categoryLabel}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{isAr ? 'قراءة 4 دقائق' : '4 min read'}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl">
            {title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
            {excerpt}
          </p>

          {/* Author info box */}
          <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <img
              src={article.author.avatar}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-sky-500/30"
            />
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {authorName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {authorRole}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Article Body & Sidebar */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left/Right Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800">
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>

          {/* Rich HTML Content Body */}
          <div
            className="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-sky-600 prose-img:rounded-2xl prose-blockquote:border-s-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 me-2">
                <Tag className="w-3.5 h-3.5" />
                <span>{isAr ? 'الكلمات المفتاحية:' : 'Tags:'}</span>
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back to News CTA */}
          <div className="pt-6">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold transition-all"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'العودة لمركز الأخبار والمستجدات' : 'Back to News Center'}</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Official Accreditation Seal Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#002060] to-[#004080] text-white space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sky-300" />
            </div>
            <h3 className="text-base font-black">
              {isAr ? 'شركة هضاب الخليج للمقاولات' : 'Gulf Hills Contracting'}
            </h3>
            <p className="text-xs text-sky-100 leading-relaxed">
              {isAr
                ? 'شريك وطني معتمد في مشاريع البنية التحتية، رصف الطرق، وتصريف السيول بالمملكة العربية السعودية وفق رؤية 2030.'
                : 'Certified national partner for infrastructure, road paving, and stormwater networks across Saudi Arabia under Vision 2030.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="block w-full py-2.5 text-center rounded-xl bg-white text-[#002060] font-black text-xs hover:bg-sky-50 transition-all shadow-md"
            >
              {isAr ? 'طلب عرض سعر / تواصل معنا' : 'Request a Quote / Contact'}
            </Link>
          </div>

          {/* Related Articles List */}
          {relatedArticles.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                {isAr ? 'مقالات وأخبار ذات صلة' : 'Related Articles'}
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.slug}`}
                    className="group block space-y-1.5"
                  >
                    <div className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">
                      {item.publishedAt}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-500 transition-colors line-clamp-2 leading-snug">
                      {isAr ? item.titleAr : item.titleEn}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </article>
  );
}
