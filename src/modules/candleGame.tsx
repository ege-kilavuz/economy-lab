import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

type Label = 'Risk-Getiri' | 'Çeşitlendirme' | 'Halka Arz' | 'Hisse Senedi';

type Round = {
  title: string;
  scenario: string;
  choices: Label[];
  answer: Label;
  why: string;
  tip: string;
};

const ROUNDS: Round[] = [
  {
    title: 'Tek hisseye tüm para',
    scenario: 'Arkadaşın tüm birikimini tek bir teknoloji hissesine koymayı düşünüyor. “Çok yükselecek” diyor ama başka aracı yok.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Çeşitlendirme',
    why: 'Buradaki ana ders, riski tek bir varlıkta toplamamak yani çeşitlendirmedir.',
    tip: 'Resmî içerik çizgisi: tek bir araca yoğunlaşmak riskin tek noktada toplanmasına yol açar.',
  },
  {
    title: 'Yüksek kazanç vaadi',
    scenario: 'Bir yatırım aracı için “çok yüksek getiri bekleniyor” deniyor. Ama fiyatlar çok oynak ve zarar ihtimali de ciddi.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Risk-Getiri',
    why: 'Yüksek getiri beklentisi çoğu zaman daha yüksek risk ile birlikte değerlendirilir.',
    tip: 'Beklenen getiri yüksekse belirsizlik ve oynaklık da yüksek olabilir.',
  },
  {
    title: 'Şirket payları yatırımcıya açılıyor',
    scenario: 'Bir şirket ilk kez paylarını yatırımcıların alıp satabileceği şekilde piyasaya sunuyor.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Halka Arz',
    why: 'Bu tanım doğrudan halka arzı anlatır.',
    tip: 'Halka arz ilgi çekebilir ama otomatik kazanç anlamına gelmez.',
  },
  {
    title: 'Şirkete ortak olmak',
    scenario: 'Bir yatırımcı bir şirketin payını satın alıyor ve şirketin geleceğiyle ilgili beklentilere ortak oluyor.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Hisse Senedi',
    why: 'Şirkete ortaklık payını temsil eden araç hisse senedidir.',
    tip: 'Hisse almak, yalnızca grafik değil şirketin yapısı ve geleceğiyle de ilgilidir.',
  },
  {
    title: 'Tek araç mı dağılım mı?',
    scenario: 'Aynı parayı ya tek bir hisseye ya da birkaç farklı araca bölme seçeneğin var. Amaç zararı tek noktada toplamamak.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Çeşitlendirme',
    why: 'Soru doğrudan riski yaymaya odaklanıyor.',
    tip: 'Çeşitlendirme getiriyi garanti etmez ama tek bir darbenin etkisini azaltabilir.',
  },
  {
    title: 'Düşük risk, düşük beklenti',
    scenario: 'Bir yatırım aracı daha sakin hareket ediyor; buna karşılık beklenen getirisi de daha sınırlı.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Risk-Getiri',
    why: 'Burada anlatılan temel ilişki risk ve getiri dengesidir.',
    tip: 'Rasyonel yatırımcı yalnız getiriyi değil, o getirinin riskini de düşünür.',
  },
  {
    title: 'Yeni şirket payı',
    scenario: 'Birisi “Bu şirketin hissesi var” diyor. Sen de bunun hangi temel kavrama karşılık geldiğini düşünüyorsun.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Hisse Senedi',
    why: 'Şirket payı ifadesi hisse senedini anlatır.',
    tip: 'Hisse senedi, yatırımcının şirkete ortaklık payını temsil eder.',
  },
  {
    title: 'İlk satış, ilk erişim',
    scenario: 'Bir şirketin payları ilk kez yatırımcıların erişimine açılıyor ve herkes bu süreci konuşuyor.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Halka Arz',
    why: 'Payların ilk kez yatırımcıya sunulması halka arz sürecidir.',
    tip: 'İlgi yüksek olabilir; yine de sadece popüler olduğu için karar verilmez.',
  },
  {
    title: 'Sadece sosyal medya gazı',
    scenario: 'Bir araç sürekli konuşuluyor ama kimse riskinden bahsetmiyor. Sen önce hangi kavramı düşünmelisin?',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Risk-Getiri',
    why: 'Popülerlik tek başına yeterli değildir; risk tarafı da değerlendirilmelidir.',
    tip: '“Çok konuşuluyor” demek “iyi yatırım” demek değildir.',
  },
  {
    title: 'Portföyü yaymak',
    scenario: 'Bir öğrenci portföyünü hisse, fon ve farklı araçlara bölerek tek bir düşüşten daha az etkilenmek istiyor.',
    choices: ['Risk-Getiri', 'Çeşitlendirme', 'Halka Arz', 'Hisse Senedi'],
    answer: 'Çeşitlendirme',
    why: 'Farklı araçlara yayılmak çeşitlendirme mantığıdır.',
    tip: 'Çeşitlendirme, tek bir riskte kilitlenmemeyi öğretir.',
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

export function CandleGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState<Label | null>(null);
  const [order, setOrder] = React.useState<Round[]>(() => shuffle(ROUNDS));

  const current = order[round];
  const done = round >= order.length;

  function reset() {
    setRound(0);
    setScore(0);
    setPicked(null);
    setOrder(shuffle(ROUNDS));
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Borsa Kavram Eşleştirme</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur. Borsa kategorisindeki resmî konulara en uygun kavramı seç.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={done ? 'Bitti' : `Tur ${round + 1}/${order.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label="Kaynak odağı: Borsa" sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
          </Stack>
        </CardContent>
      </Card>

      {done ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>Bitti</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Skorun: <b>{score}</b> / {order.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
              Ders: Borsa tarafında önce kavramları doğru ayırmak gerekir: hisse senedi, halka arz, risk-getiri ve çeşitlendirme birbirinin yerine geçmez.
            </Typography>
            <Button sx={{ mt: 1.5 }} variant="contained" onClick={reset}>Tekrar oyna</Button>
          </CardContent>
        </Card>
      ) : current ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>{current.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.75 }}>
              {current.scenario}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Stack spacing={1}>
              {current.choices.map((choice) => (
                <Button
                  key={choice}
                  variant={picked === choice ? 'contained' : 'outlined'}
                  disabled={picked !== null}
                  sx={{ justifyContent: 'flex-start' }}
                  onClick={() => setPicked(choice)}
                >
                  {choice}
                </Button>
              ))}
            </Stack>

            {picked ? (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {picked === current.answer ? 'Doğru.' : `Yanlış. Doğru cevap: ${current.answer}.`} {current.why}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  {current.tip}
                </Typography>
                <Button
                  sx={{ mt: 1.25 }}
                  variant="contained"
                  onClick={() => {
                    if (picked === current.answer) setScore((s) => s + 1);
                    setPicked(null);
                    setRound((r) => r + 1);
                  }}
                >
                  Devam
                </Button>
              </Box>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
