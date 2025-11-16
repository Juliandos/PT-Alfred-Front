import React from 'react';

export const MapContainer = ({ children, ...props }: any) => (
  <div data-testid="map-container" {...props}>
    {children}
  </div>
);

export const TileLayer = (props: any) => (
  <div data-testid="tile-layer" {...props} />
);

export const Marker = (props: any) => (
  <div data-testid="marker" {...props} />
);

export const Popup = ({ children, ...props }: any) => (
  <div data-testid="popup" {...props}>
    {children}
  </div>
);

export const useMap = () => ({
  setView: jest.fn(),
  flyTo: jest.fn(),
  getZoom: jest.fn(() => 13),
});

export default {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
};