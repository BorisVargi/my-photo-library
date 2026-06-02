import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deletePhoto, getTripById, deleteTrip, setPhotoAsCover } from '../shared/api';
import type { Trip } from '../shared/api';
import type {Photo} from '../shared/api';
import { PhotoGrid } from '../features/photos/PhotoGrid';
import { PhotoLightbox } from '../features/photos/PhotoLightbox';
import { EditPhotoDialog } from '../features/photos/EditPhotoDialog';
import { PhotoUploadForm } from '../features/photos/PhotoUploadForm';
import { Page } from '../shared/ui/Page';
import { Loader } from '../shared/ui/Loader';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TripCitiesManager } from '../features/travel-map/TripCitiesManager';

const VISIBILITY_LABELS: Record<Trip['visibility'], string> = {
  private: 'Приватная',
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
  })  
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
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

  const handleDeleteTrip = async () => {
    if (!trip) {
      return;
    }
  
    const confirmed = window.confirm(
      'Удалить поездку и все её фотографии? Это действие нельзя отменить.',
    );
  
    if (!confirmed) {
      return;
    }
  
    try {
      await deleteTrip(trip.id);
  
      navigate('/trips');
    } catch (error) {
      console.error('Failed to delete trip', error);
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

  if (!id) {
    return (
      <Page>
        <Alert severity="error">Не указан id поездки</Alert>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page>
        <Loader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert severity="error">{error}</Alert>
      </Page>
    );
  }

  if (!trip) {
    return (
      <Page>
        <Alert severity="warning">Поездка не найдена</Alert>
      </Page>
    );
  }

  const hasCover = Boolean(coverPhoto?.url);
  const description =
  trip.description || trip.publicDescription || 'Описание этой поездки пока не добавлено.';
const tripDates = formatTripDateRange(trip);
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
          mb: 3,
          backgroundImage: hasCover
            ? `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.65)), url(${coverPhoto!.url})`
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
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ maxWidth: 900 }}>
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

              {tripDates && (
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 20 },
                    opacity: 0.9,
                    mb: 1,
                  }}
                >
                  🗓 {tripDates}
                </Typography>
              )}

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
            </Box>

            <Box
  sx={{
    display: 'flex',
    gap: 1,
    flexShrink: 0,
    flexWrap: 'wrap',
  }}
>
  <Button
    component={RouterLink}
    to={`/trips/${trip.id}/edit`}
    variant="contained"
    sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      color: 'text.primary',
      '&:hover': {
        backgroundColor: 'common.white',
      },
    }}
  >
    Редактировать
  </Button>

  {trip.visibility === 'public' && (
  <Button
    component={RouterLink}
    to={`/public-trips/${trip.slug}`}
    variant="outlined"
    sx={{
      borderColor: 'rgba(255, 255, 255, 0.7)',
      color: 'common.white',
      '&:hover': {
        borderColor: 'common.white',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
      },
    }}
  >
    Открыть поездку
  </Button>
)}

  <Button
    variant="outlined"
    color="error"
    onClick={handleDeleteTrip}
    sx={{
      borderColor: 'rgba(255, 255, 255, 0.7)',
      color: 'common.white',
      '&:hover': {
        borderColor: 'common.white',
        backgroundColor: 'rgba(211, 47, 47, 0.18)',
      },
    }}
  >
    Удалить
  </Button>
</Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Chip size="small" label={VISIBILITY_LABELS[trip.visibility]} />
        <Chip
          size="small"
          label={STATUS_LABELS[trip.status]}
          variant="outlined"
        />
      </Box>

      {!hasCover && photos.length > 0 && (
  <Alert
    severity="info"
    sx={{ mb: 3 }}
    action={
      <Button color="inherit" size="small" onClick={scrollToGallery}>
        Выбрать обложку
      </Button>
    }
  >
    У поездки нет обложки. Выберите одну из фотографий как обложку поездки.
  </Alert>
)}

{trip.status === 'published' && photos.length === 0 && (
  <Alert severity="warning" sx={{ mb: 3 }}>
    Поездка опубликована, но в ней пока нет фотографий.
  </Alert>
)}

{/* {trip.status === 'published' && !hasCover && photos.length > 0 && (
  <Alert severity="warning" sx={{ mb: 3 }}>
    Поездка опубликована, но у неё нет обложки.
  </Alert>
)} */}

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

      <Box ref={galleryRef} sx={{ mb: 2 }}>
  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
    Фотографии
  </Typography>
</Box>

      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Загрузить фотографии</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <PhotoUploadForm
            tripId={trip.id}
            existingPhotos={photos}
            onCreated={handlePhotoCreated}
          />
        </AccordionDetails>
      </Accordion>

      <PhotoGrid
        photos={photos}
        onPhotoClick={handlePhotoClick}
        onSetCover={handleSetCover}
        onDelete={handleDeletePhoto}
        onEdit={setEditingPhoto}
      />

      <TripCitiesManager tripId={trip.id} />

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
  </Page>
);
}

