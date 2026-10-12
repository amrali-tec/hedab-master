import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  CheckCircle2,
  Layers,
  X,
  Globe,
  EyeOff,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { Project } from '../../../../types';
import { projectSchema, ProjectFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';
import UnifiedMediaPickerModal from '../../../../components/admin/common/UnifiedMediaPickerModal';
import { handleImageError } from '../../../../lib/imageFallback';

interface ProjectsAdminProps {
  params: Promise<{ locale: string }>;
}

const PROJECT_IMAGE_PRESETS = [
  {
    label: 'سفلتة وكشط الطرق',
    url: '/images/before-after/road-paving-after.jpg',
  },
  {
    label: 'تصريف السيول وشبكات الأمطار',
    url: '/images/services/stormwater-drainage.jpg',
  },
  {
    label: 'حواجز نيوجيرسي الخرسانية',
    url: '/images/services/precast-barriers.jpg',
  },
  {
    label: 'تشغيل وصيانة المقابر والمرافق',
    url: '/images/services/cemetery-maintenance.jpg',
  },
];

const SITE_PREP_PRESETS = [
  {
    label: 'تأسيس شبكات التصريف الميداني',
    url: '/images/projects/stormwater-network.jpg',
  },
  {
    label: 'أعمال الحفر والردم الهندسي',
    url: '/images/projects/road-rehab.jpg',
  },
];

const EXECUTION_PHASE_PRESETS = [
  {
    label: 'صب وتركيب القنوات الخرسانية',
    url: '/images/projects/box-culvert-installation.jpg',
  },
  {
    label: 'كشط وفرد طبقات الأسفلت الساخن',
    url: '/images/projects/asphalt-milling-paving.jpg',
  },
];

const FINAL_HANDOVER_PRESETS = [
  {
    label: 'تسليم المحور الشرقي مكتمل ومعتمد',
    url: '/images/projects/eastern-ring-handover.jpg',
  },
  {
    label: 'شبكة السيول مكتملة بعد الاختبارات الهيدروليكية',
    url: '/images/projects/stormwater-culvert-handover.jpg',
  },
];

export default function ProjectsAdminPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    'main' | 'sitePrep' | 'execution' | 'finalHandover' | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'إصلاح وصيانة الطرق والشبكات الأرضية',
      image: PROJECT_IMAGE_PRESETS[0].url,
      sitePrepImage: SITE_PREP_PRESETS[0].url,
      executionPhaseImage: EXECUTION_PHASE_PRESETS[0].url,
      finalHandoverImage: FINAL_HANDOVER_PRESETS[0].url,
      completionDate: '2026-12-31',
      location: 'الرياض، السعودية',
      client: 'أمانة منطقة الرياض',
      progress: 60,
      features: ['تنفيذ الأعمال وفق أعلى معايير الجودة والمواصفات الفنية المعتمدة'],
    },
  });

  const progressVal = watch('progress', 50);
  const watchedImage = watch('image');
  const watchedSitePrep = watch('sitePrepImage');
  const watchedExecution = watch('executionPhaseImage');
  const watchedFinalHandover = watch('finalHandoverImage');

  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const loadProjects = () => {
    adminApi.getProjects(locale).then((data) => {
      setProjects(data || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadProjects();
  }, [locale]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category || (p as any).categoryAr).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [projects]);

  // Status counts
  const publishedCount = useMemo(() => projects.filter((p) => p.isPublished !== false).length, [projects]);
  const draftCount = useMemo(() => projects.filter((p) => p.isPublished === false).length, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return projects.filter((p) => {
      const title = (p.title || (p as any).titleAr || '').toLowerCase();
      const client = (p.client || (p as any).clientAr || '').toLowerCase();
      const location = (p.location || (p as any).locationAr || '').toLowerCase();
      const category = (p.category || (p as any).categoryAr || '').toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        client.includes(q) ||
        location.includes(q) ||
        category.includes(q);
      const matchesCategory =
        selectedCategory === 'all' || (p.category || (p as any).categoryAr) === selectedCategory;

      const isItemPublished = p.isPublished !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isItemPublished) ||
        (statusFilter === 'draft' && !isItemPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, statusFilter]);

  const handleTogglePublish = async (project: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = project.isPublished === false;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, isPublished: newStatus } : p))
    );
    await adminApi.toggleProjectPublish(project.id, locale);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFeaturesList(['تنفيذ الأعمال وفق أعلى معايير الجودة والمواصفات الفنية المعتمدة']);
    reset({
      title: '',
      description: '',
      category: 'إصلاح وصيانة الطرق والشبكات الأرضية',
      image: PROJECT_IMAGE_PRESETS[0].url,
      sitePrepImage: SITE_PREP_PRESETS[0].url,
      executionPhaseImage: EXECUTION_PHASE_PRESETS[0].url,
      finalHandoverImage: FINAL_HANDOVER_PRESETS[0].url,
      completionDate: '2026-12-31',
      location: 'الرياض، السعودية',
      client: 'أمانة منطقة الرياض',
      progress: 60,
      features: ['تنفيذ الأعمال وفق أعلى معايير الجودة والمواصفات الفنية المعتمدة'],
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFeaturesList(project.features || []);
    reset({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image,
      sitePrepImage: project.sitePrepImage || '',
      executionPhaseImage: project.executionPhaseImage || '',
      finalHandoverImage: project.finalHandoverImage || '',
      completionDate: project.completionDate,
      location: project.location,
      client: project.client,
      progress: project.progress || 0,
      features: project.features || [],
      isPublished: project.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      const updated = [...featuresList, newFeatureInput.trim()];
      setFeaturesList(updated);
      setValue('features', updated);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updated = featuresList.filter((_, i) => i !== index);
    setFeaturesList(updated);
    setValue('features', updated);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const projectToSave: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image,
      sitePrepImage: data.sitePrepImage || '',
      executionPhaseImage: data.executionPhaseImage || '',
      finalHandoverImage: data.finalHandoverImage || '',
      completionDate: data.completionDate,
      location: data.location,
      client: data.client,
      progress: data.progress,
      features: featuresList.length > 0 ? featuresList : data.features,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };

    await adminApi.saveProject(projectToSave, locale);
    loadProjects();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await adminApi.deleteProject(deleteTarget.id);
      loadProjects();
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span>{isAr ? 'إدارة المشاريع والمراحل الميدانية' : 'Engineering Projects Manager'}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'إضافة وتعديل بيانات المشاريع، نسب الإنجاز، صور التأسيس والتسليم النهائي'
              : 'Add, update or remove projects, execution progress, site prep, and handover photos'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-lg shadow-sky-950/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة مشروع جديد' : 'Add Project'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالعنوان، العميل، الموقع...' : 'Search projects...'}
            className="w-full h-11 pl-9 pr-4 rtl:pl-4 rtl:pr-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-xs"
          />
        </div>

        {/* Status Filter Tabs (الكل / المنشورة / المسودات) */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>{isAr ? 'المنشورة' : 'Published'} ({publishedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            <span>{isAr ? 'المسودات' : 'Drafts'} ({draftCount})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? (isAr ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`group rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
              project.isPublished !== false
                ? 'border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40'
                : 'border-dashed border-amber-400/60 dark:border-amber-500/40 bg-amber-50/10'
            }`}
          >
            {/* Image Header */}
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Publishing Status Toggle Pill in top-left */}
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                <button
                  type="button"
                  onClick={(e) => handleTogglePublish(project, e)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    project.isPublished !== false
                      ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border border-emerald-400/40'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/40'
                  }`}
                  title={project.isPublished !== false ? (isAr ? 'انقر لإخفاء المشروع وتحويله لمسودة' : 'Click to unpublish') : (isAr ? 'انقر لنشر المشروع على الموقع' : 'Click to publish')}
                >
                  {project.isPublished !== false ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>{isAr ? 'منشور' : 'Published'}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>{isAr ? 'مسودة' : 'Draft'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex gap-1">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-sky-600 backdrop-blur-md shadow-sm transition-colors cursor-pointer"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-600 backdrop-blur-md shadow-sm transition-colors cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Badges for Stage Photos */}
              <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-1.5">
                {project.sitePrepImage && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    {isAr ? 'تأسيس' : 'Prep'}
                  </span>
                )}
                {project.finalHandoverImage && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    {isAr ? 'تسليم نهائي' : 'Handover'}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500 text-white uppercase shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{isAr ? 'نسبة الإنجاز:' : 'Progress:'}</span>
                  <span className="text-sky-600 font-mono">{project.progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-[#002060] rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.client}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'لا توجد مشاريع مطابقة للبحث' : 'No projects found'}
          </h4>
          <p className="text-xs text-slate-500">
            {isAr ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً' : 'Try searching with different keywords'}
          </p>
        </div>
      )}

      {/* Full-Page Sized Add / Edit Project Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingProject
            ? isAr ? 'تعديل بيانات ومراحل المشروع الميدانية' : 'Edit Project & Execution Stages'
            : isAr ? 'إضافة مشروع جديد وتوثيق مراحل التنفيذ' : 'Add New Project & Document Stages'
        }
        subtitle={
          isAr
            ? 'توثيق البيانات الهندسية وصور التأسيس ومرحلة التنفيذ والتسليم الميداني النهائي'
            : 'Enter engineering specifications and upload site preparation, execution, and final handover photos'
        }
        maxWidth="7xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Basic Details & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Title */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'عنوان المشروع الرسمي' : 'Official Project Title'} *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="مثال: تنفيذ أعمال كشط وسفلتة وتصريف السيول - طريق الملك فهد"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {errors.title && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الوصف الهندسي ونطاق الأعمال الميدانية' : 'Engineering Scope & Specifications'} *
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="وصف تفصيلي للأعمال والمواصفات الفنية المعتمدة ومراحل التنفيذ..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none leading-relaxed"
                />
                {errors.description && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.description.message}</p>
                )}
              </div>

              {/* Row: Category, Client, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'القطاع والتصنيف' : 'Category'} *
                  </label>
                  <input
                    type="text"
                    {...register('category')}
                    placeholder="سفلتة وطرق / بنية تحتية"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium"
                  />
                  {errors.category && (
                    <p className="text-[11px] font-semibold text-rose-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'الجهة المالكة / العميل' : 'Client / Owner'} *
                  </label>
                  <input
                    type="text"
                    {...register('client')}
                    placeholder="أمانة منطقة الرياض"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'الموقع الجغرافي' : 'Location'} *
                  </label>
                  <input
                    type="text"
                    {...register('location')}
                    placeholder="الرياض، السعودية"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>
              </div>

              {/* Row: Completion Date & Progress Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'تاريخ الإنجاز والتسليم' : 'Completion Date'} *
                  </label>
                  <input
                    type="text"
                    {...register('completionDate')}
                    placeholder="2026-12-31"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
                  />
                </div>

                {/* Progress Slider */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {isAr ? 'نسبة الإنجاز الميداني:' : 'Progress:'}
                    </span>
                    <span className="text-sky-600 dark:text-sky-400 font-mono text-sm font-black">
                      {progressVal}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    {...register('progress', { valueAsNumber: true })}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Publishing & Visibility Box */}
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr ? 'حالة النشر والظهور على الموقع' : 'Publication Status'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr
                      ? 'عند تفعيل الخيار يظهر المشروع مباشرة للزوار والشركاء وفي محركات البحث'
                      : 'When enabled, this project is publicly visible to all website visitors'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Features Tagging */}
              <div className="space-y-2 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'المخرجات الفنية والمواصفات القياسية' : 'Key Deliverables & Specifications'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="أضف مخرجاً هندسياً (مثل: تركيب حواجز خرسانية بطول 2500 م)..."
                    className="flex-1 h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {isAr ? 'إضافة' : 'Add'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {featuresList.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-xs font-medium"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Project Lifecycle & Stage Media (5 cols) */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50/50 dark:bg-slate-950/40 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-sky-500" />
                  <span>{isAr ? 'صور وتوثيق مراحل المشروع الميدانية' : 'Project Lifecycle Media'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAr ? 'رفع مباشر من جهازك لتوثيق البداية والتنفيذ والتسليم النهائي' : 'Direct upload for site prep, execution, and final handover'}
                </p>
              </div>

              {/* 1. Main Cover Image */}
              <MediaDropzone
                value={watchedImage}
                onChange={(val) => setValue('image', val)}
                accept="image"
                label={isAr ? '1. صورة غلاف المشروع الرئيسية (Cover Photo)' : '1. Main Project Cover Photo'}
                isAr={isAr}
                presets={PROJECT_IMAGE_PRESETS}
              />
              {errors.image && (
                <p className="text-[11px] font-semibold text-rose-500 text-start">{errors.image.message}</p>
              )}

              {/* 2. Site Preparation & Foundation Image */}
              <MediaDropzone
                value={watchedSitePrep}
                onChange={(val) => setValue('sitePrepImage', val)}
                accept="image"
                label={isAr ? '2. صورة مرحلة تمهيد وتأسيس الموقع (Site Preparation)' : '2. Site Preparation & Groundwork Photo'}
                isAr={isAr}
                presets={SITE_PREP_PRESETS}
                helperText={isAr ? 'توثيق أعمال الحفر، التسوية، وإعداد التربة والشبكات التحتية' : 'Earthworks and foundation preparation stage'}
              />

              {/* 3. Construction & Execution Phase Image */}
              <MediaDropzone
                value={watchedExecution}
                onChange={(val) => setValue('executionPhaseImage', val)}
                accept="image"
                label={isAr ? '3. صورة مرحلة التنفيذ والتشييد الميداني (Construction Phase)' : '3. Construction & Execution Phase Photo'}
                isAr={isAr}
                presets={EXECUTION_PHASE_PRESETS}
                helperText={isAr ? 'توثيق أعمال صب الخرسانة، مد الأسفلت، وتركيب المعدات' : 'Construction and asphalting in progress'}
              />

              {/* 4. Final Handover & Completion Image */}
              <MediaDropzone
                value={watchedFinalHandover}
                onChange={(val) => setValue('finalHandoverImage', val)}
                accept="image"
                label={isAr ? '4. صورة التسليم الميداني النهائي (Final Handover)' : '4. Final Handover & Completed Project Photo'}
                isAr={isAr}
                presets={FINAL_HANDOVER_PRESETS}
                helperText={isAr ? 'المظهر النهائي بعد اكتمال المشروع والجاهزية التامة للاستخدام' : 'Completed project and final handover'}
              />

            </div>

          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-lg shadow-sky-900/20 active:scale-95 transition-all cursor-pointer"
            >
              {editingProject
                ? isAr ? 'حفظ وتحديث بيانات ومراحل المشروع' : 'Update Project'
                : isAr ? 'حفظ وإضافة المشروع' : 'Save Project'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف المشروع' : 'Delete Project'}
        message={
          isAr
            ? `هل أنت متأكد من رغبتك في حذف مشروع "${deleteTarget?.title}" نهائياً من النظام؟`
            : `Are you sure you want to permanently delete "${deleteTarget?.title}"?`
        }
      />
    </div>
  );
}
