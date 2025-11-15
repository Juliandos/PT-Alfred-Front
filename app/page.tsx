"use client";

import { useState } from "react";
// Componente de ícono de lupa personalizado
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
import AirportTable from "./components/AirportTable";
import { useAirportStore } from "./stores/airport.store";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { airports, loading, fetchAirports } = useAirportStore();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchAirports({ search: searchQuery, page: 1 });
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Si estamos mostrando resultados, usar el layout anterior
  if (showResults) {
    return (
      <div className="min-h-screen p-6">
        <button
          onClick={() => setShowResults(false)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          ← Volver al inicio
        </button>
        
        <div className="w-full max-w-lg mx-auto mb-6">
          <input
            type="text"
            placeholder="Buscar aeropuertos..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <AirportTable data={airports} loading={loading} />
      </div>
    );
  }

  // Landing page
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Imagen de fondo con overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/airport-bg.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Overlay azul con opacidad */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#006AFF',
          opacity: 0.2
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-[1000px] flex flex-col items-center gap-8 md:gap-12">
        
        {/* Título con gradiente */}
        <h1 
          className="gradient-text font-montserrat-black text-4xl sm:text-5xl md:text-7xl lg:text-[88.91px] text-center leading-none tracking-tight"
          style={{
            textShadow: '0 0 40px rgba(0, 249, 255, 0.3)'
          }}
        >
          SkyConnect Explorer
        </h1>

        {/* Input de búsqueda */}
        <div className="w-full max-w-[780px] px-4">
          <input
            type="text"
            placeholder="Buscar aeropuertos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-[58px] px-6 rounded-full text-base md:text-lg outline-none transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid transparent',
              color: '#1a1a1a',
              boxShadow: '0 8px 32px rgba(0, 249, 255, 0.2)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '2px solid #00F9FF';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 249, 255, 0.4)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 249, 255, 0.2)';
            }}
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          className="group relative px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(90deg, #006AFF 0%, #00F9FF 100%)',
            border: '2px solid white',
            boxShadow: '0 8px 32px rgba(0, 106, 255, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 249, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 106, 255, 0.4)';
          }}
        >
          <div className="flex items-center gap-3">
            <SearchIcon size={20} />
            <span>Buscar</span>
          </div>
        </button>

      </div>

      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 249, 255, 0.2) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        input::placeholder {
          color: #00F9FF;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}