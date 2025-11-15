import { apiClient } from "./apiClient";

const API_KEY = "7933e6bf8c8f0c1a231b883081c820e7";

export const listAirports = async (params: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const { search, limit = 10, offset = 0 } = params;

  // OPCIÓN 1: Si quieres usar la API real, descomenta esto:
  /*
  try {
    const response = await apiClient.get(`/airports`, {
      params: {
        access_key: API_KEY,
        limit,
        offset,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en API:', error);
    // En caso de error, devolver estructura vacía
    return { data: [], pagination: { offset: 0, limit: 10, count: 0, total: 0 } };
  }
  */

  // OPCIÓN 2: Datos mock (actual)
  const mockData = [
    {
      id: "5524551",
      gmt: "-10",
      airport_id: "1",
      iata_code: "AAA",
      city_iata_code: "AAA",
      icao_code: "NTGA",
      country_iso2: "PF",
      geoname_id: "6947726",
      latitude: "-17.05",
      longitude: "-145.41667",
      airport_name: "Anaa",
      country_name: "French Polynesia",
      phone_number: null,
      timezone: "Pacific/Tahiti",
    },
    {
      id: "5524552",
      gmt: "10",
      airport_id: "2",
      iata_code: "AAB",
      city_iata_code: "AAB",
      icao_code: "YARY",
      country_iso2: "AU",
      geoname_id: "7730796",
      latitude: "-26.7",
      longitude: "141.04167",
      airport_name: "Arrabury",
      country_name: "Australia",
      phone_number: null,
      timezone: "Australia/Brisbane",
    },
    {
      id: "5524553",
      gmt: "2",
      airport_id: "3",
      iata_code: "AAC",
      city_iata_code: "AAC",
      icao_code: "HEAR",
      country_iso2: "EG",
      geoname_id: "6297289",
      latitude: "31.133333",
      longitude: "33.75",
      airport_name: "El Arish International Airport",
      country_name: "Egypt",
      phone_number: null,
      timezone: "Africa/Cairo",
    },
    {
      id: "5524554",
      gmt: "1",
      airport_id: "4",
      iata_code: "AAE",
      city_iata_code: "AAE",
      icao_code: "DABB",
      country_iso2: "DZ",
      geoname_id: "2570559",
      latitude: "36.821392",
      longitude: "7.811857",
      airport_name: "Les Salines",
      country_name: "Algeria",
      phone_number: null,
      timezone: "Africa/Algiers",
    },
    {
      id: "5524555",
      gmt: "-5",
      airport_id: "5",
      iata_code: "AAF",
      city_iata_code: "AAF",
      icao_code: "KAAF",
      country_iso2: "US",
      geoname_id: "4146153",
      latitude: "29.733334",
      longitude: "-84.98333",
      airport_name: "Apalachicola Regional",
      country_name: "United States",
      phone_number: null,
      timezone: "America/New_York",
    },
    {
      id: "5524556",
      gmt: "-3",
      airport_id: "6",
      iata_code: "AAG",
      city_iata_code: "AAG",
      icao_code: "SSYA",
      country_iso2: "BR",
      geoname_id: "3471795",
      latitude: "-24.103611",
      longitude: "-49.79",
      airport_name: "Arapoti",
      country_name: "Brazil",
      phone_number: null,
      timezone: "America/Sao_Paulo",
    },
    {
      id: "5524557",
      gmt: "1",
      airport_id: "7",
      iata_code: "AAH",
      city_iata_code: "AAH",
      icao_code: "EDKA",
      country_iso2: "DE",
      geoname_id: "3207669",
      latitude: "50.75",
      longitude: "6.133333",
      airport_name: "Aachen/Merzbruck",
      country_name: "Germany",
      phone_number: null,
      timezone: "Europe/Berlin",
    },
    {
      id: "5524558",
      gmt: "-3",
      airport_id: "8",
      iata_code: "AAI",
      city_iata_code: "AAI",
      icao_code: "SWRA",
      country_iso2: "BR",
      geoname_id: "7668483",
      latitude: "-12.916667",
      longitude: "-46.933334",
      airport_name: "Arraias",
      country_name: "Brazil",
      phone_number: null,
      timezone: "America/Araguaina",
    },
    {
      id: "5524560",
      gmt: "12",
      airport_id: "10",
      iata_code: "AAK",
      city_iata_code: "AAK",
      icao_code: "NGUK",
      country_iso2: "KI",
      geoname_id: "7521791",
      latitude: "0.166667",
      longitude: "173.58333",
      airport_name: "Aranuka",
      country_name: "Kiribati",
      phone_number: null,
      timezone: "Pacific/Tarawa",
    },
    {
      id: "5524561",
      gmt: "1",
      airport_id: "11",
      iata_code: "AAL",
      city_iata_code: "AAL",
      icao_code: "EKYT",
      country_iso2: "DK",
      geoname_id: "2624887",
      latitude: "57.08655",
      longitude: "9.872241",
      airport_name: "Aalborg",
      country_name: "Denmark",
      phone_number: null,
      timezone: "Europe/Copenhagen",
    },
  ];

  // Filtrar por búsqueda si existe
  let filteredData = mockData;
  if (search) {
    filteredData = mockData.filter((airport) =>
      airport.airport_name.toLowerCase().includes(search.toLowerCase()) ||
      airport.iata_code.toLowerCase().includes(search.toLowerCase()) ||
      airport.city_iata_code.toLowerCase().includes(search.toLowerCase()) ||
      airport.country_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Aplicar paginación
  const paginatedData = filteredData.slice(offset, offset + limit);

  // Devolver en el formato esperado por el store
  return {
    pagination: {
      offset,
      limit,
      count: paginatedData.length,
      total: filteredData.length,
    },
    data: paginatedData, // Esto es lo importante: debe ser un array
  };
};

// Obtener detalles de un aeropuerto por su IATA code
export const getAirportById = async (id: string) => {
  // OPCIÓN 1: API real (descomenta para usar)
  /*
  try {
    const response = await apiClient.get(`/airports`, {
      params: {
        access_key: API_KEY,
        iata_code: id,
      },
    });
    return response.data.data[0];
  } catch (error) {
    console.error('Error en API:', error);
    return null;
  }
  */

  // OPCIÓN 2: Mock (actual)
  const mockData = await listAirports({ limit: 100, offset: 0 });
  return mockData.data.find((airport) => airport.iata_code === id);
};