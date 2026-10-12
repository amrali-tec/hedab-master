"use client";

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import AdminModal from './AdminModal';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center flex-shrink-0 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {message || 'هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-900/20 flex items-center gap-2"
          >
            {isDeleting ? (
              <span>جاري الحذف...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>تأكيد الحذف</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
