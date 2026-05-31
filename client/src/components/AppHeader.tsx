import { Box, Button, Typography } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

type AppHeaderProps = {
  onLogout: () => void;
};

export function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 3,
        mb: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 0,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 32, md: 48 },
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          Моя история
        </Typography>

        <Box
          sx={{
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 3,
            flexShrink: 0,
          }}
        >
          <TravelExploreIcon />
        </Box>

        <Typography
          component="span"
          sx={{
            fontSize: { xs: 32, md: 48 },
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          путешествий
        </Typography>
      </Box>

      <Button variant="outlined" onClick={onLogout} sx={{ flexShrink: 0 }}>
        Выйти
      </Button>
    </Box>
  );
}
