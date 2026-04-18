"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  onPick: (lat: number, lng: number) => void;
  focusToken: number;
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
    map.flyTo([latitude, longitude], 16, { duration: 0.8 });
  }, [focusToken, latitude, longitude, map]);
  return null;
}

export default function PharmacyProfileLeaflet({ latitude, longitude, onPick, focusToken }: Props) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={14} style={{ height: "100%", width: "100%" }} attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]} />
      <ClickToPick onPick={onPick} />
      <FlyToPoint latitude={latitude} longitude={longitude} focusToken={focusToken} />
    </MapContainer>
  );
}

