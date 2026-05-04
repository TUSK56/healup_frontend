"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import api from "@/services/apiService";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import "../cart.css";
import "@/components/pharmacy/pharmacy-sidebar.css";

export default function PharmacyNewOrdersPage() {
	const searchParams = useSearchParams();
	const openRequestId = searchParams.get("openRequestId");
	const [modalOpen, setModalOpen] = React.useState(false);
	const iframeVersion = "20260504-openrequest-tab-1";

	React.useEffect(() => {
		void (async () => {
			try {
				await api.patch("/notifications/read-all");
			} catch {
				// no-op
			}
		})();
	}, []);

	React.useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			if (event.data?.type === "healup-download-file") {
				const filename = event.data.filename as string | undefined;
				const dataUrl = event.data.dataUrl as string | undefined;
				if (!filename || !dataUrl) return;
				const a = document.createElement("a");
				a.href = dataUrl;
				a.download = filename;
				a.rel = "noopener";
				document.body.appendChild(a);
				a.click();
				a.remove();
				return;
			}

			if (event?.data?.type === "healup-price-modal") {
				const open = Boolean(event.data.open);
				setModalOpen(open);
			}
		};
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, []);

	const iframeSrc = openRequestId
		? `/pharmacy_orders_1.html?openRequestId=${encodeURIComponent(openRequestId)}&v=${iframeVersion}`
		: `/pharmacy_orders_1.html?v=${iframeVersion}`;

	return (
		<div className="pharmacyDashboard">
			<PharmacySidebar active="new-orders" />

			<div className="main" style={{ padding: 0 }}>
				<PharmacyTopNavbar />

				<div className="pharmacy-content-shell">
					{modalOpen ? (
						<div
							aria-hidden
							style={{
								position: "fixed",
								inset: 0,
								background: "rgba(15, 23, 42, 0.52)",
								zIndex: 199,
								pointerEvents: "auto",
							}}
						/>
					) : null}
					<div style={{ position: "relative", zIndex: modalOpen ? 201 : 50, width: "100%", height: "100%" }}>
						<iframe src={iframeSrc} title="Pharmacy Orders 1" className="h-full w-full border-0" />
					</div>
				</div>
			</div>
		</div>
	);
}
