# 🏗️ Gulf Hills Contracting Portal & Visual CMS (Hedab Master)
# بوابة شركة تلال الخليج للمقاولات العامة ونظام إدارة المحتوى المرئي

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=black)](https://greensock.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://github.com/pmndrs/zustand)

---

## 📖 نظرة عامة | Overview

**Hedab Master (Gulf Hills Contracting)** هي المنصة الرقمية الرسمية لشركة **تلال الخليج للمقاولات العامة** (المعروفة تجارياً بـ **هداب الخيل**). تم تطويرها كبوابة هندسية رائدة تدعم السحب والإفلات التفاعلي (Visual CMS) ومحرك بناء صفحات متطور لتسليط الضوء على المشاريع الإنشائية الكبرى، الشراكات الحكومية والخاصة، ومعايير الجودة والامتثال في المملكة العربية السعودية.

**Hedab Master** is the enterprise portal and proprietary Visual CMS for **Gulf Hills Contracting Company** (Hedab Al Khail). Engineered with Next.js 16 and React 19, it features an interactive block-based layout engine, dynamic geospatial project mapping across Saudi Arabia, compliance verification systems, and bilingual presentation.

---

## ✨ المميزات المعمارية والتقنية | Key Architectural Features

### 🏢 المنصة العامة (Public Engineering Portal)
- **محرك خريطة المملكة التفاعلية (Interactive Saudi Map)**: استعراض جغرافي وتوزيع المشاريع في مختلف مناطق ومدن المملكة.
- **الخط الزمني ثلاثي الأبعاد (3D Rotating Timeline Carousel)**: عرض تفاعلي لمسيرة الشركة ومحطاتها الإنشائية.
- **كتالوج المشاريع والأعمال (Project Showcase)**: تصنيف المشاريع حسب القطاع (بنية تحتية، مباني، تشطيبات، طاقة) مع تفاصيل تقنية ومخططات.
- **مركز الامتثال والشهادات (Corporate Compliance Center)**: استعراض فوري لشهادات ISO والسجلات التجارية والتصنيفات الهندسية الرسمية بصيغة PDF.
- **دعم ثنائي اللغة كامل (Bilingual Engine - AR/EN)**: توافق كامل مع اتجاهات القراءة (RTL/LTR) والترجمة الفورية.
- **حركات وتأثيرات فائقة السلاسة**: دمج حركات GSAP مع محرك التمرير الفاخر Lenis Smooth Scroll.

### 🎨 محرك إدارة المحتوى المرئي (Visual CMS Engine)
- **منشئ الصفحات بالسحب والإفلات (Drag & Drop Canvas)**: مبني باستخدام `@dnd-kit/core` و `@dnd-kit/sortable`.
- **مكتبة البلوكات المعيارية (Modular Block Library)**:
  - Hero Block, Statistics Block, Service Collection Block, Project Collection Block
  - Timeline Block, Saudi Map Block, Partners Block, CTA & Contact Form Blocks
- **لوحة الفحص والتخصيص (Inspector Panel)**: تحكم لحظي في النصوص، الصور، السمات اللونية، والتباعدات مع حفظ تلقائي.
- **إدارة شجرة الصفحات (Page Tree & History)**: تتبع الإصدارات وسجل التعديلات الميدانية ونشر الصفحات بضغطة زر.
- **نظام التخزين المتكيف (Storage & Adapters)**: دعم تشغيل Standalone ومستودع بيانات مرن يدعم التصدير السريع.

---

## 🛠️ التقنيات الأساسية | Technology Stack

- **إطار العمل (Framework)**: Next.js 16 (App Router + Turbopack)
- **مكتبة الواجهات (UI Engine)**: React 19
- **لغة البرمجة (Language)**: TypeScript 5
- **التصميم والتنسيق (Styling)**: Tailwind CSS v4 + Next Themes (Dark/Light mode)
- **الحركات والتأثيرات (Motion)**: GSAP + Lenis Scroll
- **إدارة الحالة والبيانات (State & Data Fetching)**:
  - Zustand 5 (إدارة حالة المحرر وواجهة المستخدم)
  - TanStack Query v5
  - React Hook Form + Zod للتحقق والمدخلات
- **السحب والإفلات (Interactivity)**: `@dnd-kit`

---

## 📂 هيكل المجلدات | Directory Structure

```text
Hedab master/
├── .gitignore
├── README.md
├── index.php                      # مدخل توجيه الخادم الميداني
├── sitemap.xml & robots.txt       # ملفات تحسين محركات البحث SEO
├── resilient-turing/              # كود المنصة الأساسي (Next.js Application Root)
│   ├── package.json
│   ├── next.config.ts
│   ├── src/
│   │   ├── app/                   # مسارات Next.js App Router
│   │   ├── components/
│   │   │   ├── admin/visual-cms/  # مكونات محرك الـ Visual CMS
│   │   │   ├── cms/               # مولدات وعوارض البلوكات (Page Renderer)
│   │   │   ├── layouts/           # الهيدر، الفوتر، والمزودات
│   │   │   ├── sections/          # الأقسام التفاعلية (المشاريع، الخط الزمني)
│   │   │   └── ui/                # المكونات الأساسية والخريطة التفاعلية
│   │   ├── data/                  # ملفات التهيئة، اللغات (ar/en) والبيانات
│   │   ├── hooks/                 # React Custom Hooks
│   │   ├── lib/                   # أدوات التوثيق ومحرك المعاملات
│   │   └── services/              # محول التخزين والمزامنة
│   ├── ID/                        # شهادات الاعتماد والامتثال الرسمية
│   └── public/                    # الوسائط، الشعارات والأيقونات
└── hedabkh-react-php/             # بيئة التكامل والتوزيع الهجين
```

---

## 🚀 التثبيت والتشغيل المحلي | Local Development

### 1. الدخول إلى مجلد التطبيق:
```bash
cd resilient-turing
```

### 2. تثبيت الحزم:
```bash
npm install
```

### 3. بدء خادم التطوير:
```bash
npm run dev
```
تصفح التطبيق على الرابط: `http://localhost:3000`

### 4. فحص الأخطاء والبناء للإنتاج:
```bash
# فحص الكود
npm run lint

# بناء نسخة الإنتاج المحسنة
npm run build

# تشغيل خادم الإنتاج
npm run start
```

---

## 📄 الملكية والحقوق | Intellectual Property
جميع الحقوق محفوظة © شركة تلال الخليج للمقاولات العامة (هداب الخيل).
