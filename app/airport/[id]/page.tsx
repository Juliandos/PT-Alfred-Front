"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAirportStore } from "../../stores/airport.store";
import { useThemeStore } from "../../stores/theme.store";
import AirportMap from "../../components/AirportMap";

type Tab = "general" | "ubicacion" | "zona-horaria" | "estadisticas";

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StatsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default function AirportDetails() {
  const params = useParams();
  const router = useRouter();
  const { selectedAirport, loading, fetchAirportDetails } = useAirportStore();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchAirportDetails(id);
    }
  }, [id, fetchAirportDetails]);

  // Función para obtener la hora local
  const getLocalTime = () => {
    if (!selectedAirport?.timezone) return "N/A";
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("es-ES", {
        timeZone: selectedAirport.timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return formatter.format(now);
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`text-xl ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!selectedAirport) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`text-xl ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}>
          Aeropuerto no encontrado
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <InfoIcon /> },
    { id: "ubicacion", label: "Ubicación", icon: <LocationIcon /> },
    { id: "zona-horaria", label: "Zona Horaria", icon: <GlobeIcon /> },
    { id: "estadisticas", label: "Estadísticas", icon: <StatsIcon /> },
  ];

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: theme === "light" 
            ? "url(/airport-bg-light.jpg)" 
            : "url(/airport-bg.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: theme === "light" ? "brightness(1.1) contrast(1.05) blur(2px)" : "brightness(0.4) contrast(1.1) blur(2px)",
        }}
      />
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          theme === "dark" 
            ? "bg-[#000B1A] opacity-80" 
            : "bg-gradient-to-br from-blue-50/60 via-cyan-50/40 to-white/60 opacity-70"
        }`}
      />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className={`mb-6 px-4 py-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : "bg-white/90 hover:bg-white text-gray-800 border border-blue-200/30"
              }`}
            >
              ← Volver
            </button>

            <h1
              className={`font-montserrat-black text-4xl md:text-5xl lg:text-6xl mb-6 text-center ${
                theme === "dark" ? "gradient-text" : ""
              }`}
              style={
                theme === "light"
                  ? {
                      background: "linear-gradient(90deg, #1e40af 0%, #1e3a8a 20%, #1e3a8a 40%, #1e40af 60%, #2563eb 80%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "contrast(1.2) brightness(0.95)",
                    }
                  : {
                      textShadow: "0 0 40px rgba(0, 249, 255, 0.3)",
                    }
              }
            >
              {selectedAirport.airport_name}
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                      : theme === "dark"
                      ? "bg-gray-800/50 text-gray-300 hover:bg-gray-800/70"
                      : "bg-white/80 text-gray-700 hover:bg-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="space-y-6">
            {/* Tab: General */}
            {activeTab === "general" && (
              <InfoCard
                theme={theme}
                title="Información General"
                icon={<InfoIcon />}
                content={
                  <div className="space-y-3">
                    <InfoRow label="Código IATA" value={selectedAirport.iata_code || "N/A"} />
                    <InfoRow label="Código ICAO" value={selectedAirport.icao_code || "N/A"} />
                    <InfoRow label="País" value={`${selectedAirport.country_name || "N/A"} (${selectedAirport.country_iso2 || "N/A"})`} />
                    <InfoRow label="Ciudad IATA" value={selectedAirport.city_iata_code || selectedAirport.city_iata || "N/A"} />
                    <InfoRow label="Teléfono" value={selectedAirport.phone_number || "No disponible"} />
                  </div>
                }
              />
            )}

            {/* Tab: Ubicación */}
            {activeTab === "ubicacion" && (
              <InfoCard
                theme={theme}
                title="Ubicación"
                icon={<LocationIcon />}
                content={
                  <div>
                    <div className="space-y-3 mb-6">
                      <InfoRow label="Latitud" value={selectedAirport.latitude || "N/A"} />
                      <InfoRow label="Longitud" value={selectedAirport.longitude || "N/A"} />
                      {selectedAirport.geoname_id && (
                        <InfoRow label="ID Geoname" value={selectedAirport.geoname_id} />
                      )}
                    </div>
                    {selectedAirport.latitude && selectedAirport.longitude && (
                      <AirportMap
                        lat={parseFloat(selectedAirport.latitude)}
                        lng={parseFloat(selectedAirport.longitude)}
                      />
                    )}
                  </div>
                }
              />
            )}

            {/* Tab: Zona Horaria */}
            {activeTab === "zona-horaria" && (
              <div className="space-y-6">
                <InfoCard
                  theme={theme}
                  title="Zona Horaria"
                  icon={<GlobeIcon />}
                  content={
                    <div className="space-y-3">
                      <InfoRow label="Zona Horaria" value={selectedAirport.timezone || "N/A"} />
                      <InfoRow label="GMT" value={selectedAirport.gmt ? `${selectedAirport.gmt >= 0 ? "+" : ""}${selectedAirport.gmt}` : "N/A"} />
                    </div>
                  }
                />
                <InfoCard
                  theme={theme}
                  title="Hora Local"
                  icon={<ClockIcon />}
                  content={
                    <div>
                      <p className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {getLocalTime()}
                      </p>
                    </div>
                  }
                />
              </div>
            )}

            {/* Tab: Estadísticas */}
            {activeTab === "estadisticas" && (
              <InfoCard
                theme={theme}
                title="Estadísticas"
                icon={<StatsIcon />}
                content={
                  <div className="space-y-3">
                    <InfoRow label="ID Aeropuerto" value={selectedAirport.airport_id || "N/A"} />
                    <InfoRow label="Código IATA" value={selectedAirport.iata_code || "N/A"} />
                    <InfoRow label="Código ICAO" value={selectedAirport.icao_code || "N/A"} />
                    <InfoRow label="País" value={selectedAirport.country_name || "N/A"} />
                    <InfoRow label="Ciudad" value={selectedAirport.city_iata_code || selectedAirport.city_iata || "N/A"} />
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para las tarjetas de información
function InfoCard({
  theme,
  title,
  icon,
  content,
}: {
  theme: "light" | "dark";
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 md:p-8 ${
        theme === "dark"
          ? "bg-gray-800/90 border border-gray-700/50"
          : "bg-white/95 border border-blue-200/30"
      } shadow-xl`}
    >
      {/* Silueta de avión de fondo */}
      <div
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
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

      {/* Título */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div
          className={`${
            theme === "dark"
              ? "text-cyan-400"
              : "text-blue-600"
          }`}
        >
          {icon}
        </div>
        <h2
          className={`text-xl md:text-2xl font-bold ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent"
          }`}
        >
          {title}
        </h2>
      </div>

      {/* Contenido */}
      <div className="relative z-10">{content}</div>
    </div>
  );
}

// Componente para las filas de información
function InfoRow({ label, value }: { label: string; value: string }) {
  const { theme } = useThemeStore();
  return (
    <div>
      <span className={`font-semibold ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        {label}:{" "}
      </span>
      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
        {value}
      </span>
    </div>
  );
}
