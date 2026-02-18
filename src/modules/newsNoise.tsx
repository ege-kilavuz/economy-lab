import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

// "Haber mi Gürültü mü?" (2–3 min)
// Purpose: teach basic media/finance literacy: source quality, incentives, confirmation, urgency traps.
// Educational toy model. Not financial advice.

type Pick = 'signal' | 'noise' | 'unsure';

type Item = {
  id: string;
  title: string;
  context: string;
  correct: 'signal' | 'noise';
  why: string;
  rule: string; // short lesson
};

const ITEMS: Item[] = [
  ...moreItemsSeedPack(),
  {
    id: 'rumor-coin',
    title: '“X Coin yarın 10x olacakmış!”',
    context: 'Kaynak: anonim Telegram kanalı. “Hemen gir, geç kalma” tonu.',
    correct: 'noise',
    why: 'Belirsiz kaynak + aşırı kesin vaat + aciliyet = manipülasyon riski. Doğrulama yok.',
    rule: 'Kural: Kaynak + kanıt yoksa “acil” demesi daha da şüpheli.',
  },
  {
    id: 'official-rate',
    title: 'Merkez bankası faiz kararını açıkladı (resmî site).',
    context: 'Kaynak: resmî duyuru + tutanak linki.',
    correct: 'signal',
    why: 'Birincil kaynak + doğrulanabilir doküman = yüksek güven.',
    rule: 'Kural: Birincil kaynak > yorum > söylenti.',
  },
  {
    id: 'sponsored',
    title: '“Bu uygulama ile herkes zengin oluyor” reklamı.',
    context: 'Kaynak: sponsorlu içerik. Risklerden hiç bahsetmiyor.',
    correct: 'noise',
    why: 'Teşvik çatışması + tek yönlü anlatım. Risk gizleme olasılığı yüksek.',
    rule: 'Kural: Teşvikleri oku: Kim kazanıyor?',
  },
  {
    id: 'earnings',
    title: 'Şirket bilanço açıkladı: gelir/kar beklentiden farklı.',
    context: 'Kaynak: KAP/EDGAR linkli haber + rakamlar.',
    correct: 'signal',
    why: 'Doğrulanabilir veri var. Yorum farklı olabilir ama veri gerçek.',
    rule: 'Kural: Veri ayrı, yorum ayrı.',
  },
  {
    id: 'friend-tip',
    title: 'Arkadaşın: “Ben aldım, sen de al.”',
    context: 'Gerekçe: “Herkes konuşuyor.”',
    correct: 'noise',
    why: 'Sosyal kanıt (FOMO) güvenilir veri değildir.',
    rule: 'Kural: “Herkes alıyor” bir analiz değil.',
  },
  {
    id: 'scam-urgency',
    title: '“Son 10 dakika! Paranı ikiye katla” mesajı.',
    context: 'Kaynak: DM. Link kısaltılmış. Kimlik belirsiz.',
    correct: 'noise',
    why: 'Acil baskı + belirsiz kimlik + link = dolandırıcılık alarmı.',
    rule: 'Kural: Acil baskı → dur, doğrula, gerekirse hiç tıklama.',
  },
  {
    id: 'inflation',
    title: 'TÜİK enflasyon verisi açıklandı.',
    context: 'Kaynak: resmî veri + PDF/tablo.',
    correct: 'signal',
    why: 'Veri doğrulanabilir. Yorumlar değişebilir.',
    rule: 'Kural: Veri yayınlandığında “ne oldu?” nettir; “ne olacak?” değildir.',
  },
  {
    id: 'chart-only',
    title: '“Grafik böyle, kesin yükselir” (tek ekran görüntüsü).',
    context: 'Kaynak: sosyal medya. Zaman aralığı/bağlam yok.',
    correct: 'noise',
    why: 'Bağlamsız tek görüntü yanıltıcı olabilir. Seçici gösterim (cherry-pick) riski.',
    rule: 'Kural: Bağlam yoksa güven azalır.',
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

function moreItemsSeedPack(): Item[] {
  // Quick expansion pack (scaffold). Add more over time to reach 200–500+.
  return [
    {
      id: 'anonymous-screenshot',
      title: '“Bak ekran görüntüsü: kesin kanıt”',
      context: 'Kaynak: anonim hesap. Ekran görüntüsü kesilmiş/kırpılmış.',
      correct: 'noise',
      why: 'Kırpılmış görüntü kolayca manipüle edilir. Orijinal kaynak yok.',
      rule: 'Kural: Ekran görüntüsü kanıt değildir; kaynağı bul.',
    },
    {
      id: 'press-release',
      title: 'Şirket basın bülteni yayınladı (kendi sitesi).',
      context: 'Kaynak: şirket sitesi. “Başarı hikayesi” tonu.',
      correct: 'signal',
      why: 'Bilgi birincil kaynaktan geliyor ama pazarlama dili olabilir.',
      rule: 'Kural: Birincil kaynak + teşvik = dikkatli yorum.',
    },
    {
      id: 'whatsapp-forward',
      title: 'WhatsApp’ta zincir mesaj: “Banka hesabınız kapanacak”.',
      context: 'Kaynak: iletilen mesaj. Link: kısa URL.',
      correct: 'noise',
      why: 'Zincir mesaj + link + korku baskısı çoğunlukla dolandırıcılık.',
      rule: 'Kural: Korku ve aciliyet → dur, resmî kanaldan doğrula.',
    },
    {
      id: 'data-with-method',
      title: 'Araştırma: “Gençlerde harcama alışkanlıkları” (metodoloji var).',
      context: 'Kaynak: örneklem, yöntem, tarih belirtilmiş rapor.',
      correct: 'signal',
      why: 'Yöntem ve tarih verilirse güven artar (yine de %100 değil).',
      rule: 'Kural: Metodoloji + tarih = kalite göstergesi.',
    },
    {
      id: 'influencer-promise',
      title: 'Influencer: “Bu stratejiyle garanti kazanırsın.”',
      context: 'Kaynak: sponsorlu video. Risk kısmı yok.',
      correct: 'noise',
      why: 'Garanti vaat + teşvik çatışması + risk yok = alarm.',
      rule: 'Kural: “Garanti” kelimesi finans içerikte kırmızı bayrak.',
    },
    {
      id: 'macro-calendar',
      title: 'Ekonomik takvimde bugün veri açıklanacak.',
      context: 'Kaynak: takvim + saat. “Bugün açıklanacak” bilgisi.',
      correct: 'signal',
      why: 'Olayın kendisi doğrulanabilir; etki tahmini ayrı konu.',
      rule: 'Kural: Olay bilgisi ≠ fiyat tahmini.',
    },
    {
      id: 'commentary-only',
      title: '“Bence kesin düşecek” yorumu (veri yok).',
      context: 'Kaynak: yorum. Rakam, link, gerekçe yok.',
      correct: 'noise',
      why: 'Gerekçesiz kesinlik, bilgi değil görüş.',
      rule: 'Kural: Görüşü veri sanma.',
    },
    {
      id: 'regulatory-fine',
      title: 'Regülatör şirkete ceza kesti (resmî açıklama).',
      context: 'Kaynak: resmî karar metni.',
      correct: 'signal',
      why: 'Doğrulanabilir olay var. Etkisi tartışılabilir.',
      rule: 'Kural: Doğrulanabilir belge = sinyal.',
    },
    {
      id: 'bait-headline',
      title: 'Tık tuzağı başlık: “Şok! Her şey değişti!”',
      context: 'Kaynak: clickbait site. İçerik belirsiz.',
      correct: 'noise',
      why: 'Belirsiz başlık genelde reklam geliri için.',
      rule: 'Kural: Başlık değil içerik + kaynak.',
    },
    {
      id: 'simple-budget',
      title: '“Aylık gelir-gider tablosu” önerisi (örnekli).',
      context: 'Kaynak: eğitim içeriği. Basit örnekler var.',
      correct: 'signal',
      why: 'Eğitim/alışkanlık önerisi; doğrulanabilir ve zararsız.',
      rule: 'Kural: Basit alışkanlıklar çoğu zaman en güçlüdür.',
    },
  ];
}

export function NewsNoiseGame() {
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [order, setOrder] = React.useState<Item[]>(() => shuffle(ITEMS).slice(0, 10));
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [last, setLast] = React.useState<{ pick: Pick; ok: boolean; item: Item } | null>(null);

  const item = order[index];
  const done = started && index >= order.length;

  function reset() {
    setStarted(false);
    setIndex(0);
    setOrder(shuffle(ITEMS).slice(0, 10));
    setScore(0);
    setStreak(0);
    setLast(null);
  }

  function pick(p: Pick) {
    if (!item) return;
    const ok = p !== 'unsure' && p === item.correct;

    if (p === 'unsure') {
      setScore((s) => s + 1);
      setStreak(0);
    } else if (ok) {
      setScore((s) => s + 4);
      setStreak((s) => s + 1);
    } else {
      setScore((s) => s - 2);
      setStreak(0);
    }

    setLast({ pick: p, ok, item });
    setIndex((i) => i + 1);
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Haber mi Gürültü mü?</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(34,197,94,0.18)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur. Amaç: “Kaynak + kanıt + teşvik” filtrelerini refleks yapmak.
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

      {started && !done && item ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{item.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.75 }}>
              {item.context}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Seç:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" color="success" onClick={() => pick('signal')}>
                Sinyal
              </Button>
              <Button variant="contained" color="error" onClick={() => pick('noise')}>
                Gürültü
              </Button>
              <Button variant="outlined" onClick={() => pick('unsure')}>
                Emin değilim
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
              Not: “Emin değilim” bazen en doğru karardır. Özellikle kanıt yoksa.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {started && (done || last) ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{done ? 'Özet' : 'Son Tur'} </Typography>
            {last ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Doğru cevap: <b>{last.item.correct === 'signal' ? 'Sinyal' : 'Gürültü'}</b> · Sen: <b>{last.pick === 'signal' ? 'Sinyal' : last.pick === 'noise' ? 'Gürültü' : 'Emin değilim'}</b>
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.85 }}>
                  Neden: {last.item.why}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  {last.item.rule}
                </Typography>
              </Box>
            ) : null}

            {done ? (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
                Ders: En iyi savunma “yavaşlamak”. Acele ettiren içerikler çoğunlukla manipülasyon taşır.
              </Typography>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
