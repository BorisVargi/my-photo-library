import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography } from '@mui/material';
import { createTrip } from '../shared/api';
import { TripForm, type TripFormValues } from '../features/trips/TripForm';

export function CreateTripPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: TripFormValues) {
    const data = await createTrip(values);

    navigate(`/trips/${data.trip.id}`);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Новая поездка
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TripForm submitText="Создать поездку" onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
}

