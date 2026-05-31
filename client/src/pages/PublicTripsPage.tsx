import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { getPublicTrips } from '../shared/api';
import type { Trip } from '../shared/api';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';
import { TripCard } from '../features/trips/TripCard';

export function PublicTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <Page title="Публичные поездки" subtitle="Открытая витрина путешествий сообщества.">
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
        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <TripCard trip={trip} variant="public" />
            </Grid>
          ))}
        </Grid>
      )}
    </Page>
  );
}
