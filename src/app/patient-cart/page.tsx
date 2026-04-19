"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService, getAuthErrorMessage } from "@/services/authService";
import { requestService } from "@/services/requestService";
import PatientShell from "@/components/patient/PatientShell";
import {
  getCart,
  setCart,
  getPendingDrug,
  clearPendingDrug,
  getPrescription,
  setPrescription,
  clearPrescription,
  type CartItemData,
} from "@/lib/cartStorage";
import { searchDrugs, getDrugPrice } from "@/lib/drugs";
import "./cart.css";

export type CartItem = CartItemData;

const EMOJIS = ["💊", "🩺", "🌿", "💉", "🧴"];
const GRADIENTS = [
  "linear-gradient(135deg,#f8f0e8,#e8d5b7)",
  "linear-gradient(135deg,#e8f5e9,#a5d6a7)",
  "linear-gradient(135deg,#e0f2fe,#7dd3fc)",
  "linear-gradient(135deg,#fce7f3,#f9a8d4)",
  "linear-gradient(135deg,#ede9fe,#c4b5fd)",
];

const DEFAULT_DESC_TABLETS = "أقراص - حسب الوصفة";
const DEFAULT_DESC_DRINK = "شراب - حسب الوصفة";

function pendingDrugToCartItem(pending: { name: string; type?: string; strength?: string; tabletCount?: string; drinkType?: string; volume?: string }): CartItem {
  const idx = 0;
  let desc = "";
  if (pending.type === "drink") {
    desc = pending.drinkType && pending.volume
      ? `${pending.drinkType}، ${pending.volume} مل`
      : DEFAULT_DESC_DRINK;
  } else {
    desc = pending.strength && pending.tabletCount
      ? (() => {
          const cnt = parseInt(pending.tabletCount, 10) || 0;
          const word = cnt === 1 ? " قرص" : cnt === 2 ? " قرصان" : cnt >= 3 && cnt <= 10 ? " أقراص" : " قرص";
          return `${pending.strength} ملغ، ${pending.tabletCount}${word}`;
        })()
      : DEFAULT_DESC_TABLETS;
  }
  return {
    id: `item-${Date.now()}`,
    name: pending.name,
    desc,
    price: getDrugPrice(pending.name),
    qty: 1,
    emoji: EMOJIS[idx],
    gradient: GRADIENTS[idx],
  };
}

function SummaryIconDoc() {
  return (
    <div className="summary-icon-doc">
      <img src="/images/summary-icon.png" alt="" width={28} height={36} style={{ objectFit: "contain" }} />
    </div>
  );
}

function buildTabletDesc(strength: string, count: string): string {
  if (!strength || !count) return DEFAULT_DESC_TABLETS;
  const cnt = parseInt(count, 10) || 0;
  const word =
    cnt === 1 ? " قرص" : cnt === 2 ? " قرصان" : cnt >= 3 && cnt <= 10 ? " أقراص" : " قرص";
  return `${strength} ملغ، ${count}${word}`;
}

function buildDrinkDesc(drinkType: string, volume: string): string {
  if (!drinkType || !volume) return DEFAULT_DESC_DRINK;
  return `${drinkType}، ${volume} مل`;
}

function dataUrlToFile(dataUrl: string, filename: string): File | null {
  try {
    const parts = dataUrl.split(",");
    if (parts.length < 2) return null;
    const mimeMatch = parts[0].match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] || "image/jpeg";
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], filename, { type: mime });
  } catch {
    return null;
  }
}

