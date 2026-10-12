"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Video,
  Minus,
  Sparkles,
  Undo,
  Redo,
  RemoveFormatting,
  Eye,
  Code2,
  Columns,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Laptop,
  Tablet,
  Smartphone,
  Trash2,
  Plus,
} from 'lucide-react';

export interface VisualRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  dir?: 'rtl' | 'ltr';
  locale?: 'ar' | 'en';
  allowTemplates?: boolean;
}

// Preset color options for text & highlight
const TEXT_COLORS = [
  { label: 'الافتراضي', color: 'inherit' },
  { label: 'أزرق سيادي', color: '#002060' },
  { label: 'أزرق هضاب', color: '#0070BA' },
  { label: 'سماوي مشرق', color: '#00B0F0' },
  { label: 'أخضر معتمد', color: '#10B981' },
  { label: 'برتقالي تحذيري', color: '#F59E0B' },
  { label: 'رمادي داكن', color: '#475569' },
  { label: 'أحمر تنبيه', color: '#EF4444' },
];

const HIGHLIGHT_COLORS = [
  { label: 'بدون تظليل', color: 'transparent' },
  { label: 'تظليل أصفر', color: 'rgba(254, 240, 138, 0.5)' },
  { label: 'تظليل سماوي', color: 'rgba(0, 176, 240, 0.15)' },
  { label: 'تظليل أخضر', color: 'rgba(16, 185, 129, 0.15)' },
  { label: 'تظليل برتقالي', color: 'rgba(245, 158, 11, 0.15)' },
];

