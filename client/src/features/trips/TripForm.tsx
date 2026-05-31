import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import type { Trip } from '../../shared/api';
import { buildTripFormSubmitValues } from './tripFormDates';

export type TripFormValues = {
  title: string;
  country: string;
  routeSummary: string;
  startDate: string;
  endDate: string;
  description: string;
  publicDescription: string;
  visibility: Trip['visibility'];
  status: Trip['status'];
};

type TripFormProps = {
  initialValues?: Partial<TripFormValues>;
  submitText: string;
  onSubmit: (values: TripFormValues) => Promise<void>;
};

const defaultValues: TripFormValues = {
  title: '',
  country: '',
  routeSummary: '',
  startDate: '',
  endDate: '',
  description: '',
  publicDescription: '',
  visibility: 'private',
  status: 'draft',
};

export function TripForm({
  initialValues,
  submitText,
  onSubmit,
}: TripFormProps) {
  const [values, setValues] = useState<TripFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof TripFormValues>(
    field: K,
    value: TripFormValues[K],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(buildTripFormSubmitValues(values));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось сохранить поездку. Проверь данные и попробуй ещё раз.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Название поездки"
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Страна"
          value={values.country}
          onChange={(event) => updateField('country', event.target.value)}
          fullWidth
        />

        <TextField
          label="Маршрут"
          value={values.routeSummary}
          onChange={(event) => updateField('routeSummary', event.target.value)}
          placeholder="Например: Madrid → Galicia → Bilbao"
          fullWidth
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Дата начала"
            type="date"
            value={values.startDate}
            onChange={(event) => updateField('startDate', event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
          />

          <TextField
            label="Дата окончания"
            type="date"
            value={values.endDate}
            onChange={(event) => updateField('endDate', event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
          />
        </Box>

        <TextField
          label="Внутреннее описание"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <TextField
          label="Публичное описание"
          value={values.publicDescription}
          onChange={(event) => updateField('publicDescription', event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            select
            label="Видимость"
            value={values.visibility}
            onChange={(event) =>
              updateField('visibility', event.target.value as Trip['visibility'])
            }
            fullWidth
          >
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="unlisted">Unlisted</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </TextField>

          <TextField
            select
            label="Статус"
            value={values.status}
            onChange={(event) =>
              updateField('status', event.target.value as Trip['status'])
            }
            fullWidth
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Сохраняем...' : submitText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
