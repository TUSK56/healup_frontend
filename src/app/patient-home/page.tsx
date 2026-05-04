"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import PatientShell from "@/components/patient/PatientShell";
import { searchDrugs, getDrugPrice } from "@/lib/drugs";
import { getCart, setCart, setPrescription, type CartItemData } from "@/lib/cartStorage";
import { useLocale } from "@/contexts/LocaleContext";
import "./landing.css";

const EMOJIS = ["💊", "🩺", "🌿", "💉", "🧴"];
const GRADIENTS = [
  "linear-gradient(135deg,#f8f0e8,#e8d5b7)",
  "linear-gradient(135deg,#e8f5e9,#a5d6a7)",
  "linear-gradient(135deg,#e0f2fe,#7dd3fc)",
  "linear-gradient(135deg,#fce7f3,#f9a8d4)",
  "linear-gradient(135deg,#ede9fe,#c4b5fd)",
];

export default function PatientHomePage() {
  const { locale, toggleLocale } = useLocale();
  const tx = useCallback((ar: string, en: string) => (locale === "ar" ? ar : en), [locale]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [searchShake, setSearchShake] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prescriptionInputRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = authService.getGuard() === "user" && !!authService.getToken();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchError(false);
    if (q.trim()) {
      setSuggestions(searchDrugs(q));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSelectSuggestion = useCallback((drug: string) => {
    setSearchQuery(drug);
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchError(true);
      setSearchShake(true);
      setTimeout(() => setSearchShake(false), 500);
      return;
    }
    setSearchError(false);

    const existing = getCart() ?? [];
    const idx = existing.length % 5;
    const newItem: CartItemData = {
      id: `item-${Date.now()}`,
      name: q,
      desc: tx("أقراص - حسب الوصفة", "Tablets - as prescribed"),
      price: getDrugPrice(q),
      qty: 1,
      emoji: EMOJIS[idx],
      gradient: GRADIENTS[idx],
    };
    setCart([...existing, newItem]);
    router.push("/patient-cart");
  }, [searchQuery, router]);

  const handlePrescriptionUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPrescription(base64);
      setPrescriptionPreview(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <PatientShell active="home">
    <div className="healupLanding">
      {/* ─── NAVBAR ─── */}
      <nav>
        <ul className="nav-links">
          <li>
            <Link href="/patient-home">{tx("الرئيسية", "Home")}</Link>
          </li>
          <li>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("how")}>
              {tx("كيف يعمل", "How it works")}
            </button>
          </li>
          <li>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("pharmacies")}>
              {tx("الصيدليات", "Pharmacies")}
            </button>
          </li>
          <li>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("contact")}>
              {tx("اتصل بنا", "Contact us")}
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          <button type="button" className="nav-lang-toggle" onClick={toggleLocale} aria-label={locale === "ar" ? "English" : "العربية"}>
            {locale === "ar" ? "English" : "العربية"}
          </button>
          <Link href="/patient-cart" className="btn-login-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {tx("السلة", "Cart")}
          </Link>
          {!isLoggedIn ? (
            <>
              <a className="btn-login-nav" href="/patient-login">
                {tx("تسجيل الدخول", "Login")}
              </a>
              <a className="btn-cta-nav" href="/signup">
                {tx("انضم إلينا", "Join us")}
              </a>
            </>
          ) : (
            <button
              type="button"
              className="btn-login-nav"
              onClick={() => {
                authService.logout();
                router.refresh();
              }}
            >
              {tx("تسجيل الخروج", "Logout")}
            </button>
          )}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-badge">
          <span>{tx("أكبر شبكة صيدليات في المنطقة", "The largest pharmacy network in the region")}</span>
        </div>

        <h1>
          {tx("ابحث عن دوائك", "Find your medicine")} <span className="highlight">{tx("الآن", "now")}</span> {tx("بكل سهولة", "with ease")}
        </h1>
        <p>{tx("نحن نربط المرضى بالصيدليات التي توفر الأدوية النادرة والأساسية في وقت قياسي.", "We connect patients with pharmacies that provide essential and hard-to-find medicines quickly.")}</p>

        <div id="search-section" className="search-bar-wrap">
          <div className={`search-bar ${searchError ? "search-bar-error" : ""}`}>
            <span className="search-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              className={`search-input ${searchError ? "search-input-error" : ""}`}
              type="text"
              placeholder={tx("ما هو اسم الدواء الذي تبحث عنه؟", "What medicine are you looking for?")}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
            />
            <div className="search-divider" />
            <div className="location-select">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a4fa0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{tx("كل المدن", "All cities")}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div className="search-divider" />
            <button className={`btn-search ${searchShake ? "btn-search-shake" : ""}`} type="button" onClick={handleSearchSubmit}>
              {tx("بحث", "Search")}
            </button>
          </div>
          {searchError ? (
            <p className="search-error-message">Please enter medicine name before searching.</p>
          ) : null}
          {showSuggestions && (
            <div className="search-autocomplete">
              {suggestions.length > 0 ? (
                suggestions.map((drug) => (
                  <div
                    key={drug}
                    className="search-autocomplete-item"
                    onClick={() => handleSelectSuggestion(drug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSelectSuggestion(drug)}
                  >
                    {drug}
                  </div>
                ))
              ) : (
                <div className="search-autocomplete-empty">
                  {tx("اكتب للبحث في قائمة الأدوية", "Type to search medicine list")}
                </div>
              )}
            </div>
          )}
        </div>

        <input
          ref={prescriptionInputRef}
          type="file"
          accept="image/*"
          className="prescription-input-hidden"
          style={{ display: "none" }}
          onChange={handlePrescriptionUpload}
        />
        {prescriptionPreview ? (
          <div className="prescription-uploaded" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <img src={prescriptionPreview} alt="الروشتة" style={{ maxWidth: 200, maxHeight: 150, borderRadius: 8, border: "1px solid var(--border)" }} />
            <Link href="/patient-cart" className="btn-search" style={{ textDecoration: "none" }}>
              اذهب للسلة
            </Link>
          </div>
        ) : (
        <button
          className="prescription-btn"
          type="button"
          onClick={() => prescriptionInputRef.current?.click()}
        >
          <span className="prescription-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <span className="prescription-text">
            <strong>رفع الروشتة</strong>
            <span>اضغط هنا لرفع ملف الروشتة الخاص بك</span>
          </span>
        </button>
        )}

        <div className="hero-badges">
          <div className="hero-badge-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5l-4-4 1.41-1.41L10.5 13.67l5.59-5.59L17.5 9.5l-7 7z" />
            </svg>
            أدوية معتمدة
          </div>
          <div className="hero-badge-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            توصيل سريع
          </div>
          <div className="hero-badge-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H4.07A8 8 0 0 1 20 12h-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a3 3 0 0 0 3-3v-5a9 9 0 0 0-9-9z" />
            </svg>
            دعم 24/7
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="section section-center">
        <h2>كيف يعمل Healup؟</h2>
        <p className="section-sub">ثلاث خطوات بسيطة تفصلك عن الحصول على دوائك النادر أو المفقود من السوق.</p>

        <div className="steps-grid">
          <div className="step">
            <div className="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a4fa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="7" />
                <line x1="21" y1="21" x2="15" y2="15" />
                <polyline points="7.5 10 9.5 12 13 8" />
              </svg>
            </div>
            <h3>1. ابحث</h3>
            <p>أدخل اسم الدواء المطلوب في محرك البحث الخاص بنا للتحقق من قاعدة بياناتنا الواسعة.</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a4fa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <polyline points="9 13 11 15 15 11" />
              </svg>
            </div>
            <h3>2. اطلب</h3>
            <p>في حال عدم توفره، أرسل طلبًا مباشرة لأمانات الصيدليات المشتركة في شبكتنا بضغطة زر.</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a4fa0" stroke="none">
                <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>
            <h3>3. احصل على النتائج</h3>
            <p>ستصلك تنبيهات فورية قرب توفر الدواء وتذكيده من قبل إحدى الصيدليات القريبة منك.</p>
          </div>
        </div>
      </section>

      {/* ─── WHY HEALUP ─── */}
      <section className="why-section">
        <div className="why-image-col">
          <div className="why-image-wrap">
            <img src="/images/patient_home.png" alt="patient home" />
            <div className="why-card-overlay">
              <div className="why-card-overlay-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="why-card-overlay-text">
                <strong>ثقة وأمان</strong>
                <span>أكثر من 5000 صيدلية معتمدة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="why-content">
          <h2>لماذا تختار Healup؟</h2>

          <div className="why-features">
            <div className="why-feature">
              <div className="why-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="why-feature-text">
                <strong>شبكة واسعة ومتنامية</strong>
                <span>نحن نضم آلاف الصيدليات في جميع المدن لضمان أعلى نسبة لتوفر الأدوية.</span>
              </div>
            </div>

            <div className="why-feature">
              <div className="why-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="why-feature-text">
                <strong>سرعة استجابة مذهلة</strong>
                <span>نظامنا يرسل طلبك مباشرة في ثوان، وتحصل على الردود والإشعار في غضون دقائق.</span>
              </div>
            </div>

            <div className="why-feature">
              <div className="why-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="why-feature-text">
                <strong>خصوصية تامة لبياناتك</strong>
                <span>بياناتك الطبية وطلباتك مشفرة ومحمية بالكامل ولا يتم مشاركتها إلا مع الصيدلية المختارة.</span>
              </div>
            </div>
          </div>

          <button
            className="btn-start"
            type="button"
            onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            ابدأ البحث مجانًا
          </button>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="stats-section" id="pharmacies">
        <div className="stat-item">
          <div className="stat-number">100K+</div>
          <div className="stat-label">مستخدم نشط</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5K+</div>
          <div className="stat-label">صيدلية مسجلة</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">200K+</div>
          <div className="stat-label">طلب دواء ناجح</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">15</div>
          <div className="stat-label">مدينة مغطاة</div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="contact">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              Healup
              <span className="footer-logo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v3H9z" />
                  <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </span>
            </a>
            <p>نحن هنا لتسهيل رحلة البحث عن الدواء ومزودي الرعاية الصحية وضمان الوصول الفوري للعلاج في الوقت المناسب.</p>
            <div className="footer-social" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%', marginRight: 0, marginLeft: 'auto', direction: 'ltr' }}>
              <button className="social-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
              <button className="social-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <ul>
              <li>
                <a href="#">الرئيسية</a>
              </li>
              <li>
                <a href="#">عن Healup</a>
              </li>
              <li>
                <a href="#">الصيدليات الشريكة</a>
              </li>
              <li>
                <a href="#">تطبيق هيلاب</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>الدعم القانوني</h4>
            <ul>
              <li>
                <a href="#">سياسة الخصوصية</a>
              </li>
              <li>
                <a href="#">شروط الخدمة</a>
              </li>
              <li>
                <a href="#">الأسئلة الشائعة</a>
              </li>
              <li>
                <a href="#">تواصل معنا</a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-newsletter">
            <h4>اشترك في النشرة البريدية</h4>
            <p>احصل على آخر التحديثات الصحية وتنبيهات توفر الأدوية.</p>
            <div className="newsletter-form">
              <button className="newsletter-btn" type="button">
                اشترك
              </button>
              <input className="newsletter-input" type="email" placeholder="البريد الإلكتروني" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">© Healup 2024. جميع الحقوق محفوظة.</div>
      </footer>
    </div>
    </PatientShell>
  );
}





