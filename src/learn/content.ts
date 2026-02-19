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

// --- QUIZ GENERATORS (More variety) ---

function generateBasicsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    {
      id: 'b1',
      q: 'Maaşın aynı kalırken ekmeğin fiyatı 2 katına çıkarsa ne olur?',
      choices: ['Ekmek daha lezzetli olur', 'Reel gelirin düşer', 'Nominal gelirin artar', 'Daha çok ekmek alırsın'],
      correctIndex: 1,
      explain: 'Paran aynı kalsa bile fiyatlar artınca alım gücün (reel gelir) erir. Stonks değil, NOT stonks!',
    },
    {
      id: 'b2',
      q: 'Bileşik etkiyi en iyi neye benzetebiliriz?',
      choices: ['Hızlanan bir kar topuna', 'Duran bir arabaya', 'Eriyen bir buza', 'Sönmüş bir balona'],
      correctIndex: 0,
      explain: 'Kazancın da kazanç getirmesiyle para zamanla katlanarak büyür.',
    },
    {
      id: 'b3',
      q: 'Acil paraya ihtiyacın varken, hangisi seni daha çok üzer?',
      choices: ['Cebindeki nakit', 'Altın', 'Likiditesi düşük bir tarla', 'Banka hesabı'],
      correctIndex: 2,
      explain: 'Likidite "paraya hemen ulaşabilmektir". Tarlayı hemen satamazsın, beklerken de fırsatı kaçırırsın.',
    },
    {
      id: 'b4',
      q: 'Enflasyon %80 iken banka %30 faiz veriyorsa, paran ne olur?',
      choices: ['Büyür', 'Aynı kalır', 'Reel olarak erir', 'Hepsinden çok olur'],
      correctIndex: 2,
      explain: 'Faiz, enflasyonun altındaysa o para aslında azalıyor demektir.',
    },
  ];
  
  // Mix in some dynamic variants
  const assets = ['Telefon', 'Ayakkabı', 'Oyun Konsolu', 'Laptop'];
  assets.forEach((a, i) => {
    pool.push({
      id: `b-dyn-${i}`,
      q: `Bugün 10.000 TL olan ${a}, enflasyon %60 olunca seneye kaç TL olur?`,
      choices: ['10.000 TL', '16.000 TL', '20.000 TL', '6.000 TL'],
      correctIndex: 1,
      explain: 'Enflasyon oranı kadar fiyatın artması beklenir.',
    });
  });

  return pool;
}

function generateBudgetQuiz(): LearnQuestion[] {
  return [
    {
      id: 'bu1',
      q: 'Aylık bütçe yaparken ilk yapman gereken şey nedir?',
      choices: ['Hemen indirimli kıyafet bakmak', 'Önce kira/fatura gibi zorunluları ayırmak', 'Tüm parayı eğlenceye gömmek', 'Gelecek ayın maaşını beklemek'],
      correctIndex: 1,
      explain: 'Zorunlu giderler "önce" gelir. Yoksa ay sonunda patlarsın bro.',
    },
    {
      id: 'bu2',
      q: '50/30/20 kuralında "30"luk pay nereye gider?',
      choices: ['Kira', 'Birikim', 'İstekler ve eğlence', 'Vergi'],
      correctIndex: 2,
      explain: 'Keyifli yaşam için %30 esneklik payıdır.',
    },
    {
      id: 'bu3',
      q: 'Kullanmadığın 3-4 aboneliğin olması neden kötüdür?',
      choices: ['Kötü değildir, zenginim', 'Her ay küçük küçük paralar birikip bütçeni deler', 'Sadece interneti yavaşlatır', 'Banka puan verir'],
      correctIndex: 1,
      explain: 'Görünmez giderler finansal sağlığın sinsi düşmanıdır.',
    },
    {
      id: 'bu4',
      q: 'Acil durum fonu neden "Yatırım" değildir?',
      choices: ['Çünkü parası azdır', 'Çünkü amaç kar etmek değil, güvenliktir', 'Çünkü altına yatırılmaz', 'Çünkü bankada durmaz'],
      correctIndex: 1,
      explain: 'Acil fon, zor günde borca girmemen için bir kalkandır.',
    },
  ];
}

