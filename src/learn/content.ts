export type LearnCategoryId =
  | 'basics'
  | 'budget'
  | 'credit'
  | 'investing'
  | 'markets'
  | 'stock-patterns'
  | 'macro'
  | 'psychology'
  | 'safety'
  | 'tax'
  | 'crypto'
  | 'credit-score'
  | 'global-economy'
  | 'sustainability';

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
    { id: 'i6', q: 'Hangisi bir varlık sınıfı DEĞİLDİR?', choices: ['Hisse senedi', 'Tahvil', 'Kredi notu', 'Emtia'], correctIndex: 2, explain: 'Kredi notu varlık değil, borç ödeme puanıdır.' },
    { id: 'i7', q: 'Temettü nedir?', choices: ['Şirket borcu', 'Kârdan hissedarlara dağıtılan pay', 'Hisse artışı', 'Borsa endeksi'], correctIndex: 1, explain: 'Şirket kârından hissedarlara dağıtılan paydır.' },
    { id: 'i8', q: 'Temettü verimi %5 ne demek?', choices: ['Her yıl %5 zarar', '100 TL\'lik hisseden 5 TL temettü', 'Garanti verim', 'Fiyat değişmez'], correctIndex: 1, explain: 'Hisse başı temettü / hisse fiyatı x 100.' },
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
    { id: 'c4', q: 'Hangi kredi türünde faiz en düşüktür?', choices: ['İhtiyaç', 'Konut', 'Taşıt', 'Kredi kartı'], correctIndex: 1, explain: 'Konut kredisi ipotekli olduğu için faizi en düşüktür.' },
    { id: 'c5', q: 'KKDF ve BSMV nedir?', choices: ['Sigorta primi', 'Krediye eklenen vergi/fon', 'Komisyon', 'Havale ücreti'], correctIndex: 1, explain: 'Kredi maliyetine eklenen vergi ve fon kesintileridir.' },
    { id: 'c6', q: 'Müteselsil kefil ne demek?', choices: ['Referans olmak', 'Banka direkt senden isteyebilir', 'Sorumluluk yok', 'Noter onayı'], correctIndex: 1, explain: 'Banka önce asıl borçluya gitmeden senden tahsil edebilir.' },
    { id: 'c7', q: 'Kredi toplam maliyeti neyi içerir?', choices: ['Sadece faiz', 'Faiz+masraf+KKDF+BSMV+sigorta', 'Sadece masraf', 'Sadece KKDF'], correctIndex: 1, explain: 'Gerçek maliyet faiz+masraf+vergilerin toplamıdır.' },
    { id: 'c8', q: 'Kefil olduğun ödemezse ne olur?', choices: ['Hiçbir şey', 'Borç sana kalır', 'Sadece arkadaşlık biter', 'Devlet öder'], correctIndex: 1, explain: 'Kefil borcun yasal sorumlusudur, notun da düşer.' },
  ];
  return pool.map(shuffleChoices);
}

function generateMacroQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'm1', q: 'Merkez Bankası neden faiz artırabilir?', choices: ['Herkesi zengin etmek için', 'Enflasyonu yavaşlatmak için', 'Harcama artsın diye', 'Dolar bitsin diye'], correctIndex: 1, explain: 'Amaç genelde fiyat artışını yavaşlatmaktır.' },
    { id: 'm2', q: 'Resesyon ne demektir?', choices: ['Ekonomik bayram', 'Ekonomik daralma', 'Herkes işe girer', 'Borsa uçar'], correctIndex: 1, explain: 'Ekonomi küçülür, üretim düşer.' },
    { id: 'm3', q: 'TCMB enflasyon hedefi yaklaşık yüzde kaçtır?', choices: ['%0', '%5', '%10', '%50'], correctIndex: 1, explain: 'TCMB\'nin resmî hedefi %5\'tir.' },
    { id: 'm4', q: 'Faiz artışı enflasyonu nasıl yavaşlatır?', choices: ['Krediyi ucuzlatarak', 'Talebi düşürerek', 'Maaşları artırarak', 'Vergi azaltarak'], correctIndex: 1, explain: 'Yüksek faiz borçlanmayı azaltır, talep düşer.' },
    { id: 'm5', q: 'Okun yasası neyi açıklar?', choices: ['Büyüme-işsizlik ters ilişki', 'Enflasyon-işsizlik doğru ilişki', 'Faiz-döviz ilişkisi', 'Borsa her an yükselebilir'], correctIndex: 0, explain: 'Büyüme hızlanınca işsizlik düşme eğilimindedir.' },
    { id: 'm6', q: 'Potansiyel büyüme nedir?', choices: ['En hızlı büyüme anı', 'Enflasyonsuz sürdürülebilir büyüme', 'Ulaşılamaz büyüme', 'Teorik kavram'], correctIndex: 1, explain: 'Enflasyonist baskı yaratmayan sürdürülebilir büyüme oranıdır.' },
    { id: 'm7', q: 'TCMB hedefi kaçırınca ne yapmak zorunda?', choices: ['Hiçbir şey', 'Açıklama yapmak', 'Başkanı değiştirmek', 'Parayı toplatmak'], correctIndex: 1, explain: 'Şeffaflık gereği kamuya açıklama yapılır.' },
    { id: 'm8', q: 'GSYH açılımı nedir?', choices: ['Gayri Safi Yurtiçi Hasıla', 'Genel Sistem Yönetimi', 'Gelişmiş Sermaye', 'Güncel Satın Alma'], correctIndex: 0, explain: 'Ülkedeki toplam nihai mal ve hizmet değeridir.' },
  ];
  return pool.map(shuffleChoices);
}

function generatePsychologyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'ps1', q: 'FOMO yaşayan biri en çok hangi riski alır?', choices: ['Planlı hareket etme', 'Aceleyle yüksekten alma', 'Daha düşük komisyon ödeme', 'Nakit biriktirme'], correctIndex: 1, explain: 'FOMO, plansız ve pahalı girişe yol açabilir.' },
    { id: 'ps2', q: 'Kayıptan kaçınma hangi davranışta görülür?', choices: ['Zarar kesip plana dönmek', 'Zarardaki pozisyonu “belki döner” diye sonsuza dek tutmak', 'Portföyü çeşitlendirmek', 'Acil fon ayırmak'], correctIndex: 1, explain: 'Zararı kabullenmeyi ertelemek, kayıptan kaçınmadır.' },
    { id: 'ps3', q: 'Yatırımda yoğun heyecan hissediyorsan en sağlıklı kısa aksiyon ne olabilir?', choices: ['Hemen tüm parayla girmek', '24 saat bekleyip planı tekrar okumak', 'Daha fazla borçlanmak', 'Sosyal medyayı referans almak'], correctIndex: 1, explain: 'Kısa bekleme, duygusal kararı filtreler.' },
    { id: 'ps4', q: 'Başkasının kazancını görünce stratejiyi bozmak hangi probleme yakındır?', choices: ['Disiplin', 'Sürü psikolojisi', 'Likidite', 'Bileşik getiri'], correctIndex: 1, explain: 'Başkalarını kör taklit etmek sürü psikolojisidir.' },
    { id: 'ps5', q: 'Ankraj (çıpalama) nedir?', choices: ['İlk bilgiye aşırı bağlanma', 'Son bilgiye güvenme', 'Hep haklı olma', 'Kaybetme korkusu'], correctIndex: 0, explain: 'İlk karşılaşılan fiyat/sayıya takılıp kalma eğilimi.' },
    { id: 'ps6', q: 'Aşırı güven yatırımcıya ne yaptırır?', choices: ['Az işlem', 'Tek yatırıma odaklanma', 'Çok araştırma', 'Çeşitlendirme'], correctIndex: 1, explain: '\'Ben biliyorum\' hissiyle çeşitlendirme azalır, risk yoğunlaşır.' },
    { id: 'ps7', q: 'En sağlıklı yatırım tutumu nedir?', choices: ['Sürekli al-sat', 'Planlı disiplin', 'Herkesi taklit', 'Geçmiş performans'], correctIndex: 1, explain: 'Planlı yaklaşım duygusal kararları filtreler.' },
  ];
  return pool.map(shuffleChoices);
}

function generateTaxQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 't1', q: 'KDV\'nin açılımı nedir?', choices: ['Katma Değer Vergisi', 'Kamu Dağıtım Varlığı', 'Kredi Değerleme Verisi', 'Kurumsal Denetim Varlığı'], correctIndex: 0, explain: 'KDV, mal ve hizmetlerin her aşamasında eklenen değere uygulanan dolaylı vergidir.' },
    { id: 't2', q: 'Gelir vergisinde “dilim” ne demektir?', choices: ['Vergi borcunu taksitlendirmek', 'Artan gelirle yükselen vergi oranı', 'Ödeme tarihini ertelemek', 'Muafiyet süresi'], correctIndex: 1, explain: 'Türkiye\'de artan oranlı vergi dilimleri vardır; kazandıkça daha yüksek oran uygulanır.' },
    { id: 't3', q: 'BES\'te devlet katkısı ne kadardır?', choices: ['%10', '%20', '%30', '%50'], correctIndex: 2, explain: 'Devlet katkısı oranı %30\'dur (belirli limitlere kadar).' },
    { id: 't4', q: 'Stopaj vergisi kim tarafından kesilir?', choices: ['Alıcı tarafından', 'Ödemeyi yapan tarafından kaynakta', 'Banka tarafından', 'Noter tarafından'], correctIndex: 1, explain: 'Stopaj, ödeme yapılırken kaynakta kesilen vergidir.' },
    { id: 't5', q: 'Kira geliri için hangisi doğrudur?', choices: ['Hiç vergi ödenmez', 'Belirli bir istisna tutarına kadar vergi alınmaz', 'Her kuruşu vergilendirilir', 'Sadece ticari kiralar vergiye tabidir'], correctIndex: 1, explain: 'Konut kira gelirinde yıllık istisna tutarı bulunur (2025: 33.000 TL).' },
    { id: 't6', q: 'Mağazadan aldığın ürünün fişinde KDV oranı nerede yazar?', choices: ['Sadece barkodda', 'Fişin alt kısmında ayrı satırda', 'Hiç yazmaz', 'Sadece online alışverişte'], correctIndex: 1, explain: 'KDV tutarı fişte ayrıca gösterilir. Temel gıdada %1, çoğu üründe %10, lükste %20.' },
  ];
  return pool.map(shuffleChoices);
}

function generateCryptoQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'cr1', q: 'Kripto paranın temel özelliği nedir?', choices: ['Merkez bankası tarafından basılır', 'Merkeziyetsiz ve blokzincir üzerinde çalışır', 'Her ülkenin resmî para birimidir', 'Fiziksel olarak cüzdanda taşınır'], correctIndex: 1, explain: 'Kripto paralar merkezi bir otoriteye bağlı olmadan çalışır.' },
    { id: 'cr2', q: 'Kripto yatırımında en büyük risk nedir?', choices: ['Düşük getiri', 'Aşırı volatilite ve düzenleme belirsizliği', 'Banka garantisi olmaması', 'Kullanımının yasak olması'], correctIndex: 1, explain: 'Kripto fiyatları çok hızlı değişebilir ve düzenlemeler ülkeden ülkeye farklılık gösterir.' },
    { id: 'cr3', q: 'Soğuk cüzdan (cold wallet) ne işe yarar?', choices: ['İnternet bağlantısı olmadan kriptoları güvenle saklamak', 'Kripto madenciliği yapmak', 'Anlık al-sat yapmak', 'Kredi çekmek'], correctIndex: 0, explain: 'Soğuk cüzdan çevrimdışı olduğu için hacker saldırılarına karşı daha güvenlidir.' },
    { id: 'cr4', q: 'Kripto borsalarında hangi güvenlik önlemi en önemlisidir?', choices: ['Reklamlara güvenmek', '2FA (iki faktörlü doğrulama) ve güçlü şifre', 'Telefon numarasını gizlemek', 'Sık sık şifre değiştirmek'], correctIndex: 1, explain: '2FA ek bir güvenlik katmanı sağlar.' },
    { id: 'cr5', q: 'BTC\'nin toplam arzı neden sınırlıdır (21 milyon)?', choices: ['Hükümet kararıyla', 'Protokol koduyla sabitlenmiştir, enflasyonu önler', 'Madenler tükendiği için', 'Bankalar anlaştığı için'], correctIndex: 1, explain: 'Sınırlı arz, kıtlık yaratarak değer koruma aracı olmasını sağlar.' },
  ];
  return pool.map(shuffleChoices);
}

function generateCreditScoreQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'cs1', q: 'Kredi notu hangi amaçla kullanılır?', choices: ['Hangi okula gideceğini belirler', 'Bankaların kredi/kart başvurunda riskini değerlendirmesi için', 'Telefon faturanı düşürmek için', 'Pasaport almak için'], correctIndex: 1, explain: 'Kredi notu, geri ödeme güvenilirliğinin sayısal göstergesidir.' },
    { id: 'cs2', q: 'Findeks notu kaç aralığındadır?', choices: ['0-100', '0-500', '0-1900', '0-10000'], correctIndex: 2, explain: 'Findeks kredi notu 0-1900 aralığındadır; yüksek not daha iyidir.' },
    { id: 'cs3', q: 'Hangisi kredi notunu en çok düşürür?', choices: ['Yeni hesap açmak', 'Faturaları geciktirmek ve borcu ödememek', 'Bordro hesabı kullanmak', 'Birikim yapmak'], correctIndex: 1, explain: 'Ödeme düzensizliği kredi notunu en olumsuz etkileyen faktördür.' },
    { id: 'cs4', q: 'Kredi notunu yükseltmek için en etkili yöntem hangisidir?', choices: ['Hiç kredi kullanmamak', 'Faturaları düzenli ödeyip kredi kartı borcunu zamanında kapatmak', 'Sürekli yeni kredi başvurusu yapmak', 'Tüm kartları iptal etmek'], correctIndex: 1, explain: 'Düzenli ödeme alışkanlığı notu istikrarlı şekilde yükseltir.' },
    { id: 'cs5', q: 'Kredi notu sorgulama hangi sıklıkta ücretsiz yapılabilir?', choices: ['Ayda 1 kez', 'Yılda 2 kez (Findeks)', 'Haftada 1 kez', 'Sınırsız'], correctIndex: 1, explain: 'Findeks yılda 2 kez ücretsiz rapor hakkı verir.' },
  ];
  return pool.map(shuffleChoices);
}

function generateGlobalEconomyQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'g1', q: 'Döviz kuru neden dalgalanır?', choices: ['Hava durumuna göre', 'Arz-talep, faiz farkı ve ekonomik beklentilere göre', 'Sadece seçim zamanı', 'Hiç değişmez'], correctIndex: 1, explain: 'Kur, piyasa dinamikleri ve beklentilerle sürekli değişir.' },
    { id: 'g2', q: 'İthalat artarsa ne olur?', choices: ['Döviz ihtiyacı artar, TL değer kaybedebilir', 'Her şey ucuzlar', 'İşsizlik biter', 'Borsa düşer'], correctIndex: 0, explain: 'Çok ithalat döviz talebini artırır, bu da yerel parayı zayıflatabilir.' },
    { id: 'g3', q: 'Cari denge neyi gösterir?', choices: ['Bütçe açığını', 'Ülkeye giren ve çıkan döviz miktarını (ithalat-ihracat farkı)', 'Enflasyon oranını', 'Faiz oranını'], correctIndex: 1, explain: 'Cari denge, bir ülkenin dış ticaret dengesini gösterir.' },
    { id: 'g4', q: 'Küresel ekonomik kriz Türkiye\'yi nasıl etkiler?', choices: ['Hiç etkilemez', 'Sermaye çıkışı, kur artışı ve talep daralması yaşanabilir', 'Herkes zengin olur', 'Sadece borsayı etkiler'], correctIndex: 1, explain: 'Küresel krizler gelişmekte olan ülkeleri daha sert etkiler.' },
    { id: 'g5', q: 'TCMB faiz artırınca döviz kuruna kısa vadede etkisi ne olur?', choices: ['Kur yükselir', 'Kur düşebilir (TL cazip hale gelir)', 'Hiç etkisi olmaz', 'Her şey ücretsiz olur'], correctIndex: 1, explain: 'Yüksek faiz TL varlıkları cazip kılarak kur baskısını azaltabilir.' },
  ];
  return pool.map(shuffleChoices);
}

