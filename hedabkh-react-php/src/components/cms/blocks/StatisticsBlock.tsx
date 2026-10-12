import React from 'react';
import { StatisticsBlockConfig } from '../../../lib/cms/blockSchemas';
import { Card, Container, Badge } from '../../ui/primitives';

interface StatisticsBlockProps {
  config: StatisticsBlockConfig;
  kpis: Array<{
    id: string;
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    sub: string;
  }>;
  locale: 'ar' | 'en';
}

export const StatisticsBlock: React.FC<StatisticsBlockProps> = ({ config, kpis, locale }) => {
  const isAr = locale === 'ar';

  return (
    <section className="py-16 bg-slate-100/80 dark:bg-[#070B14] border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
      <Container width="standard">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="brand" size="md" className="mb-3">
            {isAr ? config.tagAr || 'مؤشرات الأداء والإنجاز' : config.tagEn || 'KEY PERFORMANCE METRICS'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {isAr ? config.titleAr || 'أرقام تعكس ريادتنا الهندسية' : config.titleEn || 'Key Figures of Civil Engineering'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const KpiIcon = kpi.icon;
            return (
              <Card key={kpi.id} variant="glass" padding="normal" className="text-center space-y-2 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-[#0070BA] dark:text-[#00B0F0] border border-sky-500/20 flex items-center justify-center mx-auto mb-3">
                  <KpiIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {kpi.value}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{kpi.label}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{kpi.sub}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
