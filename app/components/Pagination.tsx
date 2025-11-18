"use client";

import { useAirportStore } from "../stores/airport.store";
import { useThemeStore } from "../stores/theme.store";

export default function Pagination() {
  const { fetchAirports, currentPage, currentSearch, airports } = useAirportStore();
  const { theme } = useThemeStore();

  const itemsPerPage = 9;
  const hasNextPage = airports.length === itemsPerPage;
  const hasPrevPage = currentPage > 1;

  const handlePage = (newPage: number) => {
    if (newPage < 1) return;
    fetchAirports({ search: currentSearch, page: newPage });
  };

  // Si solo hay una página, no renderizar nada
  if (!hasPrevPage && !hasNextPage) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {/* Botón Anterior */}
      <button
        className="px-4 py-2 rounded-md bg-[#006AFF] text-white hover:bg-[#0052CC] transition-colors"
        onClick={() => handlePage(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        Anterior
      </button>

      {/* Número de página */}
      <span className="px-4 py-2 rounded-md bg-[#006AFF] text-white hover:bg-[#0052CC] transition-colors">
        {currentPage}
      </span>

      {/* Botón Siguiente */}
      <button
        className="px-4 py-2 rounded-md bg-[#006AFF] text-white hover:bg-[#0052CC] transition-colors"
        onClick={() => handlePage(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Siguiente
      </button>
    </div>
  );
}