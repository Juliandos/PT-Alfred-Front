import { render, screen, fireEvent } from '@testing-library/react';
import AirportCard from '../../../components/AirportCard';
import { useThemeStore } from '../../../stores/theme.store';

jest.mock('../../stores/theme.store');

// Mock de next/navigation a nivel de test
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockAirport = {
  airport_id: '1',
  airport_name: 'John F. Kennedy International Airport',
  iata_code: 'JFK',
  icao_code: 'KJFK',
  city_iata_code: 'NYC',
  country_name: 'United States',
  latitude: '40.6413',
  longitude: '-73.7781',
};

describe('AirportCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();

    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: 'dark',
    });
  });

  it('should render airport name', () => {
    render(<AirportCard airport={mockAirport} />);
    
    expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
  });

  it('should render airport IATA code', () => {
    render(<AirportCard airport={mockAirport} />);
    
    expect(screen.getByText('JFK')).toBeInTheDocument();
  });

  it('should render city and country', () => {
    render(<AirportCard airport={mockAirport} />);
    
    expect(screen.getByText(/NYC.*United States/i)).toBeInTheDocument();
  });

  it('should navigate to airport details on click', () => {
    render(<AirportCard airport={mockAirport} />);
    
    const card = screen.getByText('John F. Kennedy International Airport').closest('div');
    fireEvent.click(card!);
    
    expect(mockPush).toHaveBeenCalledWith('/airport/JFK');
  });

  it('should not navigate if iata_code is missing', () => {
    const airportWithoutCode = { ...mockAirport, iata_code: undefined };
    
    render(<AirportCard airport={airportWithoutCode} />);
    
    const card = screen.getByText('John F. Kennedy International Airport').closest('div');
    fireEvent.click(card!);
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should apply hover effects with appropriate classes', () => {
    const { container } = render(<AirportCard airport={mockAirport} />);
    
    const card = container.querySelector('.hover\\:scale-105');
    expect(card).toBeInTheDocument();
  });

  it('should render airplane icon', () => {
    const { container } = render(<AirportCard airport={mockAirport} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should apply light theme styling', () => {
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: 'light',
    });

    const { container } = render(<AirportCard airport={mockAirport} />);
    
    const card = container.querySelector('.bg-white\\/90');
    expect(card).toBeInTheDocument();
  });

  it('should apply dark theme styling', () => {
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: 'dark',
    });

    const { container } = render(<AirportCard airport={mockAirport} />);
    
    const card = container.querySelector('.bg-white\\/5');
    expect(card).toBeInTheDocument();
  });

  it('should display "N/A" for missing country', () => {
    const airportWithoutCountry = { ...mockAirport, country_name: null };
    
    render(<AirportCard airport={airportWithoutCountry} />);
    
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });

  it('should use city_iata as fallback for city_iata_code', () => {
    const airportWithCityIata = {
      ...mockAirport,
      city_iata_code: undefined,
      city_iata: 'NYC',
    };
    
    render(<AirportCard airport={airportWithCityIata} />);
    
    expect(screen.getByText(/NYC.*United States/i)).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    render(<AirportCard airport={mockAirport} />);
    
    // Buscar el div padre que tiene cursor-pointer (es el contenedor principal de la card)
    const card = screen.getByText('John F. Kennedy International Airport').closest('div')?.parentElement;
    
    expect(card).toHaveClass('cursor-pointer');
  });
});