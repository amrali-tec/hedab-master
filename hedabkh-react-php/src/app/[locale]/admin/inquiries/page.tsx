import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  MessageSquare,
  Send,
  User,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { Inquiry } from '../../../../types';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';

interface InquiriesAdminProps {
  params: Promise<{ locale: string }>;
}

export default function InquiriesAdminPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Inspect Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState<Inquiry['status']>('new');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  const loadInquiries = () => {
    adminApi.getInquiries().then((items) => {
      setInquiries(items || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return inquiries.filter((inq) => {
      const name = (inq.name || '').toLowerCase();
      const phone = (inq.phone || '').toLowerCase();
      const email = (inq.email || '').toLowerCase();
      const message = (inq.message || '').toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        message.includes(q);

      const matchesStatus =
        statusFilter === 'all' || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const handleOpenInspect = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNotesInput(inq.notes || '');
    setStatusInput(inq.status);
  };

  const handleSaveInspect = async () => {
    if (selectedInquiry) {
      await adminApi.updateInquiryStatus(
        selectedInquiry.id,
        statusInput
      );
      loadInquiries();
      setSelectedInquiry(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await adminApi.deleteInquiry(deleteTarget.id);
      loadInquiries();
      setDeleteTarget(null);
    }
  };

  const handleExportCsv = () => {
    if (inquiries.length === 0) return;

    // Build CSV with BOM for perfect Arabic rendering in Excel
    const headers = isAr
      ? ['المعرف', 'اسم العميل', 'البريد الإلكتروني', 'رقم الهاتف', 'الرسالة', 'الحالة', 'ملاحظات الإدارة', 'تاريخ الطلب']
      : ['ID', 'Client Name', 'Email', 'Phone', 'Message', 'Status', 'Admin Notes', 'Date'];

    const rows = inquiries.map((inq) => [
      `"${inq.id}"`,
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      `"${inq.status}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`,
      `"${inq.createdAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gulf_hills_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-emerald-500" />
            <span>{isAr ? 'صندوق طلبات التواصل وعروض الأسعار' : 'Inquiries & RFP Leads'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'متابعة رسائل العملاء، طلبات الحواجز الخرسانية، وعقود السفلتة والإنترلوك'
              : 'Track incoming inquiries, procurement requests, and client communications'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={inquiries.length === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>{isAr ? 'تصدير إلى Excel (CSV)' : 'Export to CSV'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              {inquiries.filter((i) => i.status === 'new').length} {isAr ? 'رسائل جديدة' : 'New Leads'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
              isAr ? 'ابحث بالاسم، الجوال، البريد، أو نص الرسالة...' : 'Search leads...'
            }
            className={`w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'
            }`}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: 'all', label: isAr ? 'الكل' : 'All' },
            { key: 'new', label: isAr ? 'جديدة' : 'New' },
            { key: 'in-progress', label: isAr ? 'قيد المتابعة' : 'In Progress' },
            { key: 'resolved', label: isAr ? 'مكتملة' : 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Sender Details & Message snippet */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {inq.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      inq.status === 'new'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                        : inq.status === 'in-progress'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                    }`}
                  >
                    {inq.status === 'new'
                      ? isAr ? 'رسالة جديدة' : 'New'
                      : inq.status === 'in-progress'
                      ? isAr ? 'قيد المتابعة' : 'In Progress'
                      : isAr ? 'تمت المعالجة' : 'Resolved'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {inq.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <a
                    href={`tel:${inq.phone}`}
                    className="hover:text-emerald-500 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{inq.phone}</span>
                  </a>
                  <a
                    href={`mailto:${inq.email}`}
                    className="hover:text-sky-500 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{inq.email}</span>
                  </a>
                  {inq.notes && (
                    <span className="text-[11px] font-sans text-amber-600 dark:text-amber-400 italic">
                      ملاحظة: {inq.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                <button
                  onClick={() => handleOpenInspect(inq)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAr ? 'فحص ومتابعة' : 'Inspect'}</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(inq)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Modal */}
      <AdminModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title={isAr ? 'تفاصيل ومتابعة الطلب' : 'Inquiry Details & Follow-up'}
        subtitle={selectedInquiry ? `طلب مرسل من: ${selectedInquiry.name}` : ''}
        maxWidth="2xl"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            {/* Sender Metadata Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedInquiry.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {new Date(selectedInquiry.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>إيميل</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>الجوال: <span className="text-slate-900 dark:text-white font-bold">{selectedInquiry.phone}</span></div>
                <div>البريد: <span className="text-slate-900 dark:text-white font-bold">{selectedInquiry.email}</span></div>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                نص الرسالة والطلب:
              </label>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                حالة الطلب الحالية:
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as Inquiry['status'])}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="new">رسالة جديدة (New Lead)</option>
                <option value="in-progress">قيد المتابعة والتسعير (In Progress)</option>
                <option value="resolved">تمت المعالجة والرد بنجاح (Resolved)</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                الملاحظات الداخلية للإدارة وفريق المبيعات:
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="أدخل ملاحظات حول ما تم مع العميل (مثال: تم إرسال عرض السعر أو تحديد موعد المعاينة)..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveInspect}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-all cursor-pointer shadow-md shadow-emerald-950/20"
              >
                حفظ التحديثات
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف طلب التواصل' : 'Delete Inquiry'}
        message={
          isAr
            ? `هل أنت متأكد من حذف رسالة العميل "${deleteTarget?.name}"؟`
            : `Are you sure you want to delete inquiry from "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
