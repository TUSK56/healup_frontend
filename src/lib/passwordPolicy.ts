/** Shared rules for pharmacy/patient signup-style passwords */

export function isHealupStrictPassword(value: string): boolean {
  const len = value.length;
  if (len < 12 || len > 15) return false;
  return /[!@#$%^]/.test(value);
}

export const HEALUP_PASSWORD_POLICY_AR =
  'كلمة المرور من 12–15 خانة وتتضمن على الأقل أحد الرموز: ! @ # $ % ^';
