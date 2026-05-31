import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deletePhoto, getTripById, setPhotoAsCover } from '../shared/api';
import type { Trip } from '../shared/api';
import type {Photo} from '../shared/api';
import { PhotoGrid } from '../features/photos/PhotoGrid';
import { PhotoLightbox } from '../features/photos/PhotoLightbox';
import { EditPhotoDialog } from '../features/photos/EditPhotoDialog';
import { PhotoUploadForm } from '../features/photos/PhotoUploadForm';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';
import { Link as RouterLink } from 'react-router-dom';

const VISIBILITY_LABELS: Record<Trip['visibility'], string> = {
  private: 'Приватная',
  unlisted: 'По ссылке',
  public: 'Публичная',
};

const STATUS_LABELS: Record<Trip['status'], string> = {
  draft: 'Черновик',
  published: 'Опубликована',
};

function formatJournalDate(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTripDateRange(trip: Trip): string | null {
  const start = formatJournalDate(trip.startDate);
  const end = formatJournalDate(trip.endDate);

  if (start && end) {
    return `${start} — ${end}`;
  }

  if (start) {
    return start;
  }

  if (end) {
    return end;
  }

  return formatJournalDate(trip.date);
}

export function TripPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePhotoCreated = (photo: Photo) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await deletePhoto(photoId);

      setPhotos((prev) => {
        const next = prev.filter((photo) => photo.id !== photoId);

        if (lightboxOpen) {
          if (next.length === 0) {
            setLightboxOpen(false);
            setLightboxIndex(0);
          } else {
            setLightboxIndex((current) =>
              Math.min(current, next.length - 1),
            );
          }
        }

        return next;
      });

      setCoverPhoto((current) =>
        current?.id === photoId ? null : current,
      );
    } catch (error) {
      console.error('Failed to delete photo', error);
    }
  };

  const handlePhotoClick = (_photo: Photo, index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePhotoSaved = (updatedPhoto: Photo) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === updatedPhoto.id ? updatedPhoto : photo,
      ),
    );

    setCoverPhoto((current) =>
      current?.id === updatedPhoto.id ? updatedPhoto : current,
    );

    setEditingPhoto(null);
  };

  const handleSetCover = async (photoId: string) => {
    try {
      const data = await setPhotoAsCover(photoId);
  
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === data.photo.id
            ? { ...photo, isCover: true }
            : { ...photo, isCover: false }
        )
      );
  
      setCoverPhoto(data.photo);
    } catch (error) {
      console.error('Failed to set cover photo', error);
    }
  };
  
  useEffect(() => {
    if (!id) {
      return;
    }

    getTripById(id)
      .then(async (data) => {
        setTrip(data.trip);

        const coverPhoto = data.trip.photos?.find((photo) => photo.isCover) ?? null;
        setCoverPhoto(coverPhoto);
      
        setPhotos(data.trip.photos ?? []);
      })
      .catch(() => {
        setError('Поездка не найдена');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const hasCover = Boolean(coverPhoto?.url);

  return (
    <Page title="Поездка">
      {!id && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не указан id поездки
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
          {hasCover && (
            <Box
              component="img"
              src={coverPhoto!.url}
              alt={trip.title}
              sx={{
                display: 'block',
                width: '100%',
                height: 260,
                objectFit: 'cover',
                borderRadius: 3,
                mb: 3,
              }}
            />
          )}

          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          > */}
          <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: 2,
    mb: 3,
  }}
>
  <Box>
    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
      {trip.title}
    </Typography>

    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip size="small" label={VISIBILITY_LABELS[trip.visibility]} />
      <Chip
        size="small"
        label={STATUS_LABELS[trip.status]}
        variant="outlined"
      />
    </Box>
  </Box>

  <Button
    component={RouterLink}
    to={`/trips/${trip.id}/edit`}
    variant="outlined"
    sx={{ flexShrink: 0 }}
  >
    Редактировать
  </Button>
</Box>

<Box sx={{ mb: 4, maxWidth: 820 }}>
  {trip.country && (
    <Typography variant="h5" component="p" sx={{ fontWeight: 700, mb: 1 }}>
      {trip.country}
    </Typography>
  )}

  {trip.routeSummary && (
    <Typography
      variant="h6"
      component="p"
      color="text.secondary"
      sx={{ mb: 1.5, lineHeight: 1.5 }}
    >
      📍 {trip.routeSummary}
    </Typography>
  )}

  {formatTripDateRange(trip) && (
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      🗓 {formatTripDateRange(trip)}
    </Typography>
  )}

  {trip.description && (
    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
      {trip.description}
    </Typography>
  )}
</Box>

<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  }}
>
  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
    Фотографии
  </Typography>
</Box>  

          <Accordion sx={{ mb: 3 }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">
      Загрузить фотографии
    </Typography>
  </AccordionSummary>

  <AccordionDetails>
    <PhotoUploadForm tripId={trip.id} existingPhotos={photos} onCreated={handlePhotoCreated} />
  </AccordionDetails>
</Accordion>

          <PhotoGrid
            photos={photos}
            onPhotoClick={handlePhotoClick}
            onSetCover={handleSetCover}
            onDelete={handleDeletePhoto}
            onEdit={setEditingPhoto}
          />

          <PhotoLightbox
            photos={photos}
            currentIndex={lightboxIndex}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={setLightboxIndex}
            onSetCover={handleSetCover}
            onDelete={handleDeletePhoto}
            onEdit={(photo) => {
              setEditingPhoto(photo);
            }}
          />

          {editingPhoto && (
            <EditPhotoDialog
              photo={editingPhoto}
              open
              onClose={() => setEditingPhoto(null)}
              onSaved={handlePhotoSaved}
            />
          )}
        </Box>
          )}
    </Page>
  )
}

