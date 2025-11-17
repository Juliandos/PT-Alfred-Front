import '@testing-library/jest-dom';

// ===============================================
// Mock next/navigation
// ===============================================
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  useParams() {
    return {
      id: 'JFK',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// ===============================================
// Mock Leaflet
// ===============================================
jest.mock('leaflet', () => ({
  Icon: jest.fn(() => ({})),
  Map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
  })),
  TileLayer: jest.fn(() => ({})),
  Marker: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  icon: jest.fn(() => ({})),
}));

// ===============================================
// Mock react-leaflet (SIN JSX)
// ===============================================
jest.mock('react-leaflet', () => {
  const React = require('react');
  return {
    MapContainer: ({ children, ...props }: any) => 
      React.createElement('div', { 'data-testid': 'map-container', ...props }, children),
    TileLayer: (props: any) => 
      React.createElement('div', { 'data-testid': 'tile-layer', ...props }),
    Marker: (props: any) => 
      React.createElement('div', { 'data-testid': 'marker', ...props }),
    Popup: ({ children, ...props }: any) => 
      React.createElement('div', { 'data-testid': 'popup', ...props }, children),
    useMap: () => ({
      setView: jest.fn(),
      flyTo: jest.fn(),
    }),
  };
});

// ===============================================
// Mock localStorage
// ===============================================
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// ===============================================
// Mock window.matchMedia
// ===============================================
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ===============================================
// Mock IntersectionObserver
// ===============================================
class IntersectionObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// ===============================================
// Console error suppression (opcional)
// ===============================================
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});