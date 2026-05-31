import {
  Box,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import type { Photo } from '../../shared/api';

type PhotoGridProps = {
  photos: Photo[];
  onPhotoClick?: (photo: Photo, index: number) => void;
  onSetCover?: (photoId: string) => Promise<void>;
  onDelete?: (photoId: string) => Promise<void>;
  onEdit?: (photo: Photo) => void;
};

export function PhotoGrid({
  photos,
  onPhotoClick,
  onSetCover,
  onDelete,
  onEdit,
}: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Пока нет фотографий
        </Typography>

        <Typography color="text.secondary">
          Добавь первые фото в поездку
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)',
        },
        gap: 1,
      }}
    >
      {photos.map((photo, index) => (
        <Box
          key={photo.id}
          onClick={() => onPhotoClick?.(photo, index)}
          sx={{
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'grey.100',
            cursor: onPhotoClick ? 'pointer' : 'default',
            '&:hover .photo-actions': {
              opacity: 1,
            },
            '@media (hover: none)': {
              '& .photo-actions': {
                opacity: 1,
              },
            },
          }}
        >
          <Box
            component="img"
            src={photo.thumbnailUrl || photo.url}
            loading = 'lazy'
            alt={photo.title ?? 'Photo'}
            sx={{
              display: 'block',
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
            }}
          />

          {photo.isCover && (
            <Chip
              label="Обложка"
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 6,
                left: 6,
                height: 22,
                fontSize: '0.7rem',
              }}
            />
          )}

          <Box
            className="photo-actions"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
              p: 0.75,
              bgcolor: 'rgba(0, 0, 0, 0.55)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
            }}
          >
            {onEdit && (
              <Button
                size="small"
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: 'common.white',
                  fontSize: '0.75rem',
                  pointerEvents: 'auto',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(photo);
                }}
              >
                Редактировать
              </Button>
            )}

            {!photo.isCover && onSetCover && (
              <Button
                size="small"
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: 'common.white',
                  fontSize: '0.75rem',
                  pointerEvents: 'auto',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  void onSetCover(photo.id);
                }}
              >
                Обложка
              </Button>
            )}

            {onDelete && (
              <Button
                size="small"
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: 'error.light',
                  fontSize: '0.75rem',
                  pointerEvents: 'auto',
                }}
                onClick={async (event) => {
                  event.stopPropagation();

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
      ))}
    </Box>
  );
}
