"use client";

import React from "react";
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
	const [rows, setRows] = React.useState<IncomingRow[]>([]);
	const [loading, setLoading] = React.useState(true);

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

	return (
		<div className="pharmacyDashboard">
			<PharmacySidebar active="new-orders" />

			<div className="main" style={{ padding: 0 }}>
				<PharmacyTopNavbar />

				<div className="pharmacy-content-shell">
					<div className="content">
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
							<h2 className="section-title" style={{ margin: 0 }}>الطلبات الجديدة</h2>
							<span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{rows.length} طلب</span>
						</div>

						<div className="section-card" style={{ paddingTop: 12 }}>
							<table className="orders-table" style={{ tableLayout: "fixed", width: "100%" }}>
								<thead>
									<tr>
										<th style={{ width: "25%", textAlign: "center" }}>المريض</th>
										<th style={{ width: "40%", textAlign: "center" }}>الدواء / الوصفة</th>
										<th style={{ width: "20%", textAlign: "center" }}>الوقت</th>
										<th style={{ width: "15%", textAlign: "center" }}>الإجراء</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row, idx) => (
										<tr key={row.id}>
											<td style={{ textAlign: "center" }}>
												<div className="patient-row" style={{ justifyContent: "center" }}>
													<div className="patient-avatar" style={{ background: idx % 2 === 0 ? "#fde68a" : "#d9f99d" }}>👤</div>
													<span>{row.patient_name}</span>
												</div>
											</td>
											<td style={{ textAlign: "center" }}>{row.medicine_title}</td>
											<td style={{ textAlign: "center" }}>{relativeTime(row.created_at)}</td>
											<td style={{ textAlign: "center" }}>
												<button
													className="pill pill-red"
													style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626" }}
													type="button"
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
											</td>
										</tr>
									))}

									{!loading && rows.length === 0 ? (
										<tr>
											<td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "14px" }}>
												لا توجد طلبات جديدة حالياً.
											</td>
										</tr>
									) : null}

									{loading ? (
										<tr>
											<td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "14px" }}>
												جاري تحميل الطلبات...
											</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
