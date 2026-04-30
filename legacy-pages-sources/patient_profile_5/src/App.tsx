/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  User, 
  Bell, 
  MapPin, 
  Shield, 
  LogOut, 
  Trash2, 
  Home, 
  Briefcase, 
  Plus, 
  Lock, 
  CheckCircle2, 
  Camera,
  ChevronLeft,
  Calendar,
  Mail,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import dynamic from 'next/dynamic';
import { getAuthErrorMessage } from '../../../src/services/authService';
import { CHECKOUT_SELECTED_ADDRESS_KEY } from '../../../src/constants/checkoutAddress';
import { patientService, PatientAddress, PatientMe } from '../../../src/services/patientService';
import { readAvatar, writeAvatar, writePatientAvatarBackup } from '../../../src/lib/avatarStorage';

const PatientAddressLeafletPicker = dynamic(() => import('../../../src/components/patient/views/PatientAddressLeafletPicker'), { ssr: false });

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden", className)}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-healup-light-blue rounded-xl text-healup-blue">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    {action}
  </div>
);

const InputField = ({ label, value, icon: Icon, type = "text", placeholder, onChange }: { label: string; value: string; icon?: any; type?: string; placeholder?: string; onChange?: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-500 mr-1">{label}</label>
    <div className="relative">
      <input 
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healup-blue/20 focus:border-healup-blue transition-all text-slate-700"
      />
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('personal');
  const [me, setMe] = useState<PatientMe | null>(null);
  const [draft, setDraft] = useState({ name: '', email: '', phone: '', date_of_birth: '' });
  const [initial, setInitial] = useState({ name: '', email: '', phone: '', date_of_birth: '' });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<PatientAddress[]>([]);
  /** Snapshot of last saved addresses (server). Deletes apply on «حفظ التغييرات». */
  const [initialAddresses, setInitialAddresses] = useState<PatientAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdShake, setPwdShake] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const [pickOpen, setPickOpen] = useState(false);
  const [pickLat, setPickLat] = useState<number>(30.0444);
  const [pickLng, setPickLng] = useState<number>(31.2357);
  const [pickFocus, setPickFocus] = useState(0);
  const [pickCity, setPickCity] = useState<string>('');
  const [pickDistrict, setPickDistrict] = useState<string>('');
  const [pickAddress, setPickAddress] = useState<string>('');

  const [nameOpen, setNameOpen] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrIcon, setAddrIcon] = useState<'home'|'work'|'other'>('home');
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  /** Selected address for checkout (العناوين المسجلة); persisted on «حفظ التغييرات». */
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [persistedAddressSelectionId, setPersistedAddressSelectionId] = useState<number | null>(null);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const selectionDirty = useMemo(
    () => selectedAddressId !== persistedAddressSelectionId,
    [selectedAddressId, persistedAddressSelectionId],
  );
  const addressBookDirty = useMemo(() => {
    const cur = addresses
      .map((a) => a.id)
      .slice()
      .sort((a, b) => a - b)
      .join(",");
    const ini = initialAddresses
      .map((a) => a.id)
      .slice()
      .sort((a, b) => a - b)
      .join(",");
    return cur !== ini;
  }, [addresses, initialAddresses]);
  const canSave = isDirty || selectionDirty || addressBookDirty;
  const [leaveIntent, setLeaveIntent] = useState<{ type: 'href'; href: string } | null>(null);
  const [leaveBusy, setLeaveBusy] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const allowLeaveRef = useRef(false);

  const continueLeaving = (intent: { type: 'href'; href: string }) => {
    allowLeaveRef.current = true;
    window.location.assign(intent.href);
  };

  const stayOnPage = () => {
    if (leaveBusy) return;
    setLeaveIntent(null);
    setLeaveError(null);
  };

  const leaveAndDiscard = () => {
    if (!leaveIntent || leaveBusy) return;
    onCancel();
    continueLeaving(leaveIntent);
  };

  const saveAndLeave = async () => {
    if (!leaveIntent || leaveBusy) return;
    setLeaveError(null);
    setLeaveBusy(true);
    try {
      await onSave();
      continueLeaving(leaveIntent);
    } catch {
      setLeaveError('تعذر حفظ التغييرات. حاول مرة أخرى.');
      setLeaveBusy(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!canSave) {
      setLeaveIntent(null);
      setLeaveError(null);
      setLeaveBusy(false);
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (allowLeaveRef.current) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const next = new URL(href, window.location.href);
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const nextPath = `${next.pathname}${next.search}${next.hash}`;
      if (currentPath === nextPath) return;

      event.preventDefault();
      event.stopPropagation();
      setLeaveError(null);
      setLeaveIntent({ type: 'href', href: next.href });
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onDocumentClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onDocumentClick, true);
    };
  }, [canSave]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const meRes = await patientService.getMe();
        setMe(meRes.data);
        const d = {
          name: meRes.data.name || '',
          email: meRes.data.email || '',
          phone: meRes.data.phone || '',
          date_of_birth: meRes.data.date_of_birth ? String(meRes.data.date_of_birth).slice(0, 10) : '',
        };
        setDraft(d);
        setInitial(d);
        const cachedAvatar = readAvatar('patient', meRes.data.id ?? meRes.data.email, {
          includeBackup: true,
          migrateLegacy: true,
        });
        const resolvedAvatar =
          meRes.data.avatar_url
          || (cachedAvatar && cachedAvatar.length > 10 ? cachedAvatar : null);
        setAvatar(resolvedAvatar);
        if (typeof window !== 'undefined' && meRes.data.avatar_url) {
          writeAvatar('patient', meRes.data.avatar_url, meRes.data.id ?? meRes.data.email);
        }

        const addrRes = await patientService.listAddresses();
        const list = addrRes.data || [];
        setAddresses(list);
        setInitialAddresses(list.map((a) => ({ ...a })));

        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(CHECKOUT_SELECTED_ADDRESS_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as { addressId?: number };
              const id = Number(parsed.addressId);
              if (Number.isFinite(id) && list.some((a) => a.id === id)) {
                setSelectedAddressId(id);
                setPersistedAddressSelectionId(id);
              }
            }
          } catch {
            /* ignore */
          }
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      if (isDirty) {
        const res = await patientService.updateMe({
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          dateOfBirth: draft.date_of_birth ? new Date(draft.date_of_birth).toISOString() : null,
        });
        const d = {
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          date_of_birth: res.data.date_of_birth ? String(res.data.date_of_birth).slice(0, 10) : '',
        };
        setInitial(d);
        setDraft(d);
        if (typeof window !== 'undefined' && res.data.avatar_url) {
          setAvatar(res.data.avatar_url);
          writeAvatar('patient', res.data.avatar_url, res.data.id ?? res.data.email);
          window.dispatchEvent(new CustomEvent('healup:patient-profile-updated'));
        }
      }

      if (addressBookDirty) {
        for (const prev of initialAddresses) {
          if (!addresses.some((a) => a.id === prev.id)) {
            await patientService.deleteAddress(prev.id);
          }
        }
        setInitialAddresses(addresses.map((a) => ({ ...a })));
      }

      if (typeof window !== 'undefined') {
        if (selectedAddressId != null) {
          localStorage.setItem(
            CHECKOUT_SELECTED_ADDRESS_KEY,
            JSON.stringify({ addressId: selectedAddressId }),
          );
        } else {
          localStorage.removeItem(CHECKOUT_SELECTED_ADDRESS_KEY);
        }
      }
      setPersistedAddressSelectionId(selectedAddressId);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setDraft(initial);
    setSelectedAddressId(persistedAddressSelectionId);
    setAddresses(initialAddresses.map((a) => ({ ...a })));
  };

  const submitPassword = async () => {
    setPwdError(null);
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setPwdError('كلمتا المرور غير متطابقتين');
      setPwdShake(true);
      setTimeout(() => setPwdShake(false), 450);
      return;
    }
    try {
      await patientService.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwdOpen(false);
    } catch (e: unknown) {
      setPwdError(getAuthErrorMessage(e, 'فشل تغيير كلمة المرور'));
      setPwdShake(true);
      setTimeout(() => setPwdShake(false), 450);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`);
      const data = await res.json();
      const a = data?.address || {};
      const city = a.city || a.town || a.village || '';
      const district = a.suburb || a.neighbourhood || a.county || '';
      const display = data?.display_name || '';
      setPickCity(city);
      setPickDistrict(district);
      setPickAddress(display);
    } catch {
      // ignore
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPickLat(lat);
      setPickLng(lng);
      setPickFocus((x) => x + 1);
      void reverseGeocode(lat, lng);
    });
  };

  const openAddAddress = () => {
    setPickOpen(true);
    setPickCity('');
    setPickDistrict('');
    setPickAddress('');
    setTimeout(() => locateMe(), 50);
  };

  const onMapPick = (lat: number, lng: number) => {
    setPickLat(lat);
    setPickLng(lng);
    setPickFocus((x) => x + 1);
    void reverseGeocode(lat, lng);
  };

  const savePickedLocation = () => {
    setPickOpen(false);
    setNameOpen(true);
    setAddrLabel('Home');
    setAddrIcon('home');
  };

  const createAddress = async () => {
    setAddressError(null);
    setAddressSaving(true);
    try {
      const normalizedPayload = {
        label: addrLabel.trim() || 'العنوان',
        iconKey: addrIcon,
        city: (pickCity || '').trim().slice(0, 120) || null,
        district: (pickDistrict || '').trim().slice(0, 120) || null,
        // Backend limit is 500 chars; reverse-geocode display names can exceed it.
        addressDetails: (pickAddress || '').trim().slice(0, 500) || null,
        latitude: pickLat,
        longitude: pickLng,
      };

      const res = await patientService.createAddress(normalizedPayload);

      // Show created address immediately, then try to sync from server.
      if (res?.data) {
        setAddresses((prev) => [res.data, ...prev.filter((x) => x.id !== res.data.id)]);
        setInitialAddresses((prev) => [res.data, ...prev.filter((x) => x.id !== res.data.id)]);
      }
      try {
        const fresh = await patientService.listAddresses();
        const next = fresh.data || (res?.data ? [res.data] : []);
        setAddresses(next);
        setInitialAddresses(next.map((a) => ({ ...a })));
      } catch {
        // Keep optimistic address in UI if refresh fails; initialAddresses already updated if res.data.
      }
      setNameOpen(false);
    } catch (e: unknown) {
      setAddressError(getAuthErrorMessage(e, 'تعذر حفظ العنوان. حاول مرة أخرى.'));
    } finally {
      setAddressSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setAvatarError(null);
    const localPreview = URL.createObjectURL(file);
    setAvatar(localPreview);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        if (!dataUrl) return;
        writePatientAvatarBackup(dataUrl, me?.id ?? me?.email);
      };
      reader.readAsDataURL(file);
    } catch {
      // ignore backup generation failure
    }
    try {
      const res = await patientService.uploadAvatar(file);
      setAvatar(res.avatar_url);
      writeAvatar('patient', res.avatar_url, me?.id ?? me?.email);
      window.dispatchEvent(new CustomEvent('healup:patient-profile-updated'));
    } catch (e: unknown) {
      // Fallback: persist locally if upload API fails.
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = String(reader.result || '');
          if (!dataUrl) return;
          setAvatar(dataUrl);
          writeAvatar('patient', dataUrl, me?.id ?? me?.email);
          window.dispatchEvent(new CustomEvent('healup:patient-profile-updated'));
        };
        reader.readAsDataURL(file);
      } catch {
        setAvatarError(getAuthErrorMessage(e, 'تعذر حفظ صورة الملف الشخصي.'));
      }
    }
  };

  const navItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col rtl font-sans">
      {/* Header */}
      <header className="bg-white border-bottom border-slate-100 sticky top-0 z-50 px-4 py-3 sm:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-healup-blue p-1.5 rounded-lg text-white">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="text-2xl font-extrabold text-healup-blue tracking-tight">Healup</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Card */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden shadow-lg">
                  <img 
                    src={avatar || "https://picsum.photos/seed/profile/200/200"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-1 right-1 p-2 bg-healup-blue text-white rounded-full shadow-md hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadAvatar(f);
                  e.currentTarget.value = '';
                }} />
                {avatarError ? <div className="mt-2 text-xs text-red-600 font-bold">{avatarError}</div> : null}
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-800">{me?.name || (loading ? '...' : '')}</h1>
                <p className="text-slate-500 font-medium">Patient #: #{me?.id ?? '—'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <span className="px-3 py-1 bg-healup-light-blue text-healup-blue text-xs font-bold rounded-full">Blood type: A+</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Verified account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Content Area */}
          <div className="lg:col-span-12 w-full space-y-8" style={{ maxWidth: 1120, marginRight: 0, marginLeft: "auto" }}>
            
            {/* Basic Info Section */}
            <Card className="p-8 min-h-[300px]">
              <SectionHeader icon={User} title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full name" value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} />
                <InputField label="Email" value={draft.email} onChange={(v) => setDraft((p) => ({ ...p, email: v }))} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 mr-1">Phone number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={draft.phone}
                      onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healup-blue/20 focus:border-healup-blue transition-all text-slate-700 text-left"
                      dir="ltr"
                    />
                    <div className="w-20 px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-center font-bold">
                      +20
                    </div>
                  </div>
                </div>
                <InputField label="Date of birth" value={draft.date_of_birth} type="date" onChange={(v) => setDraft((p) => ({ ...p, date_of_birth: v }))} />
              </div>
            </Card>

            {/* Addresses Section */}
            <Card className="p-8 min-h-[250px]">
              <SectionHeader 
                icon={MapPin} 
                title="Saved addresses" 
                action={
                  <button type="button" onClick={openAddAddress} className="text-healup-blue font-bold flex items-center gap-1 hover:underline">
                    <Plus size={18} />
                    <span>Add new address</span>
                  </button>
                }
              />
              <div className="space-y-4">
                {addresses.map((addr) => {
                  const Icon = addr.icon_key === 'work' ? Briefcase : addr.icon_key === 'other' ? MapPin : Home;
                  const line = [addr.district, addr.city, addr.address_details].filter(Boolean).join('، ');
                  const isSelected = selectedAddressId === addr.id;
                  return (
                  <div
                    key={addr.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAddressId((cur) => (cur === addr.id ? null : addr.id))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedAddressId((cur) => (cur === addr.id ? null : addr.id));
                      }
                    }}
                    className={cn(
                      'flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 transition-colors group cursor-pointer text-right',
                      isSelected
                        ? 'border-healup-blue shadow-md shadow-healup-blue/10 bg-white'
                        : 'border-slate-100 hover:border-healup-blue/30',
                    )}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="p-3 bg-white rounded-xl text-healup-blue shadow-sm shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800">{addr.label}</h4>
                        <p className="text-sm text-slate-500 break-words">{line || '—'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddresses((p) => p.filter((x) => x.id !== addr.id));
                        setSelectedAddressId((cur) => (cur === addr.id ? null : cur));
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )})}
              </div>
            </Card>

            {/* Security Section */}
            <Card className="p-8">
              <SectionHeader icon={Shield} title="Security" />
              <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-healup-light-blue rounded-xl text-healup-blue">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Password</h4>
                    <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                  </div>
                </div>
                <button type="button" onClick={() => setPwdOpen((v) => !v)} className="px-6 py-2.5 bg-healup-light-blue text-healup-blue font-bold rounded-xl hover:bg-healup-blue hover:text-white transition-all">
                  Change password
                </button>
              </div>

              <AnimatePresence>
                {pwdOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={cn("mt-4 overflow-hidden", pwdShake ? "animate-[shake_.35s]" : "")}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <InputField label="Current password" value={currentPassword} type="password" onChange={setCurrentPassword} />
                      <InputField label="New password" value={newPassword} type="password" onChange={setNewPassword} />
                      <InputField label="Confirm password" value={confirmPassword} type="password" onChange={setConfirmPassword} />
                      {pwdError ? <div className="md:col-span-3 text-sm text-red-600 font-bold">{pwdError}</div> : null}
                      <div className="md:col-span-3 flex justify-end gap-2">
                        <button type="button" onClick={() => setPwdOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600">Cancel</button>
                        <button type="button" onClick={() => void submitPassword()} className="px-5 py-2.5 bg-healup-blue text-white rounded-xl font-bold">حفظ</button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button type="button" onClick={onCancel} className="flex-1 sm:flex-none px-10 py-4 bg-white text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button type="button" disabled={!canSave || saving} onClick={() => void onSave()} className="flex-1 sm:flex-none px-10 py-4 bg-healup-blue text-white font-bold rounded-2xl shadow-lg shadow-healup-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <CheckCircle2 size={20} />
                <span>Save changes</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2024 هيل أب للخدمات الطبية. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Map modal */}
      <AnimatePresence>
        {pickOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] bg-black/40 p-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div className="font-extrabold text-slate-800">اختيار العنوان</div>
                <button type="button" className="text-slate-500 text-2xl" onClick={() => setPickOpen(false)}>×</button>
              </div>
              <div style={{ height: 360, position: 'relative' }}>
                <PatientAddressLeafletPicker latitude={pickLat} longitude={pickLng} focusToken={pickFocus} onPick={onMapPick} />
                <button
                  type="button"
                  onClick={locateMe}
                  style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 1200 }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow"
                >
                  موقعي الحالي
                </button>
              </div>
              <div className="p-5">
                <div className="text-sm text-slate-500 font-bold mb-2">العنوان</div>
                <div className="text-slate-700 text-sm">{pickAddress || 'اختر موقعًا من الخريطة'}</div>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setPickOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600">Cancel</button>
                  <button type="button" onClick={savePickedLocation} className="px-5 py-2.5 bg-healup-blue text-white rounded-xl font-bold">حفظ</button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Name + icon modal */}
      <AnimatePresence>
        {nameOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3100] bg-black/40 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-extrabold text-slate-800">حفظ العنوان</div>
                <button type="button" className="text-slate-500 text-2xl" onClick={() => setNameOpen(false)}>×</button>
              </div>
              <div className="space-y-3">
                <InputField label="اسم العنوان" value={addrLabel} onChange={setAddrLabel} />
                <div className="text-sm font-bold text-slate-600">الأيقونة</div>
                <div className="flex gap-2">
                  {[
                    { k: 'home', Icon: Home },
                    { k: 'work', Icon: Briefcase },
                    { k: 'other', Icon: MapPin },
                  ].map((it) => (
                    <button
                      key={it.k}
                      type="button"
                      onClick={() => setAddrIcon(it.k as any)}
                      className={cn("flex-1 border rounded-2xl p-3 font-bold", addrIcon === it.k ? "border-healup-blue bg-healup-light-blue text-healup-blue" : "border-slate-200 bg-white text-slate-600")}
                    >
                      <div className="flex items-center justify-center">
                        <it.Icon size={18} />
                      </div>
                    </button>
                  ))}
                </div>
                {addressError ? <div className="text-sm text-red-600 font-bold">{addressError}</div> : null}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setNameOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600">Cancel</button>
                  <button type="button" disabled={addressSaving} onClick={() => void createAddress()} className="px-5 py-2.5 bg-healup-blue text-white rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed">حفظ</button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {leaveIntent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3200] bg-slate-900/45 backdrop-blur-[2px] p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    className="shrink-0 w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                    onClick={stayOnPage}
                    aria-label="إغلاق"
                  >
                    ×
                  </button>
                  <div className="flex items-start gap-3 text-right">
                    <div className="shrink-0 mt-0.5 w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xl leading-8">تغييرات غير محفوظة</div>
                      <p className="text-sm text-slate-500 mt-1 leading-7">
                        لديك تغييرات لم يتم حفظها. اختر الإجراء الذي تريد تنفيذه قبل مغادرة الصفحة.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {leaveError ? (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 font-bold">
                    {leaveError}
                  </div>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={stayOnPage}
                    disabled={leaveBusy || saving}
                    className="h-12 px-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    البقاء في الصفحة
                  </button>
                  <button
                    type="button"
                    onClick={leaveAndDiscard}
                    disabled={leaveBusy || saving}
                    className="h-12 px-4 bg-slate-100 border border-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    تجاهل التغييرات والمغادرة
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveAndLeave()}
                    disabled={leaveBusy || saving}
                    className="h-12 px-4 bg-healup-blue text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-healup-blue/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-healup-blue/30 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-healup-blue/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {leaveBusy || saving ? 'جارٍ الحفظ...' : 'حفظ ثم مغادرة'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
