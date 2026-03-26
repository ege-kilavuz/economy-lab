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
];
