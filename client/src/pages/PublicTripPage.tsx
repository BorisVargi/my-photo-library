import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Typography } from '@mui/material';

import {
  getPublicTripBySlug,
} from '../shared/api';
import type { Photo, Trip } from '../shared/api';
import { PhotoGallery } from '../features/photos/PhotoGallery';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';

export function PublicTripPage() {
  const { slug } = useParams<{ slug: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      return;
    }

    getPublicTripBySlug(slug)
      .then(async (data) => {
        setTrip(data.trip);
        const coverPhoto = data.trip.photos?.find((photo) => photo.isCover) ?? null;
        setCoverPhoto(coverPhoto);
        
        setPhotos(data.trip.photos ?? []);
        // setPhotos(photosData.photos);
      })
      .catch(() => {
        setError('Поездка не найдена или недоступна');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <Page title="Публичная поездка">
      {!slug && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не указан адрес поездки
        </Alert>
      )}

      {loading && <Loader />}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && trip && (
        <Box>
          {coverPhoto?.url && (
            <Box
              component="img"
              src={coverPhoto.url}
              alt={trip.title}
              sx={{
                width: '100%',
                height: 260,
                objectFit: 'cover',
                borderRadius: 3,
                mb: 3,
              }}
            />
          )}

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {trip.title}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {trip.country} {trip.routeSummary ? `· ${trip.routeSummary}` : ''}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {trip.date}
          </Typography>

          <Typography>
            {trip.publicDescription || trip.description}
          </Typography>

          <PhotoGallery photos={photos} />
        </Box>
      )}
    </Page>
  );
}
