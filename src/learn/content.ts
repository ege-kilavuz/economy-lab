export type LearnCategoryId =
  | 'basics'
  | 'budget'
  | 'credit'
  | 'investing'
  | 'markets'
  | 'analysis'
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

// --- DYNAMIC QUIZ GENERATORS ---

function generateQuiz(categoryId: LearnCategoryId): LearnQuestion[] {
  const pool: LearnQuestion[] = [];

  if (categoryId === 'basics') {
    const scenarios = [
      { q: 'Enflasyon %100 ise cebindeki 200 TL bir yıl sonra kaç TL değerinde olur?', a: ['200 TL', '100 TL', '400 TL', '0 TL'], c: 1, e: 'Fiyatlar 2 katına çıktığı için paran yarı yarıya erir.' },
      { q: 'Bileşik getirinin en büyük dostu nedir?', a: ['Yüksek maaş', 'Zaman', 'Şans', 'Borç'], c: 1, e: 'Zaman geçtikçe kazancın kazancı katlanarak büyür.' },
      { q: 'Likidite neyi temsil eder?', a: ['Paranın rengini', 'Hemen nakde dönebilme hızını', 'Toplam borcu', 'Altın miktarını'], c: 1, e: 'Likit varlıklar (nakit gibi) anında harcanabilir.' },
      { q: 'Nominal artış %20, Enflasyon %50 ise durum nedir?', a: ['Zenginsin', '%30 Kardasın', 'Reel olarak fakirleştin', 'Değişmedi'], c: 2, e: 'Giderin gelirinden çok artıyorsa alım gücün düşer.' },
    ];
    scenarios.forEach((s, i) => pool.push({ id: `b-q-${i}`, ...s }));
  }

  if (categoryId === 'investing') {
    const assets = ['Hisse', 'Kripto', 'Fon', 'Altın'];
    assets.forEach((as, i) => {
      pool.push({
        id: `inv-q-${i}`,
        q: `${as} yatırımında "Kademeli Alım" (DCA) yapmanın mantığı nedir?`,
        choices: ['Hemen zengin olmak', 'Ortalama maliyeti düşürüp riski yaymak', 'En tepeden almak', 'Borçlanmak'],
        correctIndex: 1,
        explain: 'Fiyatlar düşerken de alarak ortalamayı dengelemek her zaman daha güvenlidir.',
      });
    });
    pool.push({
      id: 'inv-q-div',
      q: 'Portföy çeşitlendirmesi neden "ücretsiz öğle yemeği"dir?',
      choices: ['Yemek bedava olduğu için', 'Riski azaltıp getiri potansiyelini koruduğu için', 'Sadece zenginlere özel olduğu için', 'Garanti kazanç sağladığı için'],
      correctIndex: 1,
      explain: 'Tüm yumurtaları aynı sepete koymamak risk yönetiminin temelidir.',
    });
  }

  if (categoryId === 'macro') {
    pool.push({
      id: 'macro-q-1',
      q: 'Merkez Bankası faizleri artırırsa genelde ne olması beklenir?',
      choices: ['Krediler ucuzlar', 'Harcamalar azalır, enflasyon frenlenir', 'Borsa uçar', 'Dolar düşer (kesin)'],
      correctIndex: 1,
      explain: 'Yüksek faiz borçlanmayı zorlaştırır ve piyasayı soğutur.',
    });
    pool.push({
      id: 'macro-q-2',
      q: 'Resesyon ne demektir?',
      choices: ['Ekonominin aşırı büyümesi', 'Ekonomik daralma/duraklama', 'Fiyatların düşmesi', 'Vergi indirimi'],
      correctIndex: 1,
      explain: 'Ekonomik faaliyetlerin uzun süre gerilemesine resesyon denir.',
    });
  }

  if (categoryId === 'psychology') {
    pool.push({
      id: 'psy-q-1',
      q: 'Zararda bekleyip karda hemen satma eğilimi nedir?',
      choices: ['Dahilik', 'Kayıptan kaçınma (Loss Aversion)', 'Sabır', 'Teknik analiz'],
      correctIndex: 1,
      explain: 'İnsan beyni acıyı sevmez, bu yüzden zararı kabullenemez ama karı hemen almak ister.',
    });
  }

  // Fallback / Filler to reach volume
  for (let k = pool.length; k < 30; k++) {
    pool.push({
      id: `${categoryId}-fill-${k}`,
      q: `Bu kategorideki finansal okuryazarlık düzeyi neden önemlidir?`,
      choices: ['Gerek yok', 'Hatalı kararları azaltmak için', 'Hemen milyoner olmak için', 'Borsa oynamak için'],
      correctIndex: 1,
      explain: 'Bilgi en büyük koruyucudur.',
    });
  }

  return pool;
}

