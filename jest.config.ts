import type { Config } from 'jest';

// Configuración de Jest sin next/jest para evitar problemas de módulos
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Transformaciones
  transform: {
    '^.+\\.(t|j)sx?: ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/$1',
    '^@/app/(.*): '<rootDir>/app/$1',
    '\\.(css|less|scss|sass): 'identity-obj-proxy',
    '^.+\\.module\\.(css|sass|scss): 'identity-obj-proxy',
    '^leaflet: '<rootDir>/__mocks__/leaflet.ts',
    '^react-leaflet: '<rootDir>/__mocks__/react-leaflet.tsx',
  },
  
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!app/**/_*.{js,jsx,ts,tsx}',
  ],
  
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@react-leaflet)/)',
  ],
  
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

export default config;