export default function PatientCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [prescription, setPrescriptionState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const pending = getPendingDrug();
    const storedCart = getCart();
    const rx = getPrescription();

    if (pending) {
      const newItem = pendingDrugToCartItem(pending);
      if (storedCart && storedCart.length > 0) {
        setItems([...storedCart, newItem]);
      } else {
        setItems([newItem]);
      }
      clearPendingDrug();
    } else if (storedCart && storedCart.length > 0) {
      setItems(storedCart);
    }

    if (rx?.imageBase64) {
      setPrescriptionState(rx.imageBase64);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    setCart(items);
  }, [items, initialized]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drugName, setDrugName] = useState("");
  const [drugQty, setDrugQty] = useState("1");
  const [drugType, setDrugType] = useState<"tablets" | "drink">("tablets");
  const [drugStrength, setDrugStrength] = useState("");
  const [drugTabletCount, setDrugTabletCount] = useState("");
  const [drugDrinkType, setDrugDrinkType] = useState("");
  const [drugVolume, setDrugVolume] = useState("");
  const [nameError, setNameError] = useState(false);
  const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState(false);
  const [couponShake, setCouponShake] = useState(false);
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const drugNameInputRef = useRef<HTMLInputElement>(null);
  const modalPrescriptionInputRef = useRef<HTMLInputElement>(null);

  const COUPONS: Record<string, number> = { healup2010: 10, healup2015: 15, healup2020: 20, healup2025: 25 };

  const { subtotal, discount, deliveryFee, tax, total } = useMemo(() => {
    let s = 0;
    let itemCount = 0;
    items.forEach((it) => {
      s += it.price * it.qty;
      itemCount += it.qty;
    });
    const disc = appliedCoupon ? (s * appliedCoupon.percent) / 100 : 0;
    const afterDiscount = s - disc;
    const fee = itemCount >= 5 ? 0 : 25;
    const t = afterDiscount * 0.15;
    return { subtotal: s, discount: disc, deliveryFee: fee, tax: t, total: afterDiscount + fee + t };
  }, [items, appliedCoupon]);

  const removePrescription = useCallback(() => {
    clearPrescription();
    setPrescriptionState(null);
  }, []);

  const changeQty = useCallback(
    (id: string, delta: number) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
        )
      );
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setDrugName("");
    setDrugQty("1");
    setDrugType("tablets");
    setDrugStrength("");
    setDrugTabletCount("");
    setDrugDrinkType("");
    setDrugVolume("");
    setDrugSuggestions([]);
    setShowDrugSuggestions(false);
    setNameError(false);
  }, []);

  const applyCoupon = useCallback(() => {
    const code = couponCode.trim().toLowerCase();
    if (!code) {
      setCouponError(true);
      setCouponShake(true);
      setTimeout(() => setCouponShake(false), 500);
      return;
    }
    const percent = COUPONS[code];
    if (percent !== undefined) {
      setAppliedCoupon({ code, percent });
      setCouponError(false);
    } else {
      setAppliedCoupon(null);
      setCouponError(true);
      setCouponShake(true);
      setTimeout(() => setCouponShake(false), 500);
    }
  }, [couponCode]);

  const handleDrugNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setDrugName(q);
    if (q.trim()) {
      setDrugSuggestions(searchDrugs(q));
      setShowDrugSuggestions(true);
    } else {
      setDrugSuggestions([]);
      setShowDrugSuggestions(false);
    }
  }, []);

  const handleSelectDrugSuggestion = useCallback((drug: string) => {
    setDrugName(drug);
    setDrugSuggestions([]);
    setShowDrugSuggestions(false);
    drugNameInputRef.current?.focus();
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleModalPrescriptionUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPrescription(base64);
        setPrescriptionState(base64);
        closeModal();
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    []
  );

  const addDrug = useCallback(() => {
    const name = drugName.trim();
    const qty = parseInt(drugQty, 10) || 1;

    if (!name) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const price = getDrugPrice(name);
    let desc = "";
    if (drugType === "tablets") {
      desc = buildTabletDesc(drugStrength.trim(), drugTabletCount.trim());
    } else {
      desc = buildDrinkDesc(drugDrinkType.trim(), drugVolume.trim());
    }

    const idx = items.length % 5;
    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      name,
      desc,
      price,
      qty,
      emoji: EMOJIS[idx],
      gradient: GRADIENTS[idx],
    };

    setItems((prev) => [...prev, newItem]);
    closeModal();
  }, [
    drugName,
    drugQty,
    drugType,
    drugStrength,
    drugTabletCount,
    drugDrinkType,
    drugVolume,
    items.length,
    closeModal,
  ]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const isUserLoggedIn = authService.getGuard() === "user" && !!authService.getToken();

  const submitRequestFromCart = useCallback(async () => {
    const medicines = items.map((item) => ({
      medicine_name: item.name,
      quantity: item.qty,
    }));

    if (!medicines.length && !prescription) {
      setCheckoutError("يرجى إضافة دواء أو روشتة قبل إتمام الطلب.");
      return;
    }
    setCheckoutError(null);

    try {
      const prescriptionFile = prescription ? dataUrlToFile(prescription, `rx-${Date.now()}.jpg`) : undefined;
      let createdRequestId: number | null = null;
      try {
        const created = await requestService.create({ medicines, estimated_total: Number(total.toFixed(2)) }, prescriptionFile || undefined);
        createdRequestId = created?.request?.id ?? null;
      } catch {
        // Cloud upload may fail in some environments; keep supporting prescription-only by retrying with direct URL payload.
        if (!prescription) throw new Error("create_request_failed");
        const created = await requestService.create(
          {
            medicines,
            prescription_url: prescription,
            estimated_total: Number(total.toFixed(2)),
          },
          undefined
        );
        createdRequestId = created?.request?.id ?? null;
      }

      if (createdRequestId && typeof window !== "undefined") {
        const key = `healup_checkout_pricing_${createdRequestId}`;
        if (appliedCoupon) {
          window.localStorage.setItem(
            key,
            JSON.stringify({
              coupon_code: appliedCoupon.code,
              coupon_percent: appliedCoupon.percent,
            })
          );
        } else {
          window.localStorage.removeItem(key);
        }
      }

      setCart([]);
      clearPrescription();
      setPrescriptionState(null);

      router.push("/patient-review-orders");
    } catch {
      setCheckoutError("تعذر إرسال الطلب حالياً. حاول مرة أخرى.");
    }
  }, [appliedCoupon, items, prescription, router, total]);

  const handleCheckout = useCallback(() => {
    if (!items.length && !prescription) {
      setCheckoutError("يرجى إضافة دواء أو روشتة قبل إتمام الطلب.");
      return;
    }
    if (isUserLoggedIn) {
      void submitRequestFromCart();
      return;
    }
    setCheckoutError(null);
    setLoginPromptOpen(true);
    setLoginError(null);
  }, [isUserLoggedIn, items.length, prescription, submitRequestFromCart]);

  const handleCheckoutLogin = useCallback(async () => {
    setLoginError(null);
    setIsLoginSubmitting(true);
    try {
      const res = await authService.login({
        email: loginEmail,
        password: loginPassword,
        guard: "user",
      });
      authService.setSession(res, "user");
      setLoginPromptOpen(false);
      await submitRequestFromCart();
    } catch (e: unknown) {
      setLoginError(getAuthErrorMessage(e, "فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى."));
    } finally {
      setIsLoginSubmitting(false);
    }
  }, [loginEmail, loginPassword, submitRequestFromCart]);

  return (
    <PatientShell active="cart">
    <div className="healupCart">
      {/* NAVBAR */}
      <nav>
        <div className="nav-left">
          <div className="nav-logo-wrap">
            <div className="nav-logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <Link href="/patient-home" className="nav-logo">
              Healup
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <button type="button" className="bell-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#64748b"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <div className="avatar">E</div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">
        <div className="cart-right">
          <div className="section-header">
            <h1 className="section-title">الأدوية المختارة</h1>
            <div className="badge">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              {items.length + (prescription ? 1 : 0)} أصناف
            </div>
          </div>

          {prescription && (
            <div className="product-card prescription-card">
              <div className="product-info" style={{ flex: 1 }}>
                <div className="product-name">روشتة طبية</div>
                <div className="product-desc">بانتظار تحديد السعر من الصيدلية</div>
              </div>
              <div className="prescription-img-wrap">
                <img src={prescription} alt="الروشتة" />
              </div>
              <button
                type="button"
                className="delete-btn"
                onClick={removePrescription}
                style={{ alignSelf: "flex-start" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                حذف
              </button>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-actions">
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => changeQty(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => changeQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteItem(item.id)}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  حذف
                </button>
              </div>
              <div className="product-info">
                <div className="product-name">{item.name}</div>
                {item.desc ? (
                  <div className="product-desc">{item.desc}</div>
                ) : null}
                <div className="product-price">
                  {item.price.toFixed(2)} ج.م
                </div>
              </div>
              <div
                className="product-img-placeholder"
                style={{ background: item.gradient }}
              >
                {item.emoji}
              </div>
            </div>
          ))}

          <div className="add-more-card" onClick={openModal} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openModal()}>
            <div className="add-more-icon">+</div>
            <p className="add-more-text">هل تحتاج إلى أدوية أخرى؟</p>
            <button type="button" className="btn-add-drug" onClick={openModal}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              إضافة دواء آخر
            </button>
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div
            className="add-modal-overlay"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-drug-title"
          >
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
              <h3 id="add-drug-title">إضافة دواء جديد</h3>

              <label htmlFor="drugName">اسم الدواء</label>
              <div className="add-modal-drug-name-wrap" style={{ position: "relative", marginBottom: 16 }}>
                <input
                  ref={drugNameInputRef}
                  id="drugName"
                  type="text"
                  placeholder="أدخل اسم الدواء"
                  value={drugName}
                  onChange={handleDrugNameChange}
                  onFocus={() => drugName.trim() && setShowDrugSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDrugSuggestions(false), 200)}
                  className={nameError ? "error" : ""}
                />
                {showDrugSuggestions && (
                  <div className="add-modal-autocomplete">
                    {drugSuggestions.length > 0 ? (
                      drugSuggestions.map((drug) => (
                        <div
                          key={drug}
                          className="add-modal-autocomplete-item"
                          onClick={() => handleSelectDrugSuggestion(drug)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSelectDrugSuggestion(drug)}
                        >
                          {drug}
                        </div>
                      ))
                    ) : (
                      <div className="add-modal-autocomplete-empty">اكتب للبحث</div>
                    )}
                  </div>
                )}
              </div>

              <label>نوع الدواء</label>
              <div className="drug-type-row">
                <label>
                  <input
                    type="radio"
                    name="drugType"
                    value="tablets"
                    checked={drugType === "tablets"}
                    onChange={() => setDrugType("tablets")}
                  />
                  <span>أقراص</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="drugType"
                    value="drink"
                    checked={drugType === "drink"}
                    onChange={() => setDrugType("drink")}
                  />
                  <span>شراب</span>
                </label>
              </div>

              {drugType === "tablets" ? (
                <div className="drug-fields-grid">
                  <div>
                    <label htmlFor="drugStrength">القوة (ملغ)</label>
                    <input
                      id="drugStrength"
                      type="number"
                      placeholder="500"
                      min={1}
                      value={drugStrength}
                      onChange={(e) => setDrugStrength(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="drugTabletCount">عدد الأقراص</label>
                    <input
                      id="drugTabletCount"
                      type="number"
                      placeholder="20"
                      min={1}
                      value={drugTabletCount}
                      onChange={(e) => setDrugTabletCount(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="drug-fields-grid">
                  <div>
                    <label htmlFor="drugDrinkType">النوع</label>
                    <input
                      id="drugDrinkType"
                      type="text"
                      placeholder="طارد للبلغم"
                      value={drugDrinkType}
                      onChange={(e) => setDrugDrinkType(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="drugVolume">الحجم (مل)</label>
                    <input
                      id="drugVolume"
                      type="number"
                      placeholder="120"
                      min={1}
                      value={drugVolume}
                      onChange={(e) => setDrugVolume(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <label htmlFor="drugQty">الكمية</label>
              <input
                id="drugQty"
                type="number"
                placeholder="1"
                min={1}
                value={drugQty}
                onChange={(e) => setDrugQty(e.target.value)}
              />

              <input
                ref={modalPrescriptionInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleModalPrescriptionUpload}
              />
              <button
                type="button"
                className="btn-continue"
                style={{ marginTop: 8, marginBottom: 10 }}
                onClick={() => modalPrescriptionInputRef.current?.click()}
              >
                إضافة روشتة
              </button>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={closeModal}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="modal-btn-add"
                  onClick={addDrug}
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="summary-card">
          <div className="summary-header">
            <div className="summary-header-right">
              <SummaryIconDoc />
              <span className="summary-title">ملخص الطلب</span>
            </div>
          </div>

          <div className="summary-row" style={{ borderBottom: "none" }}>
            <span>المجموع الفرعي</span>
            <span className="val">{subtotal.toFixed(2)} ج.م</span>
          </div>
          {appliedCoupon ? (
            <div className="summary-row" style={{ borderBottom: "none" }}>
              <span>خصم ({appliedCoupon.percent}%)</span>
              <span className="free">-{discount.toFixed(2)} ج.م</span>
            </div>
          ) : null}
          <div className="summary-row" style={{ borderBottom: "none" }}>
            <span>رسوم التوصيل</span>
            {deliveryFee === 0 ? (
              <span className="free">مجاني</span>
            ) : (
              <span className="val">{deliveryFee.toFixed(2)} ج.م</span>
            )}
          </div>
          <div className="summary-row">
            <span>ضريبة القيمة المضافة (15%)</span>
            <span className="val">{tax.toFixed(2)} ج.م</span>
          </div>

          <div className="total-row">
            <span className="total-label">الإجمالي الكلي</span>
            <span className="total-value">{total.toFixed(2)} ج.م</span>
          </div>
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              lineHeight: 1.5,
              color: "#92400e",
              textAlign: "center",
              fontWeight: 600,
              background: "#fffbeb",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            هذا المبلغ <strong>تقديري</strong> من أسعار الدليل داخل التطبيق؛ الأسعار النهائية تأتي من الصيدلية بعد مراجعة طلبك.
          </p>

          <button
            type="button"
            className="btn-checkout"
            onClick={handleCheckout}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            إتمام الطلب
          </button>
          {checkoutError ? (
            <p style={{ color: "#b91c1c", fontSize: 12, textAlign: "center", marginTop: 8 }}>{checkoutError}</p>
          ) : null}
          <button type="button" className="btn-continue" onClick={openModal}>
            متابعة التسوق
          </button>

          <div className="coupon-section">
            <p className="coupon-label">هل لديك كود خصم؟</p>
            <div className="coupon-row">
              <input
                className={`coupon-input ${couponError ? "error" : ""}`}
                type="text"
                placeholder="أدخل الكود هنا"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponError(false); }}
              />
              <button
                type="button"
                className={`btn-apply ${couponShake ? "shake" : ""}`}
                onClick={applyCoupon}
              >
                تطبيق
              </button>
            </div>
            {appliedCoupon && (
              <p className="coupon-applied" style={{ fontSize: 12, color: "var(--green)", marginTop: 6 }}>
                تم تطبيق خصم {appliedCoupon.percent}%
              </p>
            )}
          </div>

          <div className="secure-badge">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                fill="#94a3b8"
              />
              <polyline
                points="9 12 11 14 15 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span>تفاعل آمن وموثوق</span>
              <span>غير بيانات محفوظة</span>
            </div>
          </div>
        </div>
      </div>

      {loginPromptOpen ? (
        <div className="add-modal-overlay" onClick={() => setLoginPromptOpen(false)} role="dialog" aria-modal="true">
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h3>يجب تسجيل الدخول لإتمام الطلب</h3>
            <label htmlFor="checkout-login-email">البريد الإلكتروني</label>
            <input
              id="checkout-login-email"
              type="text"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="example@mail.com"
            />
            <label htmlFor="checkout-login-password">كلمة المرور</label>
            <input
              id="checkout-login-password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
            />
            {loginError ? <p style={{ color: "#b91c1c", fontSize: 13, marginBottom: 8 }}>{loginError}</p> : null}
            <div className="modal-actions">
              <button type="button" className="modal-btn-cancel" onClick={() => setLoginPromptOpen(false)}>
                إلغاء
              </button>
              <button type="button" className="modal-btn-add" onClick={handleCheckoutLogin} disabled={isLoginSubmitting}>
                {isLoginSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </div>
            <p style={{ marginTop: 10, fontSize: 13, textAlign: "center" }}>
              ليس لديك حساب؟{" "}
              <Link href="/signup" style={{ color: "#1a56db", fontWeight: 700 }}>
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      ) : null}

      {/* FOOTER */}
      <footer>
        <div className="footer-icons">
          <div className="footer-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </div>
          <div className="footer-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
          </div>
          <div className="footer-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 4h6v1H9v-1zm0 3h6v1H9v-1z" />
            </svg>
          </div>
        </div>
        <p className="footer-copy">
          © Healup 2024. جميع الحقوق محفوظة لشركة للرعاية الصحية المتكاملة.
        </p>
      </footer>
    </div>
    </PatientShell>
  );
}







