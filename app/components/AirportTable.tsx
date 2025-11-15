"use client";

import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

interface Props {
  data: any[];
  loading: boolean;
}

export default function AirportTable({ data, loading }: Props) {
  const router = useRouter();

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  // Validación: asegurarse de que data es un array
  if (!Array.isArray(data)) {
    console.error('Error: data no es un array', data);
    return <div className="text-center py-10 text-red-500">Error: Formato de datos incorrecto</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-10">No hay resultados</div>;
  }

  return (
    <div className="mt-6">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Aeropuerto</th>
            <th className="p-3 text-left">Ciudad</th>
            <th className="p-3 text-left">País</th>
            <th className="p-3 text-left">Código IATA</th>
          </tr>
        </thead>

        <tbody>
          {data.map((airport: any, index: number) => (
            <tr
              key={airport.iata_code || index}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/airport/${airport.iata_code}`)}
            >
              <td className="p-3">{airport.airport_name}</td>
              <td className="p-3">{airport.city_iata_code}</td>
              <td className="p-3">{airport.country_name || 'N/A'}</td>
              <td className="p-3 font-bold">{airport.iata_code}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination />
    </div>
  );
}