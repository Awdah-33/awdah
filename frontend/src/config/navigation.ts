import type { AppPage } from '../types';

interface NavItem {
  page: AppPage;
  label: string;
  icon: string;
  hero?: boolean;
}

export const navItems: NavItem[] = [
  { page: 'dashboard', label: 'لوحة التحكم', icon: '◫' },
  { page: 'register-wash', label: 'تسجيل غسلة', icon: '◎', hero: true },
  { page: 'customers', label: 'العملاء', icon: '◉' },
  { page: 'invoices', label: 'الفواتير', icon: '▤' },
  { page: 'loyalty', label: 'الولاء', icon: '◆' },
  { page: 'reports', label: 'التقارير', icon: '▥' },
  { page: 'settings', label: 'الإعدادات', icon: '⚙' },
];

export const pageTitles: Record<AppPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'لوحة التحكم',
    subtitle: 'نظرة سريعة على أداء المغسلة اليوم',
  },
  'register-wash': {
    title: 'تسجيل غسلة',
    subtitle: 'سجّل عملية الغسيل بسرعة — الهدف 20–30 ثانية',
  },
  customers: {
    title: 'العملاء',
    subtitle: 'إدارة وبحث العملاء',
  },
  invoices: {
    title: 'الفواتير',
    subtitle: 'عرض وإدارة الفواتير',
  },
  loyalty: {
    title: 'برنامج الولاء',
    subtitle: 'مستويات العضوية والقواعد',
  },
  reports: {
    title: 'التقارير',
    subtitle: 'إحصائيات الإيرادات والعمليات',
  },
  settings: {
    title: 'الإعدادات',
    subtitle: 'إعدادات المغسلة والنظام',
  },
};

export const roleLabels: Record<string, string> = {
  owner: 'مالك',
  manager: 'مدير',
  employee: 'موظف',
};
