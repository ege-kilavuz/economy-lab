export type LearnCategoryId = 'basics' | 'budget' | 'credit' | 'markets' | 'stock-patterns';

export type LearnItem = {
  id: string;
  title: string;
  short: string;
  body: string[];
  tips?: string[];
  warning?: string;
};

export type LearnCategory = {
  id: LearnCategoryId;
  title: string;
  subtitle: string;
  icon: string;
  items: LearnItem[];
};

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'Temel Kavramlar',
    subtitle: 'Enflasyon, faiz, risk, bileşik etki…',
    icon: '🧠',
    items: [
      {
        id: 'inflation',
        title: 'Enflasyon & Alım Gücü',
        short: 'Fiyatlar artınca aynı parayla daha az şey alırsın.',
        body: [
          'Enflasyon, genel fiyat seviyesinin zamanla artmasıdır.',
          'Maaşın artsa bile fiyatlar daha hızlı artıyorsa “reel” alım gücün düşebilir.',
          'Bu yüzden bütçede “zorunlular” (kira, fatura, gıda) en önce planlanır.',
        ],
        tips: ['Aynı sepeti her ay izlemek (market sepeti) alım gücünü görmeyi kolaylaştırır.'],
      },
      {
        id: 'interest',
        title: 'Faiz & Bileşik Etki',
        short: 'Faiz zamanla birikir: borçta maliyet, birikimde büyüme.',
        body: [
          'Faiz, paranın zaman değeridir. Borç aldığında maliyet; birikim yaptığında getiridir.',
          'Bileşik etki: “faizin faizi” oluşur. Uzun vadede küçük oran farkları büyük fark yaratır.',
        ],
        tips: ['Kredi kartında asgari ödeme: borcu düşürür ama borcu uzatıp toplam maliyeti artırabilir.'],
      },
      {
        id: 'risk',
        title: 'Risk & Volatilite',
        short: 'Kazanç potansiyeli artınca dalgalanma da artar.',
        body: [
          'Volatilite: fiyatın sık ve büyük hareket etmesi.',
          'Tek varlığa yüklenmek risklidir. Çeşitlendirme dalgayı azaltır.',
        ],
        tips: ['“Acil durum fonu” varsa riskli varlıklarda panikle satış yapma ihtimali azalır.'],
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
          'Önce zorunlular, sonra hedefler, en son keyif harcamaları mantığı çoğu ayı kurtarır.',
        ],
        tips: ['Günlük küçük harcamalar (kahve/abonelik/taşıma) ay sonunda büyük fark yaratır.'],
      },
      {
        id: 'emergency',
        title: 'Acil Durum Fonu',
        short: 'Sürpriz giderler için yastık.',
        body: [
          'Telefon bozulması, sağlık gideri, iş kaybı gibi sürprizler borca sokabilir.',
          'Hedef: önce 1 aylık, sonra 3 aylık zorunlu gideri karşılayacak kadar birikim.',
        ],
        tips: ['Acil fon, yatırım değil “sigorta” gibidir. Amaç psikolojik güven sağlar.'],
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
          'Sürekli asgari ödersen “borç döngüsü” oluşabilir.',
        ],
        tips: ['Mümkünse borcu parça parça ama düzenli azalt: her ay aynı miktarı kapatmayı hedefle.'],
        warning: 'Bu eğitim içeriğidir; bankacılık sözleşmeleri/oranlar değişkendir.',
      },
      {
        id: 'apr',
        title: 'Faiz Oranı & Vade',
        short: 'Aylık taksit düşse bile toplam ödeme artabilir.',
        body: [
          'Vade uzayınca aylık taksit düşer gibi görünür.',
          'Ama daha uzun süre faiz ödersin → toplam geri ödeme artar.',
        ],
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
        short: 'İthal ürün maliyeti, enerji, bazı fiyatlar…',
        body: [
          'Kur artışı ithal girdileri pahalılaştırabilir.',
          'Bu da zamanla bazı ürün/hizmet fiyatlarına yansıyabilir.',
        ],
        tips: ['Kur hareketi tek başına her fiyatı aynı anda değiştirmez; gecikmeli etki olur.'],
      },
      {
        id: 'gold',
        title: 'Altın: Güvenli Liman Algısı',
        short: 'Belirsizlikte talep artabilir.',
        body: [
          'Altın kimi dönemlerde “güvenli liman” olarak görülür.',
          'Ama her zaman yükselmez; o da dalgalanır.',
        ],
      },
      {
        id: 'crypto',
        title: 'Kripto: Yüksek Risk',
        short: 'Çok volatil, haber akışına aşırı duyarlı.',
        body: [
          'Kripto varlıklar yüksek dalgalanma gösterebilir.',
          'Kısa vadede büyük artış/azalış olabilir.',
          'Yeni başlayanlar için küçük miktarlarla öğrenme daha güvenlidir.',
        ],
        warning: 'Bu bir yatırım tavsiyesi değildir.',
      },
    ],
  },
  {
    id: 'stock-patterns',
    title: 'Borsa Terimleri & Mum Çubukları',
    subtitle: 'Çubuk (candlestick) mantığı + örnek taktikler.',
    icon: '🕯️',
    items: [
      {
        id: 'candle-basic',
        title: 'Mum Çubuğu (Candlestick) Nedir?',
        short: 'Bir zaman aralığındaki açılış-kapanış-en yüksek-en düşük.',
        body: [
          'Mum gövdesi: açılış ve kapanış arasını gösterir.',
          'Fitiller: gün içi en yüksek ve en düşük seviyeleri gösterir.',
          'Kısa gövde = kararsızlık; uzun gövde = güçlü hareket.',
        ],
        tips: ['Tek başına mum yeterli değil: hacim, trend ve haberle birlikte düşün.'],
      },
      {
        id: 'hammer',
        title: 'Çekiç (Hammer)',
        short: 'Alt fitil uzun, gövde küçük: düşüş sonrası tepki ihtimali.',
        body: [
          'Fiyat gün içinde sert düşer ama kapanışa doğru toparlar.',
          'Bu, satış baskısına rağmen alıcıların geri geldiğini ima eder.',
        ],
        tips: ['Trend düşüşteyken ve destek seviyesinde görülürse daha anlamlıdır.'],
        warning: '“Kesin dönüş” değildir. Stop yönetimi şart.',
      },
      {
        id: 'doji',
        title: 'Doji (Kararsızlık)',
        short: 'Açılış ≈ kapanış: piyasa kararsız.',
        body: [
          'Doji, iki tarafın da üstünlük kuramadığını gösterir.',
          'Önemli haber öncesi/sonrası sık görülebilir.',
        ],
        tips: ['Tek Doji yerine “sonraki mum teyidi” aranır.'],
      },
    ],
  },
];
