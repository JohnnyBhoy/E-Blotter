// Maps.tsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  coordinates: [number, number];
  zoomLevel?: number;
}

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, []);
  return null;
};

const Maps: React.FC<MapProps> = ({ coordinates, zoomLevel = 13 }) => {
  const coordinate: LatLngTuple = [coordinates[0], coordinates[1]];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={coordinate}
        zoom={zoomLevel}
        className="w-full h-full z-0"
        scrollWheelZoom={false}
      >
        <ResizeMap />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={coordinate}>
          <Popup>
            Latitude: {coordinates[0]}, Longitude: {coordinates[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Maps;
