import React from 'react';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { fetchLeaderboard, submitScore, type ScoreEntry } from '../utils/leaderboard';
import { panelSx } from './screens/helpers';

interface Props {
  endScore: number;
  difficulty: string;
  day: number;
}

export function LeaderboardPanel({ endScore, difficulty, day }: Props) {
  const [leaderboard, setLeaderboard] = React.useState<ScoreEntry[]>([]);
  const [name, setName] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  async function handleSubmit() {
    if (!name.trim() || submitted) return;
    setLoading(true);
    const ok = await submitScore(name.trim(), endScore, difficulty, day);
    if (ok) {
      setSubmitted(true);
      setLeaderboard(await fetchLeaderboard());
    }
    setLoading(false);
  }

  return (
    <Box>
      <Typography fontWeight={900} sx={{ mb: 1, fontSize: '0.95rem' }}>🌐 Global Sıralama</Typography>

      {!submitted ? (
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <TextField
            size="small"
            placeholder="Adın (max 20)"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            sx={{
              input: { color: 'white', fontSize: 14 },
              '& .MuiOutlinedInput-root': { borderColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              flex: 1,
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            sx={{ borderRadius: 3 }}
          >
            {loading ? '...' : 'Skoru Gönder'}
          </Button>
        </Stack>
      ) : (
        <Typography variant="caption" sx={{ display: 'block', mb: 1.5, opacity: 0.8, color: '#22c55e' }}>
          ✅ Skorun kaydedildi!
        </Typography>
      )}

      <Box sx={{ ...panelSx, p: 1.5 }}>
        {leaderboard.length === 0 ? (
          <Typography variant="caption" sx={{ opacity: 0.6 }}>Henüz skor yok. İlk sen ol!</Typography>
        ) : (
          <Stack spacing={0.8}>
            <Stack direction="row" justifyContent="space-between" sx={{ opacity: 0.6 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, width: 30 }}>#</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, flex: 1 }}>İsim</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, width: 50, textAlign: 'right' }}>Skor</Typography>
            </Stack>
            {leaderboard.slice(0, 10).map((entry, i) => (
              <Stack key={`${entry.timestamp}-${entry.name}`} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ width: 30, opacity: 0.7 }}>{i + 1}</Typography>
                <Typography variant="caption" sx={{ flex: 1, fontWeight: i === 0 ? 800 : 500 }}>
                  {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{entry.name}
                </Typography>
                <Chip size="small" label={entry.score} sx={{ bgcolor: 'rgba(96,165,250,0.2)', color: 'white', height: 22, fontSize: 12 }} />
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
