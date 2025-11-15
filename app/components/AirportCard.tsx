interface Props {
  airport: any;
}

export default function AirportCard({ airport }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-2">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{airport.airport_name}</h2>
      <p className="text-gray-700 dark:text-gray-300"><strong>IATA:</strong> {airport.iata_code}</p>
      <p className="text-gray-700 dark:text-gray-300"><strong>ICAO:</strong> {airport.icao_code}</p>
      <p className="text-gray-700 dark:text-gray-300"><strong>Ciudad:</strong> {airport.city_iata}</p>
      <p className="text-gray-700 dark:text-gray-300"><strong>País:</strong> {airport.country_name}</p>
      <p className="text-gray-700 dark:text-gray-300"><strong>Zona Horaria:</strong> {airport.timezone}</p>
    </div>
  );
}
