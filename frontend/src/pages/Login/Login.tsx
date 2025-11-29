// Ubicación: src/components/auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../../types/types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validación básica: email y contraseña no vacíos y formato simple
    const basicEmailRegex = /\S+@\S+\.\S+/;
    if (!basicEmailRegex.test(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (!formData.password) {
      setError('Por favor ingresa la contraseña');
      return;
    }

    try {
      await login(formData);
      // Si el login fue exitoso, redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  backgroundColor: '#e8f7ff',
  backgroundImage: `url('/music-notes-large.svg')`,
  backgroundRepeat: 'repeat',
  backgroundSize: '1200px 800px',
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ mt: 0 }}>
        <Paper elevation={6} sx={{ p: 4, backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.85)' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {error}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Iniciar Sesión'}
              </Button>

              <Box sx={{ width: '100%', mt: 1 }}>
                <Link href="/forgot-password" variant="body2" display="block">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;