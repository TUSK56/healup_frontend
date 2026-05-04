"use client";

import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { authService, getAuthErrorMessage } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { HEALUP_PASSWORD_POLICY_AR, isHealupStrictPassword } from "@/lib/passwordPolicy";

const LeafletPicker = dynamic(() => import("@/components/pharmacy/views/PharmacyProfileLeaflet"), { ssr: false });

export default function SignupPage() {
  const [accountType, setAccountType] = useState("patient");
  const router = useRouter();
  // Form state (for demo, not validated)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [district, setDistrict] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [latitude, setLatitude] = useState<number | null>(30.0444);
  const [longitude, setLongitude] = useState<number | null>(31.2357);
  const [locating, setLocating] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const [terms, setTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onPickLocation = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await response.json();
      const address = data?.address ?? {};

      const city = address.city || address.town || address.state || address.county || "";
      const districtName = address.suburb || address.neighbourhood || address.quarter || address.city_district || "";
      const details = data?.display_name || "";

      setGovernorate(city);
      setDistrict(districtName);
      setAddressDetails(details);
    } catch {
      // Keep coordinates even if reverse geocoding fails.
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع الجغرافي.");
      return;
    }

    setError(null);
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        await onPickLocation(lat, lng);
        setFocusToken((x) => x + 1);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("تعذر الحصول على موقعك الحالي. تأكد من السماح بخدمة الموقع.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!terms) {
      setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (!isHealupStrictPassword(password)) {
      setError(HEALUP_PASSWORD_POLICY_AR);
      return;
    }

    setIsSubmitting(true);
    try {
      if (accountType === "patient") {
        const res = await authService.registerPatient({
          name: fullName,
          email,
          phone: phone || undefined,
          city: governorate || undefined,
          district: district || undefined,
          addressDetails: addressDetails || undefined,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
          password,
          passwordConfirmation: confirmPassword,
        });

        authService.setSession(res, "user");
        // Keep post-signup patient UI identical to direct guest-style patient-home render.
        window.location.assign("/patient-home");
        return;
      }

      router.push("/pharmacy-signup");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "فشل إنشاء الحساب. تأكد من البيانات وحاول مرة أخرى."));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', background: '#f0f3f8', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GuestTopNavbar />
        {/* MAIN */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 18, padding: '40px 44px 36px', width: '100%', maxWidth: 560, boxShadow: '0 4px 28px rgba(0,0,0,0.07)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 8 }}>إنشاء حساب جديد</h1>
              <p style={{ fontSize: 13.5, color: '#9aa3b0', fontWeight: 400 }}>انضم إلى منصة Healup الصحية وابدأ رحلتك نحو رعاية أفضل</p>
            </div>
            {/* Account Type */}
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>نوع الحساب</span>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexDirection: 'row' }}>
              <button type="button" className={accountType === "patient" ? "type-btn active" : "type-btn"} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 10px', border: '1.5px solid #dde3ed', borderRadius: 10, background: '#fff', fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, color: accountType === "patient" ? '#2356c8' : '#1a2e4a', cursor: 'pointer', transition: 'all 0.2s', borderColor: accountType === "patient" ? '#2356c8' : '#dde3ed', borderWidth: accountType === "patient" ? 2 : 1.5, backgroundColor: accountType === "patient" ? '#f0f5ff' : '#fff' }} onClick={() => setAccountType("patient") }>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: accountType === "patient" ? '#2356c8' : '#9aa3b0' }}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                مريض
              </button>
              <button
                type="button"
                className={accountType === "pharmacy" ? "type-btn active" : "type-btn"}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 10px', border: '1.5px solid #dde3ed', borderRadius: 10, background: '#fff', fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, color: accountType === "pharmacy" ? '#2356c8' : '#1a2e4a', cursor: 'pointer', transition: 'all 0.2s', borderColor: accountType === "pharmacy" ? '#2356c8' : '#dde3ed', borderWidth: accountType === "pharmacy" ? 2 : 1.5, backgroundColor: accountType === "pharmacy" ? '#f0f5ff' : '#fff' }}
                onClick={() => {
                  setAccountType("pharmacy");
                  router.push("/pharmacy-signup");
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: accountType === "pharmacy" ? '#2356c8' : '#9aa3b0' }}><path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                صيدلية
              </button>
            </div>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>الاسم الكامل</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type="text" placeholder="أدخل اسمك بالكامل" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </span>
              </div>
            </div>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>البريد الإلكتروني</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </span>
              </div>
            </div>
            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>رقم الهاتف</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'ltr', transition: 'border-color 0.2s' }}
                />
              </div>
            </div>
            {/* Password Row */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>
                  كلمة المرور
                  <span style={{ display: 'block', fontWeight: 500, fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{HEALUP_PASSWORD_POLICY_AR}</span>
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '13px 44px 13px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{ position: 'absolute', left: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                    aria-label="toggle-password"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>تأكيد كلمة المرور</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '13px 44px 13px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    style={{ position: 'absolute', left: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                    aria-label="toggle-confirm-password"
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontSize: 14, fontWeight: 800, color: '#1a2e4a', marginBottom: 12, direction: 'ltr' }}>
              تحديد الموقع
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#2356c8' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <input
                type="text"
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                placeholder="المحافظة / المدينة"
                style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl' }}
              />
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="الحي / المنطقة"
                style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="العنوان بالتفصيل"
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl' }}
              />
            </div>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ width: '100%', height: 210, borderRadius: 12, border: '1.5px solid #dde3ed', position: 'relative', zIndex: 0, overflow: 'hidden' }}>
                <LeafletPicker
                  latitude={latitude ?? 30.0444}
                  longitude={longitude ?? 31.2357}
                  onPick={onPickLocation}
                  focusToken={focusToken}
                />
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={locating}
                style={{ position: 'absolute', bottom: 10, left: 10, background: locating ? '#6b88de' : '#2356c8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: locating ? 'not-allowed' : 'pointer', zIndex: 1000 }}
              >
                {locating ? 'جاري تحديد الموقع...' : 'تحديد موقعي الحالي'}
              </button>
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 20, direction: 'ltr' }}>
              <label htmlFor="terms" style={{ fontSize: 13, color: '#1a2e4a', fontWeight: 500, cursor: 'pointer', order: 1, direction: 'rtl' }}>أوافق على <a href="#" style={{ color: '#2356c8', textDecoration: 'none', fontWeight: 700 }}>شروط الاستخدام</a> و <a href="#" style={{ color: '#2356c8', textDecoration: 'none', fontWeight: 700 }}>سياسة الخصوصية</a></label>
              <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#2356c8', cursor: 'pointer', flexShrink: 0, order: 2 }} />
            </div>
            {error ? (
              <div style={{ marginBottom: 14, fontSize: 13, fontWeight: 600, color: '#b91c1c', textAlign: 'right' }}>
                {error}
              </div>
            ) : null}
            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 16, background: isSubmitting ? '#6b88de' : '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 20 }}>{isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</button>
            {/* Login link */}
            <div style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa3b0', fontWeight: 500 }}>
              لديك حساب بالفعل؟ <a href="/patient-login" style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none' }}>تسجيل الدخول</a>
            </div>
          </form>
        </main>
        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: 18, fontSize: 12.5, color: '#9aa3b0', fontWeight: 500, direction: 'ltr' }}>
          © 2024 Healup. جميع الحقوق محفوظة.
        </footer>
    </div>
  );
}
