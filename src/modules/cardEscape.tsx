import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

// 2–3 min mini game: manage credit card debt for 10 turns.
// Educational toy model. Not financial advice.

type State = {
  turn: number;
  cash: number;
  debt: number;
  stress: number; // 0..100
  score: number;
  log: string[];
  seed: number;
};

type EventCard = {
  title: string;
  desc: string;
  choices: Array<{ label: string; apply: (s: State) => State; teach: string }>;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rng(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function money(n: number) {
  return `${Math.round(n).toLocaleString()} TL`;
}

function interestOnDebt(debt: number) {
  // toy monthly-ish interest per 10 turns
  return Math.round(debt * 0.05);
}

function mkDeck(): EventCard[] {
  return [
    {
      title: 'Kart ekstresi geldi',
      desc: 'Bu ay borcun var. Ne yapacaksın?',
      choices: [
        {
          label: 'Asgari öde (kolay ama pahalı)',
          apply: (s) => {
            const pay = Math.min(s.cash, Math.max(250, Math.round(s.debt * 0.1)));
            const debt = s.debt - pay;
            return { ...s, cash: s.cash - pay, debt, score: s.score + 2, stress: clamp(s.stress - 2, 0, 100), log: [`Asgari ödeme: -${money(pay)}`, ...s.log] };
          },
          teach: 'Asgari ödeme borcu bitirmez; borcu uzatıp toplam maliyeti büyütebilir.',
        },
        {
          label: 'Borcun yarısını öde',
          apply: (s) => {
            const pay = Math.min(s.cash, Math.round(s.debt * 0.5));
            const debt = s.debt - pay;
            return { ...s, cash: s.cash - pay, debt, score: s.score + 6, stress: clamp(s.stress - 5, 0, 100), log: [`Borç ödeme: -${money(pay)}`, ...s.log] };
          },
          teach: 'Borcu düzenli ve daha yüksek kapatmak faiz yükünü azaltır.',
        },
        {
          label: 'Hiç ödeme (gecikme)',
          apply: (s) => ({ ...s, score: s.score - 8, stress: clamp(s.stress + 10, 0, 100), log: ['Ödeme gecikti: ceza riski ↑', ...s.log] }),
          teach: 'Gecikme çoğu zaman ceza/faiz ve stres demektir.',
        },
      ],
    },
    {
      title: 'İndirimli alışveriş',
      desc: '“Son gün” indirimi gördün. 2.000 TL. Kartla alabilirsin.',
      choices: [
        {
          label: 'Al (kartla)',
          apply: (s) => ({ ...s, debt: s.debt + 2000, score: s.score - 2, stress: clamp(s.stress + 4, 0, 100), log: ['İndirim alışverişi: +2.000 TL kart borcu', ...s.log] }),
          teach: 'İndirim, ihtiyaç değilse “ucuz” değil “ekstra borç” olabilir.',
        },
        {
          label: 'Alma',
          apply: (s) => ({ ...s, score: s.score + 4, stress: clamp(s.stress - 1, 0, 100), log: ['Alışveriş yapılmadı (kontrol)', ...s.log] }),
          teach: 'En iyi tasarruf bazen “almamak”.',
        },
      ],
    },
    {
      title: 'Beklenmedik gider',
      desc: 'Telefon tamiri: 1.500 TL. Nakit yetmezse karta yazılır.',
      choices: [
        {
          label: 'Nakit öde',
          apply: (s) => {
            const c = Math.min(s.cash, 1500);
            const remain = 1500 - c;
            return {
              ...s,
              cash: s.cash - c,
              debt: s.debt + remain,
              score: s.score + (remain === 0 ? 5 : 0),
              stress: clamp(s.stress + 2, 0, 100),
              log: [`Tamir: -${money(c)} nakit${remain ? `, +${money(remain)} kart` : ''}`, ...s.log],
            };
          },
          teach: 'Acil fonun varsa sürprizler kart borcuna dönüşmez.',
        },
        {
          label: 'Karta yaz',
          apply: (s) => ({ ...s, debt: s.debt + 1500, score: s.score - 1, stress: clamp(s.stress + 5, 0, 100), log: ['Tamir: +1.500 TL kart borcu', ...s.log] }),
          teach: 'Karta yazmak kısa vadede kolay, uzun vadede pahalı olabilir.',
        },
      ],
    },
    {
      title: 'Ek gelir',
      desc: 'Küçük freelance iş: +1.200 TL geldi.',
      choices: [
        {
          label: 'Borcu azalt',
          apply: (s) => {
            const pay = Math.min(s.debt, 1200);
            return { ...s, debt: s.debt - pay, cash: s.cash + (1200 - pay), score: s.score + 7, stress: clamp(s.stress - 4, 0, 100), log: [`Ek gelir borca gitti: -${money(pay)} borç`, ...s.log] };
          },
          teach: 'Ek geliri borca yönlendirmek toplam faiz yükünü azaltır.',
        },
        {
          label: 'Harca (keyif)',
          apply: (s) => ({ ...s, cash: s.cash + 1200, score: s.score + 1, stress: clamp(s.stress - 6, 0, 100), log: ['Ek gelir elde kaldı (harcama riski)', ...s.log] }),
          teach: 'Keyif harcaması kötü değil; ama borç varken öncelik dikkat ister.',
        },
      ],
    },
    {
      title: 'Arkadaş baskısı',
      desc: 'Dışarı çıkalım: 600 TL. Ne yaparsın?',
      choices: [
        {
          label: 'Gitme',
          apply: (s) => ({ ...s, score: s.score + 3, stress: clamp(s.stress + 1, 0, 100), log: ['Dışarı çıkılmadı (bütçe)', ...s.log] }),
          teach: 'Bütçe “hayır” diyebilmeyi de öğretir.',
        },
        {
          label: 'Git (nakit)',
          apply: (s) => {
            const cost = 600;
            if (s.cash < cost) return { ...s, debt: s.debt + cost, score: s.score - 2, stress: clamp(s.stress + 4, 0, 100), log: ['Dışarı: +600 TL kart (nakit yetmedi)', ...s.log] };
            return { ...s, cash: s.cash - cost, score: s.score + 1, stress: clamp(s.stress - 3, 0, 100), log: ['Dışarı: -600 TL nakit', ...s.log] };
          },
          teach: 'Keyif harcaması planlı olursa sorun olmaz; plansızsa karta yazılır.',
        },
      ],
    },
  ];
}

function pickCard(r: () => number, deck: EventCard[]): EventCard {
  return deck[Math.floor(r() * deck.length)]!;
}

export function CardEscape() {
  const [state, setState] = React.useState<State>(() => {
    const seed = Date.now() % 1000000;
    return {
      turn: 1,
      cash: 6000,
      debt: 8000,
      stress: 25,
      score: 0,
      log: ['Başlangıç: 8.000 TL kart borcu, 6.000 TL nakit.'],
      seed,
    };
  });

  const deck = React.useMemo(() => mkDeck(), []);
  const r = React.useMemo(() => rng(state.seed + state.turn * 1337), [state.seed, state.turn]);
  const card = React.useMemo(() => pickCard(r, deck), [r, deck]);

  const done = state.turn > 10;

  const endSummary = () => {
    const interest = interestOnDebt(state.debt);
    const net = state.cash - (state.debt + interest);
    let text = 'Fena değil.';
    if (net >= 2000 && state.debt < 6000) text = 'Harika: borcu kontrol ettin.';
    else if (state.debt >= 12000) text = 'Zor: borç büyüdü, asgari tuzağına dikkat.';
    return { interest, net, text };
  };

  const summary = endSummary();

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Kredi Kartı Kaçışı</Typography>
            <Chip size="small" label={`Skor ${state.score}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur (2–3 dk). Amaç: borcu büyütmeden ayı bitirmek.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`Tur ${Math.min(state.turn, 10)}/10`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Nakit: ${money(state.cash)}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Borç: ${money(state.debt)}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Stres: ${state.stress}%`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
          </Stack>
        </CardContent>
      </Card>

      {done ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>Bitti</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Ay sonu faiz (temsili): <b>{money(summary.interest)}</b>
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Net durum (nakit - borç - faiz): <b>{money(summary.net)}</b>
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              {summary.text}
            </Typography>
            <Button
              sx={{ mt: 1.5 }}
              variant="contained"
              onClick={() =>
                setState({
                  turn: 1,
                  cash: 6000,
                  debt: 8000,
                  stress: 25,
                  score: 0,
                  log: ['Başlangıç: 8.000 TL kart borcu, 6.000 TL nakit.'],
                  seed: (Date.now() % 1000000) + 7,
                })
              }
            >
              Tekrar oyna
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{card.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              {card.desc}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Stack spacing={1}>
              {card.choices.map((ch, i) => (
                <Button
                  key={i}
                  variant="outlined"
                  sx={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    setState((s) => {
                      // apply choice
                      let s2 = ch.apply(s);
                      // end-of-turn interest pressure (small)
                      if (s2.turn % 3 === 0 && s2.debt > 0) {
                        const inc = Math.round(s2.debt * 0.01);
                        s2 = { ...s2, debt: s2.debt + inc, log: [`Borç faizi birikti: +${money(inc)}`, ...s2.log] };
                      }
                      // teach line
                      s2 = { ...s2, log: [`Ders: ${ch.teach}`, ...s2.log] };
                      // next turn
                      return { ...s2, turn: s2.turn + 1 };
                    });
                  }}
                >
                  {ch.label}
                </Button>
              ))}
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
              Not: Bu oyun eğitim içindir. Rakamlar temsili.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Typography fontWeight={950}>Son olaylar</Typography>
          <Box sx={{ mt: 1 }}>
            {state.log.slice(0, 8).map((l, i) => (
              <Typography key={i} variant="body2" sx={{ opacity: 0.85 }}>
                • {l}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
