'use client';

import React, { useState } from 'react';
import { BlockEditorProps } from '../types';
import { GalleryBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { SelectField } from '../primitives/SelectField';
import { UnifiedMediaPickerModal } from '@/components/admin/common/UnifiedMediaPickerModal';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export const GalleryBlockEditor: React.FC<BlockEditorProps<GalleryBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const images = Array.isArray(config.images) ? config.images : [];

  const handleAddImage = (url: string) => {
    const updatedImages = [
      ...images,
      {
        url,
        captionAr: 'صورة من مشاريع هضاب الخليج الميدانية',
        captionEn: 'Gulf Hills Field Operations Image',
      },
    ];
    onUpdate({ images: updatedImages });
    setIsMediaPickerOpen(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_: unknown, i: number) => i !== index);
    onUpdate({ images: updatedImages });
  };

  const handleUpdateCaption = (index: number, captionAr: string, captionEn: string) => {
    const updatedImages = images.map((img: { url: string; captionAr: string; captionEn: string }, i: number) =>
      i === index ? { ...img, captionAr, captionEn } : img
    );
    onUpdate({ images: updatedImages });
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Titles */}
      <LocalizedTextField
        label="الشارة التمهيدية"
        valueAr={config.tagAr}
        valueEn={config.tagEn}
        onChangeAr={(val) => onUpdate({ tagAr: val })}
        onChangeEn={(val) => onUpdate({ tagEn: val })}
        placeholderAr="مثال: معرض الصور الميدانية"
        placeholderEn="e.g. FIELD OPERATIONS GALLERY"
      />

      <LocalizedTextField
        label="العنوان الرئيسي للمعرض"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: جولة مصورة في أسطولنا ومشاريعنا الإنشائية"
        placeholderEn="e.g. Visual Showcase of Our Heavy Fleet & Operations"
      />

      <LocalizedTextarea
        label="الوصف التعريفي"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="توثيق مرئي لأحدث المشاريع المنفذة والآليات الثقيلة..."
        placeholderEn="Photographic documentation of our high-grade execution..."
        rows={2}
      />

      {/* 2. Grid Columns Selector */}
      <SelectField
        label="توزيع الأعمدة في الشاشات الكبيرة"
        value={config.columns || 3}
        options={[
          { value: 2, label: 'عمودان (2 Columns)' },
          { value: 3, label: '3 أعمدة (3 Columns)' },
          { value: 4, label: '4 أعمدة (4 Columns)' },
        ]}
        onChange={(val) => onUpdate({ columns: Number(val) })}
      />

      {/* 3. Image Items Manager */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>صور المعرض الميداني ({images.length})</span>
          </span>

          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة صورة</span>
          </button>
        </div>

        {images.length === 0 ? (
          <div
            onClick={() => setIsMediaPickerOpen(true)}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-sky-500/50 bg-slate-950/50 text-center cursor-pointer transition-colors"
          >
            <ImageIcon className="w-7 h-7 text-slate-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-300">المعرض فارغ حالياً</p>
            <p className="text-[10px] text-slate-500 mt-0.5">اضغط هنا لإضافة صور من مكتبة الوسائط</p>
          </div>
        ) : (
          <div className="space-y-3">
            {images.map((img: { url: string; captionAr: string; captionEn: string }, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    صورة #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2.5 items-start">
                  <img
                    src={img.url}
                    alt={img.captionAr || 'Gallery Item'}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-900"
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      dir="rtl"
                      value={img.captionAr || ''}
                      onChange={(e) =>
                        handleUpdateCaption(idx, e.target.value, img.captionEn || '')
                      }
                      placeholder="التعليق بالعربية..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-white focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={img.captionEn || ''}
                      onChange={(e) =>
                        handleUpdateCaption(idx, img.captionAr || '', e.target.value)
                      }
                      placeholder="English caption..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-white focus:border-sky-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <UnifiedMediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={handleAddImage}
        />
      )}
    </div>
  );
};
