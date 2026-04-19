"use client";

import React from "react";
import { useRouter } from "next/navigation";
import api from "@/services/apiService";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import "../cart.css";
import "@/components/pharmacy/pharmacy-sidebar.css";

type IncomingRow = {
	id: number;
	patient_name: string;
	medicine_title: string;
	created_at: string;
	hasPrescription: boolean;
};

function parseServerDate(value: string) {
	const v = (value || "").trim();
	if (!v) return new Date(0);
	if (/[zZ]$/.test(v) || /[+-]\d\d:\d\d$/.test(v)) return new Date(v);
	return new Date(`${v}Z`);
}

function relativeTime(createdAt: string) {
	const diffMs = Math.max(0, Date.now() - parseServerDate(createdAt).getTime());
	const sec = Math.floor(diffMs / 1000);
	if (sec < 60) return "الآن";
	const minutes = Math.floor(sec / 60);
	if (minutes < 60) return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقيقة`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعة`;
	const days = Math.floor(hours / 24);
	return days === 1 ? "منذ يوم" : `منذ ${days} يوم`;
}

export default function PharmacyNewOrdersPage() {
	const router = useRouter();
	const [rows, setRows] = React.useState<IncomingRow[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [query, setQuery] = React.useState("");
	const [prescriptionOnly, setPrescriptionOnly] = React.useState(false);
	const [urgentFirst, setUrgentFirst] = React.useState(true);

	const loadIncoming = React.useCallback(async () => {
		setLoading(true);
		try {
			const res = await api.get<{
				data: Array<{
					request: {
						id: number;
						created_at: string;
						patient: { name: string };
						medicines: Array<{ medicine_name: string }>;
						prescription_url: string | null;
					};
				}>;
			}>("/pharmacy/requests");

			const sorted = [...(res.data?.data || [])].sort(
				(a, b) =>
					parseServerDate(b.request.created_at).getTime() -
					parseServerDate(a.request.created_at).getTime(),
			);

			const mapped = sorted.map((entry) => {
				const request = entry.request;
				const firstMedicine = request.medicines?.[0]?.medicine_name;
				return {
					id: request.id,
					patient_name: request.patient?.name || "مريض",
					medicine_title: firstMedicine || (request.prescription_url ? "وصفة طبية" : "طلب دواء"),
					created_at: request.created_at,
					hasPrescription: Boolean(request.prescription_url),
				};
			});

			setRows(mapped);
		} catch {
			setRows([]);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		void loadIncoming();
	}, [loadIncoming]);

	const filteredRows = React.useMemo(() => {
		const q = query.trim().toLowerCase();
		let list = rows.filter((row) => {
			if (prescriptionOnly && !row.hasPrescription) return false;
			if (!q) return true;
			const haystack = `${row.patient_name} ${row.medicine_title} ${row.id}`.toLowerCase();
			return haystack.includes(q);
		});

		if (urgentFirst) {
			list = [...list].sort((a, b) => parseServerDate(a.created_at).getTime() - parseServerDate(b.created_at).getTime());
		}

		return list;
	}, [rows, query, prescriptionOnly, urgentFirst]);

	return (
		<div className="pharmacyDashboard">
			<PharmacySidebar active="new-orders" />

			<div className="main" style={{ padding: 0 }}>
				<PharmacyTopNavbar />

				<div className="pharmacy-content-shell">
					<div className="content">
						<div style={{ marginBottom: 14, textAlign: "right" }}>
							<h2 style={{ margin: 0, fontSize: 42, fontWeight: 900, color: "#10223f", lineHeight: 1.2 }}>الطلبات الجديدة</h2>
							<p style={{ marginTop: 8, fontSize: 14, color: "#64748b", fontWeight: 700 }}>
								لديك {filteredRows.length} طلب بانتظار المراجعة وتأكيد التوفر
							</p>
						</div>

						<div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
							<button
								type="button"
								onClick={() => setUrgentFirst((x) => !x)}
								style={{
									padding: "10px 14px",
									borderRadius: 10,
									border: urgentFirst ? "1px solid #0456AE" : "1px solid #e2e8f0",
									background: urgentFirst ? "#0456AE" : "#fff",
									color: urgentFirst ? "#fff" : "#475569",
									fontWeight: 800,
									fontSize: 13,
								}}
							>
								عاجل أولاً
							</button>
							<button
								type="button"
								onClick={() => setPrescriptionOnly((x) => !x)}
								style={{
									padding: "10px 14px",
									borderRadius: 10,
									border: prescriptionOnly ? "1px solid #0456AE" : "1px solid #e2e8f0",
									background: prescriptionOnly ? "#0456AE" : "#fff",
									color: prescriptionOnly ? "#fff" : "#475569",
									fontWeight: 800,
									fontSize: 13,
								}}
							>
								بوصفة طبية
							</button>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="بحث برقم الطلب، اسم المريض أو الدواء..."
								style={{
									flex: 1,
									minWidth: 220,
									padding: "10px 14px",
									borderRadius: 10,
									border: "1px solid #e2e8f0",
									background: "#fff",
									fontFamily: "Cairo, sans-serif",
									textAlign: "right",
								}}
							/>
						</div>

						<div className="new-orders-grid">
							{filteredRows.map((row, idx) => (
								<article key={row.id} className="new-order-card">
									<div className="new-order-top">
										<div className="new-order-id">#HLP-{row.id}</div>
										<div className="new-order-patient">{row.patient_name}</div>
										<div className="new-order-time">{relativeTime(row.created_at)}</div>
									</div>

									<div className="new-order-body">
										<div className="new-order-avatar" style={{ background: idx % 2 === 0 ? "#dbeafe" : "#fee2e2" }}>👤</div>
										<div className="new-order-medicine">{row.medicine_title}</div>
										{row.hasPrescription ? <div className="new-order-rx">عرض الوصفة الطبية</div> : <div className="new-order-rx muted">لا يوجد وصفة مرفقة</div>}
									</div>

									<div className="new-order-actions">
										<button
											type="button"
											className="new-btn available"
											onClick={() => router.push("/pharmacy-dashboard/current-orders")}
										>
											متوفر
										</button>
										<button
											type="button"
											className="new-btn unavailable"
											onClick={() => {
												void (async () => {
													try {
														await api.post(`/pharmacy/requests/${row.id}/decline`);
														await loadIncoming();
													} catch {
														// no-op
													}
												})();
											}}
										>
											غير متوفر
										</button>
									</div>
								</article>
							))}

							{loading ? <div className="new-orders-empty">جاري تحميل الطلبات...</div> : null}
							{!loading && filteredRows.length === 0 ? <div className="new-orders-empty">لا توجد طلبات جديدة حالياً.</div> : null}
						</div>

						<style jsx>{`
							.new-orders-grid {
								display: grid;
								grid-template-columns: repeat(2, minmax(0, 1fr));
								gap: 16px;
							}

							@media (max-width: 1200px) {
								.new-orders-grid {
									grid-template-columns: 1fr;
								}
							}

							.new-order-card {
								background: #fff;
								border: 1px solid #dbe4ef;
								border-radius: 16px;
								padding: 16px;
								box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
							}

							.new-order-top {
								display: flex;
								flex-direction: column;
								align-items: flex-end;
								gap: 4px;
								margin-bottom: 10px;
							}

							.new-order-id {
								font-size: 11px;
								font-weight: 800;
								color: #1d4ed8;
								background: #e8effc;
								padding: 3px 8px;
								border-radius: 8px;
							}

							.new-order-patient {
								font-size: 30px;
								font-weight: 900;
								color: #0f172a;
								line-height: 1.2;
							}

							.new-order-time {
								font-size: 12px;
								color: #64748b;
								font-weight: 700;
							}

							.new-order-body {
								background: #f8fafc;
								border-radius: 12px;
								padding: 12px;
								display: grid;
								grid-template-columns: auto 1fr;
								grid-template-areas:
									"avatar medicine"
									"avatar rx";
								gap: 6px 10px;
								align-items: center;
								margin-bottom: 10px;
							}

							.new-order-avatar {
								grid-area: avatar;
								width: 42px;
								height: 42px;
								border-radius: 10px;
								display: flex;
								align-items: center;
								justify-content: center;
							}

							.new-order-medicine {
								grid-area: medicine;
								font-size: 14px;
								font-weight: 800;
								color: #1e293b;
								text-align: right;
							}

							.new-order-rx {
								grid-area: rx;
								font-size: 12px;
								font-weight: 700;
								color: #2563eb;
								text-align: right;
							}

							.new-order-rx.muted {
								color: #94a3b8;
							}

							.new-order-actions {
								display: grid;
								grid-template-columns: 1fr 1fr;
								gap: 10px;
							}

							.new-btn {
								border: none;
								border-radius: 10px;
								padding: 10px 12px;
								font-family: Cairo, sans-serif;
								font-size: 13px;
								font-weight: 800;
								cursor: pointer;
							}

							.new-btn.available {
								background: #08a34b;
								color: #fff;
							}

							.new-btn.unavailable {
								background: #fee2e2;
								color: #dc2626;
							}

							.new-orders-empty {
								grid-column: 1 / -1;
								text-align: center;
								color: #64748b;
								padding: 18px;
								font-weight: 700;
								background: #fff;
								border: 1px dashed #cbd5e1;
								border-radius: 12px;
							}
						`}</style>
					</div>
				</div>
			</div>
		</div>
	);
}
