export type LearnCategoryId =
  | 'basics'
  | 'budget'
  | 'credit'
  | 'investing'
  | 'markets'
  | 'stock-patterns'
  | 'macro'
  | 'psychology'
  | 'safety';

export type LearnItem = {
  id: string;
  title: string;
  short: string;
  body: string[];
  tips?: string[];
  warning?: string;
};

export type LearnQuestion = {
  id: string;
  q: string;
  choices: string[];
  correctIndex: number;
  explain: string;
  relatedItemIds?: string[];
};

export type LearnCategory = {
  id: LearnCategoryId;
  title: string;
  subtitle: string;
  icon: string;
  items: LearnItem[];
  quiz: LearnQuestion[];
};

// --- MASSIVE RANDOMIZED QUIZ GENERATORS ---

function generateBasicsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [];
  const assets = ['Ekmek', 'Hamburger', 'Telefon', 'İnternet Paketi', 'Konser Bileti', 'Spor Ayakkabı', 'Kahve'];
  const amounts = [100, 200, 500, 1000, 5000];

  // Template 1: Inflation calculation
  assets.forEach(a => {
    amounts.forEach(amt => {
      const inf = 20 + Math.floor(Math.random() * 80);
      const res = Math.round(amt * (1 + inf/100));
      pool.push({
        id: `b-inf-${a}-${amt}-${inf}`,
        q: `Bugün ${amt} TL olan bir ${a}, yıllık %${inf} enflasyon sonrası yaklaşık kaç TL olur?`,
        choices: [`${amt} TL`, `${res} TL`, `${amt * 2} TL`, `${Math.round(amt * 0.8)} TL`],
        correctIndex: 1,
        explain: `Enflasyon oranı (%${inf}) fiyatın üzerine eklenir. Paran eridi bro.`,
      });
    });
  });

  // Template 2: Real vs Nominal
  pool.push({
    id: 'b-rn-1',
    q: 'Maaşın %50 arttı ama hayat %100 pahalandı. Durum nedir?',
    choices: ['Zenginsin', 'Aynı kaldın', 'Reel olarak fakirleştin', 'Banka sana ödül verir'],
    correctIndex: 2,
    explain: 'Giderlerin gelirinden daha hızlı artıyorsa "alım gücün" düşmüş demektir.',
  });

  // Template 3: Liquidity
  const highLikit = ['Nakit', 'Banka Hesabı', 'Altın'];
  const lowLikit = ['Ev', 'Arsa', 'Antika Araba', 'Koleksiyon Kartı'];
  highLikit.forEach(h => {
    lowLikit.forEach(l => {
      pool.push({
        id: `b-liq-${h}-${l}`,
        q: `Acil bir ödeme yapman gerekiyor. Elinde ${h} ve ${l} var. Hangisini kullanmak daha mantıklıdır?`,
        choices: [l, h, 'İkisini de bekletirim', 'Kredi çekerim'],
        correctIndex: 1,
        explain: `${h} likiditesi yüksek olduğu için hemen harcanabilir. ${l}'i satmak haftalar sürebilir.`,
      });
    });
  });

  return pool;
}

function generateInvestingQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [];
  const assets = ['Bitcoin', 'Apple Hissesi', 'Altın Fonu', 'Gümüş', 'Ereğli Hissesi', 'Ethereum'];

  // Template 1: DCA strategy
  assets.forEach(a => {
    pool.push({
      id: `inv-dca-${a}`,
      q: `${a} yatırımında "Kademeli Alım" (DCA) yapmak neden duygularını korur?`,
      choices: [
        'En tepeden almanı sağladığı için',
        'Fiyat ne olursa olsun disiplinli alım yaparak ortalamayı dengelediği için',
        'Tek seferde zengin ettiği için',
        'Banka komisyon almadığı için'
      ],
      correctIndex: 1,
      explain: 'DCA sayesinde "eyvah düştü" yerine "ucuza aldım" dersin. Disiplin = Kar.',
    });
  });

  // Template 2: Diversification
  pool.push({
    id: 'inv-div-1',
    q: 'Bütün paranı tek bir Altcoin’e yatırmak neden risklidir?',
    choices: [
      'Banka izin vermez',
      'O proje batarsa bütün sermayeni kaybedersin',
      'Çok fazla kar edersin',
      'Vergisi çok olur'
    ],
    correctIndex: 1,
    explain: 'Risk yönetimi için yumurtaları farklı sepetlere (hisse, altın, fon) dağıtmalısın.',
  });

  return pool;
}

function generateStockPatternsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [];
  const patterns = [
    { n: 'Hammer (Çekiç)', s: 'Düşüş trendinin sonunda, destekte', m: 'Fiyatın aşağıyı denediğini ama alıcıların sert tepki verdiğini' },
    { n: 'Shooting Star', s: 'Yükseliş trendinin sonunda, dirençte', m: 'Fiyatın yukarıyı denediğini ama satıcıların baskın geldiğini' },
    { n: 'Marubozu', s: 'Herhangi bir yerdeki çok güçlü bir mumda', m: 'O yöndeki hareketin çok kararlı ve güçlü olduğunu' },
    { n: 'Doji', s: 'Kararsızlık anlarında', m: 'Alıcı ve satıcıların yenişemediğini, trendin dönebileceğini' },
  ];

  patterns.forEach(p => {
    pool.push({
      id: `sp-q-${p.n.replace(/\s+/g, '')}`,
      q: `Grafikte bir ${p.n} mumu gördün. Bu mum genelde neyi anlatır?`,
      choices: [
        'Borsanın kapandığını',
        'Piyasanın o yönde kararlı olduğunu/kararsız olduğunu (Mum tipine göre)',
        p.m,
        'Haberin yalan olduğunu'
      ],
      correctIndex: 2,
      explain: `${p.n} mumu ${p.s} görülürse anlamlıdır.`,
    });
  });

  // Variations with context
  pool.push({
    id: 'sp-ctx-1',
    q: 'Trend aşağı yönlüyken "Gravestone Doji" (Mezar Taşı) görmek ne anlama gelebilir?',
    choices: ['Yükseliş başlıyor', 'Düşüşün devam etme ihtimali yüksek, yukarı denemeler reddedildi', 'Her şeyi sat', 'Altın al'],
    correctIndex: 1,
    explain: 'Gravestone Doji, yukarı itişin satıcılar tarafından ezildiğini gösterir.',
  });

  return pool;
}

function generateCreditQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [];
  const cardAmounts = [5000, 10000, 20000, 50000];

  cardAmounts.forEach(amt => {
    pool.push({
      id: `cr-q-${amt}`,
      q: `${amt} TL kart borcun var ve sadece asgariyi ödedin. Kalan tutara ne olur?`,
      choices: ['Silinir', 'Dondurulur', 'Yüksek faiz işlemeye devam eder', 'Banka hediye puan verir'],
      correctIndex: 2,
      explain: 'Asgari ödeme seni sadece "gecikmeden" kurtarır, borcun sarmala girmesini engellemez.',
    });
  });

  pool.push({
    id: 'cr-score-1',
    q: 'Findeks kredi notun neden önemlidir?',
    choices: [
      'Sosyal medyada hava atmak için',
      'Bankadan daha düşük faizle veya daha kolay kredi çekebilmek için',
      'Market alışverişinde indirim almak için',
      'Telefonun şarjını hızlandırır'
    ],
    correctIndex: 1,
    explain: 'Kredi notun senin "finansal dürüstlük" karnendir.',
  });

  return pool;
}

