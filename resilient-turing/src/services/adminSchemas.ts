import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'العنوان مطلوب ويجب ألا يقل عن 3 أحرف'),
  description: z.string().min(10, 'الوصف مطلوب ويجب ألا يقل عن 10 أحرف'),
  category: z.string().min(2, 'التصنيف مطلوب'),
  image: z.string().min(1, 'الصورة الرئيسية مطلوبة'),
  sitePrepImage: z.string().optional(),
  executionPhaseImage: z.string().optional(),
  finalHandoverImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  completionDate: z.string().min(4, 'تاريخ الإنجاز مطلوب'),
  location: z.string().min(2, 'الموقع مطلوب'),
  client: z.string().min(2, 'اسم العميل / الجهة مطلوب'),
  progress: z.number().min(0).max(100),
  features: z.array(z.string()).min(1, 'يجب إضافة ميزة واحدة على الأقل'),
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'اسم الخدمة مطلوب'),
  description: z.string().min(10, 'وصف الخدمة مطلوب'),
  icon: z.string(),
  features: z.array(z.string()).min(1, 'يجب إضافة مخرج أو ميزة واحدة على الأقل للخدمة'),
  sectors: z.array(z.string()).min(1, 'يجب تحديد قطاع واحد على الأقل'),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'اسم الشهادة / الاعتماد مطلوب'),
  issuer: z.string().min(2, 'جهة الإصدار مطلوبة'),
  issueDate: z.string().min(4, 'تاريخ الإصدار مطلوب'),
  expiryDate: z.string().min(4, 'تاريخ الانتهاء مطلوب'),
  idNumber: z.string().min(1, 'رقم الوثيقة / السجل مطلوب'),
  type: z.enum(['government', 'iso']),
  category: z.enum(['official', 'classification', 'iso', 'identity']),
  filePath: z.string().optional(),
});

export const statisticSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2, 'عنوان المؤشر مطلوب'),
  value: z.number().min(0, 'القيمة يجب أن تكون 0 أو أكثر'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  icon: z.string().optional(),
});

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'الاسم مطلوب ويجب ألا يقل عن حرفين'),
  role: z.string().min(2, 'المسمى الوظيفي مطلوب'),
  bio: z.string().min(5, 'النبذة والمسؤوليات المهنية مطلوبة'),
  image: z.string().min(1, 'الصورة مطلوبة'),
  sector: z.string().optional(),
  badge: z.string().optional(),
  experience: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const inquirySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد غير صالح'),
  phone: z.string().min(8, 'رقم الجوال مطلوب'),
  message: z.string().min(5, 'الرسالة مطلوبة'),
  status: z.enum(['new', 'in-progress', 'resolved']),
  createdAt: z.string().optional(),
  notes: z.string().optional(),
});

export const brandSettingsSchema = z.object({
  phone: z.string().min(8, 'رقم الهاتف مطلوب'),
  email: z.string().email('البريد الإلكتروني مطلوب'),
  cr: z.string().min(5, 'رقم السجل التجاري مطلوب'),
  vat: z.string().min(5, 'الرقم الضريبي مطلوب'),
  addressAr: z.string().min(5, 'العنوان بالعربية مطلوب'),
  addressEn: z.string().min(5, 'العنوان بالإنجليزية مطلوب'),
  socials: z.array(
    z.object({
      platform: z.string(),
      url: z.string(),
      icon: z.string(),
    })
  ),
});

export const adminLoginSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صالح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 خانات'),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;
export type StatisticFormData = z.infer<typeof statisticSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type InquiryFormData = z.infer<typeof inquirySchema>;
export type BrandSettingsFormData = z.infer<typeof brandSettingsSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

