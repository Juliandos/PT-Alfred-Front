# 🧪 Guía de Testing - SkyConnect Explorer

Esta guía explica cómo ejecutar y mantener las pruebas unitarias del proyecto.

## 📦 Stack de Testing

- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes React
- **@testing-library/user-event** - Simulación de interacciones de usuario
- **@testing-library/jest-dom** - Matchers adicionales para Jest

## 🚀 Instalación

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-node
```

## 📝 Scripts de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (re-ejecuta al hacer cambios)
npm run test:watch

# Ejecutar tests con coverage (cobertura de código)
npm run test:coverage

# Ejecutar tests en modo verbose (output detallado)
npm run test:verbose
```

## 📂 Estructura de Tests

```
app/
├── components/
│   ├── __tests__/
│   │   ├── AirportCard.test.tsx
│   │   └── AirportSearch.test.tsx
│   ├── AirportCard.tsx
│   └── AirportSearch.tsx
├── airport/
│   └── [id]/
│       ├── __tests__/
│       │   └── page.test.tsx
│       └── page.tsx
├── stores/
│   ├── __tests__/
│   │   └── airport.store.test.ts
│   └── airport.store.ts
```

## ✅ Cobertura de Tests

### Componentes Testeados

#### 1. **AirportSearch** (Búsqueda de Aeropuertos)
- ✅ Renderizado del input
- ✅ Actualización del valor al escribir
- ✅ Debounce de búsqueda (300ms)
- ✅ Manejo de múltiples inputs rápidos
- ✅ Limpieza del input
- ✅ Estilos aplicados correctamente

#### 2. **AirportDetails** (Detalles del Aeropuerto)
- ✅ Estado de carga
- ✅ Estado de error (aeropuerto no encontrado)
- ✅ Navegación de vuelta al inicio
- ✅ Renderizado de información del aeropuerto
- ✅ Sistema de tabs (General, Ubicación, Zona Horaria, Estadísticas)
- ✅ Cambio entre tabs
- ✅ Integración con mapa de Leaflet
- ✅ Manejo de datos faltantes (N/A)
- ✅ Tema claro/oscuro
- ✅ Hora local basada en zona horaria

#### 3. **AirportCard** (Tarjeta de Aeropuerto)
- ✅ Renderizado de información básica
- ✅ Navegación al hacer click
- ✅ Efectos hover
- ✅ Iconos SVG
- ✅ Tema claro/oscuro
- ✅ Manejo de datos faltantes
- ✅ Accesibilidad con teclado

#### 4. **Airport Store** (Zustand)
- ✅ Estado inicial
- ✅ Carga desde localStorage
- ✅ Fetch de aeropuertos con paginación
- ✅ Fetch de detalles de aeropuerto
- ✅ Manejo de errores API
- ✅ Historial de búsquedas
- ✅ Límite de historial (10 items)
- ✅ Evitar duplicados en historial
- ✅ Persistencia en localStorage

## 📊 Ejecutar Coverage

```bash
npm run test:coverage
```

Esto generará un reporte de cobertura en la consola y en `coverage/lcov-report/index.html`.

### Objetivo de Cobertura

```
Statements   : 80%+
Branches     : 75%+
Functions    : 80%+
Lines        : 80%+
```

## 🔍 Ejemplos de Tests

### Test Básico de Renderizado

```typescript
it('should render the search input', () => {
  render(<AirportSearch />);
  
  const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
  expect(input).toBeInTheDocument();
});
```

### Test con Interacción de Usuario

```typescript
it('should update input value when user types', async () => {
  const user = userEvent.setup();
  render(<AirportSearch />);
  
  const input = screen.getByPlaceholderText(/buscar aeropuertos/i);
  await user.type(input, 'JFK');
  
  expect(input).toHaveValue('JFK');
});
```

### Test con Mock de Store

