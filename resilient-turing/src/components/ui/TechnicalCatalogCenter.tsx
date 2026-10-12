"use client";

import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Award, ShieldCheck, CheckCircle2, 
  ExternalLink, Sparkles, Building2, Eye, X, FileCheck, Landmark,
  Layers, HardHat, ShieldAlert, Cpu, Search, Filter, Truck, MapPin, BadgeCheck
} from 'lucide-react';
import CorporateProfileModal from './CorporateProfileModal';

interface TechnicalCatalogCenterProps {
  locale?: 'ar' | 'en';
}

export function TechnicalCatalogCenter({ locale = 'ar' }: TechnicalCatalogCenterProps) {
  const isAr = locale === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'barrier81' | 'barrier100' | 'asphalt'>('barrier81');

  // Master Sovereign Documents Database (All 18 Documents Sourced Directly from ID Folder)
  const allDocuments = useMemo(() => [
    {
      id: 'doc-cr-v5',
      titleAr: 'السجل التجاري الرئيسي (النسخة الخامسة المحدثة 2026)',
      titleEn: 'Main Commercial Registration (Version 5 Updated)',
      code: 'CR 1010720712-V5',
      idNumber: '1010720712',
      issuerAr: 'وزارة التجارة — المملكة العربية السعودية',
      issuerEn: 'Ministry of Commerce — Kingdom of Saudi Arabia',
      issueDate: '2021-08-15',
      expiryDate: '2026-08-14',
      category: 'official',
      categoryLabelAr: 'سجل تجاري حكومي',
      categoryLabelEn: 'Government CR',
      scopeAr: 'السجل التجاري الرسمي المحدث لشركة هضاب الخليج العربي للمقاولات المعتمد لتنفيذ أعمال المقاولات العامة والبنية التحتية الطرق وتصريف السيول.',
      scopeEn: 'Updated official commercial register for Arabian Gulf Hills Contracting Co. authorized for infrastructure & general contracting.',
      color: 'from-[#0070BA]/20 via-[#0070BA]/5 to-transparent',
      borderColor: 'border-[#0070BA]/30 hover:border-[#0070BA]',
      textColor: 'text-[#0070BA] dark:text-sky-400',
      badgeBg: 'bg-sky-500/10',
      filePath: '/documents/commercial-registration-v5.pdf'
    },
    {
      id: 'doc-local-content',
      titleAr: 'شهادة نسبة المحتوى المحلي المعتمدة 52.97%',
      titleEn: 'Certified Local Content Ratio 52.97%',
      code: 'LCGPA 216243',
      idNumber: '216243',
      issuerAr: 'هيئة المحتوى المحلي والمشتريات الحكومية (LCGPA)',
      issuerEn: 'Local Content & Government Procurement Authority',
      issueDate: '2024-01-01',
      expiryDate: '2026-12-31',
      category: 'classification',
      categoryLabelAr: 'اعتماد سيادي',
      categoryLabelEn: 'Sovereign Accreditation',
      scopeAr: 'شهادة رسمية تمكن الشركة من الأفضلية في العقود السيادية والمناقصات الحكومية بنسبة محتوى محلي 52.97%.',
      scopeEn: 'Official certification granting preference in sovereign tenders with 52.97% verified local content ratio.',
      color: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10',
      filePath: '/documents/local-content-5297.pdf'
    },
    {
      id: 'doc-tga-naqel',
      titleAr: 'ترخيص الهيئة العامة للنقل (نقل البضائع والمعدات)',
      titleEn: 'Transport General Authority Freight License (TGA Naqel)',
      code: 'TGA-NAQEL-8840',
      idNumber: 'TGA-8840192',
      issuerAr: 'الهيئة العامة للنقل — المملكة العربية السعودية',
      issuerEn: 'Transport General Authority (TGA KSA)',
      issueDate: '2023-04-12',
      expiryDate: '2026-04-11',
      category: 'official',
      categoryLabelAr: 'ترخيص نقل وتأهيل أسطول',
      categoryLabelEn: 'Fleet Transport License',
      scopeAr: 'ترخيص ساري وموثق من هيئة النقل يسمح للشركة بنقل نواتج الحفر والهدميات ورصف الأسفلت وتشغيل أسطول الآليات الثقيلة بالأمانات.',
      scopeEn: 'Official Transport General Authority license permitting heavy machinery operation, asphalt transport, and debris hauling across KSA.',
      color: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10',
      filePath: '/documents/tga-naqel-transport-license.pdf'
    },
    {
      id: 'doc-monshaat',
      titleAr: 'شهادة تصنيف المنشأة — الهيئة العامة للمنشآت (منشآت)',
      titleEn: 'Monshaat Enterprise Classification Certificate',
      code: 'MONSHAAT-21312',
      idNumber: '2131238963',
      issuerAr: 'الهيئة العامة للمنشآت الصغيرة والمتوسطة (منشآت)',
      issuerEn: 'Small and Medium Enterprises General Authority (Monshaat)',
      issueDate: '2023-09-10',
      expiryDate: '2026-09-10',
      category: 'classification',
      categoryLabelAr: 'اعتماد منشآت',
      categoryLabelEn: 'Monshaat Accreditation',
      scopeAr: 'شهادة تصنيف رسمية تثبت الجاهزية الفنية والتشغيلية والائتمانية للشركة لتنفيذ مشاريع البنية التحتية والتشغيل الصيانة.',
      scopeEn: 'Official enterprise qualification certification validating financial and technical execution standards.',
      color: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-500/10',
      filePath: '/documents/monshaat-classification.pdf'
    },
    {
      id: 'doc-cml-balady',
      titleAr: 'الرخصة التجارية الموحدة ببلدية أمانة الرياض (بلدي CML)',
      titleEn: 'Riyadh Municipality Commercial License (Balady CML)',
      code: 'BALADY-CML-2024',
      idNumber: '440192831',
      issuerAr: 'وزارة الشؤون البلدية والقروية والإسكان — أمانة منطقة الرياض',
      issuerEn: 'Ministry of Municipal & Rural Affairs and Housing (Riyadh Municipality)',
      issueDate: '2022-03-01',
      expiryDate: '2027-03-01',
      category: 'official',
      categoryLabelAr: 'رخصة بلدي موحدة',
      categoryLabelEn: 'Municipal CML License',
      scopeAr: 'الرخصة التجارية الموحدة المقررة لتشغيل مواقع الأسطول والورش الفنية ومحطات تصنيع الحواجز الخرسانية بمدينة الرياض.',
      scopeEn: 'Unified commercial facility license authorizing technical workshops, concrete casting yards, and municipal operations in Riyadh.',
      color: 'from-blue-600/20 via-blue-600/5 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      textColor: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-500/10',
      filePath: '/documents/balady-cml-license.pdf'
    },
    {
      id: 'doc-address-proof',
      titleAr: 'إثبات العنوان الوطني والتسجيل المكاني الرسمي (سبل)',
      titleEn: 'Saudi Post (SPL) National Address Verification',
      code: 'SPL-ADDR-101',
      idNumber: 'CR-ADDR-70236',
      issuerAr: 'سبل — البريد السعودي والشركة السعودية للخدمات البريدية',
      issuerEn: 'Saudi Post & Logistics (SPL)',
      issueDate: '2023-01-10',
      expiryDate: '2027-01-10',
      category: 'official',
      categoryLabelAr: 'عنوان وطني موثق',
      categoryLabelEn: 'National Address Proof',
      scopeAr: 'شهادة إثبات العنوان الوطني والتسجيل الجغرافي المعتمد للمقر الرئيسي بالرياض والتواصل المؤسسي الحكومي.',
      scopeEn: 'Official verified national address certificate confirming corporate headquarters geographic registration in Riyadh.',
      color: 'from-teal-500/20 via-teal-500/5 to-transparent',
      borderColor: 'border-teal-500/30 hover:border-teal-400',
      textColor: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-500/10',
      filePath: '/documents/national-address-proof.pdf'
    },
    {
      id: 'doc-momrah-class',
      titleAr: 'شهادة تصنيف المقاولين — وزارة البلديات والإسكان',
      titleEn: 'MOMRAH Contractor Classification Certificate',
      code: 'MOMRAH-CLASS-213',
      idNumber: '2131238963',
      issuerAr: 'وزارة الشؤون البلدية والقروية والإسكان (وكالة التصنيف)',
      issuerEn: 'Ministry of Municipal & Rural Affairs and Housing (MOMRAH)',
      issueDate: '2023-09-10',
      expiryDate: '2026-09-10',
      category: 'classification',
      categoryLabelAr: 'تصنيف بلدي',
      categoryLabelEn: 'Municipal Classification',
      scopeAr: 'شهادة التصنيف المعتمدة للمنشآت الإنشائية لتنفيذ مشاريع الطرق والشوارع وشبكات تصريف مياه الأمطار والسيول.',
      scopeEn: 'Official classified contractor certification for municipal infrastructure, road paving, and stormwater drainage.',
      color: 'from-blue-600/20 via-blue-600/5 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      textColor: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-500/10',
      filePath: '/documents/momrah-contractor-classification.pdf'
    },
    {
      id: 'doc-zatca-vat',
      titleAr: 'شهادة تسجيل ضريبة القيمة المضافة (VAT)',
      titleEn: 'VAT Tax Registration Certificate',
      code: 'VAT 3109890099',
      idNumber: '310989009900003',
      issuerAr: 'هيئة الزكاة والضريبة والجمارك (ZATCA)',
      issuerEn: 'Zakat, Tax and Customs Authority (ZATCA)',
      issueDate: '2021-06-15',
      expiryDate: '2027-12-31',
      category: 'classification',
      categoryLabelAr: 'تسجيل ضريبي',
      categoryLabelEn: 'VAT Tax Clearance',
      scopeAr: 'شهادة تسجيل رسمية لدى هيئة الزكاة والضريبة والجمارك تثبت الامتثال الضريبي الكامل وتطبيق ضريبة القيمة المضافة.',
      scopeEn: 'Official ZATCA Value Added Tax registration certificate for corporate tax compliance.',
      color: 'from-violet-500/20 via-violet-500/5 to-transparent',
      borderColor: 'border-violet-500/30 hover:border-violet-400',
      textColor: 'text-violet-600 dark:text-violet-400',
      badgeBg: 'bg-violet-500/10',
      filePath: '/documents/zatca-vat-certificate.pdf'
    },
    {
      id: 'doc-zatca-zakat',
      titleAr: 'شهادة الزكاة والالتزام الضريبي المعتمدة',
      titleEn: 'Zakat & Tax Compliance Certificate',
      code: 'ZAKAT Z-310989',
      idNumber: '310989009900003',
      issuerAr: 'هيئة الزكاة والضريبة والجمارك (ZATCA)',
      issuerEn: 'Zakat, Tax and Customs Authority (ZATCA)',
      issueDate: '2024-01-01',
      expiryDate: '2026-04-30',
      category: 'classification',
      categoryLabelAr: 'شهادة زكوية',
      categoryLabelEn: 'Zakat Clearance',
      scopeAr: 'شهادة خلو طرف وسداد زكاة رسمية سارية تتيح للشركة التقدم للمناقصات والمشاريع الحكومية والسيادية.',
      scopeEn: 'Official Zakat clearance certificate required for Saudi government project bidding.',
      color: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10',
      filePath: '/documents/zatca-zakat-certificate.pdf'
    },
    {
      id: 'doc-sca',
      titleAr: 'شهادة تصنيف وترخيص الهيئة السعودية للمقاولين (SCA)',
      titleEn: 'Saudi Contractors Authority (SCA) License',
      code: 'SCA-40982-2024',
      idNumber: 'SCA-40982',
      issuerAr: 'الهيئة السعودية للمقاولين (SCA)',
      issuerEn: 'Saudi Contractors Authority (SCA)',
      issueDate: '2023-05-10',
      expiryDate: '2026-05-09',
      category: 'classification',
      categoryLabelAr: 'عضوية الهيئة',
      categoryLabelEn: 'SCA Membership',
      scopeAr: 'تصنيف وترخيص معتمد لشركة هضاب الخليج للتنفيذ الميداني لمشاريع الطرق، تصريف السيول، وتشغيل المباني الحكومية.',
      scopeEn: 'Certified qualification for executing major municipal road paving, stormwater drainage, and government facility contracts.',
      color: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      textColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/10',
      filePath: '/documents/saudi-contractors-authority.pdf'
    },
    {
      id: 'doc-identity-attachments',
      titleAr: 'وثيقة ملحقات الهوية التجارية والتأهيل المؤسسي 2023',
      titleEn: 'Corporate Identity & Qualification Dossier Attachments',
      code: 'CORP-ID-2023',
      idNumber: 'QUAL-ID-2023',
      issuerAr: 'إدارة الاتصال المؤسسي والهوية التجارية بالشركة',
      issuerEn: 'Corporate Communications & Branding Directorate',
      issueDate: '2023-01-01',
      expiryDate: '2026-12-31',
      category: 'official',
      categoryLabelAr: 'ملحقات الهوية',
      categoryLabelEn: 'Identity Attachments',
      scopeAr: 'الملف التوثيقي الرسمي لشعارات وعلامات ونماذج التأهيل المؤسسي لشركة هضاب الخليج العربي للمقاولات.',
      scopeEn: 'Official documentation for corporate visual identity, branding guidelines, and qualification attachments.',
      color: 'from-sky-500/20 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-500/30 hover:border-sky-400',
      textColor: 'text-[#0070BA] dark:text-sky-400',
      badgeBg: 'bg-sky-500/10',
      filePath: '/documents/corporate-identity-attachments.pdf'
    },
    {
      id: 'doc-nca-cyber',
      titleAr: 'شهادة الامتثال بالأمن السيبراني (NCA)',
      titleEn: 'National Cybersecurity Authority Compliance',
      code: 'NCA-CYB-2025',
      idNumber: 'NCA-CYB-2025',
      issuerAr: 'الهيئة الوطنية للأمن السيبراني — المملكة العربية السعودية',
      issuerEn: 'National Cybersecurity Authority (NCA KSA)',
      issueDate: '2025-01-01',
      expiryDate: '2027-12-31',
      category: 'official',
      categoryLabelAr: 'أمن وسيبراني',
      categoryLabelEn: 'Cybersecurity Compliance',
      scopeAr: 'التزام كامل بضوابط الأمن السيبراني الأساسية وحماية الأنظمة الرقمية وأسطول التتبع اللحظي للشركة.',
      scopeEn: 'Compliance with Saudi NCA cybersecurity controls protecting digital assets and IoT fleet telematics.',
      color: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-500/10',
      filePath: '/documents/nca-cybersecurity-certificate.pdf'
    },
    {
      id: 'doc-chamber',
      titleAr: 'شهادة اشتراك الغرفة التجارية بالرياض (الدرجة الممتازة)',
      titleEn: 'Riyadh Chamber of Commerce Membership',
      code: 'RCC 394012',
      idNumber: '394012',
      issuerAr: 'الغرفة التجارية بالرياض — المملكة العربية السعودية',
      issuerEn: 'Riyadh Chamber of Commerce & Industry',
      issueDate: '2022-01-15',
      expiryDate: '2027-01-14',
      category: 'official',
      categoryLabelAr: 'اشتراك رسمي',
      categoryLabelEn: 'Chamber Membership',
      scopeAr: 'اشتراك ساري ومعتمد لدى الغرفة التجارية بالرياض للدرجة الممتازة في تخصصات المقاولات العامة والبنية التحتية.',
      scopeEn: 'First-class membership certificate with Riyadh Chamber of Commerce & Industry.',
      color: 'from-[#0070BA]/20 via-[#0070BA]/5 to-transparent',
      borderColor: 'border-sky-500/30 hover:border-sky-400',
      textColor: 'text-[#0070BA] dark:text-sky-400',
      badgeBg: 'bg-sky-500/10',
      filePath: '/documents/chamber-of-commerce.pdf'
    },
    {
      id: 'iso-9001',
      titleAr: 'شهادة نظام إدارة الجودة ISO 9001:2015',
      titleEn: 'ISO 9001:2015 Quality Management System',
      code: 'ISO 9001:2015',
      idNumber: 'QMS-9001-2024',
      issuerAr: 'المجلس الدولي لشهادات الآيزو والمسجل المعتمد',
      issuerEn: 'International ISO Registrar & Accreditation Council',
      issueDate: '2024-03-20',
      expiryDate: '2027-03-19',
      category: 'iso',
      categoryLabelAr: 'جودة دولية',
      categoryLabelEn: 'International ISO',
      scopeAr: 'تطبيق أعلى معايير ضبط وضمان الجودة في تنفيذ مشاريع الطرق، الكشط، شبكات تصريف السيول، والحواجز الخرسانية.',
      scopeEn: 'Quality assurance across road paving, milling, stormwater drainage, and precast concrete barrier production.',
      color: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10',
      filePath: '/documents/iso-9001.pdf'
    },
    {
      id: 'iso-14001',
      titleAr: 'شهادة نظام إدارة البيئة ISO 14001:2015',
      titleEn: 'ISO 14001:2015 Environmental Management System',
      code: 'ISO 14001:2015',
      idNumber: 'EMS-14001-2024',
      issuerAr: 'المجلس الدولي لشهادات الآيزو والمسجل المعتمد',
      issuerEn: 'International ISO Registrar & Accreditation Council',
      issueDate: '2024-03-20',
      expiryDate: '2027-03-19',
      category: 'iso',
      categoryLabelAr: 'استدامة بيئية',
      categoryLabelEn: 'Environmental ISO',
      scopeAr: 'الالتزام الكامل بالحفاظ على البيئة، تدوير نواتج كشط الأسفلت، وتقليل الانبعاثات الكربونية في جميع المواقع الميدانية.',
      scopeEn: 'Environmental stewardship, asphalt milling material recycling, and low-carbon field construction operations.',
      color: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10',
      filePath: '/documents/iso-14001.pdf'
    },
    {
      id: 'iso-45001',
      titleAr: 'شهادة إدارة السلامة والصحة المهنية ISO 45001:2018',
      titleEn: 'ISO 45001:2018 Occupational Health & Safety',
      code: 'ISO 45001:2018',
      idNumber: 'OHSAS-45001-2024',
      issuerAr: 'المجلس الدولي لشهادات الآيزو والمسجل المعتمد',
      issuerEn: 'International ISO Registrar & Accreditation Council',
      issueDate: '2024-03-20',
      expiryDate: '2027-03-19',
      category: 'iso',
      categoryLabelAr: 'سلامة مهنية',
      categoryLabelEn: 'OH&S Safety ISO',
      scopeAr: 'تأمين بيئة عمل آمنة خالية من الحوادث للكوادر الفنية والتشغيلية وتطبيق اشتراطات السلامة المهنية الدولية.',
      scopeEn: 'Zero-accident safety protocols, field crew protection, and international HSE compliance across KSA sites.',
      color: 'from-sky-500/20 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-500/30 hover:border-sky-400',
      textColor: 'text-[#0070BA] dark:text-sky-400',
      badgeBg: 'bg-sky-500/10',
      filePath: '/documents/iso-45001.pdf'
    },
    {
      id: 'iso-26000',
      titleAr: 'شهادة المسؤولية الاجتماعية للحوكمة ISO 26000',
      titleEn: 'ISO 26000 Corporate Social Responsibility',
      code: 'ISO 26000',
      idNumber: 'CSR-26000-2024',
      issuerAr: 'المنظمة الدولية للمعايير (ISO)',
      issuerEn: 'International Organization for Standardization',
      issueDate: '2024-05-01',
      expiryDate: '2027-04-30',
      category: 'iso',
      categoryLabelAr: 'مسؤولية وحوكمة',
      categoryLabelEn: 'Governance ISO',
      scopeAr: 'تعزيز الشفافية والحوكمة المؤسسية وتنمية المجتمع ودعم المبادرات الوطنية البيئية والاجتماعية.',
      scopeEn: 'Corporate governance, transparency, local community development, and sustainable social impact.',
      color: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      textColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/10',
      filePath: '/documents/iso-26000.pdf'
    },
    {
      id: 'iso-31000',
      titleAr: 'شهادة إطار إدارة المخاطر ISO 31000:2018',
      titleEn: 'ISO 31000:2018 Enterprise Risk Management',
      code: 'ISO 31000:2018',
      idNumber: 'RM-31000-2024',
      issuerAr: 'المنظمة الدولية للمعايير (ISO)',
      issuerEn: 'International Organization for Standardization',
      issueDate: '2024-05-01',
      expiryDate: '2027-04-30',
      category: 'iso',
      categoryLabelAr: 'إدارة مخاطر',
      categoryLabelEn: 'Risk Management',
      scopeAr: 'تقييم وإدارة المخاطر التشغيلية والمالية للمشاريع السيادية وضمان استمرارية الأعمال تحت مختلف الظروف.',
      scopeEn: 'Risk mitigation, operational continuity, and financial vulnerability management for major tenders.',
      color: 'from-rose-500/20 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/30 hover:border-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10',
      filePath: '/documents/iso-31000.pdf'
    }
  ], []);

  // Technical Specs Sheets Data
  const specsData = {
    barrier81: {
      titleAr: 'حواجز نيوجيرسي خرسانية مسلحة (ارتفاع 81 سم)',
      titleEn: 'Standard Precast Barrier 81cm',
      specs: [
        { keyAr: 'الارتفاع الكلي', valueAr: '810 ملم (81 سم)', keyEn: 'Overall Height', valueEn: '810 mm' },
        { keyAr: 'عرض القاعدة السفلى', valueAr: '610 ملم (61 سم)', keyEn: 'Base Width', valueEn: '610 mm' },
        { keyAr: 'عرض القمة العليا', valueAr: '150 ملم (15 سم)', keyEn: 'Top Width', valueEn: '150 mm' },
        { keyAr: 'إجهاد كسر الخرسانة (Compressive Strength)', valueAr: '40 - 50 ميجاباسكال (C40/50)', keyEn: 'Concrete Strength', valueEn: '40-50 MPa' },
        { keyAr: 'نوع حديد التسليح', valueAr: 'حديد طلاء إيبوكسي مقاوم للصدأ والتآكل', keyEn: 'Rebar Type', valueEn: 'Epoxy Coated Deformed Bars' },
        { keyAr: 'الاعتماد التقني', valueAr: 'معتمد لدى أمانة الرياض ووزارة النقل للمسارات الحضرية', keyEn: 'Approval Authority', valueEn: 'MOT & Riyadh Municipality' },
      ]
    },
    barrier100: {
      titleAr: 'حواجز نيوجيرسي عالية التحمل (ارتفاع 100 سم)',
      titleEn: 'Heavy-Duty Highway Barrier 100cm',
      specs: [
        { keyAr: 'الارتفاع الكلي', valueAr: '1000 ملم (100 سم)', keyEn: 'Overall Height', valueEn: '1000 mm' },
        { keyAr: 'عرض القاعدة السفلى', valueAr: '750 ملم (75 سم)', keyEn: 'Base Width', valueEn: '750 mm' },
        { keyAr: 'مقاومة الصدمات الديناميكية', valueAr: 'مصمم لاستيعاب صدمات الشاحنات والآليات عالية السرعة', keyEn: 'Impact Class', valueEn: 'High-Speed Heavy Vehicle Crash Standard' },
        { keyAr: 'درجة الخرسانة والخلطة', valueAr: 'خرسانة مسبقة الصنع معالجة بالبخار (Steam Cured C50)', keyEn: 'Concrete Mix', valueEn: 'Precast Steam-Cured C50' },
        { keyAr: 'نظام الربط والتجميع', valueAr: 'وصلات حديدية أفقية متداخلة للتثبيت الشريطي', keyEn: 'Joint System', valueEn: 'Interlocking Pin & Loop Assembly' },
        { keyAr: 'نطاق الاستخدام', valueAr: 'الطرق السريعة، الأنفاق، ومناطق التحويلات الميدانية الكبرى', keyEn: 'Application Range', valueEn: 'Highways, Tunnels & Critical Traffic Diversions' },
      ]
    },
    asphalt: {
      titleAr: 'المواصفات القياسية لكشط وسفلتة الطرق',
      titleEn: 'Road Paving & Milling Specifications',
      specs: [
        { keyAr: 'عمق الكشط الميكانيكي', valueAr: 'من 50 ملم إلى 100 ملم بآليات كشط رقمية ذات حساسات ليزر', keyEn: 'Milling Depth', valueEn: '50mm - 100mm with Digital Laser Milling' },
        { keyAr: 'نوع الطبقة الأسفلتية الرابطة', valueAr: 'خلطة أسفلتية ساخنة (Base Course Class B / Class A)', keyEn: 'Base Course', valueEn: 'Hot Mix Asphalt Class B/A' },
        { keyAr: 'درجة دك واختبار الأسفلت (Compaction Ratio)', valueAr: 'لا تقل عن 98% من الكثافة المختبرية المعتمدة (Marshall Density)', keyEn: 'Compaction', valueEn: '≥ 98% Marshall Density' },
        { keyAr: 'مادة الرش اللاصق (Tack Coat)', valueAr: 'مستحلب أسفلتي سريع التجمد (RC-70 / K1-70)', keyEn: 'Tack Coat', valueEn: 'Asphalt Emulsion RC-70 / K1-70' },
        { keyAr: 'مواصفات البردورات والإنترلوك', valueAr: 'بردورات خرسانية مسبقة الصنع ومقاومة للأملاح والأحماض', keyEn: 'Kerbs & Interlock', valueEn: 'Sulfate Resistant Precast Concrete Kerbs' },
        { keyAr: 'التحكم بالمنسوب والميول', valueAr: 'ضبط الميول العرضية لمنع تجمع مياه الأمطار بدقة ±2 ملم', keyEn: 'Slope Control', valueEn: 'Cross-Slope Precision ±2mm for Water Flow' },
      ]
    }
  };

  // Filtered documents calculation
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.titleAr.toLowerCase().includes(q) ||
        doc.titleEn.toLowerCase().includes(q) ||
        doc.issuerAr.toLowerCase().includes(q) ||
        doc.idNumber.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allDocuments, selectedCategory, searchQuery]);

  const handleDownloadFile = (filePath: string, filename: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Category Tab Options
  const categoryTabs = [
    { key: 'all', labelAr: `جميع الوثائق والملفات (${allDocuments.length})`, labelEn: `All Documents (${allDocuments.length})`, icon: <Layers className="w-4 h-4" /> },
    { key: 'official', labelAr: `السجلات والتراخيص الحكومية (${allDocuments.filter(d=>d.category==='official').length})`, labelEn: 'Official Licenses & CR', icon: <Landmark className="w-4 h-4" /> },
    { key: 'classification', labelAr: `التصنيف والاعتمادات والزكاة (${allDocuments.filter(d=>d.category==='classification').length})`, labelEn: 'Classifications & ZATCA', icon: <FileCheck className="w-4 h-4" /> },
    { key: 'iso', labelAr: `شهادات الآيزو الـ 5 الدولية (${allDocuments.filter(d=>d.category==='iso').length})`, labelEn: '5 ISO Certifications', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0B1120] dark:to-[#070B14] relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80 text-start" suppressHydrationWarning>
      
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0070BA]/10 dark:bg-sky-500/10 border border-[#0070BA]/30 dark:border-sky-500/30 text-[#0070BA] dark:text-sky-400 text-xs font-black uppercase tracking-widest shadow-md">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{isAr ? "مركز الكتالوجات والمواصفات الهندسية والاعتمادات السيادية" : "Technical Specs & Sovereign Accreditations Center"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {isAr ? "الكتالوج التجاري المعتمد والوثائق السيادية والتراخيص" : "Official Corporate Catalog & Sovereign Certifications"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            {isAr
              ? "منظومة توثيقية رقمية شاملة مستخرجة ومحدثة مباشرة من مجلد الاعتمادات الرسمية (ID)، تتيح معاينة وتنزيل السجلات التجاري المحدثة، ترخيص هيئة النقل، تصنيف منشآت، شهادة المحتوى المحلي 52.97%، وشهادات الآيزو الـ 5 الدولية."
              : "Unified digital accreditation library directly synced from our official sovereign identity repository (ID folder), providing download & verification for updated CR, TGA transport license, Monshaat classification, 52.97% local content ratio, and 5 international ISO standards."}
          </p>
        </div>

        {/* TOP FEATURED DUAL BANNER: Official Profile Download & Local Content Accreditation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Official Profile PDF Download Box (7 Cols) */}
          <div className="lg:col-span-7 relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-500/30 p-8 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-sky-500/20 text-[#0070BA] dark:text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/30">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isAr ? "الكتالوج التجاري الرسمي 2026" : "Official Corporate Profile 2026"}</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  VERSION 2026.1
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                  {isAr ? "الكتالوج التعريفي والملف التأهيلي الرسمي للشركة" : "Arabian Gulf Hills Official Prequalification Dossier"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                  {isAr
                    ? "ملف متكامل بمواصفات عالية الجودة جاهز للطباعة والتقديم للمناقصات والاعتمادات الرسمية مع أمانة منطقة الرياض والوزارات والجهات السيادية."
                    : "Complete high-resolution prequalification dossier certified for government tenders and corporate client prequalification."}
                </p>
              </div>

              {/* Badges Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "عدد الصفحات" : "Pages"}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">32 {isAr ? "صفحة" : "pgs"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "حجم الملف" : "File Size"}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">12.4 MB</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "الصيغة" : "Format"}</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">PDF High-Res</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "الحالة" : "Status"}</span>
                  <span className="text-sm font-black text-[#0070BA] dark:text-sky-400">{isAr ? "معتمد" : "Certified"}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-8 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <a
                href="/documents/corporate-profile-2026.pdf"
                download="Arabian-GulfHILLS-Profile-2026.pdf"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0070BA] to-[#002060] dark:from-[#00B0F0] dark:to-[#002060] hover:from-sky-600 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? "تحميل الكتالوج التجاري والتعريفي (PDF)" : "Download Corporate Catalog (PDF)"}</span>
              </a>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#0070BA] dark:text-sky-400" />
                <span>{isAr ? "معاينة الملف التفاعلي" : "Interactive PDF Preview"}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Local Content Certificate #216243 (5 Cols) */}
          <div className="lg:col-span-5 relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-emerald-500/40 p-8 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{isAr ? "اعتماد المحتوى المحلي السيادي" : "Sovereign Local Content"}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                  52.97% RATIO
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {isAr ? "شهادة المحتوى المحلي المعتمدة" : "Certified Local Content Ratio"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  {isAr
                    ? "حصلت الشركة على شهادة المحتوى المحلي بنسبة 52.97% المعتمدة من هيئة المحتوى المحلي والمشتريات الحكومية (LCGPA) تمكيناً للرؤية الوطنية 2030."
                    : "Official Local Content certificate issued by Local Content and Government Procurement Authority (LCGPA)."}
                </p>
              </div>

              {/* Local Content Spec Details */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-medium">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "رقم الشهادة المعتمدة:" : "Certificate No:"}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">#216243</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "جهة الإصدار:" : "Issuing Authority:"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{isAr ? "هيئة المحتوى المحلي (LCGPA)" : "LCGPA Authority"}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "السجل التجاري:" : "Commercial CR:"}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1010720712</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "الرقم الموحد:" : "Unified No:"}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">7023600179</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "اعتماد رسمي يسري في كافة المناقصات" : "Government Tender Qualified"}</span>
              </div>
              <button
                onClick={() => handleDownloadFile('/documents/local-content-5297.pdf', 'Local-Content-Certificate-216243.pdf')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? "تحميل الشهادة" : "Download Cert"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث باسم المستند، الرقم، أو جهة الإصدار...' : 'Search documents by title, ref no...'}
                className="w-full ps-11 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0070BA] dark:focus:border-sky-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {categoryTabs.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-[#0070BA] dark:bg-sky-500 text-white dark:text-slate-950 border-transparent shadow-lg'
                        : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.icon}
                    <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MASTER DOCUMENTS GRID SHOWCASE */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-500" />
              <span>{isAr ? `قائمة المستندات والوثائق المعتمدة بالكامل (${filteredDocuments.length})` : `Verified Sovereign Documents (${filteredDocuments.length})`}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              {isAr ? "محدثة ومطابقة لمجلد ID" : "Synced with ID Folder"}
            </span>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16 bg-white/90 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <Filter className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {isAr ? "لا توجد مستندات تطابق محددات البحث الحالية." : "No documents match your search criteria."}
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-3 px-4 py-2 rounded-xl bg-sky-500/10 text-[#0070BA] dark:text-sky-400 text-xs font-bold"
              >
                {isAr ? "إعادة ضبط البحث" : "Reset Filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((cert) => (
                <div
                  key={cert.id}
                  className={`relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border ${cert.borderColor} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 shadow-xl dark:shadow-2xl flex flex-col justify-between backdrop-blur-xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-xl ${cert.badgeBg} ${cert.textColor} text-xs font-black font-mono border ${cert.borderColor}`}>
                        {cert.code}
                      </span>
                      <div className={`w-10 h-10 rounded-2xl ${cert.badgeBg} border ${cert.borderColor} flex items-center justify-center ${cert.textColor}`}>
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                        {isAr ? cert.titleAr : cert.titleEn}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {isAr ? cert.scopeAr : cert.scopeEn}
                      </p>
                    </div>

                    {/* Cert Meta */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-[11px] space-y-1.5 font-mono text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>{isAr ? "الرقم المرجعي:" : "Ref ID:"}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{cert.idNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isAr ? "جهة الإصدار:" : "Issuer:"}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{isAr ? cert.issuerAr : cert.issuerEn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isAr ? "تاريخ السريان:" : "Valid Until:"}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{cert.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs font-bold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? "عرض التفاصيل" : "View Details"}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(cert.filePath, `${cert.id}.pdf`)}
                      className={`px-3.5 py-1.5 rounded-xl ${cert.badgeBg} ${cert.textColor} text-xs font-bold border ${cert.borderColor} hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer shadow-sm`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? "تنزيل PDF" : "PDF"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRECAST CONCRETE & ROAD TECHNICAL SPECIFICATIONS TAB SHEET */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <Cpu className="w-6 h-6 text-[#0070BA] dark:text-sky-400" />
                <span>{isAr ? "المواصفات الفنية والمعايير الهندسية المعتمدة" : "Technical Specs & Engineering Standards"}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {isAr ? "مواصفات الخرسانة المسلحة وحواجز نيوجيرسي وكشط الطرق المطابقة لكود البناء السعودي" : "Engineering specs for precast barriers & road paving compliant with Saudi Building Code."}
              </p>
            </div>

            {/* Spec Tabs */}
            <div className="flex rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1.5 shrink-0 self-start md:self-center">
              <button
                onClick={() => setActiveSpecTab('barrier81')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSpecTab === 'barrier81'
                    ? 'bg-white dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? "حاجز 81 سم" : "Barrier 81cm"}
              </button>
              <button
                onClick={() => setActiveSpecTab('barrier100')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSpecTab === 'barrier100'
                    ? 'bg-white dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? "حاجز 100 سم" : "Barrier 100cm"}
              </button>
              <button
                onClick={() => setActiveSpecTab('asphalt')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSpecTab === 'asphalt'
                    ? 'bg-white dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? "كشط وسفلتة الطرق" : "Road Paving Specs"}
              </button>
            </div>
          </div>

          {/* Active Spec Details Card */}
          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-[#0070BA] dark:text-sky-400">
                  <HardHat className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? specsData[activeSpecTab].titleAr : specsData[activeSpecTab].titleEn}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specsData[activeSpecTab].specs.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      {isAr ? item.keyAr : item.keyEn}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block">
                      {isAr ? item.valueAr : item.valueEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ISO & DOCUMENT DETAILS MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-start">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${selectedCert.badgeBg} border ${selectedCert.borderColor} flex items-center justify-center ${selectedCert.textColor}`}>
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-md ${selectedCert.badgeBg} ${selectedCert.textColor} text-xs font-mono font-bold border ${selectedCert.borderColor}`}>
                    {selectedCert.code}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {isAr ? selectedCert.titleAr : selectedCert.titleEn}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                {isAr ? selectedCert.scopeAr : selectedCert.scopeEn}
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isAr ? "رقم المستند" : "Doc ID"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCert.idNumber}</span>
                </div>
                <div className="flex flex-col justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isAr ? "جهة الإصدار" : "Issuer"}</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate">{isAr ? selectedCert.issuerAr : selectedCert.issuerEn}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isAr ? "تاريخ الإصدار" : "Issue Date"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCert.issueDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isAr ? "تاريخ انتهاء السريان" : "Expiry Date"}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCert.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
              <button
                onClick={() => handleDownloadFile(selectedCert.filePath, `${selectedCert.id}.pdf`)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? "تحميل وثيقة PDF" : "Download PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORPORATE PROFILE PREVIEW MODAL */}
      <CorporateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        locale={locale}
      />
    </section>
  );
}
