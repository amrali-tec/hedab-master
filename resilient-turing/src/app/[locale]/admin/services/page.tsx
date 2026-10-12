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
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { Service } from '../../../../types';
import { serviceSchema, ServiceFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';

interface ServicesAdminProps {
  params: Promise<{ locale: string }>;
}

export default function ServicesAdminPage({ params }: ServicesAdminProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  // Dynamic tags
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [sectorsList, setSectorsList] = useState<string[]>([]);
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

  const loadServices = () => {
    setServices(storageAdapter.getServices(locale));
  };

  useEffect(() => {
    loadServices();
  }, [locale]);

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

  const onSubmit = (data: ServiceFormData) => {
    const serviceToSave: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      title: data.title,
      description: data.description,
      icon: data.icon,
      features: featuresList.length > 0 ? featuresList : data.features,
      sectors: sectorsList.length > 0 ? sectorsList : data.sectors,
    };

    storageAdapter.saveService(serviceToSave, locale);
    loadServices();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      storageAdapter.deleteService(deleteTarget.id);
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
              ? 'تعديل مجالات التخصص، مخرجات الأعمال، والقطاعات المستهدفة'
              : 'Add, update or modify core engineering divisions, deliverables and sector tags'}
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

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <HardHat className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(service)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
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
                  {service.features.slice(0, 3).map((feat, i) => (
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
              {service.sectors.map((sec, i) => (
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
