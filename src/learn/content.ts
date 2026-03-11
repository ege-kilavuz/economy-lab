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
  scenario?: string;
  qa?: { q: string; a: string }[];
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
    { id: 'b1', q: 'Enflasyon olunca ne olur?', choices: ['Paranın gücü artar', 'Aynı parayla daha az şey alınır', 'Krediler biter', 'İşsizlik sıfırlanır'], correctIndex: 1, explain: 'Fiyatlar artınca alım gücü düşer.' },
    { id: 'b2', q: 'Fırsat maliyeti ne demek?', choices: ['Etiket fiyatı', 'Seçtiğin şey yüzünden vazgeçtiğin diğer seçenek', 'Kargo ücreti', 'Banka masrafı'], correctIndex: 1, explain: 'Birini seçmek, diğerinden vazgeçmek demektir.' },
    { id: 'b3', q: 'Bileşik getiri en çok ne zaman büyür?', choices: ['Kısa vadede', 'Uzun vadede ve düzenli yatırımda', 'Sadece büyük parayla', 'Sadece altınla'], correctIndex: 1, explain: 'Zaman, bileşiği güçlendirir.' },
    { id: 'b4', q: 'Likit varlık ne demektir?', choices: ['Rengi su gibi', 'Hızlıca nakde dönen', 'Çok pahalı', 'Sadece bankada duran'], correctIndex: 1, explain: 'Nakit en likit varlıktır.' },
    { id: 'b5', q: 'Maaş artışı enflasyondan düşükse ne olur?', choices: ['Zenginleşirsin', 'Reel gelir düşer', 'Hiç değişmez', 'Tasarruf artar'], correctIndex: 1, explain: 'Fiyatlar daha hızlı artıyordur.' },
    { id: 'b6', q: 'Finansal okuryazarlık neden önemli?', choices: ['Matematik çözmek için', 'Parayı daha bilinçli yönetmek için', 'Sadece bankacı olmak için', 'Havalı görünmek için'], correctIndex: 1, explain: 'Bilinçli karar daha az hata demektir.' },
    { id: 'b7', q: 'Enflasyona karşı hangisi daha koruyucu olabilir?', choices: ['Yastık altı TL', 'Değer üreten varlıklar', 'Eski kıyafetler', 'Gömülü para'], correctIndex: 1, explain: 'Değer üreten varlıklar parayı korur.' },
    { id: 'b8', q: 'Faiz artarsa kredi maliyeti ne olur?', choices: ['Düşer', 'Artar', 'Aynı kalır', 'Sıfırlanır'], correctIndex: 1, explain: 'Faiz yükselince kredi pahalanır.' },
    { id: 'b9', q: 'Acil durum fonu neden gerekir?', choices: ['Yatırım yapmak için', 'Zor zamanda borca girmemek için', 'Hediye almak için', 'Banka istediği için'], correctIndex: 1, explain: 'Beklenmedik masraf için güvenliktir.' },
    { id: 'b10', q: 'Yatırımda disiplin ne demektir?', choices: ['Çok ders çalışmak', 'Planına sadık kalmak', 'Hiç harcamamak', 'Her gün borsa izlemek'], correctIndex: 1, explain: 'Duygulara kapılmadan planı sürdürmektir.' },
  ];
  return pool.map(shuffleChoices);
}

function generateStockPatternsQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 's1', q: 'Grafikte fitil (iğne) neyi gösterir?', choices: ['Hata var', 'Fiyat oraya gitti ama tutunamadı', 'Piyasa kapandı', 'Vergi oranı'], correctIndex: 1, explain: 'Fitil, reddedilen fiyatı anlatır.' },
    { id: 's2', q: 'Doji görürsen en mantıklı hareket?', choices: ['Hemen alım yapmak', 'Kararsızlık için teyit beklemek', 'Tüm parayı yatırmak', 'Habere bakmamak'], correctIndex: 1, explain: 'Doji kararsızlık göstergesidir.' },
    { id: 's3', q: 'Marubozu mumu ne söyler?', choices: ['Piyasa kararsız', 'Trend çok güçlü', 'Hacim düştü', 'Borsa tatil'], correctIndex: 1, explain: 'Fitilsiz gövde güçlü yönü gösterir.' },
    { id: 's4', q: 'Çekiç mumunda alt fitil neden uzundur?', choices: ['Fiyat yanlış girildi', 'Satış geldi ama alıcılar toparladı', 'Zenginler öyle istedi', 'Hacim düşük'], correctIndex: 1, explain: 'Düşüşten güçlü dönüş sinyali olabilir.' },
    { id: 's5', q: 'Trend ne demektir?', choices: ['Moda hisse', 'Fiyatın genel yönü', 'Hisse sayısı', 'Şirket adı'], correctIndex: 1, explain: 'Genel gidiş yönünü anlatır.' },
    { id: 's6', q: 'Shooting Star nerede tehlike işareti olur?', choices: ['Düşüş dibinde', 'Yükseliş sonunda/dirençte', 'Yatay piyasada', 'Hafta başında'], correctIndex: 1, explain: 'Yukarıda satış baskısını gösterir.' },
    { id: 's7', q: 'Yeşil mum neyi gösterir?', choices: ['Dolar kurunu', 'Kapanış açılıştan yüksek', 'Şirket kârı', 'Zarar'], correctIndex: 1, explain: 'Yeşil yükseliş demektir.' },
    { id: 's8', q: 'Gravestone Doji ne mesaj verir?', choices: ['Her şey harika', 'Yukarı deneme reddedildi', 'Yeni rekor gelecek', 'Piyasa çok neşeli'], correctIndex: 1, explain: 'Üst fitil uzunsa zayıflık olabilir.' },
    { id: 's9', q: 'Mum grafikleri neden kullanılır?', choices: ['Renkli diye', 'Fiyatı ve psikolojiyi hızlı okumak için', 'Matematik sorusu için', 'Daha pahalı olduğu için'], correctIndex: 1, explain: 'Fiyat hareketini özetler.' },
    { id: 's10', q: 'Bir mumu doğru yorumlamak için ne gerekir?', choices: ['Sadece rengine bakmak', 'Bağlamı görmek (önceki mumlar/seviyeler)', 'Hemen işlem açmak', 'Arkadaşa sormak'], correctIndex: 1, explain: 'Tek mum tek başına yeterli olmaz.' },
  ];
  return pool.map(shuffleChoices);
}

function generateInvestingQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'i1', q: 'DCA’nın (kademeli alım) en büyük faydası nedir?', choices: ['En dipten alma garantisi', 'Stresi azaltıp ortalama maliyeti dengelemek', 'Hemen zengin etmek', 'Hiç zarar etmemek'], correctIndex: 1, explain: 'Düzenli alım duygusal hatayı azaltır.' },
    { id: 'i2', q: 'Çeşitlendirme neden yapılır?', choices: ['Çok hisse olsun diye', 'Tek riske bağlı kalmamak için', 'Takibi kolay olsun diye', 'Banka istediği için'], correctIndex: 1, explain: 'Riski dağıtmak için yapılır.' },
    { id: 'i3', q: 'Hisse senedi alırken aslında neye güvenirsin?', choices: ['Borsa binasına', 'Şirketin gelecekte para kazanmasına', 'Şansa', 'Arkadaşına'], correctIndex: 1, explain: 'Şirkete ortak oluyorsun.' },
    { id: 'i4', q: 'Risk ve getiri ilişkisi genelde nasıldır?', choices: ['Ters orantılı', 'Risk artarsa potansiyel getiri de artar', 'Hiç ilişki yok', 'Hep sabittir'], correctIndex: 1, explain: 'Yüksek getiri genelde yüksek risk getirir.' },
    { id: 'i5', q: 'Sabırlı yatırımcı ne yapar?', choices: ['Her gün al-sat', 'Planına sadık kalır', 'Tüm parayı tek seferde kullanır', 'Sürekli haber bekler'], correctIndex: 1, explain: 'Uzun vade en büyük avantajdır.' },
  ];
  return pool.map(shuffleChoices);
}

function generateCreditQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'c1', q: 'Asgari ödeme hakkında hangisi doğru?', choices: ['Borcu bitirir', 'Borcu uzatır ve faizi artırır', 'Sadece zenginlere özeldir', 'Hediye kazandırır'], correctIndex: 1, explain: 'Asgari ödeme borcu bitirmez.' },
    { id: 'c2', q: 'Kredi notunu ne yükseltir?', choices: ['Faturaları zamanında ödemek', 'Sürekli kredi başvurusu', 'Limitleri sonuna kadar kullanmak', 'Hesap açmamak'], correctIndex: 0, explain: 'Düzenli ödeme güven demektir.' },
    { id: 'c3', q: 'Kart limiti neye göre olmalı?', choices: ['İstediğin harcama', 'Gelir ve ödeme gücü', 'Arkadaşının limiti', 'Cüzdan boyutu'], correctIndex: 1, explain: 'Ödeyebileceğin kadar limit sağlıklıdır.' },
  ];
  return pool.map(shuffleChoices);
}

function generateMacroQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'm1', q: 'Merkez Bankası neden faiz artırabilir?', choices: ['Herkesi zengin etmek için', 'Enflasyonu yavaşlatmak için', 'Harcama artsın diye', 'Dolar bitsin diye'], correctIndex: 1, explain: 'Amaç genelde fiyat artışını yavaşlatmaktır.' },
    { id: 'm2', q: 'Resesyon ne demektir?', choices: ['Ekonomik bayram', 'Ekonomik daralma', 'Herkes işe girer', 'Borsa uçar'], correctIndex: 1, explain: 'Ekonomi küçülür, üretim düşer.' },
  ];
  return pool.map(shuffleChoices);
}

function generatePsychSafetyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'p1', q: 'FOMO yaşayan biri ne yapar?', choices: ['Sakin analiz yapar', 'Herkes kazanıyor diye acele alım yapar', 'Zararına hemen satar', 'Hiçbir şey yapmaz'], correctIndex: 1, explain: 'Fırsatı kaçırma korkusu hataya sürükler.' },
    { id: 'p2', q: 'Sahte banka linkine tıklamak neye yol açabilir?', choices: ['Hediye kazanmak', 'Şifrelerin çalınması', 'İnternetin hızlanması', 'Telefon güncellemesi'], correctIndex: 1, explain: 'Oltalama ile hesap ele geçirilebilir.' },
    { id: 'p3', q: 'Zarardaki pozisyonu “belki çıkar” diye bekletmek hangi hatadır?', choices: ['Analitik düşünme', 'Kayıptan kaçınma', 'Stratejik deha', 'Şans faktörü'], correctIndex: 1, explain: 'Zararı kabullenmemek kaybı büyütebilir.' },
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
        scenario: 'Market sepeti 1.000 TL iken 1.500 TL oldu; maaşın sadece 1.200 TL’ye çıktı → daha az ürün alırsın.',
        qa: [
          { q: 'Enflasyon olunca ne hissederim?', a: 'Aynı parayla daha az şey alırsın.' },
          { q: 'Reel gelir nedir?', a: 'Paranın satın alma gücüdür.' },
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
        scenario: '1.000 TL’yi her ay %2 büyütürsen, bir süre sonra kazanç kendi kendini hızlandırır.',
        qa: [
          { q: 'Bileşik etki neden önemlidir?', a: 'Kazanç tekrar kazanç üretir.' },
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
        scenario: 'Acil para lazım oldu: nakit hemen kullanılır, ev satmak ise haftalar sürer.',
        qa: [
          { q: 'En likit varlık hangisi?', a: 'Nakit.' },
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
        scenario: 'Aylık gelirin 20.000 TL ise: 10.000 ihtiyaç, 6.000 istek, 4.000 birikim gibi düşünebilirsin.',
        qa: [
          { q: 'Bu oranlar sabit mi?', a: 'Değil; ama birikimi sıfırlama.' },
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
        scenario: 'Telefonun bozuldu ve 8.000 TL çıktı; acil fon varsa kart borcuna girmeden çözersin.',
        qa: [
          { q: 'Acil fon ne işe yarar?', a: 'Beklenmedik masrafları borçsuz kapatır.' },
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
        scenario: '10.000 TL borcun var, asgariyi ödedin → borç yavaş azalır ama faiz işlemeye devam eder.',
        qa: [
          { q: 'Asgari ödeme borcu bitirir mi?', a: 'Hayır, borcu uzatır.' },
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
        scenario: 'Faturaları hep zamanında ödersen bankalar seni daha güvenilir görür.',
        qa: [
          { q: 'Notu ne yükseltir?', a: 'Düzenli ve zamanında ödeme.' },
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
        scenario: 'Her ay 500 TL ile alım yaparsan, fiyat dalgalansa da ortalama maliyet dengelenir.',
        qa: [
          { q: 'DCA’nın amacı ne?', a: 'Fiyat stresini azaltmak.' },
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
        scenario: 'Sadece tek hisse yerine, 3–4 farklı araca dağıtınca risk düşer.',
        qa: [
          { q: 'Çeşitlendirme ne sağlar?', a: 'Riski dağıtır.' },
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
        scenario: 'Bir mumda fiyat 10’dan 12’ye çıktıysa gövde büyür; 13’e gidip 12’ye dönerse üst fitil oluşur.',
        qa: [
          { q: 'Fitil neyi anlatır?', a: 'Gidip geri dönen fiyatları.' },
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
        scenario: 'Fiyat gün boyu gidip geldi ama kapanış açılışa çok yakınsa doji oluşur.',
        qa: [
          { q: 'Doji tek başına yeter mi?', a: 'Hayır, teyit gerekir.' },
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
        scenario: 'Fiyat 100’den 90’a sarktı ama gün sonu 98’e döndü → alt fitil uzar.',
        qa: [
          { q: 'Alt fitil uzunsa ne olabilir?', a: 'Dönüş ihtimali artar.' },
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
        scenario: 'Fiyat 100’den 115’e çıktı ama 102’ye indi → üst fitil uzun kalır.',
        qa: [
          { q: 'Nerede daha anlamlıdır?', a: 'Yükseliş sonunda.' },
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
        scenario: 'Gün boyu sürekli yükselip yüksekten kapanırsa marubozu oluşur.',
        qa: [
          { q: 'Marubozu ne anlatır?', a: 'Tek taraf güçlüdür.' },
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
        scenario: 'Faiz yükselince kredi çekmek zorlaşır; insanlar harcamayı azaltır.',
        qa: [
          { q: 'Faiz artarsa ne olur?', a: 'Kredi pahalanır, harcama azalır.' },
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
        scenario: 'Yeni fabrikalar açılırsa üretim artar, daha çok kişi iş bulabilir.',
        qa: [
          { q: 'Büyüme artınca ne olabilir?', a: 'İş ve gelir artabilir.' },
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
        scenario: 'Herkes bir coinden bahsedince hemen almak, çoğu zaman en pahalı noktaya denk gelir.',
        qa: [
          { q: 'FOMO’ya kapılınca ne olur?', a: 'Aceleyi artırır, hata riski büyür.' },
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
        scenario: 'Zararda olan hissede “belki döner” diye beklemek, zararı büyütebilir.',
        qa: [
          { q: 'Kayıptan kaçınma neye yol açar?', a: 'Zararı büyütebilir.' },
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
        scenario: '“Kargonuz yolda” linki geldi; resmi uygulamadan kontrol et, linke tıklama.',
        qa: [
          { q: 'Güvenli hareket ne?', a: 'Resmî uygulamadan kontrol etmek.' },
        ],
        tips: ['Resmî kurumlar mesajla şifre istemez.'],
      },
    ],
    quiz: generatePsychSafetyQuiz(),
  },
];
