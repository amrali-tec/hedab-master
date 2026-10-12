import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { useAdminAuth } from '../context/useAdminAuth';
import { Loader2 } from 'lucide-react';
import Providers from '../components/layouts/Providers';

export const AdminLayout: React.FC = () => {
  const { locale: rawLocale } = useParams<{ locale?: string }>();
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkSession } = useAdminAuth();

  const isEditorWorkspace = location.pathname.includes('/admin/visual-builder');
  const [isCollapsed, setIsCollapsed] = useState(isEditorWorkspace);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAr = locale === 'ar';
  const isLoginPage = location.pathname.includes('/admin/login');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [locale, isAr]);

  useEffect(() => {
    setIsMounted(true);
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isEditorWorkspace) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isEditorWorkspace]);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated && !isLoginPage) {
      navigate(`/${locale}/admin/login`, { replace: true });
    }
  }, [isMounted, isLoading, isAuthenticated, isLoginPage, locale, navigate]);

  // If on login page, render clean standalone layout
  if (isLoginPage) {
    return (
      <Providers>
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950">
          <Outlet />
        </div>
      </Providers>
    );
  }

  // If not mounted or session is loading
  if (!isMounted || isLoading) {
    return (
      <Providers>
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 text-slate-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs font-semibold text-slate-400">
            {isAr ? 'جاري التحقق من الجلسة...' : 'Verifying session...'}
          </p>
        </div>
      </Providers>
    );
  }

  // If unauthenticated after check
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <div className="fixed inset-0 z-40 overflow-hidden bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex transition-colors">
        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
          />
        )}

        {/* Desktop & Mobile Sidebar */}
        <div className={`md:block ${isMobileOpen ? 'block z-50' : 'hidden'}`}>
          <AdminSidebar
            locale={locale}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            onCloseMobile={() => setIsMobileOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ${
            isAr
              ? isCollapsed
                ? 'md:mr-16'
                : 'md:mr-64 lg:mr-72'
              : isCollapsed
              ? 'md:ml-16'
              : 'md:ml-64 lg:ml-72'
          }`}
        >
          {/* Top Navbar */}
          {!isEditorWorkspace && (
            <AdminNavbar
              locale={locale}
              onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
            />
          )}

          {/* Dynamic Page Content */}
          <main
            className={`flex-1 ${
              isEditorWorkspace
                ? 'p-0 overflow-hidden h-full'
                : 'overflow-y-auto bg-slate-50 dark:bg-[#070b14] p-4 sm:p-6 lg:p-8'
            }`}
          >
            <div className={isEditorWorkspace ? 'w-full h-full max-w-none m-0 p-0' : 'max-w-7xl mx-auto space-y-6'}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </Providers>
  );
};

export default AdminLayout;
