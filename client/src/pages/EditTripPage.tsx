import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import {
  getTripById,
  updateTrip,
  type Trip,
} from '../shared/api';
import { TripForm, type TripFormValues } from '../features/trips/TripForm';
import { normalizeDateForInput } from '../features/trips/tripFormDates';

export function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTrip() {
      if (!id) {
        return;
      }

      try {
        const data = await getTripById(id);

        setTrip(data.trip);
      } catch {
        setError('Не удалось загрузить поездку.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTrip();
  }, [id]);

  async function handleSubmit(values: TripFormValues) {
    if (!id) {
      return;
    }

    await updateTrip(id, values);

    navigate(`/trips/${id}`);
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <CircularProgress />
      </Container>
    );
  }

  if (error || !trip) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          {error || 'Поездка не найдена.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Редактирование поездки
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TripForm
          submitText="Сохранить изменения"
          initialValues={{
            title: trip.title,
            country: trip.country ?? '',
            routeSummary: trip.routeSummary ?? '',
            startDate: normalizeDateForInput(trip.startDate),
            endDate: normalizeDateForInput(trip.endDate),
            description: trip.description ?? '',
            publicDescription: trip.publicDescription ?? '',
            visibility: trip.visibility,
            status: trip.status,
          }}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Container>
  );
}
