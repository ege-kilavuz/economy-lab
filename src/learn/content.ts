export type LearnCategoryId = 'basics' | 'budget' | 'credit' | 'markets' | 'stock-patterns';

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
};

export type LearnCategory = {
  id: LearnCategoryId;
  title: string;
  subtitle: string;
  icon: string;
  items: LearnItem[];
  quiz: LearnQuestion[];
};

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'Temel Kavramlar',
    subtitle: 'Enflasyon, faiz, risk, bileşik etki… (genç dilinde, örnekli)',
    icon: '🧠',
    items: [
      {
        id: 'inflation',
        title: 'Enflasyon & Alım Gücü',
        short: 'Fiyatlar artınca aynı parayla daha az şey alırsın. Buna “alım gücü” denir.',
        body: [
          'Enflasyon: genel fiyatların zamanla artması. (Tek bir ürün değil, genel sepet.)',
          'Örnek: Geçen ay 100 TL’ye aldığın sepet bu ay 120 TL olduysa, aynı maaşla daha az ürün alırsın.',
          'Bu yüzden maaşa değil “maaşın ne alabildiğine” bakılır: reel gelir / alım gücü.',
          'Bütçe yaparken önce zorunluları (kira, fatura, gıda) garantiye almak en güvenli adımdır.',
        ],
        tips: [
          'Kendi sepetini oluştur: her ay aynı 5-10 ürünü takip et. Enflasyonu gözünle görürsün.',
          'Fiyat artınca panik harcama yapma; planlı alım, gereksiz harcamayı keser.',
        ],
      },
      {
        id: 'interest',
        title: 'Faiz & Bileşik Etki',
        short: 'Faiz, paranın zaman bedeli. Borçta maliyet, birikimde büyüme.',
        body: [
          'Faiz, “bugün 100 TL” ile “1 ay sonra 100 TL” aynı değil demektir.',
          'Kredi/kart borcunda: para kullanmanın maliyeti faize dönüşür.',
          'Birikimde: para zamanla büyüyebilir. (Ama risk her zaman var.)',
          'Bileşik etki: faize tekrar faiz işler. Uzun vadede küçük oran farkı bile büyür.',
        ],
        tips: [
          'Kart borcunda “asgari ödeme” borcu bitirmez; sadece nefes aldırır. Maliyet büyür.',
          'Taksiti düşürmek için vade uzatmak cazip gelebilir; toplam geri ödeme genelde artar.',
        ],
      },
      {
        id: 'risk',
        title: 'Risk & Volatilite',
        short: 'Kazanç ihtimali artınca dalgalanma da artar. Dalga = stres.',
        body: [
          'Volatilite: fiyatın hızlı ve büyük iniş-çıkış yapması.',
          'Risk demek “kesin kayıp” değil; sonucun belirsiz olmasıdır.',
          'Tek varlığa yüklenmek (tüm para tek sepette) riski büyütür.',
          'Çeşitlendirme: farklı varlıklara bölmek; dalgayı azaltabilir.',
        ],
        tips: [
          'Acil durum fonun yoksa riskli varlıklarda düşüşte panikle satma ihtimalin artar.',
          'Kısa vadede dalga çoksa, “uyuyamıyorsan” riskin fazladır.',
        ],
      },
      {
        id: 'compound',
        title: 'Bileşik Getiri (Kısaca)',
        short: 'Paranın büyümesi “kartopu” gibi hızlanabilir.',
        body: [
          'Bileşik getiri: kazançların da kazanç üretmesi.',
          'Ne kadar erken başlarsan o kadar avantajlı: süre en büyük çarpandır.',
          'Ama her büyüme garantili değildir: riskli varlıklarda iniş çıkış vardır.',
        ],
        tips: ['Düzenli küçük birikim, düzensiz büyük birikimden daha sürdürülebilir olabilir.'],
      },
    ],
    quiz: [
      {
        id: 'q1',
        q: 'Enflasyon yükselirse ve maaşın aynı kalırsa en olası sonuç nedir?',
        choices: ['Alım gücü artar', 'Alım gücü düşer', 'Hiçbir şey değişmez', 'Kart borcu otomatik kapanır'],
        correctIndex: 1,
        explain: 'Fiyatlar artarken gelir aynı kalırsa aynı sepeti almak zorlaşır → alım gücü düşer.',
      },
      {
        id: 'q2',
        q: 'Bileşik etki ne demektir?',
        choices: ['Sadece anapara büyür', 'Faizin faizi oluşur', 'Faiz hiç işlemez', 'Her ay zarar kesinleşir'],
        correctIndex: 1,
        explain: 'Faiz/kar tekrar anaparaya eklenir ve sonraki dönemde onun da faizi işler.',
      },
    ],
  },
  {
    id: 'budget',
    title: 'Para Yönetimi',
    subtitle: 'Bütçe, acil fon, nakit akışı…',
    icon: '💸',
    items: [
      {
        id: 'cashflow',
        title: 'Nakit Akışı (Cashflow)',
        short: 'Gelir-giderin “zamanı” önemlidir.',
        body: [
          'Aylık gelirin varsa ama faturaların/ödemelerin tarihi farklıysa gün içinde nakit sıkışabilirsin.',
          'En basit taktik: maaş yatar yatmaz “zorunlular”ı kenara ayırmak.',
          'Önce zorunlular, sonra hedefler, en son keyif harcamaları mantığı çoğu ayı kurtarır.',
        ],
        tips: [
          '“Küçük gider” küçümsenmez: abonelikler, atıştırmalıklar, kargo ücretleri ay sonunda büyür.',
        ],
      },
      {
        id: 'emergency',
        title: 'Acil Durum Fonu',
        short: 'Sürpriz giderler için yastık.',
        body: [
          'Telefon bozulması, sağlık gideri, iş kaybı gibi sürprizler borca sokabilir.',
          'Acil fon yoksa en küçük şok bile kredi kartına yazılır → borç döngüsü başlar.',
          'Hedef: önce 1 aylık, sonra 3 aylık zorunlu gideri karşılayacak kadar birikim.',
        ],
        tips: ['Acil fon, yatırım değil “sigorta” gibidir. Amaç: rahat uyumak.'],
      },
    ],
    quiz: [
      {
        id: 'q1',
        q: 'Bütçe yaparken en mantıklı sıralama hangisi?',
        choices: ['Önce eğlence, sonra zorunlular', 'Önce zorunlular, sonra hedefler, en son keyif', 'Hiç plan yapma', 'Tüm parayı yatır'],
        correctIndex: 1,
        explain: 'Zorunlular (kira/fatura/gıda) aksarsa domino etkisi yapar. Önce onları garantiye almak en güvenlisi.',
      },
      {
        id: 'q2',
        q: 'Acil durum fonunun ana amacı nedir?',
        choices: ['Hızlı zengin olmak', 'Sürpriz giderlerde borca girmemek', 'Vergiden kaçmak', 'Sadece yatırım yapmak'],
        correctIndex: 1,
        explain: 'Acil fon, şoklarda kredi kartına/borca yüklenmeyi azaltır.',
      },
    ],
  },
  {
    id: 'credit',
    title: 'Kredi & Kredi Kartı',
    subtitle: 'Asgari ödeme, faiz, borç döngüsü…',
    icon: '💳',
    items: [
      {
        id: 'minpay',
        title: 'Asgari Ödeme Tuzağı',
        short: 'Borcu kapatmaz; borcu uzatır.',
        body: [
          'Asgari ödeme, borcun sadece küçük kısmını kapatır.',
          'Kalan kısma faiz işler; toplam maliyet büyür.',
          'Sürekli asgari ödersen “borç döngüsü” oluşabilir: borç azalmıyor gibi hissedersin.',
        ],
        tips: [
          'Hedef: her ay borcu bir miktar azaltmak. “Sıfırlama” şart değil; trend önemli.',
          'Kartla ihtiyaç+istek karışınca kontrol zorlaşır: önce ihtiyaç, sonra istek.',
        ],
        warning: 'Bu eğitim içeriğidir; gerçek oranlar ve kurallar bankaya göre değişir.',
      },
      {
        id: 'apr',
        title: 'Faiz Oranı & Vade',
        short: 'Aylık taksit düşse bile toplam ödeme artabilir.',
        body: [
          'Vade uzayınca aylık taksit düşer gibi görünür.',
          'Ama daha uzun süre faiz ödersin → toplam geri ödeme artar.',
          'Bu yüzden “toplam geri ödeme” ve “toplam faiz” her zaman kontrol edilir.',
        ],
        tips: ['Taksit küçük diye sevinme; toplam maliyete bak.'],
      },
    ],
    quiz: [
      {
        id: 'q1',
        q: 'Asgari ödeme genelde ne işe yarar?',
        choices: ['Borcu tamamen bitirir', 'Borcu uzatır, faiz maliyeti doğurur', 'Faizi sıfırlar', 'Geliri artırır'],
        correctIndex: 1,
        explain: 'Asgari ödeme borcu azaltır ama kalan borca faiz işler; toplam maliyet büyüyebilir.',
      },
      {
        id: 'q2',
        q: 'Vade uzarsa genelde hangisi artar?',
        choices: ['Toplam geri ödeme', 'Toplam geri ödeme azalır', 'Faiz hiç işlemez', 'Borç otomatik silinir'],
        correctIndex: 0,
        explain: 'Daha uzun süre faiz ödendiği için toplam geri ödeme çoğu durumda artar.',
      },
    ],
  },
  {
    id: 'markets',
    title: 'Piyasalar',
    subtitle: 'Dolar, altın, kripto, hisse…',
    icon: '📊',
    items: [
      {
        id: 'fx',
        title: 'Kur (USD/TRY) Neyi Etkiler?',
        short: 'Kur artışı bazı ürünleri pahalılaştırabilir (özellikle ithal).',
        body: [
          'Kur: 1 doların kaç TL olduğu (örnek).',
          'İthal ürün/hammadde, enerji gibi kalemler kurdan etkilenebilir.',
          'Bu etki hemen olmaz: firmalar stok, sözleşme, maliyet yapısına göre gecikmeli yansıtabilir.',
        ],
        tips: ['Kur yükseldi diye her şey aynı gün zamlanmaz; ama bazı kalemlerde baskı artar.'],
      },
      {
        id: 'gold',
        title: 'Altın: Güvenli Liman Algısı',
        short: 'Belirsizlik dönemlerinde daha çok konuşulur.',
        body: [
          'Altın bazı dönemlerde “güvenli liman” gibi algılanır.',
          'Ama altın da düşebilir: garanti değildir.',
          'Altın fiyatı genelde hem ons altın hem kurdan etkilenir (Türkiye için).',
        ],
        tips: ['Tek seferde almak yerine parça parça almak dalga riskini azaltabilir.'],
      },
      {
        id: 'crypto',
        title: 'Kripto: Yüksek Risk',
        short: 'Çok volatil: bir günde bile sert hareket edebilir.',
        body: [
          'Kripto varlıklarda volatilite çok yüksektir.',
          'Haber akışı, sosyal medya ve likidite fiyatı hızlı oynatabilir.',
          'Yeni başlayanlar için “az miktarla öğrenme” daha güvenli bir yaklaşımdır.',
        ],
        tips: ['Kaybetsen bile hayatını bozmayacak miktarla başlamak daha sağlıklıdır.'],
        warning: 'Bu bir yatırım tavsiyesi değildir.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        q: 'Kur artışı en doğrudan hangi kalemleri etkileyebilir?',
        choices: ['İthal ürün/hammadde', 'Herkesin maaşı otomatik artar', 'Vergiler sıfırlanır', 'Elektrik ücretsiz olur'],
        correctIndex: 0,
        explain: 'İthal girdiler dövizle alındığı için kur artışı maliyete baskı yapabilir.',
      },
      {
        id: 'q2',
        q: '“Güvenli liman” algısı ne anlama gelir?',
        choices: ['Fiyat asla düşmez', 'Belirsizlikte daha çok tercih edilebilir', 'Kesin kazanç sağlar', 'Devlet garanti verir'],
        correctIndex: 1,
        explain: 'Algı, bazı dönemlerde talebi artırabilir; ama garanti değildir.',
      },
    ],
  },
  {
    id: 'stock-patterns',
    title: 'Borsa Terimleri & Mum Çubukları',
    subtitle: 'Candlestick mantığı + örnek formasyonlar (eğitim amaçlı).',
    icon: '🕯️',
    items: [
      {
        id: 'candle-basic',
        title: 'Mum Çubuğu (Candlestick) Nedir?',
        short: 'Bir zaman aralığındaki açılış-kapanış-en yüksek-en düşük özetidir.',
        body: [
          'Mum gövdesi: açılış ve kapanış arasındaki fark (günün “asıl hareketi”).',
          'Fitiller: gün içinde görülen en yüksek ve en düşük seviyeler.',
          'Uzun gövde: güçlü alıcı/satıcı baskısı. Kısa gövde: kararsızlık.',
          'Tek mumla karar vermek riskli: trend + hacim + haber birlikte düşünülür.',
        ],
        tips: ['Yeni başlayan için: önce trendi öğren, sonra mum formasyonlarına bak.'],
      },
      {
        id: 'hammer',
        title: 'Çekiç (Hammer)',
        short: 'Alt fitil uzun, gövde küçük: düşüş sonrası tepki ihtimali doğabilir.',
        body: [
          'Gün içinde sert düşüş olur ama kapanışa doğru toparlar.',
          'Bu, “satış baskısı vardı ama alıcılar geri geldi” sinyali olabilir.',
          'En anlamlı hali: düşüş trendi + güçlü destek bölgesi + hacim artışı ile birlikte.',
        ],
        tips: ['Tek başına yetmez: sonraki mumun “teyit” vermesi aranır.'],
        warning: 'Kesin dönüş değildir. Risk yönetimi (stop) olmadan kullanılmaz.',
      },
      {
        id: 'doji',
        title: 'Doji (Kararsızlık)',
        short: 'Açılış ≈ kapanış: alıcı-satıcı dengede.',
        body: [
          'Doji, piyasanın o aralıkta karar veremediğini gösterir.',
          'Büyük haber öncesi/sonrası sık görülebilir.',
          'Trendin tepesinde/dibinde gelirse “dönüş ihtimali” konuşulur ama teyit şarttır.',
        ],
        tips: ['Doji gördün diye işlem açma; “sonraki hareketi” izle.'],
      },
      {
        id: 'wick',
        title: 'Uzun Fitil Ne Anlatır?',
        short: 'Fiyat denendi ama kabul görmedi.',
        body: [
          'Uzun üst fitil: yukarı denendi ama satış geldi (direnç reddi).',
          'Uzun alt fitil: aşağı denendi ama alım geldi (destek reddi).',
          'Fitilin anlamı bağlama bağlıdır: aynı fitil farklı trendde farklı okunur.',
        ],
        tips: ['Fitil + seviyeler: destek/direnç bölgeleriyle birlikte bak.'],
      },
    ],
    quiz: [
      {
        id: 'q1',
        q: 'Bir candlestick mumunda “fitiller” neyi gösterir?',
        choices: ['Sadece kapanış fiyatını', 'En yüksek ve en düşük seviyeleri', 'Sadece açılış fiyatını', 'Haber akışını'],
        correctIndex: 1,
        explain: 'Fitiller, o zaman aralığında görülen en yüksek ve en düşük fiyatları temsil eder.',
      },
      {
        id: 'q2',
        q: 'Doji mumu genelde neyi anlatır?',
        choices: ['Kesin yükseliş', 'Kesin düşüş', 'Kararsızlık / denge', 'Faiz artışı'],
        correctIndex: 2,
        explain: 'Açılış ve kapanış çok yakınsa piyasa o aralıkta kararsız kalmış olabilir.',
      },
    ],
  },
];
