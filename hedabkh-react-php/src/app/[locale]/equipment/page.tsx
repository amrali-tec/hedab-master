import { useParams } from 'react-router-dom';
import React from 'react';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  HardHat,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import EquipmentFleetClient from './EquipmentFleetClient';

interface EquipmentPageProps {
  params: Promise<{ locale: string }>;
}

export default function EquipmentPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 sm:pt-10 pb-20 space-y-12 min-h-[85vh] bg-transparent text-text-main transition-colors duration-300">
      {/* Page Header */}
      <PageHeader
        title={isAr ? 'أسطول الآليات والمعدات الثقيلة الميدانية' : 'Heavy Machinery & Operational Fleet'}
        subtitle={
          isAr
            ? 'القوة التشغيلية والمعدات الميدانية المتطورة الداعمة لمشاريع الطرق، شبكات تصريف السيول، والحواجز الخرسانية بالمملكة'
            : 'Advanced heavy machinery powering our road paving, stormwater networks, and infrastructure projects across Saudi Arabia'
        }
        currentPageLabel={isAr ? 'الأسطول والمعدات' : 'Fleet & Equipment'}
        locale={locale}
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-start space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            +45
          </div>
          <p className="text-xs font-bold text-slate-500">
            {isAr ? 'آلية ومعدة ثقيلة مخصصة' : 'Heavy Operational Units'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-start space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            99.2%
          </div>
          <p className="text-xs font-bold text-slate-500">
            {isAr ? 'نسبة الجاهزية التشغيلية' : 'Operational Uptime'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-start space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">
            100%
          </div>
          <p className="text-xs font-bold text-slate-500">
            {isAr ? 'صيانة دورية معتمدة' : 'ISO Certified Maintenance'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-start space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <HardHat className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            24/7
          </div>
          <p className="text-xs font-bold text-slate-500">
            {isAr ? 'جاهزية طوارئ السيول' : 'Emergency Storm Readiness'}
          </p>
        </div>
      </div>

      {/* Interactive Fleet Component */}
      <EquipmentFleetClient locale={locale} />
    </div>
  );
}
