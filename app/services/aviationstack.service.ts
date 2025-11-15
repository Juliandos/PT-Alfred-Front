import { apiClient } from "./apiClient";

const API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY;

export const listAirports = async (params: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const { search, limit = 10, offset = 0 } = params;

  const response = await apiClient.get(`/airports`, {
    params: {
      access_key: API_KEY,
      limit,
      offset,
      search,
    },
  });

  return response.data;
};

export const getAirportById = async (id: string) => {
  const response = await apiClient.get(`/airports`, {
    params: {
      access_key: API_KEY,
      iata_code: id,
    },
  });

  return response.data;
};
