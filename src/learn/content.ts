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
  video?: {
    title: string;
    url: string;
    source?: string;
  };
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
    { id: 's1', q: 'Hisse senedi alırken aslında neye ortak olursun?', choices: ['Bankaya', 'Şirkete', 'Devlete', 'Markete'], correctIndex: 1, explain: 'Hisse senedi, şirkete ortaklık payını temsil eder.' },
    { id: 's2', q: 'Risk ve getiri ilişkisi genelde nasıldır?', choices: ['Yüksek getiri hep risksizdir', 'Risk arttıkça olası getiri de artabilir', 'Hiç ilişki yoktur', 'Sadece kriptoda vardır'], correctIndex: 1, explain: 'Yüksek getiri beklentisi çoğu zaman daha yüksek risk taşır.' },
    { id: 's3', q: 'Borsada çeşitlendirme neden yapılır?', choices: ['Takibi zorlaştırmak için', 'Tek bir riske bağlı kalmamak için', 'Daha çok işlem ücreti ödemek için', 'Her gün al-sat yapmak için'], correctIndex: 1, explain: 'Çeşitlendirme, riskin tek bir varlıkta toplanmasını azaltır.' },
    { id: 's4', q: 'Halka arz neyi ifade eder?', choices: ['Şirketin borcunu silmesini', 'Şirket paylarının yatırımcılara sunulmasını', 'Bankanın faiz indirmesini', 'Devletin vergi toplamasını'], correctIndex: 1, explain: 'Halka arzda şirket payları yatırımcılara açılır.' },
    { id: 's5', q: 'Bir hisseye sadece sosyal medyada konuşuluyor diye girmek hangi riski artırır?', choices: ['Disiplini güçlendirir', 'Sürü psikolojisini ve plansız alımı artırır', 'Getiriyi garanti eder', 'Vergiyi azaltır'], correctIndex: 1, explain: 'Popülerlik tek başına sağlıklı yatırım gerekçesi değildir.' },
    { id: 's6', q: 'Borsada ilk bakılması gerekenlerden biri hangisidir?', choices: ['Sadece forum yorumu', 'Şirket ve risk/getiri dengesi', 'Sadece logo rengi', 'Arkadaş tavsiyesi'], correctIndex: 1, explain: 'Karar verirken şirketin yapısı ve risk-getiri dengesi değerlendirilmelidir.' },
    { id: 's7', q: 'Tek hisseye tüm parayı koymanın temel sakıncası nedir?', choices: ['Getiriyi düşürmesi', 'Riski tek noktada toplaması', 'Vergiyi otomatik artırması', 'Borsayı kapatması'], correctIndex: 1, explain: 'Tek varlığa yoğunlaşmak zarar ihtimalini büyütebilir.' },
    { id: 's8', q: 'Yüksek getiri beklentisi olan hisse veya araçlar için hangisi doğrudur?', choices: ['Kesin kazandırır', 'Yüksek risk de barındırabilir', 'Asla değer kaybetmez', 'Sadece uzmanlar zarar eder'], correctIndex: 1, explain: 'Beklenen getiri arttıkça belirsizlik ve oynaklık da artabilir.' },
    { id: 's9', q: 'Borsada bilinçli yatırımcı ne yapar?', choices: ['Tek söylentiyle karar verir', 'Bilgi toplar, riski değerlendirir', 'Her gün panikle işlem açar', 'Borçla sürekli alım yapar'], correctIndex: 1, explain: 'Bilinçli yatırım, veri ve planla hareket etmeyi gerektirir.' },
    { id: 's10', q: 'Bir yatırım aracını değerlendirirken geçmiş performans için en sağlıklı yaklaşım hangisi?', choices: ['Geçmiş hep geleceği garanti eder', 'Geçmiş veri fikir verir ama garanti sağlamaz', 'Geçmişe hiç bakılmaz', 'Sadece son güne bakılır'], correctIndex: 1, explain: 'Geçmiş performans bilgi sağlar ama kesin sonuç sözü vermez.' },
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

function generateBudgetQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'bu1', q: 'Acil durum fonunun temel amacı nedir?', choices: ['Daha çok alışveriş yapmak', 'Beklenmedik masrafta borca girmemek', 'Vergi ödememek', 'Kur farkı kovalamak'], correctIndex: 1, explain: 'Acil fon, şok giderlerde güvenlik yastığıdır.' },
    { id: 'bu2', q: '50/30/20 kuralındaki %20 genelde ne içindir?', choices: ['Sadece tatil', 'Birikim ve borç kapatma', 'Sadece kira', 'Kripto al-sat'], correctIndex: 1, explain: 'Gelecek payı genelde birikim + borç azaltma içindir.' },
    { id: 'bu3', q: 'Bütçe yaparken ilk sıraya genelde ne yazılır?', choices: ['Lüks harcamalar', 'Temel ihtiyaçlar', 'Sosyal medya abonelikleri', 'Hediyeler'], correctIndex: 1, explain: 'Kira, gıda, ulaşım gibi temel ihtiyaçlar önce gelir.' },
    { id: 'bu4', q: 'Beklenmedik 8.000 TL masraf çıktıysa en sağlıklı ilk kaynak hangisi olabilir?', choices: ['Yeni kredi çekmek', 'Acil durum fonu', 'Asgari ödeme', 'Arkadaş gazı'], correctIndex: 1, explain: 'Acil fon bu tip şoklar içindir.' },
    { id: 'bu5', q: 'Bütçede “istekler” bölümü neyi kapsar?', choices: ['Kira ve faturalar', 'Eğlence ve keyfi harcamalar', 'Vergi ve sigorta', 'Borç faizi'], correctIndex: 1, explain: 'İstekler, ertelenebilir/keyfi harcamalardır.' },
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

function generatePsychologyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'ps1', q: 'FOMO yaşayan biri en çok hangi riski alır?', choices: ['Planlı hareket etme', 'Aceleyle yüksekten alma', 'Daha düşük komisyon ödeme', 'Nakit biriktirme'], correctIndex: 1, explain: 'FOMO, plansız ve pahalı girişe yol açabilir.' },
    { id: 'ps2', q: 'Kayıptan kaçınma hangi davranışta görülür?', choices: ['Zarar kesip plana dönmek', 'Zarardaki pozisyonu “belki döner” diye sonsuza dek tutmak', 'Portföyü çeşitlendirmek', 'Acil fon ayırmak'], correctIndex: 1, explain: 'Zararı kabullenmeyi ertelemek, kayıptan kaçınmadır.' },
    { id: 'ps3', q: 'Yatırımda yoğun heyecan hissediyorsan en sağlıklı kısa aksiyon ne olabilir?', choices: ['Hemen tüm parayla girmek', '24 saat bekleyip planı tekrar okumak', 'Daha fazla borçlanmak', 'Sosyal medyayı referans almak'], correctIndex: 1, explain: 'Kısa bekleme, duygusal kararı filtreler.' },
    { id: 'ps4', q: 'Başkasının kazancını görünce stratejiyi bozmak hangi probleme yakındır?', choices: ['Disiplin', 'Sürü psikolojisi', 'Likidite', 'Bileşik getiri'], correctIndex: 1, explain: 'Başkalarını kör taklit etmek sürü psikolojisidir.' },
  ];
  return pool.map(shuffleChoices);
}

function generateSafetyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'sf1', q: 'Dijital bankacılıkta en güvenli giriş yolu hangisidir?', choices: ['Mesajla gelen link', 'Bankanın resmî uygulaması veya adresi', 'Sosyal medya DM’si', 'Forumdaki kısayol'], correctIndex: 1, explain: 'Banka işlemleri yalnızca resmî kanal üzerinden yapılmalıdır.' },
    { id: 'sf2', q: 'Banka kartı ve hesap güvenliğinde 2FA neden önemlidir?', choices: ['Telefonu hızlandırır', 'Şifre ele geçse bile ek doğrulama sağlar', 'Komisyonu düşürür', 'Faizi siler'], correctIndex: 1, explain: 'Ek doğrulama, hesabın ele geçirilmesini zorlaştırır.' },
    { id: 'sf3', q: 'FAST/EFT/havale işlemi yaparken en kritik kontrol nedir?', choices: ['Emoji seçmek', 'Alıcı bilgilerini doğrulamak', 'Ekran parlaklığını artırmak', 'Bildirim sesini açmak'], correctIndex: 1, explain: 'Yanlış alıcıya gönderim riskini azaltmak için alıcı bilgileri kontrol edilmelidir.' },
    { id: 'sf4', q: 'Resmî kurumlar mesajla genelde ne istemez?', choices: ['Şifre/OTP kodu', 'Genel duyuru okumanı', 'Randevu teyidi', 'Çalışma saati bilgisi'], correctIndex: 0, explain: 'Şifre ve doğrulama kodu paylaşılmaz.' },
    { id: 'sf5', q: 'Kredi kartı borcunu yönetirken en sağlıklı yaklaşım hangisidir?', choices: ['Sadece minimumu düşünmek', 'Harcamayı takip edip ödeme planı yapmak', 'Şifreyi paylaşmak', 'Sürekli yeni kart açmak'], correctIndex: 1, explain: 'Kart kullanımı ödeme planı ve harcama takibiyle sağlıklı yönetilir.' },
  ];
  return pool.map(shuffleChoices);
}