// Rich Templates
const EDITOR_TEMPLATES = [
  {
    id: 'news-announcement',
    titleAr: '📰 خبر صحفي / بيان رسمي',
    titleEn: 'Press Release / Official News',
    descAr: 'هيكل متكامل لبيان إعلامي مع اقتباس مسؤول ومؤشرات إنجاز',
    descEn: 'News release template with executive quote and metrics',
    html: `
      <h2>عنوان الخبر أو البيان الرسمي للشركة</h2>
      <p><strong>الرياض، المملكة العربية السعودية:</strong> أعلنت شركة هضاب الخليج العربي للمقاولات اليوم عن إطلاق مشروع جديد ضمن خطط تعزيز البنية التحتية الوطنية وتطوير شبكات الطرق الحضرية وفق أرقى المعايير الهندسية.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>مؤشر إنجاز إستراتيجي:</strong> يغطي المشروع مساحة إجمالية تتجاوز 150,000 متر مربع وبمدة تنفيذ قياسية مدعومة بأسطول متكامل من الكاشطات والرصاصات الحديثة.
      </div>

      <h3>أبرز أهداف المشروع ومخرجاته:</h3>
      <ul>
        <li>رفع كفاءة وانسيابية الحركة المرورية بالمحاور الرئيسية.</li>
        <li>تطبيق أعلى معايير ضبط الجودة المعتمدة لدى أمانة منطقة الرياض.</li>
        <li>معالجة التشوه البصري وتحسين المشهد الحضري العام.</li>
      </ul>

      <blockquote>
        "نواصل التزامنا الوطني بالمساهمة الفعالة في تحقيق مستهدفات رؤية السعودية 2030 من خلال كوادرنا الهندسية المؤهلة وأسطولنا الميداني الجاهز."
        <footer>— الإدارة التنفيذية، شركة هضاب الخليج العربي</footer>
      </blockquote>
    `,
  },
  {
    id: 'project-report',
    titleAr: '🏗️ تقرير إنجاز مشروع هندسي',
    titleEn: 'Project Progress Report',
    descAr: 'جدول مواصفات، مراحل التنفيذ، ونسب الإنجاز الميداني',
    descEn: 'Engineering progress report with specs table & milestone metrics',
    html: `
      <h2>تقرير الإنجاز الميداني وسير الأعمال</h2>
      <p>يوثق هذا التقرير سير العمليات الإنشائية والهندسية لمشروع البنية التحتية، مع بيان نسب الإنجاز التراكمي وتوافق المواد الموردة مع الكود السعودي.</p>

      <h3>جدول المواصفات الفنية المعتمدة:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
        <thead>
          <tr style="background: rgba(0, 112, 186, 0.12); border-bottom: 2px solid #0070BA;">
            <th style="padding: 10px; text-align: start;">بند العمل</th>
            <th style="padding: 10px; text-align: start;">المواصفة والكمية</th>
            <th style="padding: 10px; text-align: start;">حالة الاعتماد</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(128,128,128,0.2);">
            <td style="padding: 10px;"><strong>كشط الأسفلت التالف</strong></td>
            <td style="padding: 10px;">عمق 5 سم بمساحة 45,000 م²</td>
            <td style="padding: 10px; color: #10B981; font-weight: bold;">منجز 100%</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(128,128,128,0.2);">
            <td style="padding: 10px;"><strong>الطبقة الأسفلتية الرابطة (Binder)</strong></td>
            <td style="padding: 10px;">سمك 7 سم مع رش مادة MC1</td>
            <td style="padding: 10px; color: #10B981; font-weight: bold;">منجز 100%</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>الطبقة السطحية والدهانات الحرارية</strong></td>
            <td style="padding: 10px;">سمك 5 سم مع خطوط ثيرموبلاستيك</td>
            <td style="padding: 10px; color: #0070BA; font-weight: bold;">جاري التنفيذ (85%)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-success" style="padding: 16px; border-radius: 12px; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10B981; margin: 20px 0;">
        <strong>مطابقة واختبارات الجودة:</strong> أظهرت نتائج عينات الكور المأخوذة من الموقع تحقيق نسبة دمك 98.6% بما يتجاوز المعيار المطلوب.
      </div>
    `,
  },
  {
    id: 'safety-policy',
    titleAr: '🛡️ سياسة السلامة والصحة المهنية',
    titleEn: 'HSE & Safety Policy Statement',
    descAr: 'معايير الأمن والسلامة الميدانية المعتمدة في مواقع العمل',
    descEn: 'Occupational health, safety, and field standards statement',
    html: `
      <h2>سياسة السلامة والصحة المهنية والبيئة (HSE)</h2>
      <p>تضع <strong>شركة هضاب الخليج العربي للمقاولات</strong> سلامة كوادرها وفرق العمل الميدانية ومرتادي الطرق في مقدمة أولوياتها الإستراتيجية، التزاماً بنظام إدارة السلامة والصحة المهنية <strong>ISO 45001:2018</strong>.</p>

      <h3>ركائز السلامة الميدانية:</h3>
      <ul>
        <li><strong>منطقة العمل الآمنة:</strong> عزل مواقع الحفر والسفلتة بحواجز نيوجيرسي الخرسانية والإشارات التحذيرية المضيئة.</li>
        <li><strong>معدات الحماية الشخصية (PPE):</strong> التزام تام بارتداء الخوذ والسترات العاكسة والأحذية الواقية.</li>
        <li><strong>خطة التدخل السريع والطوارئ:</strong> تواجد مشرفي سلامة معتمدين على مدار الساعة في جميع الورديات.</li>
      </ul>

      <div class="callout callout-warning" style="padding: 16px; border-radius: 12px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #F59E0B; margin: 20px 0;">
        <strong>تعليمات أمنية هامة:</strong> يمنع منعاً باتاً دخول الآليات والمعدات الثقيلة بدون إشارات التنبيه الصوتية والضوئية المعتمدة.
      </div>
    `,
  },
];

