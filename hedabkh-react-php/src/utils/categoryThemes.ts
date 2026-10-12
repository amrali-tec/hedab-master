export interface CategoryTheme {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  hoverBorder: string;
  cardShadow: string;
  glowBg: string;
  titleHover: string;
  progressGradient: string;
  accentText: string;
}

export function getCategoryTheme(category: string = ''): CategoryTheme {
  const cat = (category || '').toLowerCase();

  // 1. Roadworks / Milling / Paving -> Amber Gold Theme
  if (
    cat.includes('سفلت') ||
    cat.includes('كشط') ||
    cat.includes('طرق') ||
    cat.includes('paving') ||
    cat.includes('road') ||
    cat.includes('asphalt')
  ) {
    return {
      name: 'amber',
      badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
      badgeText: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-500/30 dark:border-amber-500/40',
      cardBorder: 'border-amber-500/30 dark:border-amber-500/40',
      hoverBorder: 'hover:border-amber-500 dark:hover:border-amber-400',
      cardShadow: 'shadow-[0_4px_20px_rgba(245,158,11,0.12)] dark:shadow-[0_0_45px_rgba(245,158,11,0.45)]',
      glowBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      titleHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
      progressGradient: 'from-amber-500 to-amber-400',
      accentText: 'text-amber-600 dark:text-amber-400',
    };
  }

  // 2. Stormwater & Drainage -> Electric Cyan / Sky Blue Theme
  if (
    cat.includes('تصريف') ||
    cat.includes('سيول') ||
    cat.includes('أمطار') ||
    cat.includes('drainage') ||
    cat.includes('stormwater') ||
    cat.includes('water')
  ) {
    return {
      name: 'sky',
      badgeBg: 'bg-sky-500/15 dark:bg-sky-500/20',
      badgeText: 'text-sky-800 dark:text-sky-300',
      badgeBorder: 'border-sky-500/30 dark:border-sky-500/40',
      cardBorder: 'border-sky-500/30 dark:border-sky-500/40',
      hoverBorder: 'hover:border-sky-500 dark:hover:border-sky-400',
      cardShadow: 'shadow-[0_4px_20px_rgba(14,165,233,0.12)] dark:shadow-[0_0_45px_rgba(14,165,233,0.45)]',
      glowBg: 'bg-sky-500/10 dark:bg-sky-500/20',
      titleHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
      progressGradient: 'from-sky-500 to-sky-400',
      accentText: 'text-[#0070BA] dark:text-sky-400',
    };
  }

  // 3. Concrete Barriers / New Jersey -> Emerald Green Theme
  if (
    cat.includes('نيوجيرسي') ||
    cat.includes('حواجز') ||
    cat.includes('خرسان') ||
    cat.includes('barrier') ||
    cat.includes('precast') ||
    cat.includes('concrete')
  ) {
    return {
      name: 'emerald',
      badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      badgeBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
      cardBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-500 dark:hover:border-emerald-400',
      cardShadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.12)] dark:shadow-[0_0_45px_rgba(16,185,129,0.45)]',
      glowBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      titleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      progressGradient: 'from-emerald-500 to-emerald-400',
      accentText: 'text-emerald-600 dark:text-emerald-400',
    };
  }

  // 4. Operation, Maintenance & Facilities -> Electric Violet / Purple Theme
  if (
    cat.includes('تشغيل') ||
    cat.includes('صيانة') ||
    cat.includes('مرافق') ||
    cat.includes('operation') ||
    cat.includes('maintenance') ||
    cat.includes('facility')
  ) {
    return {
      name: 'purple',
      badgeBg: 'bg-purple-500/15 dark:bg-purple-500/20',
      badgeText: 'text-purple-800 dark:text-purple-300',
      badgeBorder: 'border-purple-500/30 dark:border-purple-500/40',
      cardBorder: 'border-purple-500/30 dark:border-purple-500/40',
      hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-400',
      cardShadow: 'shadow-[0_4px_20px_rgba(168,85,247,0.12)] dark:shadow-[0_0_45px_rgba(168,85,247,0.45)]',
      glowBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      progressGradient: 'from-purple-500 to-purple-400',
      accentText: 'text-purple-600 dark:text-purple-400',
    };
  }

  // 5. Earthworks & Infrastructure -> Coral Rose Theme
  return {
    name: 'rose',
    badgeBg: 'bg-rose-500/15 dark:bg-rose-500/20',
    badgeText: 'text-rose-800 dark:text-rose-300',
    badgeBorder: 'border-rose-500/30 dark:border-rose-500/40',
    cardBorder: 'border-rose-500/30 dark:border-rose-500/40',
    hoverBorder: 'hover:border-rose-500 dark:hover:border-rose-400',
    cardShadow: 'shadow-[0_4px_20px_rgba(244,63,94,0.12)] dark:shadow-[0_0_45px_rgba(244,63,94,0.45)]',
    glowBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    titleHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    progressGradient: 'from-rose-500 to-rose-400',
    accentText: 'text-rose-600 dark:text-rose-400',
  };
}