// --- CONTENT DEFINITIONS ---

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'basics',
    title: 'FİNANSAL OKURYAZARLIK TEMELLERİ',
    subtitle: 'Para, alım gücü, faiz ve likiditeyi tanı.',
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
        video: {
          title: 'Ekonomiyi Sağlıklı Yorumlama - Enflasyon',
          url: 'https://finansalokuryazarlik.gov.tr/i/ekonomiyi-saglikli-yorumlama-enflasyon',
          source: 'finansalokuryazarlik.gov.tr',
        },
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
        video: {
          title: 'Bütçe Nasıl Oluşturulur?',
          url: 'https://finansalokuryazarlik.gov.tr/i/butce-nasil-olusturulur',
          source: 'finansalokuryazarlik.gov.tr',
        },
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
        video: {
          title: 'Acil Durum Fonu',
          url: 'https://finansalokuryazarlik.gov.tr/i/acil-durum-fonu',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
    ],
    quiz: generateBudgetQuiz(),
  },
  {
    id: 'credit',
    title: 'KREDİ',
    subtitle: 'Borçlanma maliyeti, ödeme disiplini ve kredi notu.',
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
        video: {
          title: 'Kredi Kartı Kullanımı ve Faizi',
          url: 'https://finansalokuryazarlik.gov.tr/i/kredi-karti-kullanimi-ve-faizi',
          source: 'finansalokuryazarlik.gov.tr',
        },
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
        video: {
          title: 'Kredi Notu',
          url: 'https://finansalokuryazarlik.gov.tr/i/kredi-notu',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
    ],
    quiz: generateCreditQuiz(),
  },
  {
    id: 'investing',
    title: 'YATIRIM',
    subtitle: 'Getiri, risk ve düzenli birikim mantığı.',
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
        video: {
          title: 'Nominal Getiri ve Reel Getiri',
          url: 'https://finansalokuryazarlik.gov.tr/i/nominal-getiri-ve-reel-getiri',
          source: 'finansalokuryazarlik.gov.tr',
        },
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
        video: {
          title: 'Yatırım Fonları',
          url: 'https://finansalokuryazarlik.gov.tr/i/yatirim-fonlari',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
    ],
    quiz: generateInvestingQuiz(),
  },
  {
    id: 'stock-patterns',
    title: 'BORSA',
    subtitle: 'Hisse senedi, risk-getiri ve çeşitlendirme.',
    icon: '🕯️',
    items: [
      {
        id: 'stock-basic',
        title: 'HİSSE SENEDİ NEDİR?',
        short: 'Bir şirkete ortaklık payı.',
        body: [
          'Hisse senedi, bir şirketin paylarını temsil eder; alan kişi o şirkete ortak olur.',
          'Bu yüzden hisse yatırımı yalnızca fiyat hareketi değil, şirketin geleceğiyle de ilgilidir.',
        ],
        scenario: 'Bir şirket büyür ve kârlılığını artırırsa yatırımcı ilgisi artabilir; ama her şirkette risk de vardır.',
        qa: [
          { q: 'Hisse almak ne demektir?', a: 'Bir şirkete ortak olmak demektir.' },
        ],
        video: {
          title: 'Borsada Hisse Senedi İşlemleri',
          url: 'https://finansalokuryazarlik.gov.tr/i/borsada-hisse-senedi-islemleri',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'risk-return',
        title: 'RİSK VE GETİRİ DENGESİ',
        short: 'Yüksek getiri beklentisi, yüksek risk de taşıyabilir.',
        body: [
          'Borsada daha yüksek getiri beklentisi genelde daha yüksek oynaklık ve belirsizlik anlamına gelir.',
          'Bu yüzden sadece “çok kazandırır” cümlesiyle değil, risk tarafıyla birlikte düşünmek gerekir.',
        ],
        scenario: 'Bir hisse kısa sürede çok yükselmiş olabilir; ama aynı hızla düşme riski de taşıyabilir.',
        qa: [
          { q: 'Yüksek getiri beklentisi neyi artırabilir?', a: 'Riski ve fiyat dalgalanmasını artırabilir.' },
        ],
        video: {
          title: 'Risk ve Getiri Dengesi',
          url: 'https://finansalokuryazarlik.gov.tr/i/risk-ve-getiri-dengesi',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'diversification-borsa',
        title: 'ÇEŞİTLENDİRME',
        short: 'Tek hisseye bağlı kalma.',
        body: [
          'Tüm parayı tek şirkete veya tek araca koymak riskin tek noktada toplanmasına yol açar.',
          'Farklı şirketlere ve farklı yatırım araçlarına yayılmak, zararı sınırlamaya yardımcı olabilir.',
        ],
        scenario: 'Sadece bir hisse düşerse tüm portföy etkilenir; birkaç farklı araç varsa darbe daha sınırlı kalabilir.',
        qa: [
          { q: 'Çeşitlendirme ne sağlar?', a: 'Tek bir varlığa bağlı riski azaltmaya yardımcı olur.' },
        ],
        video: {
          title: 'Yatırımda Çeşitlendirme Nedir?',
          url: 'https://finansalokuryazarlik.gov.tr/i/yatirimda-cesitlendirme-nedir',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'ipo-basic',
        title: 'HALKA ARZ',
        short: 'Şirket paylarının yatırımcıya sunulması.',
        body: [
          'Halka arz, bir şirketin paylarını yatırımcıların alıp satabileceği şekilde piyasaya sunmasıdır.',
          'Halka arz ilgi çekebilir; ama her halka arz otomatik olarak kazanç anlamına gelmez.',
        ],
        scenario: 'Yeni halka arz olan bir şirket yoğun ilgi görebilir; yine de şirketi ve riskleri anlamadan karar vermek sağlıklı değildir.',
        qa: [
          { q: 'Halka arz ne demektir?', a: 'Şirket paylarının yatırımcılara açılması demektir.' },
        ],
        video: {
          title: 'Halka Arz',
          url: 'https://finansalokuryazarlik.gov.tr/i/halka-arz',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
    ],
    quiz: generateStockPatternsQuiz(),
  },
  {
    id: 'macro',
    title: 'MERKEZ BANKASI & EKONOMİ',
    subtitle: 'Merkez Bankasının rolü ve büyük resim.',
    icon: '🌍',
    items: [
      {
        id: 'cb-faiz',
        title: 'MERKEZ BANKASI NEDİR?',
        short: 'Bankaların bankası; ticari banka gibi çalışmaz.',
        body: [
          'Merkez Bankası, bireylerin gidip hesap açtığı veya kredi kullandığı bir banka değildir; para politikasını şekillendiren temel kurumdur.',
          'Banknot basmak, rezervleri yönetmek ve fiyat istikrarı için politika araçlarını kullanmak gibi görevleri vardır.',
        ],
        scenario: 'Merkez Bankası doğrudan sana kredi vermez; ama aldığı kararlar kredi maliyetini ve ekonomideki dengeleri etkileyebilir.',
        qa: [
          { q: 'Merkez Bankasından kredi alabilir miyim?', a: 'Hayır; Merkez Bankası ticari banka gibi çalışmaz.' },
        ],
        video: {
          title: 'Merkez Bankası',
          url: 'https://herkesicin.tcmb.gov.tr/wps/wcm/connect/ekonomi/hie/kategori?kategori=banka',
          source: 'herkesicin.tcmb.gov.tr',
        },
      },
      {
        id: 'growth-gdp',
        title: 'POLİTİKA FAİZİ VE EKONOMİ',
        short: 'Faiz kararı kredi, talep ve enflasyonu etkileyebilir.',
        body: [
          'Politika faizindeki değişimler kredi maliyetleri, harcama eğilimi ve tasarruf davranışı üzerinde etkili olabilir.',
          'Amaç çoğu zaman fiyat istikrarına katkı sağlamak ve ekonomideki aşırı ısınma veya zayıflama risklerini dengelemektir.',
        ],
        scenario: 'Faiz yükselince kredi daha pahalı hâle gelebilir; bu da bazı harcamaların ertelenmesine yol açabilir.',
        qa: [
          { q: 'Faiz kararı neden önemlidir?', a: 'Kredi maliyetini, talebi ve enflasyon görünümünü etkileyebilir.' },
        ],
        video: {
          title: 'Ekonomiyi Sağlıklı Yorumlama - Faiz Oranları',
          url: 'https://finansalokuryazarlik.gov.tr/i/ekonomiyi-saglikli-yorumlama-faiz-oranlari',
          source: 'finansalokuryazarlik.gov.tr',
        },
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
    quiz: generatePsychologyQuiz(),
  },
  {
    id: 'safety',
    title: 'BANKACILIK & DİJİTAL GÜVENLİK',
    subtitle: 'Kartlar, transferler ve güvenli dijital işlemler.',
    icon: '🛡️',
    items: [
      {
        id: 'banking-basic',
        title: 'BANKACILIK TEMELLERİ',
        short: 'Kartlar, transferler ve dijital bankacılık günlük hayatın parçası.',
        body: [
          'Bankalar tasarrufları değerlendirmek, ödeme yapmak ve para transferi gibi işlemleri kolaylaştırır.',
          'Banka kartı, kredi kartı, para transferi ve mobil bankacılık günlük finans yönetiminin temel parçalarıdır.',
        ],
        scenario: 'Fatura öderken, para transferi yaparken ve hesap hareketlerini izlerken bankacılık araçlarını kullanırsın.',
        qa: [
          { q: 'Bankacılık neyi kolaylaştırır?', a: 'Ödeme, transfer ve hesap yönetimini kolaylaştırır.' },
        ],
        video: {
          title: 'Bankacılık Sistemi',
          url: 'https://finansalokuryazarlik.gov.tr/i/bankacilik-sistemi',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'digital-banking-safety',
        title: 'DİJİTAL BANKACILIKTA GÜVENLİK',
        short: 'Sahte linke değil, resmî kanala git.',
        body: [
          'Dolandırıcılar banka veya kurum gibi davranıp sahte link gönderebilir.',
          'İşlem yaparken sadece bankanın resmî uygulamasını veya doğrulanmış adresini kullanmak gerekir.',
        ],
        scenario: '“Hesabınız askıya alındı” mesajı gelirse linke tıklamak yerine bankanın uygulamasını açıp durumu oradan kontrol et.',
        qa: [
          { q: 'Güvenli ilk adım ne?', a: 'Resmî uygulama veya adres üzerinden kontrol etmektir.' },
        ],
        tips: ['Resmî kurumlar mesajla şifre veya OTP kodu istemez.'],
        video: {
          title: 'Dijital Bankacılıkta Güvenlik',
          url: 'https://finansalokuryazarlik.gov.tr/i/dijital-bankacilikta-guvenlik',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'money-transfer-check',
        title: 'PARA TRANSFERİNDE SON KONTROL',
        short: 'FAST/EFT/havalede alıcıyı doğrula.',
        body: [
          'Para transferlerinde IBAN, alıcı adı ve tutar bilgisi dikkatle kontrol edilmelidir.',
          'Hızlı işlem baskısı hata riskini artırır; birkaç saniyelik kontrol kaybı önleyebilir.',
        ],
        scenario: 'Aceleyle gönderim yaparken yanlış IBAN seçersen para başka kişiye gidebilir.',
        qa: [
          { q: 'Transferde en kritik kontrol ne?', a: 'Alıcı bilgilerini doğrulamaktır.' },
        ],
        video: {
          title: 'Para Transferi',
          url: 'https://finansalokuryazarlik.gov.tr/i/para-transferi',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
    ],
    quiz: generateSafetyQuiz(),
  },
];
