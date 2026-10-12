import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProjectCollectionBlockConfig } from '../../../lib/cms/blockSchemas';
import { Container, Badge } from '../../ui/primitives';
import { getCategoryTheme } from '../../../utils/categoryThemes';

interface ProjectCollectionBlockProps {
  config: ProjectCollectionBlockConfig;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    client: string;
    completionDate: string;
  }>;
  locale: 'ar' | 'en';
}

export const ProjectCollectionBlock: React.FC<ProjectCollectionBlockProps> = ({ config, projects, locale }) => {
  const isAr = locale === 'ar';

  return (
    <section className="py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0D1527] dark:to-[#070B14] relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Container width="standard">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 text-start">
            <Badge variant="brand" size="md" className="mb-2 uppercase tracking-widest px-4 py-1.5 font-bold shadow-lg shadow-sky-500/10">
              {isAr ? config.tagAr || 'معرض الإنجازات الميدانية' : config.tagEn || 'FLAGSHIP PROJECTS'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isAr ? config.titleAr || 'المشاريع الإنشائية والتنفيذية' : config.titleEn || 'Civil & Infrastructure Projects'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl font-medium">
              {isAr
                ? config.subtitleAr || 'نماذج من أعمالنا المعتمدة في كشط وسفلتة الطرق، تصريف السيول، وتشغيل المرافق مع كبرى الأمانات والوزارات.'
                : config.subtitleEn || 'Verified showcases in municipal roadworks, drainage networks, and precast barriers.'}
            </p>
          </div>

          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0070BA] dark:hover:border-sky-500 text-[#0070BA] dark:text-sky-400 font-bold text-sm group transition-all duration-300 shadow-md hover:shadow-lg shrink-0"
          >
            <span>{isAr ? 'استعراض كافة المشاريع' : 'View All Projects'}</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(projects || []).slice(0, config.maxItems || 6).map((proj) => {
            const catTheme = getCategoryTheme(proj.category);

            return (
              <div
                key={proj.id}
                className={`relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border ${catTheme.cardBorder} ${catTheme.hoverBorder} ${catTheme.cardShadow} transition-all duration-500 hover:-translate-y-2.5 backdrop-blur-2xl overflow-hidden flex flex-col justify-between text-start`}
              >
                {/* Radial Glow Spotlight in Catalog Color */}
                <div className={`absolute top-0 right-0 w-40 h-40 ${catTheme.glowBg} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                <div className="h-56 bg-slate-950 relative overflow-hidden">
                  <img
                    src={proj.image ? proj.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : '/images/projects/project-1.webp'}
                    onError={(e: any) => {
                      // Fallback to original image if webp not found
                      if (proj.image && !e.currentTarget.src.includes(proj.image)) {
                        e.currentTarget.src = proj.image;
                      }
                    }}
                    alt={proj.title}
                    width={400}
                    height={224}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />
                  <span className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-bold border ${catTheme.badgeBorder} ${catTheme.badgeText} shadow-md`}>
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 space-y-4 relative z-10">
                  <h3 className={`text-xl font-black text-slate-900 dark:text-white ${catTheme.titleHover} transition-colors tracking-tight leading-snug`}>
                    {proj.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium line-clamp-2">
                    {proj.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-bold">
                    <span className="truncate max-w-[170px]">{proj.client}</span>
                    <span className={`px-2.5 py-1 rounded-lg ${catTheme.badgeBg} ${catTheme.badgeText} border ${catTheme.badgeBorder} font-mono`}>
                      {proj.completionDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
