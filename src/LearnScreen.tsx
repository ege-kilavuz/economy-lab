import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

function LessonCard({
  title,
  subtitle,
  takeaway,
}: {
  title: string;
  subtitle: string;
  takeaway: string;
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.06)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={950}>{title}</Typography>
          <Chip size="small" label="KART" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          {subtitle}
        </Typography>
        <Box sx={{ mt: 1.25 }}>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Ana fikir: {takeaway}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function LearnScreen() {
  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
        Burada metin okumak yerine kısa “kartlarla” kavram öğreneceksin. (Şimdilik MVP: kartlar; sırada mini etkileşim/quiz var.)
      </Typography>

      <Typography sx={{ mt: 2, fontWeight: 950, color: 'rgba(255,255,255,0.9)' }}>
        Finans Kartları
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 1.5 }}>
        <LessonCard
          title="Enflasyon"
          subtitle="Fiyatlar artınca aynı maaşla daha az şey alırsın. Bu 'alım gücü' düşüşü." 
          takeaway="Nominal para aynı kalsa bile reel değer düşebilir."
        />
        <LessonCard
          title="Faiz"
          subtitle="Borçta maliyet, birikimde büyüme. Asgari ödeme borcu uzatır ve toplam maliyeti artırır." 
          takeaway="Faiz zamanla birikir (bileşik etki)."
        />
        <LessonCard
          title="Risk & Dağılım"
          subtitle="Tüm parayı tek varlığa koymak dalgalanmada zarar yazdırır. Dağıtmak riski azaltır." 
          takeaway="Volatiliteyi azaltmak için çeşitlendirme."
        />
        <LessonCard
          title="TCMB Faiz Kararı"
          subtitle="Faiz kararları beklentileri değiştirir: kredi, kur, borsa, altın gibi alanlara yansır." 
          takeaway="Ekonomi 'trade-off' dolu: her kararın bedeli var."
        />
      </Stack>
    </Box>
  );
}
