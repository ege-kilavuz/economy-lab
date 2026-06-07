import type { LearnCategoryId } from './content';

export type LearningScenario = {
  id: string;
  title: string;
  categoryId: LearnCategoryId;
  summary: string;
  prompt: string;
  check: string[];
  recommendedModule: 'month-sim' | 'inflation' | 'interest' | 'central';
};

export const LEARNING_SCENARIOS: LearningScenario[] = [
  {
    id: 'market-basket-shock',
    title: 'Market Sepeti Şoku',
    categoryId: 'basics',
    summary: 'Aynı maaşla market sepeti 3 ay üst üste pahalanıyor.',
    prompt: 'Öğrenci, nominal maaşı aynı kalırken hangi ürünlerden vazgeçmek zorunda kaldığını ve bunun reel gelirle neden ilgili olduğunu açıklasın.',
    check: ['Nominal vs reel farkını söyle', 'Sepet pahalanınca alım gücü neden düşer?', 'Hangi giderler ertelenebilir?'],
    recommendedModule: 'inflation',
  },
  {
    id: 'phone-breaks',
    title: 'Telefon Bozuldu',
    categoryId: 'budget',
    summary: 'Beklenmedik 8.000 TL masraf çıktı; ay sonuna 12 gün var.',
    prompt: 'Öğrenci, acil durum fonu varsa ve yoksa nasıl iki farklı yol izleneceğini karşılaştırsın.',
    check: ['Acil fon hangi borcu önler?', 'İhtiyaç/istek ayrımı nasıl değişir?', '3-6 aylık fon hedefi neden mantıklı?'],
    recommendedModule: 'month-sim',
  },
  {
    id: 'minimum-payment-trap',
    title: 'Asgari Ödeme Sarmalı',
    categoryId: 'credit',
    summary: 'Kart borcu kapanmıyor; her ay sadece asgari ödeme yapılıyor.',
    prompt: 'Öğrenci, toplam maliyetin neden büyüdüğünü ve borcu azaltmak için sıralı bir planı anlatsın.',
    check: ['Asgari ödeme borcu neden uzatır?', 'Nakit akışı düzelmeden yeni harcama yapılmalı mı?', 'Tam kapatma neden daha sağlıklı?'],
    recommendedModule: 'interest',
  },
  {
    id: 'rate-decision-class',
    title: 'Faiz Kararı Tartışması',
    categoryId: 'macro',
    summary: 'Enflasyon yüksek, büyüme zayıf; politika faizi artırılsın mı?',
    prompt: 'Öğrenci, kısa vadeli acı ile uzun vadeli dengeyi birlikte tartışsın; tek doğru yok, trade-off var.',
    check: ['Enflasyon/büyüme dengesi', 'Arz şoku ile talep şokunu ayır', 'Kararın kazananı ve kaybedeni kim?'],
    recommendedModule: 'central',
  },
  {
    id: 'green-choice',
    title: 'Yeşil mi Yoksa Kârlı mı?',
    categoryId: 'sustainability',
    summary: 'İki yatırım arasında seçim: yüksek getirili kirli enerji vs düşük getirili yeşil fon.',
    prompt: 'Öğrenci, kısa vadeli yüksek getiri ile uzun vadeli sürdürülebilirlik arasındaki trade-off\'u değerlendirsin. ESG kriterlerini ve greenwashing riskini de tartışsın.',
    check: [
      'ESG kriterlerini tanımla',
      'Yeşil yatırımın risklerini say',
      'Greenwashing\'den nasıl kaçınılır?',
    ],
    recommendedModule: 'month-sim',
  },
  {
    id: 'loan-comparison',
    title: 'Hangi Kredi Daha Mantıklı?',
    categoryId: 'credit',
    summary: 'İhtiyaç kredisi vs konut kredisi vs kredi kartı — toplam maliyeti karşılaştır.',
    prompt: 'Öğrenci, aynı borcun farklı kredi türlerinde toplam maliyetini karşılaştırsın.',
    check: ['Kredi türlerini karşılaştır', 'Toplam maliyeti hesapla', 'Kefilli-kefilsiz farkı'],
    recommendedModule: 'interest',
  },
  {
    id: 'portfolio-build',
    title: 'Portföyünü Oluştur',
    categoryId: 'investing',
    summary: '100.000 TL ile 5 yıllık yatırım portföyü planı yap.',
    prompt: 'Risk toleransına göre hisse/tahvil/altın/nakit dağılımı yap. Temettüyü de hesapla.',
    check: ['Varlık sınıflarını karşılaştır', 'Temettü verimini hesapla', 'Çeşitlendirmeyi açıkla'],
    recommendedModule: 'month-sim',
  },
  {
    id: 'psychological-traps',
    title: 'Psikolojik Tuzaklar',
    categoryId: 'psychology',
    summary: 'FOMO, çıpalama, aşırı güven ve kayıptan kaçınma ile mücadele.',
    prompt: 'Her psikolojik tuzağı tanımla ve korunma stratejilerini açıkla.',
    check: ['FOMO ve ankraj farkını açıkla', 'Aşırı güven neden tehlikeli?', '3 korunma stratejisi say'],
    recommendedModule: 'month-sim',
  },
  {
    id: 'smart-goal',
    title: 'SMART Hedef Belirle',
    categoryId: 'budget',
    summary: '20.000 TL aylık gelir. 1 yılda 50.000 TL birikim mümkün mü?',
    prompt: 'Hedefi SMART kriterlerine göre değerlendir. 50/30/20 kuralını uygula.',
    check: ['Hedef SMART mi?', '50/30/20 ile aylık ne kadar birikir?', 'Nasıl revize edersin?'],
    recommendedModule: 'month-sim',
  },
];
