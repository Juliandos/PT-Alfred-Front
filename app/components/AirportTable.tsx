"use client";

import { useThemeStore } from "../stores/theme.store";
import Pagination from "./Pagination";
import AirportCard from "./AirportCard";

interface Props {
  data: any[];
  loading: boolean;
}

export default function AirportTable({ data, loading }: Props) {
  const { theme } = useThemeStore();

  if (loading) {
    return (
      <div className={`text-center py-20 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4">Cargando...</p>
      </div>
    );
  }

  // Validación: asegurarse de que data es un array
  if (!Array.isArray(data)) {
    console.error('Error: data no es un array', data);
    return (
      <div className={`text-center py-10 ${
        theme === "dark" ? "text-red-400" : "text-red-500"
      }`}>
        Error: Formato de datos incorrecto
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-20 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        No hay resultados
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* CAMBIO: grid-cols-2 en lugar de grid-cols-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((airport: any, index: number) => (
          <AirportCard key={airport.iata_code || index} airport={airport} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}