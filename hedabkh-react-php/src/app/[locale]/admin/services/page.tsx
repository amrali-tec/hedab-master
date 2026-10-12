import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Shield,
  Grid,
  Waves,
  Route,
  HardHat,
  X,
  Globe,
  EyeOff,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { Service } from '../../../../types';
import { serviceSchema, ServiceFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';

interface ServicesAdminProps {
  params: Promise<{ locale: string }>;
}

export default function ServicesAdminPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [sectorsList, setSectorsList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newSectorInput, setNewSectorInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: 'barrier-icon',
      features: ['تنفيذ الأعمال وفق أعلى معايير الجودة والمواصفات'],
      sectors: ['البنية التحتية', 'المشاريع الحكومية'],
    },
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadServices = () => {
    adminApi.getServices(locale).then((data) => {
      setServices(data || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadServices();
  }, [locale]);

  const publishedCount = services.filter((s) => s.isPublished !== false).length;
  const draftCount = services.filter((s) => s.isPublished === false).length;

  const filteredServices = services.filter((s) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    const isItemPublished = s.isPublished !== false;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && isItemPublished) ||
      (statusFilter === 'draft' && !isItemPublished);
    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = async (service: Service, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = service.isPublished === false;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isPublished: newStatus } : s))
    );
    await adminApi.toggleServicePublish(service.id, locale);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFeaturesList(['توريد وتركيب وفق المخططات الهندسية']);
    setSectorsList(['البنية التحتية']);
    reset({
      title: '',
      description: '',
      icon: 'barrier-icon',
      features: ['توريد وتركيب وفق المخططات الهندسية'],
      sectors: ['البنية التحتية'],
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFeaturesList(service.features || []);
    setSectorsList(service.sectors || []);
    reset({
      id: service.id,
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features,
      sectors: service.sectors,
      isPublished: service.isPublished !== false,
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

  const handleAddSector = () => {
    if (newSectorInput.trim()) {
      const updated = [...sectorsList, newSectorInput.trim()];
      setSectorsList(updated);
      setValue('sectors', updated);
      setNewSectorInput('');
    }
  };

  const handleRemoveSector = (index: number) => {
    const updated = sectorsList.filter((_, i) => i !== index);
    setSectorsList(updated);
    setValue('sectors', updated);
  };

  const onSubmit = async (data: ServiceFormData) => {
    const serviceToSave: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      title: data.title,
      description: data.description,
      icon: data.icon,
      features: featuresList.length > 0 ? featuresList : data.features,
      sectors: sectorsList.length > 0 ? sectorsList : data.sectors,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };

    await adminApi.saveService(serviceToSave, locale);
    loadServices();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await adminApi.deleteService(deleteTarget.id);
      loadServices();
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-purple-500" />
            <span>{isAr ? 'إدارة الخدمات والأعمال الهندسية' : 'Engineering Services Manager'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'تعديل مجالات التخصص، مخرجات الأعمال، والتحكم في نشر الخدمات'
              : 'Add, update or modify core engineering divisions, deliverables and publication status'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#002060] text-white text-xs font-black hover:shadow-lg shadow-purple-950/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة خدمة جديدة' : 'Add Service'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في الخدمات الهندسية...' : 'Search services...'}
            className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({services.length})
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
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 ${
              service.isPublished !== false
                ? 'border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40'
                : 'border-dashed border-amber-400/60 dark:border-amber-500/40 bg-amber-50/10'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <HardHat className="w-6 h-6" />
                  </div>
                  
                  {/* Status Toggle Pill */}
                  <button
                    type="button"
                    onClick={(e) => handleTogglePublish(service, e)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      service.isPublished !== false
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                    }`}
                    title={service.isPublished !== false ? (isAr ? 'انقر للتحويل لمسودة وإخفائها' : 'Click to unpublish') : (isAr ? 'انقر للنشر على الموقع' : 'Click to publish')}
                  >
                    {service.isPublished !== false ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{isAr ? 'منشورة' : 'Published'}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>{isAr ? 'مسودة' : 'Draft'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(service)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Deliverables / Features */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {isAr ? 'المخرجات والميزات:' : 'Deliverables:'}
                </span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {(service.features || []).slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sectors Tags */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
              {(service.sectors || []).map((sec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingService
            ? isAr ? 'تعديل بيانات الخدمة الهندسية' : 'Edit Service'
            : isAr ? 'إضافة مجال خدمة هندسية جديد' : 'Add New Service'
        }
        subtitle={isAr ? 'توثيق مواصفات ونطاق الخدمة الهندسية والمخرجات الميدانية' : 'Main engineering service fields & capabilities'}
        maxWidth="7xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'اسم الخدمة' : 'Service Title'} *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="أعمال الحواجز الخرسانية المسبقة الصب (نيوجيرسي)"
              className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            {errors.title && (
              <p className="text-[11px] font-semibold text-rose-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'الوصف والنطاق الفني' : 'Technical Scope'} *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="وصف شامل لنطاق العمل والمعدات المستخدمة..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>

          {/* Features Tagging */}
          <div className="space-y-2 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'المخرجات والميزات الرئيسية' : 'Deliverables & Capabilities'}
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
                placeholder="أضف مخرجاً واضغط إضافة..."
                className="flex-1 h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-purple-600 hover:text-white transition-colors"
              >
                {isAr ? 'إضافة' : 'Add'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {featuresList.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-medium"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sectors Tagging */}
          <div className="space-y-2 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'القطاعات المستهدفة' : 'Target Sectors'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSectorInput}
                onChange={(e) => setNewSectorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSector();
                  }
                }}
                placeholder="أضف قطاعاً (مثل: الطرق السريعة، المطارات)..."
                className="flex-1 h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={handleAddSector}
                className="px-4 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-purple-600 hover:text-white transition-colors"
              >
                {isAr ? 'إضافة' : 'Add'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {sectorsList.map((sec, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                >
                  <span>{sec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSector(idx)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Publishing & Visibility Box */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between">
            <div className="space-y-0.5 text-start">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isAr ? 'حالة النشر والظهور على الموقع' : 'Publication Status'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'عند تفعيل الخيار تظهر الخدمة مباشرة في القوائم وصفحات الخدمات ونماذج التسعير'
                  : 'When enabled, this service is visible across all service pages & quote forms'}
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#002060] text-white text-xs font-black hover:shadow-lg transition-all cursor-pointer"
            >
              {isAr ? 'حفظ الخدمة' : 'Save Service'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف الخدمة' : 'Delete Service'}
        message={
          isAr
            ? `هل أنت متأكد من رغبتك في حذف خدمة "${deleteTarget?.title}"؟`
            : `Are you sure you want to delete "${deleteTarget?.title}"?`
        }
      />
    </div>
  );
}