function generateSustainabilityQuiz(): LearnQuestion[] {
  const pool: LearnQuestion[] = [
    { id: 'su1', q: `ESG kriterleri hangi alanlari kapsar?`, choices: ['Sadece cevre', 'Cevre, sosyal ve yonetisim', 'Sadece karlilik', 'Sadece vergi'], correctIndex: 1, explain: `ESG: Environmental (Cevre), Social (Sosyal), Governance (Yonetisim).` },
    { id: 'su2', q: `Yesil tahvil hangi amacla kullanilir?`, choices: ['CEO maaslari', 'Cevre projeleri (gunes, ruzgar)', 'Hisse geri alimi', 'Reklam'], correctIndex: 1, explain: `Yesil tahviller cevre odakli projeleri finanse eder.` },
    { id: 'su3', q: `Greenwashing ne demektir?`, choices: ['Camasi yikamak', 'Urunu oldugundan yesil gostermek', 'Bitki sulamak', 'Geri donusum'], correctIndex: 1, explain: `Greenwashing, cevreye duyarli gozukme pazarlamasidir.` },
    { id: 'su4', q: `Karbon ayak izini azaltmak icin en etkili yontem?`, choices: ['Daha cok geri donusum', 'Ucak yolculugunu azaltmak', 'Sadece cop toplamak', 'Her seyi cope atmak'], correctIndex: 1, explain: `Ulasim ve gida en buyuk karbon kaynaklaridir.` },
    { id: 'su5', q: `Dongusel ekonominin temel ilkesi nedir?`, choices: ['Surekli yeni urun almak', 'Kaynaklari dongude tutmak', 'Her seyi cope atmak', 'Sadece geri donusum'], correctIndex: 1, explain: `Dongusel ekonomide atik yoktur, her sey yeniden kullanilir.` },
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
      {
        id: 'finansal-hedef',
        title: `FINANSAL HEDEF BELIRLEME`,
        short: `Hedefi olmayan, ruzgarda savrulur.`,
        body: [
          `SMART: Spesifik, Olculebilir, Ulasilabilir, Gercekci, Sureli.`,
          `Kisa vade (0-1 yil): acil fon, kucuk borclari kapat.`,
          `Orta vade (1-5 yil): araba, ev pesinati.`,
          `Uzun vade (5+ yil): emeklilik, cocuk egitimi.`,
        ],
        scenario: `"5 yilda 100K birikim" SMART degil. "Her ay 1500TL kenara koyarak 5 yilda 90bin TL birikim" SMART.`,
        qa: [
          { q: `SMART anlami?`, a: `Spesifik, Measurable, Achievable, Relevant, Time-bound.` },
          { q: `Kisa vade ornek?`, a: `3 ayda 6000 TL acil fon.` },
        ],
        tips: [`Hedeflerini yaz, gerceklesme ihtimali %42 artar.`, `Kucuk basarilari kutla.`],
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
      {
        id: 'kredi-turleri',
        title: `KREDI TURLERI`,
        short: `Ihtiyac, konut, tasit hangisi ne ise yarar?`,
        body: [
          `Ihtiyac kredisi: en yaygin, amac serbest, faizi en yuksek.`,
          `Konut kredisi: ev almak icin, vade en uzun (10-20 yil), faiz en dusuk.`,
          `Tasit kredisi: araba icin, vade 5 yila kadar, arac rehinli.`,
          `Toplam maliyet: faiz + dosya + KKDF + BSMV + sigorta.`,
        ],
        scenario: `30.000 TL ihtiyac kredisi %4 faizle 12 ayda ~36.000 TL odeme. Kartta tasirsan daha pahali.`,
        qa: [
          { q: `En ucuz kredi?`, a: `Konut kredisi (ipotekli, dusuk faiz).` },
          { q: `KKDF ve BSMV?`, a: `Kredi faizine eklenen vergi/fon.` },
        ],
        tips: [`Kredi oncesi toplam maliyeti hesapla.`],
        warning: `Ihtiyac kredisini yatirim icin kullanma, riskli.`,
      },
      {
        id: 'kefillik',
        title: `KEFILLIK & MUESELSIL BORC`,
        short: `Kefil olmak borca ortak olmak.`,
        body: [
          `Kefil: borc odenmezse ustlenen kisi.`,
          `Muteselsil kefalet: banka direkt senden tahsil edebilir.`,
          `Kefil oldugun borc senin kredi notunu da etkiler.`,
          `Kefillik finansal intihar olabilir.`,
        ],
        scenario: `Arkadas 50.000 TL kredi cekti, sen kefil. Isinden cikti, odeyemedi. Banka senden istedi, maastan kesinti basladi.`,
        qa: [
          { q: `Muteselsil kefil?`, a: `Banka direkt senden isteyebilir.` },
          { q: `Kefillik notu etkiler mi?`, a: `Evet, odenmeyen borc notunu dusurur.` },
        ],
        tips: [`Kefil olacagin kisinin durumunu bil.`, `Ust limit koy, tamamina kefil olma.`],
        warning: `Kefil oldugun borc senindir, maasina icra gelebilir.`,
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
      {
        id: 'varlik-siniflari',
        title: `VARLIK SINIFLARI`,
        short: `Hisse, tahvil, emtia, nakit hangisi sana gore?`,
        body: [
          `Varlik siniflari: hisse, tahvil, emtia, doviz, nakit, kripto.`,
          `Hisse: yuksek risk/getiri. Tahvil: dusuk risk/getiri.`,
          `Altin: enflasyon korumasi, guvenli liman.`,
          `Portfoy dagilimi risk ve getirini belirler.`,
        ],
        scenario: `100bin TL nin %50 si hisse, %30 u altin, %20 si nakit. Hisse dusunce altin yukseldi. Cesitlendirme!`,
        qa: [
          { q: `En riskli varlik sinifi?`, a: `Hisse senetleri ve kripto.` },
          { q: `Tahvil neden guvenli?`, a: `Sabit getiri, iflasta oncelikli.` },
        ],
        tips: [`Portfoyu yasina gore ayarla: gencken riskli, yaslaninca guvenli.`],
      },
      {
        id: 'temettu',
        title: `TEMETTU YATIRIMI`,
        short: `Sirket karindan sana pay.`,
        body: [
          `Temettu: sirket karindan hissedarlara dagitilan pay. Nakit/hisse olarak odenir.`,
          `Temettu verimi: hisse basi temettu / hisse fiyati x 100.`,
          `Duzenli nakit akisi isteyenler icin ideal.`,
          `Temettu garantisi yok, sirket zarar ederse odenmez.`,
        ],
        scenario: `100 hissen var, her biri 100 TL. Hisse basi 5 TL temettu = 500 TL. Yilda 2 kez pasif gelir.`,
        qa: [
          { q: `Temettu garanti mi?`, a: `Hayir, sirket yonetimi kararina bagli.` },
          { q: `Temettu verimi hesabi?`, a: `Hisse basi temettu / fiyat x 100.` },
        ],
        tips: [`Yuksek temettu tek basina yetmez, sirket karliligina da bak.`],
        video: {
          title: 'Temettu Nedir?',
          url: 'https://finansalokuryazarlik.gov.tr/i/temettu-nedir',
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
      {
        id: 'inflation-targeting',
        title: `ENFLASYON HEDEFLEMESI`,
        short: `TCMB nin fiyat istikrari hedefi.`,
        body: [
          `Enflasyon hedeflemesi: TCMB belirli bir enflasyon oranini hedefler (%5).`,
          `Sapma olursa faiz ayarlamasi yaparak fiyat istikrari saglanir.`,
          `Enflasyon hedefin ustundeyse faiz artar, talep duser, fiyatlar yavaslar.`,
          `%2 den fazla sapmada TCMB kamuya aciklama yapmak zorundadir.`,
        ],
        scenario: `Enflasyon %15, hedef %5. TCMB faizi artirir. Kredi pahalanir, harcamalar yavaslar.`,
        qa: [
          { q: `Enflasyon hedefi neden %5?`, a: `TCMB ve hukumet arasinda belirlenen resmi hedef.` },
          { q: `Hedef kacirilirsa ne olur?`, a: `TCMB aciklama ve duzeltme yapmak zorunda.` },
        ],
        tips: [`TCMB faiz kararlarini takip et, enflasyon beklentini yonet.`],
      },
      {
        id: 'unemployment-growth',
        title: `ISSIZLIK & BUYUME`,
        short: `Ekonomi buyuyunce herkes is bulur mu?`,
        body: [
          `Ekonomik buyume: ulkenin urettigi mal ve hizmetin (GSYH) artmasi.`,
          `Okun yasasi: buyume yavaslarsa issizlik artar, hizlanirsa azalir.`,
          `Buyume her zaman herkese is demek degil, sektorel farklar onemli.`,
          `Potansiyel buyume: enflasyonsuz surdurulebilir en yuksek buyume.`,
        ],
        scenario: `Turkiye %5 buyurken issizlik %10 dan %9 a dustu. Ertesi yil %1 e geriledi, issizlik %12 ye cikti.`,
        qa: [
          { q: `Neden herkes is bulamiyor?`, a: `Buyumenin niteligi onemli, her sektor istihdam yaratmaz.` },
          { q: `Okun yasasi nedir?`, a: `Buyume-issizlik arasinda ters iliski.` },
        ],
        tips: [`Buyume rakami kadar dagilimi da onemli.`],
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
      {
        id: 'ankraj',
        title: `ANKRAJ (CIPALAMA)`,
        short: `Ilk gordugun fiyat aklinda kalir.`,
        body: [
          `Cipalama: ilk duyulan sayiya takilip kalma egilimi.`,
          `Hisse 200TL den 150 ye dusunce ucuz sanirsin, ama 100 olmali.`,
          `Indirimler: "1000 den 700 e dustu" diye alirsin ama aslinda 500.`,
        ],
        scenario: `Urun once 1000 TL sonra 750. Hemen alirsin. Ama baska yerde 500 TL. Cipaya takildin.`,
        qa: [
          { q: `Ankraj neden tehlikeli?`, a: `Ilk fiyati referans alirsin, gercek degeri gormezsin.` },
          { q: `Nasil onlenir?`, a: `Karsilastir, arastir.` },
        ],
        tips: [`En az 3 kaynaktan fiyat al, ilk duyduguna guvenme.`],
      },
      {
        id: 'overconfidence',
        title: `ASIRI GUVEN`,
        short: `"Ben hata yapmam" diyenin hatasi buyuk olur.`,
        body: [
          `Asiri guven: kendi yeteneklerini oldugundan fazla gorme.`,
          `Yatirimda: "Ben cozdum" diye tum parayi tek hisseye koymak.`,
          `Arastirmalar: erkekler kadinlardan %20 fazla islem yapar ama az kazanir.`,
        ],
        scenario: `Ali 2 dogru tahmin yapinca "Borsayi cozdum" deyip tum parayi tek hisseye yatirdi. %40 kaybetti.`,
        qa: [
          { q: `Asiri guven neden kotu?`, a: `Cesitlendirmeyi azaltir, riski artirir.` },
          { q: `En cok kim yapar?`, a: `Arastirmalara gore erkek yatirimcilar.` },
        ],
        tips: [`Her kazancin ardindan "Sans mi yetenek mi?" sorgula.`, `Portfoyune disaridan bir fikir al.`],
      },
    ],
    quiz: generatePsychologyQuiz(),
  },
  {
    id: 'tax',
    title: 'VERGİ OKUR YAZARLIĞI',
    subtitle: 'KDV, stopaj, gelir vergisi ve BES — Türkiye\'de gençlerin bilmesi gerekenler.',
    icon: '🏛️',
    items: [
      {
        id: 'kdv',
        title: 'KDV (KATMA DEĞER VERGİSİ)',
        short: 'Aldığın her şeyin içinde var.',
        body: [
          'KDV, mal ve hizmetlerin her aşamasında eklenen değere uygulanan dolaylı vergidir.',
          'Türkiye\'de üç ana KDV oranı var: %1 (temel gıda), %10 (çoğu ürün), %20 (lüks tüketim).',
          'Fişlerde ayrı satırda gösterilir — her alışverişinde vergi ödersin.',
        ],
        scenario: '1.000 TL\'lik bir telefon aldın. KDV %20 ise telefonun KDV\'siz fiyatı 833 TL, KDV tutarı 167 TL\'dir.',
        qa: [{ q: 'KDV\'yi kim öder?', a: 'Son tüketici öder, işletme devlete yatırır.' }],
        tips: ['KDV oranlarına dikkat et: temel gıdada %1, elektronikte %20.', 'Fiş almak vergini ödemenin kanıtıdır, aynı zamanda bütçe takibinde işe yarar.'],
      },
      {
        id: 'income-tax',
        title: 'GELİR VERGİSİ & STOPAJ',
        short: 'Kazandıkça devlete pay.',
        body: [
          'Gelir vergisi, bireylerin kazançları üzerinden alınan vergidir.',
          'Türkiye\'de artan oranlı dilim sistemi var: %15\'ten başlar, %40\'a kadar çıkar.',
          'Stopaj: Maaşından işveren tarafından kesilip devlete yatırılır — sen hiçbir şey yapmazsın.',
        ],
        scenario: 'Aylık 25.000 TL brüt maaş alıyorsan, stopaj + SGK kesintisi sonrası eline ~20.000 TL net geçer.',
        qa: [{ q: 'Stopaj kim tarafından kesilir?', a: 'İşveren maaşından keser, devlete yatırır.' }],
        tips: ['Brüt ve net maaş arasındaki farkın büyük kısmı vergi ve SGK kesintisidir.', 'Kira geliri, freelance kazanç da beyanname gerektirebilir.'],
        video: { title: 'Gelir Vergisi Dilimleri 2025', url: 'https://www.gib.gov.tr/', source: 'gib.gov.tr' },
      },
      {
        id: 'bes-tax',
        title: 'BES & VERGİ AVANTAJI',
        short: 'Devlet katkısı %30, üstelik vergi avantajlı.',
        body: [
          'Bireysel Emeklilik Sistemi\'nde (BES) devlet katkısı %30\'dur (belirli limitlere kadar).',
          'Ödediğin BES katkı payı gelir vergisi matrahından düşülebilir.',
          'Devlet katkısı + vergi avantajı + bileşik getiri = uzun vadede ciddi fark.',
        ],
        scenario: 'Ayda 1.000 TL BES\'e yatırırsan: 1.000 TL sen + 300 TL devlet = 1.300 TL/ay birikir. Yıllık %15 getiriyle 10 yılda ~350.000 TL.',
        qa: [{ q: 'BES\'ten erken çıkarsam ne olur?', a: 'Devlet katkısının bir kısmı geri alınır, %15 stopaj uygulanır.' }],
        tips: ['Mümkün olduğunca erken başla — bileşik getiri zamanla katlanır.', 'En az 10 yıl kalmayı hedefle, yoksa devlet katkısı geri alınabilir.'],
      },
    ],
    quiz: generateTaxQuiz(),
  },
  {
    id: 'crypto',
    title: 'KRİPTO BİLİNÇLENDİRME',
    subtitle: 'Fırsat mı risk mi? Kriptoyu anla, bilinçli karar ver.',
    icon: '₿',
    items: [
      {
        id: 'crypto-basics',
        title: 'KRİPTO NEDİR?',
        short: 'Merkeziyetsiz dijital para.',
        body: [
          'Kripto para, merkezi bir otoriteye bağlı olmayan, blokzincir teknolojisiyle çalışan dijital varlıktır.',
          'Bitcoin (BTC) ilk ve en bilinen örnektir. Ethereum (ETH) akıllı sözleşmeleriyle farklılaşır.',
          'Kriptoların toplam arzı genelde sınırlıdır (BTC: 21 milyon). Potansiyel enflasyon koruması sağlar.',
        ],
        scenario: '1 BTC 2020\'de 80.000 TL iken 2025\'te 3.000.000 TL\'ye çıktı — ama arada %70 düştüğü günler de oldu.',
        qa: [{ q: 'Kripto yatırım aracı mı, para birimi mi?', a: 'Her ikisi de — ama Türkiye\'de daha çok yatırım aracı olarak görülür.' }],
        tips: ['Sadece kaybetmeyi göze alabildiğin kadar kripto al.', 'Anlamadığın bir projeye asla yatırım yapma.'],
      },
      {
        id: 'crypto-risk',
        title: 'VOLATİLİTE & RİSK',
        short: 'Fiyatı bir günde %20 düşebilir.',
        body: [
          'Kripto piyasası geleneksel piyasalardan 5-10 kat daha oynaktır (volatil).',
          'Haber, regülasyon veya büyük yatırımcı hareketleriyle fiyat saatler içinde %20-30 değişebilir.',
          'Kaldıraçlı işlemler hem kazancı hem kaybı katlar — amatörlerden uzak durması önerilir.',
        ],
        scenario: '1.000 dolar BTC aldın. Ertesi gün bir ülke kriptoyu yasakladı haberine portföyün 700 dolar oldu. Panik satışı yaparsan zarar kalıcı olur.',
        qa: [{ q: 'Volatilite kötü mü?', a: 'Yüksek getiri potansiyeli = yüksek kayıp riski. İkisi beraber gelir.' }],
        tips: ['DCA (düzenli alım) volatiliteyi dener.', 'Kaldıraçlı işlemlerden uzak dur — amatör için kumar gibidir.'],
      },
      {
        id: 'crypto-security',
        title: 'GÜVENLİK & CÜZDANLAR',
        short: 'Anahtarlar sana ait değilse, kripto sana ait değil.',
        body: [
          'Kripto güvenliğinde en kritik kural: "Not your keys, not your coins."',
          'Soğuk cüzdan (çevrimdışı) — uzun süreli saklama için en güvenli yöntemdir.',
          '2FA, güçlü şifre ve phishing koruması hayati önem taşır.',
        ],
        scenario: 'Bir borsada 10.000 dolarlık ETH tutuyordun. Borsa hacklendi ve tüm fonlar çalındı — soğuk cüzdanda olsaydı güvendeydi.',
        qa: [{ q: 'Borsa mı cüzdan mı daha güvenli?', a: 'Cüzdan (özellikle soğuk cüzdan) çok daha güvenli ama kullanımı daha zahmetli.' }],
        tips: ['Büyük miktarlar için soğuk cüzdan kullan.', 'Kimseyle özel anahtarını paylaşma — "destek" bahanesiyle gelen mesajlara inanma.'],
      },
    ],
    quiz: generateCryptoQuiz(),
  },
  {
    id: 'credit-score',
    title: 'KREDİ NOTU',
    subtitle: 'Finansal dünyadaki karnen.',
    icon: '📊',
    items: [
      {
        id: 'score-basics',
        title: 'KREDİ NOTU NEDİR?',
        short: 'Bankaların sana güven puanı.',
        body: [
          'Kredi notu, bir bireyin borç ödeme geçmişine göre hesaplanan sayısal puandır.',
          'Türkiye\'de en yaygını Findeks\'tir. Not aralığı 0-1900\'dür.',
          'Yüksek not = düşük faiz, kolay kredi. Düşük not = kredi alamama veya yüksek faiz.',
        ],
        scenario: 'Findeks notu 1500+ olan Ali, ihtiyaç kredisini %3 faizle alırken notu 800 olan Ayşe aynı krediye %6 faiz ödedi.',
        qa: [{ q: 'Kredi notu nereden sorgulanır?', a: 'Findeks (KKB) üzerinden, yılda 2 kez ücretsiz.' }],
        tips: ['Yılda 2 kez ücretsiz Findeks raporun al — kendini takip et.', 'Notun sadece kredi değil, cep telefonu sözleşmesinde bile etkili olabilir.'],
      },
      {
        id: 'score-improve',
        title: 'NOT NASIL YÜKSELİR?',
        short: 'Düzenli ödeme, düşük risk.',
        body: [
          'Kredi notunu yükselten en önemli faktör: tüm faturaları ve borçları zamanında ödemek.',
          'Kredi kartı limitinin %30\'undan fazlasını kullanmamak notu olumlu etkiler.',
          'Sık sık kredi başvurusu yapmak notu düşürür — her başvuru bir sorgu demektir.',
        ],
        scenario: 'Ali her ay kredi kartı borcunu full ödüyor, limitinin %20\'sini kullanıyor. Findeks notu 1600. Ayşe limiti sonuna kadar kullanıyor, bazen asgari ödüyor. Notu 900.',
        qa: [{ q: 'Kredi notu ne kadar sürede yükselir?', a: '3-6 ay düzenli ödemeyle belirgin artış görülür.' }],
        tips: ['Limitini gereksiz yere yükseltme — yüksek limit görünür risk demek.', 'Asgari ödeme hayat kurtarır ama notuna zarar verir, full ödemeye çalış.'],
      },
      {
        id: 'score-findeks',
        title: 'FİNDEKS & KAYITLAR',
        short: 'Tüm finansal geçmişin bir yerde.',
        body: [
          'Kredi Kayıt Bürosu (KKB), tüm bankalardan gelen verileri toplar ve Findeks notunu hesaplar.',
          'Kara liste: 90 gün gecikmiş borçlar, protestolu çekler, icra kayıtları.',
          'Kara listedekiler yeni kredi/kart alamaz — temizlenmek için borcu ödeyip 1 yıl beklemen gerekir.',
        ],
        scenario: 'Ali\'nin 3 yıl önce ödemediği bir kredi kartı borcu icraya verilmiş. Borcu kapattıktan sonra Findeks\'teki olumsuz kayıt 5 yıl daha görünmeye devam eder.',
        qa: [{ q: 'Kara listeden nasıl çıkılır?', a: 'Borcu kapat, 1 yıl düzenli ödeme yap, kayıt zamanla silinir.' }],
        tips: ['E-devlet üzerinden KKB raporunu da sorgulayabilirsin.', 'Kefil olmak da notunu etkiler — kefil olduğun kişi ödemezse senin notun düşer.'],
        warning: 'Başkasına kefil olmak finansal intihar olabilir. Çok güvendiğin biri bile olsa riski hesapla.',
      },
    ],
    quiz: generateCreditScoreQuiz(),
  },
  {
    id: 'global-economy',
    title: 'KÜRESEL EKONOMİ',
    subtitle: 'Dünyada olan biten cebini nasıl etkiliyor?',
    icon: '🌐',
    items: [
      {
        id: 'forex',
        title: 'DÖVİZ KURU',
        short: 'Başka paranın TL karşısındaki fiyatı.',
        body: [
          'Döviz kuru, bir ülke parasının başka bir ülke parası cinsinden değeridir.',
          'Kur, arz-talep, faiz farkları, enflasyon ve jeopolitik risklerle dalgalanır.',
          'TL değer kaybedince ithalat pahalanır, yurtdışı tatili hayal olur.',
        ],
        scenario: '1 USD = 35 TL iken yurtdışından 100 dolarlık bir ürün almak 3.500 TL. Dolar 40 TL olursa aynı ürün 4.000 TL.',
        qa: [{ q: 'Kim döviz artışından zarar görür?', a: 'İthalatçılar, yurtdışı borcu olanlar, akaryakıt tüketicileri.' }],
        tips: ['Döviz ihtiyacın varsa ani alışveriş yapma, dalgalanmayı takip et.', 'Anlık kur yerine ortalama kura bakmak daha sağlıklıdır.'],
      },
      {
        id: 'trade-balance',
        title: 'İTHALAT & İHRACAT DENGESİ',
        short: 'Ülke ne kadar üretiyor, ne kadar tüketiyor?',
        body: [
          'İhracat: ülkenin sattığı mal ve hizmetler. İthalat: ülkenin satın aldıkları.',
          'İthalat > İhracat = cari açık. Ülke dışarıdan daha fazla döviz bulmak zorunda kalır.',
          'Cari açık finansmanı için sıcak para (yabancı yatırım) gerekir, o da faiz ve güven ister.',
        ],
        scenario: 'Türkiye enerjinin %70\'ini ithal ediyor. Dolar yükselince enerji faturası artar, bu da üretim maliyetlerine → market fiyatlarına yansır.',
        qa: [{ q: 'Cari açık neden kötüdür?', a: 'Sürdürülemez hale gelirse kriz riski doğar.' }],
        tips: ['Yerli üretimi desteklemek cari açığı azaltır — "yerli malı" sadece slogan değil.'],
      },
      {
        id: 'global-crises',
        title: 'KÜRESEL KRİZLER & TÜRKİYE',
        short: 'Amerika\'da kelebek kanat çırpar, Türkiye\'de fırtına kopar.',
        body: [
          'Küresel krizler (2008 Mortgage Krizi, 2020 Covid, 2023 küresel enflasyonu) Türkiye\'yi daha sert etkiler.',
          'Gelişmekte olan ülkeler kriz anında "sermaye kaçışı" yaşar: yabancı yatırımcı parasını çeker.',
          'Türkiye\'nin kırılganlığı: cari açık, döviz bağımlılığı, yüksek enflasyon.',
        ],
        scenario: 'ABD faiz artırınca yabancı yatırımcı TL varlıklarını satıp dolara geçer. TL değer kaybeder, enflasyon artar, hayat pahalanır.',
        qa: [{ q: 'Türkiye krizlere karşı ne yapabilir?', a: 'Rezerv biriktirmek, yerli üretimi artırmak, mali disiplin.' }],
        tips: ['Küresel haberlere kayıtsız kalma — ABD\'de olan biten senin cebini de etkiler.', 'Kriz dönemlerinde panik satışı yapma, fırsat da doğabilir.'],
      },
    ],
    quiz: generateGlobalEconomyQuiz(),
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
  {
    id: 'sustainability',
    title: 'SÜRDÜRÜLEBİLİRLİK & YEŞİL EKONOMİ',
    subtitle: 'Çevre dostu yatırım, etik tüketim ve döngüsel ekonomi.',
    icon: '🌱',
    items: [
      {
        id: 'green-investing',
        title: 'YEŞİL YATIRIM',
        short: 'Çevreye duyarlı yatırım araçları.',
        body: [
          'Yeşil yatırım, çevresel ve sosyal fayda gözeten finansal araçlara yapılan yatırımdır.',
          'ESG (Çevresel, Sosyal, Yönetişim) kriterleri, bir şirketin sürdürülebilirlik performansını ölçer.',
          'Yeşil tahviller, çevre projelerini finanse etmek için çıkarılır; güneş, rüzgar, enerji verimliliği gibi alanlara yönelir.',
          'Sürdürülebilir fonlar, hem getiri hem de gezegen için çalışan şirketlere yatırım yapar.',
        ],
        scenario: '1.000 TL biriktirdin. Yeşil bir enerji fonu %12 getirirken, kömür şirketi %15 getiriyor. Yeşil fon daha düşük getirili ama gelecekte karbon vergileri kömürü vuracağı için riski de düşük olabilir.',
        qa: [
          { q: 'ESG açılımı nedir?', a: 'Çevresel, Sosyal, Yönetişim (Environmental, Social, Governance).' },
          { q: 'Yeşil tahvil ne işe yarar?', a: 'Çevre projelerini finanse eder; güneş santrali, rüzgar türbini gibi.' },
        ],
        tips: ['Yeşil yatırım araştırırken greenwashing\'e dikkat et — bazı fonlar sadece isim olarak yeşildir.', 'Uzun vadede sürdürülebilir şirketler regülasyon riskine karşı daha dayanıklı olabilir.'],
        warning: 'Yeşil yatırım da risktir. ESG puanı yüksek diye otomatik olarak iyi bir yatırım olduğu anlamına gelmez.',
        video: {
          title: 'Yeşil Yatırım ve Sürdürülebilir Finans',
          url: 'https://finansalokuryazarlik.gov.tr/i/yesil-yatirim-ve-surdurulebilir-finans',
          source: 'finansalokuryazarlik.gov.tr',
        },
      },
      {
        id: 'ethical-consumption',
        title: 'ETİK TÜKETİM',
        short: 'Paranla oy ver.',
        body: [
          'Etik tüketim, satın alırken ürünün çevresel ve sosyal etkisini düşünmektir.',
          'Karbon ayak izi: bir ürünün üretimden tüketime kadar doğaya saldığı karbondioksit miktarı.',
          'Yerel üreticiden alışveriş, uzun nakliye zincirini kısaltarak karbon ayak izini azaltır.',
          'Adil ticaret (fair trade) sertifikalı ürünler, üreticinin emeğinin karşılığını almasını sağlar.',
        ],
        scenario: 'Aynı tişörtün ikisi de 300 TL. Biri bilinmeyen bir marka, diğeri adil ticaret sertifikalı ve organik. Etik olanı seçtiğinde hem çevreye hem işçi haklarına katkıda bulunursun.',
        qa: [
          { q: 'Karbon ayak izi ne demek?', a: 'Bir ürün veya eylemin atmosfere saldığı toplam karbondioksit miktarı.' },
          { q: 'Adil ticaret nedir?', a: 'Üreticilerin adil ücret almasını garanti eden sertifika sistemi.' },
        ],
        tips: ['İhtiyacın olmayan bir şeyi sırf indirimde diye alma — en yeşil ürün hiç üretilmemiş olandır.', 'İkinci el alışveriş ve takas, etik tüketimin en kolay yollarından.'],
      },
      {
        id: 'circular-economy',
        title: 'DÖNGÜSEL EKONOMİ',
        short: 'Atık yok, kaynak var.',
        body: [
          'Döngüsel ekonomi: "al-kullan-at" yerine "azalt-yeniden kullan-geri dönüştür" mantığı.',
          'Lineer ekonomide kaynak tükenir, atık birikir. Döngüselde her şey tekrar kullanılır.',
          'Tamir etme hakkı (right to repair): ürünleri çöpe atmak yerine tamir ederek kullanmaya devam etmek.',
          'Paylaşım ekonomisi (araba paylaşma, kiralık alet) da döngüsel ekonominin bir parçasıdır.',
        ],
        scenario: 'Telefonun bozuldu. Tamiri 2.000 TL, yenisini almak 15.000 TL. Tamir ettirip 2 yıl daha kullanırsan hem cebin kârlı hem de elektronik atık azalır.',
        qa: [
          { q: 'Döngüsel ekonomi lineerden ne farklı?', a: 'Lineer "al-kullan-at"tır; döngüsel kaynakları sürekli döndürür.' },
          { q: 'Tamir etme hakkı neden önemli?', a: 'Ürünleri çöpe atmak yerine kullanmaya devam edebilmek için.' },
        ],
        tips: ['Elektronik atıkların geri dönüşümü için belediyelerin atık merkezlerini kullan.', 'Bir ürünü tamir ettirmenin maliyeti yenisinin %50\'sinden azsa tamir etmek genelde daha mantıklı.'],
        warning: 'Bazı firmalar "yeşil" görünüp aslında çevreye zarar vermeye devam eder (greenwashing). Sertifikalara ve bağımsız raporlara güven.',
      },
    ],
    quiz: generateSustainabilityQuiz(),
  },
];
