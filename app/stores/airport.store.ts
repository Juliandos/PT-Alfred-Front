import { create } from "zustand";
import { listAirports, getAirportById } from "../services/aviationstack.service";

interface AirportStore {
  airports: any[];
  allAirports: any[]; // Cache de todos los aeropuertos
  loading: boolean;
  selectedAirport: any | null;
  searchHistory: string[];
  currentSearch: string;
  currentPage: number;

  fetchAirports: (params: { search?: string; page: number }) => Promise<void>;
  fetchAirportDetails: (id: string) => Promise<void>;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useAirportStore = create<AirportStore>((set, get) => ({
  airports: [],
  allAirports: [],
  loading: false,
  selectedAirport: null,
  currentSearch: "",
  currentPage: 1,

  // Historial de búsqueda (cargado desde localStorage si existe)
  searchHistory:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("searchHistory") || "[]")
      : [],

  // =============================================
  //  Buscar aeropuertos
  // =============================================
  fetchAirports: async ({ search, page }) => {
    set({ loading: true, currentPage: page, currentSearch: search || "" });

    try {
      const response = await listAirports({
        search,
        limit: 9, // 9 aeropuertos por página (3x3 grid)
        offset: (page - 1) * 9,
      });

      const airportsData = response.data || [];

      // ✔ Agregar búsqueda al historial si existe
      if (search && search.trim().length > 0) {
        get().addToHistory(search.trim());
      }

      set({ airports: airportsData });
    } catch (error) {
      console.error("Error fetching airports:", error);
      set({ airports: [] });
    } finally {
      set({ loading: false });
    }
  },

  // =============================================
  //  Detalle de aeropuerto
  // =============================================
  fetchAirportDetails: async (id) => {
    set({ loading: true });
    try {
      const airport = await getAirportById(id);
      console.log("resultado fetchAirportDetails:", airport);
      set({ selectedAirport: airport });
    } catch (error) {
      console.error("Error fetching airport details:", error);
      set({ selectedAirport: null });
    } finally {
      set({ loading: false });
    }
  },

  // =============================================
  //  Agregar búsqueda al historial
  // =============================================
  addToHistory: (query: string) => {
    const { searchHistory } = get();

    // Evitar duplicados
    const updated = [
      query,
      ...searchHistory.filter((item) => item.toLowerCase() !== query.toLowerCase()),
    ];

    // Limitar a 10 búsquedas recientes
    const limited = updated.slice(0, 10);

    // Guardar en Zustand + localStorage
    localStorage.setItem("searchHistory", JSON.stringify(limited));
    set({ searchHistory: limited });
  },

  // =============================================
  //  Limpiar historial
  // =============================================
  clearHistory: () => {
    localStorage.removeItem("searchHistory");
    set({ searchHistory: [] });
  },
}));