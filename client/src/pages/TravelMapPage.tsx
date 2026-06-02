import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import {
  getTravelMapCities,
  type TravelMapCity,
} from '../shared/api';

export function TravelMapPage() {
  const [cities, setCities] = useState<TravelMapCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadCities() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getTravelMapCities();

        if (!ignore) {
          setCities(data.cities);
        }
      } catch {
        if (!ignore) {
          setError('Не удалось загрузить города для карты');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadCities();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Карта путешествий
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : cities.length ? (
        <MapContainer
          center={[40, 20]}
          zoom={2}
          style={{ height: '70vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {cities.map((city) => (
            <Marker key={city.id} position={[city.lat, city.lng]}>
              <Popup>
                <strong>{city.name}</strong>
                <br />
                {city.country || city.trip.country || 'Страна не указана'}
                <br />
                {city.trip.title}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <Typography color="text.secondary">
          На карте пока нет городов. Добавь города на странице поездки.
        </Typography>
      )}
    </Box>
  );
}
