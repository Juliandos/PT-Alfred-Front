"use client";

import { useState, useEffect } from "react";
import { useAirportStore } from "../stores/airport.store";

export default function AirportSearch() {
  const [query, setQuery] = useState("");
  const fetchAirports = useAirportStore((state) => state.fetchAirports);

  // debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAirports({ search: query, page: 1 });
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, fetchAirports]);

  return (
    <div className="w-full flex justify-center">
      <input
        type="text"
        placeholder="Buscar aeropuertos..."
        className="w-full max-w-lg px-4 py-2 rounded-md border border-gray-300 shadow-sm text-gray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
