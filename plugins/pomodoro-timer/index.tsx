import { useEffect, useRef, useState } from 'react';
import { useRebel, usePluginStorage } from '@rebel/plugin-api';
import { Badge, Button, Card, Stack, Input } from '@rebel/plugin-ui';

const PRESETS = [5, 15, 25, 45, 60];
const DEFAULT_MINUTES = 25;
const RING_SIZE = 180;
const STROKE = 8;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function PomodoroTimer() {
  const rebel = useRebel();
  const [sessionsCompleted, setSessionsCompleted] = usePluginStorage<number>('sessions', 0);
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);
  const [secondsRemaining, setSecondsRemaining] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [pulse, setPulse] = useState(false);
  const isRunningRef = useRef(isRunning);
  const totalSeconds = durationMinutes * 60;

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    rebel.lifecycle.registerInterval(() => {
      if (!isRunningRef.current) return;
      setSecondsRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
  }, [rebel]);

  useEffect(() => {
    rebel.lifecycle.registerInterval(() => {
      if (!isRunningRef.current) return;
      setPulse((p) => !p);
    }, 1500);
  }, [rebel]);

  useEffect(() => {
    if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      setSessionsCompleted(sessionsCompleted + 1);
    }
  }, [secondsRemaining, isRunning, sessionsCompleted, setSessionsCompleted]);

  const selectDuration = (minutes: number) => {
    if (isRunning) return;
    setDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setHasStarted(false);
  };

  const progress = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isComplete = secondsRemaining === 0 && hasStarted;
  const isPaused = !isRunning && hasStarted && !isComplete;
  const status = isRunning ? 'Running' : isComplete ? 'Complete!' : isPaused ? 'Paused' : 'Ready';

  const ringColor = isComplete
    ? '#22c55e'
    : isRunning
    ? 'var(--color-accent)'
    : isPaused
    ? '#f59e0b'
    : 'var(--color-border)';

  const glowStyle = isRunning && pulse
    ? { filter: `drop-shadow(0 0 8px var(--color-accent))`, transition: 'filter 0.8s ease' }
    : { filter: 'none', transition: 'filter 0.8s ease' };

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem 1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Pomodoro</h2>
          <Badge variant="outline">{sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''}</Badge>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem' }}>
        <Stack gap="sm">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1.5rem 0 1rem',
          }}>
            <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, ...glowStyle }}>
              <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth={STROKE}
                  opacity={0.3}
                />
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  fontVariantNumeric: 'tabular-nums',
                  color: isComplete ? '#22c55e' : 'var(--color-text)',
                  transition: 'color 0.4s ease',
                }}>
                  {formatTime(secondsRemaining)}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isComplete ? '#22c55e' : isRunning ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  marginTop: '0.125rem',
                  transition: 'color 0.4s ease',
                }}>
                  {status}
                </div>
              </div>
            </div>
          </div>

          {!isRunning && !hasStarted && (
            <Card>
              <Stack gap="sm">
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</span>
                <Stack gap="sm" direction="row">
                  {PRESETS.map((m) => (
                    <Button
                      key={m}
                      variant={durationMinutes === m ? 'default' : 'ghost'}
                      onClick={() => selectDuration(m)}
                    >
                      {m}m
                    </Button>
                  ))}
                </Stack>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Input
                    type="number"
                    value={String(durationMinutes)}
                    placeholder="Custom"
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(180, parseInt(e.target.value) || 1));
                      selectDuration(val);
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    min
                  </span>
                </div>
              </Stack>
            </Card>
          )}

          <Stack gap="sm" direction="row">
            {!isRunning && !isComplete && (
              <Button
                onClick={() => {
                  setIsRunning(true);
                  setHasStarted(true);
                }}
              >
                {isPaused ? 'Resume' : 'Start'}
              </Button>
            )}
            {isRunning && (
              <Button onClick={() => setIsRunning(false)} variant="secondary">
                Pause
              </Button>
            )}
            {(hasStarted || isComplete) && (
              <Button
                onClick={() => {
                  setIsRunning(false);
                  setSecondsRemaining(durationMinutes * 60);
                  setHasStarted(false);
                }}
                variant={isComplete ? 'default' : 'ghost'}
              >
                {isComplete ? 'New Session' : 'Reset'}
              </Button>
            )}
          </Stack>
        </Stack>
      </div>
    </Stack>
  );
}
