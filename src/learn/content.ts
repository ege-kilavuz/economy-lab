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

// --- GEN-Z QUIZ GENERATOR HELPERS ---
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBasicsQuiz(): LearnQuestion[] {
  return [
    { id: 'bq1', q: 'Reel gelir ne demektir?', choices: ['Cepteki para miktarı', 'Paranın alabildiği mal miktarı', 'Banka puanı', 'Maaş zammı'], correctIndex: 1, explain: 'Nominal rakam değil, alım gücü önemlidir.' },
    { id: 'bq2', q: 'Bileşik faiz için en önemli değişken nedir?', choices: ['Yüksek anapara', 'Zaman/Süre', 'Şans', 'Banka adı'], correctIndex: 1, explain: 'Zaman en büyük çarpandır, kartopu etkisi yaratır.' },
    { id: 'bq3', q: 'Likidite neyi anlatır?', choices: ['Paranın rengini', 'Varlığın nakde dönme hızını', 'Toplam borcu', 'Enflasyonu'], correctIndex: 1, explain: 'Likit varlık (nakit gibi) anında harcanabilir.' },
  ];
}

function generateStockQuiz(): LearnQuestion[] {
  return [
    { id: 'sq1', q: 'Çekiç (Hammer) mumu nerede daha anlamlıdır?', choices: ['Yükselişin tepesinde', 'Düşüş trendinin sonunda/destekte', 'Yatay piyasada', 'Hafta sonu'], correctIndex: 1, explain: 'Düşüşten sonra alıcı tepkisini gösterir.' },
    { id: 'sq2', q: 'Marubozu mumu neyi temsil eder?', choices: ['Kararsızlık', 'Sert ve kararlı bir hareket', 'Borsa kapanışı', 'Haber beklentisi'], correctIndex: 1, explain: 'Fitilsiz gövde, o yöndeki mutlak gücü gösterir.' },
    { id: 'sq3', q: 'Doji mumu gördüğünüzde ne yapmalısınız?', choices: ['Hemen her şeyi satın', 'Hemen her şeyi alın', 'Kararsızlık var, teyit bekleyin', 'Uygulamayı kapatın'], correctIndex: 2, explain: 'Açılış/Kapanış aynıysa güçler dengededir, yön belli değildir.' },
  ];
}

function generateCreditQuiz(): LearnQuestion[] {
  return [
    { id: 'cq1', q: 'Kredi kartı asgari tutarını ödemek borcu bitirir mi?', choices: ['Evet', 'Hayır, kalan borca faiz biner', 'Bazen', 'Banka siler'], correctIndex: 1, explain: 'Asgari sadece gecikmeye düşmeni engeller, borç sarmalı yaratır.' },
    { id: 'cq2', q: 'Limitin tamamını kullanmak neden risklidir?', choices: ['Banka kızar', 'Acil durumda yerin kalmaz', 'Puanın artar', 'Daha çok kazandırır'], correctIndex: 1, explain: 'Limit doluysa manevra alanın sıfıra iner.' },
  ];
}

// --- FULL DATASET ---

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
          'Bro olay şu: Maaşın %30 artarken her şey %60 artıyorsa aslında her ay daha çok fakirleşiyorsun.',
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
    quiz: generateBasicsQuiz(), // Placeholder mix
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
    quiz: generateStockQuiz(),
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
    quiz: generateStockQuiz(),
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
    quiz: generateBasicsQuiz(),
  },
  {
    id: 'psychology',
    title: 'YATIRIM PSİKOLOJİSİ',
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
    quiz: generateBasicsQuiz(),
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
    quiz: generateBasicsQuiz(),
  },
];
