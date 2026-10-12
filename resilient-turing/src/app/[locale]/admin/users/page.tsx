"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShieldCheck,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Users,
  KeyRound,
  CheckCircle2,
  XCircle,
  Lock,
  Mail,
  Phone,
  Search,
  Sparkles,
  Award,
  FolderKanban,
  Wrench,
  Inbox,
  TrendingUp,
  Settings,
  ClipboardList,
  AlertTriangle,
  Crown,
  UserCheck,
  UserX,
  Copy,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { AdminUser, AdminPermission, AdminRole } from '../../../../types';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';

interface UsersAdminProps {
  params: Promise<{ locale: string }>;
}

const adminUserFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'الاسم مطلوب ويجب ألا يقل عن حرفين'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().optional(),
  role: z.string().min(1, 'الدور الوظيفي مطلوب'),
  password: z.string().optional(),
  status: z.enum(['active', 'suspended']),
  avatar: z.string().min(1, 'الصورة الرمزية مطلوبة'),
});

type AdminUserFormData = z.infer<typeof adminUserFormSchema>;

// Predefined avatar choices
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
];

// Available permissions definition
const ALL_PERMISSIONS: { id: AdminPermission; labelAr: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'projects_manage', labelAr: 'إدارة وتعديل المشاريع الميدانية', labelEn: 'Manage Projects', icon: FolderKanban },
  { id: 'certificates_manage', labelAr: 'إدارة شهادات الاعتماد والآيزو', labelEn: 'Manage Certificates & ISO', icon: Award },
  { id: 'services_manage', labelAr: 'إدارة الخدمات والأسطول والمعدات', labelEn: 'Manage Services & Fleet', icon: Wrench },
  { id: 'inquiries_view_reply', labelAr: 'إدارة واستعراض استفسارات العملاء', labelEn: 'View & Manage Inquiries', icon: Inbox },
  { id: 'statistics_manage', labelAr: 'تعديل مؤشرات الإنجاز (KPIs)', labelEn: 'Manage Statistics', icon: TrendingUp },
  { id: 'team_manage', labelAr: 'إدارة فريق العمل والكوادر القيادية', labelEn: 'Manage Team Profiles', icon: Users },
  { id: 'settings_manage', labelAr: 'إدارة إعدادات الهوية والتواصل', labelEn: 'Manage Identity & Settings', icon: Settings },
  { id: 'users_manage', labelAr: 'إدارة المستخدمين ومصفوفة الصلاحيات', labelEn: 'Manage Users & Roles', icon: ShieldCheck },
  { id: 'logs_view', labelAr: 'استعراض سجل العمليات والأمان (Audit)', labelEn: 'View Activity Audit Logs', icon: ClipboardList },
];

// Role Templates
const ROLE_TEMPLATES: {
  id: AdminRole;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultPermissions: AdminPermission[];
}[] = [
  {
    id: 'super_admin',
    titleAr: 'مدير النظام الشامل (Super Admin)',
    titleEn: 'Super Administrator',
    badgeAr: 'صلاحيات كاملة',
    badgeEn: 'Full Access',
    icon: Crown,
    defaultPermissions: [
      'projects_manage',
      'certificates_manage',
      'services_manage',
      'inquiries_view_reply',
      'statistics_manage',
      'team_manage',
      'settings_manage',
      'users_manage',
      'logs_view',
    ],
  },
  {
    id: 'project_manager',
    titleAr: 'مدير المشاريع والعمليات الميدانية',
    titleEn: 'Projects & Operations Manager',
    badgeAr: 'إدارة المشاريع',
    badgeEn: 'Operations',
    icon: FolderKanban,
    defaultPermissions: ['projects_manage', 'services_manage', 'statistics_manage', 'team_manage', 'logs_view'],
  },
  {
    id: 'quality_officer',
    titleAr: 'مسؤول الجودة والاعتمادات الرسمية',
    titleEn: 'Quality & ISO Officer',
    badgeAr: 'جودة وتصنيف',
    badgeEn: 'Quality & ISO',
    icon: Award,
    defaultPermissions: ['certificates_manage', 'services_manage', 'logs_view'],
  },
  {
    id: 'inquiries_manager',
    titleAr: 'مسؤول خدمة العملاء والاستفسارات',
    titleEn: 'Client Inquiries Specialist',
    badgeAr: 'خدمة العملاء',
    badgeEn: 'Client Support',
    icon: Inbox,
    defaultPermissions: ['inquiries_view_reply', 'logs_view'],
  },
  {
    id: 'content_editor',
    titleAr: 'محرر المحتوى والوسائط',
    titleEn: 'Content & Media Editor',
    badgeAr: 'محتوى ومشاريع',
    badgeEn: 'Content Editor',
    icon: Edit2,
    defaultPermissions: ['projects_manage', 'services_manage', 'team_manage', 'logs_view'],
  },
];

