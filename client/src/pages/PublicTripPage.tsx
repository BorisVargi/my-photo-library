import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Paper, Typography } from '@mui/material';

import { getPublicTripBySlug } from '../shared/api';
import type { Photo, Trip } from '../shared/api';
import { PhotoGallery } from '../features/photos/PhotoGallery';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';

export function PublicTripPage() {
  const { slug } = useParams<{ slug: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  // const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      // setError('Не указан адрес поездки');
      return;
    }
  
    // setError('');
  
    getPublicTripBySlug(slug)
      .then((data) => {
        const publicPhotos = data.trip.photos ?? [];
        const tripCoverPhoto = publicPhotos.find((photo) => photo.isCover) ?? null;
  
        setTrip(data.trip);
        setCoverPhoto(tripCoverPhoto);
        setPhotos(publicPhotos);
      })
      .catch(() => {
        setError('Поездка не найдена или недоступна');
      });
  }, [slug]);

  if (!slug) {
    return (
      <Page title="Публичная поездка">
        <Alert severity="error">
          Не указан адрес поездки
        </Alert>
      </Page>
    );
  }

  if (!trip && !error) {
    return (
      <Page title="Публичная поездка">
        <Loader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Публичная поездка">
        <Alert severity="error">{error}</Alert>
      </Page>
    );
  }

  if (!trip) {
    return (
      <Page title="Публичная поездка">
        <Alert severity="warning">Поездка не найдена</Alert>
      </Page>
    );
  }

  const description =
    trip.publicDescription || trip.description || 'Описание этой поездки пока не добавлено.';

    const tripDates =
    trip.startDate && trip.endDate
      ? `${new Date(trip.startDate).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} — ${new Date(trip.endDate).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`
      : trip.date;
  
  const photosCountText = `${photos.length} фото`;
  const coverBackgroundPosition =
  trip.coverPosition === 'top'
    ? 'center top'
    : trip.coverPosition === 'bottom'
      ? 'center bottom'
      : 'center';
      
  return (
    <Page>
      <Box>
        <Paper
          sx={{
            position: 'relative',
            minHeight: { xs: 360, md: 460 },
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            backgroundImage: coverPhoto?.url
              ? `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.65)), url(${coverPhoto.url})`
              : 'linear-gradient(135deg, #263238, #607d8b)',
            backgroundSize: 'cover',
            backgroundPosition: coverBackgroundPosition,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              color: 'common.white',
              maxWidth: 900,
            }}
          >
            {/* <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {trip.country && (
                <Chip
                  label={trip.country}
                  sx={{
                    color: 'common.white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              )}

              {trip.routeSummary && (
                <Chip
                  label={trip.routeSummary}
                  sx={{
                    color: 'common.white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              )}
            </Box> */}

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 36, md: 56 },
                lineHeight: 1.05,
                mb: 2,
              }}
            >
              {trip.title}
            </Typography>

            <Typography
  sx={{
    fontSize: { xs: 16, md: 20 },
    opacity: 0.9,
    mb: 1,
  }}
>
  {tripDates}
</Typography>

{trip.routeSummary && (
  <Typography
    sx={{
      fontSize: { xs: 16, md: 20 },
      opacity: 0.9,
      mb: 1,
    }}
  >
    📍 {trip.routeSummary}
  </Typography>
)}

<Typography
  sx={{
    fontSize: { xs: 15, md: 18 },
    opacity: 0.85,
  }}
>
  📷 {photosCountText}
</Typography>

            {/* <Typography
              sx={{
                fontSize: { xs: 16, md: 20 },
                opacity: 0.9,
              }}
            >
              {trip.startDate && trip.endDate
                ? `${trip.startDate} — ${trip.endDate}`
                : trip.date}
            </Typography> */}
          </Box>
        </Paper>

        <Box sx={{ maxWidth: 900, mb: 5 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            О поездке
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 18,
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Фото
          </Typography>

          {photos.length > 0 ? (
            <PhotoGallery photos={photos} />
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                backgroundColor: 'background.default',
              }}
            >
              <Typography color="text.secondary">
                В этой публичной поездке пока нет опубликованных фото.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Page>
  );
}
