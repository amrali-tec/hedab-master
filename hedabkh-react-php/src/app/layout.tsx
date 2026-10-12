import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'شركة هضاب الخليج للمقاولات | Gulf Hills Contracting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
