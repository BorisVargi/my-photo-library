import { useState } from 'react';
// import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  // Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { login } from '../shared/api';
import { AppButton } from '../shared/ui/AppButton';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event:  React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль.');
      return;
    }
    setLoading(true)

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/trips');
    } catch {
      setError('Не удалось войти. Проверь email и пароль.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box 
      sx={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%',
            maxWidth: 420,
            border: '1 px solid',
            borderColor: 'divider',
            boxShadow: '0 12px 32px rgba(0,0,0,0.06'
            }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1}}>
            Вход
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Войди как admin, чтобы открыть личную библиотеку путешествий.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          >
            <TextField
              label="Email"
              type='email'
              fullWidth
              autoFocus
              // margin="normal"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />


            <TextField
              label="Password"
              type="password"
              fullWidth
              // margin="normal"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {/* <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Войти
            </Button> */}
            <AppButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
</AppButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