function generatePsychQuiz(): LearnQuestion[] {
  return [
    {
      id: 'p1',
      q: 'Herkes bir coin’in uçacağını söylerken gaza gelip almak nedir?',
      choices: ['Dahilik', 'FOMO (Fırsatı kaçırma korkusu)', 'Derin analiz', 'Şans'],
      correctIndex: 1,
      explain: 'Başkaları kazanıyor diye rasyonaliteyi bırakmak FOMO’dur.',
    },
    {
      id: 'p2',
      q: 'Zararda olduğun bir hisseyi "belki döner" diye aylarca tutup zararı büyütmek nedir?',
      choices: ['Sabır örneği', 'Kayıptan kaçınma psikolojisi', 'En doğru strateji', 'Hobi'],
      correctIndex: 1,
      explain: 'İnsan beyni zararı kabullenmekten nefret eder, bu da bazen batışa götürür.',
    },
    {
      id: 'p3',
      q: 'Kötü haberler yayılıp herkes satarken korkup paniklemek nedir?',
      choices: ['FUD', 'Stonks', 'Analiz', 'Kar realizasyonu'],
      correctIndex: 0,
      explain: 'Korku, Belirsizlik ve Şüphe (FUD) dalgasıyla yanlış karar verme durumudur.',
    },
  ];
}

function generateSafetyQuiz(): LearnQuestion[] {
  return [
    {
      id: 's1',
      q: '"Hesabınızda şüpheli işlem var, hemen doğrulayın" diyen linke ne yaparsın?',
      choices: ['Hemen tıklarım', 'Korkarım ama tıklarım', 'Tıklamam, resmi uygulamadan bakarım', 'Arkadaşıma sorarım'],
      correctIndex: 2,
      explain: 'Linke tıklamak oltalama (phishing) tuzağına düşmektir.',
    },
    {
      id: 's2',
      q: 'Tanımadığın birinden gelen .apk dosyasını indirmek neden risklidir?',
      choices: ['Hafıza dolar', 'İçinde virüs/keylogger olabilir', 'Oyun açılmaz', 'Telefon kasar'],
      correctIndex: 1,
      explain: 'Bilinmeyen dosyalar tüm şifrelerini ve mesajlarını çalabilir.',
    },
    {
      id: 's3',
      q: 'Arayan kişi "Ben polisim, altınları bozdurıp şuna yatır" diyorsa?',
      choices: ['Hemen yaparım', 'Polise yardımcı olurum', 'Kapatıp gerçek polisi ararım', 'Pazarlık yaparım'],
      correctIndex: 2,
      explain: 'Hiçbir resmi makam telefonda para/altın/şifre istemez. Bu sosyal mühendisliktir.',
    },
  ];
}

function generateCandleQuiz(): LearnQuestion[] {
  return [
    {
      id: 'c1',
      q: 'Marubozu mumu gördüğünde ne düşünmelisin?',
      choices: ['Kararsızlık var', 'O yönde çok güçlü bir hakimiyet var', 'Fiyat dönecek', 'Borsa kapanmış'],
      correctIndex: 1,
      explain: 'Marubozu "kel kafa" demektir, fitilsizdir, hareketin çok kararlı olduğunu gösterir.',
    },
    {
      id: 'c2',
      q: 'Doji mumu neyi ifade eder?',
      choices: ['Kesin yükseliş', 'Alıcı ve satıcıların yenişemediği kararsızlık', 'Piyasa kapandı', 'Haber bekliyoruz'],
      correctIndex: 1,
      explain: 'Açılış ve kapanış aynı yerdeyse kimse galip gelememiştir.',
    },
    {
      id: 'c3',
      q: 'Çekiç (Hammer) mumu nerede anlam kazanır?',
      choices: ['Tepede', 'Düşüş trendinin sonunda, destekte', 'Yatayda', 'Hafta sonunda'],
      correctIndex: 1,
      explain: 'Düşüş sonrası alım tepkisi geldiğini gösterir.',
    },
  ];
}

