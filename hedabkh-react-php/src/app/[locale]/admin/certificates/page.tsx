import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Award,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Download,
  Building2,
  Globe,
  EyeOff,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { Certificate } from '../../../../types';
import { certificateSchema, CertificateFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';
import { handleImageError } from '../../../../lib/imageFallback';

interface CertificatesAdminProps {
  params: Promise<{ locale: string }>;
}

export default function CertificatesAdminPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: '',
      issuer: 'هيئة المواصفات والمقاييس والجودة',
      issueDate: '2023-01-01',
      expiryDate: '2026-12-31',
      idNumber: 'ISO-9001-2024',
      type: 'iso',
      category: 'iso',
      filePath: '/documents/ISO-9001.pdf',
      isPublished: true,
    },
  });

  const watchedFilePath = watch('filePath');

  const loadCertificates = () => {
    adminApi.getCertificates(locale).then((data) => {
      setCertificates(data || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadCertificates();
  }, [locale]);

  const publishedCount = useMemo(() => certificates.filter((c) => c.isPublished !== false).length, [certificates]);
  const draftCount = useMemo(() => certificates.filter((c) => c.isPublished === false).length, [certificates]);

  const filteredCerts = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return certificates.filter((c) => {
      const title = (c.title || (c as any).titleAr || '').toLowerCase();
      const issuer = (c.issuer || (c as any).issuerAr || '').toLowerCase();
      const idNum = (c.idNumber || (c as any).id_number || '').toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        issuer.includes(q) ||
        idNum.includes(q);

      const matchesType =
        selectedType === 'all' ||
        c.type === selectedType ||
        c.category === selectedType;

      const isItemPublished = c.isPublished !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isItemPublished) ||
        (statusFilter === 'draft' && !isItemPublished);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [certificates, searchQuery, selectedType, statusFilter]);

  const handleTogglePublish = async (cert: Certificate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = cert.isPublished === false;
    setCertificates((prev) =>
      prev.map((c) => (c.id === cert.id ? { ...c, isPublished: newStatus } : c))
    );
    await adminApi.toggleCertificatePublish(cert.id, locale);
  };

  const handleOpenAdd = () => {
    setEditingCert(null);
    reset({
      title: '',
      issuer: 'هيئة الزكاة والضريبة والجمارك',
      issueDate: '2024-01-01',
      expiryDate: '2027-01-01',
      idNumber: 'CR-7023600179',
      type: 'government',
      category: 'official',
      filePath: '/documents/certificate.pdf',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    reset({
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      idNumber: cert.idNumber,
      type: cert.type,
      category: cert.category || 'official',
      filePath: cert.filePath || '',
      isPublished: cert.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CertificateFormData) => {
    const certToSave: Certificate = {
      id: editingCert ? editingCert.id : `cert-${Date.now()}`,
      title: data.title,
      issuer: data.issuer,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate,
      idNumber: data.idNumber,
      type: data.type,
      category: data.category,
      filePath: data.filePath,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };

    await adminApi.saveCertificate(certToSave, locale);
    loadCertificates();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await adminApi.deleteCertificate(deleteTarget.id);
      loadCertificates();
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <span>{isAr ? 'إدارة الشهادات والاعتمادات الرسمية' : 'Certificates & Accreditations Manager'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'متابعة شهادات الآيزو (ISO)، تصنيف المقاولين، السجلات، وتواريخ الصلاحية'
              : 'Manage ISO, municipal classification, tax compliance & expiry tracking'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-[#002060] text-white text-xs font-black hover:shadow-lg shadow-amber-950/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة وثيقة / شهادة' : 'Add Certificate'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            className={`w-4 h-4 text-slate-400 absolute top-3 ${
              isAr ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr ? 'ابحث باسم الشهادة أو الجهة المصدرة أو الرقم...' : 'Search certificates...'
            }
            className={`w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'
            }`}
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
            {isAr ? 'الكل' : 'All'} ({certificates.length})
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

        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: 'all', label: isAr ? 'جميع الأنواع' : 'All Types' },
            { key: 'iso', label: isAr ? 'شهادات ISO' : 'ISO' },
            { key: 'official', label: isAr ? 'وثائق حكومية' : 'Government' },
            { key: 'classification', label: isAr ? 'التصنيف' : 'Classification' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start">{isAr ? 'الشهادة / الوثيقة' : 'Certificate'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'الجهة المصدرة' : 'Issuer'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'رقم الوثيقة' : 'Doc ID'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'حالة النشر' : 'Publish Status'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</th>
                <th className="py-3.5 px-4 text-start">{isAr ? 'النوع' : 'Type'}</th>
                <th className="py-3.5 px-4 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCerts.map((cert) => (
                <tr
                  key={cert.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                    cert.isPublished === false ? 'opacity-70 bg-amber-50/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {cert.title || (cert as any).titleAr || (isAr ? 'شهادة معتمدة' : 'Official Certificate')}
                        </span>
                        {(cert.filePath || (cert as any).file_path) && (
                          <a
                            href={cert.filePath || (cert as any).file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-sky-500 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{isAr ? 'استعراض الـ PDF' : 'View Document'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {cert.issuer || (cert as any).issuerAr || (isAr ? 'جهة الاعتماد الرسمية' : 'Accrediting Body')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                    {cert.idNumber || (cert as any).id_number || '---'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePublish(cert, e)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        cert.isPublished !== false
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}
                      title={cert.isPublished !== false ? (isAr ? 'انقر لإخفاء الشهادة' : 'Click to unpublish') : (isAr ? 'انقر لنشر الشهادة' : 'Click to publish')}
                    >
                      {cert.isPublished !== false ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{isAr ? 'منشور' : 'Published'}</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>{isAr ? 'مسودة' : 'Draft'}</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {cert.issueDate || (cert as any).issue_date || '---'}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      {cert.expiryDate || (cert as any).expiry_date || 'سارية'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        (cert.type === 'iso' || cert.category === 'iso')
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                          : 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {cert.type || cert.category || 'OFFICIAL'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cert)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cert)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Certificates Cards (Phone Views < sm) */}
      <div className="block sm:hidden space-y-3">
        {filteredCerts.map((cert) => (
          <div
            key={`mob-${cert.id}`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {cert.title || (cert as any).titleAr || (isAr ? 'شهادة معتمدة' : 'Official Certificate')}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {cert.issuer || (cert as any).issuerAr || '---'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                {cert.type || cert.category || 'OFFICIAL'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-[11px] grid grid-cols-2 gap-2 font-mono">
              <div>
                <span className="text-slate-400 text-[9px] block">{isAr ? 'رقم الوثيقة' : 'Doc ID'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{cert.idNumber || (cert as any).id_number || '---'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block">{isAr ? 'تاريخ الانتهاء' : 'Expiry'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{cert.expiryDate || (cert as any).expiry_date || 'سارية'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
              {(cert.filePath || (cert as any).file_path) ? (
                <a
                  href={cert.filePath || (cert as any).file_path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استعراض PDF' : 'View PDF'}</span>
                </a>
              ) : <div />}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cert)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCert
            ? isAr ? 'تعديل بيانات الشهادة' : 'Edit Certificate'
            : isAr ? 'إضافة وثيقة أو شهادة جديدة' : 'Add New Certificate'
        }
        subtitle={isAr ? 'تحديث بيانات الاعتمادات الرسمية وملفات الـ PDF' : 'Official regulatory accreditations'}
        maxWidth="6xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'عنوان الشهادة / الوثيقة' : 'Certificate Title'} *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="شهادة نظام إدارة الجودة ISO 9001:2015"
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {errors.title && (
              <p className="text-[11px] font-semibold text-rose-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'الجهة المصدرة' : 'Issuing Authority'} *
              </label>
              <input
                type="text"
                {...register('issuer')}
                placeholder="هيئة المواصفات والمقاييس"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'رقم الوثيقة / الاعتماد' : 'Document ID Number'} *
              </label>
              <input
                type="text"
                {...register('idNumber')}
                placeholder="ISO-9001-KSA-2024"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'تاريخ الإصدار' : 'Issue Date'} *
              </label>
              <input
                type="text"
                {...register('issueDate')}
                placeholder="2024-01-15"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'تاريخ الانتهاء' : 'Expiry Date'} *
              </label>
              <input
                type="text"
                {...register('expiryDate')}
                placeholder="2027-01-14"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'النوع الرئيسي' : 'Type'}
              </label>
              <select
                {...register('type')}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="iso">ISO Accreditation</option>
                <option value="government">Government & Regulatory</option>
              </select>
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'التصنيف الفرعي' : 'Category Group'}
              </label>
              <select
                {...register('category')}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="official">Official Documents</option>
                <option value="classification">Classification & Tenders</option>
                <option value="iso">ISO Accreditations</option>
                <option value="identity">Corporate Identity</option>
              </select>
            </div>
          </div>

          {/* Direct PDF / Document Upload Dropzone */}
          <MediaDropzone
            value={watchedFilePath}
            onChange={(val) => setValue('filePath', val)}
            accept="pdf"
            label={isAr ? 'ملف وثيقة الاعتماد الرسمية (PDF)' : 'Official Accreditation Document (PDF)'}
            isAr={isAr}
            presets={[
              { label: 'شهادة الآيزو ISO 9001', url: '/documents/ISO-9001.pdf' },
              { label: 'شهادة الآيزو ISO 14001', url: '/documents/ISO-14001.pdf' },
              { label: 'شهادة الآيزو ISO 45001', url: '/documents/ISO-45001.pdf' },
            ]}
          />

          {/* Publishing & Visibility Box */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between">
            <div className="space-y-0.5 text-start">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isAr ? 'حالة النشر والظهور على الموقع' : 'Publication Status'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'عند تفعيل الخيار تظهر الشهادة في صفحة الشهادات والاعتمادات الرسمية وملف التأهيل'
                  : 'When enabled, this certificate is visible on the public accreditations page'}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-[#002060] text-white text-xs font-black hover:shadow-lg transition-all cursor-pointer"
            >
              {isAr ? 'حفظ الشهادة' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف الشهادة' : 'Delete Certificate'}
        message={
          isAr
            ? `هل أنت متأكد من رغبتك في حذف وثيقة "${deleteTarget?.title}"؟`
            : `Are you sure you want to delete "${deleteTarget?.title}"?`
        }
      />
    </div>
  );
}
