import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import L from 'leaflet';
import {
  getTravelMapCities,
  type TravelMapCity,
} from '../shared/api';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapAutoFitProps = {
  bounds: LatLngBounds | null;
};

function MapAutoFit({ bounds }: MapAutoFitProps) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 6,
    });
  }, [bounds, map]);

  return null;
}

export function TravelMapPage() {
  const [cities, setCities] = useState<TravelMapCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('all');

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

  const trips = Array.from(
    new Map(cities.map((city) => [city.trip.id, city.trip])).values()
  );
  
  const visibleCities =
    selectedTripId === 'all'
      ? cities
      : cities.filter((city) => city.trip.id === selectedTripId);

      const bounds =
      visibleCities.length > 0
        ? new LatLngBounds(
            visibleCities.map((city) => [city.lat, city.lng] as [number, number])
          )
        : null;

    const routeLines = Object.values(
      visibleCities.reduce<Record<string, TravelMapCity[]>>((acc, city) => {
        if (!acc[city.trip.id]) {
          acc[city.trip.id] = [];
        }
    
        acc[city.trip.id].push(city);
    
        return acc;
      }, {})
    )
      .map((tripCities) =>
        tripCities
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((city) => [city.lat, city.lng] as [number, number])
      )
      .filter((positions) => positions.length >= 2);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Карта путешествий
      </Typography>

      <TextField
  select
  label="Показать маршрут"
  value={selectedTripId}
  onChange={(event) => setSelectedTripId(event.target.value)}
  sx={{ mb: 2, minWidth: 280 }}
>
  <MenuItem value="all">Все поездки</MenuItem>

  {trips.map((trip) => (
    <MenuItem key={trip.id} value={trip.id}>
      {trip.title}
    </MenuItem>
  ))}
</TextField>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : cities.length ? (
<MapContainer
  bounds={bounds ?? undefined}
  boundsOptions={{
    padding: [60, 60],
    maxZoom: 6,
  }}
  style={{ height: '70vh', width: '100%' }}
>
<MapAutoFit bounds={bounds} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

{selectedTripId !== 'all' &&
  routeLines.map((positions, index) => (
    <Polyline key={index} positions={positions} />
  ))}

          {visibleCities.map((city) => (
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