function generateMacroQuiz(): LearnQuestion[] {
  return [
    {
      id: 'ma-q-1',
      q: 'Merkez Bankası faiz artırırsa paranın değeri genelde ne olur?',
      choices: ['Düşer', 'Artar', 'Değişmez', 'Yok olur'],
      correctIndex: 1,
      explain: 'Yüksek faiz, o parayı tutmayı daha çekici hale getirir.',
    },
    {
      id: 'ma-q-2',
      q: 'Ekonomide "Resesyon" neyi ifade eder?',
      choices: ['Aşırı büyümeyi', 'Ekonomik daralmayı ve işsizlik artışını', 'Altın fiyatlarının sabitlenmesini', 'Yaz tatilini'],
      correctIndex: 1,
      explain: 'Resesyon, ekonominin vites küçültmesi ve geri gitmesidir.',
    },
  ];
}

function generatePsychSafetyQuiz(): LearnQuestion[] {
  return [
    {
      id: 'ps-q-1',
      q: 'Tanımadığın birinden "Günde 5000 TL kazanmak ister misin?" mesajı geldi. Ne yaparsın?',
      choices: ['Hemen mesaj atarım', 'Kredi çekerim', 'Direkt engellerim, dolandırıcıdır', 'Arkadaşıma sorarım'],
      correctIndex: 2,
      explain: 'Kimse sana bedava veya aşırı kolay para vermez bro.',
    },
    {
      id: 'ps-q-2',
      q: 'Piyasada "FOMO" hissettiğinde en doğru hareket nedir?',
      choices: ['Hemen her şeyimi satmak', 'Hemen alım yapmak', 'Ekranı kapatıp sakinleşmek ve planı beklemek', 'Borç almak'],
      correctIndex: 2,
      explain: 'Duyguyla yapılan işlem genelde "tepeden alma" ile sonuçlanır.',
    },
  ];
}

