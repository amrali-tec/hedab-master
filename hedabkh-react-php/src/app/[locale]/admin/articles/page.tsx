"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  Tag,
  User,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { RichArticleItem } from '../../../../types';
import { articleSchema, ArticleFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';
import UnifiedMediaPickerModal from '../../../../components/admin/common/UnifiedMediaPickerModal';

const ARTICLE_COVER_PRESETS = [
  { label: 'سفلتة وكشط الطرق والمحاور', url: '/images/before-after/road-paving-after.jpg' },
  { label: 'تصريف السيول وشبكات الأمطار', url: '/images/services/stormwater-drainage.jpg' },
  { label: 'حواجز نيوجيرسي الخرسانية', url: '/images/services/precast-barriers.jpg' },
  { label: 'تشغيل وصيانة المرافق والبلديات', url: '/images/services/cemetery-maintenance.jpg' },
  { label: 'أسطول الآليات والمعدات الثقيلة', url: '/images/equipment/wirtgen-milling-machine.jpg' },
];

export default function ArticlesAdminPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [articles, setArticles] = useState<RichArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<RichArticleItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RichArticleItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<boolean>(false);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      category: 'news',
      categoryAr: 'أخبار وتقارير',
      categoryEn: 'News & Reports',
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      readingTimeMinutes: 4,
      featured: false,
      isPublished: true,
      tags: ['مشاريع', 'بنية تحتية'],
    }
  });

  const currentCoverImage = watch('coverImage');

  // Load articles
  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getRichArticles();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        art.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerptAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        categoryFilter === 'all' ||
        art.category === categoryFilter ||
        art.categoryAr.includes(categoryFilter);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && (art.status === 'published' || art.isPublished)) ||
        (statusFilter === 'scheduled' && art.status === 'scheduled') ||
        (statusFilter === 'draft' && art.status === 'draft') ||
        (statusFilter === 'archived' && art.status === 'archived');

      return matchSearch && matchCategory && matchStatus;
    });
  }, [articles, searchQuery, categoryFilter, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published' || (a.isPublished && a.status !== 'scheduled' && a.status !== 'draft')).length;
    const scheduled = articles.filter(a => a.status === 'scheduled').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const featured = articles.filter(a => a.featured).length;
    return { total, published, scheduled, drafts, featured };
  }, [articles]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingArticle(null);
    reset({
      titleAr: '',
      titleEn: '',
      slug: `news-${Date.now().toString().slice(-6)}`,
      excerptAr: '',
      excerptEn: '',
      contentAr: '',
      contentEn: '',
      category: 'news',
      categoryAr: 'أخبار وتقارير',
      categoryEn: 'News & Reports',
      coverImage: '/images/projects/project-1.jpg',
      galleryImages: [],
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'published',
      isPublished: true,
      readingTimeMinutes: 4,
      featured: false,
      tags: ['مشاريع', 'بنية تحتية', 'أمانة الرياض'],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (article: RichArticleItem) => {
    setEditingArticle(article);
    reset({
      id: article.id,
      slug: article.slug,
      titleAr: article.titleAr,
      titleEn: article.titleEn || article.titleAr,
      excerptAr: article.excerptAr || '',
      excerptEn: article.excerptEn || '',
      contentAr: article.contentAr || '',
      contentEn: article.contentEn || '',
      category: article.category || 'news',
      categoryAr: article.categoryAr || 'أخبار وتقارير',
      categoryEn: article.categoryEn || 'News & Reports',
      coverImage: article.coverImage || '/images/projects/project-1.jpg',
      galleryImages: article.galleryImages || [],
      publishedAt: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      status: (article.status as any) || 'published',
      isPublished: article.status === 'published' || article.isPublished,
      readingTimeMinutes: article.readingTimeMinutes || 4,
      featured: article.featured || false,
      tags: article.tags || ['مشاريع', 'بنية تحتية'],
    });
    setIsModalOpen(true);
  };

  // Save Article (Create or Update)
  const onSubmit = async (data: ArticleFormData) => {
    try {
      const payload: RichArticleItem = {
        id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
        slug: data.slug || `article-${Date.now()}`,
        titleAr: data.titleAr,
        titleEn: data.titleEn || data.titleAr,
        excerptAr: data.excerptAr,
        excerptEn: data.excerptEn,
        contentAr: data.contentAr,
        contentEn: data.contentEn,
        category: data.category,
        categoryAr: data.categoryAr,
        categoryEn: data.categoryEn,
        coverImage: data.coverImage,
        galleryImages: data.galleryImages || [],
        publishedAt: data.publishedAt,
        status: data.status,
        isPublished: data.status === 'published',
        readingTimeMinutes: Number(data.readingTimeMinutes) || 4,
        featured: Boolean(data.featured),
        tags: Array.isArray(data.tags) ? data.tags : ['مشاريع', 'بنية تحتية'],
        author: editingArticle?.author || {
          nameAr: 'الإدارة الفنية والإعلامية',
          nameEn: 'Technical & Media Dept',
          roleAr: 'هضاب الخليج للمقاولات',
          roleEn: 'Gulf Hills Contracting',
          avatar: '/images/avatars/admin-avatar.jpg',
        }
      };

      await adminApi.saveRichArticle(payload);
      await loadArticles();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };

  // 1-Click Toggle Publish
  const handleTogglePublish = async (article: RichArticleItem) => {
    try {
      await adminApi.toggleArticlePublish(article.id);
      await loadArticles();
    } catch (err) {
      console.error('Error toggling publish state:', err);
    }
  };

  // Delete Article
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteRichArticle(deleteTarget.id);
      setDeleteTarget(null);
      await loadArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-[#0070BA] dark:text-sky-400 font-mono text-xs font-bold uppercase">
              {isAr ? "المركز الإعلامي وإدارة المحتوى" : "MEDIA & ARTICLES CMS"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "إدارة الأخبار والمقالات والتقارير الصحفية" : "News & Articles Management"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? "نشر وتعديل الأخبار، إنجازات المشاريع، والبيانات الرسمية مع التحكم الكامل بالصور، التصنيفات، ومحركات البحث."
              : "Publish, update, and manage official news, project milestones, press releases, media assets, and SEO metadata."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/${locale}/news`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isAr ? "معاينة صفحة الأخبار" : "View Live News Page"}</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005a96] dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? "إضافة خبر / مقال جديد" : "Create New Article"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {isAr ? "إجمالي المقالات" : "Total Articles"}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.total}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {isAr ? "الأخبار المنشورة" : "Published Live"}
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.published}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-500/30 dark:border-purple-500/20 bg-purple-500/5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
              {isAr ? "المجدولة أسبوعياً" : "Weekly Scheduled"}
            </span>
            <Clock className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-300 mt-1">
            {stats.scheduled}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {isAr ? "المسودات غير المنشورة" : "Drafts / Pending"}
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {stats.drafts}
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث بالعنوان، الملخص، أو الرابط (Slug)..." : "Search by title, excerpt, or slug..."}
            className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0070BA]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{isAr ? "كافة التصنيفات" : "All Categories"}</option>
            <option value="news">{isAr ? "أخبار وتقارير" : "News & Reports"}</option>
            <option value="project-story">{isAr ? "قصص نجاح المشاريع" : "Project Stories"}</option>
            <option value="announcement">{isAr ? "بيانات رسمية" : "Announcements"}</option>
            <option value="technical-guide">{isAr ? "أدلة هندسية" : "Technical Guides"}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{isAr ? "كافة الحالات" : "All Status"}</option>
            <option value="published">{isAr ? "منشور للجمهور" : "Published"}</option>
            <option value="scheduled">{isAr ? "مجدول أسبوعياً" : "Scheduled"}</option>
            <option value="draft">{isAr ? "مسودة" : "Draft"}</option>
            <option value="archived">{isAr ? "مؤرشف" : "Archived"}</option>
          </select>
        </div>
      </div>

      {/* Articles List / Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold">{isAr ? "جاري تحميل المقالات..." : "Loading articles..."}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Newspaper className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-black text-slate-800 dark:text-white">
              {isAr ? "لم يتم العثور على مقالات مطابقة" : "No Articles Found"}
            </h4>
            <p className="text-xs text-slate-500">
              {isAr ? "يمكنك إضافة مقال جديد أو تعديل معايير البحث والفلترة." : "You can create a new article or reset your filters."}
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#0070BA] text-white text-xs font-bold"
            >
              {isAr ? "إضافة مقال جديد الآن" : "Create Article Now"}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredArticles.map((art) => {
              const isPublished = art.status === 'published' || art.isPublished;

              return (
                <div
                  key={art.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Thumbnail & Title Info */}
                  <div className="flex items-start space-x-3.5 rtl:space-x-reverse min-w-0 flex-1">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 relative">
                      <img
                        src={art.coverImage}
                        alt={art.titleAr}
                        className="w-full h-full object-cover"
                      />
                      {art.featured && (
                        <span className="absolute top-1 start-1 px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[8px]">
                          {isAr ? "مميز" : "Featured"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-[#0070BA] dark:text-sky-400 text-[10px] font-bold">
                          {isAr ? art.categoryAr : art.categoryEn}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{art.publishedAt?.split('T')[0]}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{art.readingTimeMinutes || 4} {isAr ? "د" : "min"}</span>
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        {isAr ? art.titleAr : (art.titleEn || art.titleAr)}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {isAr ? art.excerptAr : (art.excerptEn || art.excerptAr)}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    
                    {/* Status Badge & Toggle Button */}
                    {art.status === 'scheduled' ? (
                      <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                        <span className="font-mono">{isAr ? `مجدول: ${art.publishedAt?.split('T')[0]}` : `Scheduled: ${art.publishedAt?.split('T')[0]}`}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPublished
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                        title={isPublished ? (isAr ? "إلغاء النشر" : "Unpublish") : (isAr ? "نشر المقال" : "Publish")}
                      >
                        {isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isAr ? "منشور" : "Published"}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isAr ? "مسودة" : "Draft"}</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* View on public site */}
                    <Link
                      href={`/${locale}/news/${art.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title={isAr ? "معاينة المقال في الموقع" : "View Live Article"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors cursor-pointer"
                      title={isAr ? "تعديل المقال" : "Edit Article"}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteTarget(art)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title={isAr ? "حذف المقال" : "Delete Article"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CRUD Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? (isAr ? "تعديل المقال الصحفي" : "Edit Article") : (isAr ? "إضافة خبر / مقال جديد" : "Create Article")}
        size="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-start">
          
          {/* Titles in AR & EN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "عنوان المقال بالعربية *" : "Article Title (Arabic) *"}
              </label>
              <input
                {...register('titleAr')}
                type="text"
                placeholder={isAr ? "مثال: هضاب الخليج تبدأ أعمال تطوير شبكة الطرق..." : "Enter Arabic title"}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0070BA]"
              />
              {errors.titleAr && <p className="text-[11px] text-rose-500 mt-1">{errors.titleAr.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "عنوان المقال بالإنجليزية *" : "Article Title (English) *"}
              </label>
              <input
                {...register('titleEn')}
                type="text"
                placeholder="Gulf Hills Launches Road Development Project..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0070BA]"
              />
              {errors.titleEn && <p className="text-[11px] text-rose-500 mt-1">{errors.titleEn.message}</p>}
            </div>
          </div>

          {/* Slug, Category, Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "الرابط الدائم (Slug) *" : "URL Slug *"}
              </label>
              <input
                {...register('slug')}
                type="text"
                placeholder="road-paving-project-2026"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
              {errors.slug && <p className="text-[10px] text-rose-500 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "التصنيف الرئيسي *" : "Category *"}
              </label>
              <select
                {...register('category')}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue('category', val);
                  if (val === 'news') {
                    setValue('categoryAr', 'أخبار وتقارير');
                    setValue('categoryEn', 'News & Reports');
                  } else if (val === 'project-story') {
                    setValue('categoryAr', 'قصص نجاح المشاريع');
                    setValue('categoryEn', 'Project Stories');
                  } else if (val === 'announcement') {
                    setValue('categoryAr', 'بيانات رسمية');
                    setValue('categoryEn', 'Announcements');
                  } else {
                    setValue('categoryAr', 'أدلة هندسية');
                    setValue('categoryEn', 'Technical Guides');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="news">{isAr ? "أخبار وتقارير" : "News & Reports"}</option>
                <option value="project-story">{isAr ? "قصص نجاح المشاريع" : "Project Stories"}</option>
                <option value="announcement">{isAr ? "بيانات رسمية" : "Announcements"}</option>
                <option value="technical-guide">{isAr ? "أدلة هندسية" : "Technical Guides"}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "تاريخ النشر / الموعد المجدول *" : "Publication / Scheduled Date *"}
              </label>
              <input
                {...register('publishedAt')}
                type="date"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "حالة النشر والجدولة *" : "Publishing & Scheduling Status *"}
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="published">{isAr ? "منشور للجمهور فوراً (Live)" : "Published (Live Now)"}</option>
                <option value="scheduled">{isAr ? "مجدول للنشر التلقائي (Scheduled)" : "Scheduled (Visible on Target Date)"}</option>
                <option value="draft">{isAr ? "مسودة غير منشورة (Draft)" : "Draft (Hidden)"}</option>
                <option value="archived">{isAr ? "مؤرشف (Archived)" : "Archived"}</option>
              </select>
            </div>
          </div>

          {/* Cover Image & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? "صورة الغلاف الرئيسية *" : "Cover Image *"}
              </label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="text-xs font-bold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{isAr ? "اختيار من مكتبة الوسائط" : "Media Library"}</span>
              </button>
            </div>

            <MediaDropzone
              value={currentCoverImage}
              onChange={(url) => setValue('coverImage', url)}
            />

            {/* Quick Image Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold self-center me-1">
                {isAr ? "صور نموذجية سريعة:" : "Presets:"}
              </span>
              {ARTICLE_COVER_PRESETS.map((pst, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue('coverImage', pst.url)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {pst.label}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpts in AR & EN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "ملخص الخبر بالعربية (Excerpt) *" : "Arabic Summary *"}
              </label>
              <textarea
                {...register('excerptAr')}
                rows={3}
                placeholder={isAr ? "أدخل ملخصاً موجزاً للخبر يظهر في بطاقات القوائم ومحركات البحث..." : "Short summary..."}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              {errors.excerptAr && <p className="text-[11px] text-rose-500 mt-1">{errors.excerptAr.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "ملخص الخبر بالإنجليزية (Excerpt) *" : "English Summary *"}
              </label>
              <textarea
                {...register('excerptEn')}
                rows={3}
                placeholder="Brief summary for listings and SEO..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              {errors.excerptEn && <p className="text-[11px] text-rose-500 mt-1">{errors.excerptEn.message}</p>}
            </div>
          </div>

          {/* Full Rich Content (HTML or formatted text) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "محتوى المقال الكامل بالعربية *" : "Full Article Content (Arabic) *"}
              </label>
              <textarea
                {...register('contentAr')}
                rows={7}
                placeholder={isAr ? "نص الخبر المفصل، الفقرات، والمواصفات الفنية..." : "Full article body..."}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono leading-relaxed"
              />
              {errors.contentAr && <p className="text-[11px] text-rose-500 mt-1">{errors.contentAr.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isAr ? "محتوى المقال الكامل بالإنجليزية *" : "Full Article Content (English) *"}
              </label>
              <textarea
                {...register('contentEn')}
                rows={7}
                placeholder="Full detailed English article body..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono leading-relaxed"
              />
              {errors.contentEn && <p className="text-[11px] text-rose-500 mt-1">{errors.contentEn.message}</p>}
            </div>
          </div>

          {/* Options: Featured & Reading time */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                {...register('featured')}
                type="checkbox"
                className="w-4 h-4 rounded text-[#0070BA] focus:ring-[#0070BA]"
              />
              <span>{isAr ? "تمييز هذا الخبر كخبر رئيسي في أعلى الصفحة (Featured)" : "Feature this article on top of the news page"}</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{isAr ? "وقت القراءة التقديري:" : "Reading time:"}</span>
              <input
                {...register('readingTimeMinutes', { valueAsNumber: true })}
                type="number"
                min={1}
                max={30}
                className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-500">{isAr ? "دقائق" : "min"}</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005a96] dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-black text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? (isAr ? "جاري الحفظ..." : "Saving...")
                : editingArticle
                ? (isAr ? "حفظ التعديلات" : "Update Article")
                : (isAr ? "نشر المقال الجديد" : "Create Article")}
            </button>
          </div>

        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={isAr ? `حذف المقال: ${deleteTarget?.titleAr}` : `Delete Article: ${deleteTarget?.titleAr}`}
        description={isAr
          ? "هل أنت متأكد من رغبتك في حذف هذا الخبر نهائياً من قاعدة البيانات والمركز الإعلامي؟"
          : "Are you sure you want to permanently delete this news article?"}
      />

      {/* Unified Media Picker Modal */}
      <UnifiedMediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => {
          setValue('coverImage', url);
          setIsMediaPickerOpen(false);
        }}
      />

    </div>
  );
}
