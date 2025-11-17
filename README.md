🛫 SkyConnect Explorer
Explorador de aeropuertos con información detallada y búsqueda en tiempo real, construido con Next.js 16, React 19, TypeScript y Tailwind CSS 4.
![Landing Dark](./public/screenshots/Landing.png)
Mostrar imagen
Mostrar imagen
Mostrar imagen
✨ Características

🔍 Búsqueda en tiempo real de aeropuertos con debounce
🗺️ Mapas interactivos con Leaflet y React-Leaflet
🌓 Tema claro/oscuro persistente en localStorage
📱 Diseño responsive optimizado para mobile, tablet y desktop
📊 Información detallada de cada aeropuerto (ubicación, zona horaria, códigos IATA/ICAO)
📜 Historial de búsquedas con límite de 10 items
⚡ Gestión de estado con Zustand
🧪 Testing completo con Jest y React Testing Library
🎨 Fuente Montserrat personalizada con múltiples pesos
🌐 Integración con API de AviationStack


🚀 Inicio Rápido
Requisitos previos

Node.js 20.x o superior
npm, yarn, pnpm o bun
Una API key de AviationStack (plan gratuito disponible)

1️⃣ Clonar el repositorio
bashgit clone https://github.com/tu-usuario/skyconnect-explorer.git
cd skyconnect-explorer
2️⃣ Instalar dependencias
Con npm:
bashnpm install
Con yarn:
bashyarn install
Con pnpm:
bashpnpm install
Con bun:
bashbun install
3️⃣ Configurar la API Key

Obtén tu API key gratuita en AviationStack
Abre el archivo app/services/aviationstack.service.ts
Reemplaza la API key existente con la tuya:

typescriptconst API_KEY = "TU_API_KEY_AQUI";

Nota: El plan gratuito usa HTTP. Si tienes un plan de pago, descomenta la línea HTTPS en app/services/apiClient.ts

4️⃣ Ejecutar el proyecto
Modo desarrollo:
bashnpm run dev
Abre http://localhost:3000 en tu navegador.
5️⃣ Build para producción
bashnpm run build
npm start
```

---

## 📂 Estructura del Proyecto
```
skyconnect-explorer/
├── app/
│   ├── airport/[id]/          # Página de detalles de aeropuerto
│   ├── components/            # Componentes React
│   │   ├── AirportCard.tsx
│   │   ├── AirportMap.tsx
│   │   ├── AirportSearch.tsx
│   │   ├── AirportTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── services/              # Servicios de API
│   │   ├── apiClient.ts
│   │   ├── aviationstack.service.ts
│   │   └── types.ts
│   ├── stores/                # Estado global con Zustand
│   │   ├── airport.store.ts
│   │   └── theme.store.ts
│   ├── __tests__/             # Tests
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── fonts/Montserrat/      # Fuentes personalizadas
│   ├── airport-bg.jpg         # Fondo modo oscuro
│   └── airport-bg-light.jpg   # Fondo modo claro
├── __mocks__/                 # Mocks para testing
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json

🧪 Testing
Ejecutar tests
bash# Ejecutar todos los tests
npm test

# Modo watch (re-ejecuta al hacer cambios)
npm run test:watch

# Con coverage (cobertura de código)
npm run test:coverage

# Modo verbose (output detallado)
npm run test:verbose

# Limpiar caché de Jest
npm run test:clear
```

### Cobertura actual
```
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   85.3  |   78.2   |   82.1  |   85.7  |
 components/             |   88.5  |   81.3   |   85.2  |   89.1  |
 stores/                 |   90.1  |   82.5   |   88.0  |   91.2  |
Ver TESTING.md para guía completa de testing.

🎨 Temas
El proyecto incluye soporte completo para tema claro y oscuro:

Persistencia: El tema se guarda en localStorage
Toggle: Botón flotante en la esquina superior derecha
Transiciones suaves entre temas
Diseño adaptativo con diferentes fondos y paletas de color

Colores principales
css/* Modo oscuro */
--primary-blue: #006AFF;
--primary-cyan: #00F9FF;

/* Modo claro */
--primary-blue: #1e40af;
--primary-cyan: #3b82f6;

🗺️ Características del Mapa

Mapas interactivos con Leaflet v1.9.4
Marcadores personalizados de aeropuertos
Zoom y navegación fluidos
Renderizado dinámico solo en cliente (SSR disabled)


📦 Dependencias Principales
DependenciaVersiónDescripciónNext.js16.0.3Framework ReactReact19.2.0Librería UITypeScript5.xTipado estáticoTailwind CSS4.0Estilos utility-firstZustand5.0.8Gestión de estadoLeaflet1.9.4Mapas interactivosReact-Leaflet5.0.0Integración React-LeafletAxios1.13.2Cliente HTTP

🛠️ Scripts Disponibles
ScriptDescripciónnpm run devInicia servidor de desarrollonpm run buildCrea build de producciónnpm startInicia servidor de producciónnpm run lintEjecuta ESLintnpm testEjecuta tests con Jestnpm run test:watchTests en modo watchnpm run test:coverageGenera reporte de coberturanpm run test:clearLimpia caché de Jest

🐛 Troubleshooting
Error: "Cannot find module 'leaflet'"
bashnpm run test:clear
npm install
Error: "localStorage is not defined"
Asegúrate de que jest.setup.ts esté correctamente configurado en jest.config.ts:
typescriptsetupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
Tests fallan con React 19
Verifica las versiones en package.json:
json{
  "@testing-library/react": "^16.3.0",
  "react": "19.2.0"
}
Ver TROUBLESHOOTING.md para más soluciones.

🌐 API de AviationStack
Este proyecto usa la API gratuita de AviationStack con las siguientes limitaciones:

✅ 1000 requests/mes en plan gratuito
✅ Solo HTTP (HTTPS requiere plan de pago)
❌ No soporta búsqueda con search param en plan gratuito
✅ Búsqueda implementada del lado del cliente

Endpoints utilizados
typescript// Listar aeropuertos
GET http://api.aviationstack.com/v1/airports
  ?access_key=YOUR_KEY
  &limit=100

// Detalles de aeropuerto
GET http://api.aviationstack.com/v1/airports
  ?access_key=YOUR_KEY
  &iata_code=JFK

📸 Screenshots
Landing Page - Modo Oscuro
Mostrar imagen
Landing Page - Modo Claro
Mostrar imagen
Resultados de Búsqueda
Mostrar imagen
Detalles del Aeropuerto
Mostrar imagen

🤝 Contribuir
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request


📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

👨‍💻 Autor
Tu Nombre

GitHub: @tu-usuario
LinkedIn: Tu Perfil


🙏 Agradecimientos

AviationStack por la API de aeropuertos
Leaflet por los mapas interactivos
Next.js por el excelente framework
Vercel por el hosting


📞 Soporte
¿Tienes preguntas o problemas? Abre un issue o contáctame directamente.