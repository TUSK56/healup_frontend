import type { HealupLocale } from "@/contexts/LocaleContext";

export type TranslationKey =
  | "common.changeLanguage"
  | "common.notifications"
  | "common.newNotifications"
  | "common.loadingNotifications"
  | "common.noNewNotifications"
  | "common.settings"
  | "common.logout"
  | "common.searchPlaceholderAdmin"
  | "common.searchPlaceholderPharmacy"
  | "common.systemManager"
  | "common.pharmacyManager"
  | "admin.panel"
  | "admin.nav.dashboard"
  | "admin.nav.pharmacies"
  | "admin.nav.patients"
  | "admin.nav.orders"
  | "admin.nav.reports"
  | "patient.profileMenu"
  | "pharmacy.defaultName";

type Messages = Record<TranslationKey, string>;

const ar: Messages = {
  "common.changeLanguage": "تغيير اللغة",
  "common.notifications": "الإشعارات",
  "common.newNotifications": "الإشعارات الجديدة",
  "common.loadingNotifications": "جاري تحميل الإشعارات...",
  "common.noNewNotifications": "لا توجد إشعارات جديدة.",
  "common.settings": "الإعدادات",
  "common.logout": "تسجيل الخروج",
  "common.searchPlaceholderAdmin": "البحث عن طلبات، مرضى، أو صيدليات...",
  "common.searchPlaceholderPharmacy": "بحث عن مريض أو دواء...",
  "common.systemManager": "مدير النظام",
  "common.pharmacyManager": "مدير الصيدلية",
  "admin.panel": "لوحة الإدارة",
  "admin.nav.dashboard": "لوحة القيادة",
  "admin.nav.pharmacies": "إدارة الصيدليات",
  "admin.nav.patients": "إدارة المرضى",
  "admin.nav.orders": "الطلبات",
  "admin.nav.reports": "التقارير",
  "patient.profileMenu": "قائمة الحساب",
  "pharmacy.defaultName": "صيدلية",
};

const en: Messages = {
  "common.changeLanguage": "Change language",
  "common.notifications": "Notifications",
  "common.newNotifications": "New notifications",
  "common.loadingNotifications": "Loading notifications...",
  "common.noNewNotifications": "No new notifications.",
  "common.settings": "Settings",
  "common.logout": "Logout",
  "common.searchPlaceholderAdmin": "Search orders, patients, or pharmacies...",
  "common.searchPlaceholderPharmacy": "Search for a patient or medicine...",
  "common.systemManager": "System manager",
  "common.pharmacyManager": "Pharmacy manager",
  "admin.panel": "Admin panel",
  "admin.nav.dashboard": "Dashboard",
  "admin.nav.pharmacies": "Pharmacy management",
  "admin.nav.patients": "Patient management",
  "admin.nav.orders": "Orders",
  "admin.nav.reports": "Reports",
  "patient.profileMenu": "Profile menu",
  "pharmacy.defaultName": "Pharmacy",
};

const byLocale: Record<HealupLocale, Messages> = { ar, en };

export function translate(locale: HealupLocale, key: TranslationKey, fallback?: string): string {
  return byLocale[locale][key] ?? fallback ?? key;
}
