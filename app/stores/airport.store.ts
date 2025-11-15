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
      const data = await listAirports({
        search,
        limit: 10,
        offset: (page - 1) * 10,
      });

      set({ airports: data.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchAirportDetails: async (id) => {
    set({ loading: true });
    try {
      const data = await getAirportById(id);
      console.log('resultado fetchAirportDetails:', data);
      set({ selectedAirport: data });
    } finally {
      set({ loading: false });
    }
  },
}));
