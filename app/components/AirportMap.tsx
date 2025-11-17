"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/theme.store";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

import L from "leaflet";

// Crear icono personalizado
const createMarkerIcon = (theme: "light" | "dark") => {
  return new L.Icon({
    iconUrl: "/Map Point.png",
    
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface Props {
  lat: number;
  lng: number;
}

export default function AirportMap({ lat, lng }: Props) {
  const { theme } = useThemeStore();
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setMarkerIcon(createMarkerIcon(theme));
  }, [theme]);

  if (!markerIcon) {
    return (
      <div className="mt-6 w-full h-[400px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <div className="mt-6 w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[lat, lng]}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ borderRadius: "0.5rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
