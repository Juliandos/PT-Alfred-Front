"use client";

import { useAirportStore } from "../stores/airport.store";
import { useState } from "react";

export default function Pagination() {
  const fetchAirports = useAirportStore((state) => state.fetchAirports);
  const [page, setPage] = useState(1);

  const handlePage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    fetchAirports({ page: newPage });
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        onClick={() => handlePage(page - 1)}
      >
        Anterior
      </button>

      <span className="font-semibold">{page}</span>

      <button
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        onClick={() => handlePage(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
