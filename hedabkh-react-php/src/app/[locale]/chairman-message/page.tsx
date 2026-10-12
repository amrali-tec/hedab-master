import { useParams } from 'react-router-dom';
import React from "react";
import ChairmanMessageClient from "./ChairmanMessageClient";

interface ChairmanMessagePageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}



export default function ChairmanMessagePage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
return <ChairmanMessageClient locale={locale} />;
}
