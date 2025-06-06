import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';

const formatTime = (time) => {
  const ms = String(time % 1000).padStart(3, '0');
  const seconds = String(Math.floor(time / 1000) % 60).padStart(2, '0');
  const minutes = String(Math.floor(time / 60000) % 60).padStart(2, '0');
  const hours = String(Math.floor(time / 3600000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.${ms}`;
};

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [goalTime, setGoalTime] = useState('');
  const [intervalSecs, setIntervalSecs] = useState('');
  const [lastAutoLap, setLastAutoLap] = useState(0);
  const [goalReached, setGoalReached] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (goalReached) {
      alert("🎯 Goal Time Reached!");
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    }
  }, [goalReached]);

  const start = () => {
    if (running) return;
    setRunning(true);
    setGoalReached(false);
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      const newTime = Date.now() - startTime;
      setTime(newTime);

      const intervalMS = parseInt(intervalSecs) * 1000;
      if (intervalMS && newTime - lastAutoLap >= intervalMS) {
        setLaps((prev) => [...prev, newTime]);
        setLastAutoLap(newTime);
      }

      if (goalTime && newTime >= parseInt(goalTime) * 1000) {
        stop();
        setGoalReached(true);
        playAlert();
      }
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    stop();
    setTime(0);
    setLaps([]);
    setGoalReached(false);
    setLastAutoLap(0);
  };

  const lap = () => {
    if (running) setLaps([...laps, time]);
  };

  const playAlert = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <Box textAlign="center" p={3} bgcolor="background.paper" boxShadow={3} borderRadius={3}>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto" />
      <Typography variant="h3" mb={2}>
        {formatTime(time)}
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
        <TextField
          size="small"
          label="Goal Time (s)"
          type="number"
          value={goalTime}
          onChange={(e) => setGoalTime(e.target.value)}
        />
        <TextField
          size="small"
          label="Auto-lap (s)"
          type="number"
          value={intervalSecs}
          onChange={(e) => setIntervalSecs(e.target.value)}
        />
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="success" onClick={start}>Start</Button>
        <Button variant="contained" color="error" onClick={stop}>Stop</Button>
        <Button variant="outlined" onClick={reset}>Reset</Button>
        <Button variant="contained" color="primary" onClick={lap}>Lap</Button>
      </Stack>

      <Box mt={3}>
        {laps.map((lapTime, index) => (
          <Typography key={index}>Lap {index + 1}: {formatTime(lapTime)}</Typography>
        ))}
        {laps.length > 1 && (
          <Box mt={2}>
            <Typography variant="body2">🟢 Fastest: {formatTime(Math.min(...laps))}</Typography>
            <Typography variant="body2">🔴 Slowest: {formatTime(Math.max(...laps))}</Typography>
            <Typography variant="body2">🔁 Avg: {formatTime(Math.floor(laps.reduce((a, b) => a + b, 0) / laps.length))}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Stopwatch;
