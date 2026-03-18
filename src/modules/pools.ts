// Shared question pools (expandable).
// Goal: large pools so each 10-question run feels fresh.

export type NewsNoiseItem = {
  id: string;
  title: string;
  context: string;
  correct: 'signal' | 'noise';
  why: string;
  rule: string;
};

export type ScamChoiceId = 'click' | 'verify' | 'ignore' | 'block';

export type ScamScenario = {
  id: string;
  channel: 'SMS' | 'DM' | 'E-posta' | 'Arama';
  message: string;
  detail: string;
  best: ScamChoiceId;
  why: string;
  rule: string;
};

function uniqById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
}

function cartesian<T, U>(a: T[], b: U[]): Array<[T, U]> {
  const out: Array<[T, U]> = [];
  for (const x of a) for (const y of b) out.push([x, y]);
  return out;
}

function expandNewsNoise(): NewsNoiseItem[] {
  const assets = [
    'Altın',
    'Dolar',
    'Borsa',
    'BIST100',
    'Yatırım Fonu',
    'Hisse Senedi',
    'Vadeli Mevduat',
    'BES',
    'Devlet Tahvili',
    'Gümüş',
    'Konut Yatırımı',
    'Sektör Endeksi',
  ] as const;
  const urgency = [
    'Hemen',
    'Son şans',
    '10 dakika',
    'Geç kalma',
    'Şimdi',
    'Kaçırma',
    'Fırsat bu',
    'Az kaldı',
  ] as const;
  const shortDomains = ['bit.ly', 'tinyurl.com', 'cutt.ly', 't.co', 'rb.gy', 'v.gd'] as const;
  const anonymousSources = [
    'anon Telegram',
    'anon X hesabı',
    'kapalı Discord',
    'WhatsApp zinciri',
    'Reddit duyumu',
    'TikTok analisti',
    'YouTube yorumu',
    'Instagram magazin',
  ] as const;

  const base: NewsNoiseItem[] = [
    {
      id: 'official-rate',
      title: 'Merkez bankası faiz kararını açıkladı (resmî site).',
      context: 'Kaynak: resmî duyuru + tutanak linki.',
      correct: 'signal',
      why: 'Birincil kaynak + doğrulanabilir doküman = yüksek güven.',
      rule: 'Kural: Birincil kaynak > yorum > söylenti.',
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
      id: 'earnings',
      title: 'Şirket bilanço açıkladı: gelir/kar beklentiden farklı.',
      context: 'Kaynak: KAP/EDGAR linkli haber + rakamlar.',
      correct: 'signal',
      why: 'Doğrulanabilir veri var. Yorum farklı olabilir ama veri gerçek.',
      rule: 'Kural: Veri ayrı, yorum ayrı.',
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
      id: 'chart-only',
      title: '“Grafik böyle, kesin yükselir” (tek ekran görüntüsü).',
      context: 'Kaynak: sosyal medya. Zaman aralığı/bağlam yok.',
      correct: 'noise',
      why: 'Bağlamsız tek görüntü yanıltıcı olabilir. Seçici gösterim (cherry-pick) riski.',
      rule: 'Kural: Bağlam yoksa güven azalır.',
    },
  ];

  const rumorPack: NewsNoiseItem[] = [];
  for (const [asset, src] of cartesian(assets as any, anonymousSources as any)) {
    for (const u of urgency) {
      rumorPack.push({
        id: `rumor-${asset}-${src}-${u}`.replace(/\s+/g, '_').toLowerCase(),
        title: `“${asset} ${u.toLowerCase()} ${u === '10 dakika' ? '10x' : 'uçacak'}!”`,
        context: `Kaynak: ${src}. Ton: “${u} gir”. Kanıt yok.`,
        correct: 'noise',
        why: 'Belirsiz kaynak + kesin vaat + aciliyet = manipülasyon riski. Doğrulama yok.',
        rule: 'Kural: Kaynak + kanıt yoksa “acil” demesi daha da şüpheli.',
      });
    }
  }

  const linkPack: NewsNoiseItem[] = [];
  for (const d of shortDomains) {
    for (const a of assets) {
      linkPack.push({
        id: `link-${d}-${a}`.replace(/\s+/g, '_').toLowerCase(),
        title: `“${a} için özel sinyal raporu”`,
        context: `Kaynak: sponsorlu gönderi. Link: ${d}/...`,
        correct: 'noise',
        why: 'Kısa link + sponsorlu içerik + “özel rapor” = satış/pazarlama riski.',
        rule: 'Kural: Link değil, kaynak ve kanıt önemli.',
      });
    }
  }

  const methodologyPack: NewsNoiseItem[] = [];
  const topics = [
    'harcama alışkanlıkları',
    'borçlanma',
    'tasarruf',
    'enflasyon algısı',
    'finans okuryazarlığı',
    'vergi paketi',
    'asgari ücret',
    'kredi notu',
    'dış ticaret',
    'faiz beklentisi',
  ] as const;
  const orgs = [
    'üniversite raporu',
    'STK raporu',
    'kamu istatistiği',
    'hakemli makale özeti',
    'Yatırım bankası',
    'derecelendirme kuruluşu',
    'bağımsız araştırma',
  ] as const;
  for (const [t, o] of cartesian(topics as any, orgs as any)) {
    methodologyPack.push({
      id: `report-${t}-${o}`.replace(/\s+/g, '_').toLowerCase(),
      title: `Rapor: “${t}” (${o})`,
      context: 'Örneklem + tarih + yöntem belirtilmiş.',
      correct: 'signal',
      why: 'Metodoloji ve tarih verilirse güven artar (yine de %100 değil).',
      rule: 'Kural: Metodoloji + tarih = kalite göstergesi.',
    });
  }

  return uniqById([...base, ...rumorPack, ...linkPack, ...methodologyPack]);
}

