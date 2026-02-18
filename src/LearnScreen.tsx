import React from 'react';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import { LEARN_CATEGORIES } from './learn/content';
import type { LearnCategory, LearnItem } from './learn/content';

type LearnView = { kind: 'list' } | { kind: 'category'; category: LearnCategory };

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.06)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </Card>
  );
}

function ItemCard({ item }: { item: LearnItem }) {
  return (
    <GlassCard>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={950}>{item.title}</Typography>
          <Chip size="small" label="TERİM" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          {item.short}
        </Typography>

        <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />

        <Stack spacing={0.75}>
          {item.body.map((p, i) => (
            <Typography key={i} variant="body2" sx={{ opacity: 0.85 }}>
              • {p}
            </Typography>
          ))}
        </Stack>

        {item.tips?.length ? (
          <>
            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', fontWeight: 800 }}>
              Taktik / İpucu
            </Typography>
            {item.tips.map((t, i) => (
              <Typography key={i} variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                • {t}
              </Typography>
            ))}
          </>
        ) : null}

        {item.warning ? (
          <>
            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Uyarı: {item.warning}
            </Typography>
          </>
        ) : null}
      </CardContent>
    </GlassCard>
  );
}

export function LearnScreen() {
  const [view, setView] = React.useState<LearnView>({ kind: 'list' });

  const Top = ({ title, canBack }: { title: string; canBack: boolean }) => (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', color: 'white' }}>
      <Toolbar sx={{ px: 1 }}>
        {canBack ? (
          <IconButton onClick={() => setView({ kind: 'list' })} sx={{ color: 'white' }}>
            <ArrowBackRounded />
          </IconButton>
        ) : (
          <Box sx={{ width: 44 }} />
        )}
        <Typography variant="subtitle1" sx={{ fontWeight: 950, flex: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        <Box sx={{ width: 44 }} />
      </Toolbar>
    </AppBar>
  );

  if (view.kind === 'category') {
    const c = view.category;
    return (
      <Box sx={{ pt: 1 }}>
        <Top title={`${c.icon} ${c.title}`} canBack />
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, color: 'rgba(255,255,255,0.75)' }}>
          {c.subtitle}
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {c.items.map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Top title="📚 Öğren" canBack={false} />

      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.75)' }}>
        Kartlara tıkla → kategori içindeki terimler ve “taktik/ipuçları” açılır.
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {LEARN_CATEGORIES.map((c) => (
          <GlassCard key={c.id}>
            <CardContent
              onClick={() => setView({ kind: 'category', category: c })}
              sx={{ cursor: 'pointer' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={950}>
                    {c.icon} {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                    {c.subtitle}
                  </Typography>
                </Box>
                <Chip size="small" label="AÇ" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
              </Stack>
            </CardContent>
          </GlassCard>
        ))}
      </Stack>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.65 }}>
        Not: İçerikler eğitim amaçlıdır; yatırım tavsiyesi değildir.
      </Typography>
    </Box>
  );
}
