/**
 * Typed Block Schemas and Definitions for Visual CMS by Composition
 * Strictly enforces design boundaries, safe typed props, and zero raw HTML injection.
 */

export type BlockType =
  | 'header'
  | 'hero'
  | 'aboutOverview'
  | 'richText'
  | 'timeline'
  | 'saudiMap'
  | 'partners'
  | 'projectCollection'
  | 'serviceCollection'
  | 'statistics'
  | 'gallery'
  | 'contactForm'
  | 'cta'
  | 'whatsapp'
  | 'catalogCenter'
  | 'specCatalog'
  | 'footer'
  | 'container'
  | 'grid';

export type BlockCategory = 'layout' | 'content' | 'business' | 'interactive' | 'media' | 'conversion';

export type BlockTheme = 'dark' | 'navy' | 'slate' | 'gradient' | 'light';
export type BlockPadding = 'compact' | 'normal' | 'spacious';
export type ContainerWidth = 'full' | 'wide' | 'standard' | 'narrow';

export interface BaseBlockConfig {
  theme?: BlockTheme;
  padding?: BlockPadding;
  borderTop?: boolean;
  borderBottom?: boolean;
  containerWidth?: ContainerWidth;
  motionEffect?: 'none' | 'fade-up' | 'scale' | 'slide';
  [key: string]: unknown;
}

export interface HeaderBlockConfig extends BaseBlockConfig {
  announcementTextAr: string;
  announcementTextEn: string;
  hotlinePhone: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  rfqButtonTextAr: string;
  rfqButtonTextEn: string;
}

export interface HeroBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  primaryCtaTextAr: string;
  primaryCtaTextEn: string;
  primaryCtaLink: string;
  secondaryCtaTextAr: string;
  secondaryCtaTextEn: string;
  secondaryCtaLink: string;
  bgImageUrl?: string;
  badgeNumber?: string;
  badgeTextAr?: string;
  badgeTextEn?: string;
}

export interface RichTextBlockConfig extends BaseBlockConfig {
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  badgeAr?: string;
  badgeEn?: string;
  align?: 'right' | 'center' | 'left';
}

export interface TimelineBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  cylinderRadius?: number;
  autoRotate?: boolean;
}

export interface SaudiMapBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  selectedRegionId?: string;
}

export interface PartnersBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  speedSec?: number;
  showProjectsCount?: boolean;
}

export interface ProjectCollectionBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  selectedProjectIds?: string[];
  featuredOnly: boolean;
  maxItems: number;
  layout: 'grid' | 'carousel';
}

export interface ServiceCollectionBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  selectedServiceIds?: string[];
  maxItems: number;
  layout: 'grid' | 'cards';
}

export interface StatisticsBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  selectedStatIds?: string[];
  showIcons?: boolean;
}

export interface GalleryBlockConfig extends BaseBlockConfig {
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  images: { url: string; captionAr: string; captionEn: string }[];
  columns: number;
}

export interface ContactFormBlockConfig extends BaseBlockConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  submitButtonTextAr: string;
  submitButtonTextEn: string;
  recipientEmail?: string;
  showPhoneField: boolean;
}

export interface CtaBlockConfig extends BaseBlockConfig {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  bgColor?: string;
}

export interface WhatsAppBlockConfig extends BaseBlockConfig {
  phoneNumber: string;
  defaultMessageAr: string;
  defaultMessageEn: string;
  tooltipAr: string;
  tooltipEn: string;
  pulseGlow: boolean;
}

export interface FooterBlockConfig extends BaseBlockConfig {
  copyrightAr: string;
  copyrightEn: string;
  headquartersAr: string;
  headquartersEn: string;
  email: string;
  phone: string;
  showSocialLinks: boolean;
}

export interface ContainerBlockConfig extends BaseBlockConfig {
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
}

export interface GridBlockConfig extends BaseBlockConfig {
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  columnGap?: number;
  rowGap?: number;
}

export type BlockConfig =
  | HeaderBlockConfig
  | HeroBlockConfig
  | RichTextBlockConfig
  | TimelineBlockConfig
  | SaudiMapBlockConfig
  | PartnersBlockConfig
  | ProjectCollectionBlockConfig
  | ServiceCollectionBlockConfig
  | StatisticsBlockConfig
  | GalleryBlockConfig
  | ContactFormBlockConfig
  | CtaBlockConfig
  | WhatsAppBlockConfig
  | FooterBlockConfig
  | ContainerBlockConfig
  | GridBlockConfig;

export interface ContentBlock {
  id: string;
  type: BlockType;
  sortOrder: number;
  isVisible: boolean;
  config: Record<string, any>;
  children?: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  state: 'draft' | 'review' | 'published' | 'archived';
  titleAr: string;
  titleEn: string;
  blocks: ContentBlock[];
  createdBy: string;
  createdAt: string;
  publishedAt?: string | null;
  scheduledPublishAt?: string | null;
  changeNote?: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  template: 'home' | 'about' | 'services' | 'projects' | 'equipment' | 'certificates' | 'team' | 'news' | 'custom';
  status: 'draft' | 'review' | 'published';
  publishedVersionId: string | null;
  draftVersionId: string | null;
  scheduledPublishAt?: string | null;
  reviewRequestedBy?: string | null;
  reviewRequestedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
