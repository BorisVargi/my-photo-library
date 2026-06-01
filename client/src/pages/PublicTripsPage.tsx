import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Typography, Chip } from '@mui/material';
import { getPublicTrips } from '../shared/api';
import type { Trip } from '../shared/api';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';
import { TripCard } from '../features/trips/TripCard';

export function PublicTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupBy, setGroupBy] = useState<'all' | 'country' | 'year'>('all');

  useEffect(() => {
    getPublicTrips()
      .then((data) => {
        setTrips(data.trips);
      })
      .catch(() => {
        setError('Не удалось загрузить публичные поездки.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const groupedTrips = trips.reduce<Record<string, Trip[]>>((acc, trip) => {
    const key =
      groupBy === 'country'
        ? trip.country || 'Без страны'
        : trip.startDate
          ? new Date(trip.startDate).getFullYear().toString()
          : 'Без года';
  
    if (!acc[key]) {
      acc[key] = [];
    }
  
    acc[key].push(trip);
  
    return acc;
  }, {});

  return (
    <Page title="Публичные поездки" subtitle="Открытая витрина путешествий">
      {loading && <Loader />}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && trips.length === 0 && (
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Публичных поездок пока нет
          </Typography>
          <Typography color="text.secondary">
            Опубликованные поездки появятся здесь.
          </Typography>
        </Box>
      )}

      {!loading && !error && trips.length > 0 && (
        <>
<Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
  <Chip
    label="Все"
    clickable
    onClick={() => setGroupBy('all')}
    variant={groupBy === 'all' ? 'filled' : 'outlined'}
  />

  <Chip
    label="По странам"
    clickable
    onClick={() => setGroupBy('country')}
    variant={groupBy === 'country' ? 'filled' : 'outlined'}
  />

  <Chip
    label="По годам"
    clickable
    onClick={() => setGroupBy('year')}
    variant={groupBy === 'year' ? 'filled' : 'outlined'}
  />
</Box>



  {groupBy === 'all' ? (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <TripCard trip={trip} variant="public" />
        </Grid>
      ))}
    </Grid>
  ) : (Object.entries(groupedTrips).map(([groupName, groupTrips]) => (
    <Box key={groupName} sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {groupName} ({groupTrips.length})
      </Typography>

      <Grid container spacing={3}>
        {groupTrips.map((trip) => (
          <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <TripCard trip={trip} variant="public" />
          </Grid>
        ))}
      </Grid>
    </Box>
  ))
)}
</>
      )}
    </Page>
  );
}