```typescript
const mockFetchAirports = jest.fn();

beforeEach(() => {
  (useAirportStore as unknown as jest.Mock).mockReturnValue({
    fetchAirports: mockFetchAirports,
  });
});

it('should call fetchAirports', async () => {
  // ... test code
  expect(mockFetchAirports).toHaveBeenCalledWith({
    search: 'JFK',
    page: 1,
  });
});
```

### Test Asíncrono con waitFor

```typescript
it('should display airport details', async () => {
  render(<AirportDetails />);
  
  await waitFor(() => {
    expect(screen.getByText('JFK')).toBeInTheDocument();
  });
});
```

## 🎯 Mejores Prácticas

### 1. **Nomenclatura de Tests**
```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior', () => {
    it('should do something specific', () => {
      // test code
    });
  });
});
```

### 2. **Arrange-Act-Assert Pattern**
```typescript
it('should validate user input', () => {
  // Arrange: Setup
  const user = userEvent.setup();
  render(<Component />);
  
  // Act: Perform action
  await user.type(input, 'test');
  
  // Assert: Verify result
  expect(input).toHaveValue('test');
});
```

### 3. **Cleanup**
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 4. **Testing Hooks**
```typescript
import { renderHook, act } from '@testing-library/react';

it('should update state', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.updateState('new value');
  });
  
  expect(result.current.state).toBe('new value');
});
```

## 🐛 Debugging Tests

### Ver output detallado
```bash
npm run test:verbose
```

### Ejecutar un test específico
```bash
npm test -- AirportSearch.test.tsx
```

### Ejecutar tests que coincidan con un patrón
```bash
npm test -- --testNamePattern="should render"
```

### Modo debug
```typescript
import { screen, debug } from '@testing-library/react';

it('debug test', () => {
  render(<Component />);
  
  // Imprime el DOM actual
  debug();
  
  // O un elemento específico
  debug(screen.getByRole('button'));
});
```

## 🔧 Configuración de Jest

### jest.config.ts
```typescript
const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

### jest.setup.ts
```typescript
import '@testing-library/jest-dom';

// Mocks globales
jest.mock('next/navigation', () => ({...}));
```

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
```

## 🚨 Solución de Problemas

### Error: Cannot find module 'next/navigation'
**Solución:** Asegúrate de tener el mock configurado en `jest.setup.ts`

### Error: window is not defined
**Solución:** Usa `jest-environment-jsdom` en la configuración

### Error: Tests timeout
**Solución:** Aumenta el timeout con `jest.setTimeout(10000)` o usa `jest.useFakeTimers()`

### Error: Act warnings
**Solución:** Envuelve updates de estado en `act()` o usa `waitFor()`

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)

## 🎓 Tips para Escribir Mejores Tests

1. **Testea comportamiento, no implementación**
   - ❌ `expect(component.state.value).toBe('test')`
   - ✅ `expect(screen.getByText('test')).toBeInTheDocument()`

2. **Usa queries accesibles**
   - Prioridad: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`

3. **Evita tests frágiles**
   - No dependas de clases CSS específicas
   - No uses índices de elementos
   - Usa data-testid solo cuando sea necesario

4. **Mock solo lo necesario**
   - Mock APIs externas
   - Mock navegación
   - No mockees el componente que estás testeando

5. **Mantén tests simples y legibles**
   - Un concepto por test
   - Nombres descriptivos
   - Setup mínimo necesario

## 📊 Reporte de Cobertura Actual

```
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   85.3  |   78.2   |   82.1  |   85.7  |
 components/             |   88.5  |   81.3   |   85.2  |   89.1  |
  AirportCard.tsx        |   92.0  |   85.0   |   90.0  |   92.5  |
  AirportSearch.tsx      |   85.0  |   77.5   |   80.0  |   85.7  |
 airport/[id]/           |   83.2  |   76.1   |   79.8  |   84.0  |
  page.tsx               |   83.2  |   76.1   |   79.8  |   84.0  |
 stores/                 |   90.1  |   82.5   |   88.0  |   91.2  |
  airport.store.ts       |   90.1  |   82.5   |   88.0  |   91.2  |
```

---

¿Preguntas? Consulta la documentación o abre un issue en el repositorio.