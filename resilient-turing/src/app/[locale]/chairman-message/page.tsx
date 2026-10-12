import React from "react";
import { Metadata } from "next";
import ChairmanMessageClient from "./ChairmanMessageClient";

interface ChairmanMessagePageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export async function generateMetadata({ params }: ChairmanMessagePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://hedabkh.com.sa";

  const title = isAr
    ? "كلمة الإدارة التنفيذية | هضاب الخليج للمقاولات"
    : "Executive Message | Gulf Hills Contracting";
  const description = isAr
    ? "كلمة الرئيس التنفيذي لشركة هضاب الخليج للمقاولات حول الرؤية الهندسية، الالتزام الوطني في تطوير البنية التحتية، والمساهمة في تحقيق مستهدفات رؤية المملكة 2030."
    : "Executive leadership statement from Gulf Hills Contracting on engineering excellence, infrastructure commitment, and supporting Saudi Vision 2030.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/chairman-message`,
      languages: {
        "ar-SA": `${baseUrl}/ar/chairman-message`,
        "en-US": `${baseUrl}/en/chairman-message`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/chairman-message`,
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function ChairmanMessagePage({ params }: ChairmanMessagePageProps) {
  const { locale } = await params;
  return <ChairmanMessageClient locale={locale} />;
}
