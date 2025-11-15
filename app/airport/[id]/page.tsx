import { useAirportStore } from "../../stores/airport.store";
import AirportMap from "../../components/AirportMap";

export default async function AirportDetails({ params }: any) {
  const { id } = params;
  const store = useAirportStore.getState();

  await store.fetchAirportDetails(id);
  const airport = store.selectedAirport;

  if (!airport) return <div>No encontrado</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{airport.airport_name}</h1>
      <AirportMap lat={airport.latitude} lng={airport.longitude} />
    </div>
  );
}
