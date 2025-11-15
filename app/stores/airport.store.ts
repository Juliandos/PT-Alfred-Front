import { create } from "zustand";
import { listAirports, getAirportById } from "../services/aviationstack.service";

interface AirportStore {
  airports: any[];
  loading: boolean;
  selectedAirport: any | null;

  fetchAirports: (params: { search?: string; page: number }) => Promise<void>;
  fetchAirportDetails: (id: string) => Promise<void>;
}

export const useAirportStore = create<AirportStore>((set) => ({
  airports: [],
  loading: false,
  selectedAirport: null,

  fetchAirports: async ({ search, page }) => {
    set({ loading: true });

    try {
      const response = await listAirports({
        search,
        limit: 10,
        offset: (page - 1) * 10,
      });

      // La API devuelve { data: [...], pagination: {...} }
      // Extraemos solo el array de aeropuertos
      const airportsData = response.data || [];
      
      set({ airports: airportsData });
    } catch (error) {
      console.error('Error fetching airports:', error);
      set({ airports: [] }); // En caso de error, array vacío
    } finally {
      set({ loading: false });
    }
  },

  fetchAirportDetails: async (id) => {
    set({ loading: true });
    try {
      const airport = await getAirportById(id);
      console.log('resultado fetchAirportDetails:', airport);
      set({ selectedAirport: airport });
    } catch (error) {
      console.error('Error fetching airport details:', error);
      set({ selectedAirport: null });
    } finally {
      set({ loading: false });
    }
  },
}));