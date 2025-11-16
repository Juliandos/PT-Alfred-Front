# 🔧 Guía de Troubleshooting - Testing

## 🚨 Problemas Comunes y Soluciones

### 1. Error: "Cannot find module 'leaflet'"

**Síntoma:**
```
Cannot find module 'leaflet' from 'app/components/AirportMap.tsx'
```

**Solución:**
- Verifica que el mock esté en `__mocks__/leaflet.ts`
- Limpia la caché de Jest: `npm run test:clear`
- Ejecuta de nuevo: `npm test`

---

### 2. Error: "Unexpected token 'export'"

**Síntoma:**
```
Jest encountered an unexpected token
export default
```

**Solución:**
- Verifica que `@swc/jest` esté instalado: `npm install --save-dev @swc/jest @swc/core`
- Asegúrate de que el archivo `.swcrc` esté en la raíz del proyecto
- Limpia caché: `npm run test:clear`

---

### 3. Error: "useRouter is not a function"

**Síntoma:**
```
TypeError: useRouter is not a function
```

**Solución:**
- Verifica que `jest.setup.ts` tenga el mock de `next/navigation`
- Asegúrate de que `setupFilesAfterEnv` esté en `jest.config.ts`

---

### 4. Error: "localStorage is not defined"

**Síntoma:**
```
ReferenceError: localStorage is not defined
```

**Solución:**
- El mock de localStorage está en `jest.setup.ts`
- Verifica que `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']` esté en jest.config.ts

---

### 5. Tests pasan pero con warnings de "act()"

**Síntoma:**
```
Warning: An update to Component inside a test was not wrapped in act(...)
```

**Solución:**
```typescript
import { act } from '@testing-library/react';

// Opción 1: Usar waitFor
await waitFor(() => {
  expect(screen.getByText('...')).toBeInTheDocument();
});

// Opción 2: Envolver en act
await act(async () => {
  await userEvent.click(button);
});
```

---

### 6. Error: "SyntaxError: Unexpected token '?'"

**Síntoma:**
```
SyntaxError: Unexpected token '?' (Optional chaining)
```

**Solución:**
- Actualiza el target en `jest.config.ts`:
```typescript
transform: {
  '^.+\\.(t|j)sx?$': ['@swc/jest', {
    jsc: {
      target: 'es2020', // Cambia de es2017 a es2020
    }
  }]
}
```

---

### 7. Tests no encuentran archivos CSS

**Síntoma:**
```
Cannot find module './styles.module.css'
```

**Solución:**
- Verifica `moduleNameMapper` en `jest.config.ts`:
```typescript
moduleNameMapper: {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
}
```

---

### 8. Error con React 19: "Cannot read property 'ReactCurrentDispatcher'"

**Síntoma:**
```
TypeError: Cannot read property 'ReactCurrentDispatcher' of undefined
```

**Solución:**
- Asegúrate de que las versiones sean compatibles:
```json
{
  "@testing-library/react": "^16.0.0",
  "react": "19.2.0"
}
```

---

## 🔄 Comandos de Limpieza

Si nada funciona, ejecuta en orden:

```bash
# 1. Limpiar caché de Jest
npm run test:clear

# 2. Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# 3. Limpiar caché de Next.js
rm -rf .next

# 4. Ejecutar tests
npm test
```

---

## 🧪 Verificar Configuración

### Test rápido de configuración:

```bash
# Ejecutar solo el test de setup
npm test -- setup.test.tsx

# Si pasa, la configuración es correcta
```

---

## 📊 Coverage no se genera

**Síntoma:**
El reporte de coverage no aparece.

**Solución:**
```bash
# Ejecutar con flag de coverage
npm run test:coverage

# El reporte estará en:
# - coverage/lcov-report/index.html (navegador)
# - Terminal (resumen)
```

---

## 🐛 Modo Debug

Para debuggear tests con Chrome DevTools:

```bash
npm run test:debug

# Luego abre en Chrome:
# chrome://inspect
```

---

## 📝 Configuración de VSCode

Crea `.vscode/settings.json`:

```json
{
  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": false,
  "jest.testEnvironment": "jsdom"
}
```

---

## 🔍 Verificar que los mocks funcionan

Crea un test simple:

```typescript
// app/__tests__/mocks.test.tsx
import { useRouter } from 'next/navigation';

describe('Mocks', () => {
  it('should mock useRouter', () => {
    const router = useRouter();
    expect(router.push).toBeDefined();
  });

  it('should mock localStorage', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
  });
});
```

---

## 📞 Contacto

Si ninguna solución funciona:
1. Revisa los logs completos del error
2. Verifica las versiones de las dependencias
3. Compara con el `TESTING.md` principal