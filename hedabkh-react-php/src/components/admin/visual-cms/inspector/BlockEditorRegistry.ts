import React from 'react';
import { BlockType } from '@/lib/cms/blockSchemas';
import { BlockEditorProps } from './types';
import { HeaderBlockEditor } from './editors/HeaderBlockEditor';
import { HeroBlockEditor } from './editors/HeroBlockEditor';
import { RichTextBlockEditor } from './editors/RichTextBlockEditor';
import { TimelineBlockEditor } from './editors/TimelineBlockEditor';
import { SaudiMapBlockEditor } from './editors/SaudiMapBlockEditor';
import { PartnersBlockEditor } from './editors/PartnersBlockEditor';
import { ProjectCollectionBlockEditor } from './editors/ProjectCollectionBlockEditor';
import { ServiceCollectionBlockEditor } from './editors/ServiceCollectionBlockEditor';
import { StatisticsBlockEditor } from './editors/StatisticsBlockEditor';
import { GalleryBlockEditor } from './editors/GalleryBlockEditor';
import { ContactFormBlockEditor } from './editors/ContactFormBlockEditor';
import { CtaBlockEditor } from './editors/CtaBlockEditor';
import { WhatsAppBlockEditor } from './editors/WhatsAppBlockEditor';
import { FooterBlockEditor } from './editors/FooterBlockEditor';

export const BLOCK_EDITOR_REGISTRY: Record<string, React.FC<BlockEditorProps<any>>> = {
  header: HeaderBlockEditor,
  hero: HeroBlockEditor,
  richText: RichTextBlockEditor,
  timeline: TimelineBlockEditor,
  saudiMap: SaudiMapBlockEditor,
  partners: PartnersBlockEditor,
  projectCollection: ProjectCollectionBlockEditor,
  serviceCollection: ServiceCollectionBlockEditor,
  statistics: StatisticsBlockEditor,
  gallery: GalleryBlockEditor,
  contactForm: ContactFormBlockEditor,
  cta: CtaBlockEditor,
  whatsapp: WhatsAppBlockEditor,
  footer: FooterBlockEditor,
};
