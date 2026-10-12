import { useParams } from 'react-router-dom';
"use client";

import React, { use, useMemo } from "react";
import { useTeam } from "../../../hooks";
import { RevealText } from "../../../animations/motion-components";
import {
  Crown, HardHat, Truck, MapPin, Shield, Star,
  ClipboardList, Users, ArrowRight
} from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";

interface TeamPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

function useSectors(isAr: boolean) {
  return useMemo(
    () => [
      {
        key: "EXECUTIVE" as const,
        memberIds: ["team-1", "team-4"],
        label: "EXEC-01",
        title: isAr ? "الإدارة العليا والتخطيط الاستراتيجي" : "Executive Leadership & Strategic Planning",
        subtitle: isAr
          ? "يمثل هذا القطاع القيادة العليا للشركة المسؤولة عن توجيه السياسات وتطوير العلاقات الحكومية وضمان الالتزام بالمعايير التشغيلية."
          : "This sector represents the company top leadership, responsible for corporate governance, governmental relations, and operational compliance.",
        icon: Crown,
        stats: [
          { label: isAr ? "سنوات خبرة" : "Yrs Experience", value: "20+" },
          { label: isAr ? "عقود منفذة" : "Contracts Led", value: "80+" },
          { label: isAr ? "علاقات حكومية" : "Gov. Relations", value: isAr ? "نشطة" : "Active" },
        ],
        scopeDescriptions: {
          "team-1": isAr
            ? "التوجيه الاستراتيجي الشامل لكافة عقود التشغيل والصيانة لشركة هضاب الخليج وتطوير قطاع الخدمات البلدية والانشائية بالمملكة."
            : "Providing general strategic direction for all operations and maintenance contracts of Gulf Hills across KSA municipalities.",
          "team-4": isAr
            ? "ادارة ضبط جودة المواد الهندسية ومطابقة التنفيذ الميداني للمواصفات الفنية المعتمدة لوزارة النقل والبلديات بالامانات."
            : "Managing engineering material testing and verifying site alignment with Ministry of Transport and Municipalities guidelines.",
        } as Record<string, string>,
        badgeText: isAr ? "قيادة عليا" : "C-LEVEL",
      },
      {
        key: "PROJECTS" as const,
        memberIds: ["team-2"],
        label: "OPS-02",
        title: isAr ? "قطاع مهندسي المواقع والمشاريع الميدانية" : "Field Site Engineers & Projects Sector",
        subtitle: isAr
          ? "فريق الاشراف الميداني المتخصص في تنفيذ عقود البنية التحتية من تصريف سيول واصلاح طرق وصيانة مقابر وفق ضوابط الامانات."
          : "Field oversight team specialized in executing infrastructure contracts: drainage, road maintenance, and cemetery upkeep per municipal authorities.",
        icon: HardHat,
        stats: [
          { label: isAr ? "مواقع نشطة" : "Active Sites", value: "12+" },
          { label: isAr ? "مشاريع" : "Projects", value: "6" },
          { label: isAr ? "منطقة" : "Region", value: isAr ? "الرياض" : "Riyadh" },
        ],
        scopeDescriptions: {
          "team-2": isAr
            ? "الاشراف المباشر على المواقع الميدانية لتمديد قنوات تصريف السيول، كشط وسفلتة الطرق، وعقود تشغيل وصيانة مقابر منطقة الرياض."
            : "Direct field supervision of pipeline routing, highway paving overlays, and Riyadh Region cemeteries upkeep contracts.",
        } as Record<string, string>,
        badgeText: isAr ? "اشراف ميداني" : "FIELD OPS",
      },
      {
        key: "FLEET" as const,
        memberIds: ["team-3"],
        label: "FLT-03",
        title: isAr ? "ادارة اسطول الاليات والمعدات الثقيلة" : "Municipal Equipment & Heavy Fleet Management",
        subtitle: isAr
          ? "القطاع المسؤول عن جدولة وتشغيل وصيانة الاسطول الالي الكامل من شاحنات النظافة والاليات الثقيلة لضمان الجاهزية الميدانية القصوى."
          : "Sector responsible for scheduling, operating, and maintaining the full fleet of garbage trucks and heavy machinery for maximum field readiness.",
        icon: Truck,
        stats: [
          { label: isAr ? "عدد الاليات" : "Fleet Units", value: "120+" },
          { label: isAr ? "جاهزية" : "Readiness", value: "98%" },
          { label: isAr ? "ورش" : "Workshops", value: "3" },
        ],
        scopeDescriptions: {
          "team-3": isAr
            ? "جدولة وادارة اسطول الاليات الثقيلة، شاحنات النظافة، البلدوزرات، ومتابعة ورش الصيانة لتقليل فترات التعطل الميداني."
            : "Dispatching and maintenance control of heavy dump trucks, garbage compactors, and loaders to ensure field operations readiness.",
        } as Record<string, string>,
        badgeText: isAr ? "اسطول ثقيل" : "FLEET CTL",
      },
    ],
    [isAr]
  );
}

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

