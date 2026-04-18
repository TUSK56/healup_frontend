"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  focusToken?: number;
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function FlyToPoint({ latitude, longitude, focusToken }: { latitude: number; longitude: number; focusToken: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [latitude, longitude, focusToken, map]);
  return null;
}

export default function PatientPharmacyMap({ latitude, longitude, focusToken = 0 }: Props) {
  return (
    <div className="patientPharmacyMap" style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]} />
      <FlyToPoint latitude={latitude} longitude={longitude} focusToken={focusToken} />
      </MapContainer>
      <style jsx global>{`
        .patientPharmacyMap .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 10px 25px rgba(2, 6, 23, 0.15) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .patientPharmacyMap .leaflet-control-zoom a {
          width: 38px !important;
          height: 38px !important;
          line-height: 36px !important;
          font-size: 20px !important;
          font-weight: 800 !important;
          border: none !important;
          background: #ffffff !important;
          color: #0f172a !important;
        }
        .patientPharmacyMap .leaflet-control-zoom a:hover {
          background: #eff6ff !important;
          color: #1a56db !important;
        }
      `}</style>
    </div>
  );
}

