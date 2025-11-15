interface Props {
  airport: any;
}

export default function AirportCard({ airport }: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-2">
      <h2 className="text-2xl font-bold">{airport.airport_name}</h2>
      <p><strong>IATA:</strong> {airport.iata_code}</p>
      <p><strong>ICAO:</strong> {airport.icao_code}</p>
      <p><strong>Ciudad:</strong> {airport.city_iata}</p>
      <p><strong>País:</strong> {airport.country_name}</p>
      <p><strong>Zona Horaria:</strong> {airport.timezone}</p>
    </div>
  );
}
