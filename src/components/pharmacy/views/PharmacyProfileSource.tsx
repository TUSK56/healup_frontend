"use client";

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AxiosError } from "axios";
import { Camera, CheckCircle2, ChevronLeft, FileText, LocateFixed, MapPin, Phone, Save, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { pharmacyService, PharmacyMe } from "@/services/pharmacyService";
import { readAvatar, writeAvatar } from "@/lib/avatarStorage";

const LeafletPicker = dynamic(() => import("./PharmacyProfileLeaflet"), { ssr: false });

type DraftProfile = {
  phone: string;
  email: string;
  city: string;
  district: string;
  address_details: string;
  latitude: number | null;
  longitude: number | null;
};

const toDraft = (me: PharmacyMe): DraftProfile => ({
  phone: me.phone ?? "",
  email: me.email ?? "",
  city: me.city ?? "",
  district: me.district ?? "",
  address_details: me.address_details ?? "",
  latitude: me.latitude ?? null,
  longitude: me.longitude ?? null,
});

const normalizeDraft = (draft: DraftProfile) =>
  JSON.stringify({
    ...draft,
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    city: draft.city.trim(),
    district: draft.district.trim(),
    address_details: draft.address_details.trim(),
  });

export default function PharmacyProfileSource() {
  const [me, setMe] = useState<PharmacyMe | null>(null);
  const [initialDraft, setInitialDraft] = useState<DraftProfile | null>(null);
  const [draft, setDraft] = useState<DraftProfile | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapFocusToken, setMapFocusToken] = useState(0);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentPasswordWrong, setCurrentPasswordWrong] = useState(false);
  const [passwordShake, setPasswordShake] = useState(false);

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const isDirty = useMemo(() => {
    if (!draft || !initialDraft) return false;
    return normalizeDraft(draft) !== normalizeDraft(initialDraft);
  }, [draft, initialDraft]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      try {
        const data = await pharmacyService.getMe();
        const nextDraft = toDraft(data);
        setMe(data);
        setDraft(nextDraft);
        setInitialDraft(nextDraft);
        setAvatar(readAvatar("pharmacy", data.id ?? data.email, { migrateLegacy: true }));
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (!isDirty) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/pharmacy-dashboard")) return;
      if (href === window.location.pathname) return;
      event.preventDefault();
      setPendingRoute(href);
      setShowUnsavedModal(true);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [isDirty]);

  const updateDraft = <K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const onPickLocation = async (latitude: number, longitude: number) => {
    updateDraft("latitude", latitude);
    updateDraft("longitude", longitude);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await response.json();
      const address = data?.address ?? {};
      const city = address.city || address.town || address.state || "";
      const district = address.suburb || address.neighbourhood || address.county || "";
      const details = data?.display_name || "";
      updateDraft("city", city);
      updateDraft("district", district);
      updateDraft("address_details", details);
    } catch {
      // Keep picked lat/lng even if reverse geocoding fails.
    }
  };

  const focusToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        await onPickLocation(lat, lng);
        setMapFocusToken((token) => token + 1);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const onSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const updated = await pharmacyService.updateMe({
        phone: draft.phone.trim() || null,
        email: draft.email.trim(),
        city: draft.city.trim() || null,
        district: draft.district.trim() || null,
        addressDetails: draft.address_details.trim() || null,
        latitude: draft.latitude,
        longitude: draft.longitude,
      });
      const nextDraft = toDraft(updated);
      setMe(updated);
      setDraft(nextDraft);
      setInitialDraft(nextDraft);

      window.dispatchEvent(new Event("healup:pharmacy-profile-updated"));
      const rawUser = localStorage.getItem("healup_user");
      const user = rawUser ? JSON.parse(rawUser) : {};
      localStorage.setItem("healup_user", JSON.stringify({ ...user, name: updated.name }));
    } finally {
      setSaving(false);
    }
  };

  const onCancelEdits = () => {
    if (!initialDraft) return;
    setDraft(initialDraft);
  };

  const onSaveThenNavigate = async () => {
    await onSave();
    if (pendingRoute) {
      window.location.href = pendingRoute;
    }
  };

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result || "");
      if (!imageUrl) return;
      setAvatar(imageUrl);
      writeAvatar("pharmacy", imageUrl, me?.id ?? me?.email);
      window.dispatchEvent(new Event("healup:pharmacy-profile-updated"));
    };
    reader.readAsDataURL(file);
  };

  const submitPassword = async () => {
    setPasswordError(null);
    setCurrentPasswordWrong(false);
    setPasswordShake(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await pharmacyService.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; field?: string }>;
      const message = axiosError.response?.data?.message || "Unable to change password.";
      const field = axiosError.response?.data?.field;
      setPasswordError(message);
      if (field === "current_password") {
        setCurrentPasswordWrong(true);
        setPasswordShake(true);
        setTimeout(() => setPasswordShake(false), 450);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading || !me || !draft) {
    return <div className="p-8 text-right text-slate-500">Loading pharmacy profile...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col rtl" dir="rtl">
      <style jsx global>{`
        @keyframes healup-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-4px);
          }
          40% {
            transform: translateX(4px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
        .healup-shake {
          animation: healup-shake 0.4s ease-in-out;
        }

        .profile-map .leaflet-control-zoom {
          border: 1px solid #dbe4f3 !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12) !important;
        }

        .profile-map .leaflet-control-zoom a {
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 18px !important;
          color: #1a4b9c !important;
          background: #ffffff !important;
          border: none !important;
          transition: all 0.2s ease;
        }

        .profile-map .leaflet-control-zoom a:hover {
          background: #eef4ff !important;
          color: #123b84 !important;
        }
      `}</style>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 pb-24">
        <div className="relative mb-20 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-40 w-full bg-gradient-to-r from-[#2b59c3] to-[#4a86e8]" />

          <div className="px-8 pb-8 flex flex-col items-center md:items-center md:flex-row gap-6">
            <div className="relative -mt-16">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl p-1.5 border border-slate-100 overflow-hidden">
                <div className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden bg-slate-100">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-gradient-to-b from-[#4dd0e1] to-[#006064] w-full h-full flex items-center justify-center text-white text-3xl">🏥</div>
                  )}
                </div>
              </div>
              <label className="absolute -bottom-2 -right-2 bg-[#1a4b9c] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white cursor-pointer">
                <Camera size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </label>
            </div>

            <div className="text-right md:-mt-8">
              <h1 className="text-2xl font-bold text-slate-900 font-arabic">{me.name}</h1>
              <div className="flex items-center justify-start gap-1 text-slate-400 text-sm mt-1">
                <CheckCircle2 size={14} className="text-slate-400" />
                <span className="font-arabic">License #: {me.license_number || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Basic Information" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Pharmacy name" value={me.name} readOnly />
                <InputField label="Responsible pharmacist" value={me.responsible_pharmacist_name || me.name} readOnly />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="License number" value={me.license_number || "-"} dir="ltr" readOnly />
                <InputField label="Email" value={draft.email} dir="ltr" onChange={(value) => updateDraft("email", value)} />
              </div>
            </InfoCard>

            <InfoCard title="Location & Address" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="City" value={draft.city} onChange={(value) => updateDraft("city", value)} />
                <InputField label="District" value={draft.district} onChange={(value) => updateDraft("district", value)} />
              </div>
              <InputField label="Address details" value={draft.address_details} onChange={(value) => updateDraft("address_details", value)} />

              <div className="profile-map mt-4 relative rounded-2xl overflow-hidden h-48 border border-slate-200">
                <LeafletPicker
                  latitude={draft.latitude ?? 24.7136}
                  longitude={draft.longitude ?? 46.6753}
                  onPick={onPickLocation}
                  focusToken={mapFocusToken}
                />

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold whitespace-nowrap border border-slate-100">
                      Pharmacy location
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={locating}
                  onClick={focusToCurrentLocation}
                  className="absolute bottom-4 left-4 z-[1200] inline-flex items-center gap-2 rounded-xl border border-[#cfdcf4] bg-white px-3.5 py-2 text-xs font-bold text-[#1a4b9c] shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#eef4ff] hover:text-[#123b84] disabled:cursor-not-allowed disabled:opacity-50"
                  title="My current location"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a4b9c] text-white">
                    <LocateFixed size={13} />
                  </span>
                  <span>My location</span>
                </button>
              </div>
            </InfoCard>
          </div>

          <div className="space-y-6">
            <InfoCard title="Contact Information" icon={Phone}>
              <InputField label="Phone number" value={draft.phone} dir="ltr" onChange={(value) => updateDraft("phone", value)} />
            </InfoCard>

            <InfoCard title="Security" icon={Shield}>
              <div className="text-right space-y-4">
                <p className="text-sm text-slate-500 font-arabic leading-relaxed">
                  Change your password regularly to keep your account secure.
                </p>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl border-2 border-healup-blue text-healup-blue font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-arabic"
                  onClick={() => setPasswordOpen((open) => !open)}
                >
                  <ChevronLeft size={18} />
                  <span>Change Password</span>
                </button>

                <AnimatePresence initial={false}>
                  {passwordOpen ? (
                    <motion.div
                      key="password-panel"
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <PasswordField
                          label="Current password"
                          value={currentPassword}
                          onChange={setCurrentPassword}
                          invalid={currentPasswordWrong}
                          shake={passwordShake}
                        />
                        <PasswordField label="New password" value={newPassword} onChange={setNewPassword} />
                        <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} />
                        {passwordError ? <p className="text-xs text-red-600">{passwordError}</p> : null}
                        <button
                          type="button"
                          onClick={submitPassword}
                          disabled={passwordLoading}
                          className="w-full rounded-lg bg-[#1a4b9c] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                          {passwordLoading ? "Saving..." : "Update Password"}
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </InfoCard>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 flex-row-reverse">
          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || saving}
            className="bg-[#1a4b9c] text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-70 font-arabic min-w-[160px] justify-center"
          >
            <Save size={18} />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
          <button
            type="button"
            onClick={onCancelEdits}
            disabled={!isDirty}
            className="bg-slate-50 text-slate-500 border border-slate-200 px-10 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-all font-arabic min-w-[120px] justify-center disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </main>

      {showUnsavedModal ? (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">You have unsaved changes</h3>
            <p className="mb-5 text-sm text-slate-600">Do you want to save changes before leaving?</p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedModal(false);
                  setPendingRoute(null);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingRoute) {
                    setDraft(initialDraft);
                    setShowUnsavedModal(false);
                    window.location.href = pendingRoute;
                  }
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={onSaveThenNavigate}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: any;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl text-healup-blue">
            <Icon size={20} />
          </div>
          <h2 className="font-bold text-lg text-slate-800 font-arabic">{title}</h2>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function InputField({
  label,
  value,
  onChange,
  readOnly = false,
  dir = "rtl",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div className="space-y-1.5 text-right">
      <label className="text-sm font-medium text-slate-500 font-arabic">{label}</label>
      <div className="relative">
        <input
          value={value}
          dir={dir}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full border rounded-xl py-3 px-4 text-slate-700 transition-all font-arabic ${
            readOnly
              ? "bg-slate-100 border-slate-200 cursor-not-allowed"
              : "bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  invalid = false,
  shake = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  shake?: boolean;
}) {
  return (
    <div className="space-y-1 text-right">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ${
          invalid ? "border-red-500" : "border-slate-300 focus:border-blue-500"
        } ${shake ? "healup-shake" : ""}`}
      />
    </div>
  );
}
