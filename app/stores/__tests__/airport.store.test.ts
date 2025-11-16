import { renderHook, act, waitFor } from '@testing-library/react';
import { useAirportStore } from '../airport.store';
import * as aviationstackService from '../../services/aviationstack.service';

jest.mock('../../services/aviationstack.service');

const mockAirportData = {
  pagination: {
    offset: 0,
    limit: 9,
    count: 9,
    total: 100,
  },
  data: [
    {
      airport_id: '1',
      airport_name: 'JFK International Airport',
      iata_code: 'JFK',
      icao_code: 'KJFK',
      country_name: 'United States',
      city_iata_code: 'NYC',
    },
    {
      airport_id: '2',
      airport_name: 'Heathrow Airport',
      iata_code: 'LHR',
      icao_code: 'EGLL',
      country_name: 'United Kingdom',
      city_iata_code: 'LON',
    },
  ],
};

const mockAirportDetails = {
  airport_id: '1',
  airport_name: 'JFK International Airport',
  iata_code: 'JFK',
  icao_code: 'KJFK',
  country_name: 'United States',
  city_iata_code: 'NYC',
  latitude: '40.6413',
  longitude: '-73.7781',
  timezone: 'America/New_York',
};

describe('Airport Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAirportStore());

      expect(result.current.airports).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.selectedAirport).toBe(null);
      expect(result.current.searchHistory).toEqual([]);
    });

    it('should load search history from localStorage', () => {
      const mockHistory = ['JFK', 'LAX', 'LHR'];
      localStorage.setItem('searchHistory', JSON.stringify(mockHistory));

      const { result } = renderHook(() => useAirportStore());

      expect(result.current.searchHistory).toEqual(mockHistory);
    });
  });

  describe('fetchAirports', () => {
    it('should fetch airports successfully', async () => {
      (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockAirportData);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirports({ page: 1 });
      });

      await waitFor(() => {
        expect(result.current.airports).toEqual(mockAirportData.data);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading to true while fetching', async () => {
      (aviationstackService.listAirports as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockAirportData), 100))
      );

      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.fetchAirports({ page: 1 });
      });

      expect(result.current.loading).toBe(true);
    });

    it('should add search term to history', async () => {
      (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockAirportData);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirports({ search: 'JFK', page: 1 });
      });

      await waitFor(() => {
        expect(result.current.searchHistory).toContain('JFK');
      });
    });

    it('should not add empty search to history', async () => {
      (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockAirportData);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirports({ search: '', page: 1 });
      });

      await waitFor(() => {
        expect(result.current.searchHistory).toEqual([]);
      });
    });

    it('should handle API errors gracefully', async () => {
      (aviationstackService.listAirports as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirports({ page: 1 });
      });

      await waitFor(() => {
        expect(result.current.airports).toEqual([]);
        expect(result.current.loading).toBe(false);
      });

      consoleSpy.mockRestore();
    });

    it('should pass correct pagination parameters', async () => {
      (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockAirportData);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirports({ page: 3 });
      });

      expect(aviationstackService.listAirports).toHaveBeenCalledWith({
        search: undefined,
        limit: 9,
        offset: 18, // (page 3 - 1) * 9
      });
    });
  });

  describe('fetchAirportDetails', () => {
    it('should fetch airport details successfully', async () => {
      (aviationstackService.getAirportById as jest.Mock).mockResolvedValue(mockAirportDetails);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirportDetails('JFK');
      });

      await waitFor(() => {
        expect(result.current.selectedAirport).toEqual(mockAirportDetails);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading state while fetching details', async () => {
      (aviationstackService.getAirportById as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockAirportDetails), 100))
      );

      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.fetchAirportDetails('JFK');
      });

      expect(result.current.loading).toBe(true);
    });

    it('should handle not found airport', async () => {
      (aviationstackService.getAirportById as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirportDetails('INVALID');
      });

      await waitFor(() => {
        expect(result.current.selectedAirport).toBe(null);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle API errors', async () => {
      (aviationstackService.getAirportById as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useAirportStore());

      await act(async () => {
        await result.current.fetchAirportDetails('JFK');
      });

      await waitFor(() => {
        expect(result.current.selectedAirport).toBe(null);
        expect(result.current.loading).toBe(false);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Search History', () => {
    it('should add search term to history', () => {
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.addToHistory('JFK');
      });

      expect(result.current.searchHistory).toEqual(['JFK']);
      expect(localStorage.getItem('searchHistory')).toBe(JSON.stringify(['JFK']));
    });

    it('should not add duplicate searches', () => {
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.addToHistory('JFK');
        result.current.addToHistory('LAX');
        result.current.addToHistory('JFK'); // Duplicate
      });

      expect(result.current.searchHistory).toEqual(['JFK', 'LAX']);
    });

    it('should limit history to 10 items', () => {
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        for (let i = 1; i <= 12; i++) {
          result.current.addToHistory(`SEARCH${i}`);
        }
      });

      expect(result.current.searchHistory).toHaveLength(10);
      expect(result.current.searchHistory[0]).toBe('SEARCH12'); // Most recent
    });

    it('should clear search history', () => {
      localStorage.setItem('searchHistory', JSON.stringify(['JFK', 'LAX']));
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.searchHistory).toEqual([]);
      expect(localStorage.getItem('searchHistory')).toBe(null);
    });

    it('should handle case-insensitive duplicates', () => {
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.addToHistory('jfk');
        result.current.addToHistory('JFK');
        result.current.addToHistory('Jfk');
      });

      expect(result.current.searchHistory).toEqual(['Jfk']);
    });

    it('should persist history to localStorage', () => {
      const { result } = renderHook(() => useAirportStore());

      act(() => {
        result.current.addToHistory('JFK');
        result.current.addToHistory('LAX');
      });

      const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(stored).toEqual(['LAX', 'JFK']);
    });
  });
});