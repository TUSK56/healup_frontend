type AvatarRole = "patient" | "pharmacy";

const LEGACY_KEYS: Record<AvatarRole, string> = {
  patient: "healup_patient_avatar",
  pharmacy: "healup_pharmacy_avatar",
};

const LEGACY_PATIENT_BACKUP_KEY = "healup_patient_avatar_backup";

function normalizeIdentity(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized || normalized === "undefined" || normalized === "null") return null;
  return encodeURIComponent(normalized);
}

function getCurrentUserIdentity(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("healup_user");
    const user = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    return (
      normalizeIdentity(user.id) ||
      normalizeIdentity(user.email) ||
      normalizeIdentity(user.phone) ||
      normalizeIdentity(user.name)
    );
  } catch {
    return null;
  }
}

function buildScopedKey(baseKey: string, identity: string | null): string {
  return identity ? `${baseKey}:${identity}` : baseKey;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function readKey(storage: Storage, key: string): string | null {
  const value = storage.getItem(key);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveIdentity(explicitIdentity?: unknown): string | null {
  return normalizeIdentity(explicitIdentity) || getCurrentUserIdentity();
}

export function readAvatar(
  role: AvatarRole,
  explicitIdentity?: unknown,
  options?: { includeBackup?: boolean; migrateLegacy?: boolean }
): string | null {
  const storage = getStorage();
  if (!storage) return null;

  const identity = resolveIdentity(explicitIdentity);
  const includeBackup = !!options?.includeBackup && role === "patient";
  const migrateLegacy = options?.migrateLegacy !== false;

  const scopedPrimaryKey = buildScopedKey(LEGACY_KEYS[role], identity);
  const scopedBackupKey = includeBackup ? buildScopedKey(LEGACY_PATIENT_BACKUP_KEY, identity) : null;

  const scopedPrimary = readKey(storage, scopedPrimaryKey);
  if (scopedPrimary) return scopedPrimary;

  if (scopedBackupKey) {
    const scopedBackup = readKey(storage, scopedBackupKey);
    if (scopedBackup) return scopedBackup;
  }

  const legacyPrimary = readKey(storage, LEGACY_KEYS[role]);
  if (legacyPrimary) {
    if (identity && migrateLegacy) storage.setItem(scopedPrimaryKey, legacyPrimary);
    return legacyPrimary;
  }

  if (includeBackup) {
    const legacyBackup = readKey(storage, LEGACY_PATIENT_BACKUP_KEY);
    if (legacyBackup) {
      if (scopedBackupKey && migrateLegacy) storage.setItem(scopedBackupKey, legacyBackup);
      return legacyBackup;
    }
  }

  return null;
}

export function writeAvatar(role: AvatarRole, value: string, explicitIdentity?: unknown): void {
  const storage = getStorage();
  if (!storage) return;
  const identity = resolveIdentity(explicitIdentity);
  storage.setItem(buildScopedKey(LEGACY_KEYS[role], identity), value);
}

export function writePatientAvatarBackup(value: string, explicitIdentity?: unknown): void {
  const storage = getStorage();
  if (!storage) return;
  const identity = resolveIdentity(explicitIdentity);
  storage.setItem(buildScopedKey(LEGACY_PATIENT_BACKUP_KEY, identity), value);
}

export function isAvatarStorageKey(
  key: string | null,
  role: AvatarRole,
  explicitIdentity?: unknown,
  options?: { includeBackup?: boolean }
): boolean {
  if (!key) return false;
  const identity = resolveIdentity(explicitIdentity);
  const includeBackup = !!options?.includeBackup && role === "patient";

  const candidates = [
    LEGACY_KEYS[role],
    buildScopedKey(LEGACY_KEYS[role], identity),
  ];

  if (includeBackup) {
    candidates.push(LEGACY_PATIENT_BACKUP_KEY, buildScopedKey(LEGACY_PATIENT_BACKUP_KEY, identity));
  }

  return candidates.includes(key);
}