export default function VisualRichTextEditor({
  value,
  onChange,
  placeholder = 'ابدأ بكتابة المحتوى وتنسيقه هنا...',
  minHeight = '360px',
  dir = 'rtl',
  locale = 'ar',
  allowTemplates = true,
}: VisualRichTextEditorProps) {
  const isAr = locale === 'ar';
  const editorRef = useRef<HTMLDivElement>(null);

  // View Modes: 'visual' | 'split' | 'code' | 'preview'
  const [viewMode, setViewMode] = useState<'visual' | 'split' | 'code' | 'preview'>('visual');
  const [deviceSimulator, setDeviceSimulator] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rawHtml, setRawHtml] = useState(value || '');
  const [copied, setCopied] = useState(false);

  // Modals / Dropdowns state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right' | 'full'>('center');

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);

  // Sync internal rawHtml when value prop changes externally
  useEffect(() => {
    if (value !== rawHtml) {
      setRawHtml(value || '');
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Handle visual editor input
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
    }
  }, [onChange]);

  // Handle raw code view changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setRawHtml(html);
    onChange(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  };

  // Format command helper using document.execCommand
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  // Insert HTML helper
  const insertHtmlAtCursor = (htmlToInsert: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = htmlToInsert;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      editorRef.current.innerHTML += htmlToInsert;
    }
    handleEditorInput();
  };

  // Apply heading format
  const applyHeading = (tag: string) => {
    if (tag === 'p') {
      execCmd('formatBlock', '<p>');
    } else {
      execCmd('formatBlock', `<${tag}>`);
    }
    setActiveDropdown(null);
  };

  // Apply Callout Box
  const insertCallout = (type: 'info' | 'success' | 'warning' | 'danger') => {
    const config = {
      info: { bg: 'rgba(0, 112, 186, 0.08)', border: '#0070BA', icon: 'ℹ️', title: isAr ? 'ملاحظة هامة' : 'Important Note' },
      success: { bg: 'rgba(16, 185, 129, 0.08)', border: '#10B981', icon: '✅', title: isAr ? 'إنجاز معتمد' : 'Verified Milestone' },
      warning: { bg: 'rgba(245, 158, 11, 0.08)', border: '#F59E0B', icon: '⚠️', title: isAr ? 'تنبيه ميداني' : 'Field Advisory' },
      danger: { bg: 'rgba(239, 68, 68, 0.08)', border: '#EF4444', icon: '🚨', title: isAr ? 'تحذير حرج' : 'Critical Warning' },
    }[type];

    const html = `
      <div class="callout callout-${type}" style="padding: 16px; border-radius: 12px; background: ${config.bg}; border-left: 4px solid ${config.border}; border-right: 4px solid ${config.border}; margin: 20px 0;">
        <div style="font-weight: bold; margin-bottom: 6px; display: flex; items-center: center; gap: 8px;">
          <span>${config.icon}</span>
          <span>${config.title}</span>
        </div>
        <p style="margin: 0; font-size: 14px; line-height: 1.6;">اكتب نص التنبيه أو الملاحظة هنا...</p>
      </div>
      <p><br></p>
    `;
    insertHtmlAtCursor(html);
    setActiveDropdown(null);
  };

  // Insert Link
  const handleInsertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    const target = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const html = `<a href="${linkUrl}" class="text-sky-600 dark:text-sky-400 underline font-bold"${target}>${text}</a>`;
    insertHtmlAtCursor(html);
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Insert Image
  const handleInsertImage = () => {
    if (!imageUrl) return;
    let alignStyles = 'margin: 20px auto; display: block; max-width: 100%; border-radius: 16px;';
    if (imageAlign === 'left') alignStyles = 'float: left; margin: 0 20px 20px 0; max-width: 45%; border-radius: 16px;';
    if (imageAlign === 'right') alignStyles = 'float: right; margin: 0 0 20px 20px; max-width: 45%; border-radius: 16px;';
    if (imageAlign === 'full') alignStyles = 'width: 100%; margin: 20px 0; display: block; border-radius: 16px;';

    const captionHtml = imageCaption
      ? `<figcaption style="text-align: center; font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 600;">${imageCaption}</figcaption>`
      : '';

    const html = `
      <figure style="margin: 24px 0; text-align: center;">
        <img src="${imageUrl}" alt="${imageAlt || 'صورة من مشاريع هضاب الخليج'}" style="${alignStyles} box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);" />
        ${captionHtml}
      </figure>
      <p><br></p>
    `;
    insertHtmlAtCursor(html);
    setImageModalOpen(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
  };

  // Insert Video Embed
  const handleInsertVideo = () => {
    if (!videoUrl) return;
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      embedUrl = videoUrl.replace('watch?v=', 'embed/');
    } else if (videoUrl.includes('youtu.be/')) {
      embedUrl = videoUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    const html = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin: 24px 0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);">
        <iframe src="${embedUrl}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe>
      </div>
      <p><br></p>
    `;
    insertHtmlAtCursor(html);
    setVideoModalOpen(false);
    setVideoUrl('');
  };

  // Insert Table
  const handleInsertTable = () => {
    let html = `<table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">`;
    if (tableHasHeader) {
      html += `<thead><tr style="background: rgba(0, 112, 186, 0.12); border-bottom: 2px solid #0070BA;">`;
      for (let c = 0; c < tableCols; c++) {
        html += `<th style="padding: 12px; text-align: start; font-weight: bold;">عمود ${c + 1}</th>`;
      }
      html += `</tr></thead>`;
    }
    html += `<tbody>`;
    for (let r = 0; r < tableRows; r++) {
      const bg = r % 2 === 1 ? 'background: rgba(0,0,0,0.02);' : '';
      html += `<tr style="${bg} border-bottom: 1px solid rgba(128,128,128,0.15);">`;
      for (let c = 0; c < tableCols; c++) {
        html += `<td style="padding: 10px 12px;">بيانات ${r + 1}-${c + 1}</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table><p><br></p>`;
    insertHtmlAtCursor(html);
    setTableModalOpen(false);
  };

  // Apply Template
  const handleApplyTemplate = (templateHtml: string) => {
    if (rawHtml.trim() && !window.confirm(isAr ? 'هل أنت متأكد من استبدال المحتوى الحالي بالقالب المحدد؟' : 'Are you sure you want to replace current content with this template?')) {
      return;
    }
    setRawHtml(templateHtml);
    onChange(templateHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = templateHtml;
    }
    setTemplatesModalOpen(false);
  };

  // Copy HTML
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download HTML file
  const handleDownloadHtml = () => {
    const blob = new Blob([rawHtml], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `article-${Date.now()}.html`;
    link.click();
  };

  // Metrics calculation
  const textContent = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent ? textContent.split(/\s+/).length : 0;
  const charCount = textContent.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Simulator width class
  const getSimulatorWidth = () => {
    switch (deviceSimulator) {
      case 'mobile':
        return 'max-w-[380px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl rounded-3xl p-4 my-4 bg-white dark:bg-[#070C14]';
      case 'tablet':
        return 'max-w-[768px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-xl rounded-2xl p-6 my-4 bg-white dark:bg-[#070C14]';
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#090E1A] shadow-lg transition-all duration-300 ${
        isFullScreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl' : 'relative w-full'
      }`}
      dir={dir}
    >
      {/* 1. Top Primary Header & Mode Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#050811]/80 backdrop-blur-md rounded-t-3xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'visual'
                ? 'bg-gradient-to-r from-[#002060] to-[#0070BA] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'محرر مرئي (WYSIWYG)' : 'Visual Editor'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'split'
                ? 'bg-gradient-to-r from-[#002060] to-[#0070BA] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isAr ? 'شاشة مقسمة + معاينة' : 'Split View'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'preview'
                ? 'bg-gradient-to-r from-[#002060] to-[#0070BA] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>{isAr ? 'معاينة الزائر الحية' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'code'
                ? 'bg-gradient-to-r from-[#002060] to-[#0070BA] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'كود HTML' : 'HTML Code'}</span>
          </button>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2">
          {allowTemplates && (
            <button
              type="button"
              onClick={() => setTemplatesModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'مكتبة القوالب' : 'Templates'}</span>
            </button>
          )}

          {viewMode === 'preview' && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeviceSimulator('desktop')}
                className={`p-1.5 rounded-lg ${deviceSimulator === 'desktop' ? 'bg-[#0070BA] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                title={isAr ? 'كمبيوتر مكتبي' : 'Desktop'}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceSimulator('tablet')}
                className={`p-1.5 rounded-lg ${deviceSimulator === 'tablet' ? 'bg-[#0070BA] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                title={isAr ? 'تابلت' : 'Tablet'}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceSimulator('mobile')}
                className={`p-1.5 rounded-lg ${deviceSimulator === 'mobile' ? 'bg-[#0070BA] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                title={isAr ? 'جوال' : 'Mobile'}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyHtml}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0070BA] transition-colors"
            title={isAr ? 'نسخ كود HTML' : 'Copy HTML'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0070BA] transition-colors"
            title={isAr ? 'تنزيل كملف HTML' : 'Download HTML'}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0070BA] transition-colors"
            title={isFullScreen ? (isAr ? 'تصغير' : 'Exit Fullscreen') : (isAr ? 'ملء الشاشة' : 'Fullscreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Visual Formatting Toolbar (Visible in Visual & Split modes) */}
      {(viewMode === 'visual' || viewMode === 'split') && (
        <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070C16] flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700 dark:text-slate-300 select-none">
          
          {/* Headings Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'heading' ? null : 'heading')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <span>{isAr ? 'تنسيق الفقرة' : 'Format'}</span>
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'heading' && (
              <div className="absolute top-full start-0 mt-1 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-30 space-y-1">
                <button
                  type="button"
                  onClick={() => applyHeading('h1')}
                  className="w-full text-start px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-base font-black text-slate-900 dark:text-white"
                >
                  عنوان رئيسي (H1)
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h2')}
                  className="w-full text-start px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-black text-slate-900 dark:text-white"
                >
                  عنوان فرعي 1 (H2)
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h3')}
                  className="w-full text-start px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black text-slate-900 dark:text-white"
                >
                  عنوان فرعي 2 (H3)
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('p')}
                  className="w-full text-start px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-normal text-slate-700 dark:text-slate-300"
                >
                  فقرة عادية (Paragraph)
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Basic Text Formatting Buttons */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'عريض (Ctrl+B)' : 'Bold'}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'مائل (Ctrl+I)' : 'Italic'}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'تسطير (Ctrl+U)' : 'Underline'}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'يتوسطه خط' : 'Strikethrough'}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Color & Highlight Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1"
              title={isAr ? 'لون النص' : 'Text Color'}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#0070BA] border border-white" />
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'color' && (
              <div className="absolute top-full start-0 mt-1 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-30 space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase px-2 py-1">لون النص:</div>
                {TEXT_COLORS.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      execCmd('foreColor', c.color);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-start px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: c.color }} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'محاذاة لليمين' : 'Align Right'}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'توسيط' : 'Align Center'}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'محاذاة لليسار' : 'Align Left'}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'قائمة نقطية' : 'Bullet List'}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'قائمة مرقمة' : 'Numbered List'}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'اقتباس مميز' : 'Blockquote'}
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Callout Alert Boxes */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'callout' ? null : 'callout')}
              className="px-2 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1"
              title={isAr ? 'صندوق تنبيه وملاحظة' : 'Insert Callout'}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{isAr ? 'تنبيه' : 'Callout'}</span>
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'callout' && (
              <div className="absolute top-full start-0 mt-1 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-30 space-y-1">
                <button
                  type="button"
                  onClick={() => insertCallout('info')}
                  className="w-full text-start px-2.5 py-1.5 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950 text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>ℹ️ إعلامي (Info)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout('success')}
                  className="w-full text-start px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✅ نجاح (Success)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout('warning')}
                  className="w-full text-start px-2.5 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>⚠️ تحذير (Warning)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout('danger')}
                  className="w-full text-start px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>🚨 هام (Critical)</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Insert Media & Objects */}
          <button
            type="button"
            onClick={() => setLinkModalOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'إدراج رابط' : 'Insert Link'}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'إدراج صورة' : 'Insert Image'}
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setVideoModalOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'تضمين فيديو يوتيوب' : 'Embed Video'}
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTableModalOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'إدراج جدول بيانات' : 'Insert Table'}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'فاصل أفقي' : 'Horizontal Divider'}
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Undo / Redo & Clear */}
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'تراجع (Ctrl+Z)' : 'Undo'}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title={isAr ? 'إعادة (Ctrl+Y)' : 'Redo'}
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('removeFormat')}
            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors"
            title={isAr ? 'مسح التنسيق' : 'Clear Formatting'}
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

        </div>
      )}

      {/* 3. Main Editor Work Area */}
      <div className={`flex-1 overflow-auto ${isFullScreen ? 'h-[calc(100vh-220px)]' : ''}`}>
        
        {/* VIEW 1: Visual Mode */}
        {viewMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            className="w-full p-6 sm:p-8 outline-none text-slate-900 dark:text-slate-100 leading-relaxed font-sans prose prose-slate dark:prose-invert max-w-none focus:ring-0 min-h-[360px]"
            style={{ minHeight }}
            dir={dir}
            dangerouslySetInnerHTML={{ __html: value || '' }}
          />
        )}

        {/* VIEW 2: Split Mode (Visual + Live Preview) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200 dark:divide-slate-800 min-h-[420px]">
            {/* Editor Half */}
            <div className="p-6 overflow-y-auto">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0070BA]" />
                <span>{isAr ? 'مساحة التحرير المرئي' : 'Visual Editor Area'}</span>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onBlur={handleEditorInput}
                className="w-full outline-none text-slate-900 dark:text-slate-100 leading-relaxed font-sans prose prose-slate dark:prose-invert max-w-none min-h-[360px]"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: value || '' }}
              />
            </div>

            {/* Preview Half */}
            <div className="p-6 bg-slate-50/50 dark:bg-[#060A13]/50 overflow-y-auto">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? 'المعاينة اللحظية المباشرة' : 'Live Real-time Preview'}</span>
              </div>
              <div
                className="prose prose-slate dark:prose-invert max-w-none text-slate-900 dark:text-slate-100"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: rawHtml || `<p class="text-slate-400 italic">${placeholder}</p>` }}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: Live Preview Mode (With Device Simulator) */}
        {viewMode === 'preview' && (
          <div className="p-6 sm:p-10 bg-slate-100/70 dark:bg-[#050810] min-h-[420px] overflow-auto flex justify-center">
            <div className={`transition-all duration-300 ${getSimulatorWidth()}`}>
              {/* Simulator Header if tablet/mobile */}
              {deviceSimulator !== 'desktop' && (
                <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 text-center">
                  <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {deviceSimulator === 'mobile' ? 'Mobile Viewport (375px)' : 'Tablet Viewport (768px)'}
                  </span>
                </div>
              )}

              <div
                className="prose prose-slate dark:prose-invert max-w-none text-slate-900 dark:text-slate-100"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: rawHtml || `<p class="text-slate-400 italic">${placeholder}</p>` }}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: Raw HTML Code View */}
        {viewMode === 'code' && (
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs min-h-[360px]">
            <textarea
              value={rawHtml}
              onChange={handleCodeChange}
              className="w-full h-full min-h-[360px] bg-transparent outline-none resize-y text-emerald-400 font-mono leading-relaxed p-2"
              placeholder="<!-- Write clean HTML here -->"
              dir="ltr"
              spellCheck={false}
            />
          </div>
        )}

      </div>

      {/* 4. Bottom Metrics & Status Bar */}
      <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#070C15] rounded-b-3xl flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        
        {/* Left: Metrics */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="font-mono font-black text-slate-900 dark:text-white">{wordCount}</span>
            <span>{isAr ? 'كلمة' : 'Words'}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono font-black text-slate-900 dark:text-white">{charCount}</span>
            <span>{isAr ? 'حرف' : 'Characters'}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5 text-[#0070BA] dark:text-sky-400">
            <span>⏱️ {readingTime}</span>
            <span>{isAr ? 'دقيقة قراءة مقدرة' : 'min read'}</span>
          </span>
        </div>

        {/* Right: Status badge */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 dark:text-slate-300 font-bold uppercase">
            {isAr ? 'المحرر المرئي نشط وجاهز' : 'Visual Engine Active'}
          </span>
        </div>

      </div>

      {/* --- MODAL 1: Insert Link Modal --- */}
      {linkModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-start">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#0070BA]" />
              <span>{isAr ? 'إدراج رابط تشعبي' : 'Insert Hyperlink'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'عنوان الرابط (URL):' : 'Link URL:'}
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'نص الرابط المعروض:' : 'Display Text:'}
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder={isAr ? 'اضغط هنا لزيارة الصفحة' : 'Click here to visit'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0070BA]"
                />
                <span>{isAr ? 'فتح في علامة تبويب جديدة (_blank)' : 'Open in new tab'}</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070BA] text-white hover:bg-[#005A96] shadow-md"
              >
                {isAr ? 'إدراج الرابط' : 'Insert Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Insert Image Modal --- */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-start">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0070BA]" />
              <span>{isAr ? 'إدراج صورة بالمحتوى' : 'Insert Image'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'رابط الصورة (URL أو مسار محلي):' : 'Image URL:'}
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/projects/project-1.jpg"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'النص البديل (Alt Text - للسيو):' : 'Alt Text (SEO):'}
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder={isAr ? 'مشروع سفلتة طريق بالرياض' : 'Road construction project'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'تعليق توضيحي أسفل الصورة (Caption):' : 'Caption:'}
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder={isAr ? 'المرحلة الأولى من أعمال كشط وسفلتة المحور' : 'Phase 1 asphalt milling work'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'محاذاة وحجم الصورة:' : 'Alignment & Width:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'center', label: isAr ? 'وسط' : 'Center' },
                    { id: 'full', label: isAr ? 'عرض كامل' : 'Full Width' },
                    { id: 'right', label: isAr ? 'يمين' : 'Right' },
                    { id: 'left', label: isAr ? 'يسار' : 'Left' },
                  ].map((al) => (
                    <button
                      key={al.id}
                      type="button"
                      onClick={() => setImageAlign(al.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        imageAlign === al.id
                          ? 'bg-[#0070BA] text-white border-[#0070BA]'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {al.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070BA] text-white hover:bg-[#005A96] shadow-md"
              >
                {isAr ? 'إدراج الصورة' : 'Insert Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Insert Video Modal --- */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-start">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#0070BA]" />
              <span>{isAr ? 'تضمين فيديو يوتيوب' : 'Embed YouTube Video'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'رابط الفيديو على YouTube:' : 'YouTube Video URL:'}
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=XXXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleInsertVideo}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070BA] text-white hover:bg-[#005A96] shadow-md"
              >
                {isAr ? 'تضمين الفيديو' : 'Embed Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Insert Table Modal --- */}
      {tableModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-start">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-[#0070BA]" />
              <span>{isAr ? 'إدراج جدول بيانات' : 'Insert Data Table'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'عدد الصفوف (Rows):' : 'Rows Count:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'عدد الأعمدة (Columns):' : 'Columns Count:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={tableHasHeader}
                    onChange={(e) => setTableHasHeader(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0070BA]"
                  />
                  <span>{isAr ? 'تضمين صف عناوين بارز (Header Row)' : 'Include Header Row'}</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070BA] text-white hover:bg-[#005A96] shadow-md"
              >
                {isAr ? 'إدراج الجدول' : 'Insert Table'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: Templates Library Modal --- */}
      {templatesModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 text-start max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{isAr ? 'مكتبة القوالب الجاهزة للمحرر' : 'Pre-built Editor Templates'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setTemplatesModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'اختر قالباً لبدء كتابة مقال أو تقرير أو بيان رسمي بهيكل وتنسيقات جاهزة معتمدة:'
                : 'Select a template to kickstart writing with pre-formatted sections and styling:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {EDITOR_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-[#0070BA] dark:hover:border-sky-400 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0070BA] dark:group-hover:text-sky-400 transition-colors">
                      {isAr ? tmpl.titleAr : tmpl.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isAr ? tmpl.descAr : tmpl.descEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.html)}
                    className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-[#0070BA] hover:text-white dark:hover:bg-[#0070BA] transition-all shadow-xs"
                  >
                    {isAr ? 'استخدام القالب' : 'Use Template'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
