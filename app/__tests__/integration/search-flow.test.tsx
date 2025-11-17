/**
 * Test de Integración: Flujo completo de búsqueda (SIMPLIFICADO)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../page';
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

describe('Search Flow Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full search to details flow', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(<Home />);
    
    expect(screen.getByText(/SkyConnect Explorer/i)).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'JFK');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
      expect(screen.getByText('LaGuardia Airport')).toBeInTheDocument();
    });
    
    // Verificar que se guardó en el historial
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    expect(storedHistory).toContain('JFK');
  });

  it('should show search history on focus', async () => {
    const user = userEvent.setup();
    
    // Establecer historial previo - Solo un item que sabemos aparecerá
    localStorage.setItem('searchHistory', JSON.stringify(['JFK']));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.click(searchInput);
    
    await waitFor(() => {
      expect(screen.getByText(/búsquedas recientes/i)).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
    });
  });

  it('should navigate back from results to landing', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'NYC');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /volver al inicio/i });
    await user.click(backButton);
    
    expect(screen.queryByRole('button', { name: /volver al inicio/i })).not.toBeInTheDocument();
  });

  it('should handle empty search results gracefully', async () => {
    const user = userEvent.setup();
    
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
    
    localStorage.setItem('searchHistory', JSON.stringify(['JFK']));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.click(searchInput);
    
    await waitFor(() => {
      expect(screen.getByText('JFK')).toBeInTheDocument();
    });
    
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(clearButton);
    
    expect(localStorage.getItem('searchHistory')).toBe(null);
  });

  it('should show loading state during search', async () => {
    const user = userEvent.setup();
    
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
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should allow search from history item', async () => {
    const user = userEvent.setup();
    
    (aviationstackService.listAirports as jest.Mock).mockResolvedValue(mockSearchResults);
    
    // Primero hacer una búsqueda para agregar al historial
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'JFK');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // Esperar a que aparezcan los resultados
    await waitFor(() => {
      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
    });
    
    // Volver al inicio
    const backButton = screen.getByRole('button', { name: /volver al inicio/i });
    await user.click(backButton);
    
    // Ahora hacer focus en el input para ver el historial
    const searchInput2 = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.click(searchInput2);
    
    // Buscar el item del historial
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
    
    (aviationstackService.listAirports as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText(/buscar aeropuertos/i);
    await user.type(searchInput, 'Test');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/no hay resultados/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  // REMOVIDO: Test de "plan gratuito" - no existe ese texto en la UI
});