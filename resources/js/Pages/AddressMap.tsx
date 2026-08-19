// LocationSelectorMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Philippines bounding box
const philippinesBounds: L.LatLngBoundsLiteral = [
    [4.6, 116.9], // Southwest corner
    [21.3, 126.6] // Northeast corner
];

/**
 * react-leaflet v4 dropped MapContainer's `whenCreated` prop, so the click
 * handler and the max bounds were silently never attached. Both now hook into
 * the map instance from inside the container.
 */
const MapBehaviour = ({ onSelect }: { onSelect: (coords: [number, number]) => void }) => {
    const map = useMap();

    useEffect(() => {
        map.setMaxBounds(philippinesBounds);
    }, [map]);

    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            onSelect([lat, lng]);
        },
    });

    return null;
};

const LocationSelectorMap: React.FC = () => {
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

    return (
        <div>
            <h1>Select a location within the Philippines</h1>

            <MapContainer
                center={[12.8797, 121.7740]} // Center the map on the Philippines
                zoom={6}
                style={{ width: '100%', height: '400px' }}
            >
                <MapBehaviour onSelect={setSelectedCoords} />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {selectedCoords && (
                    <Marker position={selectedCoords}>
                        <Popup>
                            You selected: <br />
                            Latitude: {selectedCoords[0]} <br />
                            Longitude: {selectedCoords[1]}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {selectedCoords && (
                <div>
                    <h3>Selected Coordinates:</h3>
                    <p>Latitude: {selectedCoords[0]}</p>
                    <p>Longitude: {selectedCoords[1]}</p>
                </div>
            )}
        </div>
    );
};

export default LocationSelectorMap;
