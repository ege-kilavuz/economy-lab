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

// Tone goal: clear, short sentences, concrete examples.
// Not financial advice.

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
    quiz: [
      {
        id: 'q1',
        q: 'Enflasyon yükselirse ve maaşın aynı kalırsa en olası sonuç nedir?',
        choices: ['Alım gücü artar', 'Alım gücü düşer', 'Hiç değişmez', 'Kart borcu kapanır'],
        correctIndex: 1,
        explain: 'Fiyatlar artarken gelir aynı kalırsa aynı sepeti almak zorlaşır → alım gücü düşer.',
        relatedItemIds: ['inflation'],
      },
      {
        id: 'q2',
        q: 'Nominal vs reel arasındaki fark nedir?',
        choices: ['İkisi aynı şey', 'Nominal rakam, reel satın alma gücü', 'Reel sadece borç için', 'Nominal sadece yatırım için'],
        correctIndex: 1,
        explain: 'Nominal: TL rakamı. Reel: o parayla ne alabildiğin.',
        relatedItemIds: ['nominal-real'],
      },
      {
        id: 'q3',
        q: 'Bileşik etki ne demektir?',
        choices: ['Sadece anapara büyür', 'Faizin faizi oluşur', 'Faiz hiç işlemez', 'Hep zarar'],
        correctIndex: 1,
        explain: 'Kazanç anaparaya eklenir ve sonraki dönemde onun da getirisi olur.',
        relatedItemIds: ['interest', 'compound'],
      },
      {
        id: 'q4',
        q: 'Volatilite neyi anlatır?',
        choices: ['Fiyatın sabit kalması', 'Fiyatın hızlı/büyük dalgalanması', 'Vergi oranı', 'Maaş günü'],
        correctIndex: 1,
        explain: 'Volatilite, iniş-çıkışın şiddeti/sıklığıdır.',
        relatedItemIds: ['risk'],
      },
      {
        id: 'q5',
        q: 'Likidite yüksekse ne olur?',
        choices: ['Satmak zorlaşır', 'Paraya çevirmek kolaylaşır', 'Faiz düşer', 'Enflasyon biter'],
        correctIndex: 1,
        explain: 'Likidite, paraya hızlı ve az kayıpla dönebilmedir.',
        relatedItemIds: ['liquidity'],
      },
      {
        id: 'q6',
        q: 'Çeşitlendirme neden yapılır?',
        choices: ['Kesin kazanç için', 'Tek kötü olay tüm planı bozmasın diye', 'Faizi sıfırlamak için', 'Enflasyonu bitirmek için'],
        correctIndex: 1,
        explain: 'Amaç garanti kazanç değil; riski tek noktadan yaymaktır.',
        relatedItemIds: ['diversification'],
      },
      {
        id: 'q7',
        q: 'Reel getiri nasıl hesaplanır (yaklaşık)?',
        choices: ['Nominal Getiri + Enflasyon', 'Nominal Getiri - Enflasyon', 'Sadece Maaş', 'Kira / 2'],
        correctIndex: 1,
        explain: 'Paranın değer kaybını (enflasyonu) kazancından düşersen gerçekte ne kazandığını bulursun.',
        relatedItemIds: ['nominal-real', 'inflation'],
      },
      {
        id: 'q8',
        q: 'Acil paraya ihtiyaç duyduğunda hangi varlık türü daha avantajlıdır?',
        choices: ['Düşük likiditeli (Emlak vb.)', 'Yüksek likiditeli (Nakit/Likit Fon)', 'Kripto', 'Antika'],
        correctIndex: 1,
        explain: 'Likit varlıklar hızlıca ve değer kaybı riski daha az şekilde nakde döner.',
        relatedItemIds: ['liquidity'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'Bütçe yaparken en mantıklı sıralama hangisi?',
        choices: ['Önce eğlence', 'Önce zorunlular, sonra hedefler, en son keyif', 'Plan yapma', 'Tüm para kripto'],
        correctIndex: 1,
        explain: 'Zorunlular aksarsa domino etkisi yapar. Önce onları garantiye almak en güvenlisi.',
        relatedItemIds: ['needs-wants', 'cashflow'],
      },
      {
        id: 'q2',
        q: 'Acil durum fonunun ana amacı nedir?',
        choices: ['Hızlı zengin olmak', 'Sürprizde borca girmemek', 'Vergiyi sıfırlamak', 'Herkesin bilmesi'],
        correctIndex: 1,
        explain: 'Acil fon, şoklarda kredi kartına/borca yüklenmeyi azaltır.',
        relatedItemIds: ['emergency'],
      },
      {
        id: 'q3',
        q: '50/30/20 kuralında “20” genelde ne içindir?',
        choices: ['İstekler', 'İhtiyaçlar', 'Birikim/borç kapama', 'Vergi'],
        correctIndex: 2,
        explain: 'Birikim ve borç azaltma için bir pay ayırma fikridir.',
        relatedItemIds: ['50-30-20'],
      },
      {
        id: 'q4',
        q: 'Harcama takibi neden işe yarar?',
        choices: ['Çünkü daha çok harcarsın', 'Çünkü nereye gittiğini görürsün', 'Çünkü faiz düşer', 'Çünkü enflasyon biter'],
        correctIndex: 1,
        explain: 'Paranın nereye gittiğini görürsen düzeltmek kolaylaşır.',
        relatedItemIds: ['tracking'],
      },
      {
        id: 'q5',
        q: '“İhtiyaç” örneği hangisi?',
        choices: ['Kira', 'Yeni oyun almak', 'Sinemaya gitmek', 'Markalı tişört'],
        correctIndex: 0,
        explain: 'Kira, yaşam için zorunlu giderlere örnektir.',
        relatedItemIds: ['needs-wants'],
      },
      {
        id: 'q6',
        q: 'Aboneliklerle ilgili en doğru yaklaşım hangisi?',
        choices: ['Hepsini açık tut', 'Kullanmadıklarını kapat', 'Abonelikler bedava', 'Abonelikler bütçeyi etkilemez'],
        correctIndex: 1,
        explain: 'Küçük ödemeler birikir; kullanmadığın abonelikleri kapatmak hızlı tasarruftur.',
        relatedItemIds: ['subscriptions'],
      },
      {
        id: 'q7',
        q: 'İstekler (Wants) bütçede nerede olmalı?',
        choices: ['Hiç olmamalı', 'Zorunlu giderlerden sonra artan kısımda', 'En başta', 'Borç alınarak yapılmalı'],
        correctIndex: 1,
        explain: 'Keyifli bir hayat için isteklere yer vardır ama önce zorunlu temel ihtiyaçlar karşılanmalıdır.',
        relatedItemIds: ['needs-wants'],
      },
      {
        id: 'q8',
        q: 'Birikime ne zaman başlanmalı?',
        choices: ['Borçlar bitince ve gelir artınca (hemen/düzenli)', 'Emekli olunca', 'Piyasa yükselince', 'Hiçbir zaman'],
        correctIndex: 0,
        explain: 'Küçük de olsa erken ve düzenli başlamak bileşik getirinin gücünü kullanmanı sağlar.',
        relatedItemIds: ['50-30-20', 'goals'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'Asgari ödeme genelde ne yapar?',
        choices: ['Borcu bitirir', 'Borcu uzatır, faiz doğurur', 'Faizi sıfırlar', 'Geliri artırır'],
        correctIndex: 1,
        explain: 'Kalan borca faiz işler; toplam maliyet büyüyebilir.',
        relatedItemIds: ['minpay'],
      },
      {
        id: 'q2',
        q: 'Vade uzarsa genelde hangisi artar?',
        choices: ['Toplam geri ödeme', 'Toplam geri ödeme düşer', 'Faiz işlemez', 'Borç silinir'],
        correctIndex: 0,
        explain: 'Daha uzun süre faiz ödendiği için toplam ödeme çoğu zaman artar.',
        relatedItemIds: ['apr'],
      },
      {
        id: 'q3',
        q: 'Limitin tamamını kullanmak neden riskli olabilir?',
        choices: ['Çünkü para artar', 'Çünkü acil durumda hareket alanın kalmaz', 'Çünkü enflasyon düşer', 'Çünkü kira azalır'],
        correctIndex: 1,
        explain: 'Limit doluysa beklenmedik giderde seçenek azalır.',
        relatedItemIds: ['limit'],
      },
      {
        id: 'q4',
        q: 'Kart borcu varken en riskli davranış hangisi?',
        choices: ['Gereksiz harcamayı kısmak', 'Sürekli yeni harcamayı karta yazmak', 'Düzenli ödeme yapmak', 'Giderleri not almak'],
        correctIndex: 1,
        explain: 'Yeni harcama eklendikçe borç büyür ve faiz maliyeti artar.',
        relatedItemIds: ['minpay', 'late'],
      },
      {
        id: 'q5',
        q: 'Ödeme gecikirse en olası sonuç nedir?',
        choices: ['Borç azalır', 'Ceza/ek maliyet ve stres artar', 'Faiz sıfırlanır', 'Kira otomatik ödenir'],
        correctIndex: 1,
        explain: 'Gecikme genelde ceza/faiz ve ek baskı doğurur.',
        relatedItemIds: ['late'],
      },
      {
        id: 'q6',
        q: 'Borcu azaltmada “en basit” mantık hangisi?',
        choices: ['Hiç bakmamak', 'Her ay düzenli biraz azaltmak', 'Sürekli asgari ödemek', 'Daha çok borç almak'],
        correctIndex: 1,
        explain: 'Düzenli azaltma borç döngüsünü kırmaya yardım eder.',
        relatedItemIds: ['debt-snowball'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'Kur artışı en doğrudan hangi kalemleri etkileyebilir?',
        choices: ['İthal ürün/hammadde', 'Maaşlar otomatik artar', 'Vergiler sıfırlanır', 'Elektrik ücretsiz olur'],
        correctIndex: 0,
        explain: 'İthal girdiler dövizle alındığı için kur artışı maliyete baskı yapabilir.',
        relatedItemIds: ['fx'],
      },
      {
        id: 'q2',
        q: '“Güvenli liman algısı” ne demektir?',
        choices: ['Fiyat asla düşmez', 'Belirsizlikte daha çok tercih edilebilir', 'Kesin kazanç sağlar', 'Devlet garanti verir'],
        correctIndex: 1,
        explain: 'Algı, talebi artırabilir ama garanti değildir.',
        relatedItemIds: ['gold'],
      },
      {
        id: 'q3',
        q: 'Komisyon/spread neden önemlidir?',
        choices: ['Çünkü işlem maliyeti yaratır', 'Çünkü enflasyonu sıfırlar', 'Çünkü maaşı artırır', 'Çünkü borcu siler'],
        correctIndex: 0,
        explain: 'Al-sat yaptıkça küçük maliyetler birikir.',
        relatedItemIds: ['spread-fee'],
      },
      {
        id: 'q4',
        q: 'Kripto varlıklarda en doğru tanım hangisi?',
        choices: ['Hep sabit', 'Genelde yüksek volatil', 'Garanti kazanç', 'Devlet güvenceli'],
        correctIndex: 1,
        explain: 'Kripto varlıklarda iniş-çıkışlar çok sert olabilir.',
        relatedItemIds: ['crypto'],
      },
      {
        id: 'q5',
        q: 'Hisse fiyatını kısa vadede en çok ne oynatabilir?',
        choices: ['Beklenti/haber', 'Sadece kira fiyatı', 'Sadece hava durumu', 'Hiçbir şey'],
        correctIndex: 0,
        explain: 'Kısa vadede haber ve beklenti etkisi büyüktür.',
        relatedItemIds: ['stock-basic'],
      },
      {
        id: 'q6',
        q: '“Çok sık al-sat” yapmanın sakıncası ne olabilir?',
        choices: ['Komisyon/spread maliyeti büyür', 'Enflasyon biter', 'Borç otomatik kapanır', 'Kur sabitlenir'],
        correctIndex: 0,
        explain: 'İşlem maliyetleri birikir ve performansı düşürebilir.',
        relatedItemIds: ['spread-fee'],
      },
      {
        id: 'q7',
        q: 'Hisse senedi sahibi olmak ne anlama gelir?',
        choices: ['Şirkete borç vermek', 'Şirketin ortağı olmak', 'Şirketi yönetmek', 'Devletten alacaklı olmak'],
        correctIndex: 1,
        explain: 'Hisse, o şirketin mülkiyetinin küçük bir parçasına sahip olduğunuzu gösterir.',
        relatedItemIds: ['stock-basic'],
      },
      {
        id: 'q8',
        q: 'Döviz (FX) kurlarındaki hızlı artışın en olası yan etkisi nedir?',
        choices: ['İthal ürün fiyatlarının artması', 'İşsizliğin anında bitmesi', 'Tüm borçların silinmesi', 'Hava durumunun değişmesi'],
        correctIndex: 0,
        explain: 'Maliyet enflasyonu yoluyla fiyatlar üzerinde baskı yaratır.',
        relatedItemIds: ['fx'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'Fitiller genelde neyi gösterir?',
        choices: ['Haberleri', 'En yüksek ve en düşük seviyeleri', 'Sadece kapanışı', 'Komisyonu'],
        correctIndex: 1,
        explain: 'Fitiller, o aralıkta görülen en yüksek ve en düşük fiyatları gösterir.',
        relatedItemIds: ['candle-basic'],
      },
      {
        id: 'q2',
        q: 'Doji neyi anlatır?',
        choices: ['Kesin yükseliş', 'Kesin düşüş', 'Kararsızlık', 'Faiz artışı'],
        correctIndex: 2,
        explain: 'Açılış ve kapanış yakınsa kararsızlık olabilir.',
        relatedItemIds: ['doji'],
      },
      {
        id: 'q3',
        q: 'Yeni başlayan için en önemli şey hangisi?',
        choices: ['Tek mumla işlem', 'Trend ve risk yönetimi', 'Hep en riskli varlık', 'Borçla alım'],
        correctIndex: 1,
        explain: 'Trend + risk yönetimi, formasyonlardan daha temel beceridir.',
        relatedItemIds: ['trend', 'risk-management'],
      },
      {
        id: 'q4',
        q: 'Uzun üst fitil genelde neyi ima edebilir?',
        choices: ['Yukarı denendi ama reddedildi', 'Kesin yükseliş', 'Faiz düştü', 'Komisyon yok'],
        correctIndex: 0,
        explain: 'Uzun üst fitil, yukarı denemede satış gelmiş olabileceğini gösterir.',
        relatedItemIds: ['wick'],
      },
      {
        id: 'q5',
        q: 'Hammer en anlamlı nerede olur?',
        choices: ['Düşüş trendi + destek bölgesi', 'Her zaman', 'Sadece yatayda', 'Faiz kararında'],
        correctIndex: 0,
        explain: 'Düşüş trendinde destek civarı + teyit ile daha anlamlıdır.',
        relatedItemIds: ['hammer'],
      },
      {
        id: 'q6',
        q: 'Risk yönetimi için en doğru cümle hangisi?',
        choices: ['Tek işlemde her şeyi koy', 'Amaç batmamak, riski küçük tutmak', 'Borçla yatırım en iyisi', 'Stop gereksiz'],
        correctIndex: 1,
        explain: 'Risk yönetimi, tek kötü senaryonun oyunu bitirmemesidir.',
        relatedItemIds: ['risk-management'],
      },
      {
        id: 'q7',
        q: 'Trend tersine dönmeden önce ne beklenir?',
        choices: ['Teyit (Onay)', 'Hemen işlem', 'Borç alma', 'Evi satma'],
        correctIndex: 0,
        explain: 'Formasyonlar tek başına yetmez, trendin değiştiğine dair ek onay (teyit) beklenmelidir.',
        relatedItemIds: ['trend', 'doji'],
      },
      {
        id: 'q8',
        q: 'Candlestick grafiklerinde "fitil" neden oluşur?',
        choices: ['Fiyat o seviyeleri görüp geri çekildiği için', 'Hata olduğu için', 'Borsa kapandığı için', 'Vergi geldiği için'],
        correctIndex: 0,
        explain: 'Fiyatın o zaman dilimindeki uç noktalarını (en yüksek/en düşük) temsil eder.',
        relatedItemIds: ['candle-basic', 'wick'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'FOMO etkisi altındaki bir yatırımcı ne yapar?',
        choices: ['Sakin kalır', 'Fiyat uçarken heyecanla en tepeden alır', 'Analiz yapar', 'Hepsini satar'],
        correctIndex: 1,
        explain: 'Başkalarının kazandığını görüp geride kalma korkusuyla riskli alım yapar.',
        relatedItemIds: ['fomo'],
      },
      {
        id: 'q2',
        q: 'FUD ne anlama gelir?',
        choices: ['Finansal Uygunluk Durumu', 'Korku, Belirsizlik ve Şüphe', 'Fiyatın Uçma Durumu', 'Gelecek Tahmini'],
        correctIndex: 1,
        explain: 'Panik ve korku yayan haberlerin yarattığı psikolojik durumdur.',
        relatedItemIds: ['fud'],
      },
      {
        id: 'q3',
        q: 'Kaybetmenin acısı neden tehlikelidir?',
        choices: ['Zararı kabul edemeyip daha çok risk almaya iter', 'Parayı artırır', 'Hiç tehlikeli değil', 'Faizi düşürür'],
        correctIndex: 0,
        explain: 'İnsan beyni zararı sevmez, bu da rasyonel olmayan bekleyişlere yol açar.',
        relatedItemIds: ['loss-aversion'],
      },
      {
        id: 'q4',
        q: 'Duygusal hataları azaltmanın en iyi yolu nedir?',
        choices: ['Daha çok ekrana bakmak', 'Önceden bir plana sahip olmak', 'Başkalarını dinlemek', 'Tüm parayla oynamak'],
        correctIndex: 1,
        explain: 'Piyasa dışındayken yapılan plan, piyasa içindeki duyguları frenler.',
        relatedItemIds: ['patience', 'loss-aversion'],
      },
    ],
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
    quiz: [
      {
        id: 'q1',
        q: 'Telefonda kendini polis/bankacı olarak tanıtıp şifre isteyen birine ne yapılmalı?',
        choices: ['Şifre verilmeli', 'Hemen kapatıp resmî kanaldan doğrulanmalı', 'Para gönderilmeli', 'Dinlenmeli'],
        correctIndex: 1,
        explain: 'Kurumlar asla telefonda şifre istemez. Kapatıp kendiniz aramalısınız.',
        relatedItemIds: ['social-engineering'],
      },
      {
        id: 'q2',
        q: 'Oltalama (Phishing) saldırısının ana belirtisi nedir?',
        choices: ['Resmî bir dil', 'Sahte/şüpheli link ve aciliyet baskısı', 'Ücretsiz hediye', 'Güvenli bağlantı'],
        correctIndex: 1,
        explain: 'Sizi hızlıca bir linke tıklamaya veya bilgi girmeye zorlarlar.',
        relatedItemIds: ['phishing'],
      },
      {
        id: 'q3',
        q: 'Yüksek ve "garanti" kazanç vaat eden sistemlerin riski nedir?',
        choices: ['Ponzi/Dolandırıcılık olma ihtimali çok yüksektir', 'Risk yoktur', 'Devlet garantisidir', 'Zengin eder'],
        correctIndex: 0,
        explain: 'Finansal piyasalarda garanti ve çok yüksek kazanç yan yana gelmez.',
        relatedItemIds: ['ponzi'],
      },
      {
        id: 'q4',
        q: 'Hesap güvenliği için en kritik adım hangisidir?',
        choices: ['Basit şifre koymak', 'İki faktörlü doğrulama (2FA) kullanmak', 'Şifreyi paylaşmak', 'Her yere aynı şifreyi vermek'],
        correctIndex: 1,
        explain: '2FA, şifreniz çalınsa bile hesabınızı korumaya yardımcı olur.',
        relatedItemIds: ['digital-hygiene'],
      },
    ],
  },
];
