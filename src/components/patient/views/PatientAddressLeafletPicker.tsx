"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  focusToken: number;
  onPick: (lat: number, lng: number) => void;
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPoint({ latitude, longitude, focusToken }: { latitude: number; longitude: number; focusToken: number }) {
  const map = useMap();
  useEffect(() => {
    if (!focusToken) return;
    map.flyTo([latitude, longitude], 16, { duration: 0.7 });
  }, [focusToken, latitude, longitude, map]);
  return null;
}

export default function PatientAddressLeafletPicker({ latitude, longitude, focusToken, onPick }: Props) {
  return (
    <div className="patientAddressPicker" style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} />
        <ClickToPick onPick={onPick} />
        <FlyToPoint latitude={latitude} longitude={longitude} focusToken={focusToken} />
      </MapContainer>

      <style jsx global>{`
        .patientAddressPicker .leaflet-control-zoom a {
          width: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

