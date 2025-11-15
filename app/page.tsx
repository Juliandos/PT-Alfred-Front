"use client";

import { useState } from "react";
import AirportTable from "./components/AirportTable";
import { useAirportStore } from "./stores/airport.store";
import { useThemeStore } from "./stores/theme.store";

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const { airports, loading, fetchAirports, searchHistory, clearHistory } =
    useAirportStore();
  const { theme } = useThemeStore();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchAirports({ search: searchQuery, page: 1 });
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  if (showResults) {
    return (
      <div className="min-h-screen p-6 bg-white dark:bg-gray-900">
        <button
          onClick={() => setShowResults(false)}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
        >
          ⬅ Volver al inicio
        </button>

        <div className="w-full max-w-lg mx-auto mb-6">
          <input
            type="text"
            placeholder="Buscar aeropuertos..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <AirportTable data={airports} loading={loading} />
      </div>
    );
  }

  // ===================== LANDING =====================
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4">

      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: theme === "light" 
            ? "url(/airport-bg-light.jpg)" 
            : "url(/airport-bg.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: theme === "light" ? "brightness(1.1) contrast(1.05)" : "brightness(0.6) contrast(1.1)",
        }}
      />
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          theme === "dark" 
            ? "bg-[#000B1A] opacity-70" 
            : "bg-gradient-to-br from-blue-50/50 via-cyan-50/40 to-white/50 opacity-50"
        }`}
      />

      <div className="relative z-10 w-full max-w-[1000px] flex flex-col items-center gap-8 md:gap-12">

        <h1
          className={`font-montserrat-black text-4xl sm:text-5xl md:text-7xl lg:text-[88.91px] text-center leading-none tracking-tight transition-all duration-500 ${
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
          SkyConnect Explorer
        </h1>

        {/* INPUT + BOTÓN + HISTORIAL */}
        <div className="w-full max-w-[780px] px-4 relative flex flex-col items-center gap-4">

          {/* INPUT */}
          <input
            type="text"
            placeholder="Buscar aeropuertos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 150)}
            className={`w-full h-[58px] px-6 rounded-full text-base md:text-lg outline-none transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/95 text-gray-900 placeholder:text-cyan-500/70 border-2 border-transparent shadow-[0_8px_32px_rgba(0,249,255,0.2)] focus:shadow-[0_8px_32px_rgba(0,249,255,0.4)] focus:border-cyan-300/50"
                : "bg-white/98 text-gray-800 placeholder:text-blue-500/70 border-2 border-transparent shadow-[0_8px_32px_rgba(0,106,255,0.25)] focus:shadow-[0_8px_32px_rgba(0,106,255,0.4)] focus:border-blue-300/50"
            }`}
          />

          {/* BOTÓN DE BUSCAR */}
          <button
            onClick={handleSearch}
            className={`group relative px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 border-2 border-cyan-300/50 text-white shadow-[0_8px_32px_rgba(0,249,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,249,255,0.6)] hover:border-cyan-200/70"
                : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 border-2 border-blue-400/60 text-white shadow-[0_8px_32px_rgba(0,106,255,0.5)] hover:shadow-[0_12px_40px_rgba(0,106,255,0.7)] hover:border-blue-300/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <SearchIcon size={20} />
              <span>Buscar</span>
            </div>
          </button>

          {/* HISTORIAL */}
          {inputFocused && searchHistory.length > 0 && (
            <div className={`w-full backdrop-blur-md rounded-xl p-4 shadow-md border animate-fadeIn transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/10 border-white/10"
                : "bg-white/90 border-blue-200/30 shadow-lg"
            }`}>

              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-600"
                }`}>Búsquedas recientes</h3>
                <button
                  onClick={clearHistory}
                  className={`text-sm transition ${
                    theme === "dark" 
                      ? "text-red-300 hover:text-red-400" 
                      : "text-red-500 hover:text-red-600"
                  }`}
                >
                  Limpiar
                </button>
              </div>

              <ul
                className="space-y-2 overflow-y-auto"
                style={{
                  maxHeight: "200px", // Scroll si hay más de 5
                  paddingRight: "4px",
                }}
              >
                {searchHistory.map((item, index) => (
                  <li
                    key={index}
                    onMouseDown={() => {
                      setSearchQuery(item);
                      fetchAirports({ search: item, page: 1 });
                      setShowResults(true);
                    }}
                    className={`cursor-pointer px-3 py-2 rounded-md transition-all ${
                      theme === "dark"
                        ? "bg-white/5 hover:bg-white/20 text-white"
                        : "bg-blue-50/80 hover:bg-blue-100/90 text-gray-800 border border-blue-100/50"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}
