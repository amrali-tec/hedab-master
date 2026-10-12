import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    { locale: 'ar', notFound: ['404'] },
    { locale: 'en', notFound: ['404'] },
  ];
}

export default function CatchAllNotFound() {
  notFound();
}
