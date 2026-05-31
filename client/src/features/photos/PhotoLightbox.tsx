import { useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Photo } from '../../shared/api';

type PhotoLightboxProps = {
  photos: Photo[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onSetCover?: (photoId: string) => Promise<void>;
  onEdit?: (photo: Photo) => void;
  onDelete?: (photoId: string) => Promise<void>;
};

function formatTakenAt(value?: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export function PhotoLightbox({
  photos,
  currentIndex,
  open,
  onClose,
  onIndexChange,
  onSetCover,
  onEdit,
  onDelete,
}: PhotoLightboxProps) {
  const photo = photos[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrevious) {
        onIndexChange(currentIndex - 1);
        return;
      }

      if (event.key === 'ArrowRight' && hasNext) {
        onIndexChange(currentIndex + 1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentIndex, hasPrevious, hasNext, onClose, onIndexChange]);

  if (!photo) {
    return null;
  }

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {photos.length}
          </Typography>

          <IconButton onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            overflow: 'hidden',
            bgcolor: 'grey.900',
            px: 2,
          }}
        >
          {hasPrevious && (
            <IconButton
              onClick={() => onIndexChange(currentIndex - 1)}
              sx={{
                position: 'absolute',
                left: 16,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              }}
              aria-label="Предыдущее фото"
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={photo.url}
              alt={photo.title ?? 'Photo'}
              sx={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>

          {hasNext && (
            <IconButton
              onClick={() => onIndexChange(currentIndex + 1)}
              sx={{
                position: 'absolute',
                right: 16,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              }}
              aria-label="Следующее фото"
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h6">
              {photo.title || 'Без названия'}
            </Typography>

            {photo.isCover && (
              <Chip label="Обложка" size="small" color="primary" />
            )}
          </Box>

          {photo.caption && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              {photo.caption}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Видимость: {photo.visibility}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Дата съёмки: {formatTakenAt(photo.takenAt)}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {onEdit && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onEdit(photo)}
              >
                Редактировать
              </Button>
            )}

            {!photo.isCover && onSetCover && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onSetCover(photo.id)}
              >
                Сделать обложкой
              </Button>
            )}

            {onDelete && (
              <Button
                size="small"
                color="error"
                onClick={async () => {
                  if (!window.confirm('Удалить фото?')) {
                    return;
                  }

                  await onDelete(photo.id);
                }}
              >
                Удалить
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