function expandScamRadar(): ScamScenario[] {
  const institutions = [
    'banka',
    'kargo',
    'e-Devlet',
    'vergi dairesi',
    'telefon operatörü',
    'kripto borsası',
    'HGS/OGS',
    'Netflix',
    'iCloud',
    'Sigorta Şirketi',
    'Sağlık Bakanlığı',
    'Tapu Dairesi',
    'Amazon',
    'Trendyol',
  ] as const;
  const shortDomains = ['bit.ly', 'tinyurl.com', 'cutt.ly', 't.co', 'url.co', 'shrt.it'] as const;
  const times = ['5 dk', '10 dk', '15 dk', '1 saat', 'hemen', 'bugün', 'yarın'] as const;
  const channels: ScamScenario['channel'][] = ['SMS', 'DM', 'E-posta', 'Arama'];

  const base: ScamScenario[] = [
    {
      id: 'support-call-otp',
      channel: 'Arama',
      message: '“Ben bankadan arıyorum, kart güvenliğiniz için şifre/OTP söyleyin.”',
      detail: 'Arayan kişi acele ettiriyor.',
      best: 'block',
      why: 'Bankalar şifre/OTP istemez. Kapat, resmî numarayı sen ara.',
      rule: 'Kural: Şifre/OTP isteniyorsa %99 dolandırıcı.',
    },
    {
      id: 'apk-update',
      channel: 'DM',
      message: '“Güncelleme APK’sı burada, indir.”',
      detail: 'Resmî mağaza linki yok; direkt APK indirtiyor.',
      best: 'block',
      why: 'Bilinmeyen APK’lar zararlı olabilir. Resmî mağazadan yükle.',
      rule: 'Kural: APK indirten mesajlara güvenme.',
    },
  ];

  const smsLinkPack: ScamScenario[] = [];
  for (const inst of institutions) {
    for (const d of shortDomains) {
      for (const t of times) {
        smsLinkPack.push({
          id: `sms-${inst}-${d}-${t}`.replace(/\s+/g, '_').toLowerCase(),
          channel: 'SMS',
          message: `“${inst} hesabınızda sorun var. ${t} içinde doğrulayın.”`,
          detail: `Link: ${d}/...  Gönderen numara garip.`,
          best: 'verify',
          why: 'Acil baskı + kısa link = risk. Resmî uygulama/numaradan kontrol et.',
          rule: 'Kural: Panik mesajında linke tıklama; sen resmî kanalı aç.',
        });
      }
    }
  }

  const dmMoneyPack: ScamScenario[] = [];
  const excuses = [
    'acil hastane',
    'cüzdanım kayboldu',
    'kartım çalışmıyor',
    'kargom takıldı',
    'trafik cezası',
    'telafi ödemesi',
    'hediye çeki',
    'yardım kampanyası',
    'kira ödemesi',
    'borç kapama',
  ] as const;
  for (const e of excuses) {
    dmMoneyPack.push({
      id: `dm-acil-para-${e}`.replace(/\s+/g, '_').toLowerCase(),
      channel: 'DM',
      message: `“Acil ${e}. 2.000 TL atar mısın? IBAN yazıyorum.”`,
      detail: 'Normalde böyle yazmıyor; sesli arama yapmıyor.',
      best: 'verify',
      why: 'Hesap ele geçirilmiş olabilir. Para göndermeden önce ikinci kanaldan doğrula.',
      rule: 'Kural: “Acil para” → mutlaka arayıp doğrula.',
    });
  }

  const emailPack: ScamScenario[] = [];
  const attachments = ['.zip', '.exe', '.js', '.iso', '.bat', '.scr', '.vbs', '.docm', '.xlsm'] as const;
  for (const [inst, ext] of cartesian(institutions as any, attachments as any)) {
    emailPack.push({
      id: `mail-${inst}-${ext}`.replace(/\s+/g, '_').toLowerCase(),
      channel: 'E-posta',
      message: `“${inst} bildirimi: dosyayı açıp doğrulayın.”`,
      detail: `Ek dosya: ${ext} (beklenmedik). Gönderen domain şüpheli.`,
      best: 'ignore',
      why: 'Beklenmeyen ekler zararlı olabilir. Açmadan önce doğrula.',
      rule: 'Kural: Beklenmeyen ek = risk. Açma.',
    });
  }

  // cross-channel variants (adds volume while staying understandable)
  const cross: ScamScenario[] = [];
  for (const inst of institutions) {
    for (const ch of channels) {
      cross.push({
        id: `x-${inst}-${ch}`.replace(/\s+/g, '_').toLowerCase(),
        channel: ch,
        message: `“${inst} destek: hesabınız kilitlendi, işlem başlatın.”`,
        detail: 'Kimlik belirsiz. “Hemen” tonu var.',
        best: 'verify',
        why: 'Kimliği sen doğrulamalısın. Resmî uygulama/numaradan kontrol et.',
        rule: 'Kural: “Ben aradım” diyen değil, “sen arayan” güvenli.',
      });
    }
  }

  return uniqById([...base, ...smsLinkPack, ...dmMoneyPack, ...emailPack, ...cross]);
}

export const NEWS_NOISE_POOL: NewsNoiseItem[] = expandNewsNoise();
export const SCAM_RADAR_POOL: ScamScenario[] = expandScamRadar();
