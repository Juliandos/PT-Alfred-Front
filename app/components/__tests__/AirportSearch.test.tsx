import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirportSearch from '../AirportSearch';
import { useAirportStore } from '../../stores/airport.store';

// Mock del store
jest.mock('../../stores/airport.store');

describe('AirportSearch Component', () => {
  const mockFetchAirports = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAirportStore as unknown as jest.Mock).mockReturnValue({
      fetchAirports: mockFetchAirports,
    });
  });

  it('should render the search input', () => {
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    expect(input).toBeInTheDocument();
  });

  it('should update input value when user types', async () => {
    const user = userEvent.setup();
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    await user.type(input, 'JFK');
    
    expect(input).toHaveValue('JFK');
  });

  it('should call fetchAirports with debounce when user types', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    await user.type(input, 'London');
    
    // Debounce no ha ejecutado aún
    expect(mockFetchAirports).not.toHaveBeenCalled();
    
    // Avanzar el tiempo 300ms (debounce)
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockFetchAirports).toHaveBeenCalledWith({
        search: 'London',
        page: 1,
      });
    });
    
    jest.useRealTimers();
  });

  it('should handle multiple rapid inputs with debounce', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    // Escribir múltiples caracteres rápidamente
    await user.type(input, 'J');
    jest.advanceTimersByTime(100);
    
    await user.type(input, 'F');
    jest.advanceTimersByTime(100);
    
    await user.type(input, 'K');
    
    // Solo debería llamar fetchAirports una vez después del debounce
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockFetchAirports).toHaveBeenCalledTimes(1);
      expect(mockFetchAirports).toHaveBeenCalledWith({
        search: 'JFK',
        page: 1,
      });
    });
    
    jest.useRealTimers();
  });

  it('should fetch airports with empty search when input is cleared', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    await user.type(input, 'Test');
    await user.clear(input);
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockFetchAirports).toHaveBeenCalledWith({
        search: '',
        page: 1,
      });
    });
    
    jest.useRealTimers();
  });

  it('should have correct styling classes', () => {
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    expect(input).toHaveClass('px-4', 'py-2', 'rounded-md');
  });

  it('should log query to console when searching', async () => {
    jest.useFakeTimers();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup({ delay: null });
    
    render(<AirportSearch />);
    
    const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
    
    await user.type(input, 'MAD');
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('query', 'MAD');
    });
    
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});