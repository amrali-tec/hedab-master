"use client";

import React, { use, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TrendingUp,
  Edit2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { Statistic } from '../../../../types';
import { statisticSchema, StatisticFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';

interface StatisticsAdminProps {
  params: Promise<{ locale: string }>;
}

export default function StatisticsAdminPage({ params }: StatisticsAdminProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [editingStat, setEditingStat] = useState<Statistic | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StatisticFormData>({
    resolver: zodResolver(statisticSchema),
  });

  const watchValue = watch('value', 0);
  const watchPrefix = watch('prefix', '');
  const watchSuffix = watch('suffix', '');
  const watchLabel = watch('label', '');

  const loadStatistics = () => {
    setStatistics(storageAdapter.getStatistics(locale));
  };

  useEffect(() => {
    loadStatistics();
  }, [locale]);

  const handleOpenEdit = (stat: Statistic) => {
    setEditingStat(stat);
    reset({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      prefix: stat.prefix || '',
      suffix: stat.suffix || '',
      icon: stat.icon || '',
    });
  };

  const onSubmit = (data: StatisticFormData) => {
    if (editingStat) {
      const updated: Statistic = {
        id: editingStat.id,
        label: data.label,
        value: data.value,
        prefix: data.prefix,
        suffix: data.suffix,
        icon: data.icon,
      };

      storageAdapter.saveStatistic(updated, locale);
      loadStatistics();
      setEditingStat(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-sky-500" />
          <span>{isAr ? 'إدارة المؤشرات وإحصائيات الإنجاز (KPIs)' : 'KPIs & Live Statistics Manager'}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'تعديل الأرقام والعدادات الحية التفاعلية المعروضة في واجهة الصفحة الرئيسية للموقع'
            : 'Update homepage animated counters, project numbers, fleet count & safety ratings'}
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics.map((stat) => (
          <div
            key={stat.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <button
                onClick={() => handleOpenEdit(stat)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors"
                title={isAr ? 'تعديل' : 'Edit'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Display Counter Preview */}
            <div className="py-3">
              <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight flex items-baseline">
                {stat.prefix && <span className="text-sky-500 mr-1">{stat.prefix}</span>}
                <span>{stat.value}</span>
                {stat.suffix && <span className="text-xs font-bold text-slate-400 ml-1">{stat.suffix}</span>}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{isAr ? 'رمز المعرف:' : 'ID:'} <span className="font-mono text-sky-500">{stat.id}</span></span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'نشط بالرئيسية' : 'Live on site'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editingStat}
        onClose={() => setEditingStat(null)}
        title={isAr ? 'تعديل المؤشر الإحصائي' : 'Edit KPI Statistic'}
        subtitle={isAr ? 'التعديلات ستظهر في عدادات الصفحة الرئيسية' : 'Animated count on homepage'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002060] to-[#0070BA] text-white text-center space-y-1 shadow-md">
            <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider">
              {isAr ? 'معاينة حية للمؤشر' : 'Live Counter Preview'}
            </span>
            <div className="text-3xl font-black font-mono">
              {watchPrefix}
              {watchValue}
              <span className="text-xs font-bold font-sans opacity-90 mr-1">{watchSuffix}</span>
            </div>
            <p className="text-xs text-sky-100 font-bold">{watchLabel || editingStat?.label}</p>
          </div>

          <div className="space-y-1 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'عنوان المؤشر' : 'Label'} *
            </label>
            <input
              type="text"
              {...register('label')}
              placeholder="سنوات الخبرة في السوق"
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            {errors.label && (
              <p className="text-[11px] font-semibold text-rose-500">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-1 text-start">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'القيمة الرقمية (للعد التلقائي)' : 'Numeric Value'} *
            </label>
            <input
              type="number"
              {...register('value', { valueAsNumber: true })}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'بادئة (Prefix)' : 'Prefix (e.g. + or $)'}
              </label>
              <input
                type="text"
                {...register('prefix')}
                placeholder="+"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-center font-mono font-bold"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'لاحقة (Suffix)' : 'Suffix (e.g. % or عاماً)'}
              </label>
              <input
                type="text"
                {...register('suffix')}
                placeholder=" عاماً / %"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-center"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditingStat(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs font-black hover:shadow-lg transition-all cursor-pointer"
            >
              {isAr ? 'حفظ التعديلات' : 'Save Changes'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
