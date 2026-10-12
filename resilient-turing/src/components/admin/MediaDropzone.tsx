"use client";

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface MediaDropzoneProps {
  value?: string;
  onChange: (value: string) => void;
  accept?: 'image' | 'pdf' | 'all';
  label?: string;
  helperText?: string;
  isAr?: boolean;
  presets?: { label: string; url: string }[];
  maxSizeMB?: number;
}

/**
 * Modern Zero-Code Media & File Upload Dropzone
 * Allows users to upload images and PDFs directly from their local computer/device
 * with automatic optimization, instant preview, and zero coding required.
 */
export default function MediaDropzone({
  value = '',
  onChange,
  accept = 'image',
  label,
  helperText,
  isAr = true,
  presets = [],
  maxSizeMB = 10,
}: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = value?.startsWith('data:application/pdf') || value?.toLowerCase().endsWith('.pdf');
  const isImage = value && !isPdf;

  // Compress and convert image to WebP/JPEG Base64 Data URL
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('فشل معالجة الصورة'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  };

  // Process PDF File
  const processPdfFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => reject(new Error('فشل قراءة ملف الـ PDF'));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);

    // Size validation
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setErrorMessage(
        isAr
          ? `حجم الملف (${fileSizeMB.toFixed(1)} MB) يتجاوز الحد الأقصى المسموح (${maxSizeMB} MB)`
          : `File size exceeds ${maxSizeMB} MB`
      );
      return;
    }

    // Type validation
    const fileType = file.type;
    const isPdfType = fileType === 'application/pdf' || file.name.endsWith('.pdf');
    const isImageType = fileType.startsWith('image/');

    if (accept === 'image' && !isImageType) {
      setErrorMessage(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)' : 'Please select an image file');
      return;
    }
    if (accept === 'pdf' && !isPdfType) {
      setErrorMessage(isAr ? 'يرجى اختيار ملف وثيقة PDF صالحة' : 'Please select a valid PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      let dataUrl = '';
      if (isPdfType) {
        dataUrl = await processPdfFile(file);
      } else {
        dataUrl = await processImageFile(file);
      }

      setFileDetails({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
      });
      onChange(dataUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || (isAr ? 'حدث خطأ أثناء رفع الملف' : 'Upload error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = () => {
    onChange('');
    setFileDetails(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptString = () => {
    if (accept === 'image') return 'image/jpeg,image/png,image/webp,image/svg+xml';
    if (accept === 'pdf') return 'application/pdf,.pdf';
    return 'image/*,application/pdf,.pdf';
  };

  return (
    <div className="space-y-2 text-start">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            {accept === 'pdf' ? <FileText className="w-3.5 h-3.5 text-sky-500" /> : <ImageIcon className="w-3.5 h-3.5 text-sky-500" />}
            <span>{label}</span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {isAr ? 'رفع مباشر من جهازك بدون كتابة أكواد' : 'Direct upload from your device'}
          </span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Upload Dropzone Container */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 ring-4 ring-sky-500/20'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 hover:border-sky-500/50'
          }`}
        >
          {isProcessing ? (
            <div className="py-4 space-y-2 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'جاري معالجة وضغط الملف...' : 'Processing and optimizing file...'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white">
                  {isAr ? 'اسحب الملف وأفلته هنا، أو اضغط للاختيار من جهازك' : 'Drag & drop file here, or click to browse'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {accept === 'pdf'
                    ? isAr ? 'يدعم ملفات الوثائق الرسمية بصيغة PDF (حتى 10 ميجابايت)' : 'Supports PDF documents (up to 10MB)'
                    : isAr ? 'يدعم الصور بصيغ JPG, PNG, WEBP (يتم الضغط والتحسين تلقائياً)' : 'Supports JPG, PNG, WEBP images (auto-optimized)'}
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 shadow-xs group-hover:border-sky-500/40"
              >
                {isAr ? '📁 استعراض الملفات من الكمبيوتر' : '📁 Browse from Computer'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded File Preview Card */
        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {isImage ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 relative group">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    title={isAr ? 'معاينة كاملة' : 'View full'}
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                    {fileDetails?.name || (isImage ? (isAr ? 'تم رفع ومعالجة الصورة بنجاح' : 'Image ready') : (isAr ? 'وثيقة PDF جاهزة' : 'PDF ready'))}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  {fileDetails?.size || (isAr ? 'محفوظ وجاهز للنشر' : 'Ready to save')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {isAr ? 'تغيير الملف' : 'Change'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                title={isAr ? 'إزالة' : 'Remove'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Optional Preset Library for Fast 1-Click Pick */}
      {presets.length > 0 && (
        <div className="pt-2 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {isAr ? 'أو اختر صورة جاهزة بنقرة واحدة:' : 'Or pick a preset with 1 click:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setFileDetails({ name: preset.label, size: 'مسبق التجهيز' });
                }}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  value === preset.url
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-600 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <img src={preset.url} alt={preset.label} className="w-6 h-6 rounded-lg object-cover" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}
