import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { CtaBlockConfig } from '../../../lib/cms/blockSchemas';
import { Button, Container } from '../../ui/primitives';
import QuickQuoteModal from '../../ui/QuickQuoteModal';

interface CtaBlockProps {
  config: CtaBlockConfig;
  locale: 'ar' | 'en';
}

export const CtaBlock: React.FC<CtaBlockProps> = ({ config, locale }) => {
  const isAr = locale === 'ar';
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-slate-100/90 via-white to-slate-100/90 dark:from-[#002060] dark:via-[#003080] dark:to-[#070B14] border-y border-slate-200/80 dark:border-sky-600/30 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container width="narrow" className="text-center relative z-10 space-y-6">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isAr ? config.titleAr || 'هل لديك مشروع بنية تحتية أو صيانة بلدية وترغب في عرض سعر معتمد؟' : config.titleEn || 'Have an Infrastructure or Roadwork Project Requiring a Certified RFQ?'}
        </h2>
        <p className="text-slate-600 dark:text-sky-100 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          {isAr
            ? config.descriptionAr || 'احصل على دراسة فنية وعرض سعر فوري ومباشر من مهندسي شركة هضاب الخليج للمقاولات في 4 خطوات بسيطة.'
            : config.descriptionEn || 'Receive a comprehensive technical evaluation and official RFQ quotation from our engineering team in 4 simple steps.'}
        </p>
        
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm md:text-base shadow-xl shadow-amber-950/30 hover:shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2.5 cursor-pointer border border-amber-300/50"
          >
            <Send className="w-4 h-4" />
            <span>{isAr ? config.buttonTextAr || 'طلب عرض سعر فوري (نموذج إلكتروني)' : config.buttonTextEn || 'Request Instant Project RFQ'}</span>
          </button>
        </div>
      </Container>

      {/* Interactive 4-Step RFQ Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={locale}
      />
    </section>
  );
};

