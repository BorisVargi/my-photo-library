import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { getTrips } from '../shared/api';
import type { Trip } from '../shared/api';
import { AppHeader } from '../components/AppHeader';
import { PhotoOfDay } from '../components/PhotoOfDay';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';
import { TripCard } from '../features/trips/TripCard';

type GroupBy = 'all' | 'country' | 'year';

export function TripsPage() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('all');

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

  function getTripYear(trip: Trip): string {
    const sourceDate = trip.startDate || trip.date;

    if (!sourceDate) {
      return 'Без года';
    }

    const year = new Date(sourceDate).getFullYear();

    if (Number.isNaN(year)) {
      return 'Без года';
    }

    return String(year);
  }

  function getTripCountry(trip: Trip): string {
    return trip.country || 'Без страны';
  }

  function sortTripsByDateDesc(a: Trip, b: Trip) {
    const firstDate = new Date(a.startDate || a.date || '').getTime();
    const secondDate = new Date(b.startDate || b.date || '').getTime();

    return secondDate - firstDate;
  }

  function groupTrips(tripsToGroup: Trip[]) {
    const grouped = new Map<string, Trip[]>();

    tripsToGroup.forEach((trip) => {
      const groupKey =
        groupBy === 'country' ? getTripCountry(trip) : getTripYear(trip);

      const currentTrips = grouped.get(groupKey) ?? [];
      grouped.set(groupKey, [...currentTrips, trip]);
    });

    return Array.from(grouped.entries())
      .map(([title, groupTrips]) => ({
        title,
        trips: [...groupTrips].sort(sortTripsByDateDesc),
      }))
      .sort((a, b) => {
        if (groupBy === 'year') {
          return b.title.localeCompare(a.title);
        }

        return a.title.localeCompare(b.title, 'ru');
      });
  }

  const sortedTrips = [...trips].sort(sortTripsByDateDesc);
  const tripGroups = groupTrips(trips);

  return (
    <>
      <AppHeader onLogout={handleLogout} />

      <PhotoOfDay />

      <Page
        title="Поездки"
        subtitle="Личный архив маршрутов, заметок, фото и видео."
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button component={RouterLink} to="/trips/new" variant="contained">
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

        {!loading && !error && trips.length > 0 && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
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
                {sortedTrips.map((trip) => (
                  <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <TripCard trip={trip} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'grid', gap: 5 }}>
                {tripGroups.map((group) => (
                  <Box key={group.title}>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {group.title} ({group.trips.length})
                    </Typography>

                    <Grid container spacing={3}>
                      {group.trips.map((trip) => (
                        <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
                          <TripCard trip={trip} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Page>
    </>
  );
}
