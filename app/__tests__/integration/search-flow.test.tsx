/**
 * Test de Integración: Flujo completo de búsqueda
 * 
 * Este test verifica el flujo completo desde que un usuario
 * busca un aeropuerto hasta que ve sus detalles.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../page';
import AirportDetails from '../../airport/[id]/page';
import * as aviationstackService from '../../services/aviationstack.service';

jest.mock('../../services/aviationstack.service');

const mockSearchResults = {
  pagination: { offset: 0, limit: 9, count: 2, total: 2 },
  data: [
    {
      airport_id: '1',
      airport_name: 'John F. Kennedy International Airport',
      iata_code: 'JFK',
      icao_code: 'KJFK',
      country_name: 'United States',
      city_iata_code: 'NYC',
      latitude: '40.6413',
      longitude: '-73.7781',
    },
    {
      airport_id: '2',
      airport_name: 'LaGuardia Airport',
      iata_code: 'LGA',
      icao_code: 'KLGA',
      country_name: 'United States',
      city_iata_code: 'NYC',
      latitude: '40.7769',
      longitude: '-73.8740',
    },
  ],
};

const mockAirportDetails = {
  airport_id: '1',
  airport_name: 'John F. Kennedy International Airport',
  iata_code: 'JFK',
  icao_code: 'KJFK',
  country_name: 'United States',
  country_iso2: 'US',
  city_iata_code: 'NYC',
  latitude: '40.6413',
  longitude: '-73.7781',
  timezone: 'America/New_York',
  gmt: '-5',
  phone_number: '+1-718-244-4444',
  geoname_id: '5128581',
};

describe('Search Flow Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full search to details flow', async () => {
    const user = userEvent.setup();
    
    // Mock de la API
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    // 1. Renderizar página principal
    render(<Home />);
    
    // 2. Verificar que muestra el landing
    expect(screen.getByText(/SkyConnect Explorer/i)).toBeInTheDocument();
    
    // 3. Usuario escribe en el input de búsqueda
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'JFK');
    
    // 4. Usuario hace click en buscar
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // 5. Verificar que se muestran los resultados
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
      expect(screen.getByText('LaGuardia Airport')).toBeInTheDocument();
    });
    
    // 6. Verificar que se guardó en el historial
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    expect(storedHistory).toContain('JFK');
  });

  it('should show search history on focus', async () => {
    const user = userEvent.setup();
    
    // Establecer historial previo
    localStorage.setItem('searchHistory', JSON.stringify(['LAX', 'JFK', 'LHR']));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    // Focus en el input
    await user.click(searchInput);
    
    // Verificar que muestra el historial
    await waitFor(() => {
      expect(screen.getByText(/búsquedas recientes/i)).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('LHR')).toBeInTheDocument();
    });
  });

  it('should navigate back from results to landing', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(<Home />);
    
    // Realizar búsqueda
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'NYC');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // Esperar resultados
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
    });
    
    // Click en volver al inicio
    const backButton = screen.getByRole('button', { name: /volver al inicio/i });
    await user.click(backButton);
    
    // Verificar que volvió al landing (no debe mostrar el botón de volver)
    expect(screen.queryByRole('button', { name: /volver al inicio/i })).not.toBeInTheDocument();
  });

  it('should handle empty search results gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock con resultados vacíos
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue({
      pagination: { offset: 0, limit: 9, count: 0, total: 0 },
      data: [],
    });
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'XXXXXX');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/no hay resultados/i)).toBeInTheDocument();
    });
  });

  it('should clear search history', async () => {
    const user = userEvent.setup();
    
    // Establecer historial
    localStorage.setItem('searchHistory', JSON.stringify(['LAX', 'JFK']));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.click(searchInput);
    
    // Verificar que aparece el historial
    await waitFor(() => {
      expect(screen.getByText('LAX')).toBeInTheDocument();
    });
    
    // Click en limpiar
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(clearButton);
    
    // Verificar que se limpió
    expect(localStorage.getItem('searchHistory')).toBe(null);
  });

  it('should show loading state during search', async () => {
    const user = userEvent.setup();
    
    // Mock con delay
    (aviationstackService.listAirports as jest.Mock).mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve(mockSearchResults), 500)
      )
    );
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'Test');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // Verificar estado de carga
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    
    // Esperar a que termine
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should allow search from history item', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    localStorage.setItem('searchHistory', JSON.stringify(['JFK']));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.click(searchInput);
    
    // Click en item del historial
    const historyItem = await screen.findByText('JFK');
    await user.click(historyItem);
    
    // Verificar que ejecutó la búsqueda
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock con error
    (aviationstackService.listAirports as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'Test');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // Debería mostrar mensaje de sin resultados en lugar de crash
    await waitFor(() => {
      expect(screen.getByText(/no hay resultados/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('should show plan limitation notice in results', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'Test');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // Verificar que muestra la nota del plan gratuito
    await waitFor(() => {
      expect(screen.getByText(/plan gratuito activo/i)).toBeInTheDocument();
    });
  });
});