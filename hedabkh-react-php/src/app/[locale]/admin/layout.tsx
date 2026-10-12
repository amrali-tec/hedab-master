import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import { useAdminAuth } from '../../../context/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
