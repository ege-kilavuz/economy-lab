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

// --- SHUFFLE HELPER ---
function shuffleChoices(q: LearnQuestion): LearnQuestion {
  const choicesWithMeta = q.choices.map((c, i) => ({ text: c, isCorrect: i === q.correctIndex }));
  for (let i = choicesWithMeta.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choicesWithMeta[i], choicesWithMeta[j]] = [choicesWithMeta[j], choicesWithMeta[i]];
  }
  return {
    ...q,
    choices: choicesWithMeta.map(c => c.text),
    correctIndex: choicesWithMeta.findIndex(c => c.isCorrect),
  };
}

// --- VERBAL QUIZ GENERATORS (EXTENDED) ---

function generateBasicsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'b1', q: 'Enflasyonun temel etkisi nedir?', choices: ['Paranın değer kazanması', 'Satın alma gücünün azalması', 'Banka kredilerinin bitmesi', 'İşsizliğin sıfırlanması'], correctIndex: 1, explain: 'Enflasyon varken aynı parayla daha az mal alırsın.' },
    { id: 'b2', q: 'Fırsat maliyeti neyi ifade eder?', choices: ['Ürünün etiket fiyatını', 'Seçim yaparken vazgeçilen alternatifin değerini', 'Kargo ücretini', 'Banka masrafını'], correctIndex: 1, explain: 'Her tercih bir vazgeçiştir.' },
    { id: 'b3', q: 'Bileşik getirinin en güçlü olduğu durum hangisidir?', choices: ['Kısa vadeli yatırımlar', 'Uzun vadeli ve disiplinli yatırımlar', 'Sadece çok büyük paralar', 'Sadece altın yatırımı'], correctIndex: 1, explain: 'Zaman arttıkça kar topu etkisi devleşir.' },
    { id: 'b4', q: 'Likit bir varlık ne anlama gelir?', choices: ['Rengi su gibi olan', 'Hızlıca ve değer kaybı az şekilde nakde dönebilen', 'Çok pahalı olan', 'Sadece bankada duran'], correctIndex: 1, explain: 'Nakit en likit varlıktır.' },
    { id: 'b5', q: 'Nominal gelir artışı enflasyondan düşükse ne olur?', choices: ['Zenginleşirsin', 'Reel olarak fakirleşirsin', 'Durumun değişmez', 'Tasarruf artar'], correctIndex: 1, explain: 'Giderlerin gelirinden hızlı artıyordur.' },
    { id: 'b6', q: 'Finansal okuryazarlık neden önemlidir?', choices: ['Matematik çözmek için', 'Daha bilinçli harcama ve yatırım kararları almak için', 'Sadece bankacı olmak için', 'Zengin görünmek için'], correctIndex: 1, explain: 'Bilgi paradan daha değerlidir.' },
    { id: 'b7', q: 'Hangi yatırım türü enflasyona karşı koruma sağlayabilir?', choices: ['Yastık altı TL', 'Varlık değerini koruyan hisse veya emtialar', 'Eski kıyafetler', 'Gömülü para'], correctIndex: 1, explain: 'Değer üreten varlıklar enflasyonu yenebilir.' },
    { id: 'b8', q: 'Faiz oranları artarsa borçlanma maliyeti ne olur?', choices: ['Düşer', 'Artar', 'Aynı kalır', 'Sıfırlanır'], correctIndex: 1, explain: 'Kredi çekmek daha pahalı hale gelir.' },
    { id: 'b9', q: 'Acil durum fonu neden ayrı tutulmalıdır?', choices: ['Yatırım yapmak için', 'Zor zamanlarda borca girmeden hayatta kalmak için', 'Hediye almak için', 'Banka istediği için'], correctIndex: 1, explain: 'Zor günlerin kalkanıdır.' },
    { id: 'b10', q: 'Yatırımda "Disiplin" ne demektir?', choices: ['Çok ders çalışmak', 'Piyasa dalgalanmalarına rağmen plana sadık kalmak', 'Hiç para harcamamak', 'Her gün borsa izlemek'], correctIndex: 1, explain: 'Duygulara yenik düşmemek başarının anahtarıdır.' },
  ];
  return pool.map(shuffleChoices);
}

function generateStockPatternsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 's1', q: 'Grafikte "Fitil" (İğne) neyi temsil eder?', choices: ['Hata oluştuğunu', 'Fiyatın o seviyeleri gördüğünü ama orada tutunamadığını', 'Piyasanın kapandığını', 'Vergi oranını'], correctIndex: 1, explain: 'Fitil, reddedilmiş fiyat bölgelerini gösterir.' },
    { id: 's2', q: 'Doji mumu gördüğünüzde en doğru yaklaşım nedir?', choices: ['Hemen her şeyi satın', 'Kararsızlık olduğu için sonraki mumun teyidini beklemek', 'Bütün parayı yatırmak', 'Haberlere bakmamak'], correctIndex: 1, explain: 'Doji bir bekleyiş ve kararsızlık mumudur.' },
    { id: 's3', q: 'Marubozu mumu ne anlatır?', choices: ['Piyasanın çok kararsız olduğunu', 'Trendin o yönde çok güçlü ve kararlı olduğunu', 'Hacmin düştüğünü', 'Borsada tatil olduğunu'], correctIndex: 1, explain: 'Fitilsiz gövde tam hakimiyet demektir.' },
    { id: 's4', q: 'Hammer (Çekiç) mumu neden altına uzun bir iğne bırakır?', choices: ['Fiyatın yanlış girilmesi yüzünden', 'Satış baskısının geldiği ama alıcıların fiyatı yukarı çektiği için', 'Zenginler öyle istediği için', 'İşlem hacmi düşük olduğu için'], correctIndex: 1, explain: 'Alttan gelen sert alım tepkisini gösterir.' },
    { id: 's5', q: 'Teknik analizde "Trend" ne demektir?', choices: ['Moda olan hisseler', 'Fiyatın genel gidiş yönü', 'Hisse senedi sayısı', 'Şirket adı'], correctIndex: 1, explain: 'Fiyatın genel eğilimidir.' },
    { id: 's6', q: 'Shooting Star mumu nerede tehlike işareti olabilir?', choices: ['Düşüşün en dibinde', 'Yükseliş trendinin sonunda veya bir dirençte', 'Yatay piyasada', 'Hafta başında'], correctIndex: 1, explain: 'Yukarıdaki satış baskısını ve dönüş ihtimalini gösterir.' },
    { id: 's7', q: 'Yeşil bir mumun gövdesi neyi gösterir?', choices: ['Dolar kurunu', 'Kapanış fiyatının açılıştan daha yüksek olduğunu', 'Şirketin karını', 'Zarar edildiğini'], correctIndex: 1, explain: 'Yeşil mum yükselişi temsil eder.' },
    { id: 's8', q: 'Gravestone Doji piyasaya nasıl bir mesaj verir?', choices: ['Her şey harika', 'Yukarı denemelerin reddedildiği ve ayıların güçlendiği', 'Yeni bir rekor geleceği', 'Piyasanın çok neşeli olduğu'], correctIndex: 1, explain: 'Üst fitil uzun, kapanış dipteyse zayıflık işaretidir.' },
    { id: 's9', q: 'Mum grafiklerini neden kullanırız?', choices: ['Rengarenk olduğu için', 'Fiyat hareketlerini ve piyasa psikolojisini hızlıca okumak için', 'Matematik sorusu çözmek için', 'Daha pahalı olduğu için'], correctIndex: 1, explain: 'Piyasa aksiyonunu özetler.' },
    { id: 's10', q: 'Bir mumu "doğru" yorumlamak için hangisi şarttır?', choices: ['Rengine bakmak', 'Bağlam (önceki mumlar ve seviyeler) ile birlikte değerlendirmek', 'Hemen işlem açmak', 'Arkadaşına sormak'], correctIndex: 1, explain: 'Tek mum her zaman eksik bilgi verir.' },
  ];
  return pool.map(shuffleChoices);
}

function generateInvestingQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'i1', q: 'DCA (Kademeli Alım) stratejisinin ana avantajı nedir?', choices: ['En düşükten alma garantisi', 'Stresi azaltıp ortalama maliyeti piyasa koşullarına göre iyileştirmek', 'Anında zengin etmek', 'Hiç zarar etmemek'], correctIndex: 1, explain: 'Disiplin, duygusal hataları önler.' },
    { id: 'i2', q: 'Portföy çeşitlendirmesi neden önerilir?', choices: ['Çok fazla hisse sahibi olmak için', 'Tek bir varlıktaki riskin tüm parayı batırmasını önlemek için', 'Hepsini takip etmek kolay olduğu için', 'Banka istediği için'], correctIndex: 1, explain: 'Riski yaymak ana stratejidir.' },
    { id: 'i3', q: 'Hisse senedi yatırımcısı aslında kime güvenmiş olur?', choices: ['Borsa binasına', 'Şirketin yönetimine ve gelecekteki kar üretme potansiyeline', 'Sadece şansına', 'Arkadaşına'], correctIndex: 1, explain: 'Şirkete ortak oluyorsun.' },
    { id: 'i4', q: 'Risk ve getiri arasındaki ilişki genelde nasıldır?', choices: ['Ters orantılı', 'Doğru orantılı (Risk arttıkça potansiyel getiri artar ama kayıp riski de büyür)', 'Hiçbir ilişki yoktur', 'Her zaman sabittir'], correctIndex: 1, explain: 'Yüksek kazanç yüksek risk getirir.' },
    { id: 'i5', q: 'Sabırlı bir yatırımcı ne yapmalıdır?', choices: ['Her gün al-sat yapmalı', 'Planına sadık kalıp uzun vadeli hedeflerine odaklanmalı', 'Tüm parasını tek seferde kullanmalı', 'Sürekli haberleri beklemeli'], correctIndex: 1, explain: 'Vade yatırımın en büyük dostudur.' },
  ];
  return pool.map(shuffleChoices);
}

function generateCreditQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'c1', q: 'Kredi kartı asgari ödemesi hakkında hangisi doğrudur?', choices: ['Borcu bitirmenin en iyi yoludur', 'Kalan borca faiz işleten ve borcu uzatan bir tuzaktır', 'Sadece zenginlere özeldir', 'Puan kazandırır'], correctIndex: 1, explain: 'Asgari ödeme borç sarmalı yaratır.' },
    { id: 'c2', q: 'Hangi davranış kredi notunu (Findeks) olumlu etkiler?', choices: ['Fatura ve taksitleri düzenli/vaktinde ödemek', 'Sürekli yeni kredi başvurusu yapmak', 'Tüm kart limitlerini sonuna kadar kullanmak', 'Hiç banka hesabı açmamak'], correctIndex: 0, explain: 'Ödeme disiplini en büyük puandır.' },
    { id: 'c3', q: 'Kredi kartı limiti neye göre belirlenmelidir?', choices: ['Maksimum harcama isteğine göre', 'Ödeme gücüne ve gelire göre', 'Arkadaşının limitine göre', 'Cüzdanın büyüklüğüne göre'], correctIndex: 1, explain: 'Limit, ödeyebileceğin kadar olmalı.' },
  ];
  return pool.map(shuffleChoices);
}

function generateMacroQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'm1', q: 'Merkez Bankası neden faiz artırır?', choices: ['Herkesin zengin olması için', 'Piyasayı soğutmak ve yükselen enflasyonu frenlemek için', 'Harcamaları teşvik etmek için', 'Doların bitmesi için'], correctIndex: 1, explain: 'Sıkı para politikası enflasyonu düşürmeyi hedefler.' },
    { id: 'm2', q: 'Resesyon neyin habercisidir?', choices: ['Ekonomik bayramın', 'Ekonomik daralma ve üretimin azalmasının', 'Herkesin işe girmesinin', 'Borsanın uçmasının'], correctIndex: 1, explain: 'Ekonomik durgunluk demektir.' },
  ];
  return pool.map(shuffleChoices);
}

function generatePsychSafetyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'p1', q: 'FOMO etkisi altına giren biri hangisini yapar?', choices: ['Sakin kalıp analiz yapar', 'Başkaları kazanıyor diye gaza gelip en tepeden alım yapar', 'Zararına her şeyi satar', 'Hicbir şey yapmaz'], correctIndex: 1, explain: 'Fırsatı kaçırma korkusu hata yaptırır.' },
    { id: 'p2', q: 'Sahte bir banka linkine tıklamak neye yol açabilir?', choices: ['Hediye kazanmaya', 'Kişisel bilgilerinin ve şifrelerinin çalınmasına', 'İnternetin hızlanmasına', 'Telefonun güncellenmesine'], correctIndex: 1, explain: 'Oltalama saldırıları çok tehlikelidir.' },
    { id: 'p3', q: 'Zararda olan bir pozisyonu "belki çıkar" diye aylarca bekletmek hangi psikolojik hatadır?', choices: ['Analitik düşünme', 'Kayıptan kaçınma (Loss Aversion)', 'Stratejik deha', 'Şans faktörü'], correctIndex: 1, explain: 'Zararı kabullenememek sermayeyi bitirebilir.' },
  ];
  return pool.map(shuffleChoices);
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
    quiz: generateBasicsQuiz(), // Can be improved
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
