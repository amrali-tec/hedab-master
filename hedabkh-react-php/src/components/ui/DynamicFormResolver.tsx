"use client";

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { storageAdapter } from '../../services/storageAdapter';
import { publicApi } from '../../services/publicApi';
import { EditableResource, EditorElementNode } from '../../types';

interface DynamicFormResolverProps {
  formSlug?: string;
  locale?: 'ar' | 'en';
}

export default function DynamicFormResolver({
  formSlug = 'contact-form',
  locale = 'ar',
}: DynamicFormResolverProps) {
  const isAr = locale === 'ar';
  const [formResource, setFormResource] = useState<EditableResource | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const forms = storageAdapter.getEditableResources('form');
    const targetForm = forms.find((f) => f.slug === formSlug || f.id === formSlug) || forms[0];
    if (targetForm) {
      setFormResource(targetForm);
    }
  }, [formSlug]);

  if (!formResource || !formResource.content?.nodes) {
    return null;
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate required fields
    const inputNodes = formResource.content.nodes.filter((n) => n.type === 'form-input');
    const newErrors: Record<string, string> = {};

    inputNodes.forEach((node) => {
      const val = formData[node.id] || '';
      if (node.behavior?.validation?.required && !val.trim()) {
        newErrors[node.id] = isAr ? 'هذا الحقل مطلوب' : 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit inquiry record to PHP REST API
    const nameVal = formData[inputNodes[0]?.id] || 'مستفسر زائر';
    const phoneVal = formData[inputNodes[1]?.id] || '0550000000';
    const msgVal = Object.values(formData).join(' | ') || 'استفسار من نموذج الموقع التفاعلي';

    publicApi.submitInquiry({
      name: nameVal,
      email: 'visitor@hedabkh.com.sa',
      phone: phoneVal,
      message: msgVal,
    }).catch(() => {
      // Fallback
      storageAdapter.saveInquiry({
        id: `inq-${Date.now()}`,
        name: nameVal,
        email: 'visitor@hedabkh.com.sa',
        phone: phoneVal,
        message: msgVal,
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: `تم الإرسال من خلال نموذج ${formResource.name}`,
      });
    }).finally(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({});
    });
  };

  const inputNodes = formResource.content.nodes.filter((n) => n.type === 'form-input');
  const submitNode = formResource.content.nodes.find((n) => n.type === 'form-submit');

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-start">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          {formResource.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isAr ? 'نموذج محرر ديناميكي موصول بمحرك معالجة الاستفسارات المباشرة' : 'Dynamic Runtime Form connected to Inquiries Processor'}
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{isAr ? 'تم استلام استفسارك بنجاح! سيتواصل معك الفريق الهندسي في أقرب وقت.' : 'Your request has been received! Our team will contact you shortly.'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputNodes.map((node) => (
          <div key={node.id} className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{isAr ? node.props.labelAr || node.name : node.props.labelEn || node.name}</span>
              {node.behavior?.validation?.required && <span className="text-rose-500 text-[10px]">*</span>}
            </label>
            <input
              type={node.props.inputType || 'text'}
              value={formData[node.id] || ''}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              placeholder={isAr ? node.props.placeholderAr || '' : node.props.placeholderEn || ''}
              className={`w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${errors[node.id] ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/30'}`}
            />
            {errors[node.id] && (
              <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors[node.id]}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-start">
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ backgroundColor: submitNode?.styles?.bgColor || '#0070BA', color: submitNode?.styles?.textColor || '#ffffff' }}
          className="px-8 py-3 rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>{isAr ? submitNode?.props?.btnTextAr || 'إرسال الاستفسار' : submitNode?.props?.btnTextEn || 'Submit Request'}</span>
        </button>
      </div>
    </form>
  );
}
