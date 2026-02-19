export type LearnCategoryId =
  | 'basics'
  | 'budget'
  | 'credit'
  | 'markets'
  | 'stock-patterns'
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

function generateBasicsQuiz(): LearnQuestion[] {
  const assets = ['Anapara', 'Yatırım', 'Birikim', 'Maaş', 'Bütçe'];
  const pool: LearnQuestion[] = [
    {
      id: 'basics-q-inf-1',
      q: 'Enflasyon %50 ise, bugün 100 TL olan sepet bir yıl sonra kaç TL olur?',
      choices: ['100 TL', '125 TL', '150 TL', '200 TL'],
      correctIndex: 2,
      explain: 'Enflasyon oranı kadar fiyat artışı beklenir.',
    },
    {
      id: 'basics-q-real-1',
      q: 'Maaşınız %20 arttı ama enflasyon %40. Reel durumunuz nedir?',
      choices: ['%20 kardayım', 'Değişmedi', 'Alım gücüm düştü', 'Zengin oldum'],
      correctIndex: 2,
      explain: 'Enflasyon maaş artışından yüksekse alım gücü azalır.',
    },
  ];
  assets.forEach((a, i) => {
    pool.push({
      id: `basics-gen-${i}`,
      q: `${a} miktarınız nominal olarak aynı kalsa ama fiyatlar artsa ne olur?`,
      choices: ['Değeri artar', 'Reel değeri düşer', 'Hiçbir şey olmaz', 'Borç biter'],
      correctIndex: 1,
      explain: 'Rakam aynı kalsa bile alım gücü (reel değer) enflasyonla erir.',
    });
  });
  for (let k = 0; k < 30; k++) {
    pool.push({
      id: `basics-filler-${k}`,
      q: `Finansal okuryazarlıkta ${k % 2 === 0 ? 'Bileşik Etki' : 'Likidite'} neden önemlidir?`,
      choices: ['Önemsizdir', 'Zamanla parayı büyütür/hız kazandırır', 'Sadece bankalar içindir', 'Vergiyi artırır'],
      correctIndex: 1,
      explain: 'Temel kavramlar finansal sağlığın temelidir.',
    });
  }
  return pool;
}

function generateBudgetQuiz(): LearnQuestion[] {
  const items = ['Netflix', 'Spor Salonu', 'Bulut Depolama', 'Yemek Aboneliği', 'Oyun Üyeliği'];
  const pool: LearnQuestion[] = [];
  items.forEach((it, i) => {
    pool.push({
      id: `budget-gen-${i}`,
      q: `Ayda 150 TL olan ${it} aboneliğini kullanmıyorsanız yıllık kaybınız nedir?`,
      choices: ['150 TL', '500 TL', '1800 TL', '0 TL'],
      correctIndex: 2,
      explain: 'Küçük gibi görünen aylık harcamalar yıllık bazda büyük birikir.',
    });
  });
  for (let k = 0; k < 40; k++) {
    pool.push({
      id: `budget-filler-${k}`,
      q: `Bütçenizde ${k % 3 === 0 ? 'Acil Durum Fonu' : 'İstekler'} için hangisi doğrudur?`,
      choices: ['Gereksizdir', 'Önce planlanmalıdır', 'Borçla yapılmalıdır', 'En son düşünülür'],
      correctIndex: 1,
      explain: 'Planlı bütçe finansal özgürlüğün ilk adımıdır.',
    });
  }
  return pool;
}

function generatePsychSafetyQuiz(): LearnQuestion[] {
  const scams = ['SMS', 'E-posta', 'WhatsApp', 'Arama'];
  const pool: LearnQuestion[] = [];
  scams.forEach((s, i) => {
    pool.push({
      id: `safety-gen-${i}`,
      q: `${s} üzerinden gelen "Hesabınız kilitlendi, linke tıklayın" mesajına ne yapılmalı?`,
      choices: ['Hemen tıklanmalı', 'Mesaj silinmeli/doğrulanmalı', 'Şifre yazılmalı', 'Arkadaşa gönderilmeli'],
      correctIndex: 1,
      explain: 'Aciliyet hissi uyandıran linkler genelde oltalamadır.',
    });
  });
  const emotions = ['FOMO', 'FUD', 'Açgözlülük', 'Korku'];
  emotions.forEach((e, i) => {
    pool.push({
      id: `psych-gen-${i}`,
      q: `Piyasada ${e} etkisiyle karar vermek genelde neye yol açar?`,
      choices: ['Yüksek kazanca', 'Hatalı ve riskli işlemlere', 'Sakinliğe', 'Bilimsel analize'],
      correctIndex: 1,
      explain: 'Duygular rasyonel kararların en büyük düşmanıdır.',
    });
  });
  return pool;
}