// --- LEARN CONTENT (Detailed & Gen-Z Tone) ---

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'Temel Kavramlar',
    subtitle: 'Enflasyon, faiz, risk, bileşik etki… (örnekli, genç dilinde)',
    icon: '🧠',
    items: [
      {
        id: 'inflation',
        title: 'Enflasyon: Paranın Erimeden Korunması',
        short: 'Fiyatlar artınca paran erir. Onu nasıl korursun?',
        body: [
          'Enflasyon, aslında "paranın vadesinin dolması" gibi bir şey. 100 TL ile bugün 10 tane kahve alabiliyorsan, enflasyon gelince 8 tane alabiliyorsun. Paran hala 100 TL ama artık o "eski 100 TL" değil.',
          'Neden önemli? Çünkü maaşın %50 artıp, peynirin fiyatı %80 artarsa aslında fakirleşmiş oluyorsun. Rakamlara kanma, "alım gücü"ne bak!',
          'Kanka olay şu: Senin gerçek zenginliğin cebindeki TL miktarı değil, o parayla kaç tane hamburger/ayakkabı alabildiğindir. Buna "Reel Değer" diyoruz.',
        ],
        tips: [
          'Kendi mini enflasyon sepetini yap: En çok kullandığın 5 şeyin fiyatını her ay not al.',
          'Birikimlerini enflasyondan korumayan bir yerde (sadece yastık altı TL gibi) tutma.',
        ],
      },
      {
        id: 'compound',
        title: 'Bileşik Etki: Finansal Sihir',
        short: 'Kartopu etkisiyle küçük paralar deve dönüşür.',
        body: [
          'Einstein "Dünyanın 8. harikası" demiş, şaka yapmıyoruz. Bileşik etki, kazancının da kazanç getirmesidir.',
          'Örnek: 100 TL’n var, %10 kazandın -> 110 TL oldu. Sonraki dönem %10 kazandığında 100 üzerinden değil, 110 üzerinden kazanırsın. Zaman geçtikçe grafik dikey uçuşa geçer!',
          'En büyük çarpan ZAMAN. Ne kadar erken başlarsan, o kadar stonks.',
        ],
        tips: ['Küçük birikimleri küçümseme, 10 sene sonraki hallerine inanamayacaksın.'],
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
        id: 'budgeting',
        title: 'Bütçe Yapmak: Paranın Patronu Ol',
        short: 'Para nereye gidiyor? Sen mi onu yönetiyorsun o mu seni?',
        body: [
          'Bütçe yapmak "hiç harcama yapma" demek değildir. Paranın nereye gideceğine ÖNCEDEN karar vermektir. Eğer ay sonu "nerede bu para?" diyorsan, bütçen yok demektir.',
          '50/30/20 Kuralı: Gelirinin %50’sini zorunlu (kira, fatura), %30’unu keyif (netflix, kahve, konser), %20’sini gelecek (birikim, borç kapama) için ayır.',
          'Harcama takibi yaparken dürüst ol. O "gereksiz" dediğin 5. kahve aslında bir yatırım fırsatı olabilir.',
        ],
        tips: [
          'Maaş yatar yatmaz önce zorunluları ve birikimi ayır, kalanı harca.',
          'Mobil bankacılıktaki "harcama kategorileri" kısmını her hafta kontrol et.',
        ],
      },
      {
        id: 'emergency',
        title: 'Acil Durum Fonu: Kötü Gün Kalkanı',
        short: 'Sürpriz giderlerde patlamamak için.',
        body: [
          'Telefonun ekranı mı kırıldı? Dişin mi ağrıdı? Hayat bazen tokat atar. Acil durum fonu, bu tokatlardan korunmak için bir yastıktır.',
          'Eğer bu fonun yoksa, acil bir durumda kredi kartına yüklenirsin, sonra faiz sarmalına girersin. Sonuç: Stres ve borç.',
          'Hedef: En az 3 aylık temel giderini kenara, dokunmayacağın bir yere koy. Yatırım değil, sigorta gibi düşün.',
        ],
        tips: ['Bu paraya "gerçekten acil" değilse (indirimdeki ayakkabı acil değildir!) asla dokunma.'],
      },
    ],
    quiz: generateBudgetQuiz(),
  },
  {
    id: 'credit',
    title: 'Kredi & Kartlar',
    subtitle: 'Asgari ödeme tuzağı ve kredi notu.',
    icon: '💳',
    items: [
      {
        id: 'min-payment',
        title: 'Asgari Ödeme Tuzağı: Görünmez Zincir',
        short: 'Sadece asgariyi ödeyerek borç bitmez, ömür biter.',
        body: [
          'Kredi kartı ekstrem geldiğinde banka sana "bak asgariyi ödesen de olur" der. Bu bir iyilik değildir! Kalan borca çok yüksek faiz biner.',
          'Asgari ödeyerek borcu bitirmek, süzgeçle havuz doldurmaya benzer. Borç azalmıyor gibi gelir çünkü faiz onu şişirir.',
          'Mümkünse her zaman TAMAMINI öde. Yapamıyorsan asgariden fazlasını öde ki anapara azalsın.',
        ],
        tips: ['Kredi kartını "bedava para" değil, "ertelenmiş ödeme" olarak gör.'],
      },
    ],
    quiz: generateBudgetQuiz(), // Using similar for now
  },
  {
    id: 'psychology',
    title: 'Yatırım Psikolojisi',
    subtitle: 'FOMO, FUD ve Duygularla Başa Çıkma',
    icon: '🧘',
    items: [
      {
        id: 'fomo-item',
        title: 'FOMO: Arkadaşın Zengin Olurken Sen?',
        short: 'Herkes alıyor diye almak en büyük hata olabilir.',
        body: [
          'Fear Of Missing Out (Fırsatı Kaçırma Korkusu). Sosyal medyada birilerinin "X coin uçuyor, 10x yaptım" dediğini görünce kalbin hızlanıyorsa FOMO’dasın demektir.',
          'Kural: Bir varlık herkesin dilindeyse ve çok yükselmişse, o trene binmek için muhtemelen çok geçtir. Tepeden alıp "elinde kalan" sen olma.',
          'Duygusal kararlar seni likit eder. Sakin ol, planına sadık kal.',
        ],
        tips: ['FOMO hissettiğinde ekranı kapat ve 24 saat bekle. Hala mantıklı geliyorsa tekrar düşün.'],
      },
      {
        id: 'fud-item',
        title: 'FUD: Panik Satışı Yapma',
        short: 'Korku dalgasına kapılıp en dipten satma.',
        body: [
          'Fear, Uncertainty, Doubt (Korku, Belirsizlik, Şüphe). Piyasa düşerken birileri "battık, bittik" diye bağırır. Bu FUD dalgasıdır.',
          'Eğer projesine/varlığına güveniyorsan, panik yapanların kurbanı olma. Büyük yatırımcılar genelde herkes korkarken alır.',
        ],
        tips: ['Gürültüyü değil, veriyi dinle.'],
      },
    ],
    quiz: generatePsychQuiz(),
  },
  {
    id: 'safety',
    title: 'Güvenlik',
    subtitle: 'Paranı dolandırıcılardan koru.',
    icon: '🛡️',
    items: [
      {
        id: 'scams',
        title: 'Oltalama (Phishing): Linklere Dikkat!',
        short: 'Sahte mesajlarla şifreni çalarlar.',
        body: [
          'Dolandırıcılar "Banka" veya "Kargo" kılığında gelir. "Paketiniz teslim edilemedi, şu linke tıklayıp adres güncelleyin" derler.',
          'Linke tıkladığında sahte bir siteye gidersin, bilgilerini girdiğin an geçmiş olsun. 2FA (Çift faktörlü doğrulama) bu yüzden hayat kurtarır.',
          'Resmi hiçbir kurum senden telefonda veya mesajla ŞİFRE/OTP istemez. İsteyen net dolandırıcıdır.',
        ],
        tips: [
          'Şüpheli mesajlardaki linklere ASLA tıklama.',
          'Her zaman resmi uygulamayı kendin açıp oradan kontrol et.',
        ],
      },
    ],
    quiz: generateSafetyQuiz(),
  },
  {
    id: 'stock-patterns',
    title: 'Mum Çubukları',
    subtitle: 'Grafik okuma rehberi.',
    icon: '🕯️',
    items: [
      {
        id: 'patterns-intro',
        title: 'Mumlar Ne Anlatır?',
        short: 'Mumun şekli piyasanın o anki ruh halidir.',
        body: [
          'Mumlar, o zaman dilimindeki kavganın özetidir. Yeşilse alıcılar, kırmızıysa satıcılar galip gelmiştir.',
          'Doji: İki taraf da yenişememiş, piyasa kararsız. Dönüş sinyali olabilir.',
          'Marubozu: Tek tarafın mutlak hakimiyeti. Hareket güçlü devam edebilir.',
          'Fitiller: Fiyatın oraya kadar gittiğini ama orada tutunamadığını gösterir. Reddedilme sinyalidir.',
        ],
        tips: ['Tek muma bakıp işlem açma. Yanına destek/direnç ve trendi de ekle.'],
      },
    ],
    quiz: generateCandleQuiz(),
  },
  {
    id: 'markets',
    title: 'Piyasalar',
    subtitle: 'Neye yatırım yapabilirsin?',
    icon: '📊',
    items: [
      {
        id: 'volatility',
        title: 'Volatilite: Dalgalanma',
        short: 'Fiyatın ne kadar hızlı hareket ettiği.',
        body: [
          'Bazı varlıklar (kripto gibi) çok hızlı inip çıkar. Buna yüksek volatilite diyoruz. Çok kazandırabilir ama çok da kaybettirebilir.',
          'Bazıları ise (altın gibi) daha ağır hareket eder. Risk iştahına göre hangisinde olacağına sen karar ver.',
        ],
      },
    ],
    quiz: generateCandleQuiz(),
  },
];
