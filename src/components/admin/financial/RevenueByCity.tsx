import { useLocale } from "@/contexts/LocaleContext";

export default function RevenueByCity() {
  const { t } = useLocale();
  const cities = [
    { name: t("admin.financial.cityCairo", "Cairo"), value: "820,000", percentage: 85, color: "bg-[#0456AE]" },
    { name: t("admin.financial.cityGiza", "Giza"), value: "540,000", percentage: 60, color: "bg-[#4B85C4]" },
    { name: t("admin.financial.cityAlexandria", "Alexandria"), value: "390,000", percentage: 45, color: "bg-[#7AA5D3]" },
  ];

  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-8 text-lg font-bold text-gray-900">{t("admin.financial.revenueByCityTitle", "Revenue distribution by city")}</h3>

      <div className="space-y-8">
        {cities.map((city, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">{city.name}</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{city.value}</span>
                <span className="text-[10px] text-gray-400">{t("admin.financial.currencyShort", "EGP")}</span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${city.color}`}
                style={{ width: `${city.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
