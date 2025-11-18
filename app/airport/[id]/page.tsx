"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAirportStore } from "../../stores/airport.store";
import { useThemeStore } from "../../stores/theme.store";
import AirportMap from "../../components/AirportMap";
import Image from "next/image";

type Tab = "general" | "ubicacion" | "zona-horaria" | "estadisticas";

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "ubicacion", label: "Ubicación" },
    { id: "zona-horaria", label: "Zona Horaria" },
    { id: "estadisticas", label: "Estadísticas" },
  ];

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${
      theme === "dark" ? "bg-[#0A1628]" : "bg-gray-50"
    }`}>
      {/* Fondo más oscuro */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: theme === "light" 
            ? "url(/airport-bg-light.jpg)" 
            : "url(/airport-bg.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: theme === "light" ? "brightness(0.7) contrast(1.15)" : "brightness(0.25) contrast(1.3)",
        }}
      />
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          theme === "dark" 
            ? "bg-[#0A1628] opacity-90" 
            : "bg-gradient-to-br from-blue-950/80 via-slate-950/70 to-black/80 opacity-75"
        }`}
      />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con título */}
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
              className={`font-montserrat-black text-4xl md:text-5xl mb-8 text-center ${
                theme === "dark" ? "gradient-text" : ""
              }`}
              style={
                theme === "light"
                  ? {
                      background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 20%, #2563eb 40%, #1d4ed8 60%, #1e40af 80%, #1e3a8a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "contrast(1.2) brightness(1.2)",
                    }
                  : {
                      textShadow: "0 0 40px rgba(0, 249, 255, 0.3)",
                    }
              }
            >
              {selectedAirport.iata_code || selectedAirport.airport_name}
            </h1>

            {/* Tabs */}
            <div className="w-full max-w-4xl mx-auto mb-8">
              <div
                className={`flex w-full rounded-xl overflow-hidden ${
                  theme === "dark" ? "bg-gray-700/40" : "bg-gray-300/40"
                }`}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-center font-semibold text-sm transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700/60"
                          : "text-gray-700 hover:bg-gray-400/50"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="space-y-6 ">
            {/* Tab: General */}
            {activeTab === "general" && (
              <InfoCard
                theme={theme}
                title="Información General"
                iconPath="/Info Circle.png"
                airplaneImage="/avionCard.jpg"
                content={
                  <div className="space-y-2">
                    <InfoRow label="Código IATA" value={selectedAirport.iata_code || "N/A"} theme={theme} />
                    <InfoRow label="Código ICAO" value={selectedAirport.icao_code || "N/A"} theme={theme} />
                    <InfoRow label="País" value={`${selectedAirport.country_name || "N/A"} (${selectedAirport.country_iso2 || "N/A"})`} theme={theme} />
                    <InfoRow label="Ciudad IATA" value={selectedAirport.city_iata_code || selectedAirport.city_iata || "N/A"} theme={theme} />
                    <InfoRow label="Teléfono" value={selectedAirport.phone_number || "No disponible"} theme={theme} />
                  </div>
                }
              />
            )}

            {/* Tab: Ubicación */}
            {activeTab === "ubicacion" && (
              <div className="space-y-6">
                <InfoCard
                  theme={theme}
                  title="Ubicación"
                  iconPath="/Map Point.png"
                  airplaneImage="/avionCard.jpg"
                  content={
                    <div className="space-y-2">
                      <InfoRow label="Latitud" value={selectedAirport.latitude || "N/A"} theme={theme} />
                      <InfoRow label="Longitud" value={selectedAirport.longitude || "N/A"} theme={theme} />
                      {selectedAirport.geoname_id && (
                        <InfoRow label="ID Geoname" value={selectedAirport.geoname_id} theme={theme} />
                      )}
                    </div>
                  }
                />
                {selectedAirport.latitude && selectedAirport.longitude && (
                  <AirportMap
                    lat={parseFloat(selectedAirport.latitude)}
                    lng={parseFloat(selectedAirport.longitude)}
                  />
                )}
              </div>
            )}

            {/* Tab: Zona Horaria */}
            {activeTab === "zona-horaria" && (
              <div className="space-y-6">
                <InfoCard
                  theme={theme}
                  title="Zona Horaria"
                  iconPath="/Global.png"
                  airplaneImage="/avionCard.jpg"
                  content={
                    <div className="space-y-2">
                      <InfoRow label="Zona Horaria" value={selectedAirport.timezone || "N/A"} theme={theme} />
                      <InfoRow label="GMT" value={selectedAirport.gmt ? `${selectedAirport.gmt >= 0 ? "+" : ""}${selectedAirport.gmt}` : "N/A"} theme={theme} />
                    </div>
                  }
                />
                <InfoCard
                  theme={theme}
                  title="Hora Local"
                  iconPath="/Global.png"
                  airplaneImage="/avionCard.jpg"
                  content={
                    <div>
                      <p className={`text-lg font-semibold ${
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
                iconPath="/Info Circle.png"
                airplaneImage="/avionCard.jpg"
                content={
                  <div className="space-y-2">
                    <InfoRow label="ID Aeropuerto" value={selectedAirport.airport_id || "N/A"} theme={theme} />
                    <InfoRow label="Código IATA" value={selectedAirport.iata_code || "N/A"} theme={theme} />
                    <InfoRow label="Código ICAO" value={selectedAirport.icao_code || "N/A"} theme={theme} />
                    <InfoRow label="País" value={selectedAirport.country_name || "N/A"} theme={theme} />
                    <InfoRow label="Ciudad" value={selectedAirport.city_iata_code || selectedAirport.city_iata || "N/A"} theme={theme} />
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
  iconPath,
  airplaneImage,
  content,
}: {
  theme: "light" | "dark";
  title: string;
  iconPath: string;
  airplaneImage: string;
  content: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/60"
      style={{
        background: theme === "dark"
          ? "rgba(30, 41, 59, 0.7)"
          : "rgba(241, 245, 249, 0.9)",
        backdropFilter: "blur(10px)",
        minHeight: "120px",
      }}
    >
      {/* División horizontal al 70% - lado izquierdo (contenido) */}
      <div
        className="absolute inset-0 w-[70%]"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 80%)"
              : "linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 55%, rgba(255,255,255,0) 80%)",
          backgroundColor:
            theme === "dark"
              ? "rgba(30, 41, 59, 0.5)"
              : "rgba(241, 245, 249, 0.5)",
          backgroundBlendMode: "overlay",
        }}
      />

      {/* División horizontal al 70% - lado derecho (imagen) */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-[30%]"
        style={{
          backgroundImage: `url(${airplaneImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />

      {/* Contenido - lado izquierdo */}
      <div className="relative z-10 p-5" style={{ width: "70%" }}>
        {/* Título con icono */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 relative">
            <Image
              src={iconPath}
              alt={title}
              width={32}
              height={32}
              style={{
                filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0) invert(0.4)",
              }}
            />
          </div>
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            {title}
          </h2>
        </div>

        {/* Contenido */}
        <div>{content}</div>
      </div>
    </div>
  );
}

// Componente para las filas de información
function InfoRow({ label, value, theme }: { label: string; value: string; theme: "light" | "dark" }) {
  return (
    <div className="flex ">
      <span className={`font-semibold min-w-[120px] ${
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