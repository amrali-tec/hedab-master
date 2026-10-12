import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Briefcase,
  Crown,
  HardHat,
  Truck,
  ShieldCheck,
  Search,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Award,
  Layers,
  Globe,
  EyeOff,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { TeamMember } from '../../../../types';
import { teamMemberSchema, TeamMemberFormData } from '../../../../services/adminSchemas';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';

interface TeamAdminProps {
  params: Promise<{ locale: string }>;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
];

const SECTORS = [
  { id: 'all', labelAr: 'جميع القطاعات', labelEn: 'All Sectors', icon: Layers },
  { id: 'EXECUTIVE', labelAr: 'الإدارة العليا والتخطيط الإستراتيجي', labelEn: 'Executive & C-Level', icon: Crown },
  { id: 'PROJECTS', labelAr: 'مهندسو المشاريع والمواقع الميدانية', labelEn: 'Site & Project Engineers', icon: HardHat },
  { id: 'OPERATIONS', labelAr: 'إدارة العمليات والأسطول الميداني', labelEn: 'Fleet & Operations', icon: Truck },
  { id: 'QUALITY', labelAr: 'ضبط الجودة والمطابقة الفنية', labelEn: 'Quality Control & Safety', icon: ShieldCheck },
];

export default function TeamAdminPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      image: AVATAR_PRESETS[0],
      sector: 'PROJECTS',
      badge: 'إشراف ميداني',
      experience: '+12 سنة خبرة',
      email: '',
      phone: '',
      isPublished: true,
    },
  });

  const watchedValues = watch();

  const loadTeam = () => {
    adminApi.getTeam(locale).then((data) => {
      setTeam(data || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadTeam();
  }, [locale]);

  const publishedCount = useMemo(() => team.filter((m) => m.isPublished !== false).length, [team]);
  const draftCount = useMemo(() => team.filter((m) => m.isPublished === false).length, [team]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTogglePublish = async (member: TeamMember, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = member.isPublished === false;
    setTeam((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isPublished: newStatus } : m))
    );
    await adminApi.toggleTeamPublish(member.id, locale);
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    reset({
      name: '',
      role: isAr ? 'مهندس مشاريع بنية تحتية أول' : 'Senior Infrastructure Project Engineer',
      bio: isAr
        ? 'الإشراف الميداني الشامل على تنفيذ عقود السفلتة وشبكات تصريف السيول وفق اشتراطات الأمانات وكود الطرق السعودي.'
        : 'Supervising asphalt paving and stormwater drainage pipeline contracts per Saudi municipal standards.',
      image: AVATAR_PRESETS[0],
      sector: 'PROJECTS',
      badge: isAr ? 'إشراف ميداني' : 'SITE ENG',
      experience: isAr ? '+12 سنة خبرة' : '12+ Yrs Exp',
      email: '',
      phone: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    reset({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      sector: member.sector || 'PROJECTS',
      badge: member.badge || (isAr ? 'عضو قيادي' : 'LEADERSHIP'),
      experience: member.experience || (isAr ? '+15 سنة خبرة' : '15+ Yrs Exp'),
      email: member.email || '',
      phone: member.phone || '',
      isPublished: member.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleClone = (member: TeamMember) => {
    setEditingMember(null);
    reset({
      name: `${member.name} (${isAr ? 'نسخة' : 'Copy'})`,
      role: member.role,
      bio: member.bio,
      image: member.image,
      sector: member.sector || 'PROJECTS',
      badge: member.badge || (isAr ? 'عضو قيادي' : 'LEADERSHIP'),
      experience: member.experience || (isAr ? '+15 سنة خبرة' : '15+ Yrs Exp'),
      email: member.email || '',
      phone: member.phone || '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    const memberToSave: TeamMember = {
      id: editingMember ? editingMember.id : `team-${Date.now()}`,
      name: data.name,
      role: data.role,
      bio: data.bio,
      image: data.image,
      sector: data.sector || 'PROJECTS',
      badge: data.badge || (isAr ? 'عضو قيادي' : 'LEADERSHIP'),
      experience: data.experience || '',
      email: data.email || '',
      phone: data.phone || '',
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };

    await adminApi.saveTeamMember(memberToSave, locale);
    loadTeam();
    setIsModalOpen(false);
    showNotification(
      editingMember
        ? isAr ? 'تم تحديث بيانات العضو بنجاح' : 'Member updated successfully'
        : isAr ? 'تمت إضافة العضو الجديد بنجاح' : 'New member added successfully'
    );
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await adminApi.deleteTeamMember(deleteTarget.id);
      loadTeam();
      setDeleteTarget(null);
      showNotification(isAr ? 'تم حذف ملف العضو بنجاح' : 'Member deleted successfully');
    }
  };

  const filteredTeam = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return team.filter((member) => {
      const sector = member.sector || '';
      const matchesSector =
        selectedSector === 'all' ||
        (sector && sector.toUpperCase() === selectedSector.toUpperCase()) ||
        (!sector && selectedSector === 'EXECUTIVE');

      const name = (member.name || (member as any).nameAr || '').toLowerCase();
      const role = (member.role || (member as any).roleAr || '').toLowerCase();
      const bio = (member.bio || (member as any).bioAr || '').toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        role.includes(q) ||
        bio.includes(q);

      const isItemPublished = member.isPublished !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isItemPublished) ||
        (statusFilter === 'draft' && !isItemPublished);

      return matchesSector && matchesSearch && matchesStatus;
    });
  }, [team, selectedSector, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span>{isAr ? 'إدارة فريق العمل والقيادات التنفيذية' : 'Executive Leadership & Staff Management'}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'إضافة وتحديث السير المهنية لمدراء المشاريع والمهندسين وأعضاء الإدارة التنفيذية'
              : 'Add, edit, or configure leadership profiles and field engineers per sector'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-lg shadow-sky-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة عضو جديد للقيادة' : 'Add New Member'}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs md:text-sm font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({team.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>{isAr ? 'المنشورة' : 'Published'} ({publishedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            <span>{isAr ? 'المسودات' : 'Drafts'} ({draftCount})</span>
          </button>
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = selectedSector === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isAr ? sector.labelAr : sector.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم أو المسمى الوظيفي...' : 'Search by name or title...'}
            className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-xs"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'لا يوجد أعضاء يطابقون خيارات البحث' : 'No team members match the criteria'}
          </h3>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة عضو جديد الآن' : 'Add a new member now'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group relative ${
                member.isPublished !== false
                  ? 'border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40'
                  : 'border-dashed border-amber-400/60 dark:border-amber-500/40 bg-amber-50/10'
              }`}
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 relative shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-snug">
                      {member.name}
                    </h3>
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                      {member.role}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {member.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40 text-[10px] font-mono font-bold">
                          {member.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublish(member, e)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                          member.isPublished !== false
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                        }`}
                        title={member.isPublished !== false ? (isAr ? 'انقر للتحويل لمسودة وإخفاء العضو' : 'Click to unpublish') : (isAr ? 'انقر لنشر العضو' : 'Click to publish')}
                      >
                        {member.isPublished !== false ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{isAr ? 'منشور' : 'Published'}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>{isAr ? 'مسودة' : 'Draft'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleClone(member)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                    title={isAr ? 'نسخ البيانات' : 'Duplicate'}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(member)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>

                {(member.experience || member.email || member.phone) && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {member.experience && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-semibold">
                        <Award className="w-3 h-3 text-amber-500" />
                        {member.experience}
                      </span>
                    )}
                    {member.email && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-mono">
                        <Mail className="w-3 h-3 text-sky-500" />
                        {member.email}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal with Live Preview */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingMember
            ? isAr ? 'تعديل بيانات العضو القيادي' : 'Edit Leadership Member'
            : isAr ? 'إضافة عضو جديد للإدارة وفريق العمل' : 'Add New Member to Leadership'
        }
        subtitle={
          isAr
            ? 'يتم عرض بطاقة العضو مباشرة في صفحة فريق العمل بالموقع'
            : 'Member profile will be displayed on the corporate team page'
        }
        maxWidth="6xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Content in 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Input Fields (7 columns) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الاسم الكامل للعضو' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder={isAr ? 'م. أيمن جميل الحاتم' : 'Eng. Ayman Jameel Al-Hatem'}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {errors.name && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.name.message}</p>
                )}
              </div>

              {/* Job Title / Role */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'المسمى الوظيفي والقيادي' : 'Job Title / Role'} *
                </label>
                <input
                  type="text"
                  {...register('role')}
                  placeholder={isAr ? 'الرئيس التنفيذي والمؤسس' : 'Chief Executive Officer'}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {errors.role && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.role.message}</p>
                )}
              </div>

              {/* Sector Selection */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'القطاع والمستوى التنظيمي' : 'Operational Sector'} *
                </label>
                <select
                  {...register('sector')}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium"
                >
                  <option value="EXECUTIVE">{isAr ? 'الإدارة العليا والتخطيط الإستراتيجي (EXECUTIVE)' : 'Executive Leadership'}</option>
                  <option value="PROJECTS">{isAr ? 'مهندسو المواقع والمشاريع الميدانية (PROJECTS)' : 'Site & Project Engineers'}</option>
                  <option value="OPERATIONS">{isAr ? 'إدارة العمليات والأسطول الميداني (OPERATIONS)' : 'Fleet & Operations'}</option>
                  <option value="QUALITY">{isAr ? 'ضبط الجودة والمطابقة الفنية (QUALITY)' : 'Quality Control & Safety'}</option>
                </select>
              </div>

              {/* Grid: Badge & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'شارة الدور (Badge)' : 'Badge Label'}
                  </label>
                  <input
                    type="text"
                    {...register('badge')}
                    placeholder={isAr ? 'قيادة عليا' : 'C-LEVEL'}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'سنوات الخبرة' : 'Experience'}
                  </label>
                  <input
                    type="text"
                    {...register('experience')}
                    placeholder={isAr ? '+15 سنة خبرة' : '15+ Yrs Exp'}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>
              </div>

              {/* Grid: Direct Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'البريد المهني (اختياري)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="eng.ayman@hedabkh.com.sa"
                    dir="ltr"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                  {errors.email && (
                    <p className="text-[11px] font-semibold text-rose-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'رقم الجوال (اختياري)' : 'Phone (Optional)'}
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Biography / Scope */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'النبذة المهنية ونطاق المسؤوليات' : 'Professional Biography'} *
                </label>
                <textarea
                  rows={3}
                  {...register('bio')}
                  placeholder={
                    isAr
                      ? 'خبرة تزيد عن 20 عاماً في إدارة مشاريع البنية التحتية، الإشراف على مشاريع تصريف السيول وسفلتة الطرق بوزارة النقل والأمانات...'
                      : 'More than 20 years of experience managing infrastructure projects and municipal contracts...'
                  }
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none leading-relaxed"
                />
                {errors.bio && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.bio.message}</p>
                )}
              </div>

              {/* Publishing & Visibility Box */}
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr ? 'حالة النشر والظهور على الموقع' : 'Publication Status'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr
                      ? 'عند تفعيل الخيار يظهر ملف العضو القيادي في صفحة من نحن وفريق العمل'
                      : 'When enabled, this team member is publicly visible in the About Us leadership grid'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                </label>
              </div>

            </div>

            {/* Right: Avatar Picker & Live Preview Card (5 columns) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Direct Media Upload Dropzone */}
              <MediaDropzone
                value={watchedValues.image}
                onChange={(val) => setValue('image', val)}
                accept="image"
                label={isAr ? 'الصورة الشخصية للعضو' : 'Member Photo'}
                isAr={isAr}
                presets={AVATAR_PRESETS.map((url, i) => ({
                  label: isAr ? `مظهر ${i + 1}` : `Avatar ${i + 1}`,
                  url,
                }))}
              />
              {errors.image && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.image.message}</p>
              )}

              {/* Live Preview Card */}
              <div className="space-y-2 text-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {isAr ? 'معاينة فورية حية للبطاقة:' : 'Live Card Preview:'}
                </span>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0B111E] border border-slate-200 dark:border-sky-900/30 shadow-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      <img
                        src={watchedValues.image || AVATAR_PRESETS[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {watchedValues.name || (isAr ? 'اسم العضو القيادي' : 'Member Name')}
                      </h4>
                      <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 truncate">
                        {watchedValues.role || (isAr ? 'المسمى الوظيفي' : 'Job Title')}
                      </p>
                      {watchedValues.badge && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[9px] font-bold font-mono mt-0.5">
                          {watchedValues.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {watchedValues.bio || (isAr ? 'النبذة المهنية ونطاق الخبرة الميدانية...' : 'Professional biography...')}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-lg shadow-sky-950/20 transition-all cursor-pointer"
            >
              {editingMember
                ? isAr ? 'تحديث ملف العضو' : 'Update Profile'
                : isAr ? 'حفظ وإضافة العضو' : 'Save Member'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف عضو الفريق' : 'Delete Member'}
        message={
          isAr
            ? `هل أنت متأكد من حذف ملف "${deleteTarget?.name}" نهائياً من قاعدة البيانات؟`
            : `Are you sure you want to permanently delete "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
