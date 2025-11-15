"use client";

import { useState } from "react";
import AirportTable from "./components/AirportTable";
import { useAirportStore } from "./stores/airport.store";

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
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/airport-bg.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "#000B1A", opacity: 0.7 }} />

      <div className="relative z-10 w-full max-w-[1000px] flex flex-col items-center gap-8 md:gap-12">

        <h1
          className="gradient-text font-montserrat-black text-4xl sm:text-5xl md:text-7xl lg:text-[88.91px] text-center leading-none tracking-tight"
          style={{ textShadow: "0 0 40px rgba(0, 249, 255, 0.3)" }}
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
            className="w-full h-[58px] px-6 rounded-full text-base md:text-lg outline-none transition-all duration-300"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid transparent",
              color: "#1a1a1a",
              boxShadow: "0 8px 32px rgba(0, 249, 255, 0.2)",
            }}
          />

          {/* BOTÓN DE BUSCAR */}
          <button
            onClick={handleSearch}
            className="group relative px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(90deg, #006AFF 0%, #00F9FF 100%)",
              border: "2px solid white",
              boxShadow: "0 8px 32px rgba(0, 106, 255, 0.4)",
            }}
          >
            <div className="flex items-center gap-3">
              <SearchIcon size={20} />
              <span>Buscar</span>
            </div>
          </button>

          {/* HISTORIAL */}
          {inputFocused && searchHistory.length > 0 && (
            <div className="w-full bg-white/10 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/10 dark:border-gray-700/50 animate-fadeIn">

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-cyan-300 dark:text-cyan-400 font-semibold">Búsquedas recientes</h3>
                <button
                  onClick={clearHistory}
                  className="text-red-300 dark:text-red-400 text-sm hover:text-red-400 dark:hover:text-red-500 transition"
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
                    className="cursor-pointer px-3 py-2 rounded-md bg-white/5 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-all text-white dark:text-gray-200"
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
