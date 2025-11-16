import { apiClient } from "./apiClient";

const API_KEY = "7933e6bf8c8f0c1a231b883081c820e7";

/**
 * 🛫 Obtener lista de aeropuertos desde la API real
 * NOTA: El plan gratuito NO soporta el parámetro 'search'
 * Por lo tanto, obtenemos todos los aeropuertos y filtramos del lado del cliente
 * 
 * @param params - Parámetros de búsqueda y paginación
 * @returns Lista de aeropuertos con paginación
 */
export const listAirports = async (params: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const { search, limit = 10, offset = 0 } = params;

  try {
    console.log('📡 Llamando a la API con:', { limit, offset });

    // ⚠️ IMPORTANTE: El plan gratuito NO soporta el parámetro 'search'
    // Solo enviamos limit y offset
    const response = await apiClient.get(`/airports`, {
      params: {
        access_key: API_KEY,
        limit: 100, // Obtenemos más registros para poder filtrar
        offset: 0,   // Siempre desde el inicio para el plan gratuito
      },
    });

    console.log('✅ Respuesta de la API:', response.data);

    let filteredData = response.data.data || [];

    // 🔍 Filtrar del lado del cliente si hay un término de búsqueda
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((airport: any) => {
        return (
          airport.airport_name?.toLowerCase().includes(searchLower) ||
          airport.iata_code?.toLowerCase().includes(searchLower) ||
          airport.icao_code?.toLowerCase().includes(searchLower) ||
          airport.country_name?.toLowerCase().includes(searchLower) ||
          airport.city_iata_code?.toLowerCase().includes(searchLower)
        );
      });
      console.log(`🔍 Filtrado: ${filteredData.length} resultados para "${search}"`);
    }

    // Aplicar paginación del lado del cliente
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
      pagination: {
        offset,
        limit,
        count: paginatedData.length,
        total: filteredData.length,
      },
      data: paginatedData,
    };
  } catch (error: any) {
    console.error('❌ Error en API:', error);
    console.error('Detalles:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // En caso de error, devolver estructura vacía
    return {
      pagination: { offset: 0, limit: 10, count: 0, total: 0 },
      data: [],
    };
  }
};

/**
 * 🔍 Obtener detalles de un aeropuerto específico por su código IATA
 * @param id - Código IATA del aeropuerto (ej: "JFK", "MAD")
 * @returns Datos del aeropuerto o null si no se encuentra
 */
export const getAirportById = async (id: string) => {
  try {
    console.log('📡 Buscando aeropuerto con código:', id);

    const response = await apiClient.get(`/airports`, {
      params: {
        access_key: API_KEY,
        iata_code: id,
      },
    });

    console.log('✅ Respuesta getAirportById:', response.data);

    // La API retorna un array, tomamos el primer elemento
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }

    console.warn('⚠️ No se encontró aeropuerto con código:', id);
    return null;
  } catch (error: any) {
    console.error('❌ Error en getAirportById:', error);
    console.error('Detalles:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return null;
  }
};