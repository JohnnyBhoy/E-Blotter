// LocationSelectorMap.tsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const LocationSelectorMap: React.FC = () => {
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

    // Philippines bounding box
    const philippinesBounds: L.LatLngBoundsLiteral = [
        [4.6, 116.9], // Southwest corner
        [21.3, 126.6] // Northeast corner
    ];

    const handleMapClick = (event: L.LeafletEvent) => {
        const { lat, lng } = event.latlng;
        setSelectedCoords([lat, lng]);
        console.log('Selected coordinates:', lat, lng); // Log coordinates to the console
    };

    return (
        <div>
            <h1>Select a location within the Philippines</h1>

            <MapContainer
                center={[12.8797, 121.7740]} // Center the map on the Philippines
                zoom={6}
                style={{ width: '100%', height: '400px' }}
                whenCreated={(map) => {
                    // Attach the click event listener after map is created
                    map.on('click', handleMapClick);

                    // Restrict map movement to the bounds of the Philippines
                    map.setMaxBounds(philippinesBounds);
                }}
            >
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
