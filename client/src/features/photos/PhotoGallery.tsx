import { Box, Button, Chip, Typography } from '@mui/material';

import type { Photo } from '../../shared/api';
import { Card } from '../../shared/ui/Card';

type PhotoGalleryProps = {
  photos: Photo[];
  onSetCover?: (photoId: string) => void;
  showCoverAction?: boolean;
};

export function PhotoGallery({
  photos,
  onSetCover,
  showCoverAction = false,
}: PhotoGalleryProps) {
  if (!photos.length) {
    return (
      <Typography color="text.secondary" sx={{ mt: 3 }}>
        Фотографий пока нет
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {photos.map((photo) => (
        <Card key={photo.id}>
          <Box
            sx={{
              position: 'relative',
              '&:hover .overlay': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={photo.thumbnailUrl || photo.url}
              alt={photo.title || photo.caption || 'Photo'}
              sx={{
                display:'block',
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 1.5,
              }}
            />
            {showCoverAction && photo.isCover !== true && (
              <Box
                className="overlay"
                onClick={() => onSetCover?.(photo.id)}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Сделать обложкой</Typography>
              </Box>
            )}
          </Box>

          {(photo.title || photo.caption) && (
            <Typography sx={{ mb: 1 }}>
              {photo.title || photo.caption}
            </Typography>
          )}

          {showCoverAction && photo.isCover !== true && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onSetCover?.(photo.id)}
              sx={{ mb: 1, display: { xs: 'inline-flex', sm: 'none' } }}
            >
              Сделать обложкой
            </Button>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {photo.isCover === true && (
              <Chip size="small" label="Обложка" />
            )}
            <Chip size="small" label={photo.visibility} />
          </Box>
        </Card>
      ))}
    </Box>
  );
}