export default function AdminUsersPage({ params }: UsersAdminProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'project_manager',
      status: 'active',
      avatar: AVATAR_PRESETS[0],
      password: '',
    },
  });

  const watchedRole = watch('role');
  const watchedAvatar = watch('avatar');
  const watchedName = watch('name');
  const watchedEmail = watch('email');
  const watchedStatus = watch('status');

  const loadUsers = () => {
    setUsers(storageAdapter.getAdminUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Open modal for new user
  const handleOpenAdd = () => {
    setEditingUser(null);
    const initialRole = 'project_manager';
    const template = ROLE_TEMPLATES.find((t) => t.id === initialRole);
    setSelectedPermissions(template ? template.defaultPermissions : []);
    reset({
      name: '',
      email: '',
      phone: '',
      role: initialRole,
      status: 'active',
      avatar: AVATAR_PRESETS[0],
      password: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setSelectedPermissions(user.permissions || []);
    reset({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      avatar: user.avatar || AVATAR_PRESETS[0],
      password: '',
    });
    setIsModalOpen(true);
  };

  // Handle role template change to auto-select default permissions
  const handleRoleChange = (roleId: string) => {
    setValue('role', roleId);
    const template = ROLE_TEMPLATES.find((t) => t.id === roleId);
    if (template) {
      setSelectedPermissions(template.defaultPermissions);
    }
  };

  // Toggle individual permission
  const handleTogglePermission = (perm: AdminPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  // Submit handler
  const onSubmit = (data: AdminUserFormData) => {
    const template = ROLE_TEMPLATES.find((t) => t.id === data.role);
    const userToSave: AdminUser = {
      id: editingUser ? editingUser.id : `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      role: data.role as AdminRole,
      roleTitleAr: template ? template.titleAr : data.role,
      roleTitleEn: template ? template.titleEn : data.role,
      permissions: selectedPermissions,
      status: data.status,
      avatar: data.avatar,
      lastLogin: editingUser ? editingUser.lastLogin : (isAr ? 'لم يسجل دخول بعد' : 'Never logged in'),
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0],
    };

    storageAdapter.saveAdminUser(userToSave);
    loadUsers();
    setIsModalOpen(false);
    showNotification(
      editingUser
        ? isAr ? 'تم تحديث بيانات وصلاحيات المستخدم بنجاح' : 'User and permissions updated'
        : isAr ? 'تم إنشاء حساب العضو وتعيين الصلاحيات بنجاح' : 'Admin user created successfully'
    );
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    const updated = storageAdapter.toggleAdminUserStatus(id);
    if (updated) {
      loadUsers();
      showNotification(
        isAr
          ? `تم تغيير حالة الحساب إلى ${updated.status === 'active' ? 'نشط' : 'معلق'}`
          : `Account status updated to ${updated.status}`
      );
    }
  };

  // Delete user
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      if (deleteTarget.role === 'super_admin' && users.filter((u) => u.role === 'super_admin').length <= 1) {
        alert(isAr ? 'لا يمكن حذف الحساب الوحيد لمدير النظام الشامل!' : 'Cannot delete the sole super admin!');
        setDeleteTarget(null);
        return;
      }
      storageAdapter.deleteAdminUser(deleteTarget.id);
      loadUsers();
      setDeleteTarget(null);
      showNotification(isAr ? 'تم حذف حساب المستخدم بنجاح' : 'Admin user deleted successfully');
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      return (
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.roleTitleAr && u.roleTitleAr.toLowerCase().includes(q))
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>{isAr ? 'إدارة المستخدمين ومصفوفة الصلاحيات' : 'Admin Users & Permissions Management'}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'إضافة مدراء النظام والمشاريع وتخصيص صلاحيات الوصول والتحكم لكل عضو'
              : 'Add admin members, assign role templates, and configure granular access permissions'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-lg shadow-sky-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة مستخدم وصلاحيات جديدة' : 'Add New Admin User'}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs md:text-sm font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{users.length}</div>
            <div className="text-[11px] text-slate-500 font-semibold">{isAr ? 'إجمالي مستخدمي الإدارة' : 'Total Admins'}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {users.filter((u) => u.status === 'active').length}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">{isAr ? 'حسابات نشطة ومفعلة' : 'Active Accounts'}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {users.filter((u) => u.role === 'super_admin').length}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">{isAr ? 'مدراء النظام الشامل' : 'Super Admins'}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400">{ALL_PERMISSIONS.length}</div>
            <div className="text-[11px] text-slate-500 font-semibold">{isAr ? 'صلاحيات قابلة للتخصيص' : 'Permission Modules'}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'بحث بالاسم، البريد الإلكتروني أو الدور الوظيفي...' : 'Search by name, email or role...'}
          className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-xs"
        />
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((user) => {
          const roleTemplate = ROLE_TEMPLATES.find((t) => t.id === user.role);
          const isSuper = user.role === 'super_admin';
          const isActive = user.status === 'active';

          return (
            <div
              key={user.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm transition-all space-y-4 ${
                isActive
                  ? 'border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40 hover:shadow-lg'
                  : 'border-slate-200/40 dark:border-slate-800/40 opacity-75'
              }`}
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 relative">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                        {user.name}
                      </h3>
                      {isSuper && (
                        <span title={isAr ? 'مدير نظام شامل' : 'Super Admin'}>
                          <Crown className="w-4 h-4 text-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                      {isAr ? user.roleTitleAr || user.role : user.roleTitleEn || user.role}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isActive ? (isAr ? 'تعطيل الحساب' : 'Suspend') : (isAr ? 'تفعيل الحساب' : 'Activate')}
                  >
                    {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(user)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
                    title={isAr ? 'تعديل الصلاحيات' : 'Edit Permissions'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
                    title={isAr ? 'حذف الحساب' : 'Delete Account'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Permissions Tags */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{isAr ? 'الصلاحيات الممنوحة:' : 'Assigned Permissions:'}</span>
                  <span className="text-sky-600 font-mono">
                    {user.permissions?.length || 0} / {ALL_PERMISSIONS.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {user.permissions?.map((permId) => {
                    const permDef = ALL_PERMISSIONS.find((p) => p.id === permId);
                    if (!permDef) return null;
                    const PermIcon = permDef.icon;
                    return (
                      <span
                        key={permId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/60 dark:border-slate-700/50"
                      >
                        <PermIcon className="w-3 h-3 text-sky-500" />
                        <span>{isAr ? permDef.labelAr : permDef.labelEn}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span>{isAr ? `تاريخ الإنشاء: ${user.createdAt}` : `Created: ${user.createdAt}`}</span>
                <span>{isAr ? `آخر نشاط: ${user.lastLogin || 'الآن'}` : `Last: ${user.lastLogin || 'Now'}`}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Admin User Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingUser
            ? isAr ? 'تعديل بيانات وصلاحيات المستخدم' : 'Edit Admin User & Permissions'
            : isAr ? 'إضافة مستخدم جديد وتعيين الصلاحيات' : 'Add Admin User & Set Permissions'
        }
        subtitle={
          isAr
            ? 'تحديد بيانات الدخول، الدور الوظيفي، ومصفوفة الصلاحيات بدقة'
            : 'Configure login credentials, role template, and granular permission access'
        }
        maxWidth="6xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: User Credentials & Role Template (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم العضو / المسؤول' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder={isAr ? 'م. فهد الدوسري' : 'Eng. Fahad Al-Dosari'}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {errors.name && <p className="text-[11px] font-semibold text-rose-500">{errors.name.message}</p>}
              </div>

              {/* Email / Username */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'البريد الإلكتروني للولوج' : 'Login Email'} *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="f.dosari@hedabkh.com.sa"
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
                />
                {errors.email && <p className="text-[11px] font-semibold text-rose-500">{errors.email.message}</p>}
              </div>

              {/* Grid: Phone & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'رقم الجوال' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono"
                  />
                </div>

                <div className="space-y-1 text-start">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'حالة الحساب' : 'Account Status'} *
                  </label>
                  <select
                    {...register('status')}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-bold"
                  >
                    <option value="active">{isAr ? 'نشط ومصرح له بالدخول' : 'Active'}</option>
                    <option value="suspended">{isAr ? 'معلق ومحجوب مؤقتاً' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Role Template Selector */}
              <div className="space-y-2 text-start pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isAr ? 'اختر قالب الدور الوظيفي المسبق:' : 'Select Role Template Preset:'}
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {ROLE_TEMPLATES.map((tpl) => {
                    const TplIcon = tpl.icon;
                    const isSelected = watchedRole === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleRoleChange(tpl.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 ring-2 ring-sky-500/20'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                            <TplIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white">
                              {isAr ? tpl.titleAr : tpl.titleEn}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {isAr ? tpl.badgeAr : tpl.badgeEn} ({tpl.defaultPermissions.length} {isAr ? 'صلاحيات' : 'perms'})
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Permissions Matrix & Avatar Selection (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Granular Permissions Matrix */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-start">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-sky-500" />
                    <span>{isAr ? 'مصفوفة الصلاحيات المخصصة' : 'Custom Permissions Matrix'}</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                    {selectedPermissions.length} / {ALL_PERMISSIONS.length}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    const PermIcon = perm.icon;
                    return (
                      <label
                        key={perm.id}
                        onClick={() => handleTogglePermission(perm.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'bg-sky-500/10 border-sky-500/40 text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 accent-sky-600 rounded"
                        />
                        <PermIcon className={`w-3.5 h-3.5 ${isChecked ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                        <span className="text-[11px] flex-1">{isAr ? perm.labelAr : perm.labelEn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Direct Media Upload Dropzone */}
              <MediaDropzone
                value={watchedAvatar}
                onChange={(val) => setValue('avatar', val)}
                accept="image"
                label={isAr ? 'الصورة الرمزية للحساب' : 'Account Avatar'}
                isAr={isAr}
                presets={AVATAR_PRESETS.map((url, i) => ({
                  label: isAr ? `مظهر ${i + 1}` : `Avatar ${i + 1}`,
                  url,
                }))}
              />
              {errors.avatar && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.avatar.message}</p>
              )}

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
              {editingUser
                ? isAr ? 'حفظ وتحديث الصلاحيات' : 'Update Permissions'
                : isAr ? 'إنشاء وتفعيل الحساب' : 'Create & Activate Account'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={isAr ? 'حذف حساب المستخدم' : 'Delete User Account'}
        message={
          isAr
            ? `هل أنت متأكد من حذف حساب المسؤول "${deleteTarget?.name}" نهائياً من النظام؟`
            : `Are you sure you want to permanently delete "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
