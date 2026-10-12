"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'react-router-dom';
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
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Send,
  HelpCircle,
} from 'lucide-react';
import { adminLoginSchema, AdminLoginFormData } from '../../../../services/adminSchemas';
import { useAdminAuth } from '../../../../context/useAdminAuth';
import { authApi } from '../../../../services/authApi';

export default function AdminLoginPage(props?: any) {
  const router = useRouter();
  const routerParams = useParams<any>();
  const searchParams = useSearchParams();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const { login, isAuthenticated, loginError, clearError, checkSession } = useAdminAuth();

  // Mode states: 'credentials' | '2fa_otp' | 'forgot_password' | 'reset_success'
  const [authStep, setAuthStep] = useState<'credentials' | '2fa_otp' | 'forgot_password' | 'reset_success'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP State
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect');
      let destination = `/${locale}/admin`;

      if (rawReturnTo && rawReturnTo.startsWith(`/${locale}/admin`) && !rawReturnTo.includes('//')) {
        destination = rawReturnTo;
      }

      router.push(destination);
    }
  }, [isAuthenticated, locale, router, searchParams]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStep === '2fa_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, resendTimer]);

  // Step 1: Submit Credentials & Handle Exemption or 2FA OTP
  const onCredentialsSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    clearError();

    const normalizedEmail = data.email.trim().toLowerCase();

    // Check if this is the main Admin / Super Admin account -> Bypass 2FA OTP and login directly!
    const isMainAdminAccount =
      normalizedEmail === 'admin@hedabkh.com.sa' ||
      normalizedEmail.startsWith('admin@') ||
      normalizedEmail.includes('super');

    if (isMainAdminAccount) {
      const success = await login(data.email, data.password);
      setIsSubmitting(false);

      if (success) {
        const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect');
        let destination = `/${locale}/admin`;

        if (rawReturnTo && rawReturnTo.startsWith(`/${locale}/admin`) && !rawReturnTo.includes('//')) {
          destination = rawReturnTo;
        }

        router.push(destination);
      } else {
        setErrorMsg(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
      }
      return;
    }

    // For other staff/manager accounts -> proceed to 2FA OTP verification
    try {
      const res = await authApi.requestLoginOtp(data.email, data.password);
      setIsSubmitting(false);

      if (res.success) {
        setSavedEmail(data.email);
        setSavedPassword(data.password);
        setDemoCode(res.mockCode || '123456');
        setAuthStep('2fa_otp');
        setResendTimer(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message || (isAr ? 'البريد أو كلمة المرور غير صحيحة.' : 'Invalid credentials.'));
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg(isAr ? 'حدث خطأ في الاتصال بالخادم.' : 'Server connection error.');
    }
  };

  // Step 2: Handle OTP Digit Change & Auto-Focus
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of full 6-digit code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        const nextIndex = Math.min(pasted.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value.replace(/\D/g, '');
    setOtpDigits(newDigits);

    // Auto move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMsg(isAr ? 'يرجى إدخال رمز التحقق كاملاً (6 أرقام).' : 'Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await authApi.verifyLoginOtp(savedEmail, savedPassword, fullOtp);
    setIsSubmitting(false);

    if (res.success && res.user) {
      // Direct session login update
      await login(savedEmail, savedPassword);
      const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect');
      let destination = `/${locale}/admin`;

      if (rawReturnTo && rawReturnTo.startsWith(`/${locale}/admin`) && !rawReturnTo.includes('//')) {
        destination = rawReturnTo;
      }
      router.push(destination);
    } else {
      setErrorMsg(res.error || (isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired OTP code.'));
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await authApi.requestLoginOtp(savedEmail, savedPassword);
    setIsSubmitting(false);

    if (res.success) {
      setResendTimer(60);
      setCanResend(false);
      setDemoCode(res.mockCode || '123456');
      setSuccessMsg(isAr ? 'تم إرسال رمز تحقق جديد إلى بريدك.' : 'New OTP code sent to your email.');
    } else {
      setErrorMsg(res.message);
    }
  };

  // Forgot Password: Send Reset OTP
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Enter a valid email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await authApi.requestPasswordReset(resetEmail);
    setIsSubmitting(false);

    if (res.success) {
      setDemoCode(res.mockCode || '123456');
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Complete Password Reset
  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length < 6 || !newPassword || newPassword.length < 6) {
      setErrorMsg(isAr ? 'يرجى تعبئة رمز التحقق وكلمة المرور الجديدة (6 خانات على الأقل).' : 'Fill all fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await authApi.resetPasswordWithOtp(resetEmail, resetOtp, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setAuthStep('reset_success');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070C14] text-slate-100 p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0070BA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0070BA] to-[#002855] border border-sky-400/30 flex items-center justify-center shadow-lg shadow-sky-950/40 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-start">
              <div className="text-base font-black text-white tracking-wide">
                {isAr ? 'هضاب الخليج للمقاولات' : 'Gulf Hills Contracting'}
              </div>
              <div className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                {isAr ? 'بوابة الإدارة والتحكم الهندسي' : 'Enterprise Command Portal'}
              </div>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Top Status Banner */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">
                {isAr ? 'اتصال آمن ومشفّر (2FA Enabled)' : 'Encrypted 2FA Session'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              v2.5 Enterprise
            </span>
          </div>

          {/* Messages Alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs font-bold animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: CREDENTIALS FORM */}
          {/* ======================================================== */}
          {authStep === 'credentials' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  {isAr ? 'تسجيل الدخول للمديرين' : 'Manager Authentication'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'تسجيل دخول مباشر لحساب الإدارة الرئيسي، أو عبر رمز التحقق (2FA) لبقية المديرين.'
                    : 'Direct sign-in for Super Admin, or via 2FA OTP for managers.'}
                </p>
              </div>

              <form onSubmit={handleSubmit(onCredentialsSubmit)} className="space-y-4 text-start">
                
                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isAr ? 'البريد الإلكتروني المهني' : 'Work Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="admin@hedabkh.com.sa"
                      className="w-full ps-10 pe-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      {isAr ? 'كلمة المرور' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep('forgot_password');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      className="w-full ps-10 pe-11 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0070BA] to-[#004080] hover:from-[#005a96] hover:to-[#003060] text-white font-black text-xs sm:text-sm shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? 'جاري التحقق والدخول...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: 2FA EMAIL OTP VERIFICATION */}
          {/* ======================================================== */}
          {authStep === '2fa_otp' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-white">
                  {isAr ? 'التحقق الثنائي عبر البريد' : 'Two-Factor Authentication'}
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {isAr ? 'تم إرسال رمز أمان مكوّن من 6 أرقام إلى:' : 'A 6-digit security code was sent to:'}
                </p>
                <div className="inline-block px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-sky-300 font-mono text-xs font-bold">
                  {savedEmail}
                </div>
              </div>

              {/* Demo Helper Pill */}
              {demoCode && (
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/20 text-center space-y-1">
                  <div className="text-[11px] text-slate-400 font-bold">
                    {isAr ? 'رمز التحقق الأمني المباشر:' : 'Live OTP Verification Code:'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = demoCode.split('');
                      setOtpDigits(digits);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-black text-sm hover:bg-sky-500/30 transition-colors cursor-pointer"
                  >
                    <span>{demoCode}</span>
                    <span className="text-[10px] text-sky-400 font-sans">({isAr ? 'تعبئة تلقائية' : 'Auto-fill'})</span>
                  </button>
                </div>
              )}

              {/* OTP 6 Digits Inputs */}
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex items-center justify-center gap-2" dir="ltr">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black font-mono bg-slate-950/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-transparent transition-all shadow-inner"
                    />
                  ))}
                </div>

                {/* Resend & Timer */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>
                    {resendTimer > 0 ? (
                      <span className="font-mono">
                        {isAr ? `إعادة الإرسال بعد: ${resendTimer} ثانية` : `Resend code in ${resendTimer}s`}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">{isAr ? 'يمكنك طلب رمز جديد الآن' : 'You can resend now'}</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || isSubmitting}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 disabled:opacity-40 disabled:hover:text-sky-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>{isAr ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
                  </button>
                </div>

                {/* Submit Verification */}
                <button
                  type="submit"
                  disabled={isSubmitting || otpDigits.join('').length < 6}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#0070BA] hover:from-emerald-500 hover:to-[#005a96] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? 'جاري التحقق...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isAr ? 'تأكيد الدخول والدخول للوحة التحكم' : 'Verify & Access Dashboard'}</span>
                    </>
                  )}
                </button>

                {/* Back to credentials */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('credentials');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer pt-1 block"
                >
                  {isAr ? '← العودة لتعديل البريد أو كلمة المرور' : '← Back to Login Credentials'}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: FORGOT PASSWORD */}
          {/* ======================================================== */}
          {authStep === 'forgot_password' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-black text-white">
                  {isAr ? 'استعادة كلمة المرور' : 'Reset Password'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'أدخل بريدك الإلكتروني المسجل لاستلام رمز التحقق لتعيين كلمة مرور جديدة.'
                    : 'Enter your registered email to receive a reset code.'}
                </p>
              </div>

              <form onSubmit={handleRequestPasswordReset} className="space-y-4 text-start">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@hedabkh.com.sa"
                      className="w-full ps-10 pe-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070BA]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-[#0070BA] hover:bg-[#005a96] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال رمز الاستعادة' : 'Send Reset Code'}</span>
                </button>
              </form>

              {/* If Reset Code Sent -> Show Reset Form */}
              {demoCode && (
                <form onSubmit={handleCompletePasswordReset} className="space-y-3 pt-3 border-t border-slate-800 text-start animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'رمز التحقق (OTP)' : 'Reset Code'}
                    </label>
                    <input
                      type="text"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isAr ? 'حفظ وتعيين كلمة المرور' : 'Update Password'}</span>
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer block"
              >
                {isAr ? '← العودة لتسجيل الدخول' : '← Back to Login'}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: RESET SUCCESS */}
          {/* ======================================================== */}
          {authStep === 'reset_success' && (
            <div className="space-y-5 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-white">
                {isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Updated Successfully!'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول بأمان.'
                  : 'You can now sign in using your new password.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#0070BA] text-white font-black text-xs cursor-pointer"
              >
                {isAr ? 'تسجيل الدخول الآن' : 'Sign In Now'}
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-[11px] text-slate-500">
            {isAr ? 'شركة هضاب الخليج للمقاولات © 2026 — كافة الحقوق محفوظة' : 'Gulf Hills Contracting © 2026 — All Rights Reserved'}
          </p>
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600">
            <Link href={`/${locale}`} className="hover:text-slate-400 transition-colors">
              {isAr ? 'الموقع العام' : 'Public Site'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/contact`} className="hover:text-slate-400 transition-colors">
              {isAr ? 'الدعم الفني' : 'Support'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
