import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  createTripCity,
  deleteTripCity,
  getTripCities,
  type TripCity,
} from '../../shared/api';

type TripCitiesManagerProps = {
  tripId: string;
};

export function TripCitiesManager({ tripId }: TripCitiesManagerProps) {
  const [cities, setCities] = useState<TripCity[]>([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadCities() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getTripCities(tripId);

        if (!ignore) {
          setCities(data.cities);
        }
      } catch {
        if (!ignore) {
          setError('Не удалось загрузить города поездки');
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
  }, [tripId]);

  async function handleAddCity() {
    const trimmedName = name.trim();
    const trimmedCountry = country.trim();
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!trimmedName) {
      setError('Укажи название города');
      return;
    }

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      setError('Координаты должны быть числами');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      const data = await createTripCity(tripId, {
        name: trimmedName,
        country: trimmedCountry || null,
        lat: parsedLat,
        lng: parsedLng,
      });

      setCities((currentCities) => [...currentCities, data.city]);
      setName('');
      setCountry('');
      setLat('');
      setLng('');
    } catch {
      setError('Не удалось добавить город');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCity(cityId: string) {
    try {
      setError('');

      await deleteTripCity(cityId);

      setCities((currentCities) =>
        currentCities.filter((city) => city.id !== cityId)
      );
    } catch {
      setError('Не удалось удалить город');
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Города поездки
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Эти города будут отображаться булавками на карте путешествий.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Город"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />

        <TextField
          label="Страна"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          fullWidth
        />

        <TextField
          label="Широта"
          value={lat}
          onChange={(event) => setLat(event.target.value)}
          fullWidth
          placeholder="41.9028"
        />

        <TextField
          label="Долгота"
          value={lng}
          onChange={(event) => setLng(event.target.value)}
          fullWidth
          placeholder="12.4964"
        />

        <Button
          variant="contained"
          onClick={handleAddCity}
          disabled={isSaving}
          sx={{ minWidth: 140 }}
        >
          Добавить
        </Button>
      </Stack>

      {isLoading ? (
        <CircularProgress size={24} />
      ) : cities.length ? (
        <Stack spacing={1}>
          {cities.map((city) => (
            <Box
              key={city.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box>
              <Typography sx={{ fontWeight: 600 }}>
                {city.name}
                {city.country && `, ${city.country}`}
</Typography>

                <Typography variant="body2" color="text.secondary">
                  {city.lat}, {city.lng}
                </Typography>
              </Box>

              <Button color="error" onClick={() => handleDeleteCity(city.id)}>
                Удалить
              </Button>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          Города пока не добавлены.
        </Typography>
      )}
    </Box>
  );
}