function MemberCard({
  member,
  scope,
  badge,
  isAr,
}: {
  member: Member;
  scope: string;
  badge: string;
  isAr: boolean;
}) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-[#0B111E]/35 border border-slate-200 dark:border-sky-900/30 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-none hover:border-[#0070BA] dark:hover:border-sky-500/60 text-start">
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950/80">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#0070BA] dark:bg-sky-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
          {badge}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="border-b border-slate-100 dark:border-sky-900/20 pb-3 space-y-0.5">
          <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
            {member.name}
          </h3>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[#0070BA] dark:text-sky-400">
            {member.role}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
          {member.bio}
        </p>
        <div className="pt-3 border-t border-slate-100 dark:border-sky-900/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#0070BA] dark:text-sky-400 uppercase tracking-wider">
            <ClipboardList className="w-3 h-3 shrink-0" />
            <span>{isAr ? "نطاق المسؤولية" : "RESPONSIBILITY SCOPE"}</span>
          </div>
          <p className="text-[10px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {scope}
          </p>
        </div>
      </div>
    </article>
  );
}

type SectorConfig = ReturnType<typeof useSectors>[number];

function SectorBand({
  sector,
  members,
  isAr,
}: {
  sector: SectorConfig;
  members: Member[];
  isAr: boolean;
}) {
  if (members.length === 0) return null;
  const Icon = sector.icon;
  return (
    <section className="space-y-6">
      <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-[#0B111E]/40 border border-slate-200/80 dark:border-sky-900/20 overflow-hidden">
        <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 w-1 rounded-full bg-[#0070BA] dark:bg-sky-500" />
        <div className="ltr:pl-4 rtl:pr-4 flex items-start gap-4 flex-1">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0070BA]/10 dark:bg-sky-500/10 border border-[#0070BA]/20 dark:border-sky-500/20 flex items-center justify-center text-[#0070BA] dark:text-sky-400">
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[9px] font-mono font-bold text-[#0070BA] dark:text-sky-400 uppercase tracking-widest block">
              {sector.label}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {sector.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              {sector.subtitle}
            </p>
          </div>
        </div>
        <div className="flex gap-6 shrink-0 flex-wrap ltr:pl-4 rtl:pr-4 md:ltr:pl-0 md:rtl:pr-0">
          {sector.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-black text-[#0070BA] dark:text-sky-400 leading-none">{s.value}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`grid gap-6 ${
          members.length === 1
            ? "grid-cols-1 sm:max-w-sm md:max-w-md"
            : members.length === 2
            ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            scope={sector.scopeDescriptions[member.id] ?? ""}
            badge={sector.badgeText}
            isAr={isAr}
          />
        ))}
      </div>
    </section>
  );
}

export default function TeamPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
  const { data: team, isLoading } = useTeam(locale);
  const sectors = useSectors(isAr);

  const getSectorMembers = (ids: string[]) =>
    (team ?? []).filter((m) => ids.includes(m.id));

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-20 min-h-[85vh] bg-transparent text-text-main transition-colors duration-300">
      <PageHeader
        title={isAr ? "فريق القيادة والخبرات الهندسية" : "Leadership & Engineering Competence Team"}
        subtitle={isAr
          ? "الكوادر الهندسية والقيادية لشركة هضاب الخليج موزعة حسب قطاعاتها الميدانية لابراز الكثافة البشرية امام الجهات الحكومية والامانات."
          : "Gulf Hills leadership and engineering staff organized by operational sector, designed to showcase institutional depth to municipal and government authorities."}
        currentPageLabel={isAr ? "فريق العمل" : "Our Team"}
        locale={locale}
      />

      <div className="flex flex-wrap gap-2 -mt-6 mb-12">
        {[
          { Icon: Users, text: isAr ? "4 كوادر قيادية" : "4 Key Personnel" },
          { Icon: MapPin, text: isAr ? "منطقة الرياض" : "Riyadh Region" },
          { Icon: Shield, text: isAr ? "مرخص ومصنف" : "Licensed & Classified" },
          { Icon: Star, text: isAr ? "+15 سنة خبرة" : "15+ Yrs Experience" },
        ].map(({ Icon, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-sky-900/15 border border-slate-200 dark:border-sky-900/25 px-3 py-1.5 rounded-full uppercase tracking-wide"
          >
            <Icon className="w-3 h-3 text-[#0070BA] dark:text-sky-400" />
            {text}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-16">
          {[2, 1, 1].map((count, i) => (
            <div key={i} className="space-y-6">
              <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-900/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: count }).map((_, j) => (
                  <div key={j} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-900/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-20">
          {sectors.map((sector) => (
            <SectorBand
              key={sector.key}
              sector={sector}
              members={getSectorMembers(sector.memberIds)}
              isAr={isAr}
            />
          ))}
        </div>
      )}

      <div className="mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#0070BA]/5 dark:bg-sky-500/5 border border-[#0070BA]/15 dark:border-sky-500/15">
        <div className="space-y-1 text-center sm:text-start">
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
            {isAr ? "هل تبحث عن شراكة او تعاون تنفيذي؟" : "Looking for a partnership or project collaboration?"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr
              ? "فريقنا متاح لمناقشة العقود والاستفسارات الرسمية في اي وقت."
              : "Our team is available to discuss contracts and official inquiries at any time."}
          </p>
        </div>
        <a
          href={`/${locale}/contact`}
          className="flex items-center gap-2 bg-[#0070BA] hover:bg-[#005A96] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
        >
          {isAr ? "تواصل معنا" : "Contact Us"}
          <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        </a>
      </div>
    </div>
  );
}