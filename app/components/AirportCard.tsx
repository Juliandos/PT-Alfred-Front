"use client";

import { useRouter } from "next/navigation";
import { useThemeStore } from "../stores/theme.store";
import Image from "next/image";

interface Props {
  airport: any;
}

export default function AirportCard({ airport }: Props) {
  const router = useRouter();
  const { theme } = useThemeStore();

  const handleClick = () => {
    if (airport.iata_code) {
      router.push(`/airport/${airport.iata_code}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{
        background: theme === "dark"
          ? "rgba(30, 41, 59, 0.7)"
          : "rgba(241, 245, 249, 0.9)",
        backdropFilter: "blur(10px)",
        minHeight: "180px",
      }}
    >
      {/* División vertical al 60% - lado izquierdo (contenido) */}
      <div className="absolute inset-0 w-[60%]" style={{
        background: theme === "dark"
          ? "rgba(30, 41, 59, 0.5)"
          : "rgba(241, 245, 249, 0.5)",
      }} />

      {/* División vertical al 60% - lado derecho (imagen) */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-[40%]"
        style={{
          backgroundImage: "url(/avionCard.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />

      {/* Contenido - lado izquierdo */}
      <div className="relative z-10 p-5 flex flex-col h-full justify-between" style={{ width: "60%" }}>
        {/* Nombre del aeropuerto y ciudad */}
        <div>
          <h2
            className={`text-sm font-semibold mb-1 leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {airport.airport_name}
          </h2>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {airport.city_iata_code || airport.city_iata}, {airport.country_name || "N/A"}
          </p>
        </div>

        {/* Código IATA grande en la parte inferior */}
        <div className="mt-auto">
          <div
            className="text-4xl font-black tracking-tight"
            style={{
              color: theme === "dark" ? "#3B82F6" : "#2563EB",
            }}
          >
            {airport.iata_code}
          </div>
        </div>
      </div>

      {/* Icono de avión en la esquina superior derecha */}
      <div
        className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: theme === "dark"
            ? "rgba(59, 130, 246, 0.4)"
            : "rgba(37, 99, 235, 0.3)",
        }}
      >
        <Image
          src="/PlaneIcon.png"
          alt="Airplane"
          width={24}
          height={24}
          style={{
            filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0) invert(1)",
          }}
        />
      </div>
    </div>
  );
}