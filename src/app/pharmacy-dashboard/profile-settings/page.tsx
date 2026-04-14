import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyProfileContent from "@/components/pharmacy/views/PharmacyProfileContent";

export default function PharmacyProfileSettingsPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="profile-settings" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <PharmacyProfileContent />
        </div>
      </div>
    </div>
  );
}