function generateMarketCandleQuiz(): LearnQuestion[] {
  const assets = ['Altın', 'Bitcoin', 'Hisse Senedi', 'Dolar', 'Gümüş'];
  const pool: LearnQuestion[] = [];
  assets.forEach((a, i) => {
    pool.push({
      id: `market-gen-${i}`,
      q: `${a} fiyatı bir günde %20 düşerse bu hangi kavramla açıklanır?`,
      choices: ['Sabit fiyat', 'Yüksek volatilite', 'Likidite', 'Nominal artış'],
      correctIndex: 1,
      explain: 'Hızlı ve büyük fiyat hareketlerine volatilite denir.',
    });
  });
  const patterns = ['Hammer', 'Shooting Star', 'Doji', 'Marubozu'];
  patterns.forEach((p, i) => {
    pool.push({
      id: `candle-gen-${i}`,
      q: `Grafikte bir ${p} mumu görmek ne anlama gelebilir?`,
      choices: ['Kesin yükselecek', 'Kesin düşecek', 'Bir potansiyel sinyal ama teyit şart', 'Borsa kapanacak'],
      correctIndex: 2,
      explain: 'Tek bir mum asla kesinlik ifade etmez, bağlam ve teyit mumu gerekir.',
    });
  });
  return pool;
}

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'Temel Kavramlar',
    subtitle: 'Enflasyon, faiz, risk, bileşik etki… (örnekli, genç dilinde)',
    icon: '🧠',
    items: [
      {
        id: 'inflation',
        title: 'Enflasyon & Alım Gücü',
        short: 'Fiyatlar artınca aynı parayla daha az şey alırsın.',
        body: [
          'Enflasyon: genel fiyatların zamanla artması. Tek bir üründen değil, “sepetten” bahsediyoruz.',
          'Örnek: Geçen ay 100 TL’ye aldığın sepet bu ay 120 TL ise, aynı maaşla daha az ürün alırsın.',
          'Bu yüzden maaşa değil “maaşın ne alabildiğine” bakılır: reel gelir / alım gücü.',
          'Bütçe yaparken önce zorunluları (kira, fatura, gıda) garantiye almak en güvenli adımdır.',
        ],
        tips: [
          'Kendi sepetini yap: her ay aynı 10 ürünü takip et. Enflasyonu gözünle görürsün.',
          'Fiyat artışı görünce panik alışveriş yerine planlı alım yap.',
        ],
      },
      {
        id: 'nominal-real',
        title: 'Nominal vs Reel',
        short: 'Nominal “rakam”, reel “gerçek satın alma gücü”.',
        body: [
          'Nominal: cebindeki TL miktarı / maaş rakamı.',
          'Reel: o parayla ne alabildiğin.',
          'Maaşın %30 arttı ama fiyatlar %60 arttıysa reel olarak geriye gidebilirsin.',
        ],
        tips: ['Kendini kıyaslarken “bu maaşla kaç sepet alıyorum?” gibi sorular daha nettir.'],
      },
      {
        id: 'interest',
        title: 'Faiz & Bileşik Etki',
        short: 'Faiz, paranın zaman bedeli. Borçta maliyet, birikimde büyüme.',
        body: [
          'Faiz, “bugün 100 TL” ile “1 ay sonra 100 TL” aynı değil demektir.',
          'Borçta: para kullanmanın maliyeti faize dönüşür.',
          'Birikimde: para zamanla büyüyebilir (risk var).',
          'Bileşik etki: kazanç/ faiz anaparaya eklenir ve sonraki dönemde onun da getirisi olur.',
        ],
        tips: [
          'Kart borcunda asgari ödeme borcu bitirmez; maliyeti uzatabilir.',
          'Vade uzadıkça toplam geri ödeme çoğu zaman artar.',
        ],
      },
      {
        id: 'compound',
        title: 'Bileşik Getiri (Kısaca)',
        short: 'Kartopu etkisi: zaman en büyük çarpan.',
        body: [
          'Bileşik getiri: kazançların da kazanç üretmesi.',
          'Erken başlamak avantajdır çünkü süre büyüktür.',
          'Ama her büyüme garantili değildir: riskli varlıklarda iniş-çıkış olur.',
        ],
        tips: ['Düzenli küçük birikim çoğu kişi için daha sürdürülebilir.'],
      },
      {
        id: 'risk',
        title: 'Risk & Volatilite',
        short: 'Kazanç ihtimali artınca dalgalanma da artar.',
        body: [
          'Volatilite: fiyatın hızlı ve büyük iniş-çıkış yapması.',
          'Risk: “kesin kayıp” değil, sonucun belirsiz olmasıdır.',
          'Tek varlığa yüklenmek riski büyütür. Çeşitlendirme dalgayı azaltabilir.',
        ],
        tips: ['Uyuyamıyorsan riskin fazladır. Risk “psikoloji” ile de ilgilidir.'],
      },
      {
        id: 'liquidity',
        title: 'Likidite',
        short: 'Paraya hızlı ve az kayıpla dönebilme.',
        body: [
          'Likidite yüksekse satmak/kullanmak kolaydır (nakit gibi).',
          'Likidite düşükse satarken zarar/komisyon/uzun süre bekleme olabilir.',
          'Acil durum fonu genelde likit tutulur.',
        ],
      },
      {
        id: 'diversification',
        title: 'Çeşitlendirme',
        short: 'Tüm parayı tek sepete koymamak.',
        body: [
          'Amaç: tek bir kötü olay tüm planını bozmasın.',
          'Çeşitlendirme “garanti kazanç” değildir, dalgayı azaltma denemesidir.',
        ],
        tips: ['Çeşitlendirme bile olsa “borçla yatırım” ayrı bir risk katmanıdır.'],
      },
    ],
    quiz: generateBasicsQuiz(),
  },
  {
    id: 'budget',
    title: 'Para Yönetimi',
    subtitle: 'Bütçe, acil fon, harcama tuzakları, hedef…',
    icon: '💸',
    items: [
      {
        id: 'needs-wants',
        title: 'İhtiyaç vs İstek',
        short: 'İhtiyaç: yaşamak için. İstek: keyif için.',
        body: [
          'İhtiyaçlar: kira, temel gıda, ulaşım, fatura gibi.',
          'İstekler: sinema, oyun, dışarıda yemek, gereksiz alışveriş.',
          'İstekler kötü değil; sorun “kontrolsüz” olunca başlar.',
        ],
        tips: ['Önce ihtiyaçları garantiye al, sonra isteklere küçük bütçe ayır.'],
      },
      {
        id: 'cashflow',
        title: 'Nakit Akışı (Cashflow)',
        short: 'Gelir-giderin zamanı önemlidir.',
        body: [
          'Aylık gelirin olsa bile faturalar/ödemeler farklı günlerde olabilir.',
          'Maaş yatar yatmaz zorunluları kenara ayırmak nakit sıkışmasını azaltır.',
        ],
      },
      {
        id: '50-30-20',
        title: '50/30/20 Kuralı (Basit)',
        short: 'Bir başlangıç şablonu.',
        body: [
          '50%: ihtiyaçlar',
          '30%: istekler',
          '20%: birikim/borç kapama',
          'Herkese uymaz ama “başlangıç noktası” sağlar.',
        ],
        tips: ['Gelir düşükse istek kısmı küçülebilir. Şablon esnektir.'],
      },
      {
        id: 'subscriptions',
        title: 'Abonelik Tuzakları',
        short: 'Küçük ödemeler birikir.',
        body: [
          'Bir abonelik 79 TL “küçük” gelir ama 6 abonelik 474 TL eder.',
          'Kullanmadığın abonelikleri kapatmak en hızlı tasarruflardan biridir.',
        ],
      },
      {
        id: 'emergency',
        title: 'Acil Durum Fonu',
        short: 'Sürpriz giderlerde borca girmemek için.',
        body: [
          'Sürprizler olur: telefon bozulur, sağlık gideri çıkar.',
          'Acil fon yoksa kredi kartına yüklenirsin → faiz → borç döngüsü.',
          'Hedef: önce 1 aylık, sonra 3 aylık zorunlu gider.',
        ],
        tips: ['Acil fon = “rahat uyku”. Yatırım değil, güvenlik yastığı.'],
      },
      {
        id: 'goals',
        title: 'Hedef Koyma',
        short: '“Neden biriktiriyorum?” net olunca daha kolay.',
        body: [
          'Hedef somut olsun: “Laptop için 20.000 TL, 6 ayda”.',
          'Parçala: aylık hedef + haftalık küçük kontrol.',
        ],
      },
      {
        id: 'tracking',
        title: 'Harcama Takibi',
        short: 'Ölçmediğin şeyi yönetemezsin.',
        body: [
          'En basit yöntem: 7 gün boyunca her harcamayı not etmek.',
          'Sonra 3 kategoriye ayır: zorunlu / istek / hedef.',
        ],
      },
    ],
    quiz: generateBudgetQuiz(),
  },
  {
    id: 'credit',
    title: 'Kredi & Kredi Kartı',
    subtitle: 'Asgari ödeme, faiz, borç döngüsü, vade…',
    icon: '💳',
    items: [
      {
        id: 'minpay',
        title: 'Asgari Ödeme Tuzağı',
        short: 'Borcu kapatmaz; borcu uzatır.',
        body: [
          'Asgari ödeme borcun küçük kısmını kapatır.',
          'Kalan borca faiz işler; toplam maliyet büyür.',
          'Sürekli asgari ödersen borç “bitmiyor” gibi hissettirir.',
        ],
        tips: ['Hedef: her ay borcu biraz azalt. Trend önemli.'],
        warning: 'Bu eğitim içeriğidir; gerçek oranlar bankaya göre değişir.',
      },
      {
        id: 'limit',
        title: 'Limit Kullanımı',
        short: 'Limitin dolarsa hareket alanın kalmaz.',
        body: [
          'Limit = kullanabileceğin maksimum borç.',
          'Limit dolarsa zorunlu harcamada bile zorlanırsın.',
        ],
        tips: ['Limitin “tamamını” kullanmak çoğu zaman risk yükseltir.'],
      },
      {
        id: 'apr',
        title: 'Faiz Oranı & Vade',
        short: 'Taksit düşse bile toplam ödeme artabilir.',
        body: [
          'Vade uzayınca aylık ödeme düşer gibi görünür.',
          'Ama daha uzun süre faiz ödersin → toplam geri ödeme artar.',
        ],
        tips: ['“Toplam geri ödeme” her zaman kontrol edilir.'],
      },
      {
        id: 'late',
        title: 'Gecikme',
        short: 'Gecikme cezası ve stres.',
        body: [
          'Ödeme gecikirse ceza/faiz eklenebilir.',
          'Zamanla borç büyür ve psikolojik baskı artar.',
        ],
      },
      {
        id: 'debt-snowball',
        title: 'Borç Azaltma Mantığı (Basit)',
        short: 'Büyük resmi küçültmek.',
        body: [
          'Borcu tek seferde kapatmak zor olabilir.',
          'Ama her ay düzenli azaltmak borç döngüsünü kırar.',
          'Önce gereksiz istekleri kıs → sonra borç payını artır.',
        ],
      },
    ],
    quiz: generateBasicsQuiz(), // Can be more specific
  },
  {
    id: 'markets',
    title: 'Piyasalar',
    subtitle: 'Dolar, altın, kripto, hisse… (okuryazarlık)',
    icon: '📊',
    items: [
      {
        id: 'fx',
        title: 'Kur (USD/TRY) Neyi Etkiler?',
        short: 'Kur artışı ithal maliyetleri etkileyebilir.',
        body: [
          'Kur: 1 doların kaç TL olduğu.',
          'İthal ürün/hammadde/enerji gibi kalemler kurdan etkilenebilir.',
          'Etki gecikmeli olabilir: stok ve sözleşmeler devreye girer.',
        ],
      },
      {
        id: 'gold',
        title: 'Altın',
        short: 'Belirsizlikte daha çok konuşulur ama garanti değildir.',
        body: [
          'Altın bazen “güvenli liman” gibi algılanır.',
          'Ama altın da düşebilir; risk vardır.',
        ],
      },
      {
        id: 'crypto',
        title: 'Kripto',
        short: 'Çok volatil: bir günde sert hareket edebilir.',
        body: [
          'Kriptoda fiyatlar çok hızlı oynayabilir.',
          'Haber/sosyal medya etkisi büyüktür.',
        ],
        tips: ['Kaybetsen bile hayatını bozmayacak miktarla öğrenmek daha sağlıklı.'],
        warning: 'Bu bir yatırım tavsiyesi değildir.',
      },
      {
        id: 'stock-basic',
        title: 'Hisse (Basit)',
        short: 'Bir şirketin küçük bir parçası gibi düşünebilirsin.',
        body: [
          'Fiyat, beklenti ve haberle dalgalanır.',
          'Kısa vadede gürültü çoktur; uzun vadede şirketin performansı önem kazanır.',
        ],
      },
      {
        id: 'spread-fee',
        title: 'Komisyon / Spread',
        short: 'Al-sat arası fark ve işlem ücreti.',
        body: [
          'Her işlemde küçük maliyetler olabilir.',
          'Çok sık al-sat yapmak maliyeti büyütebilir.',
        ],
      },
    ],
    quiz: generateMarketCandleQuiz(),
  },
  {
    id: 'stock-patterns',
    title: 'Borsa Terimleri & Mum Çubukları',
    subtitle: 'Candlestick okuryazarlığı + risk yönetimi (taktik, ama “garanti” değil)',
    icon: '🕯️',
    items: [
      {
        id: 'candle-basic',
        title: 'Candlestick Nedir?',
        short: 'Açılış-kapanış-en yüksek-en düşük özetidir.',
        body: [
          'Gövde: açılış ile kapanış arasındaki fark.',
          'Fitiller: gün içi en yüksek/en düşük.',
          'Uzun gövde = güçlü hareket; kısa gövde = kararsızlık.',
        ],
        tips: ['Tek mumla karar verme; bağlam (trend/haber) önemli.'],
      },
      {
        id: 'wick',
        title: 'Uzun Fitil Ne Anlatır?',
        short: 'Fiyat denendi ama kabul görmedi.',
        body: [
          'Uzun üst fitil: yukarı denendi ama satış geldi (direnç reddi).',
          'Uzun alt fitil: aşağı denendi ama alım geldi (destek reddi).',
        ],
      },
      {
        id: 'doji',
        title: 'Doji',
        short: 'Açılış ≈ kapanış: kararsızlık.',
        body: [
          'Doji, iki tarafın da üstünlük kuramadığını gösterir.',
          'Dönüş ihtimali konuşulur ama “teyit” şarttır.',
          'Dragonfly Doji: Alt fitil çok uzun, boğa ağırlıklı kararsızlık.',
          'Gravestone Doji: Üst fitil çok uzun, ayı ağırlıklı kararsızlık.',
        ],
        tips: ['Doji gördün diye işlem açma; sonraki mum/akışı izle.'],
      },
      {
        id: 'hammer',
        title: 'Çekiç (Hammer) & Inverted Hammer',
        short: 'Dönüş sinyali olabilecek küçük gövde ve uzun fitil.',
        body: [
          'Hammer: Alt fitil uzun, tepede küçük gövde. Düşüş sonrası alıcı tepkisi.',
          'Inverted Hammer: Üst fitil uzun, dipte küçük gövde. Düşüş sonrası alıcıların yukarıyı denemesi.',
        ],
        warning: 'Kesin dönüş değildir. Risk yönetimi olmadan kullanılmaz.',
      },
      {
        id: 'shooting-star',
        title: 'Shooting Star',
        short: 'Yükseliş trendi sonunda "kayan yıldız".',
        body: [
          'Küçük gövde dipte, çok uzun üst fitil.',
          'Yükseliş sonrası fiyatın yukarıda tutunamayıp satış yediğini gösterir.',
        ],
      },
      {
        id: 'spinning-top',
        title: 'Spinning Top (Fırıldak)',
        short: 'Küçük gövde, her iki yöne de uzun/eşit fitiller.',
        body: [
          'Piyasanın yön bulmakta zorlandığı, güç topladığı veya kararsız olduğu anlardır.',
        ],
      },
      {
        id: 'marubozu',
        title: 'Marubozu',
        short: 'Fitilsiz, tam dolu gövde.',
        body: [
          'Piyasanın o yönde çok güçlü ve kararlı olduğunu gösterir.',
          'Açılıştan kapanışa kadar tek yönlü baskın hareket vardır.',
        ],
      },
      {
        id: 'trend',
        title: 'Trend (Çok Basit)',
        short: 'Fiyat genel olarak yukarı mı gidiyor aşağı mı?',
        body: [
          'Yukarı trend: daha yüksek dipler/tepeler görürsün.',
          'Aşağı trend: daha düşük dipler/tepeler.',
          'Yeni başlayan için önce trendi anlamak, formasyonlardan daha önemlidir.',
        ],
      },
      {
        id: 'risk-management',
        title: 'Risk Yönetimi (Genççe)',
        short: 'Amaç “kaybetmemek” değil; “batmamak”.',
        body: [
          'Tek işlemde tüm parayı riske atmak oyunu bitirir.',
          'Kayıp ihtimalini baştan kabul et ve küçük tut.',
          'Plan: “Yanılırsam ne yapacağım?” sorusuna cevap ver.',
        ],
        tips: ['Borçla yatırım yapmak riski katlar. Yeni başlayan için önerilmez.'],
      },
    ],
    quiz: generateMarketCandleQuiz(),
  },
  {
    id: 'psychology',
    title: 'Yatırım Psikolojisi',
    subtitle: 'FOMO, FUD, sabır ve duygusal kontrol…',
    icon: '🧘',
    items: [
      {
        id: 'fomo',
        title: 'FOMO (Fırsatı Kaçırma Korkusu)',
        short: 'Başkaları kazanırken geride kalma endişesi.',
        body: [
          'FOMO: Fear of Missing Out.',
          'Fiyat çok yükselmişken "hâlâ gidecek yolu vardır" diye tepeden girmeye neden olur.',
          'Duygusal karar, genelde en riskli anlarda verilir.',
        ],
        tips: ['Piyasa koşarken değil, sakinken karar ver.'],
      },
      {
        id: 'fud',
        title: 'FUD (Korku, Belirsizlik, Şüphe)',
        short: 'Panik dalgasına kapılıp yanlış kararlar verme.',
        body: [
          'FUD: Fear, Uncertainty, Doubt.',
          'Kötü haberlerin abartılmasıyla elindekini zararına ve aceleyle satma durumudur.',
        ],
        tips: ['Haberin kaynağını ve gerçekliğini sorgula.'],
      },
      {
        id: 'patience',
        title: 'Sabır & Zaman Ufku',
        short: 'Hızlı zenginlik değil, sürdürülebilir büyüme.',
        body: [
          'Yatırım bir sprint (kısa koşu) değil, maratondur.',
          'Sık sık ekrana bakmak duygusal hataları artırabilir.',
        ],
      },
      {
        id: 'loss-aversion',
        title: 'Kayıptan Kaçınma',
        short: 'Kaybetmenin acısı, kazanmanın sevincinden büyüktür.',
        body: [
          'İnsan beyni zararı kabul etmekte zorlanır.',
          'Bu yüzden yanlış bir kararda "belki döner" diye bekleyip zararı büyütmek yaygındır.',
        ],
        tips: ['İşlemi açmadan önce nerede çıkacağını (zarar durdur) belirle.'],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
  {
    id: 'safety',
    title: 'Güvenlik & Korunma',
    subtitle: 'Dolandırıcılık türleri, şifre güvenliği, sosyal mühendislik…',
    icon: '🛡️',
    items: [
      {
        id: 'phishing',
        title: 'Oltalama (Phishing)',
        short: 'Sahte link ve mesajlarla bilgi çalma.',
        body: [
          'Banka, kargo veya devlet kurumundan geliyormuş gibi görünen sahte SMS/E-postalar.',
          'Hedef: şifreni, kart bilgilerini veya OTP kodunu ele geçirmek.',
        ],
        tips: ['Gelen linke tıklama, kurumu kendi numarasından ara veya uygulamasını aç.'],
      },
      {
        id: 'social-engineering',
        title: 'Sosyal Mühendislik',
        short: 'Psikolojik baskı ve aciliyet hissi yaratma.',
        body: [
          '“Hesabınız ele geçirildi, hemen bu kodu söyleyin” diyen aramalara dikkat.',
          'Seni korkutarak mantıklı düşünmeni engellemeye çalışırlar.',
        ],
        warning: 'Resmî kurumlar asla telefonda şifre veya kod istemez.',
      },
      {
        id: 'ponzi',
        title: 'Ponzi / Saadet Zinciri',
        short: 'Sürdürülemez "yüksek kazanç" vaatleri.',
        body: [
          'Sisteme yeni girenlerin parasıyla eskilerin ödemesi yapılır.',
          'Yeni giriş durduğunda sistem çöker ve son girenlerin parası uçar.',
        ],
        tips: ['Bir şey "gerçek olamayacak kadar iyiyse" muhtemelen gerçek değildir.'],
      },
      {
        id: 'digital-hygiene',
        title: 'Dijital Hijyen',
        short: 'Şifre ve cihaz güvenliği.',
        body: [
          'Her yerde aynı şifreyi kullanma.',
          'İki faktörlü doğrulamayı (2FA) mutlaka aç.',
          'Bilinmeyen APK veya dosyaları telefonuna indirme.',
        ],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
];
