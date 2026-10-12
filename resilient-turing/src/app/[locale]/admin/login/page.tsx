"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { adminLoginSchema, AdminLoginFormData } from '../../../../services/adminSchemas';
import { useAdminAuth } from '../../../../context/useAdminAuth';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

function AdminLoginFormContent({ locale }: { locale: 'ar' | 'en' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loginError, clearError, checkSession } = useAdminAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAr = locale === 'ar';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if session is already active
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated) {
      // Sanitize returnTo / redirect param to prevent open redirects
      const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect');
      let destination = `/${locale}/admin`;

      if (rawReturnTo && rawReturnTo.startsWith(`/${locale}/admin`) && !rawReturnTo.includes('//')) {
        destination = rawReturnTo;
      }

      router.push(destination);
    }
  }, [isAuthenticated, locale, router, searchParams]);

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    clearError();
    const success = await login(data.email, data.password);
    setIsSubmitting(false);

    if (success) {
      const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect');
      let destination = `/${locale}/admin`;

      if (rawReturnTo && rawReturnTo.startsWith(`/${locale}/admin`) && !rawReturnTo.includes('//')) {
        destination = rawReturnTo;
      }

      router.push(destination);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Engineering Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(0, 176, 240, 0.15), transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at bottom left, rgba(0, 32, 96, 0.4), transparent 60%)',
        }}
      />
      <div className="engineering-pattern opacity-10 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Company Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#002060] via-[#0070BA] to-[#00B0F0] p-0.5 shadow-2xl shadow-sky-900/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-sky-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isAr ? 'شركة هضاب الخليج للمقاولات' : 'Gulf Hills Contracting Co.'}
            </h1>
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest mt-1">
              {isAr ? 'بوابة الإدارة التنفيذية المعتمدة' : 'Executive Management Portal'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-slate-100">
              {isAr ? 'تسجيل دخول المشرف' : 'Administrator Sign In'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'أدخل بيانات الاعتماد الرسمية للوصول إلى لوحة التحكم'
                : 'Enter your verified credentials to access the console'}
            </p>
          </div>

          {/* Error Message Alert */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Secure Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-300">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-slate-500 absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="email"
                  {...register('email')}
                  placeholder={isAr ? 'name@domain.com' : 'name@domain.com'}
                  dir="ltr"
                  autoComplete="username"
                  className={`w-full h-11 bg-slate-950/70 border rounded-xl text-xs font-medium text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                    isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'
                  } ${errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-sky-500'}`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-rose-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-300">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-slate-500 absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                  className={`w-full h-11 bg-slate-950/70 border rounded-xl text-xs font-medium text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                    isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'
                  } ${errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-sky-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-3.5 text-slate-500 hover:text-slate-300 transition-colors ${
                    isAr ? 'left-3.5' : 'right-3.5'
                  }`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-rose-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-lg shadow-sky-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري التحقق والمصادقة...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{isAr ? 'تسجيل الدخول للنظام' : 'Sign In to Console'}</span>
                  <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Badge */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {isAr
                ? 'جلسة إدارية مشفرة ومحمية وفق معايير الأمن السيبراني'
                : 'Encrypted administrative session (Zero-Trust Model)'}
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>{isAr ? 'العودة للموقع الرئيسي' : 'Return to main website'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage({ params }: LoginPageProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';

  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin text-sky-400 mr-2" />
          <span>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
        </div>
      }
    >
      <AdminLoginFormContent locale={locale} />
    </React.Suspense>
  );
}
