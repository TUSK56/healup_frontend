"use client";
import React from "react";
import { authService, getAuthErrorMessage } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const LeafletPicker = dynamic(() => import("@/components/pharmacy/views/PharmacyProfileLeaflet"), { ssr: false });

export default function PharmacySignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [district, setDistrict] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [focusToken, setFocusToken] = useState(0);

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

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (latitude == null || longitude == null) {
      setError("Please select the pharmacy location on the map to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.registerPharmacy({
        name: name || managerName,
        email,
        phone: phone || undefined,
        licenseNumber: licenseNumber || undefined,
        responsiblePharmacistName: managerName || undefined,
        city: governorate || undefined,
        district: district || undefined,
        addressDetails: addressDetails || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        password,
        passwordConfirmation: confirmPassword,
      });

      router.push("/pharmacy-login");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "فشل إنشاء حساب الصيدلية. تأكد من البيانات وحاول مرة أخرى."));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>تسجيل الصيدلية - Healup</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: 'Cairo, sans-serif', background: '#eef0f5', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px 60px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28, direction: 'ltr' }}>
          <div style={{ width: 46, height: 46, background: '#2356c8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6v3H9z" />
              <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#2356c8', letterSpacing: -0.5 }}>Healup</span>
        </div>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '36px 40px 40px', width: '100%', maxWidth: 580, boxShadow: '0 4px 28px rgba(0,0,0,0.07)' }}>
          <div style={{ textAlign: 'right', marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a2e4a', marginBottom: 6 }}>تسجيل الصيدلية</h1>
            <p style={{ fontSize: 13, color: '#9aa3b0', fontWeight: 400, lineHeight: 1.7 }}>انضم إلى شبكة <span style={{ color: '#2356c8', fontWeight: 700 }}>Healup</span> الطبية وابدأ في تقديم خدماتك الدوائية لآلاف المرضى.</p>
          </div>
          {/* Form fields (static, no logic) */}
          <form onSubmit={handleSubmit}>
            {/* Row 1: Pharmacy name + Manager name */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>اسم الصيدلية</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسم الصيدلية الكامل" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                  </span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>اسم الصيدلي المسؤول</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="الاسم كما هو في الهوية" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Row 2: Commercial license + Email */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>رقم الترخيص التجاري</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="رقم السجل التجاري" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
                  </span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>البريد الإلكتروني</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@pharmacy.com" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>رقم الهاتف (مصر)</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01X XXXX XXXX" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z"/></svg>
                  </span>
                </div>
                <div style={{ padding: '12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, fontWeight: 700, color: '#1a2e4a', background: '#fff', minWidth: 72, textAlign: 'center', flexShrink: 0 }}>+20</div>
              </div>
            </div>
            {/* Row 3: Password + Confirm */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>كلمة المرور</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  </button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1a2e4a', marginBottom: 7, textAlign: 'right' }}>تأكيد كلمة المرور</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 42px 12px 16px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
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
            {error ? (
              <div style={{ marginBottom: 14, fontSize: 13, fontWeight: 600, color: '#b91c1c', textAlign: 'right' }}>
                {error}
              </div>
            ) : null}
            {/* Map placeholder */}
            <div style={{ position: 'relative', marginBottom: 22 }}>
              <div style={{ width: '100%', height: 220, borderRadius: 12, border: '1.5px solid #dde3ed', position: 'relative', zIndex: 0, overflow: 'hidden' }}>
                <LeafletPicker
                  latitude={latitude ?? 30.0444}
                  longitude={longitude ?? 31.2357}
                  onPick={onPickLocation}
                  focusToken={focusToken}
                />
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'white', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#9aa3b0', zIndex: 999, pointerEvents: 'none', direction: 'rtl' }}>
                انقر لتحديد موقع الصيدلية بدقة
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={locating}
                style={{ position: 'absolute', bottom: 10, left: 10, background: locating ? '#6b88de' : '#2356c8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: locating ? 'not-allowed' : 'pointer', zIndex: 1000 }}
              >
                {locating ? 'جاري تحديد الموقع...' : 'تحديد الموقع الحالي'}
              </button>
            </div>
            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 16, background: isSubmitting ? '#6b88de' : '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, direction: 'rtl' }}>
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد للصيدلية'}
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'white' }}><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
            </button>
            {/* Login link */}
            <div style={{ textAlign: 'center', fontSize: 13, color: '#9aa3b0', fontWeight: 500, marginBottom: 24 }}>
              لديك حساب بالفعل؟ <a href="/pharmacy-login" style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none' }}>سجل دخولك هنا</a>
            </div>
          </form>
        </div>
        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: 12, color: '#9aa3b0', direction: 'rtl', marginTop: 8 }}>
          بالتسجيل في Healup، فأنك توافق على <a href="#" style={{ color: '#2356c8', textDecoration: 'none' }}>الشروط والأحكام</a> و <a href="#" style={{ color: '#2356c8', textDecoration: 'none' }}>سياسة الخصوصية</a>
        </footer>
      </body>
    </html>
  );
}
