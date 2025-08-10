<div>
    <div id="map" style="height: 300px; border-radius: 8px;"></div>
    <input
        type="hidden"
        name="data[coordinates]"
        id="leaflet-coordinates"
        value="{{ old('data.coordinates', $getState()) }}" />
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const input = document.getElementById('leaflet-coordinates');
        const coords = input.value ? input.value.split(',').map(Number) : [14.5995, 120.9842];

        const map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker(coords, {
            draggable: true
        }).addTo(map);

        marker.on('dragend', function() {
            const pos = marker.getLatLng();
            input.value = `${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`;
            input.dispatchEvent(new Event('input'));
        });
    });
</script>