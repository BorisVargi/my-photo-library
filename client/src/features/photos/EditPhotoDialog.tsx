import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { updatePhoto } from '../../shared/api';
import type { Photo, UpdatePhotoPayload } from '../../shared/api';

type EditPhotoDialogProps = {
  photo: Photo;
  open: boolean;
  onClose: () => void;
  onSaved: (photo: Photo) => void;
};

function formatDateForInput(value?: string): string {
  if (!value) {
    return '';
  }

  return value.slice(0, 10);
}

export function EditPhotoDialog({
  photo,
  open,
  onClose,
  onSaved,
}: EditPhotoDialogProps) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<Photo['visibility']>('private');
  const [takenAt, setTakenAt] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(photo.title ?? '');
    setCaption(photo.caption ?? '');
    setVisibility(photo.visibility);
    setTakenAt(formatDateForInput(photo.takenAt));
    setError('');
  }, [open, photo]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload: UpdatePhotoPayload = {
      title: title.trim() || undefined,
      caption: caption.trim() || undefined,
      visibility,
      takenAt: takenAt ? new Date(takenAt).toISOString() : undefined,
    };

    try {
      await updatePhoto(photo.id, payload);

      onSaved({
        ...photo,
        ...payload,
      });
    } catch {
      setError('Не удалось сохранить изменения.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редактировать фото</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Название"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
          />

          <TextField
            label="Подпись"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <TextField
            select
            label="Видимость"
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as Photo['visibility'])
            }
            fullWidth
          >
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </TextField>

          <TextField
            label="Дата съёмки"
            type="date"
            value={takenAt}
            onChange={(event) => setTakenAt(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
