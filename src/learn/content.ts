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
        short: 'Paranın satın alma gücü düşer.',
        body: [
          'Enflasyon, aynı parayla daha az şey alabilmektir.',
          'Maaşın %30 artıp fiyatlar %60 artarsa aslında daha az ürün alırsın.',
          'Reel değer: Cebindeki para değil, o parayla kaç ürün alabildiğindir.',
        ],
        tips: ['Alım gücünü korumak için tasarruf + bilinçli yatırım önemlidir.'],
      },
      {
        id: 'interest-basic',
        title: 'FAİZ & BİLEŞİK ETKİ',
        short: 'Faiz paranın kullanım bedelidir.',
        body: [
          'Faiz, parayı kullanmanın bedelidir.',
          'Bileşik etki, kazancın tekrar kazanç üretmesidir. Zamanla hızlanır.',
          'Ne kadar erken başlarsan, büyüme o kadar güçlü olur.',
        ],
      },
      {
        id: 'liquidity',
        title: 'LİKİDİTE',
        short: 'Paraya hızlı ulaşabilmek.',
        body: [
          'Nakit en likit varlıktır. Ev/arsa ise likiditesi düşüktür.',
          'Acil durumda nakde hızlı dönebilen şey daha güvenlidir.',
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
        short: 'Basit bir bütçe planı.',
        body: [
          '%50 ihtiyaçlar: kira, fatura, gıda.',
          '%30 istekler: eğlence, hobi, dışarıda yemek.',
          '%20 gelecek: birikim ve borç kapatma.',
        ],
        tips: ['Oranları durumuna göre esnetebilirsin; ama birikimi sıfırlama.'],
      },
      {
        id: 'emergency-fund',
        title: 'ACİL DURUM FONU',
        short: 'Beklenmedik masraflar için.',
        body: [
          'Telefon bozulabilir, sağlık masrafı çıkabilir.',
          'Acil fon yoksa kredi kartına yüklenirsin ve faiz büyür.',
          'Hedef: En az 3–6 aylık temel gideri biriktirmek.',
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
        short: 'Borcu uzatır, faizi büyütür.',
        body: [
          'Asgari ödeme gecikmeyi önler ama borcun büyük kısmı kalır.',
          'Her ay asgari ödemek borcu uzatır ve faiz yükünü artırır.',
        ],
        tips: ['Mümkünse kart borcunu tamamen kapat.'],
      },
      {
        id: 'credit-score',
        title: 'KREDİ NOTU (FİNDEKS)',
        short: 'Bankaların sana duyduğu güven puanı.',
        body: [
          'Ödemeleri geciktirirsen not düşer. Not düşükse kredi almak zorlaşır.',
          'Düzenli ödeme yapmak puanı yükseltir.',
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
        short: 'Düzenli alım yapma yöntemi.',
        body: [
          'DCA: Her ay sabit bir tutarla alım yapmak.',
          'Fiyat düşünce daha çok, yükselince daha az alırsın. Ortalama maliyet dengelenir.',
        ],
        tips: ['Stresten kaçınmak için düzenli plan iş görür.'],
      },
      {
        id: 'diversification',
        title: 'ÇEŞİTLENDİRME',
        short: 'Riski tek yere bağlama.',
        body: [
          'Tek bir varlığa bağlanırsan, o düşerse tüm para zarar görür.',
          'Hisse, fon, altın ve döviz gibi farklı araçlara dağıtmak riski azaltır.',
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
        short: 'Fiyatın kısa özetini gösterir.',
        body: [
          'Mumlar, belirli bir sürede fiyatın açılış ve kapanışını gösterir.',
          'Gövde ana hareketi, fitiller ise gidip geri dönen fiyatları anlatır.',
        ],
      },
      {
        id: 'doji-deep',
        title: 'DOJİ',
        short: 'Kararsızlık işareti.',
        body: [
          'Açılış ve kapanış çok yakındır. Artı (+) gibi görünür.',
          'Alıcılar ve satıcılar dengededir. Tek başına kesin sinyal değildir.',
        ],
      },
      {
        id: 'hammer-deep',
        title: 'ÇEKİÇ (HAMMER)',
        short: 'Düşüşten dönüş ihtimali.',
        body: [
          'Küçük gövde + altta uzun fitil.',
          'Fiyat düşmüş ama alıcılar toparlamıştır. Destekte görülürse dikkat çekebilir.',
        ],
      },
      {
        id: 'shooting-star-deep',
        title: 'SHOOTING STAR',
        short: 'Yükselişte yorulma işareti.',
        body: [
          'Üstte uzun fitil, küçük gövde.',
          'Yükseliş sonrası görülürse satış baskısını gösterebilir.',
        ],
      },
      {
        id: 'marubozu-deep',
        title: 'MARUBOZU',
        short: 'Tek taraf baskın.',
        body: [
          'Fitil çok azdır; gövde güçlüdür.',
          'Yeşilse alıcılar, kırmızıysa satıcılar baskındır.',
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
        short: 'Ekonomiyi soğutma/ısıtma düğmesi.',
        body: [
          'Faiz artarsa kredi almak pahalanır, harcama azalır.',
          'Amaç çoğu zaman enflasyonu düşürmektir.',
        ],
      },
      {
        id: 'growth-gdp',
        title: 'EKONOMİK BÜYÜME (GSYH)',
        short: 'Ülkenin toplam üretimi.',
        body: [
          'GSYH, bir ülkenin bir yılda ürettiği toplam değer demektir.',
          'Büyüme artarsa iş fırsatları ve gelirler artabilir.',
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
        short: '“Herkes kazanıyor” paniği.',
        body: [
          'Başkaları kazanıyor diye aceleyle alım yapmak.',
          'Duygusal kararlar genelde pahalıya patlar.',
        ],
        tips: ['Yoğun heyecan varsa 24 saat beklemek iyi bir filtredir.'],
      },
      {
        id: 'loss-aversion',
        title: 'KAYIPTAN KAÇINMA',
        short: 'Zararı kabul etmeyi ertelemek.',
        body: [
          'Zararını kabul etmemek daha büyük kayıplara yol açabilir.',
          'Planlı yatırımcı gerektiğinde zarar durdur uygular.',
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
        short: 'Sahte link tuzağı.',
        body: [
          'Dolandırıcılar banka/kargo gibi davranıp sahte link gönderir.',
          'Şifre girersen hesap ele geçirilir. 2FA mutlaka açık olsun.',
        ],
        tips: ['Resmî kurumlar mesajla şifre istemez.'],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
];
