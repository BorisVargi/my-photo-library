// src/app/layouts/MainLayout.tsx
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6">Travel Book</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
