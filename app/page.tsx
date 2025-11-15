"use client";

import AirportSearch from "./components/AirportSearch";
import AirportTable from "./components/AirportTable";
import { useAirportStore } from "./stores/airport.store";


export default function Home() {
  const { airports, loading } = useAirportStore();

  return (
    <main className="p-6 space-y-6">
      <AirportSearch />
      <AirportTable data={airports} loading={loading} />
    </main>
  );
}