// --- CONTENT DEFINITIONS ---

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'TEMELLER & FAİZ',
    subtitle: 'Para nasıl erir, nasıl büyür?',
    icon: '🧠',
    items: [
      {
        id: 'inflation',
        title: 'ENFLASYON',
        short: 'Paranın sinsi düşmanı.',
        body: [
          'Enflasyon, her şeyin fiyatının artması değil, paranın "değer kaybetmesidir".',
          'Bro olay şu: Maaşın %30 artırken her şey %60 artıyorsa aslında her ay daha çok fakirleşiyorsun.',
          'Reel değer, cebindeki TL değil o TL ile kaç hamburger alabildiğindir.',
        ],
        tips: ['Alım gücünü korumak için yatırım yapman şart.'],
      },
      {
        id: 'interest-basic',
        title: 'FAİZ & BİLEŞİK ETKİ',
        short: 'Einstein’ın 8. harikası.',
        body: [
          'Faiz, parayı kullanmanın kira bedelidir.',
          'Bileşik etki ise kazancının da kazanç getirmesidir. Kar topu gibi büyür.',
          'Zaman bu işin en büyük hilesidir (cheat code). Ne kadar erken, o kadar stonks.',
        ],
      },
      {
        id: 'liquidity',
        title: 'LİKİDİTE',
        short: 'Paraya hemen ulaşabilmek.',
        body: [
          'Nakit en likit varlıktır. Ev/Arsa ise likiditesi en düşük olandır.',
          'Acil bir şey olduğunda evini 5 dakikada satamazsın ama bankadaki parayı hemen harcarsın.',
        ],
      },
    ],
    quiz: generateBasicsQuiz(),
  },
  {
    id: 'budget',
    title: 'PARA YÖNETİMİ',
    subtitle: 'Bütçeni yap, patron ol.',
    icon: '💸',
    items: [
      {
        id: '50-30-20',
        title: '50/30/20 KURALI',
        short: 'Bütçe yapmanın en kolay yolu.',
        body: [
          '%50 İhtiyaç (Kira, fatura, gıda).',
          '%30 İstek (Konser, oyun, dışarıda yemek).',
          '%20 Gelecek (Yatırım ve borç kapatma).',
        ],
        tips: ['Bu oranlar kutsal değil, kendine göre esnetebilirsin ama %20 altına düşmemeye çalış.'],
      },
      {
        id: 'emergency-fund',
        title: 'ACİL DURUM FONU',
        short: 'Kötü gün kalkanı.',
        body: [
          'Hayat bazen tokat atar: telefon bozulur, sağlık masrafı çıkar.',
          'Acil durum fonun yoksa kredi kartına sarılırsın, sonra faiz sarmalına girersin.',
          'Hedef: En az 3 aylık temel giderini kenara koy.',
        ],
      },
    ],
    quiz: generateBasicsQuiz(),
  },
  {
    id: 'credit',
    title: 'KREDİ & KARTLAR',
    subtitle: 'Bankalarla aranı iyi tut.',
    icon: '💳',
    items: [
      {
        id: 'min-pay',
        title: 'ASGARİ ÖDEME TUZAĞI',
        short: 'Bitmeyen borç sarmalı.',
        body: [
          'Asgariyi ödediğinde sadece gecikmeye düşmezsin ama borcun ana kısmı durur ve deli gibi faiz biner.',
          'Her ay asgari ödemek, süzgeçle havuz doldurmaya çalışmaktır.',
        ],
        tips: ['Her zaman kart borcunun tamamını kapatmaya çalış.'],
      },
      {
        id: 'credit-score',
        title: 'KREDİ NOTU (FİNDEKS)',
        short: 'Senin finansal karizman.',
        body: [
          'Ödemelerini aksatırsan kredi notun düşer. Notun düşükse banka sana kredi vermez veya yüksek faiz ister.',
          'Zamanında ödenen her fatura ve taksit puanını artırır.',
        ],
      },
    ],
    quiz: generateCreditQuiz(),
  },
  {
    id: 'investing',
    title: 'YATIRIM DÜNYASI',
    subtitle: 'Para senin için çalışsın.',
    icon: '🚀',
    items: [
      {
        id: 'dca',
        title: 'KADEMELİ ALIM (DCA)',
        short: 'Fiyatı boşver, disipline bak.',
        body: [
          'DCA: Dollar Cost Averaging. Her ay fiyat ne olursa olsun sabit miktarda alım yapmaktır.',
          'Fiyat düştüğünde daha çok, yükseldiğinde daha az alırsın. Sonuç: Ortalama maliyetin her zaman iyileşir.',
        ],
        tips: ['Piyasayı izleyip strese girmek yerine otomatiğe bağla.'],
      },
      {
        id: 'diversification',
        title: 'ÇEŞİTLENDİRME',
        short: 'Tüm yumurtalar aynı sepete konmaz.',
        body: [
          'Sadece bir coin veya bir hisse alırsan, o batarsa sen de batarsın.',
          'Portföyünü hisse, fon, altın ve döviz olarak bölüştür ki bir taraf düşerken diğeri seni tutsun.',
        ],
      },
    ],
    quiz: generateInvestingQuiz(),
  },
  {
    id: 'stock-patterns',
    title: 'MUMLAR & GRAFİKLER',
    subtitle: 'Grafik okuma rehberi.',
    icon: '🕯️',
    items: [
      {
        id: 'candle-intro',
        title: 'MUM ÇUBUKLARI NEDİR?',
        short: 'Fiyatın o anki ruh hali.',
        body: [
          'Mumlar belirli bir sürede fiyatın nereden açılıp nerede kapandığını gösterir.',
          'Gövde gerçek hareketi, fitiller (iğneler) ise fiyatın oraya kadar gidip reddedildiğini gösterir.',
        ],
      },
      {
        id: 'doji-deep',
        title: 'DOJİ',
        short: 'Kararsızlık simgesi.',
        body: [
          'Açılış ve kapanış fiyatı birbirine çok yakındır. Artı (+) şekline benzer.',
          'Alıcılar ve satıcılar yenişememiş demektir. Genelde yön değişikliği sinyalidir ama teyit şarttır.',
        ],
      },
      {
        id: 'hammer-deep',
        title: 'ÇEKİÇ (HAMMER)',
        short: 'Düşüş bitiyor mu?',
        body: [
          'Küçük bir gövde ve altında çok uzun bir fitil olur.',
          'Fiyat çok düşmüş ama alıcılar "hop" deyip yukarı çekmiş demektir. Destek seviyesinde görülürse "al" sinyali olabilir.',
        ],
      },
      {
        id: 'shooting-star-deep',
        title: 'SHOOTING STAR',
        short: 'Kayan Yıldız.',
        body: [
          'Hammer’ın tam tersidir. Üst fitil çok uzundur. Yükselişin sonunda görülürse satıcıların baskın geldiğini gösterir.',
        ],
      },
      {
        id: 'marubozu-deep',
        title: 'MARUBOZU',
        short: 'Tek tarafın mutlak hakimiyeti.',
        body: [
          'Neredeyse hiç fitili olmayan tam bir gövdedir.',
          'Yeşilse alıcılar, kırmızıysa satıcılar piyasayı tamamen ele geçirmiş demektir. Hareketin devamı beklenir.',
        ],
      },
    ],
    quiz: generateStockPatternsQuiz(),
  },
  {
    id: 'macro',
    title: 'EKONOMİ VE MERKEZ BANKASI',
    subtitle: 'Büyük resme odaklan.',
    icon: '🌍',
    items: [
      {
        id: 'cb-faiz',
        title: 'MERKEZ BANKASI VE FAİZ',
        short: 'Piyasanın hakimi.',
        body: [
          'Merkez Bankası faizi artırırsa paranın değeri artar, kredi çekmek zorlaşır, harcamalar azalır.',
          'Amaç: Piyasayı soğutmak ve enflasyonu düşürmek.',
        ],
      },
      {
        id: 'growth-gdp',
        title: 'EKONOMİK BÜYÜME (GSYH)',
        short: 'Ülke ne kadar üretiyor?',
        body: [
          'GSYH bir ülkenin 1 yılda ürettiği her şeydir. Büyüme artarsa şirketler daha çok kazanır, işsizlik düşer.',
        ],
      },
    ],
    quiz: generateMacroQuiz(),
  },
  {
    id: 'psychology',
    title: 'YATIRIM PSİKOLOJISI',
    subtitle: 'Kendi zihnini yen.',
    icon: '🧘',
    items: [
      {
        id: 'fomo-deep',
        title: 'FOMO',
        short: 'Fırsatı kaçırma korkusu.',
        body: [
          'Arkadaşın "coin uçuyor" dediğinde gaza gelip en tepeden almandır.',
          'Unutma: Herkes alırken satmak, herkes korkarken almak zordur ama kazandırır.',
        ],
        tips: ['Duyguların tavan yaptığında işlem yapma, 24 saat bekle.'],
      },
      {
        id: 'loss-aversion',
        title: 'KAYIPTAN KAÇINMA',
        short: 'Zararı kabul edememek.',
        body: [
          'İnsan beyni zararı kabullenmektense o pozisyonda batmayı tercih edebilir.',
          'Doğru yatırımcı hata yaptığını anladığı an stop olur (zarar durdur).',
        ],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
  {
    id: 'safety',
    title: 'GÜVENLİK',
    subtitle: 'Paranı çaldırma.',
    icon: '🛡️',
    items: [
      {
        id: 'phishing-deep',
        title: 'OLTALAMA (PHISHING)',
        short: 'Linklere dikkat.',
        body: [
          'Dolandırıcılar banka/kargo gibi davranıp sana sahte link atar.',
          'Şifreni girdiğin an geçmiş olsun. 2FA (Çift Faktörlü Doğrulama) mutlaka açık olsun.',
        ],
        tips: ['Resmi kurumlar asla mesajla şifre istemez.'],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
];
