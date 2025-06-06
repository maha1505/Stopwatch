import React, { useState, useMemo } from 'react';
import {
  CssBaseline,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ThemeToggle from './components/ThemeToggle';
import Stopwatch from './components/Stopwatch';
import { themes } from './themes/customThemes';

const App = () => {
  const [mode, setMode] = useState('light');
  const [themeName, setThemeName] = useState('default');
  const [countdown, setCountdown] = useState('');
  const [startCountdown, setStartCountdown] = useState(false);
  const [count, setCount] = useState(null);

  const toggleThemeMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleThemeChange = (e) => {
    setThemeName(e.target.value);
  };

  const handleStartCountdown = () => {
    let duration = parseInt(countdown);
    if (!duration || duration < 1) return;

    const endTime = Date.now() + duration * 1000;
    setStartCountdown(true);

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setCount(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateCountdown);
      } else {
        setStartCountdown(false);
      }
    };

    updateCountdown();
  };

  // Create dynamic MUI theme based on selected theme and mode
  const theme = useMemo(
    () =>
      createTheme({
        ...themes[themeName],
        palette: {
          ...themes[themeName].palette,
          mode,
        },
      }),
    [themeName, mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Stopwatch App</Typography>
          <ThemeToggle mode={mode} toggleMode={toggleThemeMode} />
        </Stack>

        <FormControl fullWidth margin="normal">
          <InputLabel>Theme Color</InputLabel>
          <Select value={themeName} label="Theme Color" onChange={handleThemeChange}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="fuelYellow">Fuel Yellow</MenuItem>
            <MenuItem value="crusta">Crusta</MenuItem>
            <MenuItem value="eucalyptus">Eucalyptus</MenuItem>
          </Select>
        </FormControl>

        <Stack mt={2} spacing={2} direction="row" alignItems="center" justifyContent="center">
          <TextField
            label="Countdown (sec)"
            variant="outlined"
            size="small"
            type="number"
            value={countdown}
            onChange={(e) => setCountdown(e.target.value)}
          />
          <Button variant="contained" onClick={handleStartCountdown}>
            Start Countdown
          </Button>
        </Stack>

        {startCountdown ? (
          <Typography variant="h2" textAlign="center" mt={4}>
            {count}
          </Typography>
        ) : (
          <Stopwatch />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
