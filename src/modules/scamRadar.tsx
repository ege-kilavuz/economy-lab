import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

// Dolandırıcılık Radar (2–3 min)
// 10 senaryo: SMS/DM/E-posta/Arama. Oyuncu en güvenli aksiyonu seçer.
// Educational toy model. Not legal/financial advice.

type ChoiceId = 'click' | 'verify' | 'ignore' | 'block';

type Scenario = {
  id: string;
  channel: 'SMS' | 'DM' | 'E-posta' | 'Arama';
  message: string;
  detail: string;
  best: ChoiceId;
  why: string;
  rule: string;
};

const CHOICES: { id: ChoiceId; label: string }[] = [
  { id: 'verify', label: 'Resmî kanaldan doğrula' },
  { id: 'ignore', label: 'Yoksay / bekle' },
  { id: 'block', label: 'Engelle / bildir' },
  { id: 'click', label: 'Linke tıkla / devam et' },
];

const SCENARIOS: Scenario[] = [
  {
    id: 'bank-sms-link',
    channel: 'SMS',
    message: '“Hesabınız askıya alındı. 15 dk içinde doğrulayın.”',
    detail: 'Link: bit.ly/...  Gönderen numara garip.',
    best: 'verify',
    why: 'Acil baskı + kısa link = risk. Bankayı uygulamadan/çağrı merkezinden kontrol et.',
    rule: 'Kural: Banka işleri linkten değil uygulama/resmî numaradan.',
  },
  {
    id: 'insta-dm-airdrop',
    channel: 'DM',
    message: '“Çekiliş kazandın! Cüzdan adresini yaz, NFT gönderelim.”',
    detail: 'Profil yeni açılmış; yorumlar kapalı.',
    best: 'ignore',
    why: 'Kimlik belirsiz + ödül vaadi = dolandırıcılık ihtimali yüksek.',
    rule: 'Kural: “Ücretsiz para/ödül” vaatleri çoğunlukla tuzaktır.',
  },
  {
    id: 'support-call',
    channel: 'Arama',
    message: '“Ben bankadan arıyorum, kart güvenliğiniz için şifre söyleyin.”',
    detail: 'Arayan kişi acele ettiriyor.',
    best: 'block',
    why: 'Bankalar şifre/OTP istemez. Kapat, resmî numarayı sen ara.',
    rule: 'Kural: Şifre/OTP isteniyorsa %99 dolandırıcı.',
  },
  {
    id: 'job-offer',
    channel: 'E-posta',
    message: '“İşe alındınız, dosyayı açıp formu doldurun.”',
    detail: 'Ek dosya: .zip / .exe benzeri.',
    best: 'verify',
    why: 'Zararlı yazılım olabilir. Şirketi ayrı kanaldan doğrula; ekleri dikkatle aç.',
    rule: 'Kural: Beklenmeyen ek = risk.',
  },
  {
    id: 'invoice',
    channel: 'E-posta',
    message: '“Faturanızı ödemediniz, icra başlayacak.”',
    detail: 'Mail adresi: support@random-domain.biz',
    best: 'ignore',
    why: 'Korku dili + alakasız domain = spam/phishing.',
    rule: 'Kural: Korku + alakasız domain = kırmızı bayrak.',
  },
  {
    id: 'friend-hacked',
    channel: 'DM',
    message: 'Arkadaşın: “Acil 2.000 TL atabilir misin? IBAN yazıyorum.”',
    detail: 'Normalde böyle konuşmaz; sesli arama yapmıyor.',
    best: 'verify',
    why: 'Hesap ele geçirilmiş olabilir. Para göndermeden önce sesli arayıp doğrula.',
    rule: 'Kural: “Acil para” → ikinci kanaldan doğrula.',
  },
  {
    id: 'crypto-exchange',
    channel: 'SMS',
    message: '“Borsa hesabınıza giriş yapıldı. Hemen doğrulayın.”',
    detail: 'Sen bu borsayı hiç kullanmadın.',
    best: 'ignore',
    why: 'Kullanmıyorsan muhtemelen toplu phishing. Linke tıklama.',
    rule: 'Kural: Kullanmadığın hizmetten gelen panik mesajını yok say.',
  },
  {
    id: 'app-update',
    channel: 'DM',
    message: '“Telefon hızlandırıcı güncelleme APK’sı burada.”',
    detail: 'Play Store linki yok; direkt APK indirtiyor.',
    best: 'block',
    why: 'Bilinmeyen APK’lar zararlı olabilir. Resmî mağazadan yükle.',
    rule: 'Kural: APK indirten mesajlara güvenme.',
  },
  {
    id: 'lottery-tax',
    channel: 'SMS',
    message: '“Ödül kazandınız! Vergi için küçük ödeme yapın.”',
    detail: 'Ön ödeme istiyor.',
    best: 'block',
    why: 'Ön ödeme isteyen ödüller genelde dolandırıcılıktır.',
    rule: 'Kural: Ödül için para isteniyorsa: dolandırıcılık.',
  },
  {
    id: 'qr-restaurant',
    channel: 'DM',
    message: '“Menü için QR kod” (fotoğraf) gönderildi.',
    detail: 'Mekânın resmî hesabı değil; rastgele biri attı.',
    best: 'verify',
    why: 'QR sahte siteye yönlendirebilir. Mekândan resmî menüyü iste.',
    rule: 'Kural: QR = link. Link gibi dikkat.',
  },
];

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ScamRadarGame() {
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [order, setOrder] = React.useState<Scenario[]>(() => shuffle(SCENARIOS).slice(0, 10));
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [last, setLast] = React.useState<{ choice: ChoiceId; ok: boolean; s: Scenario } | null>(null);

  const s = order[index];
  const done = started && index >= order.length;

  function reset() {
    setStarted(false);
    setIndex(0);
    setOrder(shuffle(SCENARIOS).slice(0, 10));
    setScore(0);
    setStreak(0);
    setLast(null);
  }

  function choose(c: ChoiceId) {
    if (!s) return;
    const ok = c === s.best;
    if (ok) {
      const add = 4 + Math.min(3, streak);
      setScore((x) => x + add);
      setStreak((x) => x + 1);
    } else {
      setScore((x) => x - 2);
      setStreak(0);
    }
    setLast({ choice: c, ok, s });
    setIndex((i) => i + 1);
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Dolandırıcılık Radar</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(239,68,68,0.16)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur. Amaç: “acele + belirsiz kimlik + link” tuzaklarını otomatik fark etmek.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={done ? 'Bitti' : `Tur ${Math.min(index + 1, order.length)}/${order.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Seri ${streak}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
            {!started ? (
              <Button variant="contained" onClick={() => setStarted(true)}>
                Başlat
              </Button>
            ) : null}
            <Button variant="text" onClick={reset}>
              Sıfırla
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {started && !done && s ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip size="small" label={s.channel} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
              <Chip size="small" label="Senaryo" sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            </Stack>

            <Typography fontWeight={950} sx={{ mt: 1 }}>
              {s.message}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.75 }}>
              {s.detail}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Ne yaparsın?
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {CHOICES.map((c) => (
                <Button key={c.id} variant={c.id === 'verify' ? 'contained' : 'outlined'} onClick={() => choose(c.id)}>
                  {c.label}
                </Button>
              ))}
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
              Not: Şüphedeysen “doğrula” veya “bekle” genelde en güvenlisidir.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {started && (done || last) ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{done ? 'Özet' : 'Son Tur'}</Typography>
            {last ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  En güvenli: <b>{CHOICES.find((c) => c.id === last.s.best)?.label}</b>
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.85 }}>
                  Neden: {last.s.why}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  {last.s.rule}
                </Typography>
              </Box>
            ) : null}

            {done ? (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
                Ders: Hızlı karar istiyorlarsa yavaşla. Kimliği sen doğrula.
              </Typography>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
