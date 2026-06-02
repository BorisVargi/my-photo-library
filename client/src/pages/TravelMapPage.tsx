import { Box, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export function TravelMapPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Карта путешествий
      </Typography>

      <MapContainer
        center={[40, 20]}
        zoom={2}
        style={{ height: '70vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[41.9028, 12.4964]}>
          <Popup>Rome</Popup>
        </Marker>

        <Marker position={[48.8566, 2.3522]}>
          <Popup>Paris</Popup>
        </Marker>

        <Marker position={[35.6762, 139.6503]}>
          <Popup>Tokyo</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
