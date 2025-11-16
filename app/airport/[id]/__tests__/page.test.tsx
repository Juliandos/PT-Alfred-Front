import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirportDetails from '../page';
import { useAirportStore } from '../../../stores/airport.store';
import { useThemeStore } from '../../../stores/theme.store';

// Mocks
jest.mock('../../../stores/airport.store');
jest.mock('../../../stores/theme.store');

const mockAirportData = {
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

describe('AirportDetails Component', () => {
  const mockFetchAirportDetails = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useRouter
    jest.requireMock('next/navigation').useRouter.mockReturnValue({
      push: mockRouterPush,
    });

    // Mock useParams
    jest.requireMock('next/navigation').useParams.mockReturnValue({
      id: 'JFK',
    });

    // Mock theme store
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: 'dark',
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: null,
        loading: true,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      render(<AirportDetails />);

      expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when airport is not found', () => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: null,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      render(<AirportDetails />);

      expect(screen.getByText(/aeropuerto no encontrado/i)).toBeInTheDocument();
    });

    it('should show "Volver al inicio" button when airport not found', () => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: null,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      render(<AirportDetails />);

      const backButton = screen.getByRole('button', { name: /volver al inicio/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should navigate to home when "Volver al inicio" is clicked', async () => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: null,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      render(<AirportDetails />);

      const backButton = screen.getByRole('button', { name: /volver al inicio/i });
      fireEvent.click(backButton);

      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: mockAirportData,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });
    });

    it('should display airport name', () => {
      render(<AirportDetails />);

      expect(screen.getByText('John F. Kennedy International Airport')).toBeInTheDocument();
    });

    it('should fetch airport details on mount', () => {
      render(<AirportDetails />);

      expect(mockFetchAirportDetails).toHaveBeenCalledWith('JFK');
    });

    it('should display all tabs', () => {
      render(<AirportDetails />);

      expect(screen.getByRole('button', { name: /general/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ubicación/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /zona horaria/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /estadísticas/i })).toBeInTheDocument();
    });

    it('should show General tab content by default', () => {
      render(<AirportDetails />);

      expect(screen.getByText(/información general/i)).toBeInTheDocument();
      expect(screen.getByText(/código iata/i)).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
    });

    it('should switch to Location tab when clicked', async () => {
      const user = userEvent.setup();
      render(<AirportDetails />);

      const locationTab = screen.getByRole('button', { name: /ubicación/i });
      await user.click(locationTab);

      await waitFor(() => {
        expect(screen.getByText(/latitud/i)).toBeInTheDocument();
        expect(screen.getByText('40.6413')).toBeInTheDocument();
      });
    });

    it('should switch to Timezone tab when clicked', async () => {
      const user = userEvent.setup();
      render(<AirportDetails />);

      const timezoneTab = screen.getByRole('button', { name: /zona horaria/i });
      await user.click(timezoneTab);

      await waitFor(() => {
        expect(screen.getByText('America/New_York')).toBeInTheDocument();
        expect(screen.getByText(/hora local/i)).toBeInTheDocument();
      });
    });

    it('should switch to Statistics tab when clicked', async () => {
      const user = userEvent.setup();
      render(<AirportDetails />);

      const statsTab = screen.getByRole('button', { name: /estadísticas/i });
      await user.click(statsTab);

      await waitFor(() => {
        expect(screen.getByText(/id aeropuerto/i)).toBeInTheDocument();
      });
    });

    it('should display map in Location tab', async () => {
      const user = userEvent.setup();
      render(<AirportDetails />);

      const locationTab = screen.getByRole('button', { name: /ubicación/i });
      await user.click(locationTab);

      await waitFor(() => {
        expect(screen.getByTestId('map-container')).toBeInTheDocument();
      });
    });

    it('should display all airport information in General tab', () => {
      render(<AirportDetails />);

      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('KJFK')).toBeInTheDocument();
      expect(screen.getByText(/united states/i)).toBeInTheDocument();
      expect(screen.getByText('+1-718-244-4444')).toBeInTheDocument();
    });

    it('should show "Volver" button', () => {
      render(<AirportDetails />);

      const backButton = screen.getByRole('button', { name: /volver/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should navigate back when "Volver" is clicked', () => {
      render(<AirportDetails />);

      const backButton = screen.getByRole('button', { name: /volver/i });
      fireEvent.click(backButton);

      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });

    it('should apply active tab styling', async () => {
      const user = userEvent.setup();
      render(<AirportDetails />);

      const generalTab = screen.getByRole('button', { name: /general/i });
      
      // Tab activo debe tener clases específicas
      expect(generalTab).toHaveClass('bg-blue-500');

      const locationTab = screen.getByRole('button', { name: /ubicación/i });
      await user.click(locationTab);

      await waitFor(() => {
        expect(locationTab).toHaveClass('bg-blue-500');
      });
    });
  });

  describe('Theme Integration', () => {
    it('should apply light theme classes', () => {
      (useThemeStore as unknown as jest.Mock).mockReturnValue({
        theme: 'light',
      });

      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: mockAirportData,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      const { container } = render(<AirportDetails />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('bg-gray-50');
    });

    it('should apply dark theme classes', () => {
      (useThemeStore as unknown as jest.Mock).mockReturnValue({
        theme: 'dark',
      });

      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: mockAirportData,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      const { container } = render(<AirportDetails />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('bg-gray-900');
    });
  });

  describe('Local Time Display', () => {
    it('should display local time based on timezone', async () => {
      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: mockAirportData,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      const user = userEvent.setup();
      render(<AirportDetails />);

      const timezoneTab = screen.getByRole('button', { name: /zona horaria/i });
      await user.click(timezoneTab);

      await waitFor(() => {
        // Verificar que hay un texto con formato de fecha/hora
        const timeElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
        expect(timeElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "N/A" for missing phone number', () => {
      const airportWithoutPhone = {
        ...mockAirportData,
        phone_number: null,
      };

      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: airportWithoutPhone,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      render(<AirportDetails />);

      expect(screen.getByText(/no disponible/i)).toBeInTheDocument();
    });

    it('should display "N/A" for missing timezone', async () => {
      const airportWithoutTimezone = {
        ...mockAirportData,
        timezone: null,
      };

      (useAirportStore as unknown as jest.Mock).mockReturnValue({
        selectedAirport: airportWithoutTimezone,
        loading: false,
        fetchAirportDetails: mockFetchAirportDetails,
      });

      const user = userEvent.setup();
      render(<AirportDetails />);

      const timezoneTab = screen.getByRole('button', { name: /zona horaria/i });
      await user.click(timezoneTab);

      await waitFor(() => {
        const naElements = screen.getAllByText('N/A');
        expect(naElements.length).toBeGreaterThan(0);
      });
    });
  });
});