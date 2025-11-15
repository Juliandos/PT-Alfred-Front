"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAirportStore } from "../../stores/airport.store";
import AirportMap from "../../components/AirportMap";

export default function AirportDetails() {
  const params = useParams();
  const router = useRouter();
  const { selectedAirport, loading, fetchAirportDetails } = useAirportStore();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchAirportDetails(id);
    }
  }, [id, fetchAirportDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!selectedAirport) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl">Aeropuerto no encontrado</div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        ← Volver
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{selectedAirport.airport_name}</h1>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Código IATA</p>
              <p className="text-2xl font-bold">{selectedAirport.iata_code}</p>
            </div>
            <div>
              <p className="text-gray-600">Código ICAO</p>
              <p className="text-2xl font-bold">{selectedAirport.icao_code}</p>
            </div>
            <div>
              <p className="text-gray-600">Ciudad</p>
              <p className="text-xl">{selectedAirport.city_iata_code}</p>
            </div>
            <div>
              <p className="text-gray-600">País</p>
              <p className="text-xl">{selectedAirport.country_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600">Zona Horaria</p>
              <p className="text-xl">{selectedAirport.timezone}</p>
            </div>
            <div>
              <p className="text-gray-600">GMT</p>
              <p className="text-xl">{selectedAirport.gmt}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
          <div className="mb-4">
            <p className="text-gray-600">
              Latitud: <span className="font-semibold">{selectedAirport.latitude}</span>
            </p>
            <p className="text-gray-600">
              Longitud: <span className="font-semibold">{selectedAirport.longitude}</span>
            </p>
          </div>
          <AirportMap
            lat={parseFloat(selectedAirport.latitude)}
            lng={parseFloat(selectedAirport.longitude)}
          />
        </div>
      </div>
    </div>
  );
}