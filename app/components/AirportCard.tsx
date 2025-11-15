"use client";

import { useRouter } from "next/navigation";
import { useThemeStore } from "../stores/theme.store";

interface Props {
  airport: any;
}

const AirplaneIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

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
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        theme === "dark"
          ? "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
          : "bg-white/90 backdrop-blur-sm border border-blue-200/30 shadow-lg"
      }`}
    >
      {/* Silueta de avión de fondo */}
      <div
        className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          opacity: theme === "dark" ? 0.1 : 0.06,
          transform: "rotate(-15deg) translate(10%, 10%)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme === "dark" ? "#ffffff" : "#1e40af"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>

      {/* Icono de avión en círculo */}
      <div
        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-500 to-cyan-400"
            : "bg-gradient-to-br from-blue-600 to-blue-500"
        } shadow-lg`}
      >
        <AirplaneIcon />
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        <h2
          className={`text-lg font-bold mb-2 pr-16 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {airport.airport_name}
        </h2>
        <p
          className={`text-sm mb-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {airport.city_iata_code || airport.city_iata}, {airport.country_name || "N/A"}
        </p>
        <div
          className={`text-4xl font-bold ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent"
          }`}
        >
          {airport.iata_code}
        </div>
      </div>
    </div>
  );
}