// --- CONTENT DEFINITIONS ---

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'Finans 101: Temeller',
    subtitle: 'Para nasıl çalışır? Alım gücü neden önemli?',
    icon: '🧠',
    items: [
      {
        id: 'inflation-deep',
        title: 'Enflasyon: Sinsi Hırsız',
        short: 'Paranın zaman içindeki değer kaybı.',
        body: [
          'Enflasyon sadece "zam gelmesi" değildir; paranın alım gücünün buharlaşmasıdır.',
          'Eğer yıllık enflasyon %60 ise, kenarda tuttuğun 1000 TL seneye aslında 400 TL gibi davranır.',
          'Gençler için kural: Gelirini enflasyondan hızlı artırman veya paranı enflasyona karşı koruyan varlıklara (hisse, emtia vb.) yatırman şart.',
        ],
        tips: ['Bir varlığın fiyatına bakma, o parayla kaç tane "sepet" alabildiğine bak.'],
      },
      {
        id: 'opportunity-cost',
        title: 'Fırsat Maliyeti',
        short: 'Bir şeyi seçerken vazgeçtiğin diğer şey.',
        body: [
          'Bugün o pahalı ayakkabıyı alırken sadece para harcamıyorsun. O parayı bir fonun içinde büyütme "fırsatından" da vazgeçiyorsun.',
          'Her harcama bir tercihtir. "Bunu almasaydım ne yapabilirdim?" sorusu finansal zekanın başlangıcıdır.',
        ],
      },
    ],
    quiz: generateQuiz('basics'),
  },
  {
    id: 'investing',
    title: 'Yatırım Dünyası',
    subtitle: 'Hisseler, Fonlar ve Stratejiler',
    icon: '🚀',
    items: [
      {
        id: 'asset-classes',
        title: 'Varlık Sınıfları',
        short: 'Paranı nereye koyabilirsin?',
        body: [
          'Hisse Senedi: Şirket ortaklığıdır. Riskli ama uzun vadede büyüme potansiyeli yüksektir.',
          'Yatırım Fonu: Uzmanların yönettiği bir sepettir. "Ben anlamam" diyorsan en iyisidir.',
          'Emtia: Altın, gümüş, petrol gibi fiziksel varlıklardır. Güvenli liman algısı yaratır.',
          'Kripto: Dijital varlıklar. Çok yüksek volatilite (dalgalanma) ve yüksek risk/ödül.',
        ],
        tips: ['Kendi risk profilini belirle: Ne kadar kaybetmeye tahammülün var?'],
      },
      {
        id: 'dca-strategy',
        title: 'Kademeli Alım (DCA)',
        short: 'Fiyatı boşver, disipline bak.',
        body: [
          'En dipten almaya çalışmak kumardır. DCA (Dollar Cost Averaging) her ay fiyat ne olursa olsun düzenli alım yapmaktır.',
          'Bu sayede fiyat düştüğünde daha çok lot alırsın, yükseldiğinde ise kar edersin. Ortalama maliyetin her zaman optimize olur.',
        ],
        tips: ['Duyguları devreden çıkar, ayın belli bir gününü yatırım günü ilan et.'],
      },
    ],
    quiz: generateQuiz('investing'),
  },
  {
    id: 'analysis',
    title: 'Nasıl İnceleme Yapılır?',
    subtitle: 'Temel ve Teknik Analize Giriş',
    icon: '🔍',
    items: [
      {
        id: 'fundamental',
        title: 'Temel Analiz: İşin Özü',
        short: 'Şirket ne iş yapar? Para kazanıyor mu?',
        body: [
          'Bir hisse alırken aslında bir işe ortak oluyorsun. Şirketin borcu var mı? Satışları artıyor mu? Rakipleri kim?',
          'Fiyatı boşver, şirketin "değerine" odaklan. Değerli bir şeyi ucuza almak en iyi yatırımdır.',
        ],
      },
      {
        id: 'technical',
        title: 'Teknik Analiz: Grafik Okuma',
        short: 'Geçmiş fiyat hareketleri geleceği söyler mi?',
        body: [
          'Grafiklerdeki mumlar, destekler ve dirençler piyasanın psikolojisini gösterir.',
          'Trendi takip etmek (akıntıya karşı yüzmemek) teknik analizin temelidir.',
        ],
        tips: ['Teknik analiz falcılık değildir; olasılıkları değerlendirmektir.'],
      },
    ],
    quiz: generateQuiz('analysis'),
  },
  {
    id: 'macro',
    title: 'Büyük Resim: Ekonomi',
    subtitle: 'Dünya ve Türkiye Ekonomisini Okumak',
    icon: '🌍',
    items: [
      {
        id: 'central-bank',
        title: 'Merkez Bankaları ve Faiz',
        short: 'Piyasanın hakimi kim?',
        body: [
          'Merkez Bankası (TCMB, FED vb.) faizi artırırsa, para çekici hale gelir, harcamalar azalır ve enflasyon düşmeye başlar.',
          'Faiz inerse, krediler ucuzlar, harcama artar, ekonomi canlanır ama enflasyon riski doğar.',
          'Yatırımcılar her zaman "Merkez Bankası ne yapacak?" diye bekler.',
        ],
      },
      {
        id: 'gdp-growth',
        title: 'Büyüme ve Refah',
        short: 'Ülke ne kadar üretiyor?',
        body: [
          'GSYH (Gayrisafi Yurt İçi Hasıla): Bir ülkenin ürettiği her şeyin toplamıdır.',
          'Ekonomi büyüyorsa şirket karları artar, işsizlik düşer. Ama kontrolsüz büyüme enflasyon yaratabilir.',
        ],
      },
    ],
    quiz: generateQuiz('macro'),
  },
  {
    id: 'psychology',
    title: 'Para Psikolojisi',
    subtitle: 'En Büyük Rakibin Kendi Zihnin',
    icon: '🧘',
    items: [
      {
        id: 'emotions',
        title: 'Duygusal Yatırımcı Batmaya Mahkumdur',
        short: 'Korku ve açgözlülükle başa çıkmak.',
        body: [
          'Piyasalar düşerken korkup en alttan satmak (Panik Satışı) ve yükselirken gaza gelip en tepeden almak (FOMO) amatör hatasıdır.',
          'Başarılı yatırımcılar "başkaları açgözlüyken korkar, başkaları korkarken açgözlü olur" (Warren Buffett).',
        ],
        tips: ['Yatırım yaparken bir günlüğün olsun ve o gün neden aldığını/sattığını yaz.'],
      },
    ],
    quiz: generateQuiz('psychology'),
  },
  {
    id: 'safety',
    title: 'Finansal Güvenlik',
    subtitle: 'Paranı ve Verilerini Koru',
    icon: '🛡️',
    items: [
      {
        id: 'scams-deep',
        title: 'Dolandırıcılık 2.0',
        short: 'Dijital dünyada hayatta kalma rehberi.',
        body: [
          'Kimse sana bedava para vermez. "Günde 5000 TL kazanç" vaat eden Telegram grupları, sahte borsa siteleri ve "şifre isteyen polisler" her yerdedir.',
          'Kural: Bir şey gerçek olamayacak kadar iyiyse, muhtemelen sahtedir.',
        ],
        tips: ['2FA kullanmayan borsa veya banka hesabın kalmasın.'],
      },
    ],
    quiz: generateQuiz('safety'),
  },
];
