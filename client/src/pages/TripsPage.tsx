import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button, 
  Grid,
  Chip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTrips } from '../shared/api';
import type { Trip } from '../shared/api';
import { AppHeader } from '../components/AppHeader';
import { PhotoOfDay } from '../components/PhotoOfDay';
import { Page } from '../shared/ui/Page';
// import { Card as UiCard } from '../shared/ui/Card';
import { Loader } from '../shared/ui/Loader';
import { TripCard } from '../features/trips/TripCard';
import { Link as RouterLink} from 'react-router-dom';

export function TripsPage() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const countries = Array.from(
    new Set(trips.map((t) => t.country).filter(Boolean))
  );

  useEffect(() => {
    getTrips()
      .then((data) => {
        setTrips(data.trips);
      })
      .catch(() => {
        setError('Не удалось загрузить поездки. Возможно, нужно войти.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const filteredTrips = selectedCountry
  ? trips.filter((t) => t.country === selectedCountry)
  : trips;

  const sortedTrips = [...filteredTrips].sort((a, b) =>
    b.title.localeCompare(a.title)
  );

  return (
    <>
    <AppHeader onLogout={handleLogout} />

    <PhotoOfDay />

    <Page
      title="Поездки"
      subtitle="Личный архив маршрутов, заметок, фото и видео."
    >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
    <Button
      component={RouterLink}
      to="/trips/new"
      variant="contained"
    >
      Новая поездка
    </Button>
  </Box>
        {loading && <Loader />}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {!loading && !error && trips.length === 0 && (
  <Box sx={{ py: 4 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Пока нет поездок
    </Typography>
    <Typography color="text.secondary">
      Создай первую поездку, чтобы начать вести архив
    </Typography>
  </Box>
)}

<Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
  <Chip
    label={`Все (${trips.length})`}
    clickable
    onClick={() => setSelectedCountry(null)}
    variant={!selectedCountry ? 'filled' : 'outlined'}
  />

{countries.map((country) => {
  const count = trips.filter((t) => t.country === country).length;

  return (
    <Chip
      key={country}
      label={`${country} (${count})`}
      clickable
      onClick={() => setSelectedCountry(country)}
      variant={selectedCountry === country ? 'filled' : 'outlined'}
    />
  );
})}
</Box>

{/* {Object.entries(tripsByCountry).map(([country, countryTrips]) => (
  <Box key={country} sx={{ mb: 5 }}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
      {country} ({countryTrips.length})
    </Typography>

    <Grid container spacing={3}>
      {countryTrips.map((trip) => (
        <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <TripCard trip={trip} />
        </Grid>
      ))}
    </Grid>
  </Box>
))} */}

<Grid container spacing={3}>
  {sortedTrips.map((trip) => (
    <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <TripCard trip={trip} />
    </Grid>
  ))}
</Grid>

      </Page>
    </>
  );
}
