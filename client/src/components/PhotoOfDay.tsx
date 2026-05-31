import { Box, Paper, Typography } from '@mui/material';

export function PhotoOfDay() {
  return (
    <Paper
      sx={{
        mb: 5,
        overflow: 'hidden',
        borderRadius: 4,
        minHeight: 260,
        background:
          'linear-gradient(135deg, rgba(25,118,210,0.18), rgba(156,39,176,0.16))',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="overline" color="primary">
          Фото дня
        </Typography>

        <Typography variant="h4" gutterBottom>
          Здесь будет случайное фото из твоей библиотеки
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          Позже мы подключим сюда backend: он будет выбирать случайное фото из
          базы и показывать его при открытии страницы.
        </Typography>
      </Box>

      <Box
        sx={{
          width: { xs: 0, md: 320 },
          display: { xs: 'none', md: 'block' },
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), transparent 28%), radial-gradient(circle at 70% 70%, rgba(25,118,210,0.35), transparent 32%)',
        }}
      />
    </Paper>
  );
}
