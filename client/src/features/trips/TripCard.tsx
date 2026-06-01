import { Box, Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../shared/ui/Card';
import type { Trip } from '../../shared/api';
import { formatTripDateRange} from './TripDates';

type TripCardProps = {
  trip: Trip;
  variant?: 'private' | 'public';
};

export function TripCard({ trip, variant = 'private' }: TripCardProps) {
  const navigate = useNavigate();
  const coverPhoto = trip.photos?.[0];
  const cardCoverSrc = coverPhoto?.thumbnailUrl || coverPhoto?.url;
  const photosCount = trip._count?.photos ?? trip.photos?.length ?? 0;

  const tripUrl =
    variant === 'public'
      ? `/public-trips/${trip.slug}`
      : `/trips/${trip.id}`;

  function handleClick() {
    navigate(tripUrl);
  }
  const visibilityMap: Record<string, string> = {
    private: 'Приватная',
    public: 'Публичная',
  };
  
  const statusMap: Record<string, string> = {
    draft: 'Черновик',
    published: 'Опубликована',
  };
  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        '&:hover .overlay': {
        bgcolor: 'rgba(0,0,0,0.06)'},
        '&:hover .cover-text': {
        color: 'text.primary',
},
      }}
    >
<Box
  sx={{
    position: 'relative',
    height: 140,
    borderRadius: 2,
    bgcolor: 'action.hover',
    mb: 3,
    overflow: 'hidden',
  }}
>
{cardCoverSrc && (
  <Box
    component="img"
    src={cardCoverSrc}
    alt={trip.title}
    sx={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    }}
  />
)}

<Box
  className="overlay"
  sx={{
    position: 'absolute',
    inset: 0,
    bgcolor: cardCoverSrc ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)',
    transition: 'background 0.2s ease',
  }}
/>

{!cardCoverSrc && (
  <Box
    className="cover-text"
    sx={{
      fontWeight: 500,
      letterSpacing: 1,
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.disabled',
      transition: 'color 0.2s ease',
      fontSize: 14,
    }}
  >
    ОБЛОЖКА
  </Box>
)}
</Box>
      
{variant === 'private' && (
  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
    <Chip
      size="small"
      label={visibilityMap[trip.visibility] || trip.visibility}
    />
    <Chip
      size="small"
      label={statusMap[trip.status] || trip.status}
      variant="outlined"
    />
  </Box>
)}

      <Typography variant="overline" color="text.secondary">
  {trip.country || 'Без страны'}
</Typography>

<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
  {trip.title}
</Typography>


{formatTripDateRange(trip) && (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
    {formatTripDateRange(trip)}
  </Typography>
)}

<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
  📷 {photosCount} фото
</Typography>

      {trip.description && (
        <Typography variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {trip.description}
        </Typography>
      )}

      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Button
        size="small" 
        sx={{ textTransform: 'none' }}
        onClick={(e) =>{
          e.stopPropagation();
          navigate(tripUrl)
        }}
        >
          Открыть поездку
        </Button>
      </Box>
    </Card>
  );
